'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';

const daysOfWeek = [
  { value: 1, label: 'Pazartesi' },
  { value: 2, label: 'Salı' },
  { value: 3, label: 'Çarşamba' },
  { value: 4, label: 'Perşembe' },
  { value: 5, label: 'Cuma' },
  { value: 6, label: 'Cumartesi' },
  { value: 0, label: 'Pazar' },
];

export default function BarberWorkingHoursPage() {
  const router = useRouter();
  const [workingHours, setWorkingHours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states for new/editing working hour
  const [currentWorkingHour, setCurrentWorkingHour] = useState<any>(null);
  const [dayOfWeek, setDayOfWeek] = useState<number | string>('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  useEffect(() => {
    fetchWorkingHours();
  }, []);

  const fetchWorkingHours = async () => {
    setLoading(true);
    setError(null);
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      router.push('/auth/login');
      return;
    }

    const response = await fetch('/api/barber/working-hours');
    const data = await response.json();

    if (!response.ok) {
      setError(data.error || 'Çalışma saatleri alınamadı.');
      setLoading(false);
      return;
    }

    setWorkingHours(data);
    setLoading(false);
  };

  const handleEdit = (hour: any) => {
    setCurrentWorkingHour(hour);
    setDayOfWeek(hour.day_of_week);
    setStartTime(hour.start_time);
    setEndTime(hour.end_time);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu çalışma saatini silmek istediğinizden emin misiniz?')) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/barber/working-hours/${id}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Çalışma saati silinirken bir hata oluştu.');
        return;
      }

      alert('Çalışma saati başarıyla silindi!');
      fetchWorkingHours(); // Refresh the list
    } catch (err) {
      console.error('Delete working hour error:', err);
      setError('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (dayOfWeek === '' || !startTime || !endTime) {
      setError('Lütfen tüm zorunlu alanları doldurun.');
      setIsSubmitting(false);
      return;
    }

    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      setError('Geçersiz saat formatı. HH:MM formatını kullanın.');
      setIsSubmitting(false);
      return;
    }

    const workingHourData = {
      day_of_week: parseInt(dayOfWeek as string),
      start_time: startTime,
      end_time: endTime,
    };

    try {
      const method = currentWorkingHour ? 'PUT' : 'POST';
      const url = currentWorkingHour ? `/api/barber/working-hours/${currentWorkingHour.id}` : '/api/barber/working-hours';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workingHourData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Çalışma saati kaydedilirken bir hata oluştu.');
        return;
      }

      alert(`Çalışma saati başarıyla ${currentWorkingHour ? 'güncellendi' : 'eklendi'}!`);
      setCurrentWorkingHour(null);
      setDayOfWeek('');
      setStartTime('');
      setEndTime('');
      fetchWorkingHours(); // Refresh the list
    } catch (err) {
      console.error('Save working hour error:', err);
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
          <h1 className="text-3xl font-bold text-gray-900">Çalışma Saatleri Yönetimi</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-8 sm:px-0">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {currentWorkingHour ? 'Çalışma Saatini Düzenle' : 'Yeni Çalışma Saati Ekle'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="dayOfWeek" className="block text-sm font-medium text-gray-700">
                    Gün
                  </label>
                  <select
                    id="dayOfWeek"
                    name="dayOfWeek"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={dayOfWeek}
                    onChange={(e) => setDayOfWeek(parseInt(e.target.value))}
                    disabled={isSubmitting}
                    required
                  >
                    <option value="">Gün Seçin</option>
                    {daysOfWeek.map((day) => (
                      <option key={day.value} value={day.value}>
                        {day.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                    Başlangıç Saati
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    id="startTime"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                    Bitiş Saati
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    id="endTime"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  {currentWorkingHour && (
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentWorkingHour(null);
                        setDayOfWeek('');
                        setStartTime('');
                        setEndTime('');
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
                    {isSubmitting ? 'Kaydediliyor...' : currentWorkingHour ? 'Saati Güncelle' : 'Saat Ekle'}
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Mevcut Çalışma Saatleri</h2>
              {workingHours.length === 0 ? (
                <p className="text-gray-600">Henüz bir çalışma saati eklemediniz.</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {workingHours.map((hour) => (
                    <li key={hour.id} className="py-4 flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{daysOfWeek.find(d => d.value === hour.day_of_week)?.label}</h3>
                        <p className="text-sm text-gray-700">{hour.start_time} - {hour.end_time}</p>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEdit(hour)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => handleDelete(hour.id)}
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
