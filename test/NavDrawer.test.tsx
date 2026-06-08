import { render, screen, fireEvent } from '@testing-library/react';
import NavDrawer from '@/features/nav/components/NavDrawer';

const links = [
  { href: '/',         label: 'Home' },
  { href: '/products', label: 'Shop' },
  { href: '/login',    label: 'Login' },
];

describe('NavDrawer', () => {
  it('renders all nav links', () => {
    render(<NavDrawer isOpen navLinks={links} onClose={jest.fn()} pathname="/" />);
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Shop' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Login' })).toBeInTheDocument();
  });

  it('applies active class to the current path link', () => {
    render(<NavDrawer isOpen navLinks={links} onClose={jest.fn()} pathname="/products" />);
    expect(screen.getByRole('link', { name: 'Shop' }).className).toContain('nav-drawer-link--active');
  });

  it('does not apply active class to non-current links', () => {
    render(<NavDrawer isOpen navLinks={links} onClose={jest.fn()} pathname="/products" />);
    expect(screen.getByRole('link', { name: 'Home' }).className).not.toContain('nav-drawer-link--active');
  });

  it('shows overlay when open', () => {
    const { container } = render(<NavDrawer isOpen navLinks={links} onClose={jest.fn()} pathname="/" />);
    expect(container.querySelector('.nav-drawer-overlay')).toBeInTheDocument();
  });

  it('hides overlay when closed', () => {
    const { container } = render(<NavDrawer isOpen={false} navLinks={links} onClose={jest.fn()} pathname="/" />);
    expect(container.querySelector('.nav-drawer-overlay')).not.toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', () => {
    const onClose = jest.fn();
    render(<NavDrawer isOpen navLinks={links} onClose={onClose} pathname="/" />);
    fireEvent.click(screen.getByRole('button', { name: 'Close menu' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when overlay is clicked', () => {
    const onClose = jest.fn();
    const { container } = render(<NavDrawer isOpen navLinks={links} onClose={onClose} pathname="/" />);
    fireEvent.click(container.querySelector('.nav-drawer-overlay')!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('shows greeting and sign out when firstName is provided', () => {
    render(
      <NavDrawer isOpen navLinks={links} onClose={jest.fn()} pathname="/" firstName="Hamsaveena" onSignOut={jest.fn()} />,
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Hi, Hamsaveena' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign out' })).toBeInTheDocument();
  });

  it('does not show greeting when firstName is not provided', () => {
    render(<NavDrawer isOpen navLinks={links} onClose={jest.fn()} pathname="/" />);
    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
  });

  it('calls onSignOut when sign out button is clicked', () => {
    const onSignOut = jest.fn();
    render(
      <NavDrawer isOpen navLinks={links} onClose={jest.fn()} pathname="/" firstName="Hamsaveena" onSignOut={onSignOut} />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Sign out' }));
    expect(onSignOut).toHaveBeenCalledTimes(1);
  });
});
