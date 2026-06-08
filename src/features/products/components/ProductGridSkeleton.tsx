import ProductCardSkeleton from '@/features/products/components/ProductCardSkeleton';

const PAGE_SIZE = 8;

export default function ProductGridSkeleton() {
  return (
    <>
      <div className="skeleton skeleton-text skeleton-count" />
      <div className="product-grid">
        {Array.from({ length: PAGE_SIZE }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </>
  );
}
