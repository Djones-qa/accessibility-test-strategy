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

  test('all form inputs have labels', async ({ page }) => {
    const results = await new AxeBuilder({ page: axePage(page) })
      .withRules(['label'])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('required fields have aria-required', async ({ page }) => {
    const fields = ['#firstName', '#lastName', '#email', '#address', '#city', '#zipCode', '#cardNumber', '#expiryDate', '#cvv'];
    for (const selector of fields) {
      const value = await page.locator(selector).getAttribute('aria-required');
      expect(value).toBe('true');
    }
  });

  test('form has accessible name', async ({ page }) => {
    const results = await new AxeBuilder({ page: axePage(page) })
      .withRules(['form-field-multiple-labels'])
      .analyze();
    expect(results.violations).toEqual([]);
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

  test('skip link is present and points to main content', async ({ page }) => {
    const skipLink = page.locator('a.skip-link');
    await expect(skipLink).toHaveAttribute('href', '#main-content');
  });
});
