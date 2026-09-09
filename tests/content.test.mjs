import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve, relative } from 'node:path';
import { loadPosts, parsePost, rssFeed } from '../scripts/blog.mjs';
import { createPost } from '../scripts/new-post.mjs';

const source = (metadata = '', body = 'A useful discovery.') => `---\ntitle: "An orbit & a detour"\ndescription: "Notes <from> the workshop"\ndate: "2026-09-09"\ndraft: false\n${metadata}---\n${body}`;

async function withDirectory(run) {
  const root = resolve(tmpdir());
  const directory = await mkdtemp(join(root, 'hannadio-blog-test-'));
  try { await run(directory); }
  finally {
    const local = relative(root, resolve(directory));
    if (!local || local.startsWith('..') || !local.startsWith('hannadio-blog-test-')) throw new Error('Unexpected test directory; refusing cleanup.');
    await rm(directory, { recursive: true, force: true, maxRetries: 3, retryDelay: 150 });
  }
}

test('Markdown supports rich content and stable, unique heading links without executing HTML', () => {
  const post = parsePost(source('', '## A discovery\n\n**Useful** [code](https://github.com).\n\n## A discovery\n\n```go\nfmt.Println("hello")\n```\n\n<script>alert(1)</script>\n\n[bad](javascript:alert(1))'), 'an-orbit.md');
  assert.deepEqual(post.headings.map((heading) => heading.id), ['note-a-discovery', 'note-a-discovery-2']);
  assert.match(post.html, /<strong>Useful<\/strong>/);
  assert.match(post.html, /class="language-go"/);
  assert.doesNotMatch(post.html, /<script>|href="javascript:/);
});

test('invalid publication metadata fails with the filename', () => {
  assert.throws(() => parsePost(source().replace('draft: false', 'draft: "false"'), 'bad-draft.md'), /bad-draft.md: Set draft/);
  assert.throws(() => parsePost(source().replace('2026-09-09', '2026-02-31'), 'bad-date.md'), /bad-date.md: date/);
  assert.throws(() => parsePost(source('', '# Another page title'), 'bad-heading.md'), /Use ## and ###/);
  assert.throws(() => parsePost(source(), '../escape.md'), /filename/);
});

test('drafts are excluded before content is bundled and published posts are newest first', async () => {
  await withDirectory(async (directory) => {
    await writeFile(join(directory, 'draft.md'), source().replace('draft: false', 'draft: true').replace('A useful discovery.', 'DRAFT_ONLY_CANARY'));
    await writeFile(join(directory, 'older.md'), source().replace('2026-09-09', '2026-08-01'));
    await writeFile(join(directory, 'newer.md'), source());
    const posts = await loadPosts(directory);
    assert.deepEqual(posts.map((post) => post.slug), ['newer', 'older']);
    assert.doesNotMatch(JSON.stringify(posts), /DRAFT_ONLY_CANARY/);
    assert.doesNotMatch(rssFeed(posts), /draft\/|DRAFT_ONLY_CANARY/);
    assert.match(rssFeed(posts), /An orbit &amp; a detour/);
    assert.match(rssFeed(posts), /Notes &lt;from&gt; the workshop/);
  });
});

test('the authoring command creates a valid draft and never overwrites a post', async () => {
  await withDirectory(async (directory) => {
    const filename = await createPost('A better orbit camera', 'GoStarMap', directory);
    const text = await readFile(filename, 'utf8');
    const post = parsePost(text, 'a-better-orbit-camera.md');
    assert.equal(post.draft, true);
    assert.equal(post.project, 'GoStarMap');
    await assert.rejects(createPost('A better orbit camera', 'GoStarMap', directory), { code: 'EEXIST' });
    assert.equal(await readFile(filename, 'utf8'), text);
    assert.deepEqual(await loadPosts(directory), []);
  });
});
