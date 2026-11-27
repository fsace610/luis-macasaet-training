import { test, expect, authFile } from './fixtures';

test.describe('customer', () => {
  test.use({ storageState: authFile('customer') });

  test('(a) customer opening /admin/dashboard lands on /auth/login', async ({ page }) => {
    await page.goto('/admin/dashboard');

    await expect(page).toHaveURL(/\/auth\/login$/);
    await expect(page.getByTestId('login-form')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Sales over the years' })).toHaveCount(0);
  });

  test('(c) the fixture favorite is in the customer favorites list', async ({ page, favorite }) => {
    await page.goto('/account/favorites');

    await expect(page.getByTestId('page-title')).toHaveText('Favorites');
    const card = page.getByTestId(`favorite-${favorite.id}`);
    await expect(card.getByTestId('product-name')).toHaveText(favorite.productName);
  });
});

test.describe('admin', () => {
  test.use({ storageState: authFile('admin') });

  test('(b) admin sees the dashboard', async ({ page }) => {
    await page.goto('/admin/dashboard');

    await expect(page).toHaveURL(/\/admin\/dashboard$/);
    await expect(page.getByTestId('page-title')).toHaveText('Sales over the years');
  });
});
