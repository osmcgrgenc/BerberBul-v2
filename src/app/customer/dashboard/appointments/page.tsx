'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';
import AppointmentList from './components/AppointmentList';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import ErrorMessage from '@/app/components/ErrorMessage';
import ReviewForm from './components/ReviewForm'; // New import

// Assuming this type is defined in a central types file
import { Appointment } from '@/app/types';

export default function CustomerAppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedBarberIdForReview, setSelectedBarberIdForReview] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }

      const response = await fetch('/api/customer/appointments');
      if (!response.ok) throw new Error('Failed to fetch appointments');
      const data = await response.json();
      setAppointments(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleCancelAppointment = async (id: string) => {
    if (!confirm('Bu randevuyu iptal etmek istediğinizden emin misiniz?')) return;

    try {
      const response = await fetch(`/api/customer/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to cancel appointment.');
      }

      alert('Randevu başarıyla iptal edildi!');
      fetchAppointments(); // Refresh the list
    } catch (err: any) {
      setError(err.message);
      alert(`Hata: ${err.message}`);
    }
  };

  const handleOpenReviewForm = (barberId: string) => {
    setSelectedBarberIdForReview(barberId);
    setShowReviewForm(true);
  };

  const handleReviewSubmitted = () => {
    setShowReviewForm(false);
    setSelectedBarberIdForReview(null);
    fetchAppointments(); // Refresh appointments to reflect potential changes or just for good measure
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900">Randevularım</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : (
          <AppointmentList
            appointments={appointments}
            onCancelAppointment={handleCancelAppointment}
            onOpenReviewForm={handleOpenReviewForm} // Pass new prop
          />
        )}

        {showReviewForm && selectedBarberIdForReview && (
          <ReviewForm
            barberId={selectedBarberIdForReview}
            onClose={() => setShowReviewForm(false)}
            onReviewSubmitted={handleReviewSubmitted}
          />
        )}
      </main>
    </div>
  );
}
