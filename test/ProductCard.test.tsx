import { render, screen } from '@testing-library/react';
import ProductCard from '@/features/products/components/ProductCard';
import type { Product } from '@/types';

const product: Product = {
  id:           'p1',
  name:         'Sunset Painting',
  category:     'Painting',
  price:        299,
  image:        'https://images.unsplash.com/photo-1',
  images:       ['https://images.unsplash.com/photo-1'],
  description:  'A lovely sunset.',
  dimensions:   '30x40cm',
  medium:       'Oil on canvas',
  tags:         ['sunset'],
  inStock:      true,
  featured:     true,
  rating:       4.5,
  reviews:      10,
};

describe('ProductCard', () => {
  it('renders the product name', () => {
    render(<ProductCard product={product} />);
    expect(screen.getByRole('heading', { name: 'Sunset Painting' })).toBeInTheDocument();
  });

  it('renders the product category', () => {
    render(<ProductCard product={product} />);
    expect(screen.getByText('Painting')).toBeInTheDocument();
  });

  it('renders the price', () => {
    render(<ProductCard product={product} />);
    expect(screen.getByText('₹299')).toBeInTheDocument();
  });

  it('renders a link to the product detail page', () => {
    render(<ProductCard product={product} />);
    const links = screen.getAllByRole('link');
    expect(links.some(l => l.getAttribute('href') === '/products/p1')).toBe(true);
  });

  it('shows Sale badge when originalPrice is set', () => {
    render(<ProductCard product={{ ...product, originalPrice: 399 }} />);
    expect(screen.getByText('Sale')).toBeInTheDocument();
  });

  it('does not show Sale badge when no originalPrice', () => {
    render(<ProductCard product={product} />);
    expect(screen.queryByText('Sale')).not.toBeInTheDocument();
  });

  it('shows Sold Out badge when inStock is false', () => {
    const { container } = render(<ProductCard product={{ ...product, inStock: false }} />);
    expect(container.querySelector('.product-card-sold-out')).toBeInTheDocument();
  });

  it('does not show Sold Out badge when in stock', () => {
    const { container } = render(<ProductCard product={product} />);
    expect(container.querySelector('.product-card-sold-out')).not.toBeInTheDocument();
  });
});
