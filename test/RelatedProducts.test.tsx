import { render, screen } from '@testing-library/react';
import RelatedProducts from '@/features/product/components/RelatedProducts';
import type { Product } from '@/types';

jest.mock('@/features/product/components/AddToCartButton', () =>
  function MockAddToCartButton() { return null; }
);

function makeProduct(id: string): Product {
  return {
    id, name: `Art ${id}`, category: 'Painting',
    price: 100, image: '/a.jpg', images: ['/a.jpg'],
    description: 'Test', dimensions: '10x10', medium: 'Oil',
    tags: [], inStock: true, featured: false, rating: 4, reviews: 5,
  };
}

describe('RelatedProducts', () => {
  it('renders nothing when products array is empty', () => {
    const { container } = render(<RelatedProducts products={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the section heading when products exist', () => {
    render(<RelatedProducts products={[makeProduct('1')]} />);
    expect(screen.getByText('You Might Also Like')).toBeInTheDocument();
  });

  it('renders a card for each related product', () => {
    render(<RelatedProducts products={[makeProduct('1'), makeProduct('2')]} />);
    expect(screen.getByText('Art 1')).toBeInTheDocument();
    expect(screen.getByText('Art 2')).toBeInTheDocument();
  });
});
