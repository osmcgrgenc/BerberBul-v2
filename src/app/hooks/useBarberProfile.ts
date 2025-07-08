'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/app/lib/supabase';
import { Barber } from '@/app/types';

export function useBarberProfile(barberId: string) {
  const [barber, setBarber] = useState<Barber | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBarberProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          business_name,
          address,
          phone_number,
          bio,
          services(id, name, price, duration_minutes),
          working_hours(day_of_week, start_time, end_time)
        `)
        .eq('id', barberId)
        .eq('role', 'barber')
        .single();

      if (error) {
        throw new Error(error.message || 'Berber profili bulunamadı.');
      }
      if (!data) {
        throw new Error('Berber profili bulunamadı.');
      }
      setBarber(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [barberId]);

  useEffect(() => {
    if (barberId) {
      fetchBarberProfile();
    }
  }, [barberId, fetchBarberProfile]);

  return { barber, loading, error, refetchBarberProfile: fetchBarberProfile };
}
