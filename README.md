# BerberBul

BerberBul, müşterilerin berberleri kolayca bulmasını ve randevu almasını, berberlerin ise hizmetlerini sergilemesini ve müşteri tabanını genişletmesini sağlayan modern bir SaaS platformudur.

## Özellikler

- **Kimlik Doğrulama:** Kullanıcı kaydı, girişi, şifre sıfırlama ve rol tabanlı erişim kontrolü (Müşteri/Berber).
- **Berber Profili Yönetimi:** Berberlerin işletme bilgilerini, sundukları hizmetleri, çalışma saatlerini ve galeri görsellerini yönetebilmesi.
- **Randevu Sistemi:** Müşterilerin berberlerin müsaitlik durumuna göre randevu alabilmesi, randevularını görüntüleyebilmesi ve iptal edebilmesi. Berberlerin randevularını görüntüleyebilmesi ve durumlarını güncelleyebilmesi.
- **Arama ve Filtreleme:** Müşterilerin berberleri konuma ve hizmetlere göre arayabilmesi ve filtreleyebilmesi.
- **Harita Entegrasyonu:** Berber konumlarının harita üzerinde gösterilmesi ve kullanıcının mevcut konumuna göre berber arama.
- **Bildirimler:** Randevu oluşturma ve durum değişiklikleri için e-posta bildirimleri (placeholder).
- **Kullanıcı Geri Bildirimi:** Başarı ve hata mesajları için global toast bildirimleri.

## Teknolojiler

- **Frontend:** Next.js (React), Tailwind CSS
- **Backend:** Next.js API Routes
- **Veritabanı & Kimlik Doğrulama:** Supabase
- **Harita:** Leaflet, React-Leaflet
- **Diğer:** Moment.js (tarih/saat işlemleri), React Hot Toast (bildirimler)

## Kurulum

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyin:

### 1. Gereksinimler

- Node.js (v18 veya üzeri önerilir)
- pnpm (önerilen paket yöneticisi)
- Supabase hesabı ve projesi

### 2. Ortam Değişkenleri

`.env.example` dosyasını kopyalayarak `.env.local` adında yeni bir dosya oluşturun ve Supabase projenizin API anahtarları ile doldurun:

```bash
cp .env.example .env.local
```

`.env.local` içeriği:

```
NEXT_PUBLIC_SUPABASE_URL=SİZİN_SUPABASE_PROJE_URL'İNİZ
NEXT_PUBLIC_SUPABASE_ANON_KEY=SİZİN_SUPABASE_ANON_KEY'İNİZ
```

### 3. Bağımlılıkları Yükleme

```bash
pnpm install
```

### 4. Supabase Veritabanı Kurulumu

Supabase projenizde aşağıdaki tabloları ve RLS (Row Level Security) politikalarını oluşturun. Detaylı SQL komutları için `PLAN_V2.md` dosyasına bakın.

- `public.profiles` (latitude, longitude sütunları dahil)
- `public.services`
- `public.working_hours`
- `public.gallery_images`
- `public.appointments`

Supabase Storage'da `gallery` adında bir bucket oluşturmayı ve uygun RLS politikalarını ayarlamayı unutmayın.

### 5. Geliştirme Sunucusunu Başlatma

```bash
pnpm dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açarak uygulamayı görüntüleyebilirsiniz.

## Proje Yapısı

```
. (proje kök dizini)
├── .git/
├── .next/ (Next.js build çıktıları)
├── node_modules/
├── public/ (statik dosyalar)
├── src/
│   ├── app/
│   │   ├── api/ (Next.js API Routes)
│   │   │   ├── auth/
│   │   │   │   ├── login/route.ts
│   │   │   │   └── register/route.ts
│   │   │   ├── barber/
│   │   │   │   ├── appointments/
│   │   │   │   │   └── [id]/route.ts
│   │   │   │   │   └── route.ts
│   │   │   │   ├── gallery/
│   │   │   │   │   └── [id]/route.ts
│   │   │   │   │   └── route.ts
│   │   │   │   ├── profile/route.ts
│   │   │   │   └── services/
│   │   │   │       └── [id]/route.ts
│   │   │   │       └── route.ts
│   │   │   └── customer/
│   │   │       ├── appointments/
│   │   │       │   └── [id]/route.ts
│   │   │       │   └── route.ts
│   │   │       └── barber/
│   │   │           └── [barberId]/availability/route.ts
│   │   │           └── barbers/route.ts
│   │   ├── auth/
│   │   │   ├── forgot-password/page.tsx
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── update-password/page.tsx
│   │   ├── barber/
│   │   │   └── dashboard/
│   │   │       ├── appointments/page.tsx
│   │   │       ├── gallery/page.tsx
│   │   │       ├── profile/page.tsx
│   │   │       ├── services/page.tsx
│   │   │       └── working-hours/page.tsx
│   │   ├── customer/
│   │   │   └── dashboard/
│   │   │       ├── appointments/page.tsx
│   │   │       ├── find-barber/page.tsx
│   │   │       └── page.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── lib/
│   │   └── supabase.ts
│   └── types/
├── .env.example
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── README.md
├── tsconfig.json
└── PLAN_V2.md
```

## Geliştirme

### Kod Stili ve Linting

```bash
pnpm lint
```

### Build Alma

```bash
pnpm build
```

## Katkıda Bulunma

Katkıda bulunmak isterseniz, lütfen bir pull request açmadan önce mevcut kod stilini ve Conventional Commits standartlarını takip edin.

## Lisans

[Lisans Bilgisi Buraya Gelecek]