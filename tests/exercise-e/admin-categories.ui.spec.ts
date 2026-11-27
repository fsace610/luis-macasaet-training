import { test, expect } from './fixtures';

test.describe('Admin categories page access', () => {
  test('a customer is sent to the login page', async ({ page, loginAs }) => {
    await loginAs('customer');

    await page.goto('/admin/categories');

    await expect(page).toHaveURL(/\/auth\/login$/);
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Categories' })).toHaveCount(0);
  });

  test('an admin sees the categories page', async ({ page, loginAs }) => {
    await loginAs('admin');

    await page.goto('/admin/categories');

    await expect(page).toHaveURL(/\/admin\/categories$/);
    await expect(page.getByRole('heading', { name: 'Categories' })).toBeVisible();
    await expect(page.getByRole('table')).toBeVisible();
  });
});
