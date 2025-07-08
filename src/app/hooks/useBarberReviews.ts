'use client';

import { useState, useEffect, useCallback } from 'react';
import { Review } from '@/app/types';

export function useBarberReviews(barberId: string) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<string>('0.0');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBarberReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const reviewsResponse = await fetch(`/api/barber/${barberId}/reviews`);
      if (!reviewsResponse.ok) {
        throw new Error('Yorumlar yüklenirken bir hata oluştu.');
      }
      const reviewsData = await reviewsResponse.json();
      setReviews(reviewsData.reviews);
      setAverageRating(reviewsData.averageRating);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [barberId]);

  useEffect(() => {
    if (barberId) {
      fetchBarberReviews();
    }
  }, [barberId, fetchBarberReviews]);

  return { reviews, averageRating, loading, error, refetchBarberReviews: fetchBarberReviews };
}
