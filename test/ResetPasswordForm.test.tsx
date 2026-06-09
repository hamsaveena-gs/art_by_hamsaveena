import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResetPasswordForm from '@/features/auth/components/ResetPasswordForm';

const mockUpdateUser = jest.fn();

jest.mock('@/lib/supabase', () => ({
  getSupabase: () => ({
    auth: { updateUser: mockUpdateUser },
  }),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

describe('ResetPasswordForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders new password and confirm password fields', () => {
    render(<ResetPasswordForm />);
    expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /update password/i })).toBeInTheDocument();
  });

  it('has a "Back to Sign In" link to /login', () => {
    render(<ResetPasswordForm />);
    expect(screen.getByRole('link', { name: /back to sign in/i })).toHaveAttribute('href', '/login');
  });

  it('shows error when password is too short', async () => {
    render(<ResetPasswordForm />);
    await userEvent.type(screen.getByLabelText(/new password/i), '12345');
    await userEvent.type(screen.getByLabelText(/confirm password/i), '12345');
    await userEvent.click(screen.getByRole('button', { name: /update password/i }));
    expect(await screen.findByText(/at least 6 characters/i)).toBeInTheDocument();
  });

  it('shows error when confirm field is empty', async () => {
    render(<ResetPasswordForm />);
    await userEvent.type(screen.getByLabelText(/new password/i), 'secure123');
    await userEvent.click(screen.getByRole('button', { name: /update password/i }));
    expect(await screen.findByText(/please confirm your password/i)).toBeInTheDocument();
  });

  it('shows error when passwords do not match', async () => {
    render(<ResetPasswordForm />);
    await userEvent.type(screen.getByLabelText(/new password/i), 'password123');
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'different456');
    await userEvent.click(screen.getByRole('button', { name: /update password/i }));
    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
  });

  it('calls updateUser with the new password on valid submit', async () => {
    mockUpdateUser.mockResolvedValue({ error: null });
    render(<ResetPasswordForm />);
    await userEvent.type(screen.getByLabelText(/new password/i), 'newpass123');
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'newpass123');
    await userEvent.click(screen.getByRole('button', { name: /update password/i }));
    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith({ password: 'newpass123' });
    });
  });

  it('shows success state after password update', async () => {
    mockUpdateUser.mockResolvedValue({ error: null });
    render(<ResetPasswordForm />);
    await userEvent.type(screen.getByLabelText(/new password/i), 'newpass123');
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'newpass123');
    await userEvent.click(screen.getByRole('button', { name: /update password/i }));
    expect(await screen.findByText(/password updated/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows auth error on Supabase failure', async () => {
    mockUpdateUser.mockResolvedValue({ error: { message: 'Token has expired or is invalid' } });
    render(<ResetPasswordForm />);
    await userEvent.type(screen.getByLabelText(/new password/i), 'newpass123');
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'newpass123');
    await userEvent.click(screen.getByRole('button', { name: /update password/i }));
    expect(await screen.findByText(/token has expired or is invalid/i)).toBeInTheDocument();
  });

  it('does not show success state when Supabase returns an error', async () => {
    mockUpdateUser.mockResolvedValue({ error: { message: 'Session expired' } });
    render(<ResetPasswordForm />);
    await userEvent.type(screen.getByLabelText(/new password/i), 'newpass123');
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'newpass123');
    await userEvent.click(screen.getByRole('button', { name: /update password/i }));
    await waitFor(() => {
      expect(screen.queryByText(/password updated/i)).not.toBeInTheDocument();
    });
  });
});
