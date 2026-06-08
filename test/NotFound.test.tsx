import { render, screen } from '@testing-library/react';
import NotFound from '@/app/not-found';

describe('NotFound', () => {
  it('renders the 404 code', () => {
    render(<NotFound />);
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('renders the heading', () => {
    render(<NotFound />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Lost in the Gallery');
  });

  it('renders a Back to Home link pointing to /', () => {
    render(<NotFound />);
    expect(screen.getByRole('link', { name: 'Back to Home' })).toHaveAttribute('href', '/');
  });

  it('renders a Browse Shop link pointing to /products', () => {
    render(<NotFound />);
    expect(screen.getByRole('link', { name: 'Browse Shop' })).toHaveAttribute('href', '/products');
  });
});
