import { render, screen } from '@testing-library/react';
import CartContent from '@/features/cart/CartContent';
import { useCartStore } from '@/features/cart/store/cartStore';
import type { Product } from '@/types';

jest.mock('@/features/cart/store/cartStore');

// Keep CartItem and CartSummary shallow by mocking their sub-deps
jest.mock('@/features/cart/components/CartItem', () =>
  function MockCartItem({ item }: { item: { product: Product; quantity: number } }) {
    return <li>{item.product.name}</li>;
  }
);
jest.mock('@/features/cart/components/CartSummary', () =>
  function MockCartSummary({ totalPrice }: { totalPrice: number }) {
    return <div>Total: ₹{totalPrice}</div>;
  }
);

const product: Product = {
  id: 'p1', name: 'Sunset Over Venice', category: 'Painting',
  price: 420, image: '/a.jpg', images: ['/a.jpg'],
  description: 'Test', dimensions: '24x36', medium: 'Oil',
  tags: [], inStock: true, featured: false, rating: 4.9, reviews: 10,
};

describe('CartContent — empty cart', () => {
  beforeEach(() => {
    (useCartStore as unknown as jest.Mock).mockReturnValue({
      items: [],
      totalItems: () => 0,
      totalPrice: () => 0,
    });
  });

  it('shows the empty cart message', () => {
    render(<CartContent />);
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
  });

  it('shows a "Shop Now" link', () => {
    render(<CartContent />);
    expect(screen.getByRole('link', { name: 'Shop Now' })).toHaveAttribute('href', '/products');
  });

  it('does not render the cart title', () => {
    render(<CartContent />);
    expect(screen.queryByText('Your Cart')).not.toBeInTheDocument();
  });
});

describe('CartContent — with items', () => {
  beforeEach(() => {
    (useCartStore as unknown as jest.Mock).mockReturnValue({
      items: [{ product, quantity: 2 }],
      totalItems: () => 2,
      totalPrice: () => 840,
    });
  });

  it('renders the cart title', () => {
    render(<CartContent />);
    expect(screen.getByText('Your Cart')).toBeInTheDocument();
  });

  it('renders each cart item', () => {
    render(<CartContent />);
    expect(screen.getByText('Sunset Over Venice')).toBeInTheDocument();
  });

  it('passes correct totalPrice to CartSummary', () => {
    render(<CartContent />);
    expect(screen.getByText('Total: ₹840')).toBeInTheDocument();
  });
});
