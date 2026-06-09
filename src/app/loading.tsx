import { HeroSkeleton, CategoryGridSkeleton, FeaturedProductsSkeleton } from '@/components/skeleton';

export default function Loading() {
  return (
    <>
      <HeroSkeleton />
      <div className="page-container">
        <CategoryGridSkeleton />
        <FeaturedProductsSkeleton />
      </div>
    </>
  );
}
