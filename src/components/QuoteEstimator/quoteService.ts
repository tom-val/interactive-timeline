/**
 * Quote estimator service.
 *
 * The two exported functions below currently return mocked results so the UI
 * works end-to-end. When the AWS Lambda endpoint is ready, replace the bodies
 * with `fetch()` calls — the input/output shapes are the contract.
 *
 *   POST /api/quote/questions  { description, locale }
 *     → { questions: ClarifyingQuestion[] }
 *
 *   POST /api/quote/estimate   { description, answers, locale }
 *     → QuoteEstimate
 */

import type { TFunction } from 'i18next'

export type QuestionId =
    | 'type'
    | 'payments'
    | 'auth'
    | 'admin'
    | 'integrations'
    | 'timeline'
    | 'design'

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

export type Answers = Partial<Record<QuestionId, string>>

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
    items: BreakdownItem[]
}

// -------- Mocked AI: questions --------
export async function generateQuestions(
    description: string,
    t: TFunction
): Promise<ClarifyingQuestion[]> {
    await delay(900) // Simulated latency

    const text = description.toLowerCase()
    const qs: ClarifyingQuestion[] = []

    qs.push(buildChoice('type', t, ['landing', 'webapp', 'ecom', 'dashboard']))

    if (/(pay|checkout|stripe|montonio|deposit|subscription|card|sell|buy|shop|store|marketplace|product)/.test(text)) {
        qs.push(
            buildChoice('payments', t, ['none', 'oneoff', 'subs', 'marketplace'])
        )
    }
    if (/(user|account|login|sign[ -]?up|profile|auth|member)/.test(text)) {
        qs.push(buildChoice('auth', t, ['none', 'simple', 'roles']))
    }
    if (/(admin|manage|backoffice|back[ -]office|moderation|dashboard|approve|review)/.test(text)) {
        qs.push(buildChoice('admin', t, ['none', 'basic', 'rich']))
    }
    if (/(integrat|api|webhook|sync|shipping|email|notify|slack|crm|sheet)/.test(text)) {
        qs.push({
            id: 'integrations',
            text: t('quote.questions.integrations.text'),
            type: 'text',
            placeholder: t('quote.questions.integrations.placeholder'),
        })
    }

    qs.push(buildChoice('timeline', t, ['relaxed', 'normal', 'rush']))
    qs.push(buildChoice('design', t, ['bring', 'basic', 'custom']))

    return qs
}

// -------- Mocked AI: estimate --------
export async function generateEstimate(
    description: string,
    answers: Answers,
    questions: ClarifyingQuestion[],
    t: TFunction
): Promise<QuoteEstimate> {
    await delay(1100) // Simulated latency

    const BASE: Record<string, number> = {
        landing: 500,
        webapp: 2000,
        ecom: 3500,
        dashboard: 2500,
    }
    const PAY: Record<string, number> = {
        none: 0,
        oneoff: 1200,
        subs: 1600,
        marketplace: 2500,
    }
    const AUTH: Record<string, number> = { none: 0, simple: 700, roles: 1200 }
    const ADM: Record<string, number> = { none: 0, basic: 800, rich: 1800 }
    const DES: Record<string, number> = { bring: 0, basic: 300, custom: 1200 }
    const URG: Record<string, number> = {
        relaxed: 0.95,
        normal: 1.0,
        rush: 1.35,
    }
    const TL: Record<string, Record<string, string>> = {
        landing: {
            relaxed: '3–5 weeks',
            normal: '2–3 weeks',
            rush: '1–2 weeks',
        },
        webapp: {
            relaxed: '8–12 weeks',
            normal: '5–8 weeks',
            rush: '3–5 weeks',
        },
        ecom: {
            relaxed: '12–18 weeks',
            normal: '8–12 weeks',
            rush: '5–8 weeks',
        },
        dashboard: {
            relaxed: '8–10 weeks',
            normal: '5–8 weeks',
            rush: '3–5 weeks',
        },
    }

    const type = (answers.type as keyof typeof BASE) || 'webapp'
    const urgency = answers.timeline || 'normal'
    const design = answers.design || 'basic'

    const items: BreakdownItem[] = []
    let total = BASE[type] ?? 2000
    items.push({
        label: t('quote.breakdown.base', { type: labelFor('type', type, questions) }),
        value: total,
    })

    if (answers.payments && PAY[answers.payments]) {
        const v = PAY[answers.payments]
        total += v
        items.push({
            label: t('quote.breakdown.payments', {
                label: labelFor('payments', answers.payments, questions),
            }),
            value: v,
        })
    }
    if (answers.auth && AUTH[answers.auth]) {
        const v = AUTH[answers.auth]
        total += v
        items.push({
            label: t('quote.breakdown.auth', {
                label: labelFor('auth', answers.auth, questions),
            }),
            value: v,
        })
    }
    if (answers.admin && ADM[answers.admin]) {
        const v = ADM[answers.admin]
        total += v
        items.push({
            label: t('quote.breakdown.admin', {
                label: labelFor('admin', answers.admin, questions),
            }),
            value: v,
        })
    }
    if (answers.integrations && answers.integrations.trim()) {
        const count = answers.integrations
            .split(/[,;]+/)
            .filter((s: string) => s.trim()).length
        const v = count * 400
        total += v
        items.push({
            label: t('quote.breakdown.integrations', { count }),
            value: v,
        })
    }
    if (DES[design]) {
        total += DES[design]
        items.push({
            label: t('quote.breakdown.design', {
                label: labelFor('design', design, questions),
            }),
            value: DES[design],
        })
    }

    const urgencyMult = URG[urgency] ?? 1
    if (urgencyMult !== 1) {
        items.push({
            label: t('quote.breakdown.timelineMod', {
                urgency,
                mult: urgencyMult,
            }),
            value: null,
            mult: urgencyMult,
        })
        total *= urgencyMult
    }

    const low = Math.max(300, Math.round((total * 0.9) / 100) * 100)
    const high = Math.round((total * 1.35) / 100) * 100
    const timeline = (TL[type] ?? TL.webapp)[urgency] || '—'
    const summary = `${labelFor('type', type, questions)} · ${urgency} · ${design}`

    return { low, high, timeline, summary, items }
}

// -------- Helpers --------
function buildChoice(
    id: QuestionId,
    t: TFunction,
    optionKeys: string[]
): ClarifyingQuestion {
    return {
        id,
        text: t(`quote.questions.${id}.text`),
        type: 'choice',
        options: optionKeys.map((k) => ({
            value: k,
            label: t(`quote.questions.${id}.options.${k}`),
        })),
    }
}

function labelFor(
    qid: QuestionId,
    value: string,
    questions: ClarifyingQuestion[]
): string {
    const q = questions.find((x) => x.id === qid)
    if (!q || q.type !== 'choice') return value
    const opt = q.options?.find((o) => o.value === value)
    return opt ? opt.label : value
}

function delay(ms: number) {
    return new Promise<void>((r) => setTimeout(r, ms))
}
