import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { to, type, subject, message, template_data } = await request.json();

  console.log(`
--- Notification Request ---
To: ${to}
Type: ${type}
Subject: ${subject || 'N/A'}
Message: ${message}
Template Data: ${JSON.stringify(template_data || {})}
----------------------------
`);

  // In a real application, this is where you would make an HTTP request to your Go notification service.
  // Example (conceptual):
  /*
  try {
    const goServiceResponse = await fetch('http://localhost:8080/send-notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, type, subject, message, template_data }),
    });

    if (!goServiceResponse.ok) {
      const errorData = await goServiceResponse.json();
      console.error('Error from Go notification service:', errorData);
      return NextResponse.json({ error: 'Bildirim gönderilemedi.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Bildirim başarıyla gönderildi.' });
  } catch (error) {
    console.error('Failed to connect to Go notification service:', error);
    return NextResponse.json({ error: 'Bildirim servisine bağlanılamadı.' }, { status: 500 });
  }
  */

  return NextResponse.json({ message: 'Bildirim isteği alındı (simüle edildi).' });
}
