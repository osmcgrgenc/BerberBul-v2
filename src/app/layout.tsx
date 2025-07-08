import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Header from "./components/Header";

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

// Metadata can be exported from a client component, but it's often better
// to keep it in a server component if possible. For simplicity, we keep it here.
// Note: This might require adjustments based on Next.js version specifics.
export const metadata: Metadata = {
  title: "BerberBul: Türkiye'nin En İyi Berberlerini Keşfet ve Randevu Al",
  description:
    "BerberBul ile yakınınızdaki en iyi berberleri bulun, hizmetlerini inceleyin ve kolayca online randevu alın. Tarzınızı yenilemek için doğru adres!",
  keywords: [
    "berber",
    "randevu",
    "online randevu",
    "berber bul",
    "saç kesimi",
    "tıraş",
    "erkek kuaförü",
    "berber randevu sistemi",
    "Türkiye berberler",
  ],
  openGraph: {
    title: "BerberBul: Türkiye'nin En İyi Berberlerini Keşfet ve Randevu Al",
    description:
      "BerberBul ile yakınınızdaki en iyi berberleri bulun, hizmetlerini inceleyin ve kolayca online randevu alın.",
    type: "website",
    locale: "tr_TR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.variable} ${roboto.variable} antialiased`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
