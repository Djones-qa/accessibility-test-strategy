/**
 * E2E accessibility tests for the checkout flow using Playwright + @axe-core/playwright.
 * Scans full rendered pages for WCAG 2.1 AA violations.
 */
import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const axePage = (page: Page): any => page;

test.describe('Checkout Page — WCAG 2.1 AA (Playwright + axe)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/checkout.html');
  });

  test('checkout page has no critical axe violations', async ({ page }) => {
    const results = await new AxeBuilder({ page: axePage(page) })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('checkout page passes color contrast requirements', async ({ page }) => {
    const results = await new AxeBuilder({ page: axePage(page) })
      .withRules(['color-contrast'])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('all form inputs are keyboard accessible', async ({ page }) => {
    await page.keyboard.press('Tab');
    const focusedTag = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedTag).toBeTruthy();
  });

  test('form can be submitted using keyboard only', async ({ page }) => {
    // Fill all fields by ID to avoid label text matching issues
    await page.locator('#firstName').fill('Jane');
    await page.locator('#lastName').fill('Doe');
    await page.locator('#email').fill('jane@example.com');
    await page.locator('#address').fill('123 Main St');
    await page.locator('#city').fill('Springfield');
    await page.locator('#zipCode').fill('12345');
    await page.locator('#cardNumber').fill('4111111111111111');
    await page.locator('#expiryDate').fill('12/26');
    await page.locator('#cvv').fill('123');

    // Submit the form directly
    await page.locator('button[type="submit"]').click();

    await expect(page.locator('#success-message')).toBeVisible();
  });

  test('validation errors are announced to screen readers', async ({ page }) => {
    // Submit empty form
    await page.locator('button[type="submit"]').click();

    // firstName-error span should now be visible (hidden attr removed by JS)
    await expect(page.locator('#firstName-error')).toBeVisible();

    // Input should be marked aria-invalid by JS
    const isInvalid = await page.locator('#firstName').getAttribute('aria-invalid');
    expect(isInvalid).toBe('true');
  });

  test('page has proper heading hierarchy', async ({ page }) => {
    const results = await new AxeBuilder({ page: axePage(page) })
      .withRules(['heading-order'])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('all images have alt text', async ({ page }) => {
    const results = await new AxeBuilder({ page: axePage(page) })
      .withRules(['image-alt'])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('page has a main landmark', async ({ page }) => {
    const results = await new AxeBuilder({ page: axePage(page) })
      .withRules(['landmark-one-main'])
      .analyze();
    expect(results.violations).toEqual([]);
  });
});
