# Talepo - Hizmet Platformu

Armut benzeri hizmet sağlayıcıları ile müşterileri buluşturan platform.

## 🏗️ Proje Yapısı

Bu proje bir monorepo yapısında organize edilmiştir:

```
talepo/
├── apps/
│   ├── web/          # Next.js web uygulaması
│   └── mobile/       # React Native mobil uygulama
├── packages/
│   ├── ui/           # Paylaşılan UI bileşenleri
│   ├── config/       # Paylaşılan konfigürasyonlar
│   └── database/     # Prisma veritabanı şeması
└── package.json
```

## 🚀 Teknolojiler

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **State Management**: Zustand
- **Database**: MySQL, Prisma ORM
- **Monorepo**: Turborepo, pnpm workspaces
- **Mobile**: React Native

## 📦 Kurulum

```bash
# Bağımlılıkları yükle
pnpm install

# Veritabanı migration'larını çalıştır
pnpm db:migrate

# Development modunda çalıştır
pnpm dev
```

## 🛠️ Komutlar

- `pnpm dev` - Tüm uygulamaları development modunda çalıştır
- `pnpm build` - Tüm uygulamaları build et
- `pnpm lint` - Lint kontrolü yap
- `pnpm db:generate` - Prisma client'ı generate et
- `pnpm db:migrate` - Veritabanı migration'larını çalıştır
- `pnpm db:studio` - Prisma Studio'yu aç

## 📱 Uygulamalar

### Web App
- Port: http://localhost:3000

### Mobile App
- React Native uygulaması

## 🔧 Geliştirme

Her paket kendi `package.json` dosyasına sahiptir ve bağımsız olarak çalıştırılabilir.

