'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/features/cart/store/cartStore';
import type { CartItem as CartItemType } from '@/types';
import Button from '@/components/ui/Button';
import Text from '@/components/ui/Text';

interface CartItemProps {
  item: CartItemType;
}

const MAX_QTY = 4;

export default function CartItem({ item }: CartItemProps) {
  const { removeFromCart, updateQuantity } = useCartStore();
  const { product, quantity } = item;
  const [stockError, setStockError] = useState(false);

  const stockLimit = Math.min(MAX_QTY, product.stockQuantity || MAX_QTY);
  const atMax = quantity >= stockLimit;

  const handleIncrement = async () => {
    setStockError(false);
    try {
      const res = await fetch(`/api/products/${product.id}/stock`);
      const { stock_quantity } = await res.json();
      if (stock_quantity <= 0 || quantity + 1 > stock_quantity) {
        setStockError(true);
        return;
      }
      updateQuantity(product.id, quantity + 1);
    } catch {
      updateQuantity(product.id, quantity + 1);
    }
  };

  return (
    <div className="cart-item">
      <Link href={`/products/${product.slug}`} className="cart-item-image-wrap">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="cart-item-image"
          sizes="80px"
        />
      </Link>

      <div className="cart-item-body">
        <div className="cart-item-info">
          <Text variant="plain" as="p" className="cart-item-category">{product.category}</Text>
          <Link href={`/products/${product.slug}`} className="cart-item-name">
            {product.name}
          </Link>
        </div>

        <div className="cart-item-controls">
          <div className="quantity-control">
            <Button
              variant="custom"
              className="quantity-btn"
              onClick={() => updateQuantity(product.id, quantity - 1)}
              aria-label="Decrease quantity"
            >
              −
            </Button>
            <Text variant="plain" as="span" className="quantity-value">{quantity}</Text>
            <Button
              variant="custom"
              className="quantity-btn"
              onClick={handleIncrement}
              disabled={atMax || stockError}
              aria-label="Increase quantity"
              title={atMax ? 'No more stock available' : undefined}
            >
              +
            </Button>
          </div>
          {atMax && (
            <Text variant="plain" as="span" className="qty-max-label">
              {stockError ? 'Sold out' : `Max ${stockLimit}`}
            </Text>
          )}

          <Text variant="plain" as="span" className="cart-item-price">₹{product.price * quantity}</Text>

          <Button
            variant="custom"
            className="cart-item-remove"
            onClick={() => removeFromCart(product.id)}
            aria-label="Remove item"
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
}
