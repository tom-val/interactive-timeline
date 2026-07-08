/**
 * Project metadata. Static fields (urls, ids, screenshot filenames) live here;
 * translatable copy (title, descriptions, tags) lives in src/i18n/locales/*.json
 * under portfolio.projects.<id> and smallProjects.<id>.
 */

export interface FeaturedProject {
    id: 'atiduosiu' | 'finances' | 'food' | 'coffee' | 'quiz' | 'whopays'
    url: string
    /** Filename in /public/screenshots/. Falsy = show placeholder. */
    screenshot?: string
    placeholderEmoji: string
    /** CSS class (defined in Portfolio.css) for the placeholder gradient. */
    placeholderClass: string
}

export interface SmallProject {
    id: 'wedding' | 'lemonade'
    url: string
    /** Icon rendered by SmallProjects.astro. */
    icon: 'heart' | 'drink'
    placeholderClass: string
}

export const FEATURED_PROJECTS: FeaturedProject[] = [
    {
        id: 'atiduosiu',
        url: 'https://atiduosiu.lt',
        screenshot: 'atiduosiu.png',
        placeholderEmoji: '🎁',
        placeholderClass: 'thumb-atid',
    },
    {
        id: 'finances',
        url: 'https://finances.valiunas.dev',
        screenshot: 'finances.png',
        placeholderEmoji: '💶',
        placeholderClass: 'thumb-fin',
    },
    {
        id: 'food',
        url: 'https://food.valiunas.dev',
        screenshot: 'food.png',
        placeholderEmoji: '🍳',
        placeholderClass: 'thumb-food',
    },
    {
        id: 'coffee',
        url: 'https://coffee.valiunas.dev',
        screenshot: 'coffee.png',
        placeholderEmoji: '☕',
        placeholderClass: 'thumb-coff',
    },
    {
        id: 'quiz',
        url: 'https://quiz.valiunas.dev',
        screenshot: 'how-well.png',
        placeholderEmoji: '❓',
        placeholderClass: 'thumb-quiz',
    },
    {
        id: 'whopays',
        url: 'https://whopays.valiunas.dev',
        screenshot: 'who-pays.png',
        placeholderEmoji: '💸',
        placeholderClass: 'thumb-whopays',
    },
]

export const SMALL_PROJECTS: SmallProject[] = [
    {
        id: 'wedding',
        url: 'https://tomasirugne.click/aiste-18634',
        icon: 'heart',
        placeholderClass: 'ico-wed',
    },
    {
        id: 'lemonade',
        url: 'https://lemonade.tomasirugne.click',
        icon: 'drink',
        placeholderClass: 'ico-lem',
    },
]
