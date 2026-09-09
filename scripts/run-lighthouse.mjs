import { spawn } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import { createServer } from 'node:net';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import lighthouse from 'lighthouse';

const viteCli = fileURLToPath(new URL('../node_modules/vite/bin/vite.js', import.meta.url));

async function availablePort() {
  const socket = createServer();
  await new Promise((resolve, reject) => {
    socket.once('error', reject);
    socket.listen(0, '127.0.0.1', resolve);
  });
  const { port } = socket.address();
  await new Promise((resolve, reject) => socket.close((error) => error ? reject(error) : resolve()));
  return port;
}

async function waitForServer(url, server, deadlineMs = 60_000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < deadlineMs) {
    if (server.exitCode !== null) throw new Error(`Vite preview exited with code ${server.exitCode}`);
    try {
      if ((await fetch(url)).ok) return;
    } catch {
      // Vite preview is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

function assertScore(name, actual, minimum) {
  if (typeof actual !== 'number' || actual < minimum) {
    throw new Error(`Lighthouse ${name} score ${actual} is below budget ${minimum}`);
  }
}

async function main() {
  const previewPort = await availablePort();
  const url = `http://127.0.0.1:${previewPort}`;
  // Invoke Node directly so Windows does not need to spawn an npm.cmd shell.
  const server = spawn(process.execPath, [viteCli, 'preview', '--host', '127.0.0.1', '--port', String(previewPort), '--strictPort'], { stdio: 'inherit' });
  let browser;
  try {
    await new Promise((resolve, reject) => {
      server.once('spawn', resolve);
      server.once('error', reject);
    });
    await waitForServer(url, server);
    const debugPort = await availablePort();
    // Playwright handles Chrome shutdown and profile cleanup on Windows.
    browser = await chromium.launch({
      executablePath: process.env.CHROME_PATH || undefined,
      args: [`--remote-debugging-port=${debugPort}`],
    });
    const result = await lighthouse(url, { port: debugPort, logLevel: 'error', output: 'json' });
    if (!result) throw new Error('Lighthouse returned no report.');
    await writeFile('lighthouse-report.json', JSON.stringify(result.lhr, null, 2));
    if (result.lhr.runtimeError) throw new Error(result.lhr.runtimeError.message);
    const scores = Object.fromEntries(Object.entries(result.lhr.categories).map(([name, category]) => [name, category.score]));
    console.log(scores);
    assertScore('performance', scores.performance, 0.8);
    assertScore('accessibility', scores.accessibility, 0.9);
    assertScore('best-practices', scores['best-practices'], 0.85);
    assertScore('seo', scores.seo, 0.9);
  } finally {
    try {
      await browser?.close();
    } finally {
      server.kill('SIGTERM');
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
