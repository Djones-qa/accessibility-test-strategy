/**
 * Unit-level accessibility tests for ProductCard using jest-axe.
 */
import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ProductCard, Product } from '../../src/components/ProductCard';

expect.extend(toHaveNoViolations);

const mockProduct: Product = {
  id: 'prod-001',
  name: 'Wireless Headphones',
  price: 79.99,
  imageUrl: '/images/headphones.jpg',
  imageAlt: 'Black over-ear wireless headphones with noise cancellation',
  description: 'Premium sound quality with 30-hour battery life.',
  inStock: true,
};

const outOfStockProduct: Product = {
  ...mockProduct,
  id: 'prod-002',
  inStock: false,
};

describe('ProductCard — Accessibility (jest-axe)', () => {
  it('has no axe violations for in-stock product', async () => {
    const { container } = render(<ProductCard product={mockProduct} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no axe violations for out-of-stock product', async () => {
    const { container } = render(<ProductCard product={outOfStockProduct} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('image has descriptive alt text', () => {
    const { getByAltText } = render(<ProductCard product={mockProduct} />);
    expect(getByAltText(mockProduct.imageAlt)).toBeInTheDocument();
  });

  it('add to cart button has accessible name', () => {
    const { getByRole } = render(<ProductCard product={mockProduct} />);
    expect(
      getByRole('button', { name: /add wireless headphones to cart/i })
    ).toBeInTheDocument();
  });

  it('out-of-stock button is disabled and has accessible label', () => {
    const { getByRole } = render(<ProductCard product={outOfStockProduct} />);
    const button = getByRole('button', { name: /wireless headphones is out of stock/i });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  it('uses article landmark with accessible name', () => {
    const { getByRole } = render(<ProductCard product={mockProduct} />);
    expect(
      getByRole('article', { name: /wireless headphones product card/i })
    ).toBeInTheDocument();
  });

  it('out-of-stock status is communicated via role="status"', () => {
    const { getByRole } = render(<ProductCard product={outOfStockProduct} />);
    expect(getByRole('status')).toHaveTextContent(/out of stock/i);
  });
});
