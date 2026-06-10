import ProductContent from '@/features/product/ProductContent';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ProductContent slug={slug} />;
}
