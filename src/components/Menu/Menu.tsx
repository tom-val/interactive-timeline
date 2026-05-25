import React from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ReactGA from 'react-ga4'

import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher'

import './Menu.css'

export default function NavigationMenu(props: { id?: string }) {
    const location = useLocation()
    const { t } = useTranslation()

    React.useEffect(() => {
        ReactGA.send({ hitType: 'pageview', page: location.pathname })
    }, [location])

    return (
        <header className="appbar" id={props.id}>
            <Link to="/" className="brand">
                Tomas Valiūnas
            </Link>
            <nav className="appbar-nav">
                <NavLink to="/" end>
                    {t('nav.home')}
                </NavLink>
                <NavLink to="/timeline">{t('nav.timeline')}</NavLink>
            </nav>
            <LanguageSwitcher />
        </header>
    )
}
