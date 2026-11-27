import { test as base, expect, type APIRequestContext } from '@playwright/test';

export type Role = 'admin' | 'customer';

export type Category = { id: string; name: string; slug: string };

function env(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}. Copy env.example to .env.`);
  return value;
}

export const apiUrl = () => env('API_URL');

function credentials(role: Role) {
  return role === 'admin'
    ? { email: env('ADMIN_EMAIL'), password: env('ADMIN_PASSWORD') }
    : { email: env('CUSTOMER_EMAIL'), password: env('CUSTOMER_PASSWORD') };
}

// Return the JWT access token.
export async function apiLogin(request: APIRequestContext, role: Role): Promise<string> {
  const response = await request.post(`${apiUrl()}/users/login`, { data: credentials(role) });
  expect(response.status(), `login as ${role}`).toBe(200);
  const { access_token } = await response.json();
  expect(access_token, `access_token for ${role}`).toBeTruthy();
  return access_token;
}

type Fixtures = {
  // Gets a token for a role through the API.
  tokenFor: (role: Role) => Promise<string>;
  // A fresh category created by the admin.
  category: Category;
  // Signs the page in as a role by putting the API token in localStorage.
  loginAs: (role: Role) => Promise<void>;
};

export const test = base.extend<Fixtures>({
  tokenFor: async ({ request }, use) => {
    await use((role) => apiLogin(request, role));
  },

  category: async ({ request, tokenFor }, use, testInfo) => {
    const adminToken = await tokenFor('admin');
    const headers = { Authorization: `Bearer ${adminToken}`, Accept: 'application/json' };

    // Unique per test, worker and repeat so parallel and --repeat-each runs never collide.
    const unique = `${Date.now()}-${testInfo.workerIndex}-${testInfo.repeatEachIndex}-${Math.random().toString(36).slice(2, 8)}`;
    const created = await request.post(`${apiUrl()}/categories`, {
      headers,
      data: { name: `Exercise E ${unique}`, slug: `exercise-e-${unique}` },
    });
    expect(created.status(), 'admin creates category').toBe(201);
    const category: Category = await created.json();

    await use(category);

    const deleted = await request.delete(`${apiUrl()}/categories/${category.id}`, { headers });
    expect(deleted.status(), `admin deletes category ${category.id}`).toBe(204);
  },

  loginAs: async ({ page, tokenFor }, use) => {
    await use(async (role) => {
      const token = await tokenFor(role);
      await page.context().addInitScript((value) => {
        window.localStorage.setItem('auth-token', value);
      }, token);
    });
  },
});

export { expect };
