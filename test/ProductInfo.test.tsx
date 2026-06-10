import { render, screen } from '@testing-library/react';
import ProductInfo from '@/features/product/components/ProductInfo';
import type { Product } from '@/types';

jest.mock('@/features/product/components/AddToCartButton', () =>
  function MockAddToCartButton() { return <button>Add to Cart</button>; }
);

const product: Product = {
  id: 'p1', name: 'Sunset Over Venice', slug: 'sunset-over-venice', category: 'Painting',
  price: 420, originalPrice: 520, image: '/a.jpg', images: ['/a.jpg'],
  description: 'A luminous oil painting.',
  dimensions: '24" × 36"', medium: 'Oil on linen canvas',
  tags: ['oil', 'landscape'], inStock: true, featured: true,
  rating: 4.9, reviews: 34,
};

describe('ProductInfo', () => {
  it('renders the product name', () => {
    render(<ProductInfo product={product} />);
    expect(screen.getByRole('heading', { name: 'Sunset Over Venice' })).toBeInTheDocument();
  });

  it('renders the category', () => {
    render(<ProductInfo product={product} />);
    expect(screen.getByText('Painting')).toBeInTheDocument();
  });

  it('renders the price', () => {
    render(<ProductInfo product={product} />);
    expect(screen.getByText('₹420')).toBeInTheDocument();
  });

  it('renders the original price when on sale', () => {
    render(<ProductInfo product={product} />);
    expect(screen.getByText('₹520')).toBeInTheDocument();
  });

  it('renders the savings amount', () => {
    render(<ProductInfo product={product} />);
    expect(screen.getByText('Save ₹100')).toBeInTheDocument();
  });

  it('does not render original price when not on sale', () => {
    render(<ProductInfo product={{ ...product, originalPrice: undefined }} />);
    expect(screen.queryByText('₹520')).not.toBeInTheDocument();
    expect(screen.queryByText(/Save/)).not.toBeInTheDocument();
  });

  it('renders the description', () => {
    render(<ProductInfo product={product} />);
    expect(screen.getByText('A luminous oil painting.')).toBeInTheDocument();
  });

  it('renders dimensions and medium', () => {
    render(<ProductInfo product={product} />);
    expect(screen.getByText('24" × 36"')).toBeInTheDocument();
    expect(screen.getByText('Oil on linen canvas')).toBeInTheDocument();
  });

  it('renders each tag', () => {
    render(<ProductInfo product={product} />);
    expect(screen.getByText('oil')).toBeInTheDocument();
    expect(screen.getByText('landscape')).toBeInTheDocument();
  });

  it('renders the star rating label', () => {
    render(<ProductInfo product={product} />);
    expect(screen.getByLabelText('Rating: 4.9 out of 5')).toBeInTheDocument();
  });

  it('renders the review count', () => {
    render(<ProductInfo product={product} />);
    expect(screen.getByText(/34 reviews/)).toBeInTheDocument();
  });
});
