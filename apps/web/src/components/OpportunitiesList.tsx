'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useOpportunitiesStore } from '@/store/useOpportunitiesStore'
import { useCategoriesStore } from '@/store/useCategoriesStore'
import { RequestStatus } from '@talepo/database'

export default function OpportunitiesList() {
  const { opportunities, fetchOpportunities, loading } = useOpportunitiesStore()
  const { categories, fetchCategories } = useCategoriesStore()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'newest' | 'budget-high' | 'budget-low'>('newest')

  useEffect(() => {
    fetchOpportunities({ status: RequestStatus.PENDING })
    fetchCategories()
  }, [fetchOpportunities, fetchCategories])

  // Dummy data for opportunities (fallback)
  const dummyOpportunities = [
    {
      id: '1',
      title: 'Ev Temizliği Hizmeti',
      description: '3+1 daire için haftalık temizlik hizmeti arıyorum. Düzenli olarak her hafta gelinmesini istiyorum.',
      budget: 2500,
      location: 'Kadıköy, İstanbul',
      category: 'Temizlik',
      customer: {
        name: 'Ayşe Yılmaz',
        avatar: null,
        rating: 4.8
      },
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 saat önce
      urgency: 'high',
      proposalsCount: 3
    },
    {
      id: '2',
      title: 'Bebek Bakıcısı',
      description: '6 aylık bebeğim için deneyimli ve güvenilir bir bebek bakıcısı arıyorum. Pazartesi-Cuma 09:00-17:00 saatleri arası.',
      budget: 15000,
      location: 'Beşiktaş, İstanbul',
      category: 'Bakım',
      customer: {
        name: 'Mehmet Demir',
        avatar: null,
        rating: 4.9
      },
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 saat önce
      urgency: 'medium',
      proposalsCount: 7
    },
    {
      id: '3',
      title: 'Elektrik Tesisat Tamiri',
      description: 'Evdeki elektrik prizlerinde sorun var. Acil müdahale gerekiyor. Profesyonel bir elektrikçi arıyorum.',
      budget: 800,
      location: 'Ümraniye, İstanbul',
      category: 'Tamir',
      customer: {
        name: 'Zeynep Kaya',
        avatar: null,
        rating: 4.7
      },
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 saat önce
      urgency: 'high',
      proposalsCount: 1
    },
    {
      id: '4',
      title: 'Bahçe Düzenleme',
      description: '50m² bahçe için peyzaj ve düzenleme hizmeti. Çim ekimi, çiçek dikimi ve sulama sistemi kurulumu.',
      budget: 5000,
      location: 'Ataşehir, İstanbul',
      category: 'Bahçıvanlık',
      customer: {
        name: 'Ali Çelik',
        avatar: null,
        rating: 5.0
      },
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 gün önce
      urgency: 'low',
      proposalsCount: 5
    },
    {
      id: '5',
      title: 'Özel Ders (Matematik)',
      description: 'Lise 2 öğrencisi için matematik özel dersi. Haftada 2 gün, 2 saat. Uzun vadeli çalışma planlanıyor.',
      budget: 2000,
      location: 'Şişli, İstanbul',
      category: 'Eğitim',
      customer: {
        name: 'Fatma Öz',
        avatar: null,
        rating: 4.6
      },
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 saat önce
      urgency: 'medium',
      proposalsCount: 2
    },
    {
      id: '6',
      title: 'Klima Bakımı ve Temizliği',
      description: '3 adet split klima için bakım ve temizlik hizmeti. Yıllık bakım sözleşmesi yapılabilir.',
      budget: 1200,
      location: 'Bakırköy, İstanbul',
      category: 'Tamir',
      customer: {
        name: 'Can Yücel',
        avatar: null,
        rating: 4.8
      },
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 saat önce
      urgency: 'low',
      proposalsCount: 4
    }
  ]

  // Categories listesi
  const categoryList = useMemo(() => {
    return ['all', ...categories.map(cat => cat.name)]
  }, [categories])

  // Opportunities'ı display formatına çevir
  const displayOpportunities = useMemo(() => {
    return opportunities.map((opp) => ({
      id: opp.id,
      title: opp.title,
      description: opp.description,
      budget: opp.budget || 0,
      location: opp.location || 'Konum belirtilmemiş',
      category: opp.service?.category?.name || 'Genel',
      customer: {
        name: opp.customer?.name || 'İsimsiz',
        avatar: opp.customer?.avatar || null,
        rating: 0 // Customer rating şu an yok
      },
      createdAt: new Date(opp.createdAt),
      urgency: 'medium' as const,
      proposalsCount: 0 // Bu bilgi şu an yok
    }))
  }, [opportunities])

  // Filter and sort opportunities
  const filteredOpportunities = useMemo(() => {
    const opps = displayOpportunities.length > 0 ? displayOpportunities : dummyOpportunities
    return opps
      .filter(opp => {
        const matchesCategory = selectedCategory === 'all' || opp.category === selectedCategory
        const matchesSearch = opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             opp.description.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return b.createdAt.getTime() - a.createdAt.getTime()
        if (sortBy === 'budget-high') return b.budget - a.budget
        if (sortBy === 'budget-low') return a.budget - b.budget
        return 0
      })
  }, [displayOpportunities, selectedCategory, searchQuery, sortBy])

  const formatTimeAgo = (date: Date | string) => {
    const now = new Date()
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)
    
    if (diffInSeconds < 60) return `${diffInSeconds} saniye önce`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} dakika önce`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} saat önce`
    return `${Math.floor(diffInSeconds / 86400)} gün önce`
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Fırsatlar yükleniyor...</p>
        </div>
      )}
      {!loading && (
        <>
          {/* Header */}
          <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Fırsatlar</h2>
            <p className="text-gray-600">Size uygun iş fırsatlarını keşfedin ve teklif verin</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold">
              {filteredOpportunities.length} Fırsat
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Fırsat ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
            {categoryList.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat === 'all' ? 'Tümü' : cat}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="newest">En Yeni</option>
            <option value="budget-high">Bütçe: Yüksekten Düşüğe</option>
            <option value="budget-low">Bütçe: Düşükten Yükseğe</option>
          </select>
        </div>
      </div>

      {/* Opportunities Grid */}
      {filteredOpportunities.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredOpportunities.map((opportunity) => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity} formatTimeAgo={formatTimeAgo} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <svg className="w-20 h-20 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Fırsat bulunamadı</h3>
          <p className="text-gray-600">Arama kriterlerinizi değiştirerek tekrar deneyin</p>
        </div>
      )}
        </>
      )}
    </div>
  )
}

