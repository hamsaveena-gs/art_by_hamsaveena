import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const [info, setInfo] = useState<UserInfo>({
    firstName:  null,
    lastName:   null,
    email:      null,
    isLoggedIn: false,
    loading:    true,
  });

  useEffect(() => {
    const supabase = getSupabase();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setInfo({ ...extractUser(session), loading: false });
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setInfo({ ...extractUser(session), loading: false });
        if (event === 'PASSWORD_RECOVERY') {
          router.push('/reset-password');
        }
      },
    );

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return info;
}
