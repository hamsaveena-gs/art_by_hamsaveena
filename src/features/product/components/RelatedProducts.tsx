import type { Product } from '@/types';
import ProductCard from '@/features/products/components/ProductCard';
import Heading from '@/components/ui/Heading';

interface RelatedProductsProps {
  products: Product[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="section">
      <Heading as="h2" className="section-heading">You Might Also Like</Heading>
      <div className="product-grid">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