// Opportunity Card Component
function OpportunityCard({ opportunity, formatTimeAgo }: { opportunity: any; formatTimeAgo: (date: Date | string) => string }) {
  const urgencyColors: Record<string, string> = {
    high: 'bg-red-100 text-red-700 border-red-200',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    low: 'bg-green-100 text-green-700 border-green-200'
  }

  const urgencyLabels: Record<string, string> = {
    high: 'Acil',
    medium: 'Normal',
    low: 'Düşük Öncelik'
  }

  return (
    <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Urgency Badge */}
      <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold border ${urgencyColors[opportunity.urgency] || urgencyColors.medium}`}>
        {urgencyLabels[opportunity.urgency] || urgencyLabels.medium}
      </div>

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 pr-8">
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {opportunity.title}
            </h3>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                {opportunity.category}
              </span>
              <span className="text-sm text-gray-500">{formatTimeAgo(opportunity.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-700 mb-4 line-clamp-3">{opportunity.description}</p>

        {/* Customer Info */}
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
            {opportunity.customer?.name?.[0] || 'U'}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">{opportunity.customer?.name || 'Müşteri'}</p>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.363 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm text-gray-600">{opportunity.customer?.rating || 0}</span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">Bütçe</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              {opportunity.budget.toLocaleString('tr-TR')} ₺
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm">{opportunity.location}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-sm">{opportunity.proposalsCount} teklif verildi</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            href={`/profil/firsatlar/${opportunity.id}`}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-center"
          >
            Teklif Ver
          </Link>
          <Link
            href={`/profil/firsatlar/${opportunity.id}`}
            className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Detaylar
          </Link>
        </div>
      </div>

      {/* Hover Effect Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all pointer-events-none" />
    </div>
  )
}

