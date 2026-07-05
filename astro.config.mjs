import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'

// https://astro.build/config
export default defineConfig({
    site: 'https://valiunas.dev',
    // Keep CRA's output dir so the S3 upload step in CI stays unchanged.
    outDir: './build',
    integrations: [
        react(),
        sitemap({
            i18n: {
                defaultLocale: 'en',
                locales: { en: 'en', lt: 'lt' },
            },
        }),
    ],
    i18n: {
        defaultLocale: 'en',
        locales: ['en', 'lt'],
        routing: { prefixDefaultLocale: false },
    },
})
