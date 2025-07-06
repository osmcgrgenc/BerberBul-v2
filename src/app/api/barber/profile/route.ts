import { NextResponse } from 'next/server';
import { supabase, getUserWithRole } from '@/app/lib/supabase';

export async function GET() {
  const auth = await getUserWithRole('barber');
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { user } = auth;

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, business_name, address, phone_number, bio, role, latitude, longitude')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: 'Profil bulunamadı.' }, { status: 404 });
  }

  return NextResponse.json(profile);
}

// Basit XSS/girdi temizleyici (tüm HTML taglerini kaldırır)
function sanitizeInput(input: string): string {
  return input.replace(/<[^>]*>?/gm, '');
}

export async function PUT(request: Request) {

  const auth = await getUserWithRole('barber');
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { user } = auth;

  const { business_name, address, phone_number, bio, latitude, longitude } = await request.json();

  // Zorunlu alan kontrolü
  if (!business_name || !address || !phone_number) {
    return NextResponse.json({ error: 'İşletme adı, adres ve telefon numarası zorunludur.' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({
      business_name: sanitizeInput(business_name),
      address: sanitizeInput(address),
      phone_number: sanitizeInput(phone_number),
      bio: bio ? sanitizeInput(bio) : null,
      latitude,
      longitude,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: 'Profil güncellenirken bir hata oluştu.' }, { status: 500 });
  }

  return NextResponse.json(data);
}
