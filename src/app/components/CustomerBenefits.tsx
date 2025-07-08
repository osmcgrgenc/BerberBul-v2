import {
  MagnifyingGlassIcon,
  ClockIcon,
  StarIcon,
  MapPinIcon,
  CreditCardIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import Card from "./Card";

export default function CustomerBenefits() {
  const benefits = [
    {
      icon: MagnifyingGlassIcon,
      title: "Kolay Keşif",
      description:
        "Yakınınızdaki en iyi berberleri, hizmetlerini ve fiyatlarını kolayca bulun.",
      color: "from-blue-500 to-indigo-600",
    },
    {
      icon: ClockIcon,
      title: "Hızlı Randevu",
      description:
        "Sadece birkaç tıklamayla istediğiniz berberden randevu alın, bekleme derdine son verin.",
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: StarIcon,
      title: "Gerçek Yorumlar",
      description:
        "Diğer müşterilerin yorumlarını okuyarak doğru seçimi yapın.",
      color: "from-yellow-500 to-orange-600",
    },
    {
      icon: MapPinIcon,
      title: "Konum Bazlı Arama",
      description:
        "Bulunduğunuz yere en yakın berberleri harita üzerinde görün.",
      color: "from-purple-500 to-pink-600",
    },
    {
      icon: CreditCardIcon,
      title: "Güvenli Ödeme",
      description:
        "Randevu ücretlerini güvenli bir şekilde online olarak ödeyin.",
      color: "from-indigo-500 to-purple-600",
    },
    {
      icon: ShieldCheckIcon,
      title: "Kalite Garantisi",
      description:
        "Sadece onaylı ve kaliteli berberler platformumuzda yer alır.",
      color: "from-emerald-500 to-teal-600",
    },
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Başlık */}
        <div className="text-center mb-16">
          <h2 className="text-heading font-bold text-gray-800 mb-4">
            Müşteriler İçin BerberBul'un Faydaları
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Modern teknoloji ile geleneksel berberlik hizmetini birleştiriyoruz.
            Siz de deneyimin farkını yaşayın.
          </p>
        </div>

        {/* Faydalar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              className="group hover:scale-105 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* İkon */}
              <div
                className={`w-16 h-16 rounded-xl bg-gradient-to-br ${benefit.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <benefit.icon className="w-8 h-8 text-white" />
              </div>

              {/* İçerik */}
              <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-indigo-600 transition-colors duration-200">
                {benefit.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </Card>
          ))}
        </div>

        {/* Alt CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-700 px-6 py-3 rounded-full">
            <StarIcon className="w-5 h-5" />
            <span className="font-medium">
              Hemen ücretsiz hesap oluşturun ve deneyimi yaşayın!
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
