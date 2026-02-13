# API Client Package

Hem web hem mobil uygulamalar için paylaşılan API client paketi.

## Yapı

```
packages/api/
├── src/
│   ├── client.ts          # HTTP client (fetch wrapper)
│   ├── auth.ts            # Authentication API
│   ├── categories.ts      # Categories API
│   ├── services.ts        # Services API
│   ├── requests.ts        # Requests API
│   ├── providers.ts       # Providers API
│   ├── messages.ts        # Messages API
│   ├── reviews.ts         # Reviews API
│   └── index.ts           # Export all
```

## Kullanım

### Web Uygulamasında

```typescript
import { authApi, categoriesApi } from '@talepo/api'

// Login
const response = await authApi.login({
  email: 'user@example.com',
  password: 'password123'
})

// Token'ı sakla
authApi.setToken(response.token)

// Kategorileri getir
const categories = await categoriesApi.getAll()
```

### Mobil Uygulamada

```typescript
import { authApi, categoriesApi, apiClient } from '@talepo/api'

// Base URL'i ayarla (mobil için)
apiClient.baseUrl = 'http://your-api-url.com/api'

// Login
const response = await authApi.login({
  email: 'user@example.com',
  password: 'password123'
})

// Token'ı sakla
authApi.setToken(response.token)

// Kategorileri getir
const categories = await categoriesApi.getAll()
```

## API Modülleri

### Auth API (`authApi`)

```typescript
authApi.login(credentials)
authApi.register(data)
authApi.logout()
authApi.setToken(token)
```

### Categories API (`categoriesApi`)

```typescript
categoriesApi.getAll()
categoriesApi.getById(id)
categoriesApi.getBySlug(slug)
categoriesApi.create(data)
categoriesApi.update(id, data)
categoriesApi.delete(id)
```

### Services API (`servicesApi`)

```typescript
servicesApi.getAll({ categoryId?, providerId? })
servicesApi.getById(id)
servicesApi.create(data)
servicesApi.update(id, data)
servicesApi.delete(id)
```

### Requests API (`requestsApi`)

```typescript
requestsApi.getAll({ customerId?, providerId?, status? })
requestsApi.getById(id)
requestsApi.create(data)
requestsApi.update(id, data)
requestsApi.updateStatus(id, status)
requestsApi.delete(id)
```

### Providers API (`providersApi`)

```typescript
providersApi.getAll()
providersApi.getById(id)
providersApi.getByUserId(userId)
providersApi.create(data)
providersApi.update(id, data)
providersApi.delete(id)
```

### Messages API (`messagesApi`)

```typescript
messagesApi.getByRequest(requestId)
messagesApi.create(data)
messagesApi.delete(id)
```

### Reviews API (`reviewsApi`)

```typescript
reviewsApi.getAll({ providerId?, userId? })
reviewsApi.getById(id)
reviewsApi.getByRequest(requestId)
reviewsApi.create(data)
reviewsApi.update(id, data)
reviewsApi.delete(id)
```

## Server-Side API Routes

Server-side API endpoint'leri `apps/web/src/app/api/*` klasöründe bulunur:

```
apps/web/src/app/api/
├── auth/
│   ├── login/route.ts
│   └── register/route.ts
├── categories/
│   └── route.ts
├── services/
│   └── route.ts
├── requests/
│   └── route.ts
└── ...
```

Bu endpoint'ler Next.js server-side route'ları olarak çalışır ve hem web hem mobil uygulama bu endpoint'lere HTTP istekleri yapabilir.

