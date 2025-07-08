import { NextResponse } from "next/server";
import {
  supabase,
  getUserWithRoleServer as getUserWithRole,
} from "@/app/lib/supabase";

// Helper function to send notifications
async function sendNotification(
  to: string,
  type: "email" | "sms",
  subject: string,
  message: string,
  template_data?: any
) {
  try {
    await fetch("http://localhost:3000/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, type, subject, message, template_data }),
    });
  } catch (error) {
    console.error("Failed to send notification:", error);
  }
}

// GET: List all appointments for the authenticated barber
export async function GET(request: Request) {
  const auth = await getUserWithRole("barber", request);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { user } = auth;

  const { data: appointments, error } = await supabase
    .from("appointments")
    .select(
      `
      *,
      customer:customer_id(id, business_name),
      service:service_id(id, name, price, duration_minutes)
    `
    )
    .eq("barber_id", user.id)
    .order("appointment_date", { ascending: true })
    .order("start_time", { ascending: true });

  if (error) {
    console.error("Error fetching barber appointments:", error);
    return NextResponse.json(
      { error: "Randevular alınırken bir hata oluştu." },
      { status: 500 }
    );
  }
  console.log({ appointments });
  return NextResponse.json(appointments);
}

// PUT: Update appointment status (approve/reject)
export async function PUT(
  request: Request,
  { params }: { params: { appointmentId: string } }
) {
  const auth = await getUserWithRole("barber", request);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { user } = auth;

  const { appointmentId } = params; // Get appointmentId from URL params
  const { status } = await request.json(); // Get status from request body

  if (!appointmentId || !status) {
    return NextResponse.json(
      { error: "Randevu ID ve durum zorunludur." },
      { status: 400 }
    );
  }

  if (!["confirmed", "cancelled", "completed"].includes(status)) {
    return NextResponse.json(
      { error: "Geçersiz randevu durumu." },
      { status: 400 }
    );
  }

  try {
    // Ensure the barber owns this appointment and fetch customer/service details for notification
    const { data: appointment, error: fetchError } = await supabase
      .from("appointments")
      .select(
        `
        *,
        customer:customer_id(email, phone_number),
        service:service_id(name)
      `
      )
      .eq("id", appointmentId)
      .eq("barber_id", user.id) // Ensure barber owns the appointment
      .single();

    if (fetchError || !appointment) {
      return NextResponse.json(
        { error: "Randevu bulunamadı veya yetkiniz yok." },
        { status: 404 }
      );
    }

    const { data, error } = await supabase
      .from("appointments")
      .update({ status })
      .eq("id", appointmentId)
      .select()
      .single();

    if (error) {
      console.error("Error updating appointment status:", error);
      return NextResponse.json(
        { error: "Randevu durumu güncellenirken bir hata oluştu." },
        { status: 500 }
      );
    }

    // Send notification based on status change
    const customerEmail = appointment.customer?.email;
    const customerPhone = appointment.customer?.phone_number;
    const serviceName = appointment.service?.name || "Hizmet";
    const appointmentDate = appointment.appointment_date;
    const appointmentTime = appointment.start_time;

    if (customerEmail) {
      let subject = "";
      let message = "";

      switch (status) {
        case "confirmed":
          subject = "Randevu Onaylandı!";
          message = `Randevunuz (${serviceName} - ${appointmentDate} ${appointmentTime}) onaylanmıştır.`;
          break;
        case "cancelled":
          subject = "Randevu İptal Edildi.";
          message = `Randevunuz (${serviceName} - ${appointmentDate} ${appointmentTime}) iptal edilmiştir.`;
          break;
        case "completed":
          subject = "Randevu Tamamlandı!";
          message = `Randevunuz (${serviceName} - ${appointmentDate} ${appointmentTime}) tamamlanmıştır.`;
          break;
      }
      await sendNotification(customerEmail, "email", subject, message);
    }

    if (customerPhone) {
      let smsMessage = "";
      switch (status) {
        case "confirmed":
          smsMessage = `Randevunuz (${serviceName} - ${appointmentDate} ${appointmentTime}) onaylandı.`;
          break;
        case "cancelled":
          smsMessage = `Randevunuz (${serviceName} - ${appointmentDate} ${appointmentTime}) iptal edildi.`;
          break;
        case "completed":
          smsMessage = `Randevunuz (${serviceName} - ${appointmentDate} ${appointmentTime}) tamamlandı.`;
          break;
      }
      await sendNotification(customerPhone, "sms", "", smsMessage);
    }

    return NextResponse.json(data);
  } catch (e) {
    console.error("Appointment update API error:", e);
    return NextResponse.json(
      { error: "Sunucu hatası oluştu." },
      { status: 500 }
    );
  }
}
