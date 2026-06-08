import { render, screen, fireEvent } from '@testing-library/react';
import AddToCartButton from '@/features/product/components/AddToCartButton';
import { useCartStore } from '@/features/cart/store/cartStore';
import type { Product } from '@/types';

jest.mock('@/features/cart/store/cartStore');

const product: Product = {
  id: 'p1', name: 'Test Painting', category: 'Painting',
  price: 420, image: '/a.jpg', images: ['/a.jpg'],
  description: 'Test', dimensions: '10x10', medium: 'Oil',
  tags: [], inStock: true, featured: false, rating: 4.5, reviews: 10,
};

const mockAddToCart = jest.fn();
const mockUpdateQuantity = jest.fn();

function mockStore(items: { product: Product; quantity: number }[] = []) {
  (useCartStore as unknown as jest.Mock).mockReturnValue({
    addToCart: mockAddToCart,
    updateQuantity: mockUpdateQuantity,
    items,
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  mockStore();
});

describe('AddToCartButton — size lg (default)', () => {
  it('renders "Add to Cart" when not in cart', () => {
    render(<AddToCartButton product={product} />);
    expect(screen.getByRole('button', { name: 'Add to Cart' })).toBeInTheDocument();
  });

  it('renders "Added to Cart ✓" when in cart', () => {
    mockStore([{ product, quantity: 1 }]);
    render(<AddToCartButton product={product} />);
    expect(screen.getByRole('button', { name: 'Added to Cart ✓' })).toBeInTheDocument();
  });

  it('renders disabled "Sold Out" when out of stock', () => {
    render(<AddToCartButton product={{ ...product, inStock: false }} />);
    expect(screen.getByRole('button', { name: 'Sold Out' })).toBeDisabled();
  });

  it('renders disabled "Added to Cart ✓" at max qty (4)', () => {
    mockStore([{ product, quantity: 4 }]);
    render(<AddToCartButton product={product} />);
    expect(screen.getByRole('button', { name: 'Added to Cart ✓' })).toBeDisabled();
  });

  it('calls addToCart when clicked', () => {
    render(<AddToCartButton product={product} />);
    fireEvent.click(screen.getByRole('button', { name: 'Add to Cart' }));
    expect(mockAddToCart).toHaveBeenCalledWith(product);
  });
});

describe('AddToCartButton — size sm', () => {
  it('renders "+" when not in cart', () => {
    render(<AddToCartButton product={product} size="sm" />);
    expect(screen.getByRole('button', { name: '+' })).toBeInTheDocument();
  });

  it('shows quantity controls when item is in cart', () => {
    mockStore([{ product, quantity: 2 }]);
    render(<AddToCartButton product={product} size="sm" />);
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Decrease quantity' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Increase quantity' })).toBeInTheDocument();
  });

  it('disables "+" at max qty (4)', () => {
    mockStore([{ product, quantity: 4 }]);
    render(<AddToCartButton product={product} size="sm" />);
    expect(screen.getByRole('button', { name: 'Increase quantity' })).toBeDisabled();
  });

  it('calls updateQuantity with qty-1 when − is clicked', () => {
    mockStore([{ product, quantity: 2 }]);
    render(<AddToCartButton product={product} size="sm" />);
    fireEvent.click(screen.getByRole('button', { name: 'Decrease quantity' }));
    expect(mockUpdateQuantity).toHaveBeenCalledWith('p1', 1);
  });

  it('calls updateQuantity with qty+1 when + is clicked', () => {
    mockStore([{ product, quantity: 2 }]);
    render(<AddToCartButton product={product} size="sm" />);
    fireEvent.click(screen.getByRole('button', { name: 'Increase quantity' }));
    expect(mockUpdateQuantity).toHaveBeenCalledWith('p1', 3);
  });

  it('calls addToCart when "+" is clicked from empty state', () => {
    render(<AddToCartButton product={product} size="sm" />);
    fireEvent.click(screen.getByRole('button', { name: '+' }));
    expect(mockAddToCart).toHaveBeenCalledWith(product);
  });
});
