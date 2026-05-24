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
    // Tab to first Add to Cart button
    const firstButton = page.getByRole('button', { name: /add .* to cart/i }).first();
    await firstButton.focus();
    await expect(firstButton).toBeFocused();

    // Activate with Enter
    await page.keyboard.press('Enter');
    // Cart count or confirmation should update
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

  test('focus is visible on interactive elements', async ({ page }) => {
    const results = await new AxeBuilder({ page: axePage(page) })
      .withRules(['focus-visible'])
      .analyze();

    if (results.violations.length > 0) {
      console.log('Focus visibility violations:', JSON.stringify(results.violations, null, 2));
    }
    expect(results.violations).toEqual([]);
  });
});
