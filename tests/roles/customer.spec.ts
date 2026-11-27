import { test, expect } from '../../fixtures';

test.describe('customer role', () => {
  test('customer can open My account', async ({ customerPage: page }) => {
    await page.goto('/account');

    await expect(page).toHaveURL(/\/account$/);
    await expect(page.getByTestId('page-title')).toHaveText('My account');
    await expect(page.getByTestId('nav-menu')).toHaveText('Jane Doe');
  });

  test('customer is sent to login from the admin dashboard', async ({ customerPage: page }) => {
    await page.goto('/admin/dashboard');

    // AdminAuthGuard rejects role "user" and redirects. The dashboard must not render.
    await expect(page).toHaveURL(/\/auth\/login$/);
    await expect(page.getByTestId('login-form')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Sales over the years' })).toHaveCount(0);
  });

  test('customer sees the product looked up at runtime', async ({
    customerPage: page,
    request,
    apiUrl,
    productId,
  }) => {
    const res = await request.get(`${apiUrl}/products/${productId}`);
    expect(res.status()).toBe(200);
    const product = await res.json();

    await page.goto(`/product/${productId}`);

    await expect(page.getByTestId('product-name')).toHaveText(product.name);
    await expect(page.getByTestId('add-to-favorites')).toBeVisible();
  });
});
