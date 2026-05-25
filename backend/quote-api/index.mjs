/**
 * Quote API Lambda — handles 5 routes via API Gateway v2 (HTTP API) proxy.
 *
 *   POST /quote/questions     { description, locale }              → { jobId }
 *   POST /quote/estimate      { description, answers, locale }     → { jobId }
 *   GET  /quote/jobs/{jobId}                                       → job state
 *   POST /quote/submit        { jobId, name, email, message? }     → { ok: true }
 *   GET  /admin/quotes?key=…                                       → text/html
 */

import { randomUUID } from "node:crypto";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const JOBS_TABLE = process.env.JOBS_TABLE;
const SUBMISSIONS_TABLE = process.env.SUBMISSIONS_TABLE;
const SQS_QUEUE_URL = process.env.SQS_QUEUE_URL;
const SNS_TOPIC_ARN = process.env.SNS_TOPIC_ARN;
const ADMIN_KEY = process.env.ADMIN_KEY;
const SITE_DOMAIN = process.env.SITE_DOMAIN || "valiunas.dev";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const sqs = new SQSClient({});
const sns = new SNSClient({});

const JOB_TTL_SECONDS = 24 * 60 * 60;
const MAX_DESCRIPTION = 4000;
const MAX_MESSAGE = 4000;
const MIN_DESCRIPTION = 12;

export const handler = async (event) => {
  const route = event.routeKey;
  try {
    switch (route) {
      case "POST /quote/questions":
        return await startQuestionsJob(parseBody(event));
      case "POST /quote/estimate":
        return await startEstimateJob(parseBody(event));
      case "GET /quote/jobs/{jobId}":
        return await getJob(event.pathParameters?.jobId);
      case "POST /quote/submit":
        return await submit(parseBody(event));
      case "GET /admin/quotes":
        return await adminPage(event.queryStringParameters);
      default:
        return json(404, { error: "Not found" });
    }
  } catch (err) {
    console.error(`[QuoteApi] ${route}:`, err);
    return json(500, { error: "Internal error" });
  }
};

// --- Route handlers ----------------------------------------------------------

async function startQuestionsJob({ description, locale }) {
  const err = validateDescription(description);
  if (err) return json(400, { error: err });

  const job = await createJob({
    type: "questions",
    request: { description: description.trim(), locale: locale || "en" },
  });
  await sqs.send(new SendMessageCommand({
    QueueUrl: SQS_QUEUE_URL,
    MessageBody: JSON.stringify({ jobId: job.jobId }),
  }));
  return json(202, { jobId: job.jobId });
}

async function startEstimateJob({ description, answers, questions, locale }) {
  const err = validateDescription(description);
  if (err) return json(400, { error: err });
  if (!answers || typeof answers !== "object") {
    return json(400, { error: "Answers required." });
  }

  // Persist the questions array alongside the answers so we can resolve answer
  // values back to human-readable labels at submission time.
  const safeQuestions = Array.isArray(questions) ? questions : [];

  const job = await createJob({
    type: "estimate",
    request: {
      description: description.trim(),
      answers,
      questions: safeQuestions,
      locale: locale || "en",
    },
  });
  await sqs.send(new SendMessageCommand({
    QueueUrl: SQS_QUEUE_URL,
    MessageBody: JSON.stringify({ jobId: job.jobId }),
  }));
  return json(202, { jobId: job.jobId });
}

async function getJob(jobId) {
  if (!jobId || !isUuid(jobId)) return json(400, { error: "Invalid jobId" });

  const { Item } = await ddb.send(new GetCommand({
    TableName: JOBS_TABLE,
    Key: { jobId },
  }));
  if (!Item) return json(404, { error: "Job not found" });

  return json(200, {
    jobId: Item.jobId,
    type: Item.type,
    status: Item.status,
    response: Item.response ?? null,
    error: Item.error ?? null,
  });
}

async function submit({ jobId, name, email, message }) {
  if (!jobId || !isUuid(jobId)) return json(400, { error: "Invalid jobId" });
  if (!name || typeof name !== "string" || name.trim().length < 1)
    return json(400, { error: "Name required" });
  if (!email || typeof email !== "string" || !email.includes("@"))
    return json(400, { error: "Valid email required" });
  if (message && message.length > MAX_MESSAGE)
    return json(400, { error: "Message too long" });

  const { Item: job } = await ddb.send(new GetCommand({
    TableName: JOBS_TABLE,
    Key: { jobId },
  }));
  if (!job) return json(404, { error: "Job not found" });

  const submissionId = randomUUID();
  const createdAt = new Date().toISOString();
  const answers = job.request?.answers ?? {};
  const questions = job.request?.questions ?? [];

  const submission = {
    submissionId,
    all: "all", // GSI partition
    createdAt,
    name: name.trim().slice(0, 200),
    email: email.trim().slice(0, 200),
    message: (message || "").trim().slice(0, MAX_MESSAGE),
    jobId,
    jobType: job.type,
    description: job.request?.description ?? "",
    answers,
    qa: resolveQa(questions, answers),
    locale: job.request?.locale ?? "en",
    estimate: job.response ?? null,
  };
  await ddb.send(new PutCommand({
    TableName: SUBMISSIONS_TABLE,
    Item: submission,
  }));

  // Notify
  await sns.send(new PublishCommand({
    TopicArn: SNS_TOPIC_ARN,
    Subject: `New quote request from ${submission.name}`,
    Message: formatSnsMessage(submission),
  })).catch((e) => console.error("[QuoteApi] SNS publish failed:", e));

  return json(201, { ok: true, submissionId });
}

