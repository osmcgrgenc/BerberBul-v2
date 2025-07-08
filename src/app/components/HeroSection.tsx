import Link from "next/link";
import {
  UserIcon,
  ScissorsIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import Button from "./Button";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Arka plan görseli ve overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800">
        <div className="absolute inset-0 bg-black/40"></div>
        {/* Dekoratif elementler */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* İçerik */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {/* Üst badge */}
        <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/20">
          <SparklesIcon className="w-5 h-5 text-yellow-400" />
          <span className="text-sm font-medium">
            Türkiye'nin En İyi Berber Platformu
          </span>
        </div>

        {/* Ana başlık */}
        <h1 className="text-hero font-extrabold leading-tight mb-6 animate-fade-in-up">
          BerberBul ile
          <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            Tarzınızı Yenileyin
          </span>
        </h1>

        {/* Alt başlık */}
        <p
          className="text-subheading mb-12 opacity-90 max-w-3xl mx-auto leading-relaxed animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          Türkiye'nin en iyi berberlerini keşfedin, kolayca randevu alın ve
          profesyonel hizmetin keyfini çıkarın.
        </p>

        {/* İstatistikler */}
        <div
          className="flex flex-wrap justify-center gap-8 mb-12 animate-fade-in-up"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400">500+</div>
            <div className="text-sm opacity-80">Kayıtlı Berber</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400">10K+</div>
            <div className="text-sm opacity-80">Mutlu Müşteri</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400">50K+</div>
            <div className="text-sm opacity-80">Tamamlanan Randevu</div>
          </div>
        </div>

        {/* CTA Butonları */}
        <div
          className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up"
          style={{ animationDelay: "0.6s" }}
        >
          <Link href="/auth/register?role=customer">
            <Button
              size="lg"
              className="flex items-center justify-center space-x-2 group"
            >
              <UserIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              <span>Müşteri Olarak Başla</span>
            </Button>
          </Link>
          <Link href="/auth/register?role=barber">
            <Button
              variant="secondary"
              size="lg"
              className="flex items-center justify-center space-x-2 group"
            >
              <ScissorsIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              <span>Berber Olarak Kaydol</span>
            </Button>
          </Link>
        </div>

        {/* Güven göstergeleri */}
        <div
          className="mt-16 flex flex-wrap justify-center items-center gap-8 opacity-70 animate-fade-in-up"
          style={{ animationDelay: "0.8s" }}
        >
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-sm">SSL Güvenli</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-sm">7/24 Destek</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-sm">Ücretsiz Kayıt</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
