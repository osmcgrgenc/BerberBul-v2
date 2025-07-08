'use client';

import { Service } from '@/app/types';
import toast from 'react-hot-toast';

interface SearchBarProps {
  filters: { searchTerm: string; location: string; serviceId: string; categoryId: string; minPrice?: number; maxPrice?: number; minRating?: number; date?: string; time?: string };
  setFilters: (filters: { searchTerm: string; location: string; serviceId: string; categoryId: string; minPrice?: number; maxPrice?: number; minRating?: number; date?: string; time?: string }) => void;
  allServices: Service[];
  setMapCenter: (center: [number, number]) => void;
  setMapZoom: (zoom: number) => void;
}

export default function SearchBar({ filters, setFilters, allServices, setMapCenter, setMapZoom }: SearchBarProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value === '' ? undefined : Number(value) });
  };

  const handleGeoLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFilters({ ...filters, location: `${latitude},${longitude}` });
          setMapCenter([latitude, longitude]);
          setMapZoom(13);
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast.error('Konum alınamadı. Lütfen tarayıcı ayarlarınızı kontrol edin.');
        }
      );
    } else {
      toast.info('Tarayıcınız konum servislerini desteklemiyor.');
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <input
          type="text"
          name="searchTerm"
          value={filters.searchTerm}
          onChange={handleInputChange}
          placeholder="Berber Adı..."
          className="w-full px-3 py-2 border rounded-md"
        />
        <input
          type="text"
          name="location"
          value={filters.location}
          onChange={handleInputChange}
          placeholder="Adres veya Enlem,Boylam..."
          className="w-full px-3 py-2 border rounded-md"
        />
        <select
          name="serviceId"
          value={filters.serviceId}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="">Tüm Hizmetler</option>
          {allServices.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleGeoLocation}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Konumumu Kullan
        </button>

        {/* New Filters */}
        <div>
          <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700">Min Fiyat</label>
          <input
            type="number"
            id="minPrice"
            name="minPrice"
            value={filters.minPrice || ''}
            onChange={handleNumberInputChange}
            placeholder="Min Fiyat"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">Max Fiyat</label>
          <input
            type="number"
            id="maxPrice"
            name="maxPrice"
            value={filters.maxPrice || ''}
            onChange={handleNumberInputChange}
            placeholder="Max Fiyat"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <label htmlFor="minRating" className="block text-sm font-medium text-gray-700">Min Puan</label>
          <input
            type="number"
            id="minRating"
            name="minRating"
            value={filters.minRating || ''}
            onChange={handleNumberInputChange}
            min="1"
            max="5"
            placeholder="Min Puan (1-5)"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">Tarih</label>
          <input
            type="date"
            id="date"
            name="date"
            value={filters.date || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <label htmlFor="time" className="block text-sm font-medium text-gray-700">Saat</label>
          <input
            type="time"
            id="time"
            name="time"
            value={filters.time || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      </div>
    </div>
  );
}
