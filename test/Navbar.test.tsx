import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '@/features/nav/components/Navbar';

jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter:   () => ({ push: jest.fn() }),
}));

jest.mock('@/lib/supabase', () => ({
  getSupabase: () => ({
    auth: { signOut: jest.fn().mockResolvedValue({}) },
  }),
}));

const mockUseUser = jest.fn();
jest.mock('@/hooks/useUser', () => ({
  useUser: () => mockUseUser(),
}));

describe('Navbar', () => {
  it('shows Login link when logged out', () => {
    mockUseUser.mockReturnValue({ firstName: null });
    render(<Navbar />);
    expect(screen.getAllByRole('link', { name: 'Login' }).length).toBeGreaterThan(0);
    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
  });

  it('shows greeting when logged in', () => {
    mockUseUser.mockReturnValue({ firstName: 'Hamsaveena' });
    render(<Navbar />);
    expect(screen.getAllByRole('heading', { level: 2, name: 'Hi, Hamsaveena' }).length).toBeGreaterThan(0);
  });

  it('hides Login link when logged in', () => {
    mockUseUser.mockReturnValue({ firstName: 'Hamsaveena' });
    render(<Navbar />);
    expect(screen.queryAllByRole('link', { name: 'Login' })).toHaveLength(0);
  });

  it('shows Sign out button when logged in', () => {
    mockUseUser.mockReturnValue({ firstName: 'Hamsaveena' });
    render(<Navbar />);
    expect(screen.getAllByRole('button', { name: 'Sign out' }).length).toBeGreaterThan(0);
  });

  it('always shows Home and Shop links', () => {
    mockUseUser.mockReturnValue({ firstName: null });
    render(<Navbar />);
    expect(screen.getAllByRole('link', { name: 'Home' }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: 'Shop' }).length).toBeGreaterThan(0);
  });
});
