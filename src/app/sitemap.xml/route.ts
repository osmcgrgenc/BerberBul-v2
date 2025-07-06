import { supabase } from "@/app/lib/supabase";

export const revalidate = 60 * 60 * 24; // revalidate daily

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const { data: barbers } = await supabase
    .from('profiles')
    .select('id')
    .eq('role', 'barber');

  const staticUrls = [
    '',
    '/auth/login',
    '/auth/register'
  ];

  const barberUrls = (barbers || []).map(b => `/customer/book-appointment/${b.id}`);

  const urls = [...staticUrls, ...barberUrls];
  const lastmod = new Date().toISOString();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map(path => `  <url><loc>${baseUrl}${path}</loc><lastmod>${lastmod}</lastmod></url>`)
      .join('\n') +
    `\n</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml'
    }
  });
}
