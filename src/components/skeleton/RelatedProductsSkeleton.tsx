import ProductCardSkeleton from '@/components/skeleton/ProductCardSkeleton';

const RELATED_COUNT = 4;

export default function RelatedProductsSkeleton() {
  return (
    <section className="section">
      <div className="skeleton skeleton-section-heading" style={{ marginBottom: '1.5rem' }} />
      <div className="product-grid">
        {Array.from({ length: RELATED_COUNT }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}
