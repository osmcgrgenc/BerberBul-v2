import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import dynamic from 'next/dynamic';
import { cookies } from 'next/headers';
import { supabase } from './lib/supabase';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const Header = dynamic(() => import('./components/Header'));

export const metadata: Metadata = {
  title: "BerberBul: Türkiye'nin En İyi Berberlerini Keşfet ve Randevu Al",
  description: "BerberBul ile yakınınızdaki en iyi berberleri bulun, hizmetlerini inceleyin ve kolayca online randevu alın. Tarzınızı yenilemek için doğru adres!",
  keywords: ["berber", "randevu", "online randevu", "berber bul", "saç kesimi", "tıraş", "erkek kuaförü", "berber randevu sistemi", "Türkiye berberler"],
  openGraph: {
    title: "BerberBul: Türkiye'nin En İyi Berberlerini Keşfet ve Randevu Al",
    description: "BerberBul ile yakınınızdaki en iyi berberleri bulun, hizmetlerini inceleyin ve kolayca online randevu alın.",
    type: "website",
    locale: "tr_TR",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Kullanıcı bilgisini al
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('sb-access-token');
  let user = null;

  if (accessToken?.value) {
    const { data, error } = await supabase.auth.getUser(accessToken.value);
    if (!error) {
      user = data.user;
    }
  }

  return (
    <html lang="tr">
      <body
        className={`${inter.variable} ${roboto.variable} antialiased`}
      >
        <Header user={user} />
        <main className="flex-1">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
