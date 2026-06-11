import { render } from '@testing-library/react';
import FeaturedProductsSkeleton from '@/components/skeleton/FeaturedProductsSkeleton';

describe('FeaturedProductsSkeleton', () => {
  it('renders the section container', () => {
    const { container } = render(<FeaturedProductsSkeleton />);
    expect(container.querySelector('section.section')).toBeInTheDocument();
  });

  it('renders the section header with heading and view-all skeletons', () => {
    const { container } = render(<FeaturedProductsSkeleton />);
    const header = container.querySelector('.section-header');
    expect(header).toBeInTheDocument();
    expect(header?.querySelector('.skeleton-section-heading')).toBeInTheDocument();
    expect(header?.querySelector('.skeleton-view-all')).toBeInTheDocument();
  });

  it('renders 8 product card skeletons', () => {
    const { container } = render(<FeaturedProductsSkeleton />);
    expect(container.querySelectorAll('.product-card').length).toBe(8);
  });

  it('renders the product grid container', () => {
    const { container } = render(<FeaturedProductsSkeleton />);
    expect(container.querySelector('.product-grid')).toBeInTheDocument();
  });
});
