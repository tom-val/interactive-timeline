import { useTranslation } from 'react-i18next'
import { SMALL_PROJECTS } from '../../data/projects'

import './SmallProjects.css'

export default function SmallProjects() {
    const { t } = useTranslation()

    return (
        <section className="section">
            <h2 className="section-title">{t('smallProjects.title')}</h2>
            <p className="section-subhead">{t('smallProjects.subhead')}</p>

            <div className="small-grid">
                {SMALL_PROJECTS.map((p) => (
                    <div key={p.id} className="small-card">
                        <div className={`ico ${p.placeholderClass}`}>
                            {p.placeholderEmoji}
                        </div>
                        <div>
                            <h4>{t(`smallProjects.${p.id}.title`)}</h4>
                            <p>{t(`smallProjects.${p.id}.desc`)}</p>
                            <a
                                className="small-link"
                                href={p.url}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {new URL(p.url).host} ↗
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
