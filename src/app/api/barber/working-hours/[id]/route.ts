import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

// PUT: Update a specific working hour for the authenticated barber
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params; // Working hour ID
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

  // Basic validation for time format (HH:MM)
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(start_time) || !timeRegex.test(end_time)) {
    return NextResponse.json({ error: 'Geçersiz saat formatı. HH:MM formatını kullanın.' }, { status: 400 });
  }

  // Check for existing entry for the same day, excluding the current one being updated
  const { data: existingHours, error: existingHoursError } = await supabase
    .from('working_hours')
    .select('id')
    .eq('barber_id', user.id)
    .eq('day_of_week', day_of_week)
    .neq('id', id); // Exclude the current record being updated

  if (existingHoursError) {
    console.error('Error checking existing working hours:', existingHoursError);
    return NextResponse.json({ error: 'Çalışma saatleri kontrol edilirken bir hata oluştu.' }, { status: 500 });
  }

  if (existingHours && existingHours.length > 0) {
    return NextResponse.json({ error: 'Bu gün için zaten bir çalışma saati tanımlanmış.' }, { status: 409 });
  }

  const { data, error } = await supabase
    .from('working_hours')
    .update({
      day_of_week,
      start_time,
      end_time,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('barber_id', user.id) // Ensure barber can only update their own working hours
    .select()
    .single();

  if (error) {
    console.error('Error updating barber working hour:', error);
    return NextResponse.json({ error: 'Çalışma saati güncellenirken bir hata oluştu.' }, { status: 500 });
  }

  return NextResponse.json(data);
}

// DELETE: Delete a specific working hour for the authenticated barber
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params; // Working hour ID
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

  const { error } = await supabase
    .from('working_hours')
    .delete()
    .eq('id', id)
    .eq('barber_id', user.id); // Ensure barber can only delete their own working hours

  if (error) {
    console.error('Error deleting barber working hour:', error);
    return NextResponse.json({ error: 'Çalışma saati silinirken bir hata oluştu.' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Çalışma saati başarıyla silindi.' });
}
