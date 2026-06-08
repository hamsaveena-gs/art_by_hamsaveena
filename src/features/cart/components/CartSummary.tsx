import Button from '@/components/ui/Button';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';

interface CartSummaryProps {
  totalPrice: number;
  totalItems: number;
}

const SHIPPING_THRESHOLD = 150;
const SHIPPING_COST = 50;

export default function CartSummary({ totalPrice, totalItems }: CartSummaryProps) {
  const shipping = totalPrice >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const orderTotal = totalPrice + shipping;

  return (
    <aside className="cart-summary">
      <Heading as="h2" className="cart-summary-title">Order Summary</Heading>

      <dl className="cart-summary-rows">
        <div className="cart-summary-row">
          <dt>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</dt>
          <dd>₹{totalPrice.toFixed(2)}</dd>
        </div>
        <div className="cart-summary-row">
          <dt>Shipping</dt>
          <dd>{shipping === 0 ? <Text variant="plain" as="span" className="text-green">Free</Text> : `₹${shipping.toFixed(2)}`}</dd>
        </div>
        {shipping > 0 && (
          <div className="cart-summary-free-ship">
            Add ₹{(SHIPPING_THRESHOLD - totalPrice).toFixed(2)} more for free shipping
          </div>
        )}
        <div className="cart-summary-row cart-summary-row--total">
          <dt>Total</dt>
          <dd>₹{orderTotal.toFixed(2)}</dd>
        </div>
      </dl>

      <Button href="/checkout" variant="primary" className="w-full">
        Proceed to Checkout
      </Button>
      <Button href="/products" variant="outline" className="w-full mt-3">
        Continue Shopping
      </Button>
    </aside>
  );
}
