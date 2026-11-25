import { test, expect } from '@playwright/test';

const API = process.env.API_URL ?? 'http://localhost:8091';

test('only admins can list users', async ({ request }) => {
  const res = await request.get(`${API}/users`);
  expect(res.status()).not.toBe(200);
});

test.skip('admin can list users', async ({ request }) => {
  const login = await request.post(`${API}/users/login`, {
    data: { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD },
  });
  const res = await request.get(`${API}/users`, {
    headers: { Authorization: `Bearer ${(await login.json()).access_token}` },
  });
  expect(res.status()).toBe(200);
});
