import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 px-4 text-center">
      <div className="max-w-6xl mx-auto">
        <p>&copy; {new Date().getFullYear()} BerberBul. Tüm Hakları Saklıdır.</p>
        <div className="flex justify-center space-x-4 mt-4">
          <Link href="#" className="hover:underline">Gizlilik Politikası</Link>
          <Link href="#" className="hover:underline">Kullanım Koşulları</Link>
          <Link href="#" className="hover:underline">İletişim</Link>
        </div>
      </div>
    </footer>
  );
}
