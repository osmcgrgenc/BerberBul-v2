import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

// GET: List all working hours for the authenticated barber
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

  const { data: workingHours, error } = await supabase
    .from('working_hours')
    .select('*')
    .eq('barber_id', user.id)
    .order('day_of_week', { ascending: true })
    .order('start_time', { ascending: true });

  if (error) {
    console.error('Error fetching barber working hours:', error);
    return NextResponse.json({ error: 'Çalışma saatleri alınırken bir hata oluştu.' }, { status: 500 });
  }

  return NextResponse.json(workingHours);
}

// POST: Add a new working hour for the authenticated barber
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

  const { day_of_week, start_time, end_time } = await request.json();

  if (day_of_week === undefined || !start_time || !end_time) {
    return NextResponse.json({ error: 'Gün, başlangıç ve bitiş saati zorunludur.' }, { status: 400 });
  }

  // Basic validation for time format (HH:MM) - more robust validation might be needed
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(start_time) || !timeRegex.test(end_time)) {
    return NextResponse.json({ error: 'Geçersiz saat formatı. HH:MM formatını kullanın.' }, { status: 400 });
  }

  // Check for overlapping hours or existing entry for the same day
  const { data: existingHours, error: existingHoursError } = await supabase
    .from('working_hours')
    .select('id')
    .eq('barber_id', user.id)
    .eq('day_of_week', day_of_week);

  if (existingHoursError) {
    console.error('Error checking existing working hours:', existingHoursError);
    return NextResponse.json({ error: 'Çalışma saatleri kontrol edilirken bir hata oluştu.' }, { status: 500 });
  }

  if (existingHours && existingHours.length > 0) {
    return NextResponse.json({ error: 'Bu gün için zaten bir çalışma saati tanımlanmış.' }, { status: 409 });
  }

  const { data, error } = await supabase
    .from('working_hours')
    .insert({
      barber_id: user.id,
      day_of_week,
      start_time,
      end_time,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding barber working hour:', error);
    return NextResponse.json({ error: 'Çalışma saati eklenirken bir hata oluştu.' }, { status: 500 });
  }

  return NextResponse.json(data);
}
