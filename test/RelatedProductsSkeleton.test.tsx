import { render } from '@testing-library/react';
import RelatedProductsSkeleton from '@/components/skeleton/RelatedProductsSkeleton';

describe('RelatedProductsSkeleton', () => {
  it('renders the section container', () => {
    const { container } = render(<RelatedProductsSkeleton />);
    expect(container.querySelector('section.section')).toBeInTheDocument();
  });

  it('renders the section heading skeleton', () => {
    const { container } = render(<RelatedProductsSkeleton />);
    expect(container.querySelector('.skeleton-section-heading')).toBeInTheDocument();
  });

  it('renders 4 product card skeletons', () => {
    const { container } = render(<RelatedProductsSkeleton />);
    expect(container.querySelectorAll('.product-card').length).toBe(4);
  });

  it('renders the product grid container', () => {
    const { container } = render(<RelatedProductsSkeleton />);
    expect(container.querySelector('.product-grid')).toBeInTheDocument();
  });
});
