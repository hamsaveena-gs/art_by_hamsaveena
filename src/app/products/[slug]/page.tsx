import ProductContent from '@/features/product/ProductContent';

export const dynamic = 'force-dynamic';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ProductContent slug={slug} />;
}
