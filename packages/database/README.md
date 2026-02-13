# Database Package

Bu paket Prisma ORM ile veritabanı işlemlerini yönetir ve tüm model tipleri için TypeScript interface'leri sağlar.

## Kullanım

### Temel Interface'ler

```typescript
import { User, Category, Service, Request } from '@talepo/database'

// Temel tip kullanımı
const user: User = {
  id: '123',
  email: 'user@example.com',
  name: 'John Doe',
  // ...
}
```

### İlişkili Veriler ile Interface'ler

```typescript
import { UserWithRelations, RequestWithRelations } from '@talepo/database'

// İlişkili verilerle birlikte
const user: UserWithRelations = {
  id: '123',
  email: 'user@example.com',
  providerProfile: {
    id: '456',
    rating: 4.5,
    // ...
  },
  reviews: [
    // ...
  ]
}
```

### Enum'lar

```typescript
import { UserRole, RequestStatus, PriceType } from '@talepo/database'

const role: UserRole = UserRole.CUSTOMER
const status: RequestStatus = RequestStatus.PENDING
const priceType: PriceType = PriceType.FIXED
```

### DTO'lar (Data Transfer Objects)

```typescript
import { CreateUserDto, UpdateUserDto, CreateRequestDto } from '@talepo/database'

// Yeni kullanıcı oluşturma
const newUser: CreateUserDto = {
  email: 'new@example.com',
  password: 'securePassword',
  name: 'New User',
  role: UserRole.CUSTOMER
}

// Kullanıcı güncelleme
const updateData: UpdateUserDto = {
  name: 'Updated Name',
  phone: '05555555555'
}

// Yeni talep oluşturma
const newRequest: CreateRequestDto = {
  customerId: '123',
  title: 'Ev Temizliği',
  description: '3+1 daire temizlik',
  budget: 500
}
```

### Prisma ile Kullanım

```typescript
import { prisma } from '@talepo/database'
import { CreateUserDto, UserWithRelations } from '@talepo/database'

// Kullanıcı oluştur
const createUser = async (data: CreateUserDto) => {
  return await prisma.user.create({
    data
  })
}

// İlişkilerle birlikte kullanıcı getir
const getUserWithRelations = async (id: string): Promise<UserWithRelations | null> => {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      providerProfile: true,
      reviews: true,
      customerRequests: true
    }
  })
}
```

## Interface'ler

### Temel Modeller
- `User` - Kullanıcı
- `ProviderProfile` - Hizmet sağlayıcı profili
- `Category` - Kategori
- `Service` - Hizmet
- `Request` - Talep/İstek
- `Message` - Mesaj
- `Review` - Değerlendirme

### İlişkili Interface'ler
- `UserWithRelations`
- `ProviderProfileWithRelations`
- `CategoryWithRelations`
- `ServiceWithRelations`
- `RequestWithRelations`
- `MessageWithRelations`
- `ReviewWithRelations`

### DTO'lar
- `CreateUserDto`, `UpdateUserDto`
- `CreateProviderProfileDto`, `UpdateProviderProfileDto`
- `CreateCategoryDto`, `UpdateCategoryDto`
- `CreateServiceDto`, `UpdateServiceDto`
- `CreateRequestDto`, `UpdateRequestDto`
- `CreateMessageDto`
- `CreateReviewDto`, `UpdateReviewDto`

### Özel Interface'ler
- `PublicUser` - Şifre olmadan kullanıcı bilgileri
- `UserWithoutPassword` - Şifresiz kullanıcı bilgileri

## Enum'lar

- `UserRole` - CUSTOMER, PROVIDER, ADMIN
- `PriceType` - FIXED, HOURLY, QUOTE
- `RequestStatus` - PENDING, ACCEPTED, IN_PROGRESS, COMPLETED, CANCELLED

