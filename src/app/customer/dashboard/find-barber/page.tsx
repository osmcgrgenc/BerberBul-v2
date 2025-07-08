'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { supabase } from '@/app/lib/supabase';
import SearchBar from './components/SearchBar';
import BarberList from './components/BarberList';
import LoadingSpinner from '@/app/components/LoadingSpinner'; // Assuming a global spinner
import ErrorMessage from '@/app/components/ErrorMessage'; // Assuming a global error component
import { useSearchParams } from 'next/navigation';

// Dynamically import the map component to avoid SSR issues
const BarberMap = dynamic(() => import('./components/BarberMap'), {
  ssr: false,
  loading: () => <LoadingSpinner />,
});

// Types (assuming these are defined in a central types file, e.g., src/types/index.ts)
import { Barber, Service } from '@/app/types';

export default function FindBarberPage() {
  const searchParams = useSearchParams();
  const initialCategoryId = searchParams.get('categoryId') || '';

  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ searchTerm: '', location: '', serviceId: '', categoryId: initialCategoryId });
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([39.9334, 32.8597]); // Ankara
  const [mapZoom, setMapZoom] = useState(6);

  useEffect(() => {
    const fetchAllServices = async () => {
      let query = supabase.from('services').select('id, name');
      if (filters.categoryId) {
        query = query.eq('category_id', filters.categoryId);
      }
      const { data, error } = await query;
      if (error) {
        console.error('Error fetching services:', error);
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
      if (filters.categoryId) queryParams.append('categoryId', filters.categoryId); // Pass categoryId to API

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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900">Berber Bul</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <SearchBar
          filters={filters}
          setFilters={setFilters}
          allServices={allServices}
          setMapCenter={setMapCenter}
          setMapZoom={setMapZoom}
        />
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="h-96 lg:h-[600px] bg-white shadow rounded-lg overflow-hidden">
              <BarberMap barbers={barbers} center={mapCenter} zoom={mapZoom} />
            </div>
          </div>
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Sonuçlar</h2>
            {loading ? (
              <LoadingSpinner />
            ) : error ? (
              <ErrorMessage message={error} />
            ) : (
              <BarberList barbers={barbers} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

