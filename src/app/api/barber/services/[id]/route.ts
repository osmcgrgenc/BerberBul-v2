import { NextResponse } from 'next/server';
import { supabase, getUserWithRole } from '@/app/lib/supabase';

// Basit XSS/girdi temizleyici (tüm HTML taglerini kaldırır)
function sanitizeInput(input: string): string {
  return input.replace(/<[^>]*>?/gm, '');
}

// PUT: Update a specific service for the authenticated barber
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params; // Service ID
  const auth = await getUserWithRole('barber');
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { user } = auth;

  const { name, description, price, duration_minutes } = await request.json();

  if (!name || !price || !duration_minutes) {
    return NextResponse.json({ error: 'İsim, fiyat ve süre zorunludur.' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('services')
    .update({
      name: sanitizeInput(name),
      description: description ? sanitizeInput(description) : null,
      price,
      duration_minutes,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('barber_id', user.id) // Ensure barber can only update their own services
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: 'Hizmet güncellenirken bir hata oluştu.' }, { status: 500 });
  }

  return NextResponse.json(data);
}

// DELETE: Delete a specific service for the authenticated barber
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params; // Service ID
  const auth = await getUserWithRole('barber');
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { user } = auth;

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
