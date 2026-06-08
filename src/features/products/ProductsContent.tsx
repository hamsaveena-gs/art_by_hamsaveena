import { Suspense } from 'react';
import type { Product, Category } from '@/types';
import SearchBar from '@/features/products/components/SearchBar';
import FilterSidebar from '@/features/products/components/FilterSidebar';
import ProductGrid from '@/features/products/components/ProductGrid';
import Pagination from '@/components/ui/Pagination';
import { categories } from '@/lib/products';
import Heading from '@/components/ui/Heading';
import { getSupabase } from '@/lib/supabase';
import { mapProduct } from '@/lib/mapProduct';

const PAGE_SIZE = 8;

interface ProductsContentProps {
  q?: string;
  category?: string;
  price?: string;
  page?: number;
}

async function fetchProducts(q?: string, category?: string, price?: string): Promise<Product[]> {
  if (process.env.NODE_ENV === 'development') {
    await new Promise((r) => setTimeout(r, 1500));
  }

  let query = getSupabase().from('products').select('*');

  if (category) query = query.eq('category', category);

  if (price) {
    const [minStr, maxStr] = price.split('-');
    const min = minStr ? Number(minStr) : 0;
    if (maxStr) {
      query = query.gte('price', min).lte('price', Number(maxStr));
    } else {
      query = query.gte('price', min);
    }
  }

  if (q) query = query.or(`name.ilike.%${q}%,tags.cs.{${q}}`);

  const { data, error } = await query.order('id');
  if (error) return [];
  return (data ?? []).map(mapProduct);
}

export default async function ProductsContent({ q, category, price, page = 1 }: ProductsContentProps) {
  const products = await fetchProducts(q, category, price);

  const totalCount = products.length;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const pageProducts = products.slice(start, start + PAGE_SIZE);

  return (
    <div className="page-container">
      <div className="products-page-header">
        <Heading as="h1" className="page-title">
          {category ? category : 'All Artworks'}
        </Heading>
        <Suspense>
          <SearchBar />
        </Suspense>
      </div>

      <div className="products-layout">
        <Suspense>
          <FilterSidebar />
        </Suspense>
        <div className="products-main">
          <ProductGrid products={pageProducts} totalCount={totalCount} />
          <Suspense>
            <Pagination currentPage={page} totalPages={totalPages} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
