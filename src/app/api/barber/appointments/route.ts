import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

// GET: List all appointments for the authenticated barber
export async function GET(request: Request) {
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
    return NextResponse.json({ error: 'Yetkisiz erişim. Sadece berberler randevuları görüntüleyebilir.' }, { status: 403 });
  }

  const { data: appointments, error } = await supabase
    .from('appointments')
    .select(`
      *,
      customer:customer_id(id, business_name, phone_number), -- Assuming business_name and phone_number are relevant for customer profile
      service:service_id(id, name, price, duration_minutes)
    `)
    .eq('barber_id', user.id)
    .order('appointment_date', { ascending: true })
    .order('start_time', { ascending: true });

  if (error) {
    console.error('Error fetching barber appointments:', error);
    return NextResponse.json({ error: 'Randevular alınırken bir hata oluştu.' }, { status: 500 });
  }

  return NextResponse.json(appointments);
}
