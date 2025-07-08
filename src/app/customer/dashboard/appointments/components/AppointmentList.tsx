import { Appointment } from '@/app/types';
import AppointmentCard from './AppointmentCard';

interface AppointmentListProps {
  appointments: Appointment[];
  onCancelAppointment: (id: string) => Promise<void>;
  onOpenReviewForm: (barberId: string) => void;
}

export default function AppointmentList({ appointments, onCancelAppointment, onOpenReviewForm }: AppointmentListProps) {
  const upcomingAppointments = appointments.filter(a => a.status === 'pending' || a.status === 'confirmed');
  const pastAppointments = appointments.filter(a => a.status === 'completed' || a.status === 'cancelled');

  if (appointments.length === 0) {
    return (
      <div className="text-center py-12 px-4 bg-white rounded-lg shadow-md">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Randevu Yok</h3>
        <p className="mt-1 text-sm text-gray-500">
          Henüz bir randevunuz bulunmamaktadır. Yeni bir randevu oluşturarak başlayın.
        </p>
        <div className="mt-6">
          {/* Optionally add a link to find barbers */}
          {/* <Link href="/customer/dashboard/find-barber" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Berber Bul
          </Link> */}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Gelecek Randevular</h2>
        {upcomingAppointments.length > 0 ? (
          <div className="space-y-4">
            {upcomingAppointments.map((appt) => (
              <AppointmentCard key={appt.id} appointment={appt} onCancel={onCancelAppointment} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 px-4 bg-white rounded-lg shadow-md">
            <p className="text-gray-500">Yaklaşan bir randevunuz yok.</p>
          </div>
        )}
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Geçmiş Randevular</h2>
        {pastAppointments.length > 0 ? (
          <div className="space-y-4">
            {pastAppointments.map((appt) => (
              <AppointmentCard key={appt.id} appointment={appt} onCancel={onCancelAppointment} onOpenReviewForm={onOpenReviewForm} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 px-4 bg-white rounded-lg shadow-md">
            <p className="text-gray-500">Geçmiş bir randevunuz yok.</p>
          </div>
        )}
      </div>
    </div>
  );
}
