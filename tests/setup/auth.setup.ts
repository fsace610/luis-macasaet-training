import { test as setup, expect } from '@playwright/test';
import { authFile, credentials, roles, Role } from '../../fixtures/roles';

// Setup project: logs in once per role through the real login form and saves the
// browser state (Toolshop keeps its JWT in localStorage['auth-token']).
// Role tests depend on this project, so they start already signed in.
for (const role of Object.keys(roles) as Role[]) {
  setup(`authenticate as ${role}`, async ({ page }) => {
    const { email, password } = credentials(role);

    await page.goto('/auth/login');
    await page.getByTestId('email').fill(email);
    await page.getByTestId('password').fill(password);
    const loginResponse = page.waitForResponse(
      (res) => res.url().endsWith('/users/login') && res.request().method() === 'POST',
    );
    await page.getByTestId('login-submit').click();

    // A bad password or a locked account fails here with the real status code,
    // instead of as a vague UI timeout.
    expect((await loginResponse).status()).toBe(200);

    // Wait for proof the UI is signed in before saving, or we would save a guest state.
    // The local dev server can be slow under parallel load, so allow more than 5s.
    await expect(page.getByTestId('nav-menu')).toHaveText(roles[role].displayName, {
      timeout: 15_000,
    });
    await expect
      .poll(() => page.evaluate(() => localStorage.getItem('auth-token')))
      .toBeTruthy();

    await page.context().storageState({ path: authFile(role) });
  });
}
