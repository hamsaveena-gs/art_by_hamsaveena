import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '@/features/auth/components/LoginForm';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockSignIn = jest.fn();
jest.mock('@/lib/supabase', () => ({
  getSupabase: () => ({
    auth: {
      signInWithPassword: mockSignIn,
    },
  }),
}));

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => ({ exists: true }),
    });
    mockSignIn.mockResolvedValue({ error: null });
  });

  it('renders the heading', () => {
    render(<LoginForm />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Welcome Back');
  });

  it('renders email and password inputs', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('renders the Sign In submit button', () => {
    render(<LoginForm />);
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('renders the sign up link', () => {
    render(<LoginForm />);
    expect(screen.getByRole('link', { name: 'Sign up free' })).toBeInTheDocument();
  });

  it('shows email validation error when empty', async () => {
    const { findByText } = render(<LoginForm />);
    const btn = screen.getByRole('button', { name: 'Sign In' });
    btn.click();
    expect(await findByText(/valid email/i)).toBeInTheDocument();
  });

  it('redirects to home on successful sign in', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);
    await user.type(screen.getByLabelText(/email address/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'secret1');
    await user.click(screen.getByRole('button', { name: 'Sign In' }));
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/'));
  });

  it('calls signInWithPassword with correct credentials', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);
    await user.type(screen.getByLabelText(/email address/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'secret1');
    await user.click(screen.getByRole('button', { name: 'Sign In' }));
    await waitFor(() => expect(mockSignIn).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'secret1',
    }));
  });

  it('shows auth error message when sign in fails', async () => {
    mockSignIn.mockResolvedValue({ error: { message: 'Invalid login credentials' } });
    const user = userEvent.setup();
    render(<LoginForm />);
    await user.type(screen.getByLabelText(/email address/i), 'bad@example.com');
    await user.type(screen.getByLabelText(/password/i), 'wrongpass');
    await user.click(screen.getByRole('button', { name: 'Sign In' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid login credentials');
  });

  it('does not redirect when sign in fails', async () => {
    mockSignIn.mockResolvedValue({ error: { message: 'Invalid login credentials' } });
    const user = userEvent.setup();
    render(<LoginForm />);
    await user.type(screen.getByLabelText(/email address/i), 'bad@example.com');
    await user.type(screen.getByLabelText(/password/i), 'wrongpass');
    await user.click(screen.getByRole('button', { name: 'Sign In' }));
    await screen.findByRole('alert');
    expect(mockPush).not.toHaveBeenCalled();
  });
});
