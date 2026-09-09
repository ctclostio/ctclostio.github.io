import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('home page and expanded notes have no serious accessibility violations', async ({ page }) => {
  await page.goto('/');
  for (const expanded of [false, true]) {
    if (expanded) await page.locator('#case-study-gostarmap').getByRole('button', { name: 'Read field notes +' }).click();
    const results = await new AxeBuilder({ page }).include('body').analyze();
    expect(results.violations.filter((violation) => ['critical', 'serious'].includes(violation.impact ?? ''))).toEqual([]);
  }
});

test('keyboard navigation reaches the work and working contact route', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Come have a look' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#featured$/);
  await expect(page.locator('#contact').getByRole('link', { name: 'Find me on GitHub' })).toHaveAttribute('href', 'https://github.com/ctclostio');
  await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
});

test('filters, empty state, and a random discovery remain usable', async ({ page }) => {
  await page.goto('/');
  const cards = page.locator('#projects .project-card');
  const allCount = await cards.count();
  await page.getByRole('button', { name: 'Games', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Games', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(cards).toHaveCount(3);
  await page.getByRole('searchbox').fill('a project that does not exist');
  await expect(cards).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'No discoveries in this drawer.' })).toBeVisible();
  await page.getByRole('button', { name: 'Show all projects' }).click();
  await expect(cards).toHaveCount(allCount);
  await expect(page.getByRole('searchbox')).toHaveValue('');
  await page.getByRole('button', { name: 'Pick a rabbit hole' }).click();
  await expect(cards).toHaveCount(1);
  await expect(page.getByRole('searchbox')).not.toHaveValue('');
});

test('notebook responds to the keyboard and respects reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const planet = page.locator('.orbit-planet').first();
  const before = await planet.getAttribute('style');
  await page.getByRole('button', { name: 'Nudge the universe' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.notebook-note')).toHaveText('A little momentum goes a long way.');
  await expect(planet).not.toHaveAttribute('style', before!);
  expect(await planet.evaluate((element) => getComputedStyle(element).transitionDuration)).toBe('0s');
});

test('field note deep links open and can be reopened after closing', async ({ page }) => {
  await page.goto('/#case-study-gostarmap');
  const study = page.locator('#case-study-gostarmap');
  await expect(study.getByRole('button', { name: 'Close field notes −' })).toHaveAttribute('aria-expanded', 'true');
  await expect(study.getByRole('heading', { name: 'Implementation details' })).toBeVisible();
  await study.getByRole('button', { name: 'Close field notes −' }).click();
  await expect(study.getByRole('heading', { name: 'Implementation details' })).toBeHidden();
  await page.locator('#featured .project-card').filter({ has: page.getByRole('heading', { name: 'GoStarMap', exact: true }) }).getByRole('link', { name: 'Field notes' }).click();
  await expect(study.getByRole('heading', { name: 'Implementation details' })).toBeVisible();
});

for (const width of [320, 390, 768]) {
  test(`layout fits a ${width}px screen`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await page.getByRole('button', { name: 'Nudge the universe' }).click();
    await expect(page.locator('.notebook-note')).toHaveText('A little momentum goes a long way.');
    if (width === 390) {
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations.filter((violation) => ['critical', 'serious'].includes(violation.impact ?? ''))).toEqual([]);
    }
  });
}
