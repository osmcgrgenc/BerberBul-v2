'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';
import { Appointment } from '@/app/types';

export function useBarberAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        router.push('/auth/login');
        return;
      }

      const session = await supabase.auth.getSession();
      const accessToken = session.data.session?.access_token;
      if (!accessToken) {
        setError("Kullanıcı oturumu bulunamadı. Lütfen tekrar giriş yapın.");
        setLoading(false);
        return;
      }

      const response = await fetch('/api/barber/appointments', {
        headers: {
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        credentials: "include",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Randevular alınamadı.');
      }

      setAppointments(data);
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  return { appointments, loading, error, refetchAppointments: fetchAppointments };
}
