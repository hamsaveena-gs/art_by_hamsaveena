import { render, screen } from '@testing-library/react';
import FeaturedProducts from '@/features/home/components/FeaturedProducts';
import type { Product } from '@/types';

jest.mock('@/features/product/components/AddToCartButton', () =>
  function MockAddToCartButton() { return null; }
);

function makeProduct(id: string): Product {
  return {
    id, name: `Art ${id}`, category: 'Painting',
    price: 100, image: '/a.jpg', images: ['/a.jpg'],
    description: 'Test', dimensions: '10x10', medium: 'Oil',
    tags: [], inStock: true, featured: true, rating: 4.5, reviews: 5,
  };
}

describe('FeaturedProducts', () => {
  it('renders the section heading', () => {
    render(<FeaturedProducts products={[]} />);
    expect(screen.getByText('Featured Works')).toBeInTheDocument();
  });

  it('renders a "View All" link to /products', () => {
    render(<FeaturedProducts products={[]} />);
    expect(screen.getByRole('link', { name: 'View All' })).toHaveAttribute('href', '/products');
  });

  it('renders a card for each product', () => {
    render(<FeaturedProducts products={[makeProduct('1'), makeProduct('2')]} />);
    expect(screen.getByText('Art 1')).toBeInTheDocument();
    expect(screen.getByText('Art 2')).toBeInTheDocument();
  });
});
