/**
 * Unit-level accessibility tests for NavigationMenu using jest-axe.
 */
import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { NavigationMenu, NavItem } from '../../src/components/NavigationMenu';

expect.extend(toHaveNoViolations);

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Cart', href: '/cart' },
  { label: 'Account', href: '/account' },
];

describe('NavigationMenu — Accessibility (jest-axe)', () => {
  it('has no axe violations on initial render', async () => {
    const { container } = render(
      <NavigationMenu items={navItems} currentPath="/" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no axe violations when menu is open', async () => {
    const { container, getByRole } = render(
      <NavigationMenu items={navItems} currentPath="/" />
    );
    await userEvent.click(getByRole('button', { name: /open menu/i }));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('nav landmark has an accessible label', () => {
    const { getByRole } = render(<NavigationMenu items={navItems} />);
    expect(getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument();
  });

  it('toggle button reflects expanded state', async () => {
    const { getByRole } = render(<NavigationMenu items={navItems} />);
    const button = getByRole('button', { name: /open menu/i });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('current page link has aria-current="page"', async () => {
    const { getByRole } = render(
      <NavigationMenu items={navItems} currentPath="/shop" />
    );
    // Open the menu so links are visible in the accessibility tree
    await userEvent.click(getByRole('button', { name: /open menu/i }));
    expect(getByRole('link', { name: 'Shop' })).toHaveAttribute('aria-current', 'page');
  });

  it('non-current links do not have aria-current', async () => {
    const { getByRole } = render(
      <NavigationMenu items={navItems} currentPath="/shop" />
    );
    // Open the menu so links are visible in the accessibility tree
    await userEvent.click(getByRole('button', { name: /open menu/i }));
    expect(getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current');
  });

  it('skip link is present and points to main content', () => {
    const { getByText } = render(<NavigationMenu items={navItems} />);
    const skipLink = getByText(/skip to main content/i);
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });
});
