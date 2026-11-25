import { test, expect } from '@playwright/test';

test('search finds pliers', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-test="search-query"]').fill('Pliers');
  await page.locator('[data-test="search-submit"]').click();
  const count = await page.locator('[data-test="product-name"]').count();
  expect(count).toBeGreaterThan(0);
});

test('search with no match shows the empty message', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-test="search-query"]').fill('zzzz-no-such-tool');
  await page.locator('[data-test="search-submit"]').click();
  await page.waitForTimeout(3000);
  await expect(page.locator('[data-test="no-results"]')).toBeVisible();
});
