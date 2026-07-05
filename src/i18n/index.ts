/**
 * Build-time i18n. Translations live in ./locales/*.json (same files the CRA
 * version used). Astro components call useTranslations(lang) during the
 * static build; the QuoteEstimator island uses the same helper client-side.
 */
import en from './locales/en.json'
import lt from './locales/lt.json'

export const SUPPORTED_LANGUAGES = ['en', 'lt'] as const
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]
export const DEFAULT_LANGUAGE: SupportedLanguage = 'en'

const dictionaries: Record<SupportedLanguage, unknown> = { en, lt }

function resolve(dict: unknown, key: string): unknown {
    return key
        .split('.')
        .reduce<unknown>(
            (node, part) =>
                node && typeof node === 'object'
                    ? (node as Record<string, unknown>)[part]
                    : undefined,
            dict
        )
}

/** Raw lookup — use for arrays/objects (tags, contentLines, dialogData). */
export function lookup(lang: SupportedLanguage, key: string): unknown {
    const value = resolve(dictionaries[lang], key)
    return value !== undefined ? value : resolve(dictionaries[DEFAULT_LANGUAGE], key)
}

export type Translator = (
    key: string,
    vars?: Record<string, string | number>
) => string

export function useTranslations(lang: SupportedLanguage): Translator {
    return (key, vars) => {
        const value = lookup(lang, key)
        if (typeof value !== 'string') return key
        if (!vars) return value
        return Object.entries(vars).reduce(
            (out, [name, v]) => out.replaceAll(`{{${name}}}`, String(v)),
            value
        )
    }
}

/** Path prefix for a language: '' for en, '/lt' for lt. */
export function langPrefix(lang: SupportedLanguage): string {
    return lang === DEFAULT_LANGUAGE ? '' : `/${lang}`
}
