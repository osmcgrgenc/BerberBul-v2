'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';

export default function BarberServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states for new/editing service
  const [currentService, setCurrentService] = useState<any>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      router.push('/auth/login');
      return;
    }

    const response = await fetch('/api/barber/services');
    const data = await response.json();

    if (!response.ok) {
      setError(data.error || 'Hizmetler alınamadı.');
      setLoading(false);
      return;
    }

    setServices(data);
    setLoading(false);
  };

  const handleEdit = (service: any) => {
    setCurrentService(service);
    setName(service.name);
    setDescription(service.description || '');
    setPrice(service.price);
    setDurationMinutes(service.duration_minutes);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu hizmeti silmek istediğinizden emin misiniz?')) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/barber/services/${id}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Hizmet silinirken bir hata oluştu.');
        return;
      }

      alert('Hizmet başarıyla silindi!');
      fetchServices(); // Refresh the list
    } catch (err) {
      console.error('Delete service error:', err);
      setError('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!name || !price || !durationMinutes) {
      setError('Lütfen tüm zorunlu alanları doldurun.');
      setIsSubmitting(false);
      return;
    }

    const serviceData = {
      name,
      description,
      price: parseFloat(price),
      duration_minutes: parseInt(durationMinutes),
    };

    try {
      const method = currentService ? 'PUT' : 'POST';
      const url = currentService ? `/api/barber/services/${currentService.id}` : '/api/barber/services';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Hizmet kaydedilirken bir hata oluştu.');
        return;
      }

      alert(`Hizmet başarıyla ${currentService ? 'güncellendi' : 'eklendi'}!`);
      setCurrentService(null);
      setName('');
      setDescription('');
      setPrice('');
      setDurationMinutes('');
      fetchServices(); // Refresh the list
    } catch (err) {
      console.error('Save service error:', err);
      setError('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <p>Yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <p className="text-red-600">Hata: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Hizmet Yönetimi</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-8 sm:px-0">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {currentService ? 'Hizmeti Düzenle' : 'Yeni Hizmet Ekle'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Hizmet Adı
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Açıklama
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isSubmitting}
                  ></textarea>
                </div>
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Fiyat (TL)
                  </label>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    step="0.01"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="durationMinutes" className="block text-sm font-medium text-gray-700">
                    Süre (Dakika)
                  </label>
                  <input
                    type="number"
                    name="durationMinutes"
                    id="durationMinutes"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  {currentService && (
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentService(null);
                        setName('');
                        setDescription('');
                        setPrice('');
                        setDurationMinutes('');
                        setError(null);
                      }}
                      className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      disabled={isSubmitting}
                    >
                      İptal
                    </button>
                  )}
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Kaydediliyor...' : currentService ? 'Hizmeti Güncelle' : 'Hizmet Ekle'}
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Mevcut Hizmetler</h2>
              {services.length === 0 ? (
                <p className="text-gray-600">Henüz bir hizmet eklemediniz.</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {services.map((service) => (
                    <li key={service.id} className="py-4 flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{service.name}</h3>
                        <p className="text-sm text-gray-500">{service.description}</p>
                        <p className="text-sm text-gray-700">Fiyat: {service.price} TL</p>
                        <p className="text-sm text-gray-700">Süre: {service.duration_minutes} dakika</p>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEdit(service)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => handleDelete(service.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Sil
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
