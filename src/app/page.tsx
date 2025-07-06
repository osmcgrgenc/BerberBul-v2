import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header (Optional - can be added in layout.tsx or a separate component) */}
      <header className="w-full py-4 px-8 bg-white shadow-md flex justify-between items-center">
        <div className="text-2xl font-bold text-indigo-600">BerberBul</div>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/auth/login" className="text-gray-700 hover:text-indigo-600">
                Giriş Yap
              </Link>
            </li>
            <li>
              <Link href="/auth/register" className="text-gray-700 hover:text-indigo-600">
                Kayıt Ol
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative flex-grow flex items-center justify-center text-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            BerberBul: Randevularınız Parmaklarınızın Ucunda
          </h1>
          <p className="text-xl md:text-2xl mb-10 opacity-90">
            Türkiye&apos;nin en iyi berberlerini keşfedin, kolayca randevu alın ve tarzınızı yenileyin.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/auth/register?role=customer"
              className="bg-white text-indigo-600 px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-gray-100 transition duration-300"
            >
              Müşteri Olarak Başla
            </Link>
            <Link
              href="/auth/register?role=barber"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-indigo-600 transition duration-300"
            >
              Berber Olarak Kaydol
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits for Customers */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-12">Müşteriler İçin BerberBul&apos;un Faydaları</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold text-indigo-600 mb-4">Kolay Keşif</h3>
              <p className="text-gray-600">Yakınınızdaki en iyi berberleri, hizmetlerini ve fiyatlarını kolayca bulun.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold text-indigo-600 mb-4">Hızlı Randevu</h3>
              <p className="text-gray-600">Sadece birkaç tıklamayla istediğiniz berberden randevu alın, bekleme derdine son verin.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold text-indigo-600 mb-4">Gerçek Yorumlar</h3>
              <p className="text-gray-600">Diğer müşterilerin yorumlarını okuyarak doğru seçimi yapın.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits for Barbers */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-12">Berberler İçin BerberBul&apos;un Faydaları</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-gray-50 p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold text-indigo-600 mb-4">Yeni Müşteriler</h3>
              <p className="text-gray-600">Geniş müşteri tabanımıza ulaşarak işinizi büyütün ve yeni müşteriler kazanın.</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold text-indigo-600 mb-4">Kolay Yönetim</h3>
              <p className="text-gray-600">Randevularınızı, hizmetlerinizi ve müşteri bilgilerinizi tek bir yerden yönetin.</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold text-indigo-600 mb-4">Online Görünürlük</h3>
              <p className="text-gray-600">Dijital varlığınızı güçlendirin ve online platformlarda öne çıkın.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust/Testimonials (Placeholder) */}
      <section className="py-20 px-4 bg-gray-100 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-800 mb-12">Bize Güvenenler</h2>
          <p className="text-gray-600 text-lg">
            (Müşteri yorumları veya referanslar buraya gelecek.)
          </p>
        </div>
      </section>

      {/* Footer */}
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
    </div>
  );
}