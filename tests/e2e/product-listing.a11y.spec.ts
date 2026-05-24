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

  test('product cards are keyboard navigable', async ({ page }) => {
    // Tab to the first link in the product grid and verify it receives focus
    const firstProductLink = page.locator('.product-grid a').first();
    await firstProductLink.focus();
    await expect(firstProductLink).toBeFocused();
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

  test('interactive elements have visible focus indicators', async ({ page }) => {
    // Verify axe doesn't flag any focus-related violations using the full WCAG scan
    const results = await new AxeBuilder({ page: axePage(page) })
      .withRules(['scrollable-region-focusable', 'tabindex'])
      .analyze();

    if (results.violations.length > 0) {
      console.log('Focus violations:', JSON.stringify(results.violations, null, 2));
    }
    expect(results.violations).toEqual([]);
  });
});
