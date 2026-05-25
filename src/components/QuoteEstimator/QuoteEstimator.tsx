import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
    Answers,
    ClarifyingQuestion,
    QuoteEstimate,
    generateEstimate,
    generateQuestions,
    submitContact,
} from './quoteService'

import './QuoteEstimator.css'

type Phase =
    | 'idle'
    | 'thinking-q'
    | 'questions'
    | 'thinking-e'
    | 'estimate'
    | 'contact'
    | 'submitting'
    | 'submitted'

export default function QuoteEstimator() {
    const { t, i18n } = useTranslation()
    const locale = (i18n.resolvedLanguage || i18n.language || 'en').slice(0, 2)

    const [phase, setPhase] = useState<Phase>('idle')
    const [description, setDescription] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [questions, setQuestions] = useState<ClarifyingQuestion[]>([])
    const [answers, setAnswers] = useState<Answers>({})
    const [estimate, setEstimate] = useState<QuoteEstimate | null>(null)
    const [jobId, setJobId] = useState<string | null>(null)

    // Contact form state
    const [contactName, setContactName] = useState('')
    const [contactEmail, setContactEmail] = useState('')
    const [contactMessage, setContactMessage] = useState('')
    const [contactError, setContactError] = useState<string | null>(null)

    const allChoiceAnswered = useMemo(() => {
        const choiceQs = questions.filter((q) => q.type === 'choice')
        return choiceQs.length > 0 && choiceQs.every((q) => !!answers[q.id])
    }, [questions, answers])

    const isThinking = phase === 'thinking-q' || phase === 'thinking-e'

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
        try {
            const qs = await generateQuestions(desc, locale)
            setQuestions(qs)
            setPhase('questions')
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e))
            setPhase('idle')
        }
    }

    async function onGetEstimate() {
        setPhase('thinking-e')
        try {
            const r = await generateEstimate(description, answers, locale)
            // generateEstimate attaches jobId onto the response for the submit step
            const j = (r as QuoteEstimate & { jobId?: string }).jobId
            if (j) setJobId(j)
            setEstimate(r)
            setPhase('estimate')
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e))
            setPhase('questions')
        }
    }

    async function onSubmitContact() {
        setContactError(null)
        if (!contactName.trim()) {
            setContactError(t('quote.contactNameRequired'))
            return
        }
        if (!contactEmail.includes('@')) {
            setContactError(t('quote.contactEmailRequired'))
            return
        }
        if (!jobId) {
            setContactError(t('quote.contactNoJob'))
            return
        }
        setPhase('submitting')
        try {
            await submitContact({
                jobId,
                name: contactName.trim(),
                email: contactEmail.trim(),
                message: contactMessage.trim() || undefined,
            })
            setPhase('submitted')
        } catch (e) {
            setContactError(e instanceof Error ? e.message : String(e))
            setPhase('contact')
        }
    }

    function onReset() {
        setPhase('idle')
        setDescription('')
        setError(null)
        setQuestions([])
        setAnswers({})
        setEstimate(null)
        setJobId(null)
        setContactName('')
        setContactEmail('')
        setContactMessage('')
        setContactError(null)
    }

    function onAnswer(qid: string, value: string) {
        setAnswers((prev) => ({ ...prev, [qid]: value }))
    }

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
                    disabled={isThinking}
                />
                {error && <div className="quote-hint">{error}</div>}

                <div className="quote-row">
                    <button
                        className="btn btn-primary"
                        onClick={onAskQuestions}
                        disabled={isThinking}
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
                    phase === 'estimate' ||
                    phase === 'contact' ||
                    phase === 'submitting' ||
                    phase === 'submitted') &&
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

                {(phase === 'estimate' ||
                    phase === 'contact' ||
                    phase === 'submitting' ||
                    phase === 'submitted') &&
                    estimate && (
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
                            {phase === 'estimate' && (
                                <div className="estimate-actions">
                                    <button
                                        className="btn"
                                        onClick={() => setPhase('contact')}
                                    >
                                        {t('quote.getInTouchBtn')}
                                    </button>
                                    <button
                                        className="btn btn-restart"
                                        onClick={onReset}
                                    >
                                        {t('quote.restartBtn')}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                {(phase === 'contact' || phase === 'submitting') && (
                    <div className="contact-form">
                        <h3>{t('quote.contactTitle')}</h3>
                        <p className="contact-intro">{t('quote.contactIntro')}</p>

                        <label htmlFor="contact-name">
                            {t('quote.contactNameLabel')}
                        </label>
                        <input
                            id="contact-name"
                            type="text"
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            disabled={phase === 'submitting'}
                            autoComplete="name"
                        />

                        <label htmlFor="contact-email">
                            {t('quote.contactEmailLabel')}
                        </label>
                        <input
                            id="contact-email"
                            type="email"
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            disabled={phase === 'submitting'}
                            autoComplete="email"
                        />

                        <label htmlFor="contact-message">
                            {t('quote.contactMessageLabel')}
                        </label>
                        <textarea
                            id="contact-message"
                            value={contactMessage}
                            onChange={(e) => setContactMessage(e.target.value)}
                            placeholder={t('quote.contactMessagePlaceholder')}
                            disabled={phase === 'submitting'}
                        />

                        {contactError && (
                            <div className="quote-hint">{contactError}</div>
                        )}

                        <div className="quote-row">
                            <button
                                className="btn btn-primary"
                                onClick={onSubmitContact}
                                disabled={phase === 'submitting'}
                            >
                                {phase === 'submitting'
                                    ? t('quote.submittingBtn')
                                    : t('quote.submitBtn')}
                            </button>
                            <button
                                className="btn btn-ghost"
                                type="button"
                                onClick={() => setPhase('estimate')}
                                disabled={phase === 'submitting'}
                            >
                                {t('quote.contactBackBtn')}
                            </button>
                        </div>
                    </div>
                )}

                {phase === 'submitted' && (
                    <div className="contact-success">
                        <div className="contact-success-icon">✓</div>
                        <h3>{t('quote.thanksTitle')}</h3>
                        <p>{t('quote.thanksBody')}</p>
                        <button className="btn btn-ghost" onClick={onReset}>
                            {t('quote.thanksReset')}
                        </button>
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
        q.type === 'choice' ? !!answer : !!answer && answer.trim().length > 0

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
