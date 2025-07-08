'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import ErrorMessage from '@/app/components/ErrorMessage';
import DashboardHeader from './components/DashboardHeader';
import DashboardNav from './components/DashboardNav';
import WelcomeMessage from './components/WelcomeMessage';

export default function CustomerDashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
          router.push('/auth/login');
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profileError || !profile || profile.role !== 'customer') {
          router.push('/');
          return;
        }

        setUserEmail(user.email ?? null);
      } catch (err: any) {
        setError(err.message || 'Kullanıcı bilgileri yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader userEmail={userEmail} />
      <main className="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
        <WelcomeMessage userEmail={userEmail} />
        <DashboardNav />
      </main>
    </div>
  );
}
