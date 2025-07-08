'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';
import { Appointment } from '@/app/types';

export function useCustomerAppointments() {
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

      const response = await fetch('/api/customer/appointments');
      if (!response.ok) throw new Error('Failed to fetch appointments');
      const data = await response.json();
      setAppointments(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  return { appointments, loading, error, refetchAppointments: fetchAppointments };
}
