import { useTranslation } from 'react-i18next'

export default function HomeFooter() {
    const { t } = useTranslation()
    return (
        <footer className="home-footer">
            {t('footer')} ·{' '}
            <a href="mailto:tomas@valiunas.dev">tomas@valiunas.dev</a> ·{' '}
            <a href="https://github.com/tom-val" target="_blank" rel="noreferrer">
                {t('nav.github')}
            </a>{' '}
            ·{' '}
            <a
                href="https://www.linkedin.com/in/tomas-valiunas-5a5a85114/"
                target="_blank"
                rel="noreferrer"
            >
                {t('nav.linkedin')}
            </a>
        </footer>
    )
}
