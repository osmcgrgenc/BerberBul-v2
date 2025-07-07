import { UserGroupIcon, ChartBarIcon, GlobeAltIcon, CalendarIcon, CreditCardIcon, CogIcon } from "@heroicons/react/24/outline";

export default function BarberBenefits() {
  const benefits = [
    {
      icon: UserGroupIcon,
      title: "Yeni Müşteriler",
      description: "Geniş müşteri tabanımıza ulaşarak işinizi büyütün ve yeni müşteriler kazanın.",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: CogIcon,
      title: "Kolay Yönetim",
      description: "Randevularınızı, hizmetlerinizi ve müşteri bilgilerinizi tek bir yerden yönetin.",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: GlobeAltIcon,
      title: "Online Görünürlük",
      description: "Dijital varlığınızı güçlendirin ve online platformlarda öne çıkın.",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: CalendarIcon,
      title: "Akıllı Takvim",
      description: "Otomatik randevu sistemi ile müşteri taleplerini kolayca yönetin.",
      color: "from-orange-500 to-red-600"
    },
    {
      icon: CreditCardIcon,
      title: "Güvenli Ödeme",
      description: "Müşteri ödemelerini güvenli bir şekilde alın ve finansal takibinizi yapın.",
      color: "from-indigo-500 to-purple-600"
    },
    {
      icon: ChartBarIcon,
      title: "Detaylı Analitik",
      description: "İş performansınızı takip edin ve gelişim alanlarınızı belirleyin.",
      color: "from-emerald-500 to-teal-600"
    }
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Başlık */}
        <div className="text-center mb-16">
          <h2 className="text-heading font-bold text-gray-800 mb-4">
            Berberler İçin BerberBul'un Faydaları
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            İşinizi dijitalleştirin, müşteri sayınızı artırın ve gelirlerinizi yükseltin. 
            Modern berberlik işletmesi için gerekli tüm araçlar burada.
          </p>
        </div>

        {/* Faydalar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="card group hover:scale-105 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* İkon */}
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${benefit.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <benefit.icon className="w-8 h-8 text-white" />
              </div>

              {/* İçerik */}
              <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-indigo-600 transition-colors duration-200">
                {benefit.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* İstatistikler */}
        <div className="mt-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">%40</div>
              <div className="text-indigo-100">Ortalama Gelir Artışı</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">%60</div>
              <div className="text-indigo-100">Zaman Tasarrufu</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">%80</div>
              <div className="text-indigo-100">Müşteri Memnuniyeti</div>
            </div>
          </div>
        </div>

        {/* Alt CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-700 px-6 py-3 rounded-full">
            <UserGroupIcon className="w-5 h-5" />
            <span className="font-medium">Berber işletmenizi dijitalleştirmek için hemen kayıt olun!</span>
          </div>
        </div>
      </div>
    </section>
  );
}
