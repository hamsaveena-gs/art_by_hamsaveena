import { render, screen } from '@testing-library/react';
import CategoryGrid from '@/features/home/components/CategoryGrid';

const categories = [
  { name: 'Painting' as const, description: 'Oil, acrylic & watercolour originals' },
  { name: 'Digital Art' as const, description: 'Limited-edition digital prints' },
];

describe('CategoryGrid', () => {
  it('renders a card for each category', () => {
    render(<CategoryGrid categories={categories} />);
    expect(screen.getByText('Painting')).toBeInTheDocument();
    expect(screen.getByText('Digital Art')).toBeInTheDocument();
  });

  it('renders the category description', () => {
    render(<CategoryGrid categories={categories} />);
    expect(screen.getByText('Oil, acrylic & watercolour originals')).toBeInTheDocument();
  });

  it('links each card to the filtered products page', () => {
    render(<CategoryGrid categories={categories} />);
    expect(screen.getByRole('link', { name: /Painting/ }))
      .toHaveAttribute('href', '/products?category=Painting');
  });

  it('URL-encodes category names with spaces', () => {
    render(<CategoryGrid categories={categories} />);
    expect(screen.getByRole('link', { name: /Digital Art/ }))
      .toHaveAttribute('href', '/products?category=Digital%20Art');
  });

  it('renders the section heading', () => {
    render(<CategoryGrid categories={categories} />);
    expect(screen.getByText('Browse by Category')).toBeInTheDocument();
  });
});
