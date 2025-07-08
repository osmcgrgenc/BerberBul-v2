'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700 text-white p-4 text-center">
      <h1 className="text-9xl font-extrabold text-gray-800 opacity-20 animate-pulse">
        404
      </h1>
      <div className="relative -mt-20">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
          Bu Sayfa Var Olmayabilir.
        </h2>
        <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto">
          Aradığınız şey burada değil gibi görünüyor. Belki de hiç olmadı. Ya da belki de sadece sizin için değil.
        </p>
        <Link href="/" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">
          Ana Sayfaya Dön
        </Link>
      </div>
      <div className="absolute bottom-4 text-gray-500 text-sm">
        <p>Sistem hatası değil, varoluşsal bir kriz.</p>
      </div>
    </div>
  );
}
