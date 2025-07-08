'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';

import { BusinessCategory } from '@/app/types';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') || 'customer';
  const [role, setRole] = useState(initialRole);
  const [categories, setCategories] = useState<BusinessCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('business_categories')
        .select('id, name');

      if (error) {
        console.error('Error fetching business categories:', error);
        setError('Kategoriler yüklenirken bir hata oluştu.');
      } else {
        setCategories(data);
        if (data.length > 0) {
          setSelectedCategoryId(data[0].id); // Select the first category by default
        }
      }
    };

    if (role === 'barber') {
      fetchCategories();
    }
  }, [role]);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!email) {
      setError('Email adresi boş bırakılamaz.');
      setIsLoading(false);
      return;
    }
    if (!validateEmail(email)) {
      setError('Geçerli bir email adresi giriniz.');
      setIsLoading(false);
      return;
    }
    if (!password) {
      setError('Şifre boş bırakılamaz.');
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.');
      setIsLoading(false);
      return;
    }

    if (role === 'barber' && !selectedCategoryId) {
      setError('Lütfen bir işletme kategorisi seçiniz.');
      setIsLoading(false);
      return;
    }

    try {
      const body: any = { email, password, role };
      if (role === 'barber') {
        body.category_id = selectedCategoryId;
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Kayıt başarısız oldu. Lütfen bilgilerinizi kontrol edin.');
        return;
      }

      router.push('/auth/login');
    } catch (err) {
      console.error('Register error:', err);
      setError('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg z-10">
        <div className="text-center">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Yeni hesap oluşturun
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Hizmetlerinizi yönetmek için bir hesap oluşturun
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email adresi
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full appearance-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                placeholder="Email adresi"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Şifre
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="relative block w-full appearance-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                placeholder="Şifre"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hesap Türü Seçin
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`cursor-pointer rounded-lg border p-4 text-center shadow-sm transition-all duration-200 ${role === 'customer' ? 'border-indigo-500 ring-2 ring-indigo-500 bg-indigo-50' : 'border-gray-300 bg-white hover:border-gray-400'}`}
                  onClick={() => setRole('customer')}
                >
                  <h3 className="text-lg font-medium text-gray-900">Müşteri</h3>
                  <p className="text-sm text-gray-500">Randevu alın, berberleri keşfedin.</p>
                </div>
                <div
                  className={`cursor-pointer rounded-lg border p-4 text-center shadow-sm transition-all duration-200 ${role === 'barber' ? 'border-indigo-500 ring-2 ring-indigo-500 bg-indigo-50' : 'border-gray-300 bg-white hover:border-gray-400'}`}
                  onClick={() => setRole('barber')}
                >
                  <h3 className="text-lg font-medium text-gray-900">Berber</h3>
                  <p className="text-sm text-gray-500">Hizmetlerinizi yönetin, randevu alın.</p>
                </div>
              </div>
            </div>

            {role === 'barber' && (
              <div className="mt-4">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  İşletme Kategorisi
                </label>
                <select
                  id="category"
                  name="category"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md transition duration-150 ease-in-out"
                  value={selectedCategoryId || ''}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  disabled={isLoading || categories.length === 0}
                >
                  {categories.length === 0 ? (
                    <option value="">Kategoriler yükleniyor...</option>
                  ) : (
                    categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
            )}
          </div>

          {error && (
            <p className="mt-2 text-center text-sm text-red-600">{error}</p>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
              disabled={isLoading}
            >
              {isLoading ? 'Kayıt Olunuyor...' : 'Kayıt Ol'}
            </button>
          </div>
        </form>
        <div className="text-sm text-center">
          <a
            href="/auth/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Zaten bir hesabınız var mı? Giriş yapın
          </a>
        </div>
      </div>
    </div>
  );
}
