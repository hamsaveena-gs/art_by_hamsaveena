import { render, screen } from '@testing-library/react';
import ProductCardSkeleton from '@/features/products/components/ProductCardSkeleton';

describe('ProductCardSkeleton', () => {
  it('renders the card container', () => {
    const { container } = render(<ProductCardSkeleton />);
    expect(container.querySelector('.product-card')).toBeInTheDocument();
  });

  it('renders the image skeleton', () => {
    const { container } = render(<ProductCardSkeleton />);
    expect(container.querySelector('.product-card-image-wrap.skeleton')).toBeInTheDocument();
  });

  it('renders skeleton text lines', () => {
    const { container } = render(<ProductCardSkeleton />);
    expect(container.querySelectorAll('.skeleton-text').length).toBeGreaterThanOrEqual(2);
  });
});
