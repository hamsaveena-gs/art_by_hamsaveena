import { useEffect, useState } from 'react';
import { getSupabase } from '@/lib/supabase';

interface UserInfo {
  firstName:  string | null;
  lastName:   string | null;
  email:      string | null;
  isLoggedIn: boolean;
  loading:    boolean;
}

function extractUser(session: { user: { email?: string; user_metadata?: Record<string, string> } } | null): Omit<UserInfo, 'loading'> {
  return {
    firstName:  session?.user?.user_metadata?.first_name ?? null,
    lastName:   session?.user?.user_metadata?.last_name  ?? null,
    email:      session?.user?.email ?? null,
    isLoggedIn: !!session,
  };
}

export function useUser(): UserInfo {
  const [info, setInfo] = useState<UserInfo>({
    firstName:  null,
    lastName:   null,
    email:      null,
    isLoggedIn: false,
    loading:    true,
  });

  useEffect(() => {
    const supabase = getSupabase();

    // Seed from the current session immediately
    supabase.auth.getSession().then(({ data: { session } }) => {
      setInfo({ ...extractUser(session), loading: false });
    });

    // Stay in sync when the user logs in or out
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setInfo({ ...extractUser(session), loading: false });
      },
    );

    return () => subscription.unsubscribe();
  }, []);

  return info;
}
