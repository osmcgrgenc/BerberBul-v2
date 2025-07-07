import Link from "next/link";
import { ScissorsIcon } from "@heroicons/react/24/outline";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo ve Açıklama */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <ScissorsIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                BerberBul
              </span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Türkiye'nin en iyi berberlerini keşfedin, kolayca randevu alın ve tarzınızı yenileyin. 
              Modern teknoloji ile geleneksel berberlik hizmetini birleştiriyoruz.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors duration-200">
                <span className="text-sm font-semibold">f</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors duration-200">
                <span className="text-sm font-semibold">in</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors duration-200">
                <span className="text-sm font-semibold">ig</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors duration-200">
                <span className="text-sm font-semibold">tw</span>
              </a>
            </div>
          </div>

          {/* Hızlı Linkler */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hızlı Linkler</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/auth/register?role=customer" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Müşteri Olarak Kaydol
                </Link>
              </li>
              <li>
                <Link href="/auth/register?role=barber" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Berber Olarak Kaydol
                </Link>
              </li>
              <li>
                <Link href="/customer/dashboard/find-barber" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Berber Ara
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Giriş Yap
                </Link>
              </li>
            </ul>
          </div>

          {/* Destek */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Destek</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                  SSS
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                  İletişim
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Yardım Merkezi
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Geri Bildirim
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Alt Çizgi */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} BerberBul. Tüm Hakları Saklıdır.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                Gizlilik Politikası
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                Kullanım Koşulları
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                Çerez Politikası
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
