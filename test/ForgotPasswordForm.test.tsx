import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ForgotPasswordForm from '@/features/auth/components/ForgotPasswordForm';

const mockResetPasswordForEmail = jest.fn();

jest.mock('@/lib/supabase', () => ({
  getSupabase: () => ({
    auth: { resetPasswordForEmail: mockResetPasswordForEmail },
  }),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

describe('ForgotPasswordForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders email field and submit button', () => {
    render(<ForgotPasswordForm />);
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument();
  });

  it('has a "Sign in" link to /login', () => {
    render(<ForgotPasswordForm />);
    expect(screen.getByRole('link', { name: /sign in/i })).toHaveAttribute('href', '/login');
  });

  it('shows validation error for invalid email', async () => {
    render(<ForgotPasswordForm />);
    await userEvent.type(screen.getByLabelText(/email address/i), 'notanemail');
    await userEvent.click(screen.getByRole('button', { name: /send reset link/i }));
    expect(await screen.findByText(/enter a valid email/i)).toBeInTheDocument();
  });

  it('shows validation error when submitted with empty email', async () => {
    render(<ForgotPasswordForm />);
    await userEvent.click(screen.getByRole('button', { name: /send reset link/i }));
    expect(await screen.findByText(/enter a valid email/i)).toBeInTheDocument();
  });

  it('calls resetPasswordForEmail with email and redirectTo on valid submit', async () => {
    mockResetPasswordForEmail.mockResolvedValue({ error: null });
    render(<ForgotPasswordForm />);
    await userEvent.type(screen.getByLabelText(/email address/i), 'test@example.com');
    await userEvent.click(screen.getByRole('button', { name: /send reset link/i }));
    await waitFor(() => {
      expect(mockResetPasswordForEmail).toHaveBeenCalledWith(
        'test@example.com',
        expect.objectContaining({ redirectTo: expect.stringContaining('/reset-password') }),
      );
    });
  });

  it('shows success state after submission', async () => {
    mockResetPasswordForEmail.mockResolvedValue({ error: null });
    render(<ForgotPasswordForm />);
    await userEvent.type(screen.getByLabelText(/email address/i), 'test@example.com');
    await userEvent.click(screen.getByRole('button', { name: /send reset link/i }));
    expect(await screen.findByText(/check your email/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to sign in/i })).toBeInTheDocument();
  });

  it('shows auth error on Supabase failure', async () => {
    mockResetPasswordForEmail.mockResolvedValue({ error: { message: 'Email rate limit exceeded' } });
    render(<ForgotPasswordForm />);
    await userEvent.type(screen.getByLabelText(/email address/i), 'test@example.com');
    await userEvent.click(screen.getByRole('button', { name: /send reset link/i }));
    expect(await screen.findByText(/email rate limit exceeded/i)).toBeInTheDocument();
  });

  it('does not show success state when Supabase returns an error', async () => {
    mockResetPasswordForEmail.mockResolvedValue({ error: { message: 'Something went wrong' } });
    render(<ForgotPasswordForm />);
    await userEvent.type(screen.getByLabelText(/email address/i), 'test@example.com');
    await userEvent.click(screen.getByRole('button', { name: /send reset link/i }));
    await waitFor(() => {
      expect(screen.queryByText(/check your email/i)).not.toBeInTheDocument();
    });
  });
});
