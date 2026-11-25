import { test, expect } from '@playwright/test';
import { anyProductId } from '../support/product';

// Day 3 drill. This file passes when run the default way and fails in other ways.
// Find out which runs fail and why (use the trace), then fix it so that every test passes alone,
// with --repeat-each=3, and with --fully-parallel --workers=4.
const API = process.env.API_URL ?? 'http://localhost:8091';
let token = '';
let favoriteId = '';

test('customer logs in', async ({ request }) => {
  const res = await request.post(`${API}/users/login`, {
    data: { email: process.env.CUSTOMER_EMAIL, password: process.env.CUSTOMER_PASSWORD },
  });
  expect(res.status()).toBe(200);
  token = (await res.json()).access_token;
});

test('customer adds a favorite', async ({ request }) => {
  const res = await request.post(`${API}/favorites`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { product_id: await anyProductId(request, API) },
  });
  expect(res.status()).toBe(200);
  favoriteId = (await res.json()).id;
});

test('customer removes the favorite', async ({ request }) => {
  const res = await request.delete(`${API}/favorites/${favoriteId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  expect(res.status()).toBe(204);
});
