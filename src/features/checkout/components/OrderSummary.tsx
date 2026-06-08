import Image from 'next/image';
import type { CartItem } from '@/types';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';

interface OrderSummaryProps {
  items: CartItem[];
  totalPrice: number;
}

const SHIPPING_THRESHOLD = 150;
const SHIPPING_COST = 50;

export default function OrderSummary({ items, totalPrice }: OrderSummaryProps) {
  const shipping = totalPrice >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;

  return (
    <aside className="order-summary">
      <Heading as="h2" className="cart-summary-title">Order Summary</Heading>

      <ul className="order-summary-items">
        {items.map(({ product, quantity }) => (
          <li key={product.id} className="order-summary-item">
            <div className="order-summary-image-wrap">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="order-summary-image"
                sizes="56px"
              />
              <Text variant="plain" as="span" className="order-summary-qty">{quantity}</Text>
            </div>
            <div className="order-summary-item-info">
              <Text variant="plain" as="p" className="order-summary-name">{product.name}</Text>
            </div>
            <Text variant="plain" as="span" className="order-summary-price">₹{product.price * quantity}</Text>
          </li>
        ))}
      </ul>

      <dl className="cart-summary-rows">
        <div className="cart-summary-row">
          <dt>Subtotal</dt>
          <dd>₹{totalPrice.toFixed(2)}</dd>
        </div>
        <div className="cart-summary-row">
          <dt>Shipping</dt>
          <dd>{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</dd>
        </div>
        <div className="cart-summary-row cart-summary-row--total">
          <dt>Total</dt>
          <dd>₹{(totalPrice + shipping).toFixed(2)}</dd>
        </div>
      </dl>
    </aside>
  );
}
