import { useEffect, useState } from 'react';
import { getSupabase } from '@/lib/supabase';

export function useUser() {
  const [firstName,  setFirstName]  = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    const supabase = getSupabase();

    // Seed from the current session immediately
    supabase.auth.getSession().then(({ data: { session } }) => {
      setFirstName(session?.user?.user_metadata?.first_name ?? null);
      setIsLoggedIn(!!session);
      setLoading(false);
    });

    // Stay in sync when the user logs in or out
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setFirstName(session?.user?.user_metadata?.first_name ?? null);
        setIsLoggedIn(!!session);
        setLoading(false);
      },
    );

    return () => subscription.unsubscribe();
  }, []);

  return { firstName, isLoggedIn, loading };
}
