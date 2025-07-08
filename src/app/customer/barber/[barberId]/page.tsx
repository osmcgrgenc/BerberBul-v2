'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';
import Link from 'next/link';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import ErrorMessage from '@/app/components/ErrorMessage';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

import { Barber, Review } from '@/app/types';

export default function BarberProfilePage({ params }: { params: { barberId: string } }) {
  const { barberId } = params;
  const [barber, setBarber] = useState<BarberProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<string>('0.0');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchBarberData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch barber profile
        const { data: barberData, error: barberError } = await supabase
          .from('profiles')
          .select(`
            id,
            business_name,
            address,
            phone_number,
            bio,
            services(id, name, price, duration_minutes),
            working_hours(day_of_week, start_time, end_time)
          `)
          .eq('id', barberId)
          .eq('role', 'barber')
          .single();

        if (barberError) {
          throw new Error(barberError.message || 'Berber profili bulunamadı.');
        }
        if (!barberData) {
          throw new Error('Berber profili bulunamadı.');
        }
        setBarber(barberData);

        // Fetch reviews for the barber
        const reviewsResponse = await fetch(`/api/barber/${barberId}/reviews`);
        if (!reviewsResponse.ok) {
          throw new Error('Yorumlar yüklenirken bir hata oluştu.');
        }
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData.reviews);
        setAverageRating(reviewsData.averageRating);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (barberId) {
      fetchBarberData();
    }
  }, [barberId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!barber) {
    return <ErrorMessage message="Berber profili yüklenemedi." />;
  }

  const daysOfWeek = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">{barber.business_name}</h1>
          <p className="mt-2 text-sm text-gray-600">{barber.address}</p>
          <div className="flex items-center mt-2">
            <span className="text-yellow-500 text-xl">★</span>
            <span className="ml-1 text-gray-800 font-semibold">{averageRating}</span>
            <span className="ml-2 text-gray-600">({reviews.length} yorum)</span>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Hakkında</h2>
          <p className="text-gray-700">{barber.bio || 'Bu berber hakkında henüz bir açıklama bulunmamaktadır.'}</p>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">İletişim</h2>
          <p className="text-gray-700">Telefon: {barber.phone_number}</p>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Hizmetler</h2>
          {barber.services && barber.services.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {barber.services.map((service) => (
                <li key={service.id} className="py-3 flex justify-between items-center">
                  <p className="text-gray-700">{service.name}</p>
                  <p className="text-gray-900 font-semibold">{service.price} TL ({service.duration_minutes} dk)</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">Henüz hizmet eklenmemiş.</p>
          )}
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Çalışma Saatleri</h2>
          {barber.working_hours && barber.working_hours.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {barber.working_hours.sort((a, b) => a.day_of_week - b.day_of_week).map((wh) => (
                <li key={wh.day_of_week} className="py-3 flex justify-between items-center">
                  <p className="text-gray-700">{daysOfWeek[wh.day_of_week]}</p>
                  <p className="text-gray-900 font-semibold">{wh.start_time} - {wh.end_time}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">Çalışma saatleri belirtilmemiş.</p>
          )}
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Müşteri Yorumları</h2>
          {reviews.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {reviews.map((review) => (
                <li key={review.id} className="py-4">
                  <div className="flex items-center mb-2">
                    <p className="font-semibold text-gray-900">{review.customer?.business_name || 'Anonim'}</p>
                    <span className="ml-2 text-yellow-500">{'★'.repeat(review.rating)}</span>
                    <span className="ml-auto text-sm text-gray-500">{format(new Date(review.created_at), 'dd.MM.yyyy', { locale: tr })}</span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">Bu berber için henüz yorum bulunmamaktadır.</p>
          )}
        </div>

        <div className="text-center mt-8">
          <Link href={`/customer/book-appointment/${barber.id}`}>
            <a className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Randevu Al
            </a>
          </Link>
        </div>
      </main>
    </div>
  );
}
