# API Server Package

Paylaşılan API endpoint handler'ları. Hem web hem mobil uygulamalar için kullanılabilir.

## Yapı

```
packages/api-server/
├── src/
│   ├── handlers/          # Endpoint handler fonksiyonları
│   │   ├── auth/
│   │   │   ├── login.ts
│   │   │   └── register.ts
│   │   ├── profile/
│   │   ├── categories/
│   │   └── ...
│   ├── lib/               # Yardımcı fonksiyonlar
│   │   ├── auth.ts
│   │   └── middleware.ts
│   └── index.ts
```

## Kullanım

### Next.js Route Handler'larında

```typescript
// apps/web/src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { handleLogin } from '@talepo/api-server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = await handleLogin(body)
    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.error || 'Bir hata oluştu' },
      { status: error.status || 500 }
    )
  }
}
```

### Mobil Uygulamada

Mobil uygulama HTTP istekleri yaparak web'in API endpoint'lerine erişir. Handler'lar web'de çalışır, mobil sadece HTTP client kullanır.

## Handler Yapısı

Her handler fonksiyonu:
- Request data'yı parametre olarak alır
- Business logic'i çalıştırır
- Response döner veya hata fırlatır

```typescript
export async function handleLogin(data: LoginRequest): Promise<LoginResponse> {
  // Business logic
  // ...
  return result
}
```

## Avantajlar

1. **Code Reusability**: Aynı business logic hem web hem mobil için kullanılır
2. **Maintainability**: Tek bir yerden yönetim
3. **Testability**: Handler'lar bağımsız test edilebilir
4. **Type Safety**: TypeScript ile tip güvenliği

