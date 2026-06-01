# Site Improvement Roadmap Status

**Source reviewed:** `/home/hannadio/Downloads/deep-research-report.md`
**Target site:** `https://ctclostio.github.io/`
**Implementation pass:** 2026-06-01

## Completed In Repo

- Removed public-facing "add photo" implementation copy from the homepage.
- Added segmented visitor paths for hiring teams, collaborators, and technical readers.
- Added a contact section with a structured form, configurable static endpoint support, and a mailto fallback.
- Added event hooks for hero CTAs, visitor paths, case-study links, repository exits, demos, project search, filters, and contact submission.
- Added optional Plausible analytics loading through `VITE_PLAUSIBLE_DOMAIN` and `VITE_PLAUSIBLE_SRC`.
- Added proof-point fields to featured project data and rendered proof bullets on project cards.
- Added a third flagship case study for `reaper`, grounded in the public repository README.
- Added proof blocks inside all case-study cards.
- Added a skip link, focus-visible styling, and a Playwright/axe accessibility smoke test.
- Added canonical URL, Open Graph metadata, Twitter card metadata, JSON-LD structured data, `robots.txt`, `sitemap.xml`, and an SVG social preview image.
- Added Lighthouse budget checks through a local Node runner.
- Updated GitHub Actions to run TypeScript, build, accessibility, and Lighthouse checks before Pages deployment.
- Pinned the workflow to `ubuntu-24.04` and configured explicit Chrome setup for browser-based checks.

## Remaining External Inputs

These items cannot be completed entirely from the current repo contents.

- Replace `public/profile/clayton-clostio.jpg` with a real portrait if the site should show a personal photo.
- Set `VITE_CONTACT_ENDPOINT` to a real form endpoint if contact should submit without opening an email draft.
- Set `VITE_PLAUSIBLE_DOMAIN` after creating or connecting a Plausible site.
- Convert `public/og/cover.svg` to PNG if the final social-sharing target requires PNG/JPEG previews.
- Add real screenshots, clips, or sanitized demo reports for `SmolDungeon`, `GoStarMap`, and `reaper`.
- Add a custom domain/proxy if custom security response headers are required.

## Verification

Commands that pass locally:

```bash
npm run check
npm run build
npm audit --audit-level=high
```

Browser-based checks are wired but could not run on this local host because there is no Chrome/Chromium executable and Playwright does not currently support installing Chromium for `ubuntu26.04-x64`. GitHub Actions now installs/provides Chrome explicitly on `ubuntu-24.04`.
