"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/app/lib/supabase";
import Link from "next/link";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default icon issue with Leaflet and Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
(L.Icon.Default as any).mergeOptions({
  iconRetinaUrl: 'leaflet/images/marker-icon-2x.png',
  iconUrl: 'leaflet/images/marker-icon.png',
  shadowUrl: 'leaflet/images/marker-shadow.png',
});

interface Barber {
  id: string;
  business_name: string;
  address: string;
  phone_number: string;
  bio?: string;
  latitude?: number;
  longitude?: number;
  services: Array<{
    id: string;
    name: string;
    price: number;
    duration_minutes: number;
  }>;
  working_hours: Array<{
    day_of_week: number;
    start_time: string;
    end_time: string;
  }>;
}

interface Service {
  id: string;
  name: string;
}

interface LocationMarkerProps {
  setLocationFilter: (location: string) => void;
  setCenter: (center: [number, number]) => void;
  setZoom: (zoom: number) => void;
}

function LocationMarker({ setLocationFilter, setCenter, setZoom }: LocationMarkerProps) {
  const map = useMap();

  useEffect(() => {
    (map as any).locate().on("locationfound", function (e: { latlng: { lat: number; lng: number } }) {
      setLocationFilter(`${e.latlng.lat},${e.latlng.lng}`);
      setCenter([e.latlng.lat, e.latlng.lng]);
      setZoom(13);
      map.flyTo(e.latlng, 13);
    });
  }, [map, setLocationFilter, setCenter, setZoom]);

  return null;
}

export default function FindBarberPage() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState(""); // Can be address or lat,lon
  const [serviceFilter, setServiceFilter] = useState("");
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    39.9334, 32.8597,
  ]); // Default to Ankara, Turkey
  const [mapZoom, setMapZoom] = useState(6);

  useEffect(() => {
    const fetchAllServices = async () => {
      const { data, error } = await supabase
        .from("services")
        .select("id, name");

      if (error) {
        console.error("Error fetching all services:", error);
        return;
      }
      // Deduplicate services if a barber offers the same service multiple times
      const uniqueServices = Array.from(
        new Map(data.map((item) => [item["name"], item])).values()
      );
      setAllServices(uniqueServices as Service[]);
    };
    fetchAllServices();
  }, []);

  const fetchBarbers = useCallback(async () => {
    setLoading(true);
    setError(null);

    const queryParams = new URLSearchParams();
    if (locationFilter) {
      // Check if locationFilter is lat,lon format
      const coords = locationFilter.split(",").map(Number);
      if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
        queryParams.append("latitude", coords[0].toString());
        queryParams.append("longitude", coords[1].toString());
        queryParams.append("radius", "50"); // Default search radius
      } else {
        queryParams.append("location", locationFilter);
      }
    }
    if (serviceFilter) queryParams.append("service_id", serviceFilter);

    const response = await fetch(
      `/api/customer/barbers?${queryParams.toString()}`
    );
    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Berberler alınamadı.");
      setLoading(false);
      return;
    }

    // Client-side search by business name (can be moved to API for large datasets)
    const filteredData = data.filter((barber: Barber) =>
      barber.business_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setBarbers(filteredData);
    setLoading(false);
  }, [searchTerm, locationFilter, serviceFilter]);

  useEffect(() => {
    fetchBarbers();
  }, [fetchBarbers]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <p>Yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <p className="text-red-600">Hata: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Berber Bul</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-8 sm:px-0">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Berber Ara ve Filtrele
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="searchTerm"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Berber Adı Ara
                  </label>
                  <input
                    type="text"
                    id="searchTerm"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Berber adı..."
                  />
                </div>
                <div>
                  <label
                    htmlFor="locationFilter"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Konuma Göre Filtrele (Adres veya Enlem,Boylam)
                  </label>
                  <input
                    type="text"
                    id="locationFilter"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    placeholder="Şehir, ilçe veya enlem,boylam..."
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                          (position) => {
                            setLocationFilter(
                              `${position.coords.latitude},${position.coords.longitude}`
                            );
                            setMapCenter([
                              position.coords.latitude,
                              position.coords.longitude,
                            ]);
                            setMapZoom(13);
                          },
                          (posError) => {
                            console.error("Geolocation error:", posError);
                            setError(
                              "Konumunuz alınamadı. Lütfen tarayıcı ayarlarınızı kontrol edin."
                            );
                          }
                        );
                      } else {
                        setError(
                          "Tarayıcınız konum servislerini desteklemiyor."
                        );
                      }
                    }}
                    className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Mevcut Konumu Kullan
                  </button>
                </div>
                <div>
                  <label
                    htmlFor="serviceFilter"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Hizmete Göre Filtrele
                  </label>
                  <select
                    id="serviceFilter"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={serviceFilter}
                    onChange={(e) => setServiceFilter(e.target.value)}
                  >
                    <option value="">Tüm Hizmetler</option>
                    {allServices.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div
              className="bg-white shadow overflow-hidden sm:rounded-lg p-6 mb-8"
              style={{ height: "500px" }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Harita</h2>
              <MapContainer
                center={mapCenter}
                zoom={mapZoom}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {barbers.map((barber) =>
                  barber.latitude && barber.longitude ? (
                    <Marker
                      key={barber.id}
                      position={[barber.latitude, barber.longitude]}
                    >
                      <Popup>
                        <b>{barber.business_name}</b>
                        <br />
                        {barber.address}
                        <br />
                        <Link
                          href={`/customer/book-appointment/${barber.id}`}
                          className="text-indigo-600 hover:underline"
                        >
                          Randevu Al
                        </Link>
                      </Popup>
                    </Marker>
                  ) : null
                )}
                <LocationMarker
                  setLocationFilter={setLocationFilter}
                  setCenter={setMapCenter}
                  setZoom={setMapZoom}
                />
              </MapContainer>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Berber Sonuçları
              </h2>
              {barbers.length === 0 ? (
                <p className="text-gray-600">
                  Aradığınız kriterlere uygun berber bulunamadı.
                </p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {barbers.map((barber) => (
                    <li
                      key={barber.id}
                      className="py-4 flex justify-between items-center"
                    >
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {barber.business_name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {barber.address}
                        </p>
                        <p className="text-sm text-gray-700">
                          Telefon: {barber.phone_number}
                        </p>
                        <p className="text-sm text-gray-700">
                          Hizmetler:{" "}
                          {barber.services.map((s) => s.name).join(", ")}
                        </p>
                      </div>
                      <div>
                        <Link
                          href={`/customer/book-appointment/${barber.id}`}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Randevu Al
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
