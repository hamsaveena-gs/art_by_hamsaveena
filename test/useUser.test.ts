import { renderHook, waitFor, act } from '@testing-library/react';
import { useUser } from '@/hooks/useUser';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockUnsubscribe = jest.fn();
const mockOnAuthStateChange = jest.fn();
const mockGetSession = jest.fn();

jest.mock('@/lib/supabase', () => ({
  getSupabase: () => ({
    auth: {
      getSession: mockGetSession,
      onAuthStateChange: mockOnAuthStateChange,
    },
  }),
}));

describe('useUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: mockUnsubscribe } },
    });
  });

  it('starts with loading=true, isLoggedIn=false, and all fields null', () => {
    // getSession that never resolves, so loading stays true
    mockGetSession.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useUser());
    expect(result.current.loading).toBe(true);
    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.firstName).toBeNull();
    expect(result.current.lastName).toBeNull();
    expect(result.current.email).toBeNull();
  });

  it('returns full user data once getSession resolves with a session', async () => {
    mockGetSession.mockResolvedValue({
      data: {
        session: {
          user: {
            email: 'jane@example.com',
            user_metadata: { first_name: 'Jane', last_name: 'Doe' },
          },
        },
      },
    });
    const { result } = renderHook(() => useUser());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.firstName).toBe('Jane');
    expect(result.current.lastName).toBe('Doe');
    expect(result.current.email).toBe('jane@example.com');
  });

  it('sets isLoggedIn=false when session is null', async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } });
    const { result } = renderHook(() => useUser());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.firstName).toBeNull();
    expect(result.current.lastName).toBeNull();
    expect(result.current.email).toBeNull();
  });

  it('handles missing user_metadata gracefully', async () => {
    mockGetSession.mockResolvedValue({
      data: {
        session: {
          user: { email: 'anon@example.com' },
        },
      },
    });
    const { result } = renderHook(() => useUser());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.email).toBe('anon@example.com');
    expect(result.current.firstName).toBeNull();
    expect(result.current.lastName).toBeNull();
  });

  it('calls unsubscribe on unmount', async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } });
    const { unmount } = renderHook(() => useUser());
    await waitFor(() => {});
    unmount();
    expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
  });

  it('updates state via onAuthStateChange sign-in event', async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } });

    let authCallback: (event: string, session: unknown) => void = () => {};
    mockOnAuthStateChange.mockImplementation((cb: typeof authCallback) => {
      authCallback = cb;
      return { data: { subscription: { unsubscribe: mockUnsubscribe } } };
    });

    const { result } = renderHook(() => useUser());
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      authCallback('SIGNED_IN', {
        user: {
          email: 'new@example.com',
          user_metadata: { first_name: 'New', last_name: 'User' },
        },
      });
    });

    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.firstName).toBe('New');
    expect(result.current.lastName).toBe('User');
    expect(result.current.email).toBe('new@example.com');
  });

  it('updates state via onAuthStateChange sign-out event', async () => {
    mockGetSession.mockResolvedValue({
      data: {
        session: {
          user: {
            email: 'jane@example.com',
            user_metadata: { first_name: 'Jane', last_name: 'Doe' },
          },
        },
      },
    });

    let authCallback: (event: string, session: unknown) => void = () => {};
    mockOnAuthStateChange.mockImplementation((cb: typeof authCallback) => {
      authCallback = cb;
      return { data: { subscription: { unsubscribe: mockUnsubscribe } } };
    });

    const { result } = renderHook(() => useUser());
    await waitFor(() => expect(result.current.isLoggedIn).toBe(true));

    act(() => {
      authCallback('SIGNED_OUT', null);
    });

    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.firstName).toBeNull();
    expect(result.current.email).toBeNull();
  });

  it('redirects to /reset-password on PASSWORD_RECOVERY event', async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } });

    let authCallback: (event: string, session: unknown) => void = () => {};
    mockOnAuthStateChange.mockImplementation((cb: typeof authCallback) => {
      authCallback = cb;
      return { data: { subscription: { unsubscribe: mockUnsubscribe } } };
    });

    renderHook(() => useUser());
    await waitFor(() => {});

    act(() => {
      authCallback('PASSWORD_RECOVERY', {
        user: { email: 'test@example.com' },
      });
    });

    expect(mockPush).toHaveBeenCalledWith('/reset-password');
  });
});
