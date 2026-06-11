import { render } from '@testing-library/react';
import ProductImagesSkeleton from '@/components/skeleton/ProductImagesSkeleton';

describe('ProductImagesSkeleton', () => {
  it('renders the product-images container', () => {
    const { container } = render(<ProductImagesSkeleton />);
    expect(container.querySelector('.product-images')).toBeInTheDocument();
  });

  it('renders the main image placeholder with skeleton class', () => {
    const { container } = render(<ProductImagesSkeleton />);
    const main = container.querySelector('.product-image-main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass('skeleton');
  });

  it('renders the thumbnails container', () => {
    const { container } = render(<ProductImagesSkeleton />);
    expect(container.querySelector('.product-image-thumbs')).toBeInTheDocument();
  });

  it('renders 3 thumbnail skeletons', () => {
    const { container } = render(<ProductImagesSkeleton />);
    expect(container.querySelectorAll('.product-thumb.skeleton').length).toBe(3);
  });
});
