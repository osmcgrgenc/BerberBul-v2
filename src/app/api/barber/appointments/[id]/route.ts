import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

// PUT: Update an appointment status by barber
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params; // Appointment ID
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Yetkilendirme başarısız.' }, { status: 401 });
  }

  // Check if the user is a barber
  const { data: profile, error: profileCheckError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileCheckError || !profile || profile.role !== 'barber') {
    return NextResponse.json({ error: 'Yetkisiz erişim. Sadece berberler randevu durumunu güncelleyebilir.' }, { status: 403 });
  }

  const { status } = await request.json();

  if (!status) {
    return NextResponse.json({ error: 'Durum bilgisi zorunludur.' }, { status: 400 });
  }

  // Allowed statuses for barber to update
  const allowedStatuses = ['confirmed', 'cancelled', 'completed', 'pending'];
  if (!allowedStatuses.includes(status)) {
    return NextResponse.json({ error: 'Geçersiz randevu durumu.' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('appointments')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('barber_id', user.id) // Ensure barber can only update their own appointments
      .select()
      .single();

    if (error) {
      console.error('Error updating appointment status:', error);
      return NextResponse.json({ error: 'Randevu durumu güncellenirken bir hata oluştu.' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (e) {
    console.error('Update appointment status API error:', e);
    return NextResponse.json({ error: 'Sunucu hatası oluştu.' }, { status: 500 });
  }
}
