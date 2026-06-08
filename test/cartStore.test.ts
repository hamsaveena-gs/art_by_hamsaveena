import { useCartStore } from '@/features/cart/store/cartStore';
import type { Product } from '@/types';

const p1: Product = {
  id: 'p1', name: 'Sunset Over Venice', category: 'Painting',
  price: 420, image: '/a.jpg', images: ['/a.jpg'],
  description: 'Test', dimensions: '24x36', medium: 'Oil',
  tags: ['oil'], inStock: true, featured: false, rating: 4.9, reviews: 10,
};

const p2: Product = {
  ...p1, id: 'p2', name: 'Autumn Forest', price: 280,
};

beforeEach(() => {
  localStorage.clear();
  useCartStore.setState({ items: [] });
});

describe('addToCart', () => {
  it('adds a new item with quantity 1', () => {
    useCartStore.getState().addToCart(p1);
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].product.id).toBe('p1');
    expect(items[0].quantity).toBe(1);
  });

  it('increments quantity for an existing item', () => {
    useCartStore.getState().addToCart(p1);
    useCartStore.getState().addToCart(p1);
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(2);
  });

  it('caps quantity at MAX_QTY (4)', () => {
    for (let i = 0; i < 6; i++) useCartStore.getState().addToCart(p1);
    expect(useCartStore.getState().items[0].quantity).toBe(4);
  });

  it('adds multiple different products independently', () => {
    useCartStore.getState().addToCart(p1);
    useCartStore.getState().addToCart(p2);
    expect(useCartStore.getState().items).toHaveLength(2);
  });
});

describe('removeFromCart', () => {
  it('removes the specified item', () => {
    useCartStore.getState().addToCart(p1);
    useCartStore.getState().removeFromCart('p1');
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('does not affect other items', () => {
    useCartStore.getState().addToCart(p1);
    useCartStore.getState().addToCart(p2);
    useCartStore.getState().removeFromCart('p1');
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].product.id).toBe('p2');
  });
});

describe('updateQuantity', () => {
  it('updates the quantity of an item', () => {
    useCartStore.getState().addToCart(p1);
    useCartStore.getState().updateQuantity('p1', 3);
    expect(useCartStore.getState().items[0].quantity).toBe(3);
  });

  it('removes the item when quantity is set to 0', () => {
    useCartStore.getState().addToCart(p1);
    useCartStore.getState().updateQuantity('p1', 0);
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('removes the item when quantity is negative', () => {
    useCartStore.getState().addToCart(p1);
    useCartStore.getState().updateQuantity('p1', -1);
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('caps quantity at MAX_QTY (4)', () => {
    useCartStore.getState().addToCart(p1);
    useCartStore.getState().updateQuantity('p1', 10);
    expect(useCartStore.getState().items[0].quantity).toBe(4);
  });
});

describe('clearCart', () => {
  it('removes all items', () => {
    useCartStore.getState().addToCart(p1);
    useCartStore.getState().addToCart(p2);
    useCartStore.getState().clearCart();
    expect(useCartStore.getState().items).toHaveLength(0);
  });
});

describe('totalItems', () => {
  it('returns 0 for an empty cart', () => {
    expect(useCartStore.getState().totalItems()).toBe(0);
  });

  it('sums quantities across all items', () => {
    useCartStore.getState().addToCart(p1);
    useCartStore.getState().addToCart(p1);
    useCartStore.getState().addToCart(p2);
    expect(useCartStore.getState().totalItems()).toBe(3);
  });
});

describe('totalPrice', () => {
  it('returns 0 for an empty cart', () => {
    expect(useCartStore.getState().totalPrice()).toBe(0);
  });

  it('sums price × quantity for each item', () => {
    useCartStore.getState().addToCart(p1); // 420
    useCartStore.getState().addToCart(p2); // 280
    expect(useCartStore.getState().totalPrice()).toBe(700);
  });

  it('accounts for quantity > 1', () => {
    useCartStore.getState().addToCart(p1);
    useCartStore.getState().addToCart(p1); // 420 × 2 = 840
    expect(useCartStore.getState().totalPrice()).toBe(840);
  });
});
