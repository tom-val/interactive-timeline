import { useTranslation } from 'react-i18next'

import { SUPPORTED_LANGUAGES, SupportedLanguage } from '../../i18n'
import './LanguageSwitcher.css'

export default function LanguageSwitcher() {
    const { i18n } = useTranslation()
    const current = (i18n.resolvedLanguage ||
        i18n.language ||
        'en') as SupportedLanguage

    const onChange = (lng: SupportedLanguage) => {
        if (lng !== current) i18n.changeLanguage(lng)
    }

    return (
        <div className="lang-switcher" role="group" aria-label="Language">
            {SUPPORTED_LANGUAGES.map((lng) => (
                <button
                    key={lng}
                    type="button"
                    onClick={() => onChange(lng)}
                    className={`lang-btn ${current === lng ? 'lang-btn--active' : ''}`}
                    aria-pressed={current === lng}
                >
                    {lng.toUpperCase()}
                </button>
            ))}
        </div>
    )
}
