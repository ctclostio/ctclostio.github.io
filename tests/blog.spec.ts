import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { loadPosts } from '../scripts/blog.mjs';

const published = await loadPosts();
const firstPost = published[0];

test('the homepage links to a searchable project notebook', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link', { name: 'Blog', exact: true }).click();
  await expect(page).toHaveURL(/\/blog\/$/);
  await expect(page).toHaveTitle('The notebook — Hannadio');
  await expect(page.locator('.notebook-entry')).toHaveCount(published.length);
  if (!firstPost) return;
  await page.getByRole('searchbox', { name: 'Search the notebook' }).fill('NO_SUCH_NOTE_48a65');
  await expect(page.getByRole('heading', { name: 'That page is still blank.' })).toBeVisible();
  await page.getByRole('button', { name: 'Show all entries' }).click();
  await expect(page.locator('.notebook-entry')).toHaveCount(published.length);
  if (firstPost.project) {
    await page.getByRole('combobox', { name: 'Project', exact: true }).selectOption(firstPost.project);
    await expect(page.locator('.notebook-entry')).toHaveCount(published.filter((post: { project: string }) => post.project === firstPost.project).length);
  }
});

test('articles support direct navigation, metadata, table of contents, and reloads', async ({ page, request }) => {
  test.skip(!firstPost, 'No published posts yet.');
  const path = `/blog/${firstPost.slug}/`;
  const response = await request.get(path);
  expect(response.status()).toBe(200);
  const html = await response.text();
  expect(html).toContain('"@type":"BlogPosting"');
  expect(html).toContain(`https://ctclostio.github.io${path}`);
  expect(html).toContain('article-prose');
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(path);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(firstPost.title);
  await expect(page).toHaveTitle(`${firstPost.title} — Hannadio`);
  await page.reload();
  if (firstPost.headings.length) {
    await page.getByRole('navigation', { name: 'In this entry' }).getByRole('link').first().click();
    await expect(page).toHaveURL(new RegExp(`#${firstPost.headings[0].id}$`));
  }
  await page.getByRole('link', { name: '← Back to the notebook', exact: true }).click();
  await expect(page).toHaveURL(/\/blog\/$/);
  expect(errors).toEqual([]);
});

test('RSS and sitemap contain published URLs and omit the draft template', async ({ page, request }) => {
  const rss = await request.get('/feed.xml');
  expect(rss.status()).toBe(200);
  const rssText = await rss.text();
  await page.goto('/blog/');
  const parsed = await page.evaluate((text) => {
    const xml = new DOMParser().parseFromString(text, 'application/xml');
    return { errors: xml.querySelectorAll('parsererror').length, items: xml.querySelectorAll('item').length };
  }, rssText);
  expect(parsed).toEqual({ errors: 0, items: published.length });
  const sitemap = await (await request.get('/sitemap.xml')).text();
  expect(sitemap).toContain('https://ctclostio.github.io/blog/');
  expect(rssText + sitemap).not.toContain('post-template');
  for (const post of published) expect(rssText + sitemap).toContain(`/blog/${post.slug}/`);
});

test('draft content is absent from production HTML and JavaScript', async ({ request }) => {
  const home = await (await request.get('/')).text();
  const scripts = [...home.matchAll(/<script[^>]+src="([^"]+)"/g)].map((match) => match[1]);
  const bodies = await Promise.all(scripts.map(async (path) => (await request.get(path)).text()));
  expect(home + bodies.join('\n')).not.toContain('Your next project update');
  expect(home + bodies.join('\n')).not.toContain('post-template');
});

for (const width of [390, 1280]) {
  test(`notebook pages are accessible and fit ${width}px screens`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const paths = ['/blog/', ...(firstPost ? [`/blog/${firstPost.slug}/`] : [])];
    for (const path of paths) {
      await page.goto(path);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations.filter((violation) => ['critical', 'serious'].includes(violation.impact ?? ''))).toEqual([]);
    }
  });
}

test('long code examples can be scrolled with the keyboard', async ({ page }) => {
  const post = published.find((entry: { html: string }) => entry.html.includes('<pre'));
  test.skip(!post, 'No published code examples yet.');
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto(`/blog/${post.slug}/`);
  const examples = page.getByRole('region', { name: 'Code example' });
  for (const example of await examples.all()) {
    if (await example.evaluate((element) => element.scrollWidth > element.clientWidth)) {
      await example.focus();
      await expect(example).toBeFocused();
      await page.keyboard.press('ArrowRight');
      await expect.poll(() => example.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
    }
  }
});

test.describe('static reading', () => {
  test.use({ javaScriptEnabled: false });
  test('published articles and archive navigation work without JavaScript', async ({ page }) => {
    test.skip(!firstPost, 'No published posts yet.');
    await page.goto('/blog/');
    await page.getByRole('heading', { name: firstPost.title }).getByRole('link').click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(firstPost.title);
    expect((await page.locator('.article-prose').innerText()).length).toBeGreaterThan(0);
    await page.getByRole('link', { name: '← Back to the notebook', exact: true }).click();
    await expect(page).toHaveURL(/\/blog\/$/);
  });
});

test('unknown article paths show a useful recovery page', async ({ page }) => {
  await page.goto('/404.html');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('This pagewandered off.');
  await page.getByRole('link', { name: 'Back to the notebook' }).click();
  await expect(page).toHaveURL(/\/blog\/$/);
});
