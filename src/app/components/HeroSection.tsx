import Link from "next/link";

export default function HeroSection() {
  return (
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
  );
}
