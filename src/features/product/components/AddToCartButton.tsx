'use client';

import { useRouter } from 'next/navigation';
import { useCartStore } from '@/features/cart/store/cartStore';
import { useUser } from '@/hooks/useUser';
import { useState, useCallback } from 'react';
import type { Product } from '@/types';
import Button from '@/components/ui/Button';
import Text from '@/components/ui/Text';

const MAX_QTY = 4;

interface AddToCartButtonProps {
  product: Product;
  size?: 'sm' | 'lg';
}

export default function AddToCartButton({ product, size = 'lg' }: AddToCartButtonProps) {
  const router = useRouter();
  const { isLoggedIn, loading } = useUser();
  const { addToCart, updateQuantity, items } = useCartStore();
  const [stockError, setStockError] = useState(false);
  const cartItem = items.find((i) => i.product.id === product.id);
  const currentQty = cartItem?.quantity ?? 0;
  const inCart = currentQty > 0;
  const atMax = currentQty >= MAX_QTY;

  const requireAuth = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault();
    if (loading) return;
    if (!isLoggedIn) { router.push('/login'); return; }
    action();
  };

  const checkStockThenAdd = useCallback(async () => {
    setStockError(false);
    try {
      const res = await fetch(`/api/products/${product.id}/stock`);
      const { stock_quantity } = await res.json();
      if (stock_quantity <= 0) {
        setStockError(true);
        return;
      }
      addToCart(product);
    } catch {
      addToCart(product);
    }
  }, [product, addToCart]);

  if (stockError) {
    return (
      <Button variant="secondary" className={size === 'sm' ? 'btn-sm' : ''} disabled>
        Sold Out
      </Button>
    );
  }

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
          onClick={(e) => requireAuth(e, () => updateQuantity(product.id, currentQty - 1))}
          aria-label="Decrease quantity"
        >
          −
        </Button>
        <Text variant="plain" as="span" className="quantity-value">{currentQty}</Text>
        <Button
          variant="custom"
          className="quantity-btn"
          onClick={(e) => requireAuth(e, () => updateQuantity(product.id, currentQty + 1))}
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
        onClick={(e) => requireAuth(e, () => addToCart(product))}
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
      onClick={(e) => requireAuth(e, () => addToCart(product))}
    >
      {inCart ? 'Added to Cart ✓' : 'Add to Cart'}
    </Button>
  );
}
