import { render, screen } from '@testing-library/react';
import ProductsContent from '@/features/products/ProductsContent';
import { getSupabase } from '@/lib/supabase';

jest.mock('@/lib/supabase', () => ({
  getSupabase: jest.fn(),
}));

jest.mock('@/features/products/components/SearchBar', () =>
  function MockSearchBar() {
    return <div data-testid="search-bar" />;
  }
);

jest.mock('@/features/products/components/FilterSidebar', () =>
  function MockFilterSidebar() {
    return <div data-testid="filter-sidebar" />;
  }
);

jest.mock('@/components/ui/Pagination', () =>
  function MockPagination() {
    return <div data-testid="pagination" />;
  }
);

jest.mock('@/features/product/components/AddToCartButton', () =>
  function MockAddToCartButton() {
    return <button>Add to Cart</button>;
  }
);

function makeDbRow(id: string, overrides: Record<string, unknown> = {}) {
  return {
    id, name: `Product ${id}`, slug: `product-${id}`, category: 'Painting',
    price: 100, original_price: null, image: '/a.jpg', images: ['/a.jpg'],
    description: 'Test', dimensions: '10x10', medium: 'Oil',
    tags: [], stock_quantity: 5, featured: false, rating: 4, reviews: 5,
    ...overrides,
  };
}

describe('ProductsContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function mockSupabaseOrder(data: Record<string, unknown>[]) {
    const order = jest.fn(() => Promise.resolve({ data, error: null }));
    return { order };
  }

  function mockSupabaseEq(data: Record<string, unknown>[]) {
    const order = jest.fn(() => Promise.resolve({ data, error: null }));
    const eq = jest.fn(() => ({ order }));
    return { eq, order };
  }

  it('renders "All Artworks" heading when no category filter', async () => {
    const { order } = mockSupabaseOrder([]);
    const select = jest.fn(() => ({ order }));
    const mockFrom = jest.fn(() => ({ select }));
    (getSupabase as jest.Mock).mockReturnValue({ from: mockFrom });

    const element = await ProductsContent({});
    render(<>{element}</>);
    expect(screen.getByText('All Artworks')).toBeInTheDocument();
  });

  it('renders category name as heading when category filter is set', async () => {
    const { eq, order } = mockSupabaseEq([]);
    const select = jest.fn(() => ({ eq, order }));
    const mockFrom = jest.fn(() => ({ select }));
    (getSupabase as jest.Mock).mockReturnValue({ from: mockFrom });

    const element = await ProductsContent({ category: 'Painting' });
    render(<>{element}</>);
    expect(screen.getByText('Painting')).toBeInTheDocument();
    expect(eq).toHaveBeenCalledWith('category', 'Painting');
  });

  it('renders product cards for fetched products', async () => {
    const products = [makeDbRow('1'), makeDbRow('2')];
    const { order } = mockSupabaseOrder(products);
    const select = jest.fn(() => ({ order }));
    const mockFrom = jest.fn(() => ({ select }));
    (getSupabase as jest.Mock).mockReturnValue({ from: mockFrom });

    const element = await ProductsContent({});
    render(<>{element}</>);
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
  });

  it('shows correct product count', async () => {
    const products = [makeDbRow('1'), makeDbRow('2'), makeDbRow('3')];
    const { order } = mockSupabaseOrder(products);
    const select = jest.fn(() => ({ order }));
    const mockFrom = jest.fn(() => ({ select }));
    (getSupabase as jest.Mock).mockReturnValue({ from: mockFrom });

    const element = await ProductsContent({});
    render(<>{element}</>);
    expect(screen.getByText('3 artworks found')).toBeInTheDocument();
  });

  it('shows empty state when no products match', async () => {
    const { order } = mockSupabaseOrder([]);
    const select = jest.fn(() => ({ order }));
    const mockFrom = jest.fn(() => ({ select }));
    (getSupabase as jest.Mock).mockReturnValue({ from: mockFrom });

    const element = await ProductsContent({});
    render(<>{element}</>);
    expect(screen.getByText('No artworks found')).toBeInTheDocument();
  });

  it('renders SearchBar, FilterSidebar, and Pagination', async () => {
    const products = Array.from({ length: 12 }, (_, i) => makeDbRow(String(i + 1)));
    const { order } = mockSupabaseOrder(products);
    const select = jest.fn(() => ({ order }));
    const mockFrom = jest.fn(() => ({ select }));
    (getSupabase as jest.Mock).mockReturnValue({ from: mockFrom });

    const element = await ProductsContent({ page: 1 });
    render(<>{element}</>);
    expect(screen.getByTestId('search-bar')).toBeInTheDocument();
    expect(screen.getByTestId('filter-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('pagination')).toBeInTheDocument();
  });

  it('paginates products — page 1 shows first 8, page 2 shows next 4', async () => {
    const products = Array.from({ length: 12 }, (_, i) => makeDbRow(String(i + 1)));
    const { order } = mockSupabaseOrder(products);
    const select = jest.fn(() => ({ order }));
    const mockFrom = jest.fn(() => ({ select }));
    (getSupabase as jest.Mock).mockReturnValue({ from: mockFrom });

    const element1 = await ProductsContent({ page: 1 });
    render(<>{element1}</>);
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 8')).toBeInTheDocument();
    expect(screen.queryByText('Product 9')).not.toBeInTheDocument();

    const element2 = await ProductsContent({ page: 2 });
    render(<>{element2}</>);
    expect(screen.getByText('Product 9')).toBeInTheDocument();
    expect(screen.getByText('Product 12')).toBeInTheDocument();
  });

  it('applies price range filter with both min and max', async () => {
    const order = jest.fn(() => Promise.resolve({ data: [], error: null }));
    const lte = jest.fn(() => ({ order }));
    const gte = jest.fn(() => ({ lte }));
    const select = jest.fn(() => ({ gte, order }));
    const mockFrom = jest.fn(() => ({ select }));
    (getSupabase as jest.Mock).mockReturnValue({ from: mockFrom });

    await ProductsContent({ price: '50-150' });
    expect(gte).toHaveBeenCalledWith('price', 50);
    expect(lte).toHaveBeenCalledWith('price', 150);
  });

  it('applies price range filter with only min (over X)', async () => {
    const order = jest.fn(() => Promise.resolve({ data: [], error: null }));
    const gte = jest.fn(() => ({ order }));
    const select = jest.fn(() => ({ gte, order }));
    const mockFrom = jest.fn(() => ({ select }));
    (getSupabase as jest.Mock).mockReturnValue({ from: mockFrom });

    await ProductsContent({ price: '500-' });
    expect(gte).toHaveBeenCalledWith('price', 500);
  });

  it('applies search query filter', async () => {
    const order = jest.fn(() => Promise.resolve({ data: [], error: null }));
    const or = jest.fn(() => ({ order }));
    const select = jest.fn(() => ({ or, order }));
    const mockFrom = jest.fn(() => ({ select }));
    (getSupabase as jest.Mock).mockReturnValue({ from: mockFrom });

    await ProductsContent({ q: 'flower' });
    expect(or).toHaveBeenCalled();
  });

  it('handles Supabase error gracefully', async () => {
    const order = jest.fn(() => Promise.resolve({ data: null, error: new Error('DB error') }));
    const select = jest.fn(() => ({ order }));
    const mockFrom = jest.fn(() => ({ select }));
    (getSupabase as jest.Mock).mockReturnValue({ from: mockFrom });

    const element = await ProductsContent({});
    render(<>{element}</>);
    expect(screen.getByText('No artworks found')).toBeInTheDocument();
  });
});
