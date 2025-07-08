'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Barber } from '@/app/types';
import Link from 'next/link';

// Fix for default icon issue with Leaflet and Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

interface BarberMapProps {
  barbers: Barber[];
  center: [number, number];
  zoom: number;
}

export default function BarberMap({ barbers, center, zoom }: BarberMapProps) {
  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {barbers.map((barber) =>
        barber.latitude && barber.longitude ? (
          <Marker key={barber.id} position={[barber.latitude, barber.longitude]}>
            <Popup>
              <b>{barber.business_name}</b>
              <br />
              {barber.address}
              <br />
              <Link href={`/customer/book-appointment/${barber.id}`} className="text-indigo-600 hover:underline">
                Randevu Al
              </Link>
            </Popup>
          </Marker>
        ) : null
      )}
    </MapContainer>
  );
}
