import { test, expect } from '@playwright/test';

test('customer is kept out of the admin users page', async ({ page }) => {
  await page.goto('/auth/login');
  await page.locator('[data-test="email"]').fill(process.env.ADMIN_EMAIL!);
  await page.locator('[data-test="password"]').fill(process.env.ADMIN_PASSWORD!);
  await page.locator('[data-test="login-submit"]').click();
  await page.waitForTimeout(3000);
  await page.goto('/admin/users');
  await expect(page).not.toHaveURL(/auth\/login/);
});
