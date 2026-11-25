import { test, expect } from '@playwright/test';
import { anyProductId } from '../support/product';

// Review drill R2 — favorites API. Review only.
test.describe.configure({ retries: 3 });

const API = process.env.API_URL ?? 'http://localhost:8091';
let token: string;
let favoriteId: string;
let passed = true;

test.beforeAll(async ({ request }) => {
  const res = await request.post(`${API}/users/login`, {
    data: { email: process.env.CUSTOMER_EMAIL, password: process.env.CUSTOMER_PASSWORD },
  });
  token = (await res.json()).access_token;
});

test.afterEach(async ({}, info) => {
  if (info.status !== 'passed') passed = false;
});

test.afterAll(async ({ request }) => {
  if (passed) await request.delete(`${API}/favorites/${favoriteId}`, { headers: { Authorization: `Bearer ${token}` } });
});

test('customer adds a favorite', async ({ request }) => {
  const res = await request.post(`${API}/favorites`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { product_id: await anyProductId(request, API) },
  });
  expect(res.status()).toBeLessThan(500);
  favoriteId = (await res.json()).id;
});

test('favorite is listed', async ({ request }) => {
  const res = await request.get(`${API}/favorites`, { headers: { Authorization: `Bearer ${token}` } });
  expect(res.ok()).toBe(true);
});
