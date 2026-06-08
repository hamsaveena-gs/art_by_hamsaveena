import ProductCardSkeleton from '@/features/products/components/ProductCardSkeleton';

export default function Loading() {
  return (
    <>
      {/* ── Hero ── */}
      <div className="skeleton-hero" />

      <div className="page-container">

        {/* ── Category Grid ── */}
        <section className="section">
          <div className="skeleton skeleton-section-heading" style={{ marginBottom: '1.5rem' }} />
          <div className="category-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton skeleton-category-card" />
            ))}
          </div>
        </section>

        {/* ── Featured Products ── */}
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

      </div>
    </>
  );
}
