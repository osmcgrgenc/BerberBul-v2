import { NextResponse } from 'next/server';
import { supabase, getUserWithRole } from '@/app/lib/supabase';

// GET: List all appointments for the authenticated barber
export async function GET() {
  const auth = await getUserWithRole('barber');
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { user } = auth;

  const { data: appointments, error } = await supabase
    .from('appointments')
    .select(`
      *,
      customer:customer_id(id, business_name, phone_number), // Assuming business_name and phone_number are relevant for customer profile
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
