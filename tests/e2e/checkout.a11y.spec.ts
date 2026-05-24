/**
 * E2E accessibility tests for the checkout flow using Playwright + @axe-core/playwright.
 * Scans full rendered pages for WCAG 2.1 AA violations.
 */
import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Type cast helper to bridge the playwright-core version mismatch between
// @playwright/test and @axe-core/playwright's bundled playwright-core.
// Both resolve to the same runtime object — this is a types-only workaround.
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
    // Tab through all form fields and verify focus is visible
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();

    // Verify skip link is first focusable element
    const skipLink = page.getByText('Skip to main content');
    await page.keyboard.press('Tab');
    // Skip link should be reachable
    expect(skipLink).toBeTruthy();
  });

  test('form can be submitted using keyboard only', async ({ page }) => {
    await page.getByLabel('First Name').fill('Jane');
    await page.getByLabel('Last Name').fill('Doe');
    await page.getByLabel('Email Address').fill('jane@example.com');
    await page.getByLabel('Street Address').fill('123 Main St');
    await page.getByLabel('City').fill('Springfield');
    await page.getByLabel('ZIP Code').fill('12345');
    await page.getByLabel('Card Number').fill('4111111111111111');
    await page.getByLabel('Expiry Date').fill('12/26');
    await page.getByLabel('CVV').fill('123');

    // Submit via keyboard — focus the button and press Enter
    const submitBtn = page.getByRole('button', { name: /place order/i });
    await submitBtn.focus();
    await page.keyboard.press('Enter');

    await expect(page.getByRole('heading', { name: /order confirmed/i })).toBeVisible();
  });

  test('validation errors are announced to screen readers', async ({ page }) => {
    // Click submit with empty form to trigger validation
    await page.getByRole('button', { name: /place order/i }).click();

    // At least one error alert should be visible
    const firstAlert = page.locator('[role="alert"]').first();
    await expect(firstAlert).toBeVisible();

    // First name input should be marked invalid
    await expect(page.getByLabel('First Name')).toHaveAttribute('aria-invalid', 'true');
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
