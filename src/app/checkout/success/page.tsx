import Button from '@/components/ui/Button';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';

export default function CheckoutSuccessPage() {
  return (
    <div className="page-container">
      <div className="empty-state">
        <div className="success-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <Heading as="h1" className="page-title mt-4">Order Confirmed!</Heading>
        <Text variant="muted" className="mt-2">
          Thank you for your purchase. A confirmation email will be sent to you shortly.
        </Text>
        <Button href="/products" variant="primary" className="mt-8">
          Continue Shopping
        </Button>
      </div>
    </div>
  );
}
