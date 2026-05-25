import { useTranslation } from 'react-i18next'

import TimeLine from './Timeline'

import './TimelinePage.css'

export default function TimelinePage() {
    const { t } = useTranslation()

    return (
        <main className="app-container">
            <section className="page-head">
                <span className="page-eyebrow">{t('timelinePage.eyebrow')}</span>
                <h1>{t('timelinePage.title')}</h1>
                <p>{t('timelinePage.subhead')}</p>
            </section>
            <TimeLine />
        </main>
    )
}
