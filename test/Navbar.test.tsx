import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Navbar from '@/features/nav/components/Navbar';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter:   () => ({ push: mockPush }),
}));

const mockSignOut = jest.fn();
jest.mock('@/lib/supabase', () => ({
  getSupabase: () => ({
    auth: { signOut: mockSignOut },
  }),
}));

const mockUseUser = jest.fn();
jest.mock('@/hooks/useUser', () => ({
  useUser: () => mockUseUser(),
}));

describe('Navbar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows Login link when logged out', () => {
    mockUseUser.mockReturnValue({ firstName: null, isLoggedIn: false, loading: false });
    render(<Navbar />);
    expect(screen.getAllByRole('link', { name: 'Login' }).length).toBeGreaterThan(0);
    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
  });

  it('shows greeting when logged in', () => {
    mockUseUser.mockReturnValue({ firstName: 'Hamsaveena', isLoggedIn: true, loading: false });
    render(<Navbar />);
    expect(screen.getAllByRole('heading', { level: 2, name: 'Hi, Hamsaveena' }).length).toBeGreaterThan(0);
  });

  it('hides Login link when logged in', () => {
    mockUseUser.mockReturnValue({ firstName: 'Hamsaveena', isLoggedIn: true, loading: false });
    render(<Navbar />);
    expect(screen.queryAllByRole('link', { name: 'Login' })).toHaveLength(0);
  });

  it('shows Sign out button when logged in', () => {
    mockUseUser.mockReturnValue({ firstName: 'Hamsaveena', isLoggedIn: true, loading: false });
    render(<Navbar />);
    expect(screen.getAllByRole('button', { name: 'Sign out' }).length).toBeGreaterThan(0);
  });

  it('always shows Home and Shop links', () => {
    mockUseUser.mockReturnValue({ firstName: null, isLoggedIn: false, loading: false });
    render(<Navbar />);
    expect(screen.getAllByRole('link', { name: 'Home' }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: 'Shop' }).length).toBeGreaterThan(0);
  });

  it('calls signOut and redirects to /login when Sign out is clicked', async () => {
    mockSignOut.mockResolvedValue({});
    mockUseUser.mockReturnValue({ firstName: 'Hamsaveena', isLoggedIn: true, loading: false });
    render(<Navbar />);
    const signOutButtons = screen.getAllByRole('button', { name: 'Sign out' });
    fireEvent.click(signOutButtons[0]);
    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });
});
