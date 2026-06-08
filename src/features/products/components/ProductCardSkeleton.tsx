export default function ProductCardSkeleton() {
  return (
    <div className="product-card">
      <div className="product-card-image-wrap skeleton" />
      <div className="product-card-body">
        <div className="skeleton skeleton-text skeleton-text--sm" style={{ marginBottom: '0.25rem' }} />
        <div className="skeleton skeleton-text skeleton-text--lg" />
        <div className="product-card-footer">
          <div className="skeleton skeleton-text skeleton-text--md" />
          <div className="skeleton skeleton-btn" />
        </div>
      </div>
    </div>
  );
}
