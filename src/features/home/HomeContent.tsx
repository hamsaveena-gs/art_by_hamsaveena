import HeroSection from '@/features/home/components/HeroSection';
import CategoryGrid from '@/features/home/components/CategoryGrid';
import FeaturedProducts from '@/features/home/components/FeaturedProducts';
import type { Product, CategoryItem } from '@/types';

async function fetchFeatured(): Promise<Product[]> {
  if (process.env.NODE_ENV === 'development') {
    await new Promise((r) => setTimeout(r, 1500));
  }

  const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3002';
  const res = await fetch(`${baseUrl}/api/products?featured=true`, {
    cache: 'no-store',
  });
  if (!res.ok) return [];
  return res.json();
}

async function fetchCategories(): Promise<CategoryItem[]> {
  const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3002';
  const res = await fetch(`${baseUrl}/api/categories`, {
    cache: 'no-store',
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function HomeContent() {
  const [featured, categories] = await Promise.all([
    fetchFeatured(),
    fetchCategories(),
  ]);

  return (
    <>
      <HeroSection />
      <div className="page-container">
        <CategoryGrid categories={categories} />
        <FeaturedProducts products={featured.slice(0, 8)} />
      </div>
    </>
  );
}
