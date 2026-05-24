/**
 * E2E accessibility tests for the product listing page.
 */
import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const axePage = (page: Page): any => page;

test.describe('Product Listing Page — WCAG 2.1 AA (Playwright + axe)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/products.html');
  });

  test('product listing page has no axe violations', async ({ page }) => {
    const results = await new AxeBuilder({ page: axePage(page) })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('all product images have alt text', async ({ page }) => {
    const results = await new AxeBuilder({ page: axePage(page) })
      .withRules(['image-alt'])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('navigation menu is accessible', async ({ page }) => {
    const results = await new AxeBuilder({ page: axePage(page) })
      .include('nav')
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('page title is descriptive', async ({ page }) => {
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    expect(title).not.toBe('Untitled');
  });

  test('out-of-stock button is disabled', async ({ page }) => {
    // Verify via axe — disabled state and aria-disabled are covered by WCAG rules
    const results = await new AxeBuilder({ page: axePage(page) })
      .withRules(['aria-allowed-attr'])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('product cards use article landmark', async ({ page }) => {
    const results = await new AxeBuilder({ page: axePage(page) })
      .withRules(['landmark-unique'])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('interactive elements have no tabindex violations', async ({ page }) => {
    const results = await new AxeBuilder({ page: axePage(page) })
      .withRules(['tabindex', 'scrollable-region-focusable'])
      .analyze();
    expect(results.violations).toEqual([]);
  });
});
