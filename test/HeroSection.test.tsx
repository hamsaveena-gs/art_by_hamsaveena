import { render, screen } from '@testing-library/react';
import HeroSection from '@/features/home/components/HeroSection';

describe('HeroSection', () => {
  it('renders the main heading', () => {
    render(<HeroSection />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders the eyebrow text', () => {
    render(<HeroSection />);
    expect(screen.getByText('Curated art for every space')).toBeInTheDocument();
  });

  it('renders a "Shop All Art" link to /products', () => {
    render(<HeroSection />);
    expect(screen.getByRole('link', { name: 'Shop All Art' })).toHaveAttribute('href', '/products');
  });

  it('renders a "View Paintings" link filtered to Painting category', () => {
    render(<HeroSection />);
    expect(screen.getByRole('link', { name: 'View Paintings' }))
      .toHaveAttribute('href', '/products?category=Painting');
  });
});
