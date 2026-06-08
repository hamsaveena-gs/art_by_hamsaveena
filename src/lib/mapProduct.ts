import type { Product } from '@/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapProduct(row: any): Product {
  return {
    id:            row.id,
    name:          row.name,
    category:      row.category,
    price:         row.price,
    originalPrice: row.original_price ?? undefined,
    image:         row.image,
    images:        row.images,
    description:   row.description,
    dimensions:    row.dimensions,
    medium:        row.medium,
    tags:          row.tags,
    inStock:       row.in_stock,
    featured:      row.featured,
    rating:        row.rating,
    reviews:       row.reviews,
  };
}
