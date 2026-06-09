import type { Product } from '@/types';
import ProductCard from '@/features/products/components/ProductCard';
import Text from '@/components/ui/Text';

interface ProductGridProps {
  products: Product[];
  totalCount?: number;
  query?: string;
}

export default function ProductGrid({ products, totalCount, query }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="empty-state">
        <Text variant="plain" as="p" className="empty-title">No artworks found</Text>
        <Text variant="plain" as="p" className="empty-subtitle">Try adjusting your search or filters.</Text>
      </div>
    );
  }

  const count = totalCount ?? products.length;

  return (
    <>
      <Text variant="muted" as="p">
        {count} {count === 1 ? 'artwork' : 'artworks'} found
      </Text>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} query={query} />
        ))}
      </div>
    </>
  );
}
