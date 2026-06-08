import type { Product } from '@/types';
import ProductCard from '@/features/products/components/ProductCard';
import Button from '@/components/ui/Button';
import Heading from '@/components/ui/Heading';

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="section">
      <div className="section-header">
        <Heading as="h2" className="section-heading">Featured Works</Heading>
        <Button href="/products" variant="outline">
          View All
        </Button>
      </div>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
