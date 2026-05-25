import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'

import './Hero.css'

const STACK = ['.NET', 'PostgreSQL', 'React', 'TypeScript', 'AWS Lambda']

export default function Hero() {
    const { t } = useTranslation()

    return (
        <section className="hero">
            <img src="/tomas-valiunas.jpg" alt="Tomas Valiūnas" />
            <div>
                <span className="hero-role">{t('hero.role')}</span>
                <h1>{t('hero.greeting')}</h1>
                <p className="hero-lead">{t('hero.lead')}</p>
                <div className="hero-stack">
                    {STACK.map((s) => (
                        <span key={s}>{s}</span>
                    ))}
                </div>
                <div className="hero-cta">
                    <a href="#quote" className="btn btn-primary">
                        {t('hero.ctaQuote')}
                    </a>
                    <RouterLink to="/timeline" className="btn btn-outline">
                        {t('hero.ctaTimeline')}
                    </RouterLink>
                    <a href="mailto:tomas@valiunas.dev" className="btn btn-ghost">
                        tomas@valiunas.dev
                    </a>
                </div>
            </div>
        </section>
    )
}
