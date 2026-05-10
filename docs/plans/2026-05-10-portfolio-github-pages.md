# Portfolio GitHub Pages Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task if the site grows beyond this initial version.

**Goal:** Publish a polished public portfolio for ctclostio's GitHub projects.

**Architecture:** Static React + TypeScript + Vite application deployed to GitHub Pages via Actions. Project content is currently curated from GitHub public repository metadata in `src/data/projects.ts`, with filters and responsive cards rendered client-side.

**Tech Stack:** React, TypeScript, Vite, GitHub Actions, GitHub Pages.

---

### Task 1: Confirm public deployment scope

**Objective:** Avoid publishing to the wrong public URL or with the wrong commit identity.

**Files:**
- Read: `vite.config.ts`
- Read: `.github/workflows/pages.yml`

**Step 1:** Confirm preferred repository target.

Options:
- `ctclostio.github.io` for `https://ctclostio.github.io/`.
- `portfolio` for `https://ctclostio.github.io/portfolio/`.

**Step 2:** Confirm commit author identity.

Current global git identity is unset. Use either a real public email/name or GitHub no-reply identity.

**Verification:** User explicitly approves repository name, visibility, and commit identity before any public push.

### Task 2: Commit the local implementation

**Objective:** Create a clean initial commit after identity is configured.

**Files:**
- Add all source files in `/home/hannadio/ctclostio.github.io`.

**Commands:**

```bash
npm run build
git status --short
git add .
git commit -m "feat: launch portfolio website"
```

**Verification:** `git log --oneline -1` shows the initial portfolio commit.

### Task 3: Create or connect the GitHub repository

**Objective:** Create/connect the public GitHub repo without overwriting existing work.

**Commands for user-site repo:**

```bash
gh repo create ctclostio.github.io --public --source . --push
```

**Commands for project-site repo:**

```bash
gh repo create portfolio --public --source . --push
```

**Verification:** `gh repo view ctclostio/REPO_NAME --json name,url,visibility` returns the expected public repository.

### Task 4: Enable and verify GitHub Pages deployment

**Objective:** Ensure Actions deploys the Vite build to GitHub Pages.

**Commands:**

```bash
gh workflow list
gh run list --limit 5
gh run watch
```

**Verification:** The Pages workflow succeeds and the public URL returns HTTP 200.

### Task 5: Iterate on content and polish

**Objective:** Improve the portfolio after the initial deployment is live.

**Files:**
- Modify: `src/data/projects.ts`
- Modify: `src/main.tsx`
- Modify: `src/styles.css`

**Ideas:**
- Add screenshots or demo GIFs for featured projects.
- Pull repository metadata automatically during build.
- Add a real contact method or custom domain.
- Add per-project case studies for the strongest repos.

**Verification:** `npm run build` passes and deployed URL still returns HTTP 200.
