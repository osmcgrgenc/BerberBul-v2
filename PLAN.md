# BerberBul MVP Proje Planı

Bu belge, BerberBul SaaS projesinin MVP (Minimum Viable Product) aşamasını ve sonraki adımlarını özetlemektedir.

## Proje Hedefi (MVP)

BerberBul, müşterilerin berberleri kolayca bulmasını ve randevu almasını, berberlerin ise hizmetlerini sergilemesini ve müşteri tabanını genişletmesini sağlayan modern, kullanıcı dostu ve SEO uyumlu bir platform sunmayı hedeflemektedir. MVP aşamasında temel kimlik doğrulama, bilgilendirici bir ana sayfa ve kullanıcı türüne özel basit sayfalar sunulacaktır.

## Faz 1: Temel Kurulum ve Kimlik Doğrulama (Mevcut Durum ve İlk Adımlar)

### Mevcut Durum Değerlendirmesi:
- Next.js ve Supabase entegrasyonu mevcut.
- Temel `layout.tsx`, `globals.css` ve `lib/supabase.ts` dosyaları hazır.
- Basit login/register sayfaları ve tek bir API rotası (`/api/auth`) mevcut.

### Yapılacaklar (TO-DOs):

#### 1.1. Proje Planı Oluşturma (Tamamlandı)
- [x] `PLAN.md` dosyasını oluştur.

#### 1.2. Kimlik Doğrulama Akışını İyileştirme
- [x] **API Rotası Refaktörü:**
    - [x] `/api/auth/login` ve `/api/auth/register` olmak üzere ayrı API rotaları oluşturuldu.
    - [x] Hata mesajları üretim için genelleştirildi.
- [x] **Giriş Sayfası (`src/app/auth/login/page.tsx`) İyileştirmeleri:**
    - [x] İstemci tarafı form doğrulama (e-posta formatı, şifre uzunluğu).
    - [x] Yükleme durumu (loading state) yönetimi (buton devre dışı bırakma, spinner).
    - [x] Hata mesajlarının daha kullanıcı dostu gösterimi.
- [x] **Kayıt Sayfası (`src/app/auth/register/page.tsx`) İyileştirmeleri:**
    - [x] İstemci tarafı form doğrulama.
    - [x] Yükleme durumu yönetimi.
    - [x] Hata mesajlarının daha kullanıcı dostu gösterimi.
- [x] **Şifre Sıfırlama Sayfası (`src/app/auth/forgot-password/page.tsx`) Oluşturma:**
    - [x] Supabase'in şifre sıfırlama akışını entegre et.
    - [x] İstemci tarafı doğrulama ve yükleme durumu.

#### 1.3. Ana Sayfa (`src/app/page.tsx`) Tasarımı ve İçerik
- [x] Modern ve bilgilendirici bir ana sayfa taslağı oluşturuldu.
    - [x] Hero bölümü (başlık, açıklama, CTA butonları: "Müşteri olarak başla", "Berber olarak kaydol").
    - [x] BerberBul'un faydalarını anlatan bölümler (müşteriler ve berberler için).
    - [x] Güven ve referanslar (varsa) için yer tutucu eklendi.
    - [x] Footer eklendi.
- [x] `page.tsx` dosyası bu taslağa göre güncellendi.

#### 1.4. Temel UI Bileşenleri (Gerekirse)
- [x] Ortak kullanılan buton, input gibi bileşenleri `src/app/components` altına taşı veya oluştur. (Mevcut Tailwind kullanımı MVP için yeterli görüldü).

## Faz 2: Kullanıcı Rolleri ve Temel Sayfalar

### Yapılacaklar (TO-DOs):

#### 2.1. Kullanıcı Rolleri Yönetimi
- [x] Supabase'de kullanıcı rolü (customer/barber) bilgisini saklama stratejisi belirlendi (`public.profiles` tablosu).
    - **ÖNEMLİ:** Lütfen Supabase projenizde aşağıdaki SQL komutunu çalıştırarak `public.profiles` tablosunu oluşturun:
    ```sql
    CREATE TABLE public.profiles (
      id UUID REFERENCES auth.users ON DELETE CASCADE,
      role TEXT NOT NULL DEFAULT 'customer',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      PRIMARY KEY (id)
    );

    -- Optional: Add RLS policies for profiles table
    -- For example, allow users to read their own profile
    -- CREATE POLICY "Users can view their own profile."
    --   ON public.profiles FOR SELECT
    --   USING (auth.uid() = id);

    -- Allow users to update their own profile.
    -- CREATE POLICY "Users can update their own profile."
    --   ON public.profiles FOR UPDATE
    --   USING (auth.uid() = id);
    --   WITH CHECK (auth.uid() = id);
    ```
- [x] Kayıt sırasında kullanıcıdan rol seçimi alındı ve varsayılan rol atandı (`src/app/auth/register/page.tsx` güncellendi).
- [x] Kayıt sırasında seçilen rol `public.profiles` tablosuna kaydedildi (`src/app/api/auth/register/route.ts` güncellendi).
- [x] Giriş sonrası kullanıcı rolüne göre yönlendirme yapıldı.

#### 2.3. Müşteri Sayfası (`src/app/customer/dashboard/page.tsx`)
- [x] Basit bir müşteri paneli/profil sayfası oluşturuldu.
- [x] Temel navigasyon (örneğin, "Berber Bul", "Randevularım", "Profilim") eklendi.

