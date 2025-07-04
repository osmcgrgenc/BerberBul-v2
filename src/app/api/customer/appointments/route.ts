import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';
import moment from 'moment-timezone';

// POST: Create a new appointment
export async function POST(request: Request) {
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Yetkilendirme başarısız.' }, { status: 401 });
  }

  // Ensure the user is a customer (optional, but good practice for customer-specific APIs)
  const { data: profile, error: profileCheckError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileCheckError || !profile || profile.role !== 'customer') {
    return NextResponse.json({ error: 'Yetkisiz erişim. Sadece müşteriler randevu oluşturabilir.' }, { status: 403 });
  }

  const { barber_id, service_id, appointment_date, start_time, end_time, notes } = await request.json();

  if (!barber_id || !service_id || !appointment_date || !start_time || !end_time) {
    return NextResponse.json({ error: 'Tüm zorunlu alanlar doldurulmalıdır.' }, { status: 400 });
  }

  // Validate date and time formats
  if (!moment(appointment_date, 'YYYY-MM-DD', true).isValid()) {
    return NextResponse.json({ error: 'Geçersiz randevu tarihi formatı. YYYY-MM-DD kullanın.' }, { status: 400 });
  }
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(start_time) || !timeRegex.test(end_time)) {
    return NextResponse.json({ error: 'Geçersiz saat formatı. HH:MM kullanın.' }, { status: 400 });
  }

  // Convert times to moment objects for easier comparison
  const apptStartTime = moment.utc(start_time, 'HH:mm');
  const apptEndTime = moment.utc(end_time, 'HH:mm');

  if (apptStartTime.isSameOrAfter(apptEndTime)) {
    return NextResponse.json({ error: 'Başlangıç saati bitiş saatinden önce olmalıdır.' }, { status: 400 });
  }

  try {
    // 1. Verify barber's working hours for the given date
    const dayOfWeek = moment(appointment_date).day();
    const { data: workingHours, error: whError } = await supabase
      .from('working_hours')
      .select('start_time, end_time')
      .eq('barber_id', barber_id)
      .eq('day_of_week', dayOfWeek)
      .single();

    if (whError || !workingHours) {
      return NextResponse.json({ error: 'Berberin bu gün için çalışma saati tanımlı değil.' }, { status: 400 });
    }

    const barberWorkStartTime = moment.utc(workingHours.start_time, 'HH:mm');
    const barberWorkEndTime = moment.utc(workingHours.end_time, 'HH:mm');

    if (apptStartTime.isBefore(barberWorkStartTime) || apptEndTime.isAfter(barberWorkEndTime)) {
      return NextResponse.json({ error: 'Randevu, berberin çalışma saatleri dışında.' }, { status: 400 });
    }

    // 2. Check for overlapping appointments for the barber
    const { data: conflictingAppointments, error: conflictError } = await supabase
      .from('appointments')
      .select('start_time, end_time')
      .eq('barber_id', barber_id)
      .eq('appointment_date', appointment_date)
      .in('status', ['pending', 'confirmed']);

    if (conflictError) {
      console.error('Error checking conflicting appointments:', conflictError);
      return NextResponse.json({ error: 'Randevu çakışmaları kontrol edilirken bir hata oluştu.' }, { status: 500 });
    }

    const hasConflict = conflictingAppointments.some(appt => {
      const existingStartTime = moment.utc(appt.start_time, 'HH:mm');
      const existingEndTime = moment.utc(appt.end_time, 'HH:mm');

      return (
        (apptStartTime.isBefore(existingEndTime) && apptEndTime.isAfter(existingStartTime))
      );
    });

    if (hasConflict) {
      return NextResponse.json({ error: 'Seçilen saat aralığı berber için müsait değil.' }, { status: 409 });
    }

    // 3. Insert the new appointment
    const { data, error } = await supabase
      .from('appointments')
      .insert({
        customer_id: user.id,
        barber_id,
        service_id,
        appointment_date,
        start_time,
        end_time,
        notes,
        status: 'pending', // Default status
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating appointment:', error);
      return NextResponse.json({ error: 'Randevu oluşturulurken bir hata oluştu.' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (e) {
    console.error('Create appointment API error:', e);
    return NextResponse.json({ error: 'Sunucu hatası oluştu.' }, { status: 500 });
  }
}
