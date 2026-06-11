import { render, screen } from '@testing-library/react';
import ProductContent from '@/features/product/ProductContent';
import { getSupabase } from '@/lib/supabase';

jest.mock('@/lib/supabase', () => ({
  getSupabase: jest.fn(),
}));

// AddToCartButton uses useRouter + useUser — mock it
jest.mock('@/features/product/components/AddToCartButton', () =>
  function MockAddToCartButton() {
    return <button>Add to Cart</button>;
  }
);

const mockProductRow = {
  id: 'p1', name: 'Sunset Painting', slug: 'sunset-painting', category: 'Painting',
  price: 299, original_price: null, image: '/a.jpg', images: ['/a.jpg'],
  description: 'A lovely sunset', dimensions: '30x40cm', medium: 'Oil on canvas',
  tags: ['sunset', 'painting'], stock_quantity: 5, featured: true, rating: 4.5, reviews: 12,
};

const mockRelatedRow = {
  id: 'p2', name: 'Ocean View', slug: 'ocean-view', category: 'Painting',
  price: 199, original_price: 249, image: '/b.jpg', images: ['/b.jpg'],
  description: 'Ocean scene', dimensions: '20x30cm', medium: 'Oil on canvas',
  tags: ['ocean', 'painting'], stock_quantity: 3, featured: false, rating: 4, reviews: 8,
};

describe('ProductContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders product details when product is found', async () => {
    const mockFrom = jest.fn(() => ({
      select: jest.fn(() => ({
        ilike: jest.fn(() => ({
          order: jest.fn(() => ({
            limit: jest.fn(() => ({
              maybeSingle: jest.fn(() => Promise.resolve({ data: mockProductRow, error: null })),
            })),
          })),
        })),
        eq: jest.fn(() => ({
          neq: jest.fn(() => ({
            limit: jest.fn(() => Promise.resolve({ data: [mockRelatedRow], error: null })),
          })),
        })),
      })),
    }));
    (getSupabase as jest.Mock).mockReturnValue({ from: mockFrom });

    const element = await ProductContent({ slug: 'sunset-painting' });
    render(<>{element}</>);

    expect(screen.getByText('Sunset Painting')).toBeInTheDocument();
    expect(screen.getByText('A lovely sunset')).toBeInTheDocument();
  });

  it('renders related products', async () => {
    const mockFrom = jest.fn(() => ({
      select: jest.fn(() => ({
        ilike: jest.fn(() => ({
          order: jest.fn(() => ({
            limit: jest.fn(() => ({
              maybeSingle: jest.fn(() => Promise.resolve({ data: mockProductRow, error: null })),
            })),
          })),
        })),
        eq: jest.fn(() => ({
          neq: jest.fn(() => ({
            limit: jest.fn(() => Promise.resolve({ data: [mockRelatedRow], error: null })),
          })),
        })),
      })),
    }));
    (getSupabase as jest.Mock).mockReturnValue({ from: mockFrom });

    const element = await ProductContent({ slug: 'sunset-painting' });
    render(<>{element}</>);

    expect(screen.getByText('Ocean View')).toBeInTheDocument();
  });

  it('renders product images container', async () => {
    const mockFrom = jest.fn(() => ({
      select: jest.fn(() => ({
        ilike: jest.fn(() => ({
          order: jest.fn(() => ({
            limit: jest.fn(() => ({
              maybeSingle: jest.fn(() => Promise.resolve({ data: mockProductRow, error: null })),
            })),
          })),
        })),
        eq: jest.fn(() => ({
          neq: jest.fn(() => ({
            limit: jest.fn(() => Promise.resolve({ data: [mockRelatedRow], error: null })),
          })),
        })),
      })),
    }));
    (getSupabase as jest.Mock).mockReturnValue({ from: mockFrom });

    const element = await ProductContent({ slug: 'sunset-painting' });
    const { container } = render(<>{element}</>);

    expect(container.querySelector('.product-detail')).toBeInTheDocument();
  });

  it('fetches product by slug with ilike pattern', async () => {
    // Mock both fetchProduct and fetchRelated chains
    const maybeSingle = jest.fn(() => Promise.resolve({ data: mockProductRow, error: null }));
    const fetchProductLimit = jest.fn(() => ({ maybeSingle }));
    const fetchProductOrder = jest.fn(() => ({ limit: fetchProductLimit }));
    const ilike = jest.fn(() => ({ order: fetchProductOrder }));

    const relatedLimit = jest.fn(() => Promise.resolve({ data: [mockRelatedRow], error: null }));
    const neq = jest.fn(() => ({ limit: relatedLimit }));
    const eq = jest.fn(() => ({ neq }));

    // select returns different chains depending what's called on it
    const select = jest.fn(() => ({ ilike, eq }));
    const mockFrom = jest.fn(() => ({ select }));
    (getSupabase as jest.Mock).mockReturnValue({ from: mockFrom });

    await ProductContent({ slug: 'sunset-painting' });

    expect(ilike).toHaveBeenCalledWith('name', expect.stringContaining('sunset'));
    expect(ilike).toHaveBeenCalledWith('name', expect.stringContaining('painting'));
  });
});
