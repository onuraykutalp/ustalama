# Admin Panel Güvenlik Bilgileri

## ⚠️ ÖNEMLİ GÜVENLİK BİLGİLERİ

Admin paneli gizli bir path üzerinden erişilebilir durumda. Aşağıdaki bilgileri güvenli tutun!

## 🔐 Admin Panel Erişim Bilgileri

### Gizli Path
```
/admin-secret-7x9k2m4p8q1w3e5r6t
```

**Tam URL:** `http://localhost:3000/admin-secret-7x9k2m4p8q1w3e5r6t`

### Güvenlik Özellikleri

1. **Gizli Path:** Admin paneli standart `/admin` path'i yerine gizli bir path kullanıyor
2. **Role Kontrolü:** Sadece `ADMIN` role'üne sahip kullanıcılar erişebilir
3. **Email Kontrolü:** Opsiyonel olarak sadece belirli bir email adresine izin verilebilir

### Email Kontrolü Ayarlama

1. `apps/web/.env.local` dosyasını oluşturun (veya düzenleyin)
2. Aşağıdaki satırı ekleyin:

```env
# Sadece bu email adresine sahip admin kullanıcılar admin paneline erişebilir
NEXT_PUBLIC_ADMIN_EMAIL=your-email@example.com

# Server-side kontrol için (daha güvenli)
ADMIN_EMAIL=your-email@example.com
```

3. `your-email@example.com` yerine kendi email adresinizi yazın
4. Uygulamayı yeniden başlatın

**Not:** Email kontrolü boş bırakılırsa, tüm `ADMIN` role'üne sahip kullanıcılar erişebilir.

### Erişim Kontrolü

- ✅ Admin role'ü kontrolü (zorunlu)
- ✅ Email kontrolü (opsiyonel, .env.local'de ayarlanabilir)
- ✅ Header'dan admin panel linki kaldırıldı
- ✅ Tüm admin API endpoint'leri korumalı

### Öneriler

1. Gizli path'i düzenli olarak değiştirin
2. Email kontrolünü mutlaka aktif edin
3. Admin panel path'ini kimseyle paylaşmayın
4. Production'da daha güçlü güvenlik önlemleri ekleyin (IP whitelist, 2FA, vb.)

## 📝 Notlar

- Admin paneli artık `/admin` path'inde değil, gizli path'te
- Header'da admin panel linki yok
- Tüm internal linkler gizli path'e güncellendi
- API endpoint'leri (`/api/admin/*`) aynı şekilde korumalı

