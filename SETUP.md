# Kurulum Talimatları

## Gereksinimler

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- MySQL >= 8.0

## Adım 1: pnpm Kurulumu

Eğer pnpm yüklü değilse:

```bash
npm install -g pnpm
```

## Adım 2: Bağımlılıkları Yükle

```bash
pnpm install
```

## Adım 3: Veritabanı Kurulumu

1. MySQL veritabanını oluşturun:

```sql
CREATE DATABASE talepo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. `.env` dosyalarını oluşturun:

**Root dizinde `.env` dosyası:**
```env
DATABASE_URL="mysql://kullanici:sifre@localhost:3306/talepo?schema=public"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
NODE_ENV="development"
```

**`packages/database/.env` dosyası (Prisma için gerekli):**
```env
DATABASE_URL="mysql://kullanici:sifre@localhost:3306/talepo?schema=public"
```

**Not:** Prisma, `schema.prisma` dosyasının bulunduğu dizinde `.env` dosyasını arar, bu yüzden `packages/database/.env` dosyası mutlaka oluşturulmalıdır.

3. Prisma migration'larını çalıştırın:

```bash
pnpm db:generate
pnpm db:migrate
```

## Adım 4: Uygulamaları Çalıştır

### Web Uygulaması

```bash
# Sadece web uygulaması
cd apps/web
pnpm dev

# Veya root'tan tüm uygulamaları
pnpm dev
```

Web uygulaması: http://localhost:3000

### Mobil Uygulama

```bash
# Sadece mobil uygulama
cd apps/mobile
pnpm dev

# Veya root'tan
pnpm dev
```

## Yaygın Komutlar

- `pnpm dev` - Tüm uygulamaları development modunda çalıştır
- `pnpm build` - Tüm uygulamaları build et
- `pnpm lint` - Lint kontrolü yap
- `pnpm db:generate` - Prisma client'ı generate et
- `pnpm db:migrate` - Veritabanı migration'larını çalıştır
- `pnpm db:studio` - Prisma Studio'yu aç (veritabanı görüntüleme arayüzü)

## Sorun Giderme

### pnpm workspace hatası

Eğer workspace bağımlılıkları çalışmıyorsa:

```bash
pnpm install --force
```

### Prisma client hatası

```bash
cd packages/database
pnpm db:generate
```

### TypeScript hataları

```bash
pnpm install
```

