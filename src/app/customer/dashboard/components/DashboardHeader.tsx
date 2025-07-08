
'use client';

import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';

interface DashboardHeaderProps {
  userEmail: string | null;
}

export default function DashboardHeader({ userEmail }: DashboardHeaderProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Müşteri Paneli</h1>
          <p className="text-sm text-gray-500">Hoş geldiniz, {userEmail}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Çıkış Yap
        </button>
      </div>
    </header>
  );
}
