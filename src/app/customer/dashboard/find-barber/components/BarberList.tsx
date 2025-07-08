'use client';

import Link from 'next/link';
import { Barber } from '@/app/types';

interface BarberListProps {
  barbers: Barber[];
}

export default function BarberList({ barbers }: BarberListProps) {
  if (barbers.length === 0) {
    return <p className="text-gray-600">Aradığınız kriterlere uygun berber bulunamadı.</p>;
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
