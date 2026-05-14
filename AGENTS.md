# AGENTS.md -- Portfolio Website

This is the portfolio website project for Clayton Clostio (Hannadio).

## First Run

Before doing anything else:
1. `cd /home/hannadio/ctclostio.github.io`
2. `npm install` (first time only)
3. `npm run build` to verify the project compiles
4. `npm run check` to verify TypeScript passes

## Stack

- React + TypeScript + Vite
- GitHub Pages deployment via `.github/workflows/pages.yml`
- Single-page app; all JSX lives in `src/main.tsx`
- Single stylesheet at `src/styles.css`
- Data in `src/data/projects.ts`

## Conventions

- Always run `npm run check` before committing
- Always run `npm run build` before pushing
- Push to `main` triggers auto-deploy via GitHub Pages
