/**
 * Quote estimator service.
 *
 * Talks to the backend API which produces clarifying questions and final
 * estimates via an SQS-backed OpenAI processor. UI calls `generateQuestions`
 * and `generateEstimate`; both kick off a job and poll until it's done.
 *
 *   POST /api/quote/questions  { description, locale }              → { jobId }
 *   POST /api/quote/estimate   { description, answers, locale }     → { jobId }
 *   GET  /api/quote/jobs/:jobId                                     → job state
 *   POST /api/quote/submit     { jobId, name, email, message? }     → { ok }
 */

const API_BASE = import.meta.env.PUBLIC_QUOTE_API_URL || '/api'

export type QuestionId = string

export interface ChoiceOption {
    value: string
    label: string
}

export interface ClarifyingQuestion {
    id: QuestionId
    text: string
    type: 'choice' | 'text'
    options?: ChoiceOption[]
    placeholder?: string
}

export type Answers = Record<string, string>

export interface BreakdownItem {
    label: string
    value: number | null
    mult?: number
}

export interface QuoteEstimate {
    low: number
    high: number
    timeline: string
    summary: string
    /** Optional short comment from the AI (e.g. flagging massive scope). */
    note?: string
    items: BreakdownItem[]
}

interface JobResponse<T> {
    jobId: string
    type: 'questions' | 'estimate'
    status: 'pending' | 'completed' | 'failed'
    response: T | null
    error: string | null
}

interface QuestionsJobResponse {
    questions: ClarifyingQuestion[]
}

const POLL_INTERVAL_MS = 3000
const POLL_TIMEOUT_MS = 60_000

// -------- Public API ---------------------------------------------------------

export async function generateQuestions(
    description: string,
    locale: string,
    signal?: AbortSignal
): Promise<ClarifyingQuestion[]> {
    const { jobId } = await startJob('questions', { description, locale }, signal)
    const job = await pollJob<QuestionsJobResponse>(jobId, signal)
    if (!job.response || !Array.isArray(job.response.questions)) {
        throw new Error('No questions returned by AI')
    }
    return job.response.questions
}

export async function generateEstimate(
    description: string,
    answers: Answers,
    questions: ClarifyingQuestion[],
    locale: string,
    signal?: AbortSignal
): Promise<QuoteEstimate> {
    const { jobId } = await startJob(
        'estimate',
        { description, answers, questions, locale },
        signal
    )
    const job = await pollJob<QuoteEstimate>(jobId, signal)
    if (!job.response) throw new Error('No estimate returned by AI')
    // The frontend keeps a `jobId` for the submission step:
    ;(job.response as QuoteEstimate & { jobId?: string }).jobId = jobId
    return job.response
}

export async function submitContact(payload: {
    jobId: string
    name: string
    email: string
    message?: string
}): Promise<{ ok: true }> {
    const res = await fetch(`${API_BASE}/quote/submit`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
    })
    if (!res.ok) {
        const data = await safeJson(res)
        throw new Error(data?.error || `Submit failed (${res.status})`)
    }
    return { ok: true }
}

// -------- Internals ----------------------------------------------------------

async function startJob(
    kind: 'questions' | 'estimate',
    body: object,
    signal?: AbortSignal
): Promise<{ jobId: string }> {
    const res = await fetch(`${API_BASE}/quote/${kind}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
        signal,
    })
    if (!res.ok) {
        const data = await safeJson(res)
        throw new Error(data?.error || `Failed to start ${kind} job (${res.status})`)
    }
    const data = (await res.json()) as { jobId: string }
    if (!data.jobId) throw new Error('Backend did not return a jobId')
    return data
}

async function pollJob<T>(
    jobId: string,
    signal?: AbortSignal
): Promise<JobResponse<T>> {
    const started = Date.now()
    while (true) {
        if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')
        if (Date.now() - started > POLL_TIMEOUT_MS) {
            throw new Error('AI request timed out — please try again')
        }
        await delay(POLL_INTERVAL_MS, signal)

        const res = await fetch(`${API_BASE}/quote/jobs/${jobId}`, { signal })
        if (!res.ok) {
            // Transient — keep polling until we hit the timeout.
            continue
        }
        const job = (await res.json()) as JobResponse<T>
        if (job.status === 'completed') return job
        if (job.status === 'failed') {
            throw new Error(job.error || 'AI request failed')
        }
        // status === 'pending' → keep polling
    }
}

function delay(ms: number, signal?: AbortSignal): Promise<void> {
    return new Promise((resolve, reject) => {
        const t = setTimeout(resolve, ms)
        signal?.addEventListener('abort', () => {
            clearTimeout(t)
            reject(new DOMException('Aborted', 'AbortError'))
        })
    })
}

async function safeJson(res: Response): Promise<any> {
    try {
        return await res.json()
    } catch {
        return null
    }
}
