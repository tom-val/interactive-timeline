import { useTranslation } from 'react-i18next'
import { FEATURED_PROJECTS } from '../../data/projects'

import './Portfolio.css'

export default function Portfolio() {
    const { t } = useTranslation()

    return (
        <section className="section portfolio">
            <h2 className="section-title">{t('portfolio.title')}</h2>
            <p className="section-subhead">{t('portfolio.subhead')}</p>

            <div className="portfolio-grid">
                {FEATURED_PROJECTS.map((p) => {
                    const title = t(`portfolio.projects.${p.id}.title`)
                    const tagsRaw = t(`portfolio.projects.${p.id}.tags`, {
                        returnObjects: true,
                    }) as unknown
                    const tags = Array.isArray(tagsRaw) ? (tagsRaw as string[]) : []
                    return (
                        <article key={p.id} className="card">
                            <div
                                className={`thumb ${
                                    p.screenshot ? '' : `placeholder ${p.placeholderClass}`
                                }`}
                            >
                                {p.screenshot ? (
                                    <img
                                        src={`/screenshots/${p.screenshot}`}
                                        alt={`${title} screenshot`}
                                    />
                                ) : (
                                    <>
                                        <span className="badge-todo">
                                            {t('portfolio.screenshotPending')}
                                        </span>
                                        <span className="thumb-emoji">
                                            {p.placeholderEmoji}
                                        </span>
                                    </>
                                )}
                            </div>
                            <div className="card-body">
                                <h3>{title}</h3>
                                <p className="card-desc">
                                    {t(`portfolio.projects.${p.id}.desc`)}
                                </p>
                                <div className="card-tags">
                                    {tags.map((tag) => (
                                        <span key={tag}>{tag}</span>
                                    ))}
                                </div>
                                <div className="card-links">
                                    <a href={p.url} target="_blank" rel="noreferrer">
                                        {t('portfolio.visit')}
                                    </a>
                                </div>
                            </div>
                        </article>
                    )
                })}
            </div>
        </section>
    )
}
