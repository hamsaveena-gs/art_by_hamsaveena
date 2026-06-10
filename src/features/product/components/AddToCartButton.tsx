'use client';

import { useRouter } from 'next/navigation';
import { useCartStore } from '@/features/cart/store/cartStore';
import { useUser } from '@/hooks/useUser';
import { useState } from 'react';
import type { Product } from '@/types';
import Button from '@/components/ui/Button';
import Text from '@/components/ui/Text';

const MAX_CART = 4;

interface AddToCartButtonProps {
  product: Product;
  size?: 'sm' | 'lg';
}

interface StockState {
  status: 'ok' | 'sold-out' | 'low-stock';
  available: number;
}

export default function AddToCartButton({ product, size = 'lg' }: AddToCartButtonProps) {
  const router = useRouter();
  const { isLoggedIn, loading } = useUser();
  const { addToCart, updateQuantity, items } = useCartStore();
  const [stock, setStock] = useState<StockState | null>(null);
  const cartItem = items.find((i) => i.product.id === product.id);
  const currentQty = cartItem?.quantity ?? 0;
  const inCart = currentQty > 0;
  const stockLimit = stock ? Math.min(MAX_CART, stock.available) : MAX_CART;
  const atMax = currentQty >= stockLimit || currentQty >= MAX_CART;

  const requireAuth = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault();
    if (loading) return;
    if (!isLoggedIn) { router.push('/login'); return; }
    action();
  };

  const liveCheck = async (requestedQty: number): Promise<boolean> => {
    try {
      const res = await fetch(`/api/products/${product.id}/stock`);
      const { stock_quantity } = await res.json();
      if (stock_quantity <= 0) {
        setStock({ status: 'sold-out', available: 0 });
        return false;
      }
      if (requestedQty > stock_quantity) {
        setStock({ status: 'low-stock', available: stock_quantity });
        return false;
      }
      setStock({ status: 'ok', available: stock_quantity });
      return true;
    } catch {
      return true;
    }
  };

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!isLoggedIn) { router.push('/login'); return; }
    const ok = await liveCheck(currentQty + 1);
    if (ok) addToCart(product);
  };

  const handleIncrement = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!isLoggedIn) { router.push('/login'); return; }
    const ok = await liveCheck(currentQty + 1);
    if (ok) updateQuantity(product.id, currentQty + 1);
  };

  if (stock?.status === 'sold-out' || !product.inStock) {
    return (
      <Button variant="secondary" className={size === 'sm' ? 'btn-sm' : ''} disabled>
        Sold Out
      </Button>
    );
  }

  if (stock?.status === 'low-stock') {
    return (
      <Button variant="secondary" className={size === 'sm' ? 'btn-sm' : ''} disabled>
        Only {stock.available} left
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
          onClick={handleIncrement}
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
        onClick={handleAdd}
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
      onClick={handleAdd}
    >
      {inCart ? 'Added to Cart ✓' : 'Add to Cart'}
    </Button>
  );
}
