'use client';

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
  const atMax = quantity >= MAX_QTY;

  return (
    <div className="cart-item">
      <Link href={`/products/${product.id}`} className="cart-item-image-wrap">
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
          <Link href={`/products/${product.id}`} className="cart-item-name">
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
              onClick={() => updateQuantity(product.id, quantity + 1)}
              disabled={atMax}
              aria-label="Increase quantity"
              title={atMax ? 'Maximum quantity is 4' : undefined}
            >
              +
            </Button>
          </div>
          {atMax && <Text variant="plain" as="span" className="qty-max-label">Max 4</Text>}

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
