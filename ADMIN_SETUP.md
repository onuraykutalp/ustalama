# Admin Kullanıcı Oluşturma Rehberi

## 🚀 Hızlı Başlangıç

Admin kullanıcı oluşturmak için aşağıdaki adımları izleyin:

### 1. Admin Kullanıcı Oluşturma

Proje root dizininde şu komutu çalıştırın:

```bash
cd packages/database
pnpm create-admin
```

Veya root dizinden:

```bash
pnpm --filter @talepo/database create-admin
```

### 2. Varsayılan Bilgiler

Script varsayılan olarak şu bilgileri kullanır:
- **Email:** `admin@talepo.com`
- **Password:** `admin123`
- **Name:** `Admin User`

### 3. Özel Bilgilerle Oluşturma

Environment variable'lar ile özelleştirebilirsiniz:

```bash
ADMIN_EMAIL=your-email@example.com ADMIN_PASSWORD=your-secure-password ADMIN_NAME="Your Name" pnpm --filter @talepo/database create-admin
```

### 4. Admin Paneline Giriş

1. Admin paneli URL'sine gidin:
   ```
   http://localhost:3000/admin-secret-7x9k2m4p8q1w3e5r6t
   ```

2. Otomatik olarak login sayfasına yönlendirileceksiniz:
   ```
   http://localhost:3000/admin-secret-7x9k2m4p8q1w3e5r6t/login
   ```

3. Oluşturduğunuz admin kullanıcı bilgileri ile giriş yapın

### 5. İlk Girişten Sonra

⚠️ **ÖNEMLİ:** İlk girişten sonra mutlaka şifrenizi değiştirin!

Admin panelinden kendi hesabınızı düzenleyerek şifrenizi değiştirebilirsiniz.

## 🔒 Güvenlik Notları

- Admin paneli gizli bir path üzerinden erişilebilir
- Sadece ADMIN role'üne sahip kullanıcılar giriş yapabilir
- İsteğe bağlı olarak `.env.local` dosyasında `NEXT_PUBLIC_ADMIN_EMAIL` ayarlayarak sadece belirli bir email adresine erişim verebilirsiniz

## 📝 Script Detayları

Script şu işlemleri yapar:
1. Veritabanında admin kullanıcı var mı kontrol eder
2. Varsa, role'ünü ADMIN yapar
3. Yoksa, yeni bir admin kullanıcı oluşturur
4. Şifreyi bcrypt ile hash'ler
5. Kullanıcı bilgilerini konsola yazdırır

## 🐛 Sorun Giderme

### "User already exists" hatası
- Kullanıcı zaten var, ancak role'ü ADMIN değilse script otomatik olarak günceller
- Kullanıcı zaten ADMIN ise, mevcut şifresini kullanarak giriş yapabilirsiniz

### "Database connection error"
- `DATABASE_URL` environment variable'ının doğru ayarlandığından emin olun
- Veritabanı servisinin çalıştığından emin olun

### "bcryptjs not found"
- `packages/database` dizininde `pnpm install` çalıştırın

