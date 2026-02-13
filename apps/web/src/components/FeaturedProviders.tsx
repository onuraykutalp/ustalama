'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import ProviderCard from './ProviderCard'
import { useProvidersStore } from '@/store/useProvidersStore'

export default function FeaturedProviders() {
  const { featuredProviders, fetchFeaturedProviders, loading } = useProvidersStore()

  useEffect(() => {
    fetchFeaturedProviders()
  }, [fetchFeaturedProviders])

  const providers = featuredProviders.map((provider) => ({
    name: provider.user?.name || 'İsimsiz',
    profession: provider.services?.[0]?.title || 'Hizmet Sağlayıcı',
    rating: provider.rating,
    reviewCount: provider.reviews?.length || 0,
    location: 'Türkiye', // Location şu an schema'da yok, eklenebilir
    verified: provider.isVerified,
    href: `/hizmet-veren/${provider.id}`
  }))

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Öne Çıkan Hizmet Sağlayıcılar
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            En çok tercih edilen ve yüksek puanlı profesyoneller
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Hizmet sağlayıcılar yükleniyor...</p>
          </div>
        ) : providers.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {providers.map((provider) => (
                <ProviderCard key={provider.name} {...provider} />
              ))}
            </div>

            <div className="text-center mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/hizmet-verenler"
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Tüm Hizmet Sağlayıcıları Gör
              </Link>
              <Link
                href="/hizmet-verenler/premium"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 px-8 py-3 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all font-bold shadow-lg"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.363 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Premium Hizmet Verenler
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">Henüz hizmet sağlayıcı bulunmuyor</p>
          </div>
        )}
      </div>
    </section>
  )
}

