'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
// Static export - no auth store

// Dummy premium providers data - API'den gelecek
const dummyPremiumProviders = [
  {
    id: '1',
    name: 'Ahmet Yılmaz',
    profession: 'Temizlik Uzmanı',
    bio: '10 yıllık deneyimli temizlik uzmanı. Ev ve ofis temizliği konusunda uzmanım.',
    rating: 4.9,
    reviewCount: 127,
    location: 'İstanbul, Kadıköy',
    avatar: null,
    verified: true,
    isPremium: true,
    hourlyRate: 150,
    totalJobs: 245,
    categories: ['Temizlik', 'Ofis Temizliği'],
    responseTime: '1 saat içinde',
    languages: ['Türkçe', 'İngilizce']
  },
  {
    id: '2',
    name: 'Mehmet Demir',
    profession: 'Elektrikçi',
    bio: 'Lisanslı elektrikçi. Tüm elektrik işleri için profesyonel hizmet.',
    rating: 4.8,
    reviewCount: 89,
    location: 'Ankara, Çankaya',
    avatar: null,
    verified: true,
    isPremium: true,
    hourlyRate: 200,
    totalJobs: 156,
    categories: ['Elektrik', 'Tamir'],
    responseTime: '2 saat içinde',
    languages: ['Türkçe']
  },
  {
    id: '3',
    name: 'Ayşe Kaya',
    profession: 'Özel Ders Öğretmeni',
    bio: 'Matematik ve Fizik öğretmeni. Lise ve üniversite hazırlık dersleri.',
    rating: 5.0,
    reviewCount: 45,
    location: 'İzmir, Konak',
    avatar: null,
    verified: true,
    isPremium: true,
    hourlyRate: 250,
    totalJobs: 78,
    categories: ['Eğitim', 'Matematik', 'Fizik'],
    responseTime: '30 dakika içinde',
    languages: ['Türkçe', 'İngilizce']
  },
  {
    id: '4',
    name: 'Can Özkan',
    profession: 'Nakliyeci',
    bio: 'Profesyonel nakliye hizmeti. Ev ve ofis taşımacılığı.',
    rating: 4.7,
    reviewCount: 203,
    location: 'Bursa, Nilüfer',
    avatar: null,
    verified: true,
    isPremium: true,
    hourlyRate: 300,
    totalJobs: 312,
    categories: ['Nakliyat', 'Taşımacılık'],
    responseTime: '3 saat içinde',
    languages: ['Türkçe']
  },
  {
    id: '5',
    name: 'Zeynep Yıldız',
    profession: 'Bebek Bakıcısı',
    bio: 'Deneyimli bebek bakıcısı. İlk yardım sertifikalı, referanslı.',
    rating: 4.9,
    reviewCount: 67,
    location: 'İstanbul, Beşiktaş',
    avatar: null,
    verified: true,
    isPremium: true,
    hourlyRate: 180,
    totalJobs: 134,
    categories: ['Bakım', 'Bebek Bakımı'],
    responseTime: '1 saat içinde',
    languages: ['Türkçe', 'İngilizce']
  },
  {
    id: '6',
    name: 'Ali Çelik',
    profession: 'Bahçıvan',
    bio: 'Peyzaj ve bahçe düzenleme uzmanı. Sulama sistemi kurulumu.',
    rating: 4.6,
    reviewCount: 92,
    location: 'Ataşehir, İstanbul',
    avatar: null,
    verified: true,
    isPremium: true,
    hourlyRate: 120,
    totalJobs: 189,
    categories: ['Bahçıvanlık', 'Peyzaj'],
    responseTime: '4 saat içinde',
    languages: ['Türkçe']
  },
  {
    id: '7',
    name: 'Fatma Öz',
    profession: 'Klima Servisi',
    bio: 'Klima bakım ve tamir hizmeti. Split ve merkezi klima sistemleri.',
    rating: 4.8,
    reviewCount: 145,
    location: 'Bakırköy, İstanbul',
    avatar: null,
    verified: true,
    isPremium: true,
    hourlyRate: 175,
    totalJobs: 267,
    categories: ['Tamir', 'Klima'],
    responseTime: '2 saat içinde',
    languages: ['Türkçe']
  },
  {
    id: '8',
    name: 'Emre Şahin',
    profession: 'IT Destek',
    bio: 'Bilgisayar ve yazılım desteği. Kurulum, tamir ve danışmanlık.',
    rating: 4.9,
    reviewCount: 98,
    location: 'Şişli, İstanbul',
    avatar: null,
    verified: true,
    isPremium: true,
    hourlyRate: 220,
    totalJobs: 178,
    categories: ['Teknoloji', 'IT Destek'],
    responseTime: '1 saat içinde',
    languages: ['Türkçe', 'İngilizce']
  }
]

type SortOption = 'rating' | 'price-low' | 'price-high' | 'jobs' | 'reviews'

