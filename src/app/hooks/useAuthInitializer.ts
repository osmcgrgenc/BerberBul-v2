'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';
import { useAuthStore } from '@/app/store/authStore';

/**
 * This hook is responsible for synchronizing the Supabase auth state
 * with the Zustand store. It should be used in a central layout component
 * to ensure the auth state is always up-to-date.
 */
export function useAuthInitializer() {
  const { setUser, setRole, clearAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
          clearAuth();
          return;
        }

        const user = session.user;

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profileError || !profile) {
          // If profile doesn't exist, maybe the user is new.
          // Still set the user, but role will be null.
          setUser(user);
          setRole(null);
          return;
        }

        setUser(user);
        setRole(profile.role);

      } catch (err) {
        clearAuth();
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        checkUser(); // Re-check user and profile on auth change
      } else {
        clearAuth();
        router.push('/auth/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setUser, setRole, clearAuth, router]);
}

