import ProductsContent from '@/features/products/ProductsContent';

export const dynamic = 'force-dynamic';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; price?: string; page?: string }>;
}) {
  const { q, category, price, page } = await searchParams;
  const pageNum = page ? Math.max(1, parseInt(page, 10)) : 1;
  return <ProductsContent q={q} category={category} price={price} page={pageNum} />;
}
