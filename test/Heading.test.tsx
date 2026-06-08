import { render, screen } from '@testing-library/react';
import Heading from '@/components/ui/Heading';

describe('Heading', () => {
  it('renders an h2 by default', () => {
    render(<Heading>Default</Heading>);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  it('renders the correct tag for each level', () => {
    (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const).forEach((level) => {
      const { unmount } = render(<Heading as={level}>Heading</Heading>);
      expect(screen.getByRole('heading', { level: Number(level[1]) })).toBeInTheDocument();
      unmount();
    });
  });

  it('renders children correctly', () => {
    render(<Heading as="h1">Art Store</Heading>);
    expect(screen.getByText('Art Store')).toBeInTheDocument();
  });

  it('applies className when provided', () => {
    render(<Heading as="h1" className="page-title">Title</Heading>);
    expect(screen.getByRole('heading').className).toContain('page-title');
  });
});
