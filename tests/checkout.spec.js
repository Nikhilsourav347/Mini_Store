const { test, expect } = require('@playwright/test');
const path = require('path');
const { pathToFileURL } = require('url');

const PAGE = pathToFileURL(path.join(__dirname, '..', 'index.html')).href;

// Each test gets a fresh browser context, and we reload the page, so every check starts clean.
test.beforeEach(async ({ page }) => {
  await page.goto(PAGE);
  await expect(page.getByTestId('order-total')).toHaveText('$0.00');
});

const placeOrder = (page) => page.getByRole('button', { name: 'Place Order' });

test('TC-01 successful checkout shows a confirmation with a reference', async ({ page }) => {
  await page.getByTestId('add-notebook').click();
  await page.getByLabel('Full name').fill('Asha Rao');
  await placeOrder(page).click();

  await expect(page.getByTestId('confirmation')).toBeVisible();
  await expect(page.getByTestId('confirmation')).toContainText('Thank you, Asha Rao');
  await expect(page.getByTestId('order-reference')).toHaveText(/^ORD-[A-Z0-9]{6}$/);
});

test('TC-02 missing name blocks checkout, shows a message and keeps the cart', async ({ page }) => {
  await page.getByTestId('add-notebook').click();
  await placeOrder(page).click();

  await expect(page.getByTestId('error')).toHaveText('Please enter your full name.');
  await expect(page.getByTestId('confirmation')).toBeHidden();
  await expect(page.getByTestId('qty-notebook')).toHaveValue('1');   // cart preserved
  await expect(page.getByTestId('order-total')).toHaveText('$4.50');
});

test('TC-03 quantity changes update line totals and the exact order total', async ({ page }) => {
  await page.getByTestId('add-notebook').click();   // $4.50
  await page.getByTestId('add-pen-set').click();    // $12.00
  await expect(page.getByTestId('order-total')).toHaveText('$16.50');

  await page.getByTestId('qty-notebook').fill('3'); // 3 x $4.50 = $13.50
  await expect(page.getByTestId('line-total-notebook')).toHaveText('$13.50');
  await expect(page.getByTestId('order-total')).toHaveText('$25.50');

  await page.getByTestId('qty-pen-set').fill('2');  // 2 x $12.00 = $24.00
  await expect(page.getByTestId('line-total-pen-set')).toHaveText('$24.00');
  await expect(page.getByTestId('order-total')).toHaveText('$37.50');
});

// Bonus automated check for the double-click risk (the brief also asks for it manually).
test('TC-04 double-clicking Place Order gives one confirmation', async ({ page }) => {
  await page.getByTestId('add-pen-set').click();
  await page.getByLabel('Full name').fill('Asha Rao');
  await placeOrder(page).dblclick();

  await expect(page.getByTestId('confirmation')).toHaveCount(1);
  await expect(page.getByText('Your order has been placed.')).toHaveCount(1);
  await expect(page.getByTestId('order-reference')).toHaveText(/^ORD-[A-Z0-9]{6}$/);
});
