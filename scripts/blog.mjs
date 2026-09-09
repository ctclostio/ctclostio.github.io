import { readdir, readFile } from 'node:fs/promises';
import { resolve, relative } from 'node:path';
import MarkdownIt from 'markdown-it';
import { parseDocument } from 'yaml';

export const siteUrl = 'https://ctclostio.github.io';
export const blogDescription = 'Project updates, small discoveries, and notes from the workbench of Clayton Clostio.';
const contentDirectory = resolve('content/blog');

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
}

export function parsePost(source, filename) {
  const fail = (message) => { throw new Error(`${filename}: ${message}`); };
  const slug = filename.replace(/\.md$/, '');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) fail('Use lowercase words separated by hyphens for the filename.');
  const match = source.replace(/^\uFEFF/, '').match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) fail('Start the post with YAML metadata between --- lines.');
  const document = parseDocument(match[1]);
  if (document.errors.length) fail(document.errors.map((error) => error.message).join('; '));
  const data = document.toJS({ maxAliasCount: 0 });
  if (!data || typeof data !== 'object' || Array.isArray(data)) fail('Metadata must be a mapping.');
  for (const key of ['title', 'description', 'date']) {
    if (typeof data[key] !== 'string' || !data[key].trim()) fail(`${key} must be a nonempty string.`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date) || Number.isNaN(Date.parse(data.date)) || new Date(data.date).toISOString().slice(0, 10) !== data.date) fail('date must be a real date in YYYY-MM-DD format.');
  if (typeof data.draft !== 'boolean') fail('Set draft to true or false explicitly.');
  if (data.project !== undefined && (typeof data.project !== 'string' || !data.project.trim())) fail('project must be a nonempty string.');
  if (data.tags !== undefined && (!Array.isArray(data.tags) || data.tags.some((tag) => typeof tag !== 'string' || !tag.trim()))) fail('tags must be a list of nonempty strings.');
  const body = match[2].trim();
  if (!body && !data.draft) fail('A published post needs some content.');
  const markdown = new MarkdownIt({ html: false, linkify: true, typographer: true });
  const headings = [];
  const usedIds = new Map();
  const tokens = markdown.parse(body, {});
  tokens.forEach((token, index) => {
    if (token.type !== 'heading_open') return;
    if (token.tag === 'h1') fail('Use ## and ### inside the post; the title supplies the page heading.');
    const inline = tokens[index + 1];
    const text = inline.children?.map((child) => child.type === 'text' || child.type === 'code_inline' ? child.content : '').join('') || inline.content;
    const base = `note-${text.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'section'}`;
    const count = (usedIds.get(base) || 0) + 1;
    usedIds.set(base, count);
    const id = count === 1 ? base : `${base}-${count}`;
    token.attrSet('id', id);
    if (token.tag === 'h2') headings.push({ id, text });
  });
  markdown.renderer.rules.table_open = () => '<div class="article-table"><table>\n';
  markdown.renderer.rules.table_close = () => '</table></div>\n';
  return {
    slug, title: data.title.trim(), description: data.description.trim(), date: data.date,
    draft: data.draft, project: data.project?.trim() || null,
    tags: [...new Set((data.tags || []).map((tag) => tag.trim()))],
    minutes: Math.max(1, Math.ceil(body.split(/\s+/).filter(Boolean).length / 220)),
    headings, html: markdown.renderer.render(tokens, markdown.options, {}),
  };
}

export async function loadPosts(directory = contentDirectory) {
  const files = (await readdir(directory)).filter((filename) => filename.endsWith('.md')).sort();
  const all = await Promise.all(files.map(async (filename) => parsePost(await readFile(resolve(directory, filename), 'utf8'), filename)));
  // Draft bodies never enter the browser bundle, generated HTML, or RSS feed.
  return all.filter((post) => !post.draft).sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

export function rssFeed(posts) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>
<title>Hannadio — The notebook</title><link>${siteUrl}/blog/</link><description>${escapeHtml(blogDescription)}</description><language>en</language>
<atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
${posts.map((post) => `<item><title>${escapeHtml(post.title)}</title><link>${siteUrl}/blog/${post.slug}/</link><guid isPermaLink="true">${siteUrl}/blog/${post.slug}/</guid><pubDate>${new Date(`${post.date}T12:00:00Z`).toUTCString()}</pubDate><description>${escapeHtml(post.description)}</description>${post.tags.map((tag) => `<category>${escapeHtml(tag)}</category>`).join('')}</item>`).join('\n')}
</channel></rss>\n`;
}

export function blogPlugin() {
  const moduleId = '\0virtual:blog';
  return {
    name: 'project-notebook',
    resolveId(id) { if (id === 'virtual:blog') return moduleId; },
    async load(id) {
      if (id === moduleId) return `export const posts = ${JSON.stringify(await loadPosts())};`;
    },
    configureServer(server) {
      server.watcher.add(contentDirectory);
      const refresh = (file) => {
        const localPath = relative(contentDirectory, resolve(file));
        if (localPath.startsWith('..') || !localPath.endsWith('.md')) return;
        server.moduleGraph.invalidateAll();
        server.ws.send({ type: 'full-reload' });
      };
      server.watcher.on('add', refresh).on('change', refresh).on('unlink', refresh);
      server.middlewares.use('/feed.xml', async (_request, response, next) => {
        try {
          response.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
          response.end(rssFeed(await loadPosts()));
        } catch (error) { next(error); }
      });
    },
  };
}
