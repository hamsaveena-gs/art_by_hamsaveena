'use client';

import { useCartStore } from '@/features/cart/store/cartStore';
import type { Product } from '@/types';
import Button from '@/components/ui/Button';
import Text from '@/components/ui/Text';

const MAX_QTY = 4;

interface AddToCartButtonProps {
  product: Product;
  size?: 'sm' | 'lg';
}

export default function AddToCartButton({ product, size = 'lg' }: AddToCartButtonProps) {
  const { addToCart, updateQuantity, items } = useCartStore();
  const cartItem = items.find((i) => i.product.id === product.id);
  const currentQty = cartItem?.quantity ?? 0;
  const inCart = currentQty > 0;
  const atMax = currentQty >= MAX_QTY;

  if (!product.inStock) {
    return (
      <Button variant="secondary" className={size === 'sm' ? 'btn-sm' : ''} disabled>
        Sold Out
      </Button>
    );
  }

  // Card view: show -/qty/+ controls when item is in cart
  if (size === 'sm' && inCart) {
    return (
      <div className="quantity-control" onClick={(e) => e.preventDefault()}>
        <Button
          variant="custom"
          className="quantity-btn"
          onClick={(e) => { e.preventDefault(); updateQuantity(product.id, currentQty - 1); }}
          aria-label="Decrease quantity"
        >
          −
        </Button>
        <Text variant="plain" as="span" className="quantity-value">{currentQty}</Text>
        <Button
          variant="custom"
          className="quantity-btn"
          onClick={(e) => { e.preventDefault(); updateQuantity(product.id, currentQty + 1); }}
          disabled={atMax}
          aria-label="Increase quantity"
        >
          +
        </Button>
      </div>
    );
  }

  // Card view: not in cart yet
  if (size === 'sm') {
    return (
      <Button
        variant="primary"
        className="btn-sm"
        onClick={(e) => { e.preventDefault(); addToCart(product); }}
      >
        +
      </Button>
    );
  }

  // Product detail page (lg)
  if (atMax) {
    return (
      <Button variant="success" disabled>
        Added to Cart ✓
      </Button>
    );
  }

  return (
    <Button
      variant={inCart ? 'success' : 'primary'}
      onClick={(e) => { e.preventDefault(); addToCart(product); }}
    >
      {inCart ? 'Added to Cart ✓' : 'Add to Cart'}
    </Button>
  );
}
