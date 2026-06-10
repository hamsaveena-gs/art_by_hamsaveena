import { mapProduct } from '@/lib/mapProduct';

describe('mapProduct', () => {
  const row = {
    id:             'p1',
    name:           'Sunset Painting',
    slug:           'sunset-painting',
    category:       'Painting',
    price:          299,
    original_price: 399,
    image:          'https://example.com/img.jpg',
    images:         ['https://example.com/img.jpg'],
    description:    'A lovely sunset',
    dimensions:     '30x40cm',
    medium:         'Oil on canvas',
    tags:           ['sunset', 'painting'],
    stock_quantity: 5,
    featured:       true,
    rating:         4.5,
    reviews:        12,
  };

  it('maps all fields correctly', () => {
    const product = mapProduct(row);
    expect(product.id).toBe('p1');
    expect(product.name).toBe('Sunset Painting');
    expect(product.slug).toBe('sunset-painting');
    expect(product.category).toBe('Painting');
    expect(product.price).toBe(299);
    expect(product.originalPrice).toBe(399);
    expect(product.image).toBe('https://example.com/img.jpg');
    expect(product.inStock).toBe(true);
    expect(product.stockQuantity).toBe(5);
    expect(product.featured).toBe(true);
    expect(product.rating).toBe(4.5);
    expect(product.reviews).toBe(12);
  });

  it('sets originalPrice to undefined when original_price is null', () => {
    const product = mapProduct({ ...row, original_price: null });
    expect(product.originalPrice).toBeUndefined();
  });

  it('derives inStock from stock_quantity', () => {
    expect(mapProduct({ ...row, stock_quantity: 0 }).inStock).toBe(false);
    expect(mapProduct({ ...row, stock_quantity: 1 }).inStock).toBe(true);
  });
});
