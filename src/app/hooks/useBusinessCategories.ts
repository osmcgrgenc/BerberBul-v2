'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/app/lib/supabase';
import { BusinessCategory } from '@/app/types';

export function useBusinessCategories() {
  const [categories, setCategories] = useState<BusinessCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('business_categories')
        .select('id, name, slug');

      if (error) {
        throw new Error(error.message || 'Kategoriler yüklenirken bir hata oluştu.');
      } else {
        setCategories(data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, refetchCategories: fetchCategories };
}
