'use client';

import { Appointment } from '@/app/types';
import AppointmentCard from './AppointmentCard';

interface AppointmentListProps {
  appointments: Appointment[];
  onCancelAppointment: (id: string) => Promise<void>;
  onOpenReviewForm: (barberId: string) => void; // New prop
}

export default function AppointmentList({ appointments, onCancelAppointment, onOpenReviewForm }: AppointmentListProps) {
  if (appointments.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">Henüz bir randevunuz bulunmamaktadır.</p>
      </div>
    );
  }

  const upcomingAppointments = appointments.filter(a => a.status === 'pending' || a.status === 'confirmed');
  const pastAppointments = appointments.filter(a => a.status === 'completed' || a.status === 'cancelled');

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
          <p className="text-gray-500">Yaklaşan bir randevunuz yok.</p>
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
          <p className="text-gray-500">Geçmiş bir randevunuz yok.</p>
        )}
      </div>
    </div>
  );
}
