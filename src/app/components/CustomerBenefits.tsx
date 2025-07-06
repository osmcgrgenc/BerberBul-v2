export default function CustomerBenefits() {
  return (
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
  );
}
