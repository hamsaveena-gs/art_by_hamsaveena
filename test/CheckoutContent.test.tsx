import { render, screen } from '@testing-library/react';
import CheckoutContent from '@/features/checkout/CheckoutContent';
import { useCartStore } from '@/features/cart/store/cartStore';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('@/hooks/useUser', () => ({
  useUser: () => ({ firstName: null, lastName: null, email: null, loading: false }),
}));

jest.mock('@/features/cart/store/cartStore', () => ({
  useCartStore: jest.fn(),
}));

beforeEach(() => {
  (useCartStore as unknown as jest.Mock).mockReturnValue({
    items: [],
    totalPrice: () => 0,
    clearCart: jest.fn(),
  });
});

describe('CheckoutContent', () => {
  it('renders without crashing', () => {
    render(<CheckoutContent />);
  });

  it('renders the empty cart message when cart is empty', () => {
    render(<CheckoutContent />);
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
  });

  it('renders the "Shop Now" link when cart is empty', () => {
    render(<CheckoutContent />);
    expect(screen.getByRole('link', { name: 'Shop Now' })).toBeInTheDocument();
  });
});
