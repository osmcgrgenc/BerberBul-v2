import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

// PUT: Update a specific service for the authenticated barber
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params; // Service ID
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
    .update({
      name,
      description,
      price,
      duration_minutes,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('barber_id', user.id) // Ensure barber can only update their own services
    .select()
    .single();

  if (error) {
    console.error('Error updating barber service:', error);
    return NextResponse.json({ error: 'Hizmet güncellenirken bir hata oluştu.' }, { status: 500 });
  }

  return NextResponse.json(data);
}

// DELETE: Delete a specific service for the authenticated barber
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params; // Service ID
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
    .from('services')
    .delete()
    .eq('id', id)
    .eq('barber_id', user.id); // Ensure barber can only delete their own services

  if (error) {
    console.error('Error deleting barber service:', error);
    return NextResponse.json({ error: 'Hizmet silinirken bir hata oluştu.' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Hizmet başarıyla silindi.' });
}
