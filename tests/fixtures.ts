import { test as base, expect, request as playwrightRequest, APIRequestContext } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { anyProductId } from '../support/product';

export const authFile = (role: 'customer' | 'admin'): string =>
  path.join(__dirname, '..', '.auth', `${role}.json`);

type Favorite = { id: string; productId: string; productName: string };

type Fixtures = {
  api: APIRequestContext;
  favorite: Favorite;
};

function customerToken(): string {
  const state = JSON.parse(fs.readFileSync(authFile('customer'), 'utf-8'));
  const token = state.origins
    .flatMap((o: { localStorage: { name: string; value: string }[] }) => o.localStorage)
    .find((item: { name: string }) => item.name === 'auth-token')?.value;
  if (!token) throw new Error('No auth-token in .auth/customer.json. Did the setup project run?');
  return token;
}

export const test = base.extend<Fixtures>({
  api: async ({}, use) => {
    const apiUrl = process.env.API_URL;
    if (!apiUrl) throw new Error('Missing API_URL in .env');

    const api = await playwrightRequest.newContext({
      baseURL: apiUrl,
      extraHTTPHeaders: { Authorization: `Bearer ${customerToken()}`, Accept: 'application/json' },
    });
    await use(api);
    await api.dispose();
  },

  favorite: async ({ api }, use) => {
    // Seeded favorites exist and a duplicate returns 409, so pick a product not yet favorited.
    const existing = await api.get('/favorites');
    expect(existing.status()).toBe(200);
    const taken = new Set((await existing.json()).map((f: { product_id: string }) => f.product_id));

    let productId = await anyProductId(api, process.env.API_URL!);
    if (taken.has(productId)) {
      const products = await api.get('/products');
      expect(products.status()).toBe(200);
      const free = (await products.json()).data.find((p: { id: string }) => !taken.has(p.id));
      if (!free) throw new Error('Every product on page 1 is already a favorite. Re-seed Toolshop.');
      productId = free.id;
    }

    const created = await api.post('/favorites', { data: { product_id: productId } });
    expect(created.status()).toBe(201);
    const { id } = await created.json();

    const product = await api.get(`/products/${productId}`);
    expect(product.status()).toBe(200);
    const { name } = await product.json();

    await use({ id, productId, productName: name });

    const deleted = await api.delete(`/favorites/${id}`);
    expect(deleted.status()).toBe(204);
  },
});

export { expect };
