import { render, screen } from '@testing-library/react';
import ProductGrid from '@/features/products/components/ProductGrid';
import type { Product } from '@/types';

// Avoid pulling in Zustand inside ProductCard → AddToCartButton
jest.mock('@/features/product/components/AddToCartButton', () =>
  function MockAddToCartButton() {
    return <button>Add to Cart</button>;
  }
);

function makeProduct(id: string, overrides: Partial<Product> = {}): Product {
  return {
    id, name: `Product ${id}`, category: 'Painting',
    price: 100, image: '/a.jpg', images: ['/a.jpg'],
    description: 'Test', dimensions: '10x10', medium: 'Oil',
    tags: [], inStock: true, featured: false, rating: 4, reviews: 5,
    ...overrides,
  };
}

describe('ProductGrid', () => {
  it('shows empty state message when products array is empty', () => {
    render(<ProductGrid products={[]} />);
    expect(screen.getByText('No artworks found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your search or filters.')).toBeInTheDocument();
  });

  it('shows "1 artwork found" for a single result', () => {
    render(<ProductGrid products={[makeProduct('1')]} />);
    expect(screen.getByText('1 artwork found')).toBeInTheDocument();
  });

  it('shows "N artworks found" for multiple results', () => {
    render(<ProductGrid products={[makeProduct('1'), makeProduct('2'), makeProduct('3')]} />);
    expect(screen.getByText('3 artworks found')).toBeInTheDocument();
  });

  it('renders a card for each product', () => {
    const products = [makeProduct('1'), makeProduct('2')];
    render(<ProductGrid products={products} />);
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
  });

  it('does not render the product grid when empty', () => {
    const { container } = render(<ProductGrid products={[]} />);
    expect(container.querySelector('.product-grid')).not.toBeInTheDocument();
  });
});
