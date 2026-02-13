# Statik HTML Export Kılavuzu

Bu proje statik HTML olarak export edilebilir şekilde yapılandırılmıştır. Database bağlantıları kaldırılmış ve dummy data ile çalışacak şekilde hazırlanmıştır.

## Özellikler

- ✅ Database bağlantıları kaldırıldı
- ✅ API route'ları kaldırıldı
- ✅ Provider ve Customer için dummy datalı profil sayfaları
- ✅ Statik HTML export desteği

## Build ve Export

### Statik HTML Export

```bash
cd apps/web
pnpm build
```

Build işlemi tamamlandıktan sonra, statik dosyalar `out` klasöründe oluşturulacaktır.

### FTP'ye Yükleme

1. Build işlemini tamamlayın:
   ```bash
   pnpm build
   ```

2. `out` klasöründeki tüm dosyaları FTP sunucunuza yükleyin

3. Web sunucunuzun `out` klasörünü root olarak ayarlayın veya `out` klasörünün içeriğini public_html'e kopyalayın

## Profil Sayfaları

### Provider Profili
- URL: `/profil/provider`
- Dummy data ile dolu provider dashboard'u

### Customer Profili
- URL: `/profil/customer`
- Dummy data ile dolu customer profil sayfası

## Notlar

- Tüm API çağrıları dummy data döndürecek şekilde yapılandırılmıştır
- Database bağlantıları tamamen kaldırılmıştır
- Statik export için Next.js `output: 'export'` modunda çalışmaktadır
- Resimler `unoptimized: true` modunda export edilir

## Dosya Yapısı

```
apps/web/
├── out/                    # Export edilen statik dosyalar (build sonrası)
├── src/
│   ├── app/
│   │   ├── profil/
│   │   │   ├── provider/   # Provider statik profil sayfası
│   │   │   └── customer/   # Customer statik profil sayfası
│   │   └── ...
│   ├── data/
│   │   └── dummyData.ts    # Dummy data tanımları
│   └── ...
└── next.config.js          # Statik export yapılandırması
```

