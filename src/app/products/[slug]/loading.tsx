import { ProductImagesSkeleton, ProductInfoSkeleton, RelatedProductsSkeleton } from '@/components/skeleton';

export default function Loading() {
  return (
    <div className="page-container">
      <div className="product-detail">
        <ProductImagesSkeleton />
        <ProductInfoSkeleton />
      </div>
      <RelatedProductsSkeleton />
    </div>
  );
}
