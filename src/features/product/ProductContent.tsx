import { notFound } from 'next/navigation';
import ProductImages from '@/features/product/components/ProductImages';
import ProductInfo from '@/features/product/components/ProductInfo';
import RelatedProducts from '@/features/product/components/RelatedProducts';
import type { Product } from '@/types';

interface ProductContentProps {
  id: string;
}

async function fetchProduct(id: string): Promise<Product | null> {
  const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3002';
  const res = await fetch(`${baseUrl}/api/products/${id}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

async function fetchRelated(category: string, currentId: string): Promise<Product[]> {
  const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3002';
  const res = await fetch(`${baseUrl}/api/products?category=${encodeURIComponent(category)}`, {
    cache: 'no-store',
  });
  if (!res.ok) return [];
  const all: Product[] = await res.json();
  return all.filter((p) => p.id !== currentId).slice(0, 4);
}

export default async function ProductContent({ id }: ProductContentProps) {
  const product = await fetchProduct(id);
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
