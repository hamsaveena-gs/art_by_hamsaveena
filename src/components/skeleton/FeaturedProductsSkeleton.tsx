import ProductCardSkeleton from '@/components/skeleton/ProductCardSkeleton';

export default function FeaturedProductsSkeleton() {
  return (
    <section className="section">
      <div className="section-header" style={{ marginBottom: '1.5rem' }}>
        <div className="skeleton skeleton-section-heading" />
        <div className="skeleton skeleton-view-all" />
      </div>
      <div className="product-grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}
