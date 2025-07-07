import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Daha genel bir hata mesajı döndür
      return NextResponse.json(
        {
          error: "Geçersiz kimlik bilgileri veya bir hata oluştu.",
          errorMessage: error,
        },
        { status: 400 }
      );
    }
    // Başarılı giriş durumunda kullanıcı bilgilerini döndür
    if (!data.user) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      data,
      {
        status: 200,
        headers: {
          "Set-Cookie": `sb-access-token=${data.session?.access_token}; Path=/; HttpOnly; Secure; SameSite=Strict`,
        },
      }
    );
  } catch (e) {
    console.error("Login API error:", e);
    return NextResponse.json(
      { error: "Sunucu hatası oluştu." },
      { status: 500 }
    );
  }
}
