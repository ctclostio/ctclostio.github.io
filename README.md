# ctclostio.github.io

A public portfolio site for Clayton Clostio / Hannadio's GitHub projects.

The design takes the form of a field notebook: paper, ink illustrations inspired by
the projects, an interactive orbital sketch, and expandable technical notes.
The project cabinet supports category filters, search, and a random project picker.
Motion follows the visitor's reduced-motion preference. Fonts are served locally;
their licenses live alongside the files in `public/fonts`.

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

For an existing Chrome installation on Windows (PowerShell):

```powershell
$env:CHROME_PATH = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
npm run quality
```

Lighthouse starts its own production preview on an available local port, so it
can run alongside the development server.

## Optional configuration

Copy `.env.example` to `.env.local` and set values as needed:

- `VITE_CONTACT_ENDPOINT` posts the contact form to a static form endpoint.
- `VITE_PLAUSIBLE_DOMAIN` enables Plausible analytics.
- `VITE_PLAUSIBLE_SRC` overrides the Plausible script source.

Without a contact endpoint, the contact section links to GitHub. It does not
send mail to the GitHub noreply address.

## Roadmap status

The implemented roadmap status is tracked in [`docs/plans/2026-06-01-site-improvement-roadmap.md`](docs/plans/2026-06-01-site-improvement-roadmap.md).
