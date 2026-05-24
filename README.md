# ♿ Accessibility Test Strategy

[![Accessibility CI](https://github.com/Djones-qa/accessibility-test-strategy/actions/workflows/accessibility-ci.yml/badge.svg)](https://github.com/Djones-qa/accessibility-test-strategy/actions/workflows/accessibility-ci.yml)
[![WCAG 2.1 AA](https://img.shields.io/badge/WCAG-2.1%20AA-blue?logo=w3c)](https://www.w3.org/WAI/WCAG21/quickref/)
[![axe-core](https://img.shields.io/badge/axe--core-4.9.1-purple?logo=deque)](https://github.com/dequelabs/axe-core)
[![Playwright](https://img.shields.io/badge/Playwright-1.44-green?logo=playwright)](https://playwright.dev)
[![jest-axe](https://img.shields.io/badge/jest--axe-8.0-orange)](https://github.com/nickcolley/jest-axe)
[![Pa11y](https://img.shields.io/badge/Pa11y-8.0-red)](https://pa11y.org)
[![Storybook](https://img.shields.io/badge/Storybook-8.1-ff4785?logo=storybook)](https://storybook.js.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178c6?logo=typescript)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

A production-grade automated accessibility testing suite demonstrating **WCAG 2.1 AA compliance** across an ecommerce checkout flow. Built with a multi-layer toolchain that catches violations at every level — from unit components to full page audits — with a CI gate that fails the build on any accessibility error.

---

## 🎯 Why This Matters

Accessibility testing is one of the most underrepresented skills in QA portfolios. This repo demonstrates:

- **Automated WCAG scanning** at unit, integration, and E2E levels
- **CI enforcement** — axe violations fail the build before merge
- **Real compliance coverage** — ARIA, keyboard navigation, color contrast, screen reader semantics
- **Multiple toolchain layers** — each tool catches different classes of violations

---

## 🛠️ Tech Stack

| Tool | Layer | Purpose |
|------|-------|---------|
| **axe-core** | Foundation | WCAG rule engine powering all automated scans |
| **jest-axe** | Unit | Component-level axe assertions in Jest |
| **@axe-core/playwright** | E2E | Full-page WCAG scans in browser via Playwright |
| **Pa11y** | CLI Audit | Standalone WCAG 2.1 AA audits with JSON reports |
| **Storybook + addon-a11y** | Component | Visual a11y panel with axe on every story |
| **GitHub Actions** | CI/CD | Accessibility gate on every PR |
| **TypeScript** | DX | Full type safety across all test files |

---

## 📁 Project Structure

```
accessibility-test-strategy/
├── .github/
│   └── workflows/
│       └── accessibility-ci.yml    # CI pipeline with a11y gate
├── .storybook/
│   ├── main.ts                     # Storybook config with addon-a11y
│   └── preview.ts                  # Global axe config for all stories
├── public/
│   ├── index.html                  # Home page (WCAG 2.1 AA compliant)
│   ├── products.html               # Product listing page
│   ├── checkout.html               # Checkout form page
│   ├── checkout.js                 # Accessible form validation
│   └── styles.css                  # WCAG-compliant styles (4.5:1+ contrast)
├── scripts/
│   └── pa11y-audit.ts              # Pa11y CLI audit runner
├── src/
│   └── components/
│       ├── CheckoutForm/
│       │   ├── CheckoutForm.tsx    # Accessible React checkout form
│       │   ├── CheckoutForm.stories.tsx
│       │   └── index.ts
│       ├── ProductCard/
│       │   ├── ProductCard.tsx     # Accessible product card
│       │   ├── ProductCard.stories.tsx
│       │   └── index.ts
│       └── NavigationMenu/
│           ├── NavigationMenu.tsx  # Skip link + aria-current nav
│           ├── NavigationMenu.stories.tsx
│           └── index.ts
├── tests/
│   ├── __mocks__/
│   │   └── styleMock.ts
│   ├── unit/
│   │   ├── CheckoutForm.a11y.test.tsx   # jest-axe unit tests
│   │   ├── ProductCard.a11y.test.tsx
│   │   └── NavigationMenu.a11y.test.tsx
│   └── e2e/
│       ├── checkout.a11y.spec.ts        # Playwright + axe E2E tests
│       └── product-listing.a11y.spec.ts
├── jest.config.ts
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install

```bash
npm install
npx playwright install --with-deps chromium firefox
```

### Run All Tests

```bash
# Unit tests (jest-axe)
npm test

# E2E tests (Playwright + axe) — requires server running
npx serve -s public -l 3000 &
npm run test:e2e

# Pa11y CLI audit — requires server running
npm run test:pa11y

# All tests
npm run test:all
```

### Storybook

```bash
npm run storybook
```

Open [http://localhost:6006](http://localhost:6006) and click the **Accessibility** tab on any story to see live axe results.

---

## 🧪 Test Coverage

### Unit Tests — jest-axe

Each React component has a dedicated `*.a11y.test.tsx` file that:

- Runs `axe()` on the rendered component and asserts `toHaveNoViolations()`
- Tests all ARIA attributes (`aria-required`, `aria-invalid`, `aria-describedby`)
- Verifies label associations, landmark roles, and keyboard semantics
- Covers both default and error/edge-case states

```typescript
it('has no axe violations on initial render', async () => {
  const { container } = render(<CheckoutForm />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### E2E Tests — Playwright + axe

Full-page WCAG 2.1 AA scans in real Chromium and Firefox:

- Scans entire rendered page with `AxeBuilder.withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])`
- Targeted rule checks: color contrast, heading order, image alt, landmark structure
- Keyboard-only navigation flows (Tab, Enter, form submission)
- Screen reader announcement verification via `role="alert"` and `aria-live`

```typescript
const results = await new AxeBuilder({ page })
  .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
  .analyze();

expect(results.violations).toEqual([]);
```

### Pa11y CLI Audit

Standalone WCAG 2.1 AA audit against all pages:

- Runs against live server on `localhost:3000`
- Outputs JSON reports to `pa11y-reports/`
- Exits with code `1` if any errors found (CI gate)
- Covers errors, warnings, and notices separately

### Storybook + addon-a11y

Every component story runs axe automatically:

- Violations shown in the **Accessibility** panel
- Configured for `wcag2a`, `wcag2aa`, `wcag21aa` tags
- Color contrast rule explicitly enabled

---

## ♿ Accessibility Patterns Demonstrated

### Form Accessibility
- All inputs have associated `<label>` elements via `htmlFor`/`id`
- Required fields use `aria-required="true"`
- Validation errors linked via `aria-describedby`
- Invalid fields marked with `aria-invalid="true"`
- Logical grouping with `<fieldset>` and `<legend>`
- `autocomplete` attributes for all personal data fields

### Navigation Accessibility
- Skip-to-content link as first focusable element
- `<nav>` landmark with `aria-label`
- Active page indicated with `aria-current="page"`
- Mobile toggle with `aria-expanded` and `aria-controls`

### Interactive Elements
- All buttons have accessible names
- Disabled states use both `disabled` and `aria-disabled`
- Out-of-stock status communicated via `role="status"` and `aria-live`
- Focus visible on all interactive elements (3px outline)

### Color & Contrast
- All text meets 4.5:1 contrast ratio (WCAG AA)
- Error color `#c81e1e` — 5.8:1 on white
- Primary blue `#1a56db` — 5.9:1 on white
- Hint text `#4b5563` — 7.0:1 on white

---

## 🔄 CI Pipeline

The GitHub Actions workflow runs on every push and PR:

```
typecheck → unit-a11y ─┐
           e2e-a11y   ─┼→ a11y-gate (blocks merge on failure)
           pa11y-audit ─┘
```

**Artifacts uploaded on every run:**
- `jest-coverage/` — unit test coverage report
- `playwright-report/` — HTML report with screenshots
- `pa11y-reports/` — JSON audit results per page

---

## 📚 Resources

- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [axe-core Rules](https://dequeuniversity.com/rules/axe/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [Playwright Accessibility Testing](https://playwright.dev/docs/accessibility-testing)
- [Pa11y Documentation](https://pa11y.org)

---

## 👤 Author

**Darrius Jones** — QA Engineer

[![GitHub](https://img.shields.io/badge/GitHub-Djones--qa-181717?logo=github)](https://github.com/Djones-qa)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Darrius%20Jones-0077B5?logo=linkedin)](https://www.linkedin.com/in/darrius-jones-28226b350/)

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

> **Note:** Full WCAG compliance validation requires manual testing with assistive technologies (NVDA, JAWS, VoiceOver) and expert accessibility review. Automated tools catch approximately 30–40% of accessibility issues.
