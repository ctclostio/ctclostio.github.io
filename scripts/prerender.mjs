import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { createServer } from 'vite';
import { loadPosts, rssFeed, siteUrl, blogDescription, escapeHtml } from './blog.mjs';

const posts = await loadPosts();
const template = await readFile('dist/index.html', 'utf8');
const server = await createServer({ server: { middlewareMode: true, hmr: false, watch: null }, appType: 'custom', mode: 'production' });
try {
  const { render } = await server.ssrLoadModule('/src/entry-server.ts');
  const pages = [
    { path: '/', file: 'index.html' },
    { path: '/blog/', file: 'blog/index.html', title: 'The notebook — Hannadio', description: blogDescription, type: 'website' },
    ...posts.map((post) => ({ path: `/blog/${post.slug}/`, file: `blog/${post.slug}/index.html`, title: `${post.title} — Hannadio`, description: post.description, type: 'article', post })),
    { path: '/404/', file: '404.html', title: 'A page wandered off — Hannadio', description: 'An unexpected detour. Find your way back to the notebook or the workshop.', noindex: true },
  ];
  for (const page of pages) {
    let html = template.replace('<div id="root"></div>', () => `<div id="root">${render(page.path)}</div>`);
    if (page.title) {
      html = html.replace(/<title>[^<]*<\/title>/, () => `<title>${escapeHtml(page.title)}</title>`)
        .replace(/(<meta (?:name="description"|property="og:description"|name="twitter:description") content=")[^"]*("\s*\/?>)/g, (_match, before, after) => before + escapeHtml(page.description) + after)
        .replace(/(<meta (?:property="og:title"|name="twitter:title") content=")[^"]*("\s*\/?>)/g, (_match, before, after) => before + escapeHtml(page.title) + after)
        .replace(/(<link rel="canonical" href=")[^"]*("\s*\/?>)/, (_match, before, after) => before + siteUrl + page.path + after)
        .replace(/(<meta property="og:url" content=")[^"]*("\s*\/?>)/, (_match, before, after) => before + siteUrl + page.path + after)
        .replace(/(<meta property="og:type" content=")[^"]*("\s*\/?>)/, (_match, before, after) => before + (page.type || 'website') + after);
      const schema = page.post ? {
        '@context': 'https://schema.org', '@type': 'BlogPosting', headline: page.post.title,
        description: page.post.description, datePublished: page.post.date,
        author: { '@type': 'Person', name: 'Clayton Clostio', url: siteUrl },
        url: siteUrl + page.path, mainEntityOfPage: siteUrl + page.path,
        image: `${siteUrl}/og/cover.svg`,
      } : { '@context': 'https://schema.org', '@type': 'Blog', name: 'Hannadio — The notebook', url: `${siteUrl}/blog/`, description: blogDescription };
      html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, () => page.noindex ? '' : `<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>`);
    }
    if (page.noindex) html = html.replace('content="index, follow"', 'content="noindex, follow"').replace(/<link rel="canonical"[^>]*>/, '');
    const destination = resolve('dist', page.file);
    await mkdir(dirname(destination), { recursive: true });
    await writeFile(destination, html);
  }
  await writeFile('dist/feed.xml', rssFeed(posts));
  await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.filter((page) => !page.noindex).map((page) => `<url><loc>${siteUrl}${page.path}</loc>${page.post ? `<lastmod>${page.post.date}</lastmod>` : ''}</url>`).join('')}</urlset>\n`);
  console.log(`Prerendered ${pages.length} pages, including ${posts.length} published blog posts; wrote RSS and sitemap.`);
} finally {
  await server.close();
}
