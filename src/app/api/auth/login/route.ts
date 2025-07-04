import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Daha genel bir hata mesajı döndür
      return NextResponse.json({ error: 'Geçersiz kimlik bilgileri veya bir hata oluştu.' }, { status: 400 });
    }
    return NextResponse.json(data);
  } catch (e) {
    console.error('Login API error:', e);
    return NextResponse.json({ error: 'Sunucu hatası oluştu.' }, { status: 500 });
  }
}