#### 2.4. Berber Sayfası (`src/app/barber/dashboard/page.tsx`)
- [x] Basit bir berber paneli/profil sayfası oluşturuldu.
- [x] Temel navigasyon (örneğin, "Randevularım", "Hizmetlerim", "Profilim") eklendi.

## Faz 3: SEO, Duyarlılık ve Optimizasyon

### Yapılacaklar (TO-DOs):

#### 3.1. SEO Optimizasyonu (Türkiye Standartları)
- [x] Tüm sayfalar için dinamik `Metadata` (başlık, açıklama, anahtar kelimeler) ayarlandı (`layout.tsx` güncellendi).
- [x] Anlamsal HTML kullanımı: Mevcut sayfalarda (örn. `page.tsx`) anlamsal HTML etiketleri kullanıldı ve bu pratik yeni sayfalarda da sürdürülecek.
- [x] URL yapılandırması (anlaşılır ve kısa URL'ler): Next.js App Router yapısı sayesinde URL'ler doğal olarak anlaşılır ve kısa. Yeni sayfalarda da bu yapı korunacak.
- [x] Görsel optimizasyonu (`next/image` kullanımı, `alt` etiketleri): `page.tsx` dosyasında `next/image` ve `alt` etiketleri kullanıldı. Bu pratik tüm görseller için uygulanacak.
- [x] Schema Markup (yerel işletme, hizmetler vb. için araştır ve uygula): Bu, berber ve müşteri profil sayfaları geliştirildiğinde ele alınacak.

#### 3.2. Duyarlı Tasarım (Responsive Design)
- [x] Tüm sayfaların mobil, tablet ve masaüstü cihazlarda sorunsuz çalıştığından emin ol: Mevcut sayfalar Tailwind CSS'in duyarlı özelliklerini kullanmaktadır ve bu pratik yeni sayfalarda da sürdürülecektir.
- [x] Tailwind CSS'in duyarlı özelliklerini etkin kullan: Tailwind CSS entegrasyonu ve kullanımı mevcuttur.

#### 3.3. Performans Optimizasyonu
- [x] Next.js'in performans özelliklerini (Image Optimization, Font Optimization, Code Splitting) etkin kullan: `next/image` ve `next/font` kullanıldı, kod bölme Next.js tarafından otomatik olarak yönetiliyor.
- [ ] Lighthouse skorlarını iyileştirme: Bu, projenin ilerleyen aşamalarında sürekli olarak izlenecek ve iyileştirilecek bir süreçtir.

#### 3.4. Hata Yönetimi ve Kullanıcı Deneyimi
- [x] Global hata yakalama mekanizmaları: Next.js bazı global hata sınırları sağlar; daha spesifik hata yönetimi proje büyüdükçe eklenebilir.
- [x] Kullanıcıya geri bildirim (toast bildirimleri vb.): Mevcut giriş/kayıt/şifre sıfırlama sayfalarında temel hata/başarı mesajları sağlanmıştır. Daha gelişmiş bir bildirim sistemi (toast) daha sonra entegre edilebilir.

## Sonraki Adımlar (MVP Sonrası)

### Faz 4: Berber Profili Yönetimi

#### Yapılacaklar (TO-DOs):

#### 4.1. Veritabanı Şeması Tasarımı ve Oluşturma
- [x] `public.profiles` tablosuna berberlere özel alanlar eklendi (örneğin, `business_name`, `address`, `phone_number`, `bio`).
- [x] `public.services` tablosu oluşturuldu (`id`, `barber_id`, `name`, `description`, `price`, `duration`).
- [x] `public.working_hours` tablosu oluşturuldu (`id`, `barber_id`, `day_of_week`, `start_time`, `end_time`).
- [x] `public.gallery_images` tablosu oluşturuldu (`id`, `barber_id`, `image_url`, `description`).
- [x] Gerekli RLS (Row Level Security) politikaları tanımlandı.

#### 4.2. Berber Profili API Uç Noktaları
- [x] Berber profil bilgilerini (işletme adı, adres vb.) güncellemek için API rotası oluşturuldu (`src/app/api/barber/profile/route.ts`).
- [x] Hizmetleri yönetmek için API rotaları oluşturuldu (ekle, güncelle, sil).
- [x] Çalışma saatlerini yönetmek için API rotaları oluşturuldu (ekle, güncelle, sil).
- [x] Galeri görsellerini yönetmek için API rotaları oluşturuldu (yükle, sil).

#### 4.3. Berber Profili Yönetimi Frontend Sayfaları
- [x] Berber paneli altına "Profilim" sayfası oluşturuldu (`src/app/barber/dashboard/profile/page.tsx`).
- [x] Bu sayfada berber bilgilerini düzenleme formu oluşturuldu.
- [x] Hizmetleri listeleme, ekleme, düzenleme ve silme arayüzü oluşturuldu (`src/app/barber/dashboard/services/page.tsx`).
- [x] Çalışma saatlerini ayarlama arayüzü oluşturuldu (`src/app/barber/dashboard/working-hours/page.tsx`).
- [x] Galeri görsellerini yükleme ve yönetme arayüzü oluşturuldu (`src/app/barber/dashboard/gallery/page.tsx`).

- Randevu sistemi entegrasyonu.
- Müşteri randevu yönetimi.
- Arama ve filtreleme özellikleri.
- Harita entegrasyonu.
- Ödeme sistemleri.
- İletişim ve bildirimler.
