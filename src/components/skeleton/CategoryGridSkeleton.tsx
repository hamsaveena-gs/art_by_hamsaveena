export default function CategoryGridSkeleton() {
  return (
    <section className="section">
      <div className="skeleton skeleton-section-heading" style={{ marginBottom: '1.5rem' }} />
      <div className="category-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton skeleton-category-card" />
        ))}
      </div>
    </section>
  );
}
