import { render, screen } from '@testing-library/react';
import NavLinks from '@/features/nav/components/NavLinks';

const links = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Shop' },
  { href: '/cart', label: 'Cart' },
];

describe('NavLinks', () => {
  it('renders all nav links', () => {
    render(<NavLinks navLinks={links} pathname="/" />);
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Shop' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Cart' })).toBeInTheDocument();
  });

  it('applies active class to the current path link', () => {
    render(<NavLinks navLinks={links} pathname="/products" />);
    expect(screen.getByRole('link', { name: 'Shop' }).className).toContain('nav-link--active');
  });

  it('does not apply active class to non-current links', () => {
    render(<NavLinks navLinks={links} pathname="/products" />);
    expect(screen.getByRole('link', { name: 'Home' }).className).not.toContain('nav-link--active');
  });

  it('sets correct href for each link', () => {
    render(<NavLinks navLinks={links} pathname="/" />);
    expect(screen.getByRole('link', { name: 'Shop' })).toHaveAttribute('href', '/products');
  });
});
