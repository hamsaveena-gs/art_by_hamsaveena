import { render, screen, waitFor } from '@testing-library/react';
import CheckoutForm from '@/features/checkout/components/CheckoutForm';
import { useCartStore } from '@/features/cart/store/cartStore';
import type { Product } from '@/types';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockUseUser = jest.fn();
jest.mock('@/hooks/useUser', () => ({
  useUser: () => mockUseUser(),
}));

jest.mock('@/features/cart/store/cartStore', () => ({
  useCartStore: jest.fn(),
}));

const mockClearCart = jest.fn();

const product: Product = {
  id: 'p1',
  name: 'Ocean Sunrise',
  category: 'Painting',
  price: 200,
  image: '/ocean.jpg',
  images: ['/ocean.jpg'],
  description: 'A beautiful sunrise',
  dimensions: '20x30',
  medium: 'Oil',
  tags: [],
  inStock: true,
  featured: false,
  rating: 4.8,
  reviews: 12,
};

function setupStore(items: { product: Product; quantity: number }[] = []) {
  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  (useCartStore as unknown as jest.Mock).mockReturnValue({
    items,
    totalPrice: () => total,
    clearCart: mockClearCart,
  });
}

describe('CheckoutForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseUser.mockReturnValue({
      firstName: null,
      lastName: null,
      email: null,
      loading: false,
    });
    setupStore();
    global.fetch = jest.fn().mockResolvedValue({ ok: true });
  });

  // ── Empty cart ──────────────────────────────────────────────────────────────

  it('shows "Your cart is empty" when no items', () => {
    render(<CheckoutForm />);
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
  });

  it('renders "Shop Now" link when cart is empty', () => {
    render(<CheckoutForm />);
    expect(screen.getByRole('link', { name: 'Shop Now' })).toBeInTheDocument();
  });

  // ── With items ───────────────────────────────────────────────────────────────

  it('renders "Checkout" heading when items are present', () => {
    setupStore([{ product, quantity: 1 }]);
    render(<CheckoutForm />);
    expect(screen.getByRole('heading', { level: 1, name: 'Checkout' })).toBeInTheDocument();
  });

  it('renders "Shipping Details" section heading', () => {
    setupStore([{ product, quantity: 1 }]);
    render(<CheckoutForm />);
    expect(screen.getByRole('heading', { level: 2, name: 'Shipping Details' })).toBeInTheDocument();
  });

  it('renders "Payment Details" section heading', () => {
    setupStore([{ product, quantity: 1 }]);
    render(<CheckoutForm />);
    expect(screen.getByRole('heading', { level: 2, name: 'Payment Details' })).toBeInTheDocument();
  });

  it('renders all shipping fields', () => {
    setupStore([{ product, quantity: 1 }]);
    render(<CheckoutForm />);
    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone')).toBeInTheDocument();
    expect(screen.getByLabelText('Street Address')).toBeInTheDocument();
    expect(screen.getByLabelText('City')).toBeInTheDocument();
    expect(screen.getByLabelText('Postcode')).toBeInTheDocument();
    expect(screen.getByLabelText('Country')).toBeInTheDocument();
  });

  it('renders all payment fields', () => {
    setupStore([{ product, quantity: 1 }]);
    render(<CheckoutForm />);
    expect(screen.getByLabelText('Name on Card')).toBeInTheDocument();
    expect(screen.getByLabelText('Card Number')).toBeInTheDocument();
    expect(screen.getByLabelText('Expiry (MM/YY)')).toBeInTheDocument();
    expect(screen.getByLabelText('CVC')).toBeInTheDocument();
  });

  it('renders the submit button with price', () => {
    setupStore([{ product, quantity: 1 }]);
    render(<CheckoutForm />);
    // price=200 >= 150 → free shipping → Pay ₹200.00
    expect(screen.getByRole('button', { name: /Pay ₹/ })).toBeInTheDocument();
  });

  it('adds shipping cost when total is below ₹150', () => {
    const cheapProduct: Product = { ...product, id: 'p2', price: 100 };
    setupStore([{ product: cheapProduct, quantity: 1 }]);
    render(<CheckoutForm />);
    // 100 < 150 → shipping = 50 → Pay ₹150.00
    expect(screen.getByRole('button', { name: 'Pay ₹150.00' })).toBeInTheDocument();
  });

  // ── Prefill from useUser ────────────────────────────────────────────────────

  it('prefills firstName, lastName, email once loading is false', async () => {
    mockUseUser.mockReturnValue({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      loading: false,
    });
    setupStore([{ product, quantity: 1 }]);
    render(<CheckoutForm />);
    await waitFor(() => {
      expect((screen.getByLabelText('First Name') as HTMLInputElement).value).toBe('Jane');
      expect((screen.getByLabelText('Last Name') as HTMLInputElement).value).toBe('Doe');
      expect((screen.getByLabelText('Email Address') as HTMLInputElement).value).toBe('jane@example.com');
    });
  });

  it('does not prefill while user is still loading', () => {
    mockUseUser.mockReturnValue({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      loading: true,
    });
    setupStore([{ product, quantity: 1 }]);
    render(<CheckoutForm />);
    expect((screen.getByLabelText('First Name') as HTMLInputElement).value).toBe('');
    expect((screen.getByLabelText('Last Name') as HTMLInputElement).value).toBe('');
    expect((screen.getByLabelText('Email Address') as HTMLInputElement).value).toBe('');
  });
});
