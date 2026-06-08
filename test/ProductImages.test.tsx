import { render, screen, fireEvent } from '@testing-library/react';
import ProductImages from '@/features/product/components/ProductImages';

const images = ['/img1.jpg', '/img2.jpg', '/img3.jpg'];

describe('ProductImages', () => {
  it('renders the main image with the product name as alt text', () => {
    render(<ProductImages images={images} name="Sunset Over Venice" />);
    expect(screen.getByAltText('Sunset Over Venice')).toBeInTheDocument();
  });

  it('renders thumbnail buttons when there are multiple images', () => {
    render(<ProductImages images={images} name="Test Art" />);
    expect(screen.getByRole('button', { name: 'View image 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'View image 2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'View image 3' })).toBeInTheDocument();
  });

  it('does not render thumbnails when there is only one image', () => {
    render(<ProductImages images={['/img1.jpg']} name="Test Art" />);
    expect(screen.queryByRole('button', { name: 'View image 1' })).not.toBeInTheDocument();
  });

  it('first thumbnail has the active class by default', () => {
    const { container } = render(<ProductImages images={images} name="Test Art" />);
    const thumbs = container.querySelectorAll('.product-thumb');
    expect(thumbs[0].className).toContain('product-thumb--active');
    expect(thumbs[1].className).not.toContain('product-thumb--active');
  });

  it('switches active thumbnail when another is clicked', () => {
    const { container } = render(<ProductImages images={images} name="Test Art" />);
    fireEvent.click(screen.getByRole('button', { name: 'View image 2' }));
    const thumbs = container.querySelectorAll('.product-thumb');
    expect(thumbs[1].className).toContain('product-thumb--active');
    expect(thumbs[0].className).not.toContain('product-thumb--active');
  });
});
