import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { blogPlugin } from './scripts/blog.mjs';

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1];
const base = repoName && repoName !== 'ctclostio.github.io' ? `/${repoName}/` : '/';

export default defineConfig({
  plugins: [react(), blogPlugin()],
  base,
});
