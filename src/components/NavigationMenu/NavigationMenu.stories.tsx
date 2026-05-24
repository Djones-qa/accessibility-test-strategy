import type { Meta, StoryObj } from '@storybook/react';
import { NavigationMenu } from './NavigationMenu';

const meta: Meta<typeof NavigationMenu> = {
  title: 'Ecommerce/NavigationMenu',
  component: NavigationMenu,
  tags: ['autodocs'],
  parameters: {
    a11y: {
      config: {
        rules: [
          { id: 'aria-allowed-attr', enabled: true },
          { id: 'landmark-unique', enabled: true },
          { id: 'skip-link', enabled: true },
        ],
      },
    },
    docs: {
      description: {
        component:
          'Accessible navigation with skip link, aria-current for active page, and aria-expanded toggle for mobile menu.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof NavigationMenu>;

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Cart', href: '/cart' },
  { label: 'Account', href: '/account' },
];

export const Default: Story = {
  args: {
    items: navItems,
    currentPath: '/',
  },
};

export const ShopActive: Story = {
  args: {
    items: navItems,
    currentPath: '/shop',
  },
};
