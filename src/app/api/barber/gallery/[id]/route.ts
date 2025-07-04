import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

// DELETE: Delete a specific gallery image for the authenticated barber
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params; // Image ID
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

  // Get image URL to delete from storage
  const { data: imageData, error: imageFetchError } = await supabase
    .from('gallery_images')
    .select('image_url')
    .eq('id', id)
    .eq('barber_id', user.id) // Ensure barber can only delete their own images
    .single();

  if (imageFetchError || !imageData) {
    return NextResponse.json({ error: 'Görsel bulunamadı veya yetkiniz yok.' }, { status: 404 });
  }

  // Extract file path from URL
  const urlParts = imageData.image_url.split('/');
  const filePathInStorage = urlParts.slice(urlParts.indexOf('gallery') + 1).join('/');

  try {
    // Delete from Supabase Storage
    const { error: storageError } = await supabase.storage
      .from('gallery')
      .remove([filePathInStorage]);

    if (storageError) {
      console.error('Error deleting image from storage:', storageError);
      return NextResponse.json({ error: 'Görsel depolamadan silinirken bir hata oluştu.' }, { status: 500 });
    }

    // Delete from public.gallery_images table
    const { error } = await supabase
      .from('gallery_images')
      .delete()
      .eq('id', id)
      .eq('barber_id', user.id); // Ensure barber can only delete their own images

    if (error) {
      console.error('Error deleting image metadata from DB:', error);
      return NextResponse.json({ error: 'Görsel bilgileri silinirken bir hata oluştu.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Görsel başarıyla silindi.' });
  } catch (e) {
    console.error('Gallery delete API error:', e);
    return NextResponse.json({ error: 'Sunucu hatası oluştu.' }, { status: 500 });
  }
}
