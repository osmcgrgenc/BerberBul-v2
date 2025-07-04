import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BerberBul: Türkiye'nin En İyi Berberlerini Keşfet ve Randevu Al",
  description: "BerberBul ile yakınınızdaki en iyi berberleri bulun, hizmetlerini inceleyin ve kolayca online randevu alın. Tarzınızı yenilemek için doğru adres!",
  keywords: ["berber", "randevu", "online randevu", "berber bul", "saç kesimi", "tıraş", "erkek kuaförü", "berber randevu sistemi", "Türkiye berberler"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
