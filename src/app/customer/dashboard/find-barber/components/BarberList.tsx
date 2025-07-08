import Link from 'next/link';
import { Barber } from '@/app/types';

interface BarberListProps {
  barbers: Barber[];
}

export default function BarberList({ barbers }: BarberListProps) {
  if (barbers.length === 0) {
    return (
      <div className="text-center py-12 px-4 bg-white rounded-lg shadow-md">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Berber Bulunamadı</h3>
        <p className="mt-1 text-sm text-gray-500">
          Aradığınız kriterlere uygun berber bulunamadı. Filtreleri değiştirmeyi deneyin.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {barbers.map((barber) => (
        <li key={barber.id} className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-bold">{barber.business_name}</h3>
          <p className="text-sm text-gray-600">{barber.address}</p>
          <p className="text-sm">Telefon: {barber.phone_number}</p>
          <div className="mt-2">
            <Link href={`/customer/book-appointment/${barber.id}`} className="text-indigo-600 hover:underline">
              Randevu Al
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
