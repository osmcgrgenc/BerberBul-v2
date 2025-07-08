'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import Link from 'next/link';

import { BusinessCategory } from '@/app/types';

export default function CategorySelection() {
  const [categories, setCategories] = useState<BusinessCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('business_categories')
        .select('id, name, slug');

      if (error) {
        console.error('Error fetching business categories:', error);
        setError('Kategoriler yüklenirken bir hata oluştu.');
      } else {
        setCategories(data);
      }
      setLoading(false);
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Kategoriler yükleniyor...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">Hata: {error}</div>;
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Ne Aramıştınız?</h2>
        <p className="mt-4 text-lg text-gray-600">Size en uygun hizmet kategorisini seçin.</p>
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link key={category.id} href={`/customer/dashboard/find-barber?categoryId=${category.id}`} className="block bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6">
              <h3 className="text-xl font-semibold text-gray-900">{category.name}</h3>
              {/* You can add an icon or image here based on category.slug */}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
