'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';
import moment from 'moment-timezone';

interface Service {
  id: string;
  name: string;
  price: number;
  duration_minutes: number;
}

export default function BookAppointmentPage({ params }: { params: { barberId: string } }) {
  const { barberId } = params;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedDate, setSelectedDate] = useState<string>(moment().format('YYYY-MM-DD'));
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<string>('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const fetchBarberData = async () => {
      setLoading(true);
      setError(null);

      // Fetch barber's services
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('id, name, price, duration_minutes')
        .eq('barber_id', barberId);

      if (servicesError) {
        setError('Berber hizmetleri alınamadı.');
        setLoading(false);
        return;
      }
      setServices(servicesData || []);

      setLoading(false);
    };

    fetchBarberData();
  }, [barberId]);

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!selectedDate || !barberId) return;

      setLoading(true);
      setError(null);
      setAvailableSlots([]);
      setSelectedTime('');

      const response = await fetch(`/api/customer/barber/${barberId}/availability?date=${selectedDate}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Müsaitlik bilgileri alınamadı.');
        setLoading(false);
        return;
      }

      setAvailableSlots(data.availability);
      setLoading(false);
    };

    fetchAvailability();
  }, [selectedDate, barberId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!selectedDate || !selectedTime || !selectedService) {
      setError('Lütfen tarih, saat ve hizmet seçin.');
      setIsSubmitting(false);
      return;
    }

    const service = services.find(s => s.id === selectedService);
    if (!service) {
      setError('Geçersiz hizmet seçimi.');
      setIsSubmitting(false);
      return;
    }

    const appointmentData = {
      barber_id: barberId,
      service_id: selectedService,
      appointment_date: selectedDate,
      start_time: selectedTime,
      end_time: moment.utc(selectedTime, 'HH:mm').add(service.duration_minutes, 'minutes').format('HH:mm'),
      notes,
    };

    try {
      const response = await fetch('/api/customer/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Randevu oluşturulurken bir hata oluştu.');
        return;
      }

      alert('Randevunuz başarıyla oluşturuldu!');
      router.push('/customer/dashboard/appointments'); // Redirect to customer appointments
    } catch (err) {
      console.error('Book appointment error:', err);
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
          <h1 className="text-3xl font-bold text-gray-900">Randevu Al</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-8 sm:px-0">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Berber ID: {barberId}</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700">
                    Randevu Tarihi
                  </label>
                  <input
                    type="date"
                    name="appointmentDate"
                    id="appointmentDate"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-gray-700">
                    Hizmet Seçin
                  </label>
                  <select
                    id="service"
                    name="service"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    disabled={isSubmitting}
                    required
                  >
                    <option value="">Hizmet Seçin</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name} ({service.duration_minutes} dk) - {service.price} TL
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="appointmentTime" className="block text-sm font-medium text-gray-700">
                    Müsait Saatler
                  </label>
                  <select
                    id="appointmentTime"
                    name="appointmentTime"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    disabled={isSubmitting || availableSlots.length === 0}
                    required
                  >
                    <option value="">Saat Seçin</option>
                    {availableSlots.length > 0 ? (
                      availableSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>Bu tarihte müsait saat yok.</option>
                    )}
                  </select>
                </div>
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                    Notlar (İsteğe Bağlı)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    disabled={isSubmitting}
                  ></textarea>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Randevu Oluşturuluyor...' : 'Randevu Oluştur'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
