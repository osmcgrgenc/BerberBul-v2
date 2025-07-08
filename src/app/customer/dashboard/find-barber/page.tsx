'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import SearchBar from './components/SearchBar';
import BarberList from './components/BarberList';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import ErrorMessage from '@/app/components/ErrorMessage';
import { useSearchParams } from 'next/navigation';
import { useBarberSearch } from '@/app/hooks/useBarberSearch';

// Dynamically import the map component to avoid SSR issues
const BarberMap = dynamic(() => import('./components/BarberMap'), {
  ssr: false,
  loading: () => <LoadingSpinner />,
});

export default function FindBarberPage() {
  const searchParams = useSearchParams();
  const initialCategoryId = searchParams.get('categoryId') || '';

  const { barbers, allServices, loading, error, filters, setFilters } = useBarberSearch({
    searchTerm: '',
    location: '',
    serviceId: '',
    categoryId: initialCategoryId,
  });

  const [mapCenter, setMapCenter] = useState<[number, number]>([39.9334, 32.8597]); // Ankara
  const [mapZoom, setMapZoom] = useState(6);

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

