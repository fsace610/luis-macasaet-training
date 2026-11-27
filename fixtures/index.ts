import { test as base, expect, Page } from '@playwright/test';
import { anyProductId } from '../support/product';
import { authFile, Role } from './roles';

type RoleFixtures = {
  /** API base URL from .env (API_URL). */
  apiUrl: string;
  /** A product ID looked up at runtime, because IDs change on every re-seed. */
  productId: string;
  /** A page already signed in as the customer (Jane Doe). */
  customerPage: Page;
  /** A page already signed in as the second customer (Jack Howe). */
  customer2Page: Page;
  /** A page already signed in as the admin (John Doe). */
  adminPage: Page;
  /** A page with no saved login, for guest checks. */
  guestPage: Page;
};

// Each role page gets its own browser context, so two roles can be used in one test
// without sharing cookies or localStorage. The context is closed after the test.
function rolePage(role: Role | null) {
  return async (
    { browser }: { browser: import('@playwright/test').Browser },
    use: (page: Page) => Promise<void>,
  ) => {
    const context = await browser.newContext({
      storageState: role ? authFile(role) : { cookies: [], origins: [] },
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  };
}

export const test = base.extend<RoleFixtures>({
  apiUrl: async ({}, use) => {
    const url = process.env.API_URL;
    if (!url) throw new Error('Missing API_URL. Copy env.example to .env.');
    await use(url);
  },
  productId: async ({ request, apiUrl }, use) => {
    await use(await anyProductId(request, apiUrl));
  },
  customerPage: rolePage('customer'),
  customer2Page: rolePage('customer2'),
  adminPage: rolePage('admin'),
  guestPage: rolePage(null),
});

export { expect };
