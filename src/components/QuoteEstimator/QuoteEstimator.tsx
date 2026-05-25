import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
    Answers,
    ClarifyingQuestion,
    QuoteEstimate,
    generateEstimate,
    generateQuestions,
} from './quoteService'

import './QuoteEstimator.css'

type Phase = 'idle' | 'thinking-q' | 'questions' | 'thinking-e' | 'estimate'

export default function QuoteEstimator() {
    const { t } = useTranslation()
    const [phase, setPhase] = useState<Phase>('idle')
    const [description, setDescription] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [questions, setQuestions] = useState<ClarifyingQuestion[]>([])
    const [answers, setAnswers] = useState<Answers>({})
    const [estimate, setEstimate] = useState<QuoteEstimate | null>(null)

    const allChoiceAnswered = useMemo(() => {
        const choiceQs = questions.filter((q) => q.type === 'choice')
        return choiceQs.length > 0 && choiceQs.every((q) => !!answers[q.id])
    }, [questions, answers])

    async function onAskQuestions() {
        const desc = description.trim()
        if (desc.length < 12) {
            setError(t('quote.tooShort'))
            return
        }
        setError(null)
        setEstimate(null)
        setAnswers({})
        setPhase('thinking-q')
        const qs = await generateQuestions(desc, t)
        setQuestions(qs)
        setPhase('questions')
    }

    async function onGetEstimate() {
        setPhase('thinking-e')
        const r = await generateEstimate(description, answers, questions, t)
        setEstimate(r)
        setPhase('estimate')
    }

    function onReset() {
        setPhase('idle')
        setDescription('')
        setError(null)
        setQuestions([])
        setAnswers({})
        setEstimate(null)
    }

    function onAnswer(qid: string, value: string) {
        setAnswers((prev) => ({ ...prev, [qid]: value }))
    }

    const emailHref = useMemo(() => {
        if (!estimate) return 'mailto:tomas@valiunas.dev'
        const body =
            `Hi Tomas,\n\nI just used the AI quote estimator on your site.\n\n` +
            `Description:\n${description}\n\n` +
            `My answers:\n${Object.entries(answers)
                .map(([k, v]) => `- ${k}: ${v}`)
                .join('\n')}\n\n` +
            `Estimate shown: €${estimate.low.toLocaleString(
                'en-US'
            )} – €${estimate.high.toLocaleString('en-US')}\n\n` +
            `Let's talk!\n`
        return `mailto:tomas@valiunas.dev?subject=${encodeURIComponent(
            'Project quote request'
        )}&body=${encodeURIComponent(body)}`
    }, [estimate, description, answers])

    return (
        <section className="section" id="quote">
            <h2 className="section-title">{t('quote.title')}</h2>
            <p className="section-subhead">
                <span className="ai-badge">{t('quote.aiBadge')}</span>{' '}
                {t('quote.subhead')}
            </p>

            <div className="quote-wrap">
                <div className="quote-disclaimer">
                    <strong>{t('quote.disclaimer').split(':')[0]}:</strong>{' '}
                    {t('quote.disclaimer').split(':').slice(1).join(':').trim()}
                </div>

                <label htmlFor="quote-desc" className="quote-desc-label">
                    {t('quote.describeLabel')}
                </label>
                <textarea
                    id="quote-desc"
                    className="quote-textarea"
                    placeholder={t('quote.describePlaceholder')}
                    value={description}
                    onChange={(e) => {
                        setDescription(e.target.value)
                        if (error) setError(null)
                    }}
                    disabled={phase === 'thinking-q' || phase === 'thinking-e'}
                />
                {error && <div className="quote-hint">{error}</div>}

                <div className="quote-row">
                    <button
                        className="btn btn-primary"
                        onClick={onAskQuestions}
                        disabled={phase === 'thinking-q' || phase === 'thinking-e'}
                    >
                        {t('quote.analyzeBtn')}
                    </button>
                    <button
                        className="btn btn-ghost"
                        type="button"
                        onClick={onReset}
                    >
                        {t('quote.resetBtn')}
                    </button>
                </div>

                {phase === 'thinking-q' && (
                    <div className="ai-thinking">
                        <div className="spinner" />
                        <span>{t('quote.thinkingQuestions')}</span>
                    </div>
                )}

                {(phase === 'questions' ||
                    phase === 'thinking-e' ||
                    phase === 'estimate') &&
                    questions.length > 0 && (
                        <div className="ai-questions">
                            <p className="ai-questions-intro">
                                <span className="ai-badge">{t('quote.aiBadge')}</span>{' '}
                                {t('quote.questionsIntro')}
                            </p>
                            {questions.map((q, idx) => (
                                <QuestionCard
                                    key={q.id}
                                    q={q}
                                    idx={idx}
                                    answer={answers[q.id]}
                                    onAnswer={onAnswer}
                                />
                            ))}
                            {phase === 'questions' && (
                                <div className="quote-row">
                                    <button
                                        className="btn btn-primary"
                                        onClick={onGetEstimate}
                                        disabled={!allChoiceAnswered}
                                    >
                                        {t('quote.estimateBtn')}
                                    </button>
                                    <button
                                        className="btn btn-ghost"
                                        type="button"
                                        onClick={() => setPhase('idle')}
                                    >
                                        {t('quote.backBtn')}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                {phase === 'thinking-e' && (
                    <div className="ai-thinking">
                        <div className="spinner" />
                        <span>{t('quote.thinkingEstimate')}</span>
                    </div>
                )}

                {phase === 'estimate' && estimate && (
                    <div className="estimate">
                        <div className="estimate-label">
                            <span className="ai-badge ai-badge-dark">
                                {t('quote.aiBadge')}
                            </span>{' '}
                            {t('quote.estimateLabel')}
                        </div>
                        <div className="estimate-range">
                            €{estimate.low.toLocaleString('en-US')} – €
                            {estimate.high.toLocaleString('en-US')}
                        </div>
                        <div className="estimate-timeline">
                            {t('quote.timelineLabel', { value: estimate.timeline })}
                        </div>
                        <div className="estimate-breakdown">
                            {estimate.items.map((item, i) => (
                                <div key={i}>
                                    <span>{item.label}</span>
                                    <span>
                                        {item.value === null && item.mult
                                            ? `×${item.mult}`
                                            : `€${(
                                                  item.value ?? 0
                                              ).toLocaleString('en-US')}`}
                                    </span>
                                </div>
                            ))}
                            <div className="estimate-summary">
                                <span>{t('quote.summaryLabel')}</span>
                                <span>{estimate.summary}</span>
                            </div>
                        </div>
                        <div className="estimate-actions">
                            <a className="btn" href={emailHref}>
                                {t('quote.emailBtn')}
                            </a>
                            <button
                                className="btn btn-restart"
                                onClick={onReset}
                            >
                                {t('quote.restartBtn')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}

interface QuestionCardProps {
    q: ClarifyingQuestion
    idx: number
    answer: string | undefined
    onAnswer: (qid: string, value: string) => void
}

function QuestionCard({ q, idx, answer, onAnswer }: QuestionCardProps) {
    const isAnswered =
        q.type === 'choice'
            ? !!answer
            : !!answer && answer.trim().length > 0

    return (
        <div className={`ai-q ${isAnswered ? 'ai-q-answered' : ''}`}>
            <div className="ai-q-text">
                <span className="ai-q-num">{idx + 1}</span>
                <span>{q.text}</span>
            </div>
            {q.type === 'choice' ? (
                <div className="ai-q-opts">
                    {q.options?.map((o) => (
                        <button
                            key={o.value}
                            type="button"
                            className={answer === o.value ? 'on' : ''}
                            onClick={() => onAnswer(q.id, o.value)}
                        >
                            {o.label}
                        </button>
                    ))}
                </div>
            ) : (
                <textarea
                    className="ai-q-textarea"
                    placeholder={q.placeholder || ''}
                    value={answer || ''}
                    onChange={(e) => onAnswer(q.id, e.target.value)}
                />
            )}
        </div>
    )
}
