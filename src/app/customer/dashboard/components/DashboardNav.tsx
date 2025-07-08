'use client';

import Link from 'next/link';

const navItems = [
  {
    title: 'Berber Bul',
    description: 'Yakınınızdaki berberleri keşfedin ve randevu alın.',
    href: '/customer/dashboard/find-barber',
  },
  {
    title: 'Randevularım',
    description: 'Geçmiş ve gelecek randevularınızı görüntüleyin.',
    href: '/customer/dashboard/appointments',
  },
  {
    title: 'Profilim',
    description: 'Kişisel bilgilerinizi ve ayarlarınızı yönetin.',
    href: '#', // Gelecekte eklenecek
  },
];

export default function DashboardNav() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {navItems.map((item) => (
        <Link href={item.href} key={item.title}>
          <a className="block p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
            <p className="mt-2 text-gray-600">{item.description}</p>
          </a>
        </Link>
      ))}
    </div>
  );
}
