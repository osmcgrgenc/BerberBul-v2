'use client';

import { useAuthStore } from '@/app/store/authStore';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import ErrorMessage from '@/app/components/ErrorMessage';
import DashboardHeader from './components/DashboardHeader';
import DashboardNav from './components/DashboardNav';
import WelcomeMessage from './components/WelcomeMessage';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CustomerDashboardPage() {
  const { user, role } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // This check runs on the client after the store is hydrated
    if (user === undefined) { // Still loading from hydration
      return;
    }

    if (!user) {
      router.push('/auth/login');
      return;
    }

    if (role !== 'customer') {
      setError('Bu sayfaya erişim yetkiniz yok.');
      // Optional: redirect to a more appropriate page
      // router.push('/'); 
    }

    setLoading(false);
  }, [user, role, router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader userEmail={user?.email ?? null} />
      <main className="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
        <WelcomeMessage userEmail={user?.email ?? null} />
        <DashboardNav />
      </main>
    </div>
  );
}
