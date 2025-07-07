"use client";

import { useState, useEffect } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { ChevronLeftIcon, ChevronRightIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: "Ahmet Yılmaz",
      role: "Müşteri",
      avatar: "AY",
      rating: 5,
      comment: "BerberBul sayesinde artık randevu almak için telefon başında beklemek zorunda değilim. Çok pratik ve kullanışlı bir sistem!",
      location: "İstanbul"
    },
    {
      name: "Mehmet Kaya",
      role: "Berber",
      avatar: "MK",
      rating: 5,
      comment: "Platforma katıldıktan sonra müşteri sayım %50 arttı. Randevu yönetimi çok kolaylaştı, kesinlikle tavsiye ederim.",
      location: "Ankara"
    },
    {
      name: "Ali Demir",
      role: "Müşteri",
      avatar: "AD",
      rating: 5,
      comment: "Yakınımdaki en iyi berberleri kolayca bulabiliyorum. Fiyat karşılaştırması yapmak da çok kolay. Harika bir uygulama!",
      location: "İzmir"
    },
    {
      name: "Hasan Özkan",
      role: "Berber",
      avatar: "HÖ",
      rating: 5,
      comment: "Müşteri yorumları sayesinde güven oluşturuyoruz. Online randevu sistemi işimi çok kolaylaştırdı.",
      location: "Bursa"
    },
    {
      name: "Can Arslan",
      role: "Müşteri",
      avatar: "CA",
      rating: 5,
      comment: "Artık berber aramak için sokak sokak dolaşmıyorum. BerberBul ile en yakın ve en iyi berberi buluyorum.",
      location: "Antalya"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto">
        {/* Başlık */}
        <div className="text-center mb-16">
          <h2 className="text-heading font-bold text-gray-800 mb-4">
            Müşterilerimiz Ne Diyor?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Binlerce mutlu müşteri ve berber BerberBul'u tercih ediyor. 
            İşte onların deneyimleri.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative">
          {/* Ana testimonial */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-4xl mx-auto relative">
            {/* Quote icon */}
            <div className="absolute top-6 left-6 text-indigo-100">
              <ChatBubbleLeftRightIcon className="w-12 h-12" />
            </div>

            {/* Content */}
            <div className="text-center">
              {/* Rating */}
              <div className="flex justify-center mb-6">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <StarIcon key={i} className="w-6 h-6 text-yellow-400" />
                ))}
              </div>

              {/* Comment */}
              <p className="text-xl text-gray-700 leading-relaxed mb-8 italic">
                "{testimonials[currentIndex].comment}"
              </p>

              {/* Author */}
              <div className="flex items-center justify-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {testimonials[currentIndex].avatar}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-800">
                    {testimonials[currentIndex].name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonials[currentIndex].role} • {testimonials[currentIndex].location}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
          >
            <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
          >
            <ChevronRightIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center mt-8 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-indigo-600 scale-125' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-indigo-600 mb-2">4.9/5</div>
            <div className="text-gray-600">Ortalama Puan</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-indigo-600 mb-2">10K+</div>
            <div className="text-gray-600">Mutlu Müşteri</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-indigo-600 mb-2">%98</div>
            <div className="text-gray-600">Memnuniyet Oranı</div>
          </div>
        </div>
      </div>
    </section>
  );
}
