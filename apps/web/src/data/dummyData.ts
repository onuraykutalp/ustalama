import { UserRole, RequestStatus, PriceType } from '@talepo/database'
import type { UserWithRelations, ProviderProfileWithRelations, RequestWithRelations, ReviewWithRelations, Service } from '@talepo/database'

// Provider Dummy Data
export const dummyProviderUser: UserWithRelations = {
  id: 'provider-1',
  email: 'mehmet.demir@example.com',
  name: 'Mehmet Demir',
  phone: '+90 555 123 4567',
  password: '',
  role: UserRole.PROVIDER,
  avatar: null,
  createdAt: new Date('2023-01-15'),
  updatedAt: new Date(),
  customerRequests: [],
  providerProfile: {
    id: 'provider-profile-1',
    userId: 'provider-1',
    bio: '10 yıllık deneyimli elektrikçi. Tüm elektrik işleri için profesyonel hizmet. Acil müdahale mevcut. Lisanslı ve sigortalı çalışıyorum.',
    rating: 4.8,
    totalJobs: 127,
    isVerified: true,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date(),
    services: [
      {
        id: 'service-1',
        providerId: 'provider-profile-1',
        categoryId: 'cat-1',
        title: 'Elektrik Tamiri',
        description: 'Tüm elektrik arızaları için profesyonel hizmet. Priz, sigorta, tesisat tamiri.',
        price: 200,
        priceType: PriceType.HOURLY,
        createdAt: new Date('2023-02-01'),
        updatedAt: new Date()
      },
      {
        id: 'service-2',
        providerId: 'provider-profile-1',
        categoryId: 'cat-1',
        title: 'Elektrik Tesisatı',
        description: 'Yeni elektrik tesisatı kurulumu ve yenileme işleri.',
        price: 150,
        priceType: PriceType.HOURLY,
        createdAt: new Date('2023-02-15'),
        updatedAt: new Date()
      },
      {
        id: 'service-3',
        providerId: 'provider-profile-1',
        categoryId: 'cat-1',
        title: 'Acil Elektrik Müdahalesi',
        description: '7/24 acil elektrik müdahale hizmeti.',
        price: 500,
        priceType: PriceType.FIXED,
        createdAt: new Date('2023-03-01'),
        updatedAt: new Date()
      }
    ],
    requests: [
      {
        id: 'request-1',
        customerId: 'customer-1',
        providerId: 'provider-profile-1',
        serviceId: 'service-1',
        title: 'Ev Elektrik Tamiri',
        description: 'Evdeki tüm prizlerde sorun var. Acil müdahale gerekiyor.',
        status: RequestStatus.IN_PROGRESS,
        budget: 800,
        location: 'Kadıköy, İstanbul',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
        completedAt: null,
        customer: {
          id: 'customer-1',
          email: 'ayse@example.com',
          name: 'Ayşe Yılmaz',
          phone: null,
          password: '',
          role: UserRole.CUSTOMER,
          avatar: null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        service: undefined,
        messages: [
          {
            id: 'msg-1',
            requestId: 'request-1',
            senderId: 'customer-1',
            content: 'Merhaba, teklifiniz hakkında konuşmak istiyorum. Bütçe konusunda biraz esnek olabilir miyiz?',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
          },
          {
            id: 'msg-2',
            requestId: 'request-1',
            senderId: 'provider-1',
            content: 'Tabii, bütçe konusunda esnek olabiliriz. Detayları konuşalım.',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000)
          },
          {
            id: 'msg-3',
            requestId: 'request-1',
            senderId: 'customer-1',
            content: 'Harika! Ne zaman başlayabiliriz?',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
          }
        ],
        reviews: []
      }
    ],
    reviews: [
      {
        id: 'review-1',
        requestId: 'request-1',
        userId: 'customer-1',
        providerId: 'provider-profile-1',
        rating: 5,
        comment: 'Çok profesyonel ve hızlı bir hizmet. Teşekkürler!',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
        user: {
          id: 'customer-1',
          email: 'ayse@example.com',
          name: 'Ayşe Yılmaz',
          phone: null,
          password: '',
          role: UserRole.CUSTOMER,
          avatar: null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        request: null,
        provider: undefined
      },
      {
        id: 'review-2',
        requestId: 'request-2',
        userId: 'customer-2',
        providerId: 'provider-profile-1',
        rating: 4,
        comment: 'İyi bir hizmet, fiyat biraz yüksek ama kaliteli.',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
        user: {
          id: 'customer-2',
          email: 'ali@example.com',
          name: 'Ali Çelik',
          phone: null,
          password: '',
          role: UserRole.CUSTOMER,
          avatar: null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        request: null,
        provider: undefined
      }
    ]
  },
  reviews: [],
  messages: []
} as unknown as UserWithRelations

// Customer Dummy Data
export const dummyCustomerUser = {
  id: 'customer-1',
  email: 'ayse.yilmaz@example.com',
  name: 'Ayşe Yılmaz',
  phone: '+90 555 987 6543',
  password: '',
  role: UserRole.CUSTOMER,
  avatar: null,
  createdAt: new Date('2023-02-01'),
  updatedAt: new Date(),
  customerRequests: [
    {
      id: 'customer-request-1',
      customerId: 'customer-1',
      providerId: 'provider-profile-1',
      serviceId: null,
      title: 'Ev Temizliği İhtiyacı',
      description: '3+1 daire için haftalık temizlik hizmeti arıyorum. Düzenli olarak her hafta gelinmesini istiyorum.',
      status: RequestStatus.PENDING,
      budget: 2500,
      location: 'Kadıköy, İstanbul',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
      completedAt: null,
      customer: undefined,
      provider: {
        id: 'provider-profile-1',
        userId: 'provider-1',
        bio: null,
        rating: 4.8,
        totalJobs: 127,
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          id: 'provider-1',
          email: 'mehmet.demir@example.com',
          name: 'Mehmet Demir',
          phone: null,
          password: '',
          role: UserRole.PROVIDER,
          avatar: null,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      },
      service: undefined,
      messages: [
        {
          id: 'msg-cr-1',
          requestId: 'customer-request-1',
          senderId: 'provider-1',
          content: 'Merhaba, temizlik hizmeti için teklif hazırladım. Haftalık 2500 TL olarak belirledim.',
          createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'msg-cr-2',
          requestId: 'customer-request-1',
          senderId: 'customer-1',
          content: 'Teşekkürler! Ne zaman başlayabiliriz?',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        }
      ],
      reviews: []
    },
    {
      id: 'customer-request-2',
      customerId: 'customer-1',
      providerId: 'provider-profile-2',
      serviceId: null,
      title: 'Bebek Bakıcısı',
      description: '6 aylık bebeğim için deneyimli ve güvenilir bir bebek bakıcısı arıyorum.',
      status: RequestStatus.ACCEPTED,
      budget: 15000,
      location: 'Beşiktaş, İstanbul',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
      completedAt: null,
      customer: undefined,
      provider: {
        id: 'provider-profile-2',
        userId: 'provider-2',
        bio: null,
        rating: 4.9,
        totalJobs: 45,
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          id: 'provider-2',
          email: 'zeynep@example.com',
          name: 'Zeynep Kaya',
          phone: null,
          password: '',
          role: UserRole.PROVIDER,
          avatar: null,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      },
      service: null,
      messages: [
        {
          id: 'msg-cr-3',
          requestId: 'customer-request-2',
          senderId: 'provider-2',
          content: 'Bebek bakıcılığı konusunda deneyimliyim. Detayları konuşalım mı?',
          createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'msg-cr-4',
          requestId: 'customer-request-2',
          senderId: 'customer-1',
          content: 'Evet, lütfen. Referanslarınızı da görebilir miyim?',
          createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
        }
      ],
      reviews: []
    },
    {
      id: 'customer-request-3',
      customerId: 'customer-1',
      providerId: null,
      serviceId: null,
      title: 'Bahçe Düzenleme',
      description: '50m² bahçe için peyzaj ve düzenleme hizmeti.',
      status: RequestStatus.COMPLETED,
      budget: 5000,
      location: 'Ataşehir, İstanbul',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
      completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      customer: undefined,
      provider: undefined,
      service: undefined,
      messages: [],
      reviews: []
    }
  ],
  providerProfile: undefined,
  reviews: [
    {
      id: 'customer-review-1',
      requestId: 'customer-request-3',
      userId: 'customer-1',
      providerId: 'provider-profile-3',
      rating: 5,
      comment: 'Harika bir iş çıkardılar. Bahçem çok güzel oldu!',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
      user: undefined,
      request: {
        id: 'customer-request-3',
        customerId: 'customer-1',
        providerId: 'provider-profile-3',
        serviceId: null,
        title: 'Bahçe Düzenleme',
        description: '50m² bahçe için peyzaj ve düzenleme hizmeti.',
        status: RequestStatus.COMPLETED,
        budget: 5000,
        location: 'Ataşehir, İstanbul',
        createdAt: new Date(),
        updatedAt: new Date(),
        completedAt: new Date()
      },
      provider: undefined
    }
  ],
  messages: []
} as unknown as UserWithRelations

