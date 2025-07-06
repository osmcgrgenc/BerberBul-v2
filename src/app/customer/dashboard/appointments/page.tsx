'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface Appointment {
  id: string;
  barber?: {
    id: string;
    business_name?: string;
  };
  service?: {
    id: string;
    name: string;
  };
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: string;
  notes?: string;
}

export default function CustomerAppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      router.push('/auth/login');
      return;
    }

    const response = await fetch('/api/customer/appointments');
    const data = await response.json();

    if (!response.ok) {
      setError(data.error || 'Randevular alınamadı.');
      setLoading(false);
      return;
    }

    setAppointments(data);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleCancelAppointment = async (id: string) => {
    if (!confirm('Bu randevuyu iptal etmek istediğinizden emin misiniz?')) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/customer/appointments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Randevu iptal edilirken bir hata oluştu.');
        return;
      }

      alert('Randevu başarıyla iptal edildi!');
      fetchAppointments(); // Refresh the list
    } catch (err) {
      console.error('Cancel appointment error:', err);
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
          <h1 className="text-3xl font-bold text-gray-900">Randevularım</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-8 sm:px-0">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
              {appointments.length === 0 ? (
                <p className="text-gray-600">Henüz bir randevunuz bulunmamaktadır.</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {appointments.map((appt) => (
                    <li key={appt.id} className="py-4 flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {appt.barber?.business_name || 'Berber'} ile Randevu
                        </h3>
                        <p className="text-sm text-gray-500">Hizmet: {appt.service?.name}</p>
                        <p className="text-sm text-gray-700">
                          Tarih: {format(new Date(appt.appointment_date), 'dd.MM.yyyy', { locale: tr })}
                        </p>
                        <p className="text-sm text-gray-700">
                          Saat: {appt.start_time} - {appt.end_time}
                        </p>
                        <p className="text-sm text-gray-700">
                          Durum: <span className={`font-semibold ${appt.status === 'confirmed' ? 'text-green-600' : appt.status === 'cancelled' ? 'text-red-600' : 'text-yellow-600'}`}>
                            {appt.status === 'pending' ? 'Beklemede' : appt.status === 'confirmed' ? 'Onaylandı' : appt.status === 'cancelled' ? 'İptal Edildi' : 'Tamamlandı'}
                          </span>
                        </p>
                        {appt.notes && <p className="text-sm text-gray-500">Notlar: {appt.notes}</p>}
                      </div>
                      {appt.status === 'pending' && (
                        <button
                          onClick={() => handleCancelAppointment(appt.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          disabled={isSubmitting}
                        >
                          İptal Et
                        </button>
                      )}
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
