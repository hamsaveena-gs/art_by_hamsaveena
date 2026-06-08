import { render, screen, fireEvent } from '@testing-library/react';
import Button from '@/components/ui/Button';

describe('Button', () => {
  it('renders a <button> when no href is given', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('renders an <a> link when href is given', () => {
    render(<Button href="/products">Shop</Button>);
    expect(screen.getByRole('link', { name: 'Shop' })).toHaveAttribute('href', '/products');
  });

  it('applies the correct class for each variant', () => {
    const variants = ['primary', 'secondary', 'outline', 'danger'] as const;
    variants.forEach((variant) => {
      const { unmount } = render(<Button variant={variant}>Label</Button>);
      const el = screen.getByRole('button', { name: 'Label' });
      expect(el.className).toContain(`btn-${variant}`);
      unmount();
    });
  });

  it('merges extra className with variant class', () => {
    render(<Button className="mt-4">Label</Button>);
    expect(screen.getByRole('button').className).toContain('mt-4');
  });

  it('passes through button props (disabled, type)', () => {
    render(<Button disabled type="submit">Submit</Button>);
    const btn = screen.getByRole('button', { name: 'Submit' });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('type', 'submit');
  });

  it('fires onClick when clicked', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click</Button>);
    fireEvent.click(screen.getByRole('button', { name: 'Click' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
