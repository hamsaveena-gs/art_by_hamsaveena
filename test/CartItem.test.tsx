import { render, screen, fireEvent } from '@testing-library/react';
import CartItem from '@/features/cart/components/CartItem';
import { useCartStore } from '@/features/cart/store/cartStore';
import type { CartItem as CartItemType } from '@/types';

jest.mock('@/features/cart/store/cartStore');

const item: CartItemType = {
  product: {
    id: 'p1', name: 'Sunset Over Venice', slug: 'sunset-over-venice', category: 'Painting',
    price: 420, image: '/a.jpg', images: ['/a.jpg'],
    description: 'Test', dimensions: '24x36', medium: 'Oil',
    tags: [], inStock: true, featured: false, rating: 4.9, reviews: 10,
  },
  quantity: 2,
};

const mockRemove = jest.fn();
const mockUpdate = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  (useCartStore as unknown as jest.Mock).mockReturnValue({
    removeFromCart: mockRemove,
    updateQuantity: mockUpdate,
  });
});

describe('CartItem', () => {
  it('renders the product name', () => {
    render(<CartItem item={item} />);
    expect(screen.getByText('Sunset Over Venice')).toBeInTheDocument();
  });

  it('renders the product category', () => {
    render(<CartItem item={item} />);
    expect(screen.getByText('Painting')).toBeInTheDocument();
  });

  it('renders the current quantity', () => {
    render(<CartItem item={item} />);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders the line price (price × quantity)', () => {
    render(<CartItem item={item} />);
    expect(screen.getByText('₹840')).toBeInTheDocument();
  });

  it('calls removeFromCart with the product id when Remove is clicked', () => {
    render(<CartItem item={item} />);
    fireEvent.click(screen.getByRole('button', { name: 'Remove item' }));
    expect(mockRemove).toHaveBeenCalledWith('p1');
  });

  it('calls updateQuantity with qty-1 when − is clicked', () => {
    render(<CartItem item={item} />);
    fireEvent.click(screen.getByRole('button', { name: 'Decrease quantity' }));
    expect(mockUpdate).toHaveBeenCalledWith('p1', 1);
  });

  it('calls updateQuantity with qty+1 when + is clicked', () => {
    render(<CartItem item={item} />);
    fireEvent.click(screen.getByRole('button', { name: 'Increase quantity' }));
    expect(mockUpdate).toHaveBeenCalledWith('p1', 3);
  });

  it('disables + button at max quantity (4)', () => {
    render(<CartItem item={{ ...item, quantity: 4 }} />);
    expect(screen.getByRole('button', { name: 'Increase quantity' })).toBeDisabled();
  });

  it('shows "Max 4" label at max quantity', () => {
    render(<CartItem item={{ ...item, quantity: 4 }} />);
    expect(screen.getByText('Max 4')).toBeInTheDocument();
  });
});
