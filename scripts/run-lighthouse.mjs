import { spawn } from 'node:child_process';
import { readFile, rm } from 'node:fs/promises';

const url = 'http://127.0.0.1:4173';
const reportPath = 'lighthouse-report.json';
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: options.stdio ?? 'inherit',
      shell: false,
      ...options,
    });

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`));
      }
    });
  });
}

async function waitForServer(deadlineMs = 60_000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < deadlineMs) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch {
      // Vite preview is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Timed out waiting for ${url}`);
}

function assertScore(name, actual, minimum) {
  if (typeof actual !== 'number' || actual < minimum) {
    throw new Error(`Lighthouse ${name} score ${actual} is below budget ${minimum}`);
  }
}

async function main() {
  await rm(reportPath, { force: true });

  const server = spawn(npmCommand, ['run', 'preview', '--', '--host', '127.0.0.1', '--port', '4173'], {
    stdio: 'inherit',
    shell: false,
  });

  try {
    await waitForServer();
    await run(npmCommand, [
      'exec',
      '--',
      'lighthouse',
      url,
      '--chrome-flags=--headless=new --no-sandbox',
      '--output=json',
      `--output-path=${reportPath}`,
      '--quiet',
    ]);

    const report = JSON.parse(await readFile(reportPath, 'utf8'));
    assertScore('performance', report.categories.performance?.score, 0.8);
    assertScore('accessibility', report.categories.accessibility?.score, 0.9);
    assertScore('best-practices', report.categories['best-practices']?.score, 0.85);
    assertScore('seo', report.categories.seo?.score, 0.9);
  } finally {
    server.kill('SIGTERM');
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
