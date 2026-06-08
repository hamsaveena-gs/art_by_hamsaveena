import { render, screen } from '@testing-library/react';
import Header from '@/components/Header';

jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter:   () => ({ push: jest.fn() }),
}));

jest.mock('@/lib/supabase', () => ({
  getSupabase: () => ({
    auth: { signOut: jest.fn().mockResolvedValue({}) },
  }),
}));

jest.mock('@/hooks/useUser', () => ({
  useUser: () => ({ firstName: null, isLoggedIn: false, loading: false }),
}));

describe('Header', () => {
  it('renders a <header> semantic element', () => {
    const { container } = render(<Header />);
    expect(container.querySelector('header')).toBeInTheDocument();
  });

  it('renders the site brand inside the header', () => {
    render(<Header />);
    expect(screen.getAllByText('Art by Hamsaveena').length).toBeGreaterThan(0);
  });

  it('renders a <nav> element inside the header', () => {
    const { container } = render(<Header />);
    expect(container.querySelector('header nav')).toBeInTheDocument();
  });
});
