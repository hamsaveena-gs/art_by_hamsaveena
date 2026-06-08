import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types';
import AddToCartButton from '@/features/product/components/AddToCartButton';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="product-card">
      <Link href={`/products/${product.id}`} className="product-card-image-wrap">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="product-card-image"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {!product.inStock && (
          <Text variant="plain" as="span" className="product-card-sold-out">Sold Out</Text>
        )}
        {product.originalPrice && (
          <Text variant="plain" as="span" className="product-card-sale">Sale</Text>
        )}
      </Link>

      <div className="product-card-body">
        <Link href={`/products/${product.id}`} className="product-card-link">
          <Text variant="plain" as="p" className="product-card-category">{product.category}</Text>
          <Heading as="h3" className="product-card-name">{product.name}</Heading>
        </Link>

        <div className="product-card-footer">
          <div className="product-card-price-wrap">
            <Text variant="plain" as="span" className="product-card-price">₹{product.price}</Text>
            {product.originalPrice && (
              <Text variant="plain" as="span" className="product-card-original">₹{product.originalPrice}</Text>
            )}
          </div>
          <AddToCartButton product={product} size="sm" />
        </div>
      </div>
    </div>
  );
}
