'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/app/lib/supabase';
import { Barber, Service } from '@/app/types';

interface BarberSearchFilters {
  searchTerm: string;
  location: string;
  serviceId: string;
  categoryId: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  date?: string;
  time?: string;
}

export function useBarberSearch(initialFilters: BarberSearchFilters) {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<BarberSearchFilters>(initialFilters);

  // Fetch all services (can be filtered by category later if needed)
  useEffect(() => {
    const fetchAllServices = async () => {
      let query = supabase.from('services').select('id, name');
      if (filters.categoryId) {
        query = query.eq('category_id', filters.categoryId);
      }
      const { data, error } = await query;
      if (error) {
        console.error('Error fetching services:', error);
        setError('Hizmetler yüklenirken bir hata oluştu.');
      } else {
        const uniqueServices = Array.from(new Map(data.map(item => [item.name, item])).values());
        setAllServices(uniqueServices as Service[]);
      }
    };
    fetchAllServices();
  }, [filters.categoryId]);

  const fetchBarbers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (filters.location) {
        const coords = filters.location.split(',').map(Number);
        if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
          queryParams.append('latitude', coords[0].toString());
          queryParams.append('longitude', coords[1].toString());
          queryParams.append('radius', '50');
        } else {
          queryParams.append('location', filters.location);
        }
      }
      if (filters.serviceId) queryParams.append('serviceId', filters.serviceId);
      if (filters.categoryId) queryParams.append('categoryId', filters.categoryId);
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice.toString());
      if (filters.minRating) queryParams.append('minRating', filters.minRating.toString());
      if (filters.date) queryParams.append('date', filters.date);
      if (filters.time) queryParams.append('time', filters.time);

      const response = await fetch(`/api/customer/barbers?${queryParams.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch barbers');
      const data = await response.json();

      const filteredData = data.filter((barber: Barber) =>
        barber.business_name?.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );

      setBarbers(filteredData);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchBarbers();
  }, [fetchBarbers]);

  return { barbers, allServices, loading, error, filters, setFilters, refetchBarbers: fetchBarbers };
}
