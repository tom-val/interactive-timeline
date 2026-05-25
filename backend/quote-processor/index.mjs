/**
 * Quote Processor Lambda.
 *
 * SQS event → reads job from DDB → calls OpenAI Responses API
 *   → writes status='completed' + response back to DDB
 *   (or status='failed' + error)
 *
 * Same shape as the recipes project's ai-processor, so the deployment story
 * stays consistent.
 */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { SYSTEM_QUESTIONS, SYSTEM_ESTIMATE } from "./prompts.mjs";

const JOBS_TABLE = process.env.JOBS_TABLE;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const handler = async (event) => {
  for (const record of event.Records) {
    const { jobId } = JSON.parse(record.body);
    console.log(`[QuoteProcessor] Job ${jobId}`);

    try {
      const job = await getJob(jobId);
      if (!job) {
        console.warn(`[QuoteProcessor] Job ${jobId} not found, skipping.`);
        continue;
      }
      if (job.status !== "pending") {
        console.warn(`[QuoteProcessor] Job ${jobId} status=${job.status}, skipping.`);
        continue;
      }

      const response = job.type === "questions"
        ? await runQuestions(job.request)
        : await runEstimate(job.request);

      await completeJob(jobId, response);
      console.log(`[QuoteProcessor] Job ${jobId} completed.`);
    } catch (err) {
      console.error(`[QuoteProcessor] Job ${jobId} failed:`, err);
      await failJob(jobId, err.message ?? "Unknown error").catch(() => {});
    }
  }
};

// --- OpenAI calls -----------------------------------------------------------

async function runQuestions({ description, locale }) {
  const userText = `Locale: ${locale}\n\nProject description:\n${description}`;
  const parsed = await callOpenAi(SYSTEM_QUESTIONS, userText);
  if (!Array.isArray(parsed.questions)) {
    throw new Error("Model returned no questions array");
  }
  // Pass through; frontend tolerates the shape via TS type assertions.
  return parsed;
}

async function runEstimate({ description, answers, locale }) {
  const userText = [
    `Locale: ${locale}`,
    "",
    `Project description:`,
    description,
    "",
    `Client's answers:`,
    Object.entries(answers || {})
      .map(([k, v]) => `  ${k}: ${v}`)
      .join("\n") || "(none)",
  ].join("\n");

  const parsed = await callOpenAi(SYSTEM_ESTIMATE, userText);
  if (typeof parsed.low !== "number" || typeof parsed.high !== "number") {
    throw new Error("Model returned invalid estimate (missing low/high)");
  }
  return parsed;
}

async function callOpenAi(systemPrompt, userText) {
  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      instructions: systemPrompt,
      input: [{ role: "user", content: userText }],
      text: { format: { type: "json_object" } },
      max_output_tokens: 4000,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI ${res.status}: ${text.slice(0, 500)}`);
  }
  const data = await res.json();
  const outputText = data.output_text ?? extractOutputText(data);
  if (!outputText) throw new Error("Empty response from OpenAI");
  return JSON.parse(extractJson(outputText));
}

function extractOutputText(data) {
  if (!data.output || !Array.isArray(data.output)) return null;
  for (const item of data.output) {
    if (item.type === "message" && Array.isArray(item.content)) {
      for (const part of item.content) {
        if (part.type === "output_text" && part.text) return part.text;
      }
    }
  }
  return null;
}

function extractJson(text) {
  const trimmed = text.trim();
  // Strip ```json … ``` fences if present
  const fenceStart = trimmed.indexOf("```");
  if (fenceStart >= 0) {
    const contentStart = trimmed.indexOf("\n", fenceStart) + 1;
    const contentEnd = trimmed.indexOf("```", contentStart);
    if (contentEnd > contentStart) return trimmed.slice(contentStart, contentEnd).trim();
  }
  // Fall back to first `{` to last `}`
  const braceStart = trimmed.indexOf("{");
  const braceEnd = trimmed.lastIndexOf("}");
  if (braceStart >= 0 && braceEnd > braceStart) {
    return trimmed.slice(braceStart, braceEnd + 1);
  }
  return trimmed;
}

// --- DDB helpers ------------------------------------------------------------

async function getJob(jobId) {
  const { Item } = await ddb.send(new GetCommand({
    TableName: JOBS_TABLE,
    Key: { jobId },
  }));
  return Item ?? null;
}

async function completeJob(jobId, response) {
  await ddb.send(new UpdateCommand({
    TableName: JOBS_TABLE,
    Key: { jobId },
    UpdateExpression: "SET #s = :s, #r = :r, completedAt = :t",
    ExpressionAttributeNames: { "#s": "status", "#r": "response" },
    ExpressionAttributeValues: {
      ":s": "completed",
      ":r": response,
      ":t": new Date().toISOString(),
    },
  }));
}

async function failJob(jobId, error) {
  await ddb.send(new UpdateCommand({
    TableName: JOBS_TABLE,
    Key: { jobId },
    UpdateExpression: "SET #s = :s, #e = :e, completedAt = :t",
    ExpressionAttributeNames: { "#s": "status", "#e": "error" },
    ExpressionAttributeValues: {
      ":s": "failed",
      ":e": String(error).slice(0, 1000),
      ":t": new Date().toISOString(),
    },
  }));
}
