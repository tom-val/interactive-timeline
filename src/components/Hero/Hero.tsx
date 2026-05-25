import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import GitHubIcon from '@mui/icons-material/GitHub'
import LinkedInIcon from '@mui/icons-material/LinkedIn'

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
                </div>
                <ul className="hero-social" aria-label={t('hero.elsewhere')}>
                    <li>
                        <a
                            href="mailto:tomas@valiunas.dev"
                            aria-label="tomas@valiunas.dev"
                            title="tomas@valiunas.dev"
                        >
                            <MailOutlineIcon fontSize="small" />
                        </a>
                    </li>
                    <li>
                        <a
                            href="https://github.com/tom-val"
                            target="_blank"
                            rel="noreferrer"
                            aria-label={t('nav.github')}
                            title={t('nav.github')}
                        >
                            <GitHubIcon fontSize="small" />
                        </a>
                    </li>
                    <li>
                        <a
                            href="https://www.linkedin.com/in/tomas-valiunas-5a5a85114/"
                            target="_blank"
                            rel="noreferrer"
                            aria-label={t('nav.linkedin')}
                            title={t('nav.linkedin')}
                        >
                            <LinkedInIcon fontSize="small" />
                        </a>
                    </li>
                </ul>
            </div>
        </section>
    )
}
