'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

import { ReviewFormProps } from '@/app/types';

export default function ReviewForm({ barberId, onClose, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (rating === 0) {
      setError('Lütfen bir puan seçiniz.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ barber_id: barberId, rating, comment }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Yorum gönderilirken bir hata oluştu.');
      }

      toast.success('Yorumunuz başarıyla gönderildi!');
      onReviewSubmitted();
    } catch (err: any) {
      console.error('Submit review error:', err);
      setError(err.message || 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Yorum Yap</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Puanınız:</label>
            <div className="flex items-center mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`cursor-pointer text-3xl ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
                  onClick={() => setRating(star)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Yorumunuz (isteğe bağlı):</label>
            <textarea
              id="comment"
              rows={4}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              disabled={isLoading}
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              disabled={isLoading}
            >
              {isLoading ? 'Gönderiliyor...' : 'Yorumu Gönder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
