import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';
import { parse, format, addMinutes, isBefore, isValid } from 'date-fns';

// Helper function to generate time slots
const generateTimeSlots = (start: string, end: string, interval: number) => {
  const slots = [];
  let current = parse(start, 'HH:mm', new Date());
  const endMoment = parse(end, 'HH:mm', new Date());

  while (isBefore(current, endMoment)) {
    slots.push(format(current, 'HH:mm'));
    current = addMinutes(current, interval);
  }
  return slots;
};

export async function GET(request: Request, { params }: { params: { barberId: string } }) {
  const { barberId } = params;
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date'); // YYYY-MM-DD

  if (!date) {
    return NextResponse.json({ error: 'Tarih bilgisi zorunludur.' }, { status: 400 });
  }

  // Validate date format
  if (!isValid(parse(date, 'YYYY-MM-DD', new Date()))) {
    return NextResponse.json({ error: 'Geçersiz tarih formatı. YYYY-MM-DD kullanın.' }, { status: 400 });
  }

  // Get day of week (0 for Sunday, 6 for Saturday)
  const dayOfWeek = parse(date, 'YYYY-MM-DD', new Date()).getDay();

  try {
    // 1. Get barber's working hours for the given day
    const { data: workingHours, error: whError } = await supabase
      .from('working_hours')
      .select('start_time, end_time')
      .eq('barber_id', barberId)
      .eq('day_of_week', dayOfWeek)
      .single();

    if (whError || !workingHours) {
      // No working hours defined for this day or barber
      return NextResponse.json({ availability: [] });
    }

    // 2. Get existing appointments for the barber on the given date
    const { data: appointments, error: apptError } = await supabase
      .from('appointments')
      .select('start_time, end_time, status')
      .eq('barber_id', barberId)
      .eq('appointment_date', date)
      .in('status', ['pending', 'confirmed']); // Only consider pending/confirmed appointments as booked

    if (apptError) {
      console.error('Error fetching appointments:', apptError);
      return NextResponse.json({ error: 'Randevular alınırken bir hata oluştu.' }, { status: 500 });
    }

    // Assume a fixed service duration for simplicity (e.g., 30 minutes)
    // In a real app, this would come from the selected service or barber settings
    const serviceDuration = 30; // minutes

    // Generate all possible slots based on working hours
    const allSlots = generateTimeSlots(workingHours.start_time, workingHours.end_time, serviceDuration);

    // Filter out booked slots
    const bookedSlots = new Set();
    appointments.forEach(appt => {
      let current = parse(appt.start_time, 'HH:mm', new Date());
      const end = parse(appt.end_time, 'HH:mm', new Date());
      while (isBefore(current, end)) {
        bookedSlots.add(format(current, 'HH:mm'));
        current = addMinutes(current, serviceDuration);
      }
    });

    const availableSlots = allSlots.filter(slot => !bookedSlots.has(slot));

    return NextResponse.json({ availability: availableSlots });

  } catch (e) {
    console.error('Barber availability API error:', e);
    return NextResponse.json({ error: 'Sunucu hatası oluştu.' }, { status: 500 });
  }
}
