import { render } from '@testing-library/react';
import ProductInfoSkeleton from '@/components/skeleton/ProductInfoSkeleton';

describe('ProductInfoSkeleton', () => {
  it('renders the product-info container', () => {
    const { container } = render(<ProductInfoSkeleton />);
    expect(container.querySelector('.product-info')).toBeInTheDocument();
  });

  it('renders category label skeleton', () => {
    const { container } = render(<ProductInfoSkeleton />);
    expect(container.querySelector('.skeleton-text--sm')).toBeInTheDocument();
  });

  it('renders product name skeleton', () => {
    const { container } = render(<ProductInfoSkeleton />);
    expect(container.querySelector('.skeleton-detail-name')).toBeInTheDocument();
  });

  it('renders stars skeleton', () => {
    const { container } = render(<ProductInfoSkeleton />);
    expect(container.querySelector('.skeleton-stars')).toBeInTheDocument();
  });

  it('renders price skeleton', () => {
    const { container } = render(<ProductInfoSkeleton />);
    expect(container.querySelector('.skeleton-price')).toBeInTheDocument();
  });

  it('renders 3 tag skeletons', () => {
    const { container } = render(<ProductInfoSkeleton />);
    expect(container.querySelectorAll('.skeleton-tag').length).toBe(3);
  });

  it('renders large button skeleton', () => {
    const { container } = render(<ProductInfoSkeleton />);
    expect(container.querySelector('.skeleton-btn-lg')).toBeInTheDocument();
  });
});
