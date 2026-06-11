import { render } from '@testing-library/react';
import FilterSidebarSkeleton from '@/components/skeleton/FilterSidebarSkeleton';

describe('FilterSidebarSkeleton', () => {
  it('renders the filter sidebar container', () => {
    const { container } = render(<FilterSidebarSkeleton />);
    expect(container.querySelector('.filter-sidebar')).toBeInTheDocument();
  });

  it('renders 2 filter groups', () => {
    const { container } = render(<FilterSidebarSkeleton />);
    expect(container.querySelectorAll('.filter-group').length).toBe(2);
  });

  it('renders filter heading skeletons', () => {
    const { container } = render(<FilterSidebarSkeleton />);
    expect(container.querySelectorAll('.skeleton-filter-head').length).toBe(2);
  });

  it('renders 7 skeleton items in first group and 6 in second', () => {
    const { container } = render(<FilterSidebarSkeleton />);
    const groups = container.querySelectorAll('.filter-group');
    const firstGroupItems = groups[0].querySelectorAll('.skeleton-filter-item');
    const secondGroupItems = groups[1].querySelectorAll('.skeleton-filter-item');
    expect(firstGroupItems.length).toBe(7);
    expect(secondGroupItems.length).toBe(6);
  });
});
