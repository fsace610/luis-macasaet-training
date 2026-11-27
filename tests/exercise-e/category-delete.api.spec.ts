import { test, expect, apiUrl } from './fixtures';

test.describe('Categories API: delete permissions', () => {
  test('a customer cannot delete a category, and the category still exists', async ({ request, category, tokenFor }) => {
    const customerToken = await tokenFor('customer');

    const response = await request.delete(`${apiUrl()}/categories/${category.id}`, {
      headers: { Authorization: `Bearer ${customerToken}`, Accept: 'application/json' },
    });

    expect(response.status()).toBe(403);
    expect(await response.json()).toEqual({ message: 'Forbidden' });

    const lookup = await request.get(`${apiUrl()}/categories/tree/${category.id}`);
    expect(lookup.status()).toBe(200);
    expect(await lookup.json()).toMatchObject({
      id: category.id,
      name: category.name,
      slug: category.slug,
    });
  });
});
