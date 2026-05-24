import type { Meta, StoryObj } from '@storybook/react';
import { ProductCard } from './ProductCard';

const meta: Meta<typeof ProductCard> = {
  title: 'Ecommerce/ProductCard',
  component: ProductCard,
  tags: ['autodocs'],
  parameters: {
    a11y: {
      config: {
        rules: [
          { id: 'image-alt', enabled: true },
          { id: 'color-contrast', enabled: true },
          { id: 'button-name', enabled: true },
        ],
      },
    },
    docs: {
      description: {
        component:
          'Accessible product card with descriptive alt text, accessible button names, and out-of-stock state communicated via ARIA.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ProductCard>;

export const InStock: Story = {
  args: {
    product: {
      id: 'prod-001',
      name: 'Wireless Headphones',
      price: 79.99,
      imageUrl: 'https://placehold.co/300x200/1a1a2e/ffffff?text=Headphones',
      imageAlt: 'Black over-ear wireless headphones with noise cancellation',
      description: 'Premium sound quality with 30-hour battery life.',
      inStock: true,
    },
  },
};

export const OutOfStock: Story = {
  args: {
    product: {
      id: 'prod-002',
      name: 'USB-C Hub',
      price: 49.99,
      imageUrl: 'https://placehold.co/300x200/1a1a2e/ffffff?text=USB+Hub',
      imageAlt: 'Silver 7-in-1 USB-C hub with HDMI and USB-A ports',
      description: '7-in-1 hub with HDMI 4K and 100W PD charging.',
      inStock: false,
    },
  },
};