async function adminPage(qs) {
  const key = qs?.key || "";
  if (!ADMIN_KEY || key !== ADMIN_KEY) {
    return {
      statusCode: 401,
      headers: { "content-type": "text/html; charset=utf-8" },
      body: `<!doctype html><html><body style="font-family:sans-serif;padding:40px"><h1>401 Unauthorized</h1></body></html>`,
    };
  }

  const { Items = [] } = await ddb.send(new QueryCommand({
    TableName: SUBMISSIONS_TABLE,
    IndexName: "by-created-at",
    KeyConditionExpression: "#a = :all",
    ExpressionAttributeNames: { "#a": "all" },
    ExpressionAttributeValues: { ":all": "all" },
    ScanIndexForward: false, // newest first
    Limit: 200,
  }));

  return {
    statusCode: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    },
    body: renderAdminHtml(Items),
  };
}

// --- Helpers -----------------------------------------------------------------

function validateDescription(d) {
  if (typeof d !== "string") return "Description must be a string";
  const trimmed = d.trim();
  if (trimmed.length < MIN_DESCRIPTION) return "Description too short";
  if (trimmed.length > MAX_DESCRIPTION) return "Description too long";
  return null;
}

async function createJob({ type, request }) {
  const jobId = randomUUID();
  const now = Math.floor(Date.now() / 1000);
  const item = {
    jobId,
    type,
    status: "pending",
    request,
    createdAt: new Date().toISOString(),
    expiresAt: now + JOB_TTL_SECONDS,
  };
  await ddb.send(new PutCommand({ TableName: JOBS_TABLE, Item: item }));
  return item;
}

function parseBody(event) {
  if (!event.body) return {};
  try {
    const decoded = event.isBase64Encoded
      ? Buffer.from(event.body, "base64").toString("utf-8")
      : event.body;
    return JSON.parse(decoded);
  } catch {
    return {};
  }
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  };
}

function isUuid(s) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

function formatSnsMessage(s) {
  const lines = [
    `New quote request from your CV site (${SITE_DOMAIN})`,
    "",
    `Name:    ${s.name}`,
    `Email:   ${s.email}`,
    `When:    ${s.createdAt}`,
    `Locale:  ${s.locale}`,
    "",
    `Description:`,
    s.description,
  ];
  if (s.message) lines.push("", `Their message:`, s.message);
  if (s.estimate) {
    lines.push(
      "",
      `Estimate shown:  €${s.estimate.low ?? "?"} – €${s.estimate.high ?? "?"}`,
      `Timeline shown:  ${s.estimate.timeline ?? "?"}`,
    );
  }
  if (Array.isArray(s.qa) && s.qa.length) {
    lines.push("", `Q&A:`);
    for (const qa of s.qa) {
      lines.push(`  Q: ${qa.questionText}`, `  A: ${qa.answerLabel}`, "");
    }
  }
  lines.push(
    `View all submissions: https://${SITE_DOMAIN}/api/admin/quotes?key=...`,
  );
  return lines.join("\n");
}

/**
 * Resolve raw answer values (e.g. { timeline: "normal" }) into human-readable
 * Q&A pairs (e.g. { questionText: "What's your timeline?",
 * answerLabel: "Normal — about a month" }) using the original questions array.
 */
function resolveQa(questions, answers) {
  if (!Array.isArray(questions) || !answers || typeof answers !== "object") return [];
  const qa = [];
  // Preserve the original question order
  for (const q of questions) {
    const value = answers[q.id];
    if (value === undefined || value === null || value === "") continue;
    let answerLabel = String(value);
    if (q.type === "choice" && Array.isArray(q.options)) {
      const opt = q.options.find((o) => o.value === value);
      if (opt && opt.label) answerLabel = opt.label;
    }
    qa.push({
      id: q.id,
      questionText: q.text || q.id,
      value: String(value),
      answerLabel,
    });
  }
  // Include any answers whose question we no longer have (shouldn't happen, but
  // be defensive so nothing silently goes missing).
  for (const [id, value] of Object.entries(answers)) {
    if (qa.find((x) => x.id === id)) continue;
    qa.push({
      id,
      questionText: id,
      value: String(value),
      answerLabel: String(value),
    });
  }
  return qa;
}

// --- Admin HTML --------------------------------------------------------------

