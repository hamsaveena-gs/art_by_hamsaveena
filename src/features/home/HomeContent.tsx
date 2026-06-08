import HeroSection from '@/features/home/components/HeroSection';
import CategoryGrid from '@/features/home/components/CategoryGrid';
import FeaturedProducts from '@/features/home/components/FeaturedProducts';
import type { Product, CategoryItem } from '@/types';
import { getSupabase } from '@/lib/supabase';
import { mapProduct } from '@/lib/mapProduct';

async function fetchFeatured(): Promise<Product[]> {
  if (process.env.NODE_ENV === 'development') {
    await new Promise((r) => setTimeout(r, 1500));
  }

  const { data, error } = await getSupabase()
    .from('products')
    .select('*')
    .eq('featured', true)
    .order('id');

  if (error) return [];
  return (data ?? []).map(mapProduct);
}

async function fetchCategories(): Promise<CategoryItem[]> {
  const { data, error } = await getSupabase()
    .from('categories')
    .select('name, description, image')
    .order('name');

  if (error) return [];
  return data ?? [];
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
