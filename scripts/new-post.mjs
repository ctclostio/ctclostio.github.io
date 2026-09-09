import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

export async function createPost(title, project, directory = fileURLToPath(new URL('../content/blog/', import.meta.url))) {
  if (typeof title !== 'string' || !title.trim()) throw new Error('Give the post a title.');
  const slug = title.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if (!slug) throw new Error('Use a title containing at least one letter or number for the filename.');
  const filename = resolve(directory, `${slug}.md`);
  const content = `---
title: ${JSON.stringify(title.trim())}
date: "${new Date().toISOString().slice(0, 10)}"
description: "A sentence about what changed or what you learned."
${project ? `project: ${JSON.stringify(project)}\n` : ''}tags: [development]
draft: true
---
Start with the change, discovery, or question that brought you here.

## What I tried

Describe the experiment.

## What I learned

What worked, what surprised you, and what still needs figuring out?

## Next on the workbench

What will you try next?
`;
  await mkdir(directory, { recursive: true });
  // Refuse to overwrite an existing article, even if it is still a draft.
  await writeFile(filename, content, { flag: 'wx' });
  return filename;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const { values, positionals } = parseArgs({ options: { project: { type: 'string' } }, allowPositionals: true });
    if (positionals.length !== 1) throw new Error('Usage: npm run new:post -- "Post title" --project "Project name"');
    const filename = await createPost(positionals[0], values.project);
    console.log(`Created draft: ${filename}\nWrite your post, then set draft: false when it is ready to publish.`);
  } catch (error) {
    console.error(error.code === 'EEXIST' ? 'A post with that filename already exists. Choose another title.' : error.message);
    process.exitCode = 1;
  }
}
