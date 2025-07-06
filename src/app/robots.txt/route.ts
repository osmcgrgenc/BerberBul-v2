export const revalidate = 60 * 60 * 24; // revalidate daily

export function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const content = `User-agent: *\nAllow: /\n\nSitemap: ${baseUrl}/sitemap.xml`;
  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain'
    }
  });
}
