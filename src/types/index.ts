export type Category =
  | 'Painting'
  | 'Clay Art'
  | 'Canvas Art'
  | 'Postcard Art'
  | 'Sketching'
  | 'Digital Art';

export interface CategoryItem {
  name: string;
  description: string;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: Category;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  description: string;
  dimensions: string;
  medium: string;
  tags: string[];
  inStock: boolean;
  stockQuantity: number;
  featured: boolean;
  rating: number;
  reviews: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
