import { test, expect } from '@playwright/test';

// Review drill R3 — users endpoint, "admin only". Review only.
const API = process.env.API_URL ?? 'http://localhost:8091';

async function login(request: any, email?: string, password?: string) {
  const res = await request.post(`${API}/users/login`, { data: { email, password } });
  return (await res.json()).access_token as string;
}

test('admin can list users', async ({ request }) => {
  const token = await login(request, process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD);
  const res = await request.get(`${API}/users`, { headers: { Authorization: `Bearer ${token}` } });
  expect(res.status()).toBe(200);
});

test('customer cannot list users', async ({ request }) => {
  const customerToken = await login(request, process.env.CUSTOMER_EMAIL, process.env.CUSTOMER_PASSWORD);
  const adminToken = await login(request, process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD);
  const res = await request.get(`${API}/users`, { headers: { Authorization: `Bearer ${adminToken}` } });
  expect(res.status()).not.toBe(403);
});

test('anonymous cannot list users', async ({ request }) => {
  const res = await request.get(`${API}/users`);
  expect(res.ok()).toBeFalsy();
});
