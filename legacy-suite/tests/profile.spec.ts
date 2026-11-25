import { test, expect } from '@playwright/test';

const API = process.env.API_URL ?? 'http://localhost:8091';

test('customer reads their own profile', async ({ request }) => {
  const login = await request.post(`${API}/users/login`, {
    data: { email: process.env.CUSTOMER_EMAIL, password: process.env.CUSTOMER_PASSWORD },
  });
  expect(login.status()).toBe(200);
  const token = (await login.json()).access_token;
  const me = await request.get(`${API}/users/me`, { headers: { Authorization: `Bearer ${token}` } });
  expect(me.status()).toBe(200);
  expect((await me.json()).email).toBe(process.env.CUSTOMER_EMAIL);
});
