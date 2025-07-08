'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthUserState {
  user: User | null;
  profile: { role: string } | null;
  loading: boolean;
  error: string | null;
}

export function useAuthUser(requiredRole?: string) {
  const [state, setState] = useState<AuthUserState>({
    user: null,
    profile: null,
    loading: true,
    error: null,
  });
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
          router.push('/auth/login');
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profileError || !profile) {
          setState((prev) => ({ ...prev, error: 'Profil bilgileri alınamadı.' }));
          router.push('/'); // Redirect to home or an unauthorized page
          return;
        }

        if (requiredRole && profile.role !== requiredRole) {
          setState((prev) => ({ ...prev, error: 'Yetkisiz erişim.' }));
          router.push('/'); // Redirect if role does not match
          return;
        }

        setState({
          user,
          profile: profile as { role: string },
          loading: false,
          error: null,
        });
      } catch (err: any) {
        setState((prev) => ({ ...prev, error: err.message || 'Kullanıcı bilgileri yüklenirken bir hata oluştu.', loading: false }));
        router.push('/auth/login'); // Fallback redirect on unexpected error
      }
    };

    checkUser();
  }, [router, requiredRole]);

  return state;
}