export default function PremiumProvidersPage() {
  const router = useRouter()
  // Static export - no authentication
  const isAuthenticated = false
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<SortOption>('rating')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500])

  // Get unique categories from providers
  const categories = useMemo(() => {
    const cats = new Set<string>()
    dummyPremiumProviders.forEach(provider => {
      provider.categories.forEach(cat => cats.add(cat))
    })
    return Array.from(cats).sort()
  }, [])

  // Filter and sort providers
  const filteredProviders = useMemo(() => {
    let filtered = dummyPremiumProviders.filter(provider => {
      const matchesSearch = 
        provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.profession.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesCategory = selectedCategory === 'all' || provider.categories.includes(selectedCategory)
      const matchesPrice = provider.hourlyRate >= priceRange[0] && provider.hourlyRate <= priceRange[1]

      return matchesSearch && matchesCategory && matchesPrice
    })

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'price-low':
          return a.hourlyRate - b.hourlyRate
        case 'price-high':
          return b.hourlyRate - a.hourlyRate
        case 'jobs':
          return b.totalJobs - a.totalJobs
        case 'reviews':
          return b.reviewCount - a.reviewCount
        default:
          return 0
      }
    })

    return filtered
  }, [searchQuery, selectedCategory, sortBy, priceRange])

  const handleContact = (providerId: string) => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/hizmet-verenler/premium')
      return
    }
    // Navigate to messaging or create a request
    router.push(`/profil/mesajlar?provider=${providerId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Ana Sayfaya Dön
            </Link>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 rounded-full text-xs font-bold">
                PREMIUM
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 rounded-full font-bold mb-4">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.363 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Premium Hizmet Sağlayıcılar
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            En İyi <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Profesyoneller</span> ile Tanışın
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Premium üyeliğe sahip, deneyimli ve güvenilir hizmet sağlayıcılarımızla ihtiyacınız olan hizmeti bulun
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-black mb-2">Ara</label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="İsim, meslek veya kategori ara..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              >
                <option value="all">Tümü</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sırala</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              >
                <option value="rating">En Yüksek Puan</option>
                <option value="price-low">En Düşük Fiyat</option>
                <option value="price-high">En Yüksek Fiyat</option>
                <option value="jobs">En Çok İş</option>
                <option value="reviews">En Çok Yorum</option>
              </select>
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Saatlik Ücret: {priceRange[0]}₺ - {priceRange[1]}₺
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="500"
                step="10"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                className="flex-1"
              />
              <input
                type="range"
                min="0"
                max="500"
                step="10"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="flex-1"
              />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            <span className="font-semibold text-gray-900">{filteredProviders.length}</span> premium hizmet sağlayıcı bulundu
          </p>
        </div>

        {/* Providers Grid */}
        {filteredProviders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders.map(provider => (
              <PremiumProviderCard
                key={provider.id}
                provider={provider}
                onContact={() => handleContact(provider.id)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Sonuç bulunamadı</h3>
            <p className="text-gray-600 mb-4">Arama kriterlerinizi değiştirerek tekrar deneyin</p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
                setPriceRange([0, 500])
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Filtreleri Temizle
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Premium Provider Card Component
function PremiumProviderCard({ 
  provider, 
  onContact 
}: { 
  provider: typeof dummyPremiumProviders[0]
  onContact: () => void 
}) {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-blue-200 group">
      {/* Premium Badge */}
      <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 px-4 py-2 text-center">
        <div className="flex items-center justify-center gap-2">
          <svg className="w-5 h-5 text-yellow-900" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.363 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-yellow-900 font-bold text-sm">PREMIUM ÜYE</span>
        </div>
      </div>

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
              {provider.avatar || provider.name[0].toUpperCase()}
            </div>
            {provider.verified && (
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1.5 shadow-lg">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
              {provider.name}
            </h3>
            <p className="text-sm text-gray-600 font-medium mb-2">{provider.profession}</p>
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(provider.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.363 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-sm font-semibold text-gray-900 ml-1">{provider.rating.toFixed(1)}</span>
              <span className="text-sm text-gray-500">({provider.reviewCount})</span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{provider.bio}</p>

        {/* Hourly Rate - Highlighted */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-4 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Saatlik Ücret</p>
              <p className="text-2xl font-bold text-blue-600">{provider.hourlyRate} ₺</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-600 mb-1">Toplam İş</p>
              <p className="text-lg font-semibold text-gray-900">{provider.totalJobs}</p>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{provider.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{provider.responseTime}</span>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-4">
          {provider.categories.slice(0, 3).map(category => (
            <span
              key={category}
              className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
            >
              {category}
            </span>
          ))}
          {provider.categories.length > 3 && (
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
              +{provider.categories.length - 3}
            </span>
          )}
        </div>

        {/* Languages */}
        {provider.languages.length > 0 && (
          <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <span>{provider.languages.join(', ')}</span>
          </div>
        )}

        {/* Contact Button */}
        <button
          onClick={onContact}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
        >
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          İletişime Geç
        </button>
      </div>
    </div>
  )
}

