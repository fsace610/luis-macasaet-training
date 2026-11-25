import { test, expect } from '@playwright/test';

// Review drill R1 — checkout. Review only: do not run or fix it.
// For each issue: what it is, why it matters, the fix. Then rank the issues from most to least serious.
let cartCount = 0;

test('add pliers to the cart', async ({ page }) => {
  await page.goto('/');
  await page.locator('.card:nth-child(2) a').click();
  await page.click('[data-test="add-to-cart"]');
  await page.waitForTimeout(2000);
  cartCount = Number(await page.locator('[data-test="cart-quantity"]').innerText());
});

test('cart shows the item', async ({ page }) => {
  await page.goto('/checkout');
  expect(cartCount).toBe(1);
  const visible = await page.locator('[data-test="product-title"]').isVisible();
  expect(visible).toBeTruthy();
});

test('total is calculated', async ({ page }) => {
  await page.goto('/checkout');
  const total = await page.locator('[data-test="cart-total"]').innerText();
  expect(total).toBeTruthy();
});
