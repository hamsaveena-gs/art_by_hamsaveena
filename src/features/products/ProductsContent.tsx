import { Suspense } from 'react';
import type { Product, Category } from '@/types';
import SearchBar from '@/features/products/components/SearchBar';
import FilterSidebar from '@/features/products/components/FilterSidebar';
import ProductGrid from '@/features/products/components/ProductGrid';
import Pagination from '@/components/ui/Pagination';
import { categories } from '@/lib/products';
import Heading from '@/components/ui/Heading';

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

  const params = new URLSearchParams();
  if (q)        params.set('q', q);
  if (category) params.set('category', category);
  if (price)    params.set('price', price);

  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    ? `${process.env.NEXTAUTH_URL ?? 'http://localhost:3002'}`
    : 'http://localhost:3002';

  const res = await fetch(`${baseUrl}/api/products?${params.toString()}`, {
    cache: 'no-store',
  });

  if (!res.ok) return [];
  return res.json();
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
