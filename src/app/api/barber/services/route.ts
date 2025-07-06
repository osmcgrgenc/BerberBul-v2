import { NextResponse } from 'next/server';
import { supabase, getUserWithRole } from '@/app/lib/supabase';

// GET: List all services for the authenticated barber
export async function GET() {
  const auth = await getUserWithRole('barber');
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { user } = auth;

  const { data: services, error } = await supabase
    .from('services')
    .select('*')
    .eq('barber_id', user.id);

  if (error) {
    console.error('Error fetching barber services:', error);
    return NextResponse.json({ error: 'Hizmetler alınırken bir hata oluştu.' }, { status: 500 });
  }

  return NextResponse.json(services);
}

// POST: Add a new service for the authenticated barber
export async function POST(request: Request) {
  const auth = await getUserWithRole('barber');
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { user } = auth;

  // Basit XSS/girdi temizleyici (tüm HTML taglerini kaldırır)
  function sanitizeInput(input: string): string {
    return input.replace(/<[^>]*>?/gm, '');
  }

  const { name, description, price, duration_minutes } = await request.json();

  if (!name || !price || !duration_minutes) {
    return NextResponse.json({ error: 'İsim, fiyat ve süre zorunludur.' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('services')
    .insert({
      barber_id: user.id,
      name: sanitizeInput(name),
      description: description ? sanitizeInput(description) : null,
      price,
      duration_minutes,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding barber service:', error);
    return NextResponse.json({ error: 'Hizmet eklenirken bir hata oluştu.' }, { status: 500 });
  }

  return NextResponse.json(data);
}
