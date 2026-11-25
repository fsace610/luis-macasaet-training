import { APIRequestContext, expect } from '@playwright/test';

// Toolshop creates new product IDs every time it re-seeds (php artisan migrate:fresh --seed),
// so never store a product ID in .env. Look one up at runtime instead.
export async function anyProductId(request: APIRequestContext, api: string): Promise<string> {
  const res = await request.get(`${api}/products`);
  expect(res.status()).toBe(200);
  const body = await res.json();
  return body.data[0].id as string;
}
