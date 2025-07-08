import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export async function GET(request: Request, { params }: { params: { barberId: string } }) {
  const { barberId } = params;

  if (!barberId) {
    return NextResponse.json({ error: 'Berber ID zorunludur.' }, { status: 400 });
  }

  try {
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select(`
        id,
        rating,
        comment,
        created_at,
        customer:profiles(id, business_name) // Assuming customer profiles have a name
      `)
      .eq('barber_id', barberId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching barber reviews:', error);
      return NextResponse.json({ error: 'Yorumlar alınırken bir hata oluştu.' }, { status: 500 });
    }

    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : '0.0';

    return NextResponse.json({ reviews, averageRating });
  } catch (e) {
    console.error('Barber reviews API error:', e);
    return NextResponse.json({ error: 'Sunucu hatası oluştu.' }, { status: 500 });
  }
}
