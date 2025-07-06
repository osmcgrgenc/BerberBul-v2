import { createClient, User } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or Anon Key. Make sure to set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Kullanıcıyı ve rolünü kontrol eden yardımcı fonksiyon.
 * @param expectedRole Beklenen rol (örn: 'barber', 'customer')
 * @returns { user, profile } veya { error }
 */
export async function getUserWithRole(expectedRole: string): Promise<
  | { user: User; profile: { role: string } }
  | { error: string; status: number }
> {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return { error: 'Yetkilendirme başarısız.', status: 401 };
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile || profile.role !== expectedRole) {
    return { error: 'Yetkisiz erişim.', status: 403 };
  }

  return { user, profile };
}
