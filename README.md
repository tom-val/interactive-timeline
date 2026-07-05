# Interactive Timeline

Personal CV page — [valiunas.dev](https://valiunas.dev). Built with [Astro](https://astro.build):
static HTML for both locales (`/` English, `/lt/` Lithuanian) with one React island
(the AI quote estimator).

## Commands

| Command           | Action                                       |
| ----------------- | -------------------------------------------- |
| `npm run dev`     | Dev server at `localhost:4321`               |
| `npm run build`   | Build the static site into `build/`          |
| `npm run preview` | Serve the production build locally           |

Translations live in `src/i18n/locales/*.json`; static project/timeline metadata in
`src/data/`. The frontend deploys to S3 via GitHub Actions (`.github/workflows/main.yml`);
the quote API lambdas live in `backend/`, infrastructure in `infrastructure/` (Terraform).
