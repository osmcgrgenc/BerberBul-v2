export default function BarberBenefits() {
  return (
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
  );
}
