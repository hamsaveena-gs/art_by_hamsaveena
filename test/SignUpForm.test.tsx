import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignUpForm from '@/features/auth/components/SignUpForm';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

const mockSignUp = jest.fn();
jest.mock('@/lib/supabase', () => ({
  getSupabase: () => ({
    auth: { signUp: mockSignUp },
  }),
}));

async function fillValidForm() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText('First Name'), 'Jane');
  await user.type(screen.getByLabelText('Last Name'), 'Doe');
  await user.type(screen.getByLabelText('Email Address'), 'jane@example.com');
  await user.type(screen.getByLabelText('Password'), 'secret1');
  await user.type(screen.getByLabelText('Confirm Password'), 'secret1');
}

describe('SignUpForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => ({ exists: false }),
    });
    mockSignUp.mockResolvedValue({ error: null });
  });

  it('renders heading "Create Account"', () => {
    render(<SignUpForm />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Create Account');
  });

  it('renders all form fields', () => {
    render(<SignUpForm />);
    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
  });

  it('renders the Create Account submit button', () => {
    render(<SignUpForm />);
    expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument();
  });

  it('renders the brand name', () => {
    render(<SignUpForm />);
    expect(screen.getByText('Art by Hamsaveena')).toBeInTheDocument();
  });

  it('renders the Sign in link', () => {
    render(<SignUpForm />);
    expect(screen.getByRole('link', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('shows validation error for empty first name on submit', async () => {
    render(<SignUpForm />);
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));
    expect(await screen.findByText('First name is required')).toBeInTheDocument();
  });

  it('shows validation error for invalid email', async () => {
    const user = userEvent.setup();
    render(<SignUpForm />);
    await user.type(screen.getByLabelText('First Name'), 'Jane');
    await user.type(screen.getByLabelText('Last Name'), 'Doe');
    await user.type(screen.getByLabelText('Email Address'), 'not-an-email');
    await user.type(screen.getByLabelText('Password'), 'secret1');
    await user.type(screen.getByLabelText('Confirm Password'), 'secret1');
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));
    expect(await screen.findByText('Enter a valid email address')).toBeInTheDocument();
  });

  it('shows passwords do not match error', async () => {
    const user = userEvent.setup();
    render(<SignUpForm />);
    await user.type(screen.getByLabelText('First Name'), 'Jane');
    await user.type(screen.getByLabelText('Last Name'), 'Doe');
    await user.type(screen.getByLabelText('Email Address'), 'jane@example.com');
    await user.type(screen.getByLabelText('Password'), 'secret1');
    await user.type(screen.getByLabelText('Confirm Password'), 'different');
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));
    expect(await screen.findByText('Passwords do not match')).toBeInTheDocument();
  });

  it('shows password too short error', async () => {
    const user = userEvent.setup();
    render(<SignUpForm />);
    await user.type(screen.getByLabelText('First Name'), 'Jane');
    await user.type(screen.getByLabelText('Last Name'), 'Doe');
    await user.type(screen.getByLabelText('Email Address'), 'jane@example.com');
    await user.type(screen.getByLabelText('Password'), 'abc');
    await user.type(screen.getByLabelText('Confirm Password'), 'abc');
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));
    expect(await screen.findByText('Password must be at least 6 characters')).toBeInTheDocument();
  });

  it('calls supabase signUp with correct payload', async () => {
    render(<SignUpForm />);
    await fillValidForm();
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));
    await waitFor(() => expect(mockSignUp).toHaveBeenCalledTimes(1));
    expect(mockSignUp).toHaveBeenCalledWith({
      email: 'jane@example.com',
      password: 'secret1',
      options: { data: { first_name: 'Jane', last_name: 'Doe' } },
    });
  });

  it('shows success state after successful signUp', async () => {
    render(<SignUpForm />);
    await fillValidForm();
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));
    expect(await screen.findByRole('heading', { level: 1, name: 'Check your email' })).toBeInTheDocument();
  });

  it('shows "Back to Sign In" link in success state', async () => {
    render(<SignUpForm />);
    await fillValidForm();
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));
    expect(await screen.findByRole('link', { name: 'Back to Sign In' })).toBeInTheDocument();
  });

  it('shows auth error when signUp fails', async () => {
    mockSignUp.mockResolvedValue({ error: { message: 'Email already registered' } });
    render(<SignUpForm />);
    await fillValidForm();
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Email already registered');
  });

  it('clears auth error on new submit attempt', async () => {
    mockSignUp
      .mockResolvedValueOnce({ error: { message: 'Email already registered' } })
      .mockResolvedValueOnce({ error: null });
    render(<SignUpForm />);
    await fillValidForm();
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));
    expect(await screen.findByRole('alert')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));
    await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument());
  });
});
