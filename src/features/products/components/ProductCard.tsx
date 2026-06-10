import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types';
import AddToCartButton from '@/features/product/components/AddToCartButton';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';

interface ProductCardProps {
  product: Product;
  query?: string;
}

function highlightMatch(text: string, query: string): React.ReactNode {
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return text;
  return (
    <>
      {text.slice(0, index)}
      <mark className="search-highlight">{text.slice(index, index + query.length)}</mark>
      {text.slice(index + query.length)}
    </>
  );
}

export default function ProductCard({ product, query }: ProductCardProps) {
  const matchedTags = query
    ? product.tags.filter((tag) => tag.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <div className="product-card">
      <Link href={`/products/${product.slug}`} className="product-card-image-wrap">
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
        {product.inStock && product.stockQuantity <= 3 && (
          <Text variant="plain" as="span" className="product-card-low-stock">
            Only {product.stockQuantity} left
          </Text>
        )}
        {product.originalPrice && (
          <Text variant="plain" as="span" className="product-card-sale">Sale</Text>
        )}
      </Link>

      <div className="product-card-body">
        <Link href={`/products/${product.slug}`} className="product-card-link">
          <Text variant="plain" as="p" className="product-card-category">{product.category}</Text>
          <Heading as="h3" className="product-card-name">
            {query ? highlightMatch(product.name, query) : product.name}
          </Heading>
        </Link>

        {matchedTags.length > 0 && (
          <div className="product-card-matched-tags">
            {matchedTags.map((tag) => (
              <span key={tag} className="product-card-matched-tag">
                {highlightMatch(tag, query!)}
              </span>
            ))}
          </div>
        )}

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
