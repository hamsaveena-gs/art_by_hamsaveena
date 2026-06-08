import { render, screen } from '@testing-library/react';
import CartSummary from '@/features/cart/components/CartSummary';

describe('CartSummary', () => {
  it('shows "Free" shipping when subtotal >= ₹150', () => {
    render(<CartSummary totalPrice={150} totalItems={1} />);
    expect(screen.getByText('Free')).toBeInTheDocument();
  });

  it('shows ₹50 shipping when subtotal < ₹150', () => {
    render(<CartSummary totalPrice={100} totalItems={1} />);
    expect(screen.getByText('₹50.00')).toBeInTheDocument();
  });

  it('shows "add more for free shipping" hint when subtotal < ₹150', () => {
    render(<CartSummary totalPrice={100} totalItems={1} />);
    expect(screen.getByText('Add ₹50.00 more for free shipping')).toBeInTheDocument();
  });

  it('does not show free shipping hint when subtotal >= ₹150', () => {
    render(<CartSummary totalPrice={200} totalItems={1} />);
    expect(screen.queryByText(/more for free shipping/)).not.toBeInTheDocument();
  });

  it('calculates order total = subtotal + shipping', () => {
    render(<CartSummary totalPrice={100} totalItems={1} />);
    // 100 + 50 = 150
    expect(screen.getByText('₹150.00')).toBeInTheDocument();
  });

  it('calculates order total with free shipping', () => {
    render(<CartSummary totalPrice={200} totalItems={1} />);
    // subtotal and total are both ₹200.00 — both should appear
    expect(screen.getAllByText('₹200.00')).toHaveLength(2);
  });

  it('shows singular "item" for quantity 1', () => {
    render(<CartSummary totalPrice={50} totalItems={1} />);
    expect(screen.getByText(/Subtotal \(1 item\)/)).toBeInTheDocument();
  });

  it('shows plural "items" for quantity > 1', () => {
    render(<CartSummary totalPrice={50} totalItems={3} />);
    expect(screen.getByText(/Subtotal \(3 items\)/)).toBeInTheDocument();
  });

  it('shows a "Proceed to Checkout" link', () => {
    render(<CartSummary totalPrice={50} totalItems={1} />);
    expect(screen.getByRole('link', { name: 'Proceed to Checkout' })).toBeInTheDocument();
  });

  it('shows a "Continue Shopping" link', () => {
    render(<CartSummary totalPrice={50} totalItems={1} />);
    expect(screen.getByRole('link', { name: 'Continue Shopping' })).toBeInTheDocument();
  });
});
