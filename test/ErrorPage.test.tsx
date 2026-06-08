import { render, screen, fireEvent } from '@testing-library/react';
import ErrorPage from '@/app/error';

describe('ErrorPage', () => {
  const mockReset = jest.fn();
  const mockError = new Error('Test error') as Error & { digest?: string };

  beforeEach(() => mockReset.mockClear());

  it('renders the heading', () => {
    render(<ErrorPage error={mockError} reset={mockReset} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Something Went Wrong');
  });

  it('renders a Try Again button', () => {
    render(<ErrorPage error={mockError} reset={mockReset} />);
    expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument();
  });

  it('calls reset when Try Again is clicked', () => {
    render(<ErrorPage error={mockError} reset={mockReset} />);
    fireEvent.click(screen.getByRole('button', { name: 'Try Again' }));
    expect(mockReset).toHaveBeenCalledTimes(1);
  });

  it('renders a Back to Home link', () => {
    render(<ErrorPage error={mockError} reset={mockReset} />);
    expect(screen.getByRole('link', { name: 'Back to Home' })).toHaveAttribute('href', '/');
  });
});
