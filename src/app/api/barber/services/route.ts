import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

// GET: List all services for the authenticated barber
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
    return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 403 });
  }

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
    return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 403 });
  }

  const { name, description, price, duration_minutes } = await request.json();

  if (!name || !price || !duration_minutes) {
    return NextResponse.json({ error: 'İsim, fiyat ve süre zorunludur.' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('services')
    .insert({
      barber_id: user.id,
      name,
      description,
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
