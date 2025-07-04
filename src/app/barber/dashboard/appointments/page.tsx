'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';
import moment from 'moment-timezone';

export default function BarberAppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      router.push('/auth/login');
      return;
    }

    const response = await fetch('/api/barber/appointments');
    const data = await response.json();

    if (!response.ok) {
      setError(data.error || 'Randevular alınamadı.');
      setLoading(false);
      return;
    }

    setAppointments(data);
    setLoading(false);
  };

  const handleUpdateAppointmentStatus = async (id: string, status: string) => {
    if (!confirm(`Randevu durumunu '${status}' olarak güncellemek istediğinizden emin misiniz?`)) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/barber/appointments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Randevu durumu güncellenirken bir hata oluştu.');
        return;
      }

      alert('Randevu durumu başarıyla güncellendi!');
      fetchAppointments(); // Refresh the list
    } catch (err) {
      console.error('Update appointment status error:', err);
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
                          {appt.customer?.business_name || appt.customer?.email || 'Müşteri'} ile Randevu
                        </h3>
                        <p className="text-sm text-gray-500">Hizmet: {appt.service?.name}</p>
                        <p className="text-sm text-gray-700">
                          Tarih: {moment(appt.appointment_date).format('DD.MM.YYYY')}
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
                      <div className="flex space-x-2">
                        {appt.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateAppointmentStatus(appt.id, 'confirmed')}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              disabled={isSubmitting}
                            >
                              Onayla
                            </button>
                            <button
                              onClick={() => handleUpdateAppointmentStatus(appt.id, 'cancelled')}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              disabled={isSubmitting}
                            >
                              Reddet
                            </button>
                          </>
                        )}
                        {appt.status === 'confirmed' && (
                          <button
                            onClick={() => handleUpdateAppointmentStatus(appt.id, 'completed')}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            disabled={isSubmitting}
                          >
                            Tamamlandı Olarak İşaretle
                          </button>
                        )}
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
