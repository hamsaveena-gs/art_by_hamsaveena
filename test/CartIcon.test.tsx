import { render, screen, act } from '@testing-library/react';
import CartIcon from '@/features/nav/components/CartIcon';
import { useCartStore } from '@/features/cart/store/cartStore';

jest.mock('@/features/cart/store/cartStore');

function mockItems(count: number) {
  (useCartStore as unknown as jest.Mock).mockImplementation(
    (selector?: (s: { totalItems: () => number }) => unknown) => {
      const state = { totalItems: () => count };
      return selector ? selector(state) : state;
    }
  );
}

describe('CartIcon', () => {
  it('renders a link to /cart', () => {
    mockItems(0);
    render(<CartIcon />);
    expect(screen.getByRole('link', { name: 'Cart' })).toHaveAttribute('href', '/cart');
  });

  it('does not show a badge when cart is empty', () => {
    mockItems(0);
    render(<CartIcon />);
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('shows a badge with item count after mount', async () => {
    mockItems(3);
    await act(async () => {
      render(<CartIcon />);
    });
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
