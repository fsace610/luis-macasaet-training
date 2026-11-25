import { test, expect } from '@playwright/test';

test('customer adds a product to the cart', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-test="product-name"]').first().click();
  await page.locator('[data-test="add-to-cart"]').click();
  await expect(page.locator('[data-test="cart-quantity"]')).toHaveText('1');
});

test('cart page lists the product', async ({ page }) => {
  await page.goto('/checkout');
  await expect(page.locator('[data-test="product-title"]')).toHaveCount(1);
  await expect(page.locator('[data-test="cart-quantity"]')).toHaveText('1');
});
