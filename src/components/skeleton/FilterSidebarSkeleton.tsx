// 7 = "All" + 6 categories  |  6 = 6 price ranges (matches FilterSidebar exactly)
const FILTER_COUNTS = [7, 6];

export default function FilterSidebarSkeleton() {
  return (
    <div className="filter-sidebar">
      {FILTER_COUNTS.map((count, gi) => (
        <div key={gi} className="filter-group">
          <div className="skeleton skeleton-filter-head" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', paddingBottom: '0.5rem' }}>
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="skeleton skeleton-filter-item skeleton-filter-item--sm" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
