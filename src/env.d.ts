/// <reference types="astro/client" />

interface ImportMetaEnv {
    /** Override for the quote API base URL; defaults to same-origin /api. */
    readonly PUBLIC_QUOTE_API_URL?: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
