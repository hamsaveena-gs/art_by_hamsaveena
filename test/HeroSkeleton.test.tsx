import { render } from '@testing-library/react';
import HeroSkeleton from '@/components/skeleton/HeroSkeleton';

describe('HeroSkeleton', () => {
  it('renders the hero skeleton container', () => {
    const { container } = render(<HeroSkeleton />);
    expect(container.querySelector('.skeleton-hero')).toBeInTheDocument();
  });
});
