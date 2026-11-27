import { test as setup, expect } from '@playwright/test';
import { authFile } from './fixtures';

const roles = [
  { role: 'customer', emailVar: 'CUSTOMER_EMAIL', passwordVar: 'CUSTOMER_PASSWORD', name: 'Jane Doe' },
  { role: 'admin', emailVar: 'ADMIN_EMAIL', passwordVar: 'ADMIN_PASSWORD', name: 'John Doe' },
] as const;

for (const { role, emailVar, passwordVar, name } of roles) {
  setup(`authenticate as ${role}`, async ({ page }) => {
    const email = process.env[emailVar];
    const password = process.env[passwordVar];
    if (!email || !password) throw new Error(`Missing ${emailVar} or ${passwordVar} in .env`);

    await page.goto('/auth/login');
    await page.getByTestId('email').fill(email);
    await page.getByTestId('password').fill(password);

    const loginResponse = page.waitForResponse(
      (res) => res.url().endsWith('/users/login') && res.request().method() === 'POST',
    );
    await page.getByTestId('login-submit').click();
    expect((await loginResponse).status()).toBe(200);

    await expect(page.getByTestId('nav-menu')).toHaveText(name);
    await page.context().storageState({ path: authFile(role) });
  });
}