function renderAdminHtml(items) {
  const rows = items.map(renderRow).join("\n");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Quote submissions — ${escapeHtml(SITE_DOMAIN)}</title>
<style>
  :root {
    --accent:#e91e63; --ink:#111; --muted:#555; --line:#e5e5e5; --bg:#fafafa; --card:#fff;
  }
  * { box-sizing: border-box; }
  body { margin:0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: var(--bg); color: var(--ink); line-height:1.5; }
  header { background: var(--accent); color:#fff; padding:14px 24px; box-shadow:0 2px 4px rgba(0,0,0,0.15); }
  header h1 { margin:0; font-size:1.15rem; font-weight:600; }
  main { max-width: 980px; margin: 30px auto; padding: 0 20px; }
  .summary { color: var(--muted); font-size: 0.92rem; margin-bottom:18px; }
  .row { background: var(--card); border-radius:10px; box-shadow:0 1px 3px rgba(0,0,0,0.06), 0 6px 18px rgba(0,0,0,0.05); margin-bottom:14px; overflow:hidden; }
  details > summary { padding: 14px 18px; cursor:pointer; list-style:none; display:flex; gap:18px; align-items:center; justify-content:space-between; }
  details > summary::-webkit-details-marker { display:none; }
  .who { font-weight:600; }
  .email { color: var(--muted); font-size:0.88rem; }
  .when { color: var(--muted); font-size:0.82rem; }
  .badge { display:inline-block; background: var(--ink); color:#fff; font-size:0.68rem; padding:2px 8px; border-radius:10px; text-transform:uppercase; letter-spacing:0.6px; font-weight:700; margin-right:6px; }
  .badge.q { background:#6f4ea8; }
  .badge.e { background:#1f6f3b; }
  .detail { padding: 4px 18px 18px; border-top: 1px solid var(--line); font-size:0.92rem; }
  .detail h3 { margin: 14px 0 6px; font-size:0.78rem; text-transform:uppercase; letter-spacing:1.2px; color: var(--muted); }
  .detail pre { background:#f5f5f5; padding:10px 12px; border-radius:6px; font-size:0.85rem; white-space:pre-wrap; word-wrap:break-word; margin:0; }
  .detail .kv { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size:0.82rem; color: var(--muted); }
  .qa { margin:0; padding:6px 0 0; }
  .qa dt { font-weight:600; color: var(--ink); font-size:0.88rem; margin-top:8px; }
  .qa dt:first-of-type { margin-top:0; }
  .qa dd { margin: 2px 0 0; padding: 4px 10px; background:#f5f5f5; border-radius:4px; font-size:0.88rem; color: var(--muted); display:inline-block; }
  .empty { color: var(--muted); text-align:center; padding:60px 0; }
</style>
</head>
<body>
<header><h1>Quote submissions</h1></header>
<main>
  <div class="summary">${items.length} submission${items.length === 1 ? "" : "s"} · newest first</div>
  ${items.length === 0 ? `<div class="empty">No submissions yet.</div>` : rows}
</main>
</body>
</html>`;
}

function renderRow(s) {
  const badge = s.jobType === "estimate"
    ? `<span class="badge e">Estimate</span>`
    : `<span class="badge q">Questions</span>`;
  const est = s.estimate
    ? `€${escapeHtml(String(s.estimate.low ?? "?"))} – €${escapeHtml(String(s.estimate.high ?? "?"))}`
    : "—";

  const qaHtml = Array.isArray(s.qa) && s.qa.length
    ? `<dl class="qa">${
        s.qa.map((qa) => `
          <dt>${escapeHtml(qa.questionText)}</dt>
          <dd>${escapeHtml(qa.answerLabel)}</dd>
        `).join("")
      }</dl>`
    : `<pre class="kv">(no answers recorded)</pre>`;

  return `
<div class="row">
  <details>
    <summary>
      <div>
        ${badge}
        <span class="who">${escapeHtml(s.name)}</span>
        <span class="email">&lt;${escapeHtml(s.email)}&gt;</span>
      </div>
      <div class="when">${escapeHtml(s.createdAt)}</div>
    </summary>
    <div class="detail">
      <h3>Description</h3>
      <pre>${escapeHtml(s.description)}</pre>
      ${s.message ? `<h3>Their message</h3><pre>${escapeHtml(s.message)}</pre>` : ""}
      <h3>Q&amp;A</h3>
      ${qaHtml}
      <h3>Estimate shown</h3>
      <pre class="kv">${est}${s.estimate?.timeline ? `\nTimeline: ${escapeHtml(s.estimate.timeline)}` : ""}${s.estimate?.summary ? `\nSummary: ${escapeHtml(s.estimate.summary)}` : ""}</pre>
      <h3>Meta</h3>
      <pre class="kv">submissionId: ${escapeHtml(s.submissionId)}
jobId:        ${escapeHtml(s.jobId)}
locale:       ${escapeHtml(s.locale)}</pre>
    </div>
  </details>
</div>`;
}

function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
