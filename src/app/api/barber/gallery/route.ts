import { NextResponse } from 'next/server';
import { supabase, getUserWithRole } from '@/app/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

// Basit XSS/girdi temizleyici (tüm HTML taglerini kaldırır)
function sanitizeInput(input: string): string {
  return input.replace(/<[^>]*>?/gm, '');
}

// GET: List all gallery images for the authenticated barber
export async function GET() {
  const auth = await getUserWithRole('barber');
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { user } = auth;

  const { data: images, error } = await supabase
    .from('gallery_images')
    .select('*')
    .eq('barber_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching gallery images:', error);
    return NextResponse.json({ error: 'Galeri görselleri alınırken bir hata oluştu.' }, { status: 500 });
  }

  return NextResponse.json(images);
}

// POST: Upload a new gallery image for the authenticated barber
export async function POST(request: Request) {
  const auth = await getUserWithRole('barber');
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { user } = auth;

  const formData = await request.formData();
  const imageFile = formData.get('image') as File;
  const description = formData.get('description') as string | null;

  if (!imageFile) {
    return NextResponse.json({ error: 'Görsel dosyası bulunamadı.' }, { status: 400 });
  }

  // Dosya tipi ve boyut kontrolü
  const fileExt = imageFile.name.split('.').pop()?.toLowerCase();
  const allowedExts = ['jpg', 'jpeg', 'png', 'webp'];
  if (!fileExt || !allowedExts.includes(fileExt)) {
    return NextResponse.json({ error: 'Sadece jpg, jpeg, png veya webp dosyalarına izin verilir.' }, { status: 400 });
  }
  if (imageFile.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'Dosya boyutu 5MB üzerinde olamaz.' }, { status: 400 });
  }

  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `${user.id}/${fileName}`;

  try {
    // Upload image to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('gallery') // Assuming you have a bucket named 'gallery'
      .upload(filePath, imageFile, { cacheControl: '3600', upsert: false });

    if (uploadError) {
      console.error('Error uploading image to storage:', uploadError);
      return NextResponse.json({ error: 'Görsel yüklenirken bir hata oluştu.' }, { status: 500 });
    }

    // Get public URL of the uploaded image
    const { data: publicUrlData } = supabase.storage
      .from('gallery')
      .getPublicUrl(filePath);

    if (!publicUrlData || !publicUrlData.publicUrl) {
      return NextResponse.json({ error: 'Görsel URLsi alınamadı.' }, { status: 500 });
    }

    // Save image metadata to public.gallery_images table
    const { data, error } = await supabase
      .from('gallery_images')
      .insert({
        barber_id: user.id,
        image_url: publicUrlData.publicUrl,
        description: description ? sanitizeInput(description) : null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving image metadata to DB:', error);
      return NextResponse.json({ error: 'Görsel bilgileri kaydedilirken bir hata oluştu.' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (e) {
    console.error('Gallery upload API error:', e);
    return NextResponse.json({ error: 'Sunucu hatası oluştu.' }, { status: 500 });
  }
}
