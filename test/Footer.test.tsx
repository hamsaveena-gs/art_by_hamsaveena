import { render, screen } from '@testing-library/react';
import Footer from '@/components/Footer';

describe('Footer', () => {
  it('renders the brand name', () => {
    render(<Footer />);
    expect(screen.getByText('Art by Hamsaveena')).toBeInTheDocument();
  });

  it('renders a Home link', () => {
    render(<Footer />);
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
  });

  it('renders a Shop link', () => {
    render(<Footer />);
    expect(screen.getByRole('link', { name: 'Shop' })).toHaveAttribute('href', '/products');
  });

  it('renders a Cart link', () => {
    render(<Footer />);
    expect(screen.getByRole('link', { name: 'Cart' })).toHaveAttribute('href', '/cart');
  });

  it('renders the copyright with the current year', () => {
    render(<Footer />);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
  });
});
