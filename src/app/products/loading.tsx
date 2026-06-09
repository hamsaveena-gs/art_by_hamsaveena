import { FilterSidebarSkeleton, ProductGridSkeleton } from '@/components/skeleton';

export default function Loading() {
  return (
    <div className="page-container">
      <div className="products-page-header">
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-search" />
      </div>
      <div className="products-layout">
        <FilterSidebarSkeleton />
        <div className="products-main">
          <ProductGridSkeleton />
        </div>
      </div>
    </div>
  );
}
