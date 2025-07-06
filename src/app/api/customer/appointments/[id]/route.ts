import { NextResponse } from 'next/server';
import { supabase, getUserWithRole } from '@/app/lib/supabase';

// PUT: Update an appointment (e.g., cancel)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params; // Appointment ID
  const auth = await getUserWithRole('customer');
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { user } = auth;

  const { status } = await request.json();

  if (!status) {
    return NextResponse.json({ error: 'Durum bilgisi zorunludur.' }, { status: 400 });
  }

  // Only allow status to be changed to 'cancelled' by customer
  if (status !== 'cancelled') {
    return NextResponse.json({ error: 'Müşteriler sadece randevuyu iptal edebilir.' }, { status: 403 });
  }

  try {
    const { data, error } = await supabase
      .from('appointments')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('customer_id', user.id) // Ensure customer can only update their own appointments
      .select()
      .single();

    if (error) {
      console.error('Error updating appointment status:', error);
      return NextResponse.json({ error: 'Randevu durumu güncellenirken bir hata oluştu.' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (e) {
    console.error('Update appointment API error:', e);
    return NextResponse.json({ error: 'Sunucu hatası oluştu.' }, { status: 500 });
  }
}
