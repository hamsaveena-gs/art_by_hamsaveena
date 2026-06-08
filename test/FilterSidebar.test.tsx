import { render, screen, fireEvent } from '@testing-library/react';
import FilterSidebar from '@/features/products/components/FilterSidebar';

jest.mock('next/navigation', () => ({
  useRouter:       () => ({ push: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

describe('FilterSidebar', () => {
  it('renders the Category toggle button', () => {
    render(<FilterSidebar />);
    expect(screen.getByRole('button', { name: /category/i })).toBeInTheDocument();
  });

  it('renders the Price toggle button', () => {
    render(<FilterSidebar />);
    expect(screen.getByRole('button', { name: 'Price' })).toBeInTheDocument();
  });

  it('category accordion starts closed (aria-expanded false)', () => {
    render(<FilterSidebar />);
    expect(screen.getByRole('button', { name: /category/i })).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens category accordion on click', () => {
    render(<FilterSidebar />);
    const btn = screen.getByRole('button', { name: /category/i });
    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
  });

  it('opens price accordion on click', () => {
    render(<FilterSidebar />);
    const btn = screen.getByRole('button', { name: 'Price' });
    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
  });

  it('renders All category filter button', () => {
    render(<FilterSidebar />);
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
  });
});
