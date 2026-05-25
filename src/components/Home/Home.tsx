import Hero from '../Hero/Hero'
import Portfolio from '../Portfolio/Portfolio'
import SmallProjects from '../SmallProjects/SmallProjects'
import QuoteEstimator from '../QuoteEstimator/QuoteEstimator'
import HomeFooter from './HomeFooter'

import './Home.css'

export default function Home() {
    return (
        <main className="app-container">
            <Hero />
            <Portfolio />
            <SmallProjects />
            <QuoteEstimator />
            <HomeFooter />
        </main>
    )
}
