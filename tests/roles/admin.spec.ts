import { test, expect } from '../../fixtures';

test.describe('admin role', () => {
  test('admin can open the dashboard', async ({ adminPage: page }) => {
    await page.goto('/admin/dashboard');

    await expect(page).toHaveURL(/\/admin\/dashboard$/);
    await expect(page.getByTestId('page-title')).toHaveText('Sales over the years');
    await expect(page.getByTestId('nav-menu')).toHaveText('John Doe');
  });

  test('admin can open the users list', async ({ adminPage: page }) => {
    await page.goto('/admin/users');

    await expect(page.getByTestId('page-title')).toHaveText('Users');
    await expect(page.getByRole('cell', { name: 'customer@practicesoftwaretesting.com' })).toBeVisible();
  });

  test('admin is sent to login from My account', async ({ adminPage: page }) => {
    await page.goto('/account');

    // UserAuthGuard only allows role "user", so the admin is redirected.
    await expect(page).toHaveURL(/\/auth\/login$/);
    await expect(page.getByTestId('login-form')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'My account' })).toHaveCount(0);
  });
});
