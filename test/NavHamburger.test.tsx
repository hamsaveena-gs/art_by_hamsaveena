import { render, screen, fireEvent } from '@testing-library/react';
import NavHamburger from '@/features/nav/components/NavHamburger';

describe('NavHamburger', () => {
  it('renders "Open menu" label when closed', () => {
    render(<NavHamburger isOpen={false} onToggle={jest.fn()} />);
    expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument();
  });

  it('renders "Close menu" label when open', () => {
    render(<NavHamburger isOpen={true} onToggle={jest.fn()} />);
    expect(screen.getByRole('button', { name: 'Close menu' })).toBeInTheDocument();
  });

  it('calls onToggle when clicked', () => {
    const onToggle = jest.fn();
    render(<NavHamburger isOpen={false} onToggle={onToggle} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('applies open classes to bars when isOpen is true', () => {
    const { container } = render(<NavHamburger isOpen={true} onToggle={jest.fn()} />);
    const bars = container.querySelectorAll('.nav-hamburger-bar');
    bars.forEach((bar) => {
      expect(bar.className).toContain('-open');
    });
  });

  it('does not apply open classes when isOpen is false', () => {
    const { container } = render(<NavHamburger isOpen={false} onToggle={jest.fn()} />);
    const bars = container.querySelectorAll('.nav-hamburger-bar');
    bars.forEach((bar) => {
      expect(bar.className).not.toContain('-open');
    });
  });
});
