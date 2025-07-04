import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

// GET: List all gallery images for the authenticated barber
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

  const formData = await request.formData();
  const imageFile = formData.get('image') as File;
  const description = formData.get('description') as string | null;

  if (!imageFile) {
    return NextResponse.json({ error: 'Görsel dosyası bulunamadı.' }, { status: 400 });
  }

  const fileExt = imageFile.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `${user.id}/${fileName}`;

  try {
    // Upload image to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
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
      return NextResponse.json({ error: 'Görsel URL'si alınamadı.' }, { status: 500 });
    }

    // Save image metadata to public.gallery_images table
    const { data, error } = await supabase
      .from('gallery_images')
      .insert({
        barber_id: user.id,
        image_url: publicUrlData.publicUrl,
        description,
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
