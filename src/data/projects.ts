/**
 * Project metadata. Static fields (urls, ids, screenshot filenames) live here;
 * translatable copy (title, descriptions, tags) lives in src/i18n/locales/*.json
 * under portfolio.projects.<id>.
 */

export interface FeaturedProject {
    id:
        | 'kindergarten'
        | 'atiduosiu'
        | 'finances'
        | 'food'
        | 'coffee'
        | 'quiz'
        | 'whopays'
    url: string
    /** Google Play listing, for projects shipped as mobile apps. */
    playStoreUrl?: string
    /** App Store listing, for projects shipped as mobile apps. */
    appStoreUrl?: string
    /** Filename in /public/screenshots/. Falsy = show placeholder. */
    screenshot?: string
    placeholderEmoji: string
    /** CSS class (defined in Portfolio.css) for the placeholder gradient. */
    placeholderClass: string
}

export const FEATURED_PROJECTS: FeaturedProject[] = [
    {
        id: 'kindergarten',
        url: 'https://medelis.valiunas.dev',
        playStoreUrl:
            'https://play.google.com/store/apps/details?id=com.tomval.kindergarten',
        appStoreUrl: 'https://apps.apple.com/us/app/medelis/id6783967171',
        screenshot: 'medelis.png',
        placeholderEmoji: '🌱',
        placeholderClass: 'thumb-medelis',
    },
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
