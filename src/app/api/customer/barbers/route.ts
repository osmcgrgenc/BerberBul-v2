import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';
import moment from 'moment-timezone';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userLatitude = searchParams.get('latitude');
  const userLongitude = searchParams.get('longitude');
  const radius = searchParams.get('radius') || '50'; // Default radius in km

  // Haversine formula to calculate distance between two points on Earth
  const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  let query = supabase
    .from('profiles')
    .select(`
      id,
      business_name,
      address,
      phone_number,
      bio,
      latitude,
      longitude,
      services(id, name, price, duration_minutes),
      working_hours(day_of_week, start_time, end_time)
    `)
    .eq('role', 'barber');

  if (location) {
    query = query.ilike('address', `%${location}%`); // Simple location search
  }

  if (serviceId) {
    // This requires a more complex join or a separate query if services are not directly on profiles
    // For now, we'll filter services in the frontend after fetching all barbers
    // Or, we can adjust the query to join with services table and filter
    // Example: query = query.in('id', supabase.from('services').select('barber_id').eq('id', serviceId));
  }

  // TODO: Implement filtering by min_rating (requires a ratings table and aggregation)

  try {
    const { data: barbers, error } = await query;

    if (error) {
      console.error('Error fetching barbers:', error);
      return NextResponse.json({ error: 'Berberler alınırken bir hata oluştu.' }, { status: 500 });
    }

    let filteredBarbers = barbers;

    // Filter by location if latitude and longitude are provided
    if (userLatitude && userLongitude) {
      const lat = parseFloat(userLatitude);
      const lon = parseFloat(userLongitude);
      const searchRadius = parseFloat(radius);

      filteredBarbers = filteredBarbers.filter(barber => {
        if (barber.latitude && barber.longitude) {
          const distance = haversineDistance(lat, lon, barber.latitude, barber.longitude);
          return distance <= searchRadius;
        }
        return false;
      });
    }

    // Filter by availability if date and time are provided
    if (date && time) {
      const requestedDateTime = moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm');
      const dayOfWeek = requestedDateTime.day();

      filteredBarbers = filteredBarbers.filter(barber => {
        // Check working hours
        const hasWorkingHours = barber.working_hours.some((wh: any) => {
          if (wh.day_of_week === dayOfWeek) {
            const workStartTime = moment(`${date} ${wh.start_time}`, 'YYYY-MM-DD HH:mm');
            const workEndTime = moment(`${date} ${wh.end_time}`, 'YYYY-MM-DD HH:mm');
            return requestedDateTime.isSameOrAfter(workStartTime) && requestedDateTime.isBefore(workEndTime);
          }
          return false;
        });

        if (!hasWorkingHours) return false;

        // Check for conflicting appointments
        // This would ideally be done on the backend for performance, but for simplicity
        // and to reuse existing availability logic, we'll do a basic check here.
        // A more robust solution would involve a dedicated API for checking a specific slot.
        // For now, we assume a service duration (e.g., 30 minutes) for the requested time slot.
        const assumedServiceDuration = 30; // minutes
        const requestedEndTime = moment(requestedDateTime).add(assumedServiceDuration, 'minutes');

        const hasConflict = false; // Placeholder for actual conflict check
        // To implement actual conflict check, you'd need to fetch appointments for this barber
        // and date, and then check for overlaps.
        // This is better done in a dedicated availability API endpoint, which we already have.
        // So, this filter here is more about initial working hours check.

        return !hasConflict; // If no conflict, barber is available
      });
    }

    // Filter by service if serviceId is provided (frontend filtering for now)
    if (serviceId) {
      filteredBarbers = filteredBarbers.filter(barber =>
        barber.services.some((service: any) => service.id === serviceId)
      );
    }

    return NextResponse.json(filteredBarbers);

  } catch (e) {
    console.error('Barber search API error:', e);
    return NextResponse.json({ error: 'Sunucu hatası oluştu.' }, { status: 500 });
  }
}
