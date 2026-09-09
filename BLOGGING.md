# Writing in the notebook

Posts live in `content/blog/`. Each Markdown file becomes a page at
`https://ctclostio.github.io/blog/your-filename/` when `draft` is `false`.
The blog archive, homepage entries, RSS feed, and sitemap update automatically
on the next deployment. Posts appear newest first.

## Start a post

From this repository, run:

```bash
npm run new:post -- "A better orbit camera" --project "GoStarMap"
```

This creates `content/blog/a-better-orbit-camera.md` as a draft. Existing files
are never overwritten. You can omit `--project` for a general note.

You can also copy `content/blog/post-template.md` to a new filename directly
in GitHub. Use lowercase words separated by hyphens, such as
`a-better-orbit-camera.md`. The filename is the permanent URL; changing a title
inside the file does not change that URL.

## Write the entry

Each file starts with metadata:

```yaml
---
title: "A better orbit camera"
date: "2026-09-09"
description: "What changed in the camera controls, and what I learned."
project: "GoStarMap"
tags: [go, simulation]
draft: true
---
```

- `title`, `date`, `description`, and `draft` are required.
- Use a real date in `YYYY-MM-DD` format. Dates display consistently across time zones.
- `project` and `tags` are optional. Projects populate the archive filter.
- Use the exact portfolio project name to get an automatic project link on the article.
  Use `Portfolio` for notes about this website.
- `draft: true` keeps the post out of the built website, browser bundle, and RSS feed.
  This repository is public, so committed draft source files are still visible on GitHub.

Write normal Markdown underneath the metadata. Start sections with `##`, since
the title already supplies the page's main heading. These sections form the
article's table of contents. Links, lists, quotes, tables, and fenced code blocks
are supported. Raw HTML is displayed as text rather than executed.

For images, put the file in `public/blog-images/` and reference it from the site root:

```markdown
![The new orbit camera looking toward Saturn](/blog-images/orbit-camera.jpg)
```

## Preview and publish

1. Write the post and replace its description with a short summary.
2. Set `draft: false` locally, then run `npm run dev` and visit `/blog/` to preview it.
   Nothing goes live until the changes are pushed. On GitHub, its Markdown preview
   can also be used while the file remains a draft.
3. Run `npm run quality` (set `CHROME_PATH` if needed; see the README).
4. Commit the post and any images, then push to `main`. GitHub Actions builds and
   deploys the updated site. Check that the deployment succeeds.

A future date does not schedule a post: `draft: false` publishes on the next build.
Keep unfinished or not-yet-ready entries marked as drafts.

You can also give Codex your notes and ask it to add an entry to the notebook.

## How the blog works

Markdown is compiled at build time. The site produces an HTML file for every
published article and for `/blog/`, so direct links, refreshes, and reading with
JavaScript disabled work on GitHub Pages. RSS is available at `/feed.xml`.

The content loader validates metadata before publishing. The build also runs
content tests, and browser tests exercise the production output. The normal
GitHub Pages deployment includes all of these generated pages; no extra service
or account is required.
