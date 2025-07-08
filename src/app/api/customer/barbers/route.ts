import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';
import { parse, isAfter, getDay } from 'date-fns';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userLatitude = searchParams.get('latitude');
  const userLongitude = searchParams.get('longitude');
  const radius = searchParams.get('radius') || '50'; // Default radius in km
  const location = searchParams.get('location');
  const serviceId = searchParams.get('serviceId');
  const categoryId = searchParams.get('categoryId');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const minRating = searchParams.get('minRating');
  const date = searchParams.get('date');
  const time = searchParams.get('time');

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
    query = query.ilike('address', `%${location}%`);
  }

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

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

    // Filter by service price
    if (minPrice || maxPrice) {
      const minP = minPrice ? parseFloat(minPrice) : -Infinity;
      const maxP = maxPrice ? parseFloat(maxPrice) : Infinity;
      filteredBarbers = filteredBarbers.filter(barber =>
        barber.services.some(service => service.price >= minP && service.price <= maxP)
      );
    }

    // Filter by minimum rating
    if (minRating) {
      const minR = parseFloat(minRating);
      const barbersWithRatings = await Promise.all(filteredBarbers.map(async (barber) => {
        const { data: reviews, error: reviewsError } = await supabase
          .from('reviews')
          .select('rating')
          .eq('barber_id', barber.id);

        if (reviewsError) {
          console.error(`Error fetching reviews for ${barber.id}:`, reviewsError);
          return { ...barber, averageRating: 0 }; // Treat as 0 if reviews can't be fetched
        }

        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const avgRating = reviews.length > 0 ? totalRating / reviews.length : 0;
        return { ...barber, averageRating: avgRating };
      }));

      filteredBarbers = barbersWithRatings.filter(barber => barber.averageRating >= minR);
    }

    // Filter by availability if date and time are provided
    if (date && time) {
      const requestedDateTime = parse(`${date} ${time}`, 'yyyy-MM-dd HH:mm', new Date());
      const dayOfWeek = getDay(requestedDateTime);

      filteredBarbers = filteredBarbers.filter(barber => {
        // Check working hours
        const hasWorkingHours = barber.working_hours.some((wh: { day_of_week: number; start_time: string; end_time: string }) => {
          if (wh.day_of_week === dayOfWeek) {
            const workStartTime = parse(`${date} ${wh.start_time}`, 'yyyy-MM-dd HH:mm', new Date());
            return isAfter(requestedDateTime, workStartTime) || requestedDateTime.getTime() === workStartTime.getTime();
          }
          return false;
        });

        if (!hasWorkingHours) return false;

        // Check for conflicting appointments
        // This would ideally be done on the backend for performance, but for simplicity
        // and to reuse existing availability logic, we'll do a basic check here.
        // A more robust solution would involve a dedicated API for checking a specific slot.
        // For now, we assume a service duration (e.g., 30 minutes) for the requested time slot.
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
        barber.services.some((service: { id: string }) => service.id === serviceId)
      );
    }

    return NextResponse.json(filteredBarbers);

  } catch (e) {
    console.error('Barber search API error:', e);
    return NextResponse.json({ error: 'Sunucu hatası oluştu.' }, { status: 500 });
  }
}
