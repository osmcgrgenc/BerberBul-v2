import { NextResponse } from 'next/server';
import { supabase, getUserWithRole } from '@/app/lib/supabase';

export async function POST(request: Request) {
  const auth = await getUserWithRole('customer');
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { user } = auth;

  const { barber_id, rating, comment } = await request.json();

  if (!barber_id || !rating) {
    return NextResponse.json({ error: 'Berber ID ve puan zorunludur.' }, { status: 400 });
  }

  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Puan 1 ile 5 arasında olmalıdır.' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        barber_id,
        customer_id: user.id,
        rating,
        comment,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding review:', error);
      return NextResponse.json({ error: 'Yorum eklenirken bir hata oluştu.' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (e) {
    console.error('Review API error:', e);
    return NextResponse.json({ error: 'Sunucu hatası oluştu.' }, { status: 500 });
  }
}
