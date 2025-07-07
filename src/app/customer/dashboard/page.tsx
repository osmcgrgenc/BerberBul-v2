'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';

export default function CustomerDashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        router.push('/auth/login');
        return;
      }

      // Verify user role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError || !profile || profile.role !== 'customer') {
        router.push('/'); // Redirect to home or an unauthorized page
        return;
      }

      setUserEmail(user.email ?? null);
      setLoading(false);
    };

    checkUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <p>Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Müşteri Paneli</h1>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push('/auth/login');
            }}
            className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Çıkış Yap
          </button>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-8 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
              <p className="text-gray-500 text-lg">
                Hoş geldiniz, {userEmail}! Burası müşteri paneliniz.
              </p>
            </div>
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Temel Navigasyon</h2>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-indigo-600 hover:text-indigo-800">Berber Bul</a>
                </li>
                <li>
                  <a href="#" className="text-indigo-600 hover:text-indigo-800">Randevularım</a>
                </li>
                <li>
                  <a href="#" className="text-indigo-600 hover:text-indigo-800">Profilim</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
