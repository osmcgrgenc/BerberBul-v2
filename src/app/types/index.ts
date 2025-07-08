// src/app/types/index.ts

export interface BusinessCategory {
  id: string;
  name: string;
  slug: string;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration_minutes: number;
}

export interface WorkingHours {
  day_of_week: number;
  start_time: string;
  end_time: string;
}

export interface Barber {
  id: string;
  business_name: string;
  address: string;
  phone_number: string;
  bio?: string;
  latitude?: number;
  longitude?: number;
  services: Service[];
  working_hours: WorkingHours[];
  averageRating?: number; // Added for search filtering
}

export interface Appointment {
  id: string;
  barber?: {
    id: string;
    business_name?: string;
  };
  customer?: {
    id: string;
    business_name?: string;
    email?: string;
  };
  service?: {
    id: string;
    name: string;
  };
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  customer: { id: string; business_name: string };
}
