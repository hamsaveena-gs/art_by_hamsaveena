import { render, screen } from '@testing-library/react';
import LoginForm from '@/features/auth/components/LoginForm';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('@/lib/supabase', () => ({
  getSupabase: () => ({
    auth: {
      signInWithPassword: jest.fn().mockResolvedValue({ error: null }),
    },
  }),
}));

describe('LoginForm', () => {
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
});
