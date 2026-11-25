import { test, expect } from '@playwright/test';
import { anyProductId } from '../../support/product';

const API = process.env.API_URL ?? 'http://localhost:8091';

test('customer saves a favorite', async ({ request }) => {
  const login = await request.post(`${API}/users/login`, {
    data: { email: process.env.CUSTOMER_EMAIL, password: process.env.CUSTOMER_PASSWORD },
  });
  const token = (await login.json()).access_token;
  const res = await request.post(`${API}/favorites`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { product_id: await anyProductId(request, API) },
  });
  expect(res.status()).toBe(200);
});
