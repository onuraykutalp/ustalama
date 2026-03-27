'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface Service {
  id: string
  title: string
  description: string | null
  price: number | null
  priceType: string
  provider: {
    id: string
    bio: string | null
    rating: number
    completedJobs: number
    user: {
      id: string
      name: string | null
      avatar: string | null
      isPremium: boolean
    }
  }
}

interface CategoryDetail {
  id: string
  name: string
  slug: string
  icon: string | null
  description: string | null
  services: Service[]
}

export default function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string }
}) {
  const router = useRouter()
  const [category, setCategory] = useState<CategoryDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'jobs'>('rating')
  const [slug, setSlug] = useState<string>('')

  useEffect(() => {
    Promise.resolve(params).then((p) => setSlug(p.slug))
  }, [params])

  useEffect(() => {
    if (!slug) return
    const fetchCategory = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/categories?slug=${slug}`)
        if (!res.ok) {
          if (res.status === 404) {
            setError('Kategori bulunamadı')
          } else {
            setError('Bir hata oluştu')
          }
          return
        }
        const data = await res.json()
        setCategory(data.data)
      } catch {
        setError('Bağlantı hatası')
      } finally {
        setLoading(false)
      }
    }
    fetchCategory()
  }, [slug])

  const filteredServices = category?.services
    ?.filter((service) => {
      if (!searchQuery.trim()) return true
      const q = searchQuery.toLowerCase()
      return (
        service.title.toLowerCase().includes(q) ||
        service.description?.toLowerCase().includes(q) ||
        service.provider.user.name?.toLowerCase().includes(q)
      )
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.provider.rating - a.provider.rating
      if (sortBy === 'price') return (a.price || 0) - (b.price || 0)
      if (sortBy === 'jobs') return b.provider.completedJobs - a.provider.completedJobs
      return 0
    }) || []

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Yükleniyor...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !category) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{error || 'Kategori bulunamadı'}</h2>
            <p className="text-gray-600 mb-6">Bu kategori mevcut değil veya kaldırılmış olabilir.</p>
            <Link href="/categories" className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium">
              Tüm Kategoriler
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 pt-20 pb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-white/70 text-sm mb-4">
              <Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
              <span>/</span>
              <Link href="/categories" className="hover:text-white transition-colors">Kategoriler</Link>
              <span>/</span>
              <span className="text-white">{category.name}</span>
            </div>

            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-4xl">
                {category.icon || '📦'}
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">{category.name}</h1>
                {category.description && (
                  <p className="text-white/80 text-lg">{category.description}</p>
                )}
                <p className="text-white/60 mt-1">{category.services.length} hizmet sağlayıcı</p>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative w-full sm:w-96">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Hizmet veya sağlayıcı ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sırala:</span>
                {[
                  { key: 'rating' as const, label: 'Puan' },
                  { key: 'price' as const, label: 'Fiyat' },
                  { key: 'jobs' as const, label: 'Deneyim' },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setSortBy(opt.key)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      sortBy === opt.key
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Services List */}
        <section className="py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {filteredServices.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Hizmet bulunamadı</h3>
                <p className="text-gray-600">
                  {searchQuery ? 'Farklı bir arama terimi deneyin.' : 'Bu kategoride henüz hizmet sağlayıcı bulunmuyor.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((service) => (
                  <div
                    key={service.id}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 overflow-hidden group"
                  >
                    {/* Provider Header */}
                    <div className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="relative">
                          {service.provider.user.avatar ? (
                            <img
                              src={service.provider.user.avatar}
                              alt={service.provider.user.name || ''}
                              className="w-14 h-14 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                              {service.provider.user.name?.charAt(0) || '?'}
                            </div>
                          )}
                          {service.provider.user.isPremium && (
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                              <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.363 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                            {service.provider.user.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.363 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span className="text-sm font-semibold text-gray-700">{service.provider.rating.toFixed(1)}</span>
                            </div>
                            <span className="text-gray-300">|</span>
                            <span className="text-sm text-gray-500">{service.provider.completedJobs} iş</span>
                          </div>
                        </div>
                      </div>

                      {/* Service Info */}
                      <h4 className="font-semibold text-gray-900 mb-2">{service.title}</h4>
                      {service.description && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-4">{service.description}</p>
                      )}

                      {/* Price & CTA */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        {service.price ? (
                          <div>
                            <span className="text-2xl font-bold text-blue-600">{service.price.toLocaleString('tr-TR')}</span>
                            <span className="text-gray-500 text-sm ml-1">
                              ₺{service.priceType === 'HOURLY' ? '/saat' : service.priceType === 'DAILY' ? '/gün' : ''}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">Fiyat bilgisi yok</span>
                        )}
                        <Link
                          href={`/profil/firsatlar/${service.id}`}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                        >
                          Teklif Al
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
