'use client';

import { useCartStore } from '@/features/cart/store/cartStore';
import CartItem from '@/features/cart/components/CartItem';
import CartSummary from '@/features/cart/components/CartSummary';
import Button from '@/components/ui/Button';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';

export default function CartContent() {
  const { items, totalItems, totalPrice } = useCartStore();
  const count = totalItems();
  const price = totalPrice();

  if (items.length === 0) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="empty-state-icon">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          <Text variant="plain" as="p" className="empty-title">Your cart is empty</Text>
          <Text variant="plain" as="p" className="empty-subtitle">Discover beautiful artworks to add.</Text>
          <Button href="/products" variant="primary" className="mt-6">
            Shop Now
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Heading as="h1" className="page-title">Your Cart</Heading>
      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => (
            <CartItem key={item.product.id} item={item} />
          ))}
        </div>
        <CartSummary totalPrice={price} totalItems={count} />
      </div>
    </div>
  );
}
