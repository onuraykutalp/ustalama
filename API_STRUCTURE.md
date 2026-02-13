# API Yapısı ve Kullanım Kılavuzu

## 📁 Klasör Yapısı

```
talepo/
├── apps/
│   ├── web/
│   │   └── src/
│   │       └── app/
│   │           └── api/              # Server-side API routes (Next.js)
│   │               ├── auth/
│   │               │   ├── login/route.ts
│   │               │   └── register/route.ts
│   │               ├── categories/
│   │               ├── services/
│   │               └── ...
│   └── mobile/                       # React Native uygulama
│
└── packages/
    └── api/                          # Shared API Client (Hem web hem mobil için)
        └── src/
            ├── client.ts             # HTTP client
            ├── auth.ts               # Auth API fonksiyonları
            ├── categories.ts         # Categories API
            ├── services.ts           # Services API
            ├── requests.ts           # Requests API
            ├── providers.ts          # Providers API
            ├── messages.ts           # Messages API
            ├── reviews.ts            # Reviews API
            └── index.ts              # Export all
```

## 🎯 Yaklaşım

### 1. Server-Side API Routes
**Konum:** `apps/web/src/app/api/*`

Next.js API routes olarak çalışır, sadece web uygulamasında kullanılır. Bu endpoint'ler:
- Veritabanı işlemleri yapar
- Authentication kontrolü yapar
- Server-side logic içerir

**Örnek:**
```typescript
// apps/web/src/app/api/auth/login/route.ts
export async function POST(request: NextRequest) {
  // Server-side logic
  const user = await prisma.user.findUnique({...})
  // ...
}
```

### 2. Shared API Client
**Konum:** `packages/api/src/*`

Hem web hem mobil uygulamalar için ortak kullanılan HTTP client. Bu paket:
- Server-side API routes'a HTTP istekleri yapar
- Token yönetimi yapar
- Type-safe API çağrıları sağlar

## 📝 Kullanım

### Web Uygulamasında

```typescript
// apps/web/src/components/SomeComponent.tsx
import { authApi, categoriesApi } from '@talepo/api'

// Login
const handleLogin = async () => {
  try {
    const response = await authApi.login({
      email: 'user@example.com',
      password: 'password123'
    })
    
    // Token otomatik olarak client'a kaydedilir
    authApi.setToken(response.token)
    
    // State'e kaydet
    useAuthStore.getState().login(response.user, response.token)
  } catch (error) {
    console.error(error)
  }
}

// Kategorileri getir
const categories = await categoriesApi.getAll()
```

### Mobil Uygulamada

```typescript
// apps/mobile/src/screens/LoginScreen.tsx
import { authApi, apiClient } from '@talepo/api'

// Base URL'i ayarla (mobil için gerekli)
apiClient.baseUrl = 'http://your-api-domain.com/api'
// veya environment variable kullan:
// EXPO_PUBLIC_API_URL=http://your-api-domain.com/api

// Login
const handleLogin = async () => {
  try {
    const response = await authApi.login({
      email: 'user@example.com',
      password: 'password123'
    })
    
    // Token'ı AsyncStorage'a kaydet
    await AsyncStorage.setItem('token', response.token)
    authApi.setToken(response.token)
  } catch (error) {
    console.error(error)
  }
}
```

## 🔧 Yeni Endpoint Ekleme

### 1. Server-Side Route Oluştur

```typescript
// apps/web/src/app/api/categories/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@talepo/database'

export async function GET(request: NextRequest) {
  const categories = await prisma.category.findMany()
  return NextResponse.json({ data: categories })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const category = await prisma.category.create({ data: body })
  return NextResponse.json({ data: category }, { status: 201 })
}
```

### 2. API Client Fonksiyonu Ekle

```typescript
// packages/api/src/categories.ts
import { apiClient } from './client'
import type { Category, CreateCategoryDto } from '@talepo/database'

export const categoriesApi = {
  async getAll(): Promise<Category[]> {
    const response = await apiClient.get<Category[]>('/categories')
    return response.data || []
  },
  
  async create(data: CreateCategoryDto): Promise<Category> {
    const response = await apiClient.post<Category>('/categories', data)
    return response.data!
  }
}
```

### 3. Export Et

```typescript
// packages/api/src/index.ts
export { categoriesApi } from './categories'
```

## 🔐 Authentication

Token yönetimi otomatik olarak yapılır:

```typescript
import { authApi } from '@talepo/api'

// Login yapıldığında token otomatik kaydedilir
await authApi.login({ email, password })

// Sonraki isteklerde token otomatik header'a eklenir
const categories = await categoriesApi.getAll() // Authorization header otomatik eklenir

// Logout
authApi.logout() // Token temizlenir
```

## 🌐 Environment Variables

### Web
```env
NEXT_PUBLIC_API_URL=/api  # Relative path (default)
```

### Mobile
```env
EXPO_PUBLIC_API_URL=http://your-api-domain.com/api
```

## 📦 Avantajlar

1. **Code Reusability**: Aynı API client hem web hem mobilde kullanılır
2. **Type Safety**: TypeScript ile tip güvenliği
3. **Consistency**: Tüm API çağrıları aynı yapıda
4. **Maintainability**: Tek bir yerden yönetim
5. **Testing**: API client'ı bağımsız test edilebilir

