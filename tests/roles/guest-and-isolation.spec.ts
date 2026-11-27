import { test, expect } from '../../fixtures';

test.describe('guest', () => {
  for (const path of ['/account', '/admin/dashboard']) {
    test(`guest is sent to login from ${path}`, async ({ guestPage: page }) => {
      await page.goto(path);

      await expect(page).toHaveURL(/\/auth\/login$/);
      await expect(page.getByTestId('nav-sign-in')).toBeVisible();
    });
  }
});

test.describe('session isolation', () => {
  test('two customers signed in at once each see their own account', async ({
    customerPage,
    customer2Page,
  }) => {
    await Promise.all([customerPage.goto('/account'), customer2Page.goto('/account')]);

    // Separate browser contexts: neither login leaks into the other.
    await expect(customerPage.getByTestId('nav-menu')).toHaveText('Jane Doe');
    await expect(customer2Page.getByTestId('nav-menu')).toHaveText('Jack Howe');
  });
});
