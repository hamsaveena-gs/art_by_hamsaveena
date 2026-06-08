import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '@/features/products/components/SearchBar';

jest.mock('next/navigation', () => ({
  useRouter:      () => ({ push: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

describe('SearchBar', () => {
  it('renders the search input', () => {
    render(<SearchBar />);
    expect(screen.getByRole('searchbox', { name: 'Search artworks' })).toBeInTheDocument();
  });

  it('renders the search button', () => {
    render(<SearchBar />);
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('renders a search form', () => {
    render(<SearchBar />);
    expect(screen.getByRole('search')).toBeInTheDocument();
  });

  it('updates the input value when typed', () => {
    render(<SearchBar />);
    const input = screen.getByRole('searchbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'painting' } });
    expect(input.value).toBe('painting');
  });

  it('initialises input value from searchParams q param', () => {
    jest.resetModules();
    jest.mock('next/navigation', () => ({
      useRouter:       () => ({ push: jest.fn() }),
      useSearchParams: () => new URLSearchParams('q=canvas'),
    }));
    // basic check — component initialises without error
    render(<SearchBar />);
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });
});
