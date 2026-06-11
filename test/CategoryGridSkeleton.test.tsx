import { render } from '@testing-library/react';
import CategoryGridSkeleton from '@/components/skeleton/CategoryGridSkeleton';

describe('CategoryGridSkeleton', () => {
  it('renders the section container', () => {
    const { container } = render(<CategoryGridSkeleton />);
    expect(container.querySelector('section.section')).toBeInTheDocument();
  });

  it('renders the section heading skeleton', () => {
    const { container } = render(<CategoryGridSkeleton />);
    expect(container.querySelector('.skeleton-section-heading')).toBeInTheDocument();
  });

  it('renders 6 category card skeletons', () => {
    const { container } = render(<CategoryGridSkeleton />);
    expect(container.querySelectorAll('.skeleton-category-card').length).toBe(6);
  });

  it('renders the category grid container', () => {
    const { container } = render(<CategoryGridSkeleton />);
    expect(container.querySelector('.category-grid')).toBeInTheDocument();
  });
});
