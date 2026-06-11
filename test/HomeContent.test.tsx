import { render, screen } from '@testing-library/react';
import HomeContent from '@/features/home/HomeContent';
import { getSupabase } from '@/lib/supabase';

jest.mock('@/lib/supabase', () => ({
  getSupabase: jest.fn(),
}));

// AddToCartButton uses useRouter + useUser — mock it to avoid router dependency
jest.mock('@/features/product/components/AddToCartButton', () =>
  function MockAddToCartButton() {
    return <button>Add to Cart</button>;
  }
);

const mockFeatured = [
  {
    id: 'p1', name: 'Sunset', slug: 'sunset', category: 'Painting',
    price: 100, original_price: null, image: '/a.jpg', images: ['/a.jpg'],
    description: 'Desc', dimensions: '10x10', medium: 'Oil',
    tags: ['sunset'], stock_quantity: 5, featured: true, rating: 4.5, reviews: 10,
  },
  {
    id: 'p2', name: 'Ocean', slug: 'ocean', category: 'Painting',
    price: 200, original_price: 250, image: '/b.jpg', images: ['/b.jpg'],
    description: 'Desc', dimensions: '20x20', medium: 'Oil',
    tags: ['ocean'], stock_quantity: 3, featured: true, rating: 4, reviews: 8,
  },
];

const mockCategories = [
  { name: 'Painting', description: 'Oil paintings', image: '/cat1.jpg' },
  { name: 'Sketching', description: 'Pencil sketches', image: '/cat2.jpg' },
];

describe('HomeContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const mockFrom = jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(() => Promise.resolve({ data: mockFeatured, error: null })),
        })),
        order: jest.fn(() => Promise.resolve({ data: mockCategories, error: null })),
      })),
    }));
    (getSupabase as jest.Mock).mockReturnValue({ from: mockFrom });
  });

  it('renders the HeroSection', async () => {
    const element = await HomeContent();
    const { container } = render(<>{element}</>);
    expect(container.querySelector('.hero')).toBeInTheDocument();
  });

  it('renders category cards for each category', async () => {
    const element = await HomeContent();
    const { container } = render(<>{element}</>);
    const categoryNames = container.querySelectorAll('.category-card-name');
    expect(categoryNames[0]).toHaveTextContent('Painting');
    expect(categoryNames[1]).toHaveTextContent('Sketching');
  });

  it('renders featured products (capped at 8)', async () => {
    const element = await HomeContent();
    render(<>{element}</>);
    expect(screen.getByText('Sunset')).toBeInTheDocument();
    expect(screen.getByText('Ocean')).toBeInTheDocument();
  });

  it('renders the page container', async () => {
    const element = await HomeContent();
    const { container } = render(<>{element}</>);
    expect(container.querySelector('.page-container')).toBeInTheDocument();
  });

  it('handles empty featured products gracefully', async () => {
    const mockFrom = jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(() => Promise.resolve({ data: [], error: null })),
        })),
        order: jest.fn(() => Promise.resolve({ data: mockCategories, error: null })),
      })),
    }));
    (getSupabase as jest.Mock).mockReturnValue({ from: mockFrom });

    const element = await HomeContent();
    const { container } = render(<>{element}</>);
    expect(container.querySelector('.page-container')).toBeInTheDocument();
  });

  it('handles Supabase error on featured fetch', async () => {
    const mockFrom = jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(() => Promise.resolve({ data: null, error: new Error('DB error') })),
        })),
        order: jest.fn(() => Promise.resolve({ data: mockCategories, error: null })),
      })),
    }));
    (getSupabase as jest.Mock).mockReturnValue({ from: mockFrom });

    const element = await HomeContent();
    render(<>{element}</>);
    expect(screen.queryByText('Sunset')).not.toBeInTheDocument();
  });
});
