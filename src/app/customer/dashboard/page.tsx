'use client';

import { useAuthUser } from '@/app/hooks/useAuthUser';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import ErrorMessage from '@/app/components/ErrorMessage';
import DashboardHeader from './components/DashboardHeader';
import DashboardNav from './components/DashboardNav';
import WelcomeMessage from './components/WelcomeMessage';

export default function CustomerDashboardPage() {
  const { user, profile, loading, error } = useAuthUser('customer');

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
