'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface GalleryImage {
  id: string;
  image_url: string;
  description?: string;
  created_at?: string;
}

export default function BarberGalleryPage() {
  const router = useRouter();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states for new image upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');

  const fetchImages = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      router.push('/auth/login');
      return;
    }

    const response = await fetch('/api/barber/gallery');
    const data = await response.json();

    if (!response.ok) {
      setError(data.error || 'Galeri görselleri alınamadı.');
      setLoading(false);
      return;
    }

    setImages(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // File type validation
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('Sadece JPEG, PNG ve WebP formatları desteklenir.');
        return;
      }
      
      // File size validation (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setError('Dosya boyutu 5MB\'dan küçük olmalıdır.');
        return;
      }
      
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu görseli silmek istediğinizden emin misiniz?')) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/barber/gallery/${id}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Görsel silinirken bir hata oluştu.');
        return;
      }

      toast.success('Görsel başarıyla silindi!');
      fetchImages(); // Refresh the list
    } catch (err) {
      console.error('Delete image error:', err);
      setError('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!selectedFile) {
      setError('Lütfen bir görsel seçin.');
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);
    if (description) {
      formData.append('description', description);
    }

    try {
      const response = await fetch('/api/barber/gallery', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Görsel yüklenirken bir hata oluştu.');
        return;
      }

      toast.success('Görsel başarıyla yüklendi!');
      setSelectedFile(null);
      setDescription('');
      fetchImages(); // Refresh the list
    } catch (err) {
      console.error('Upload image error:', err);
      setError('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <p>Yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <p className="text-red-600">Hata: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Galeri Yönetimi</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-8 sm:px-0">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Yeni Görsel Yükle</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                    Görsel Seç
                  </label>
                  <input
                    type="file"
                    name="image"
                    id="image"
                    accept="image/*"
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    onChange={handleFileChange}
                    disabled={isSubmitting}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Açıklama (İsteğe Bağlı)
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isSubmitting}
                  ></textarea>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Yükleniyor...' : 'Görsel Yükle'}
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Mevcut Görseller</h2>
              {images.length === 0 ? (
                <p className="text-gray-600">Henüz bir görsel eklemediniz.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((image) => (
                    <div key={image.id} className="relative group">
                      <Image src={image.image_url} alt={image.description || 'Galeri görseli'} width={400} height={300} className="rounded-lg object-cover w-full h-48" />
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                        <button
                          onClick={() => handleDelete(image.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
