import { render, screen, fireEvent } from '@testing-library/react';
import FilterSidebar from '@/features/products/components/FilterSidebar';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter:       () => ({ push: mockPush }),
  useSearchParams: () => new URLSearchParams(),
}));

describe('FilterSidebar', () => {
  beforeEach(() => mockPush.mockClear());

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

  it('closes category accordion on second click', () => {
    render(<FilterSidebar />);
    const btn = screen.getByRole('button', { name: /category/i });
    fireEvent.click(btn); // open
    fireEvent.click(btn); // close
    expect(btn).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes price accordion on second click', () => {
    render(<FilterSidebar />);
    const btn = screen.getByRole('button', { name: 'Price' });
    fireEvent.click(btn); // open
    fireEvent.click(btn); // close
    expect(btn).toHaveAttribute('aria-expanded', 'false');
  });

  it('clicking "All" category filter pushes router without category param', () => {
    render(<FilterSidebar />);
    fireEvent.click(screen.getByRole('button', { name: 'All' }));
    expect(mockPush).toHaveBeenCalledWith('/products?');
  });

  it('clicking a named category filter pushes router with category param', () => {
    render(<FilterSidebar />);
    fireEvent.click(screen.getByRole('button', { name: 'Painting' }));
    expect(mockPush).toHaveBeenCalledWith('/products?category=Painting');
  });

  it('clicking "Under ₹50" price filter pushes router with price param', () => {
    render(<FilterSidebar />);
    fireEvent.click(screen.getByRole('button', { name: 'Under ₹50' }));
    expect(mockPush).toHaveBeenCalledWith('/products?price=0-50');
  });

  it('clicking "All Prices" price filter pushes router without price param', () => {
    render(<FilterSidebar />);
    fireEvent.click(screen.getByRole('button', { name: 'All Prices' }));
    expect(mockPush).toHaveBeenCalledWith('/products?');
  });

  it('renders all category filter buttons', () => {
    render(<FilterSidebar />);
    const categories = ['Painting', 'Clay Art', 'Canvas Art', 'Postcard Art', 'Sketching', 'Digital Art'];
    categories.forEach((cat) => {
      expect(screen.getByRole('button', { name: cat })).toBeInTheDocument();
    });
  });
});
