use client';

import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Appointment } from '@/app/types';

interface AppointmentCardProps {
  appointment: Appointment;
  onCancel?: (id: string) => Promise<void>;
  onOpenReviewForm?: (barberId: string) => void; // New prop
}

const statusStyles = {
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Beklemede' },
  confirmed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Onaylandı' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'İptal Edildi' },
  completed: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Tamamlandı' },
};

export default function AppointmentCard({ appointment, onCancel, onOpenReviewForm }: AppointmentCardProps) {
  const { id, barber, service, appointment_date, start_time, end_time, status, notes } = appointment;
  const style = statusStyles[status];

  const generateGoogleCalendarUrl = () => {
    if (!barber || !service) return '#';

    const startDateTime = parseISO(`${appointment_date}T${start_time}`);
    const endDateTime = parseISO(`${appointment_date}T${end_time}`);

    const formatForGoogleCalendar = (date: Date) => {
      return format(date, 'yyyyMMdd'T'HHmmss');
    };

    const title = encodeURIComponent(`${barber.business_name} - ${service.name} Randevusu`);
    const dates = `${formatForGoogleCalendar(startDateTime)}/${formatForGoogleCalendar(endDateTime)}`;
    const details = encodeURIComponent(`Hizmet: ${service.name}\nNotlar: ${notes || 'Yok'}`);
    const location = encodeURIComponent(barber.address || 'Belirtilmemiş');

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  };

  return (
    <div className={`p-4 rounded-lg shadow-md ${style.bg}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className={`text-lg font-bold ${style.text}`}>{barber?.business_name || 'Berber'}</h3>
          <p className="text-sm text-gray-600">Hizmet: {service?.name}</p>
          <p className="text-sm text-gray-600">
            Tarih: {format(new Date(appointment_date), 'dd MMMM yyyy, EEEE', { locale: tr })}
          </p>
          <p className="text-sm text-gray-600">Saat: {start_time} - {end_time}</p>
          {notes && <p className="text-sm text-gray-500 mt-1">Not: {notes}</p>}
        </div>
        <div className="text-right">
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${style.bg} ${style.text}`}>
            {style.label}
          </span>
          {(status === 'pending' || status === 'confirmed') && onCancel && (
            <button
              onClick={() => onCancel(id)}
              className="mt-2 text-sm text-red-600 hover:text-red-800 font-semibold"
            >
              İptal Et
            </button>
          )}
          {status === 'completed' && onOpenReviewForm && barber?.id && (
            <button
              onClick={() => onOpenReviewForm(barber.id)}
              className="mt-2 ml-2 text-sm text-blue-600 hover:text-blue-800 font-semibold"
            >
              Yorum Yap
            </button>
          )}
          {(status === 'confirmed' || status === 'completed') && (
            <a
              href={generateGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 ml-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Takvime Ekle
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
