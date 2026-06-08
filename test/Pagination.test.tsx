import { render, screen } from '@testing-library/react';
import Pagination from '@/components/ui/Pagination';

jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
}));

describe('Pagination', () => {
  it('renders nothing when totalPages is 1', () => {
    const { container } = render(<Pagination currentPage={1} totalPages={1} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when totalPages is 0', () => {
    const { container } = render(<Pagination currentPage={1} totalPages={0} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders Prev and Next links', () => {
    render(<Pagination currentPage={2} totalPages={5} />);
    expect(screen.getByText('← Prev')).toBeInTheDocument();
    expect(screen.getByText('Next →')).toBeInTheDocument();
  });

  it('marks the current page link as active', () => {
    render(<Pagination currentPage={3} totalPages={5} />);
    expect(screen.getByRole('link', { name: '3' })).toHaveAttribute('aria-current', 'page');
  });

  it('disables Prev on the first page', () => {
    render(<Pagination currentPage={1} totalPages={5} />);
    expect(screen.getByText('← Prev')).toHaveAttribute('aria-disabled', 'true');
  });

  it('disables Next on the last page', () => {
    render(<Pagination currentPage={5} totalPages={5} />);
    expect(screen.getByText('Next →')).toHaveAttribute('aria-disabled', 'true');
  });

  it('renders page 1 always', () => {
    render(<Pagination currentPage={5} totalPages={10} />);
    expect(screen.getByRole('link', { name: '1' })).toBeInTheDocument();
  });

  it('renders the last page always', () => {
    render(<Pagination currentPage={1} totalPages={10} />);
    expect(screen.getByRole('link', { name: '10' })).toBeInTheDocument();
  });

  it('renders ellipsis for large page ranges', () => {
    render(<Pagination currentPage={5} totalPages={10} />);
    expect(screen.getAllByText('…').length).toBeGreaterThanOrEqual(1);
  });
});
