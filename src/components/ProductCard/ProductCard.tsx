import React from 'react';

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  imageAlt: string;
  description: string;
  inStock: boolean;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

/**
 * Accessible product card component.
 * WCAG 2.1 AA compliance:
 * - Image has descriptive alt text
 * - Button has accessible name
 * - Out-of-stock state communicated via aria-disabled + aria-label
 * - Price uses visually hidden currency context
 */
export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const handleAddToCart = () => {
    if (product.inStock) {
      onAddToCart?.(product);
    }
  };

  return (
    <article aria-label={`${product.name} product card`}>
      <img src={product.imageUrl} alt={product.imageAlt} />
      <div className="product-info">
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <p>
          <span className="visually-hidden">Price: </span>
          <span aria-label={`$${product.price.toFixed(2)}`}>${product.price.toFixed(2)}</span>
        </p>
        {!product.inStock && (
          <p role="status" aria-live="polite">
            Out of stock
          </p>
        )}
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          aria-disabled={!product.inStock}
          aria-label={
            product.inStock
              ? `Add ${product.name} to cart`
              : `${product.name} is out of stock`
          }
        >
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
