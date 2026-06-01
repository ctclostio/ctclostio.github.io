# ctclostio.github.io

A public portfolio site for Clayton Clostio / Hannadio's GitHub projects.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

The GitHub Actions workflow in `.github/workflows/pages.yml` deploys the static Vite build to GitHub Pages.

## Quality checks

```bash
npm run check
npm run build
npm run test:a11y
npm run test:lighthouse
```

Browser-based checks require Chrome or Chromium. In CI, `.github/workflows/pages.yml` installs Chrome and passes `CHROME_PATH` to Playwright and Lighthouse.

## Optional configuration

Copy `.env.example` to `.env.local` and set values as needed:

- `VITE_CONTACT_ENDPOINT` posts the contact form to a static form endpoint.
- `VITE_PLAUSIBLE_DOMAIN` enables Plausible analytics.
- `VITE_PLAUSIBLE_SRC` overrides the Plausible script source.

## Roadmap status

The implemented roadmap status is tracked in [`docs/plans/2026-06-01-site-improvement-roadmap.md`](docs/plans/2026-06-01-site-improvement-roadmap.md).
