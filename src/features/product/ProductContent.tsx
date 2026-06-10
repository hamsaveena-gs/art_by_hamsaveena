import { notFound } from 'next/navigation';
import ProductImages from '@/features/product/components/ProductImages';
import ProductInfo from '@/features/product/components/ProductInfo';
import RelatedProducts from '@/features/product/components/RelatedProducts';
import type { Product } from '@/types';
import { getSupabase } from '@/lib/supabase';
import { mapProduct } from '@/lib/mapProduct';

interface ProductContentProps {
  slug: string;
}

async function fetchProduct(slug: string): Promise<Product | null> {
  const pattern = slug.split('-').join('%');
  const { data, error } = await getSupabase()
    .from('products')
    .select('*')
    .ilike('name', `%${pattern}%`)
    .order('id')
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  return mapProduct(data);
}

async function fetchRelated(category: string, currentId: string): Promise<Product[]> {
  const { data, error } = await getSupabase()
    .from('products')
    .select('*')
    .eq('category', category)
    .neq('id', currentId)
    .limit(4);

  if (error || !data) return [];
  return data.map(mapProduct);
}

export default async function ProductContent({ slug }: ProductContentProps) {
  const product = await fetchProduct(slug);
  if (!product) notFound();

  const related = await fetchRelated(product.category, product.id);

  return (
    <div className="page-container">
      <div className="product-detail">
        <ProductImages images={product.images} name={product.name} />
        <ProductInfo product={product} />
      </div>
      <RelatedProducts products={related} />
    </div>
  );
}
