import { render, screen } from '@testing-library/react';
import OrderSummary from '@/features/checkout/components/OrderSummary';
import type { CartItem } from '@/types';

const item: CartItem = {
  product: {
    id: 'p1', name: 'Sunset Over Venice', slug: 'sunset-over-venice', category: 'Painting',
    price: 420, image: '/a.jpg', images: ['/a.jpg'],
    description: 'Test', dimensions: '24x36', medium: 'Oil',
    tags: [], inStock: true, featured: false, rating: 4.9, reviews: 10,
  },
  quantity: 2,
};

describe('OrderSummary', () => {
  it('renders the section heading', () => {
    render(<OrderSummary items={[item]} totalPrice={840} />);
    expect(screen.getByText('Order Summary')).toBeInTheDocument();
  });

  it('renders each product name', () => {
    render(<OrderSummary items={[item]} totalPrice={840} />);
    expect(screen.getByText('Sunset Over Venice')).toBeInTheDocument();
  });

  it('renders line price (price × quantity)', () => {
    render(<OrderSummary items={[item]} totalPrice={840} />);
    expect(screen.getByText('₹840')).toBeInTheDocument();
  });

  it('renders quantity badge on the image', () => {
    render(<OrderSummary items={[item]} totalPrice={840} />);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders the subtotal', () => {
    render(<OrderSummary items={[item]} totalPrice={840} />);
    // subtotal and total are both ₹840.00 (free shipping) — both rows present
    expect(screen.getAllByText('₹840.00')).toHaveLength(2);
  });

  it('shows "Free" shipping when subtotal >= ₹150', () => {
    render(<OrderSummary items={[item]} totalPrice={840} />);
    expect(screen.getByText('Free')).toBeInTheDocument();
  });

  it('shows shipping cost when subtotal < ₹150', () => {
    render(<OrderSummary items={[item]} totalPrice={100} />);
    expect(screen.getByText('₹50.00')).toBeInTheDocument();
  });

  it('calculates total correctly with shipping', () => {
    render(<OrderSummary items={[item]} totalPrice={100} />);
    expect(screen.getByText('₹150.00')).toBeInTheDocument();
  });
});
