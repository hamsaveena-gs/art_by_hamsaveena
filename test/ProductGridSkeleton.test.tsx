import { render } from '@testing-library/react';
import ProductGridSkeleton from '@/components/skeleton/ProductGridSkeleton';

describe('ProductGridSkeleton', () => {
  it('renders 8 product card skeletons', () => {
    const { container } = render(<ProductGridSkeleton />);
    expect(container.querySelectorAll('.product-card').length).toBe(8);
  });

  it('renders the count skeleton', () => {
    const { container } = render(<ProductGridSkeleton />);
    expect(container.querySelector('.skeleton-count')).toBeInTheDocument();
  });

  it('renders inside a product-grid container', () => {
    const { container } = render(<ProductGridSkeleton />);
    expect(container.querySelector('.product-grid')).toBeInTheDocument();
  });
});
