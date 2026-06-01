import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('home page has no serious accessibility violations', async ({ page }) => {
  await page.goto('/');

  const results = await new AxeBuilder({ page }).include('body').analyze();
  const seriousViolations = results.violations.filter((violation) =>
    ['critical', 'serious'].includes(violation.impact ?? ''),
  );

  expect(seriousViolations).toEqual([]);
});

test('keyboard navigation reaches the main calls to action and contact form', async ({ page }) => {
  await page.goto('/');

  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();

  await page.getByRole('link', { name: 'Contact' }).first().click();
  await expect(page.getByRole('heading', { name: 'Send a short brief or start with the code.' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Open email draft|Send message/ })).toBeVisible();
});
