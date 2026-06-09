export default function ProductInfoSkeleton() {
  return (
    <div className="product-info">
      <div className="skeleton skeleton-text skeleton-text--sm" />
      <div className="skeleton skeleton-detail-name" />
      <div className="skeleton skeleton-stars" />
      <div className="skeleton skeleton-price" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div className="skeleton skeleton-text skeleton-text--lg" />
        <div className="skeleton skeleton-text skeleton-text--lg" />
        <div className="skeleton skeleton-text skeleton-text--md" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div className="skeleton skeleton-text skeleton-text--md" />
        <div className="skeleton skeleton-text skeleton-text--sm" />
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="skeleton skeleton-tag" />
        ))}
      </div>
      <div className="skeleton skeleton-btn-lg" />
    </div>
  );
}
