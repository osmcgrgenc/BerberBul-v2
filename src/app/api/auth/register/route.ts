import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export async function POST(request: Request) {
  const { email, password, role } = await request.json(); // Get role from request

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      // Daha genel bir hata mesajı döndür
      return NextResponse.json({ error: 'Kayıt başarısız oldu veya bir hata oluştu.' }, { status: 400 });
    }

    // If user registration is successful, insert into profiles table
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({ id: data.user.id, role: role || 'customer' }); // Default to 'customer' if role is not provided

      if (profileError) {
        console.error('Profile insertion error:', profileError);
        // Consider rolling back user creation or handling this error specifically
        return NextResponse.json({ error: 'Profil oluşturulurken bir hata oluştu.' }, { status: 500 });
      }
    }

    return NextResponse.json(data);
  } catch (e) {
    console.error('Register API error:', e);
    return NextResponse.json({ error: 'Sunucu hatası oluştu.' }, { status: 500 });
  }
}
