import type { Product } from '@/types';
import AddToCartButton from '@/features/product/components/AddToCartButton';
import Heading from '@/components/ui/Heading';
import Text from '@/components/ui/Text';

interface ProductInfoProps {
  product: Product;
}

function StarRating({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <div className="star-rating" aria-label={`Rating: ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Text
          key={star}
          variant="plain"
          as="span"
          className={star <= Math.round(rating) ? 'star star--filled' : 'star'}
        >
          ★
        </Text>
      ))}
      <Text variant="plain" as="span" className="star-count">{rating} ({reviews} reviews)</Text>
    </div>
  );
}

export default function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div className="product-info">
      <Text variant="plain" as="p" className="product-info-category">{product.category}</Text>
      <Heading as="h1" className="product-info-name">{product.name}</Heading>

      <StarRating rating={product.rating} reviews={product.reviews} />

      <div className="product-info-price">
        <Text variant="plain" as="span" className="price-main">₹{product.price}</Text>
        {product.inStock && product.originalPrice && (
          <Text variant="plain" as="span" className="price-original">₹{product.originalPrice}</Text>
        )}
        {product.inStock && product.originalPrice && (
          <Text variant="plain" as="span" className="price-save">
            Save ₹{product.originalPrice - product.price}
          </Text>
        )}
      </div>

      <Text variant="plain" as="p" className="product-info-description">{product.description}</Text>

      <dl className="product-meta">
        <div className="product-meta-row">
          <dt>Dimensions</dt>
          <dd>{product.dimensions}</dd>
        </div>
        <div className="product-meta-row">
          <dt>Medium</dt>
          <dd>{product.medium}</dd>
        </div>
      </dl>

      <div className="product-tags">
        {product.tags.map((tag) => (
          <Text key={tag} variant="plain" as="span" className="tag">{tag}</Text>
        ))}
      </div>

      {product.inStock ? (
        <Text variant="muted" as="p" className="product-stock">
          {product.stockQuantity <= 3
            ? `Only ${product.stockQuantity} left in stock`
            : `${product.stockQuantity} in stock`}
        </Text>
      ) : (
        <Text variant="muted" as="p" className="product-stock">
          Out of stock
        </Text>
      )}
      <AddToCartButton product={product} size="lg" />
    </div>
  );
}
