import { NextResponse } from 'next/server';
import { supabase, getUserWithRole } from '@/app/lib/supabase';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

// Placeholder for email notification function
async function sendEmailNotification(to: string, subject: string, body: string) {
  console.log(`Sending email to: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${body}`);
  // In a real application, you would integrate with an email service here.
}

// PUT: Update an appointment status by barber
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params; // Appointment ID
  const auth = await getUserWithRole('barber');
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { user } = auth;

  const { status } = await request.json();

  if (!status) {
    return NextResponse.json({ error: 'Durum bilgisi zorunludur.' }, { status: 400 });
  }

  // Allowed statuses for barber to update
  const allowedStatuses = ['confirmed', 'cancelled', 'completed', 'pending'];
  if (!allowedStatuses.includes(status)) {
    return NextResponse.json({ error: 'Geçersiz randevu durumu.' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('appointments')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('barber_id', user.id) // Ensure barber can only update their own appointments
      .select()
      .single();

    if (error) {
      console.error('Error updating appointment status:', error);
      return NextResponse.json({ error: 'Randevu durumu güncellenirken bir hata oluştu.' }, { status: 500 });
    }

    // Fetch appointment, customer, barber, and service details for email notifications
    const { data: updatedAppointment, error: fetchApptError } = await supabase
      .from('appointments')
      .select(`
        *,
        customer:customer_id(email, business_name),
        barber:barber_id(email, business_name),
        service:service_id(name, price, duration_minutes)
      `)
      .eq('id', id)
      .single();

    if (fetchApptError || !updatedAppointment) {
      console.error('Error fetching updated appointment details for email:', fetchApptError);
      // Continue without sending email if details cannot be fetched
    }

    if (updatedAppointment && updatedAppointment.customer && updatedAppointment.barber && updatedAppointment.service) {
      const appointmentDateStr = format(new Date(updatedAppointment.appointment_date), 'dd.MM.yyyy', { locale: tr });
      const appointmentDetails = `Tarih: ${appointmentDateStr}, Saat: ${updatedAppointment.start_time}-${updatedAppointment.end_time}, Hizmet: ${updatedAppointment.service.name} (${updatedAppointment.service.price} TL, ${updatedAppointment.service.duration} dk)`;

      let customerSubject = '';
      let customerBody = '';
      let barberSubject = '';
      let barberBody = '';

      switch (status) {
        case 'confirmed':
          customerSubject = 'Randevunuz Onaylandı - BerberBul';
          customerBody = `Merhaba ${updatedAppointment.customer.business_name || updatedAppointment.customer.email},

Berber ${updatedAppointment.barber.business_name} ile olan randevunuz onaylanmıştır.
Randevu Detayları: ${appointmentDetails}

BerberBul'u tercih ettiğiniz için teşekkür ederiz.`;

          barberSubject = 'Randevu Onaylandı - BerberBul';
          barberBody = `Merhaba ${updatedAppointment.barber.business_name},

${updatedAppointment.customer.business_name || updatedAppointment.customer.email} adlı müşterinin randevusu tarafınızca onaylanmıştır.
Randevu Detayları: ${appointmentDetails}

İyi çalışmalar dileriz,
BerberBul Ekibi`;
          break;
        case 'cancelled':
          customerSubject = 'Randevunuz İptal Edildi - BerberBul';
          customerBody = `Merhaba ${updatedAppointment.customer.business_name || updatedAppointment.customer.email},

Berber ${updatedAppointment.barber.business_name} ile olan randevunuz iptal edilmiştir.
Randevu Detayları: ${appointmentDetails}

Anlayışınız için teşekkür ederiz,
BerberBul Ekibi`;

          barberSubject = 'Randevu İptal Edildi - BerberBul';
          barberBody = `Merhaba ${updatedAppointment.barber.business_name},

${updatedAppointment.customer.business_name || updatedAppointment.customer.email} adlı müşterinin randevusu iptal edilmiştir.
Randevu Detayları: ${appointmentDetails}

Bilginize sunarız,
BerberBul Ekibi`;
          break;
        case 'completed':
          customerSubject = 'Randevunuz Tamamlandı - BerberBul';
          customerBody = `Merhaba ${updatedAppointment.customer.business_name || updatedAppointment.customer.email},

Berber ${updatedAppointment.barber.business_name} ile olan randevunuz tamamlanmıştır.
Randevu Detayları: ${appointmentDetails}

BerberBul'u tercih ettiğiniz için teşekkür ederiz.`;

          barberSubject = 'Randevu Tamamlandı - BerberBul';
          barberBody = `Merhaba ${updatedAppointment.barber.business_name},

${updatedAppointment.customer.business_name || updatedAppointment.customer.email} adlı müşterinin randevusu tamamlandı olarak işaretlenmiştir.
Randevu Detayları: ${appointmentDetails}

İyi çalışmalar dileriz,
BerberBul Ekibi`;
          break;
        default:
          // No email for other statuses or if status is not handled
          break;
      }

      if (customerSubject && customerBody) {
        await sendEmailNotification(updatedAppointment.customer.email, customerSubject, customerBody);
      }
      if (barberSubject && barberBody) {
        await sendEmailNotification(updatedAppointment.barber.email, barberSubject, barberBody);
      }
    }

    return NextResponse.json(data);
  } catch (e) {
    console.error('Update appointment status API error:', e);
    return NextResponse.json({ error: 'Sunucu hatası oluştu.' }, { status: 500 });
  }
}
