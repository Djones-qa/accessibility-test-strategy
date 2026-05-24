import React, { useState } from 'react';

export interface NavItem {
  label: string;
  href: string;
}

interface NavigationMenuProps {
  items: NavItem[];
  currentPath?: string;
}

/**
 * Accessible navigation menu.
 * WCAG 2.1 AA compliance:
 * - Uses <nav> landmark with aria-label
 * - Current page indicated with aria-current="page"
 * - Mobile toggle button has aria-expanded and aria-controls
 * - Skip-to-content link for keyboard users
 */
export const NavigationMenu: React.FC<NavigationMenuProps> = ({
  items,
  currentPath = '/',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <nav aria-label="Main navigation">
        <button
          aria-expanded={isOpen}
          aria-controls="nav-menu"
          onClick={() => setIsOpen((prev) => !prev)}
          className="nav-toggle"
        >
          <span aria-hidden="true">{isOpen ? '✕' : '☰'}</span>
          <span className="visually-hidden">{isOpen ? 'Close menu' : 'Open menu'}</span>
        </button>
        <ul id="nav-menu" role="list" aria-hidden={!isOpen ? true : undefined}>
          {items.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                aria-current={currentPath === item.href ? 'page' : undefined}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default NavigationMenu;
