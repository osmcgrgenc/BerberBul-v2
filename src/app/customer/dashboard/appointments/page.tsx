import { useCustomerAppointments } from '@/app/hooks/useCustomerAppointments';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppointmentList from './components/AppointmentList';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import ErrorMessage from '@/app/components/ErrorMessage';
import ReviewForm from './components/ReviewForm';

import { Appointment } from '@/app/types';

export default function CustomerAppointmentsPage() {
  const router = useRouter();
  const { appointments, loading, error, refetchAppointments } = useCustomerAppointments();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedBarberIdForReview, setSelectedBarberIdForReview] = useState<string | null>(null);

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
      refetchAppointments(); // Refresh the list
    } catch (err: any) {
      // setError(err.message); // Error is now handled by the hook if it's a fetch error
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
    refetchAppointments(); // Refresh appointments to reflect potential changes or just for good measure
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
            onOpenReviewForm={handleOpenReviewForm}
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
