'use client';

interface WelcomeMessageProps {
  userEmail: string | null;
}

export default function WelcomeMessage({ userEmail }: WelcomeMessageProps) {
  return (
    <div className="bg-indigo-600 text-white rounded-lg p-8 mb-8 text-center shadow-lg">
      <h2 className="text-3xl font-extrabold">Hoş Geldiniz!</h2>
      <p className="mt-2 text-lg">Müşteri panelinize hoş geldiniz, {userEmail}.</p>
      <p className="mt-1 text-indigo-200">Buradan randevularınızı yönetebilir ve yeni berberler keşfedebilirsiniz.</p>
    </div>
  );
}
