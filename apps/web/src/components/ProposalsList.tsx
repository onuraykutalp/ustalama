'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useProposalsStore } from '@/store/useProposalsStore'
import { RequestStatus } from '@talepo/database'

export default function ProposalsList() {
  const { proposals, fetchProposals, loading } = useProposalsStore()
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'price-high' | 'price-low'>('newest')

  useEffect(() => {
    fetchProposals()
  }, [fetchProposals])

  // Dummy data for proposals (fallback)
  const dummyProposals = [
    {
      id: '1',
      opportunityId: '1',
      opportunityTitle: 'Ev Temizliği Hizmeti',
      customerName: 'Ayşe Yılmaz',
      customerAvatar: null,
      price: 2500,
      estimatedDays: 7,
      message: 'Merhaba, bu iş için 7 yıllık deneyimim var. Çevre dostu ürünler kullanıyorum ve referanslarımı paylaşabilirim. Haftalık düzenli temizlik hizmeti sunuyorum.',
      status: 'pending',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      location: 'Kadıköy, İstanbul',
      category: 'Temizlik',
      opportunityBudget: 2500
    },
    {
      id: '2',
      opportunityId: '2',
      opportunityTitle: 'Bebek Bakıcısı',
      customerName: 'Mehmet Demir',
      customerAvatar: null,
      price: 15000,
      estimatedDays: 30,
      message: '6 yıllık bebek bakıcılığı deneyimim var. İlk yardım sertifikam mevcut ve referanslarımı paylaşabilirim. Sabırlı ve sevecen biriyim.',
      status: 'accepted',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      location: 'Beşiktaş, İstanbul',
      category: 'Bakım',
      opportunityBudget: 15000
    },
    {
      id: '3',
      opportunityId: '3',
      opportunityTitle: 'Elektrik Tesisat Tamiri',
      customerName: 'Zeynep Kaya',
      customerAvatar: null,
      price: 800,
      estimatedDays: 1,
      message: 'Lisanslı elektrikçiyim, 10 yıllık deneyimim var. Acil müdahale yapabilirim. Bugün içinde gelebilirim.',
      status: 'rejected',
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      location: 'Ümraniye, İstanbul',
      category: 'Tamir',
      opportunityBudget: 800
    },
    {
      id: '4',
      opportunityId: '4',
      opportunityTitle: 'Bahçe Düzenleme',
      customerName: 'Ali Çelik',
      customerAvatar: null,
      price: 5000,
      estimatedDays: 14,
      message: 'Peyzaj mimarıyım, 8 yıllık deneyimim var. Sulama sistemi kurulumu konusunda uzmanım. Referanslarımı paylaşabilirim.',
      status: 'pending',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      location: 'Ataşehir, İstanbul',
      category: 'Bahçıvanlık',
      opportunityBudget: 5000
    },
    {
      id: '5',
      opportunityId: '5',
      opportunityTitle: 'Özel Ders (Matematik)',
      customerName: 'Fatma Öz',
      customerAvatar: null,
      price: 2000,
      estimatedDays: 90,
      message: 'Matematik öğretmeniyim, 12 yıllık deneyimim var. Lise müfredatına hakimim ve öğrencilerle iyi iletişim kurabiliyorum.',
      status: 'accepted',
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      location: 'Şişli, İstanbul',
      category: 'Eğitim',
      opportunityBudget: 2000
    },
    {
      id: '6',
      opportunityId: '6',
      opportunityTitle: 'Klima Bakımı ve Temizliği',
      customerName: 'Can Yücel',
      customerAvatar: null,
      price: 1200,
      estimatedDays: 3,
      message: 'Klima servis teknisyeniyim, sertifikalıyım. 3 adet klimanın bakımını yapabilirim. Garanti veriyorum.',
      status: 'withdrawn',
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      location: 'Bakırköy, İstanbul',
      category: 'Tamir',
      opportunityBudget: 1200
    }
  ]

  // Proposals'ı display formatına çevir
  const displayProposals = useMemo(() => {
    return proposals.map((proposal) => ({
      id: proposal.id,
      opportunityId: proposal.id,
      opportunityTitle: proposal.title,
      customerName: proposal.customer?.name || 'İsimsiz',
      customerAvatar: proposal.customer?.avatar || null,
      price: proposal.budget || 0,
      estimatedDays: 7, // Bu bilgi şu an yok
      message: proposal.description || '',
      status: proposal.status.toLowerCase(),
      createdAt: new Date(proposal.createdAt),
      location: proposal.location || 'Konum belirtilmemiş',
      category: proposal.service?.category?.name || 'Genel',
      opportunityBudget: proposal.budget || 0
    }))
  }, [proposals])

  // Filter and sort proposals
  const filteredProposals = useMemo(() => {
    const props = displayProposals.length > 0 ? displayProposals : dummyProposals
    return props
      .filter(proposal => {
        const matchesStatus = selectedStatus === 'all' || proposal.status === selectedStatus
        const matchesSearch = proposal.opportunityTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             proposal.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             proposal.message.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesStatus && matchesSearch
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return b.createdAt.getTime() - a.createdAt.getTime()
        if (sortBy === 'oldest') return a.createdAt.getTime() - b.createdAt.getTime()
        if (sortBy === 'price-high') return b.price - a.price
        if (sortBy === 'price-low') return a.price - b.price
        return 0
      })
  }, [displayProposals, selectedStatus, searchQuery, sortBy])

  const formatTimeAgo = (date: Date | string) => {
    const now = new Date()
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)
    
    if (diffInSeconds < 60) return `${diffInSeconds} saniye önce`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} dakika önce`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} saat önce`
    return `${Math.floor(diffInSeconds / 86400)} gün önce`
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    accepted: 'bg-green-100 text-green-700 border-green-200',
    rejected: 'bg-red-100 text-red-700 border-red-200',
    withdrawn: 'bg-gray-100 text-gray-700 border-gray-200'
  }

  const statusLabels: Record<string, string> = {
    pending: 'Beklemede',
    accepted: 'Kabul Edildi',
    rejected: 'Reddedildi',
    withdrawn: 'Geri Çekildi'
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Teklifler yükleniyor...</p>
        </div>
      )}
      {!loading && (
        <>
          {/* Header */}
          <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Tekliflerim</h2>
            <p className="text-gray-600">Verdiğiniz tekliflerin durumunu takip edin</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold">
              {filteredProposals.length} Teklif
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Teklif ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
            {['all', 'pending', 'accepted', 'rejected', 'withdrawn'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  selectedStatus === status
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? 'Tümü' : statusLabels[status]}
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
            <option value="oldest">En Eski</option>
            <option value="price-high">Fiyat: Yüksekten Düşüğe</option>
            <option value="price-low">Fiyat: Düşükten Yükseğe</option>
          </select>
        </div>
      </div>

      {/* Proposals Grid */}
      {filteredProposals.length > 0 ? (
        <div className="space-y-4">
          {filteredProposals.map((proposal) => (
            <ProposalCard key={proposal.id} proposal={proposal} formatTimeAgo={formatTimeAgo} statusColors={statusColors} statusLabels={statusLabels} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <svg className="w-20 h-20 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Teklif bulunamadı</h3>
          <p className="text-gray-600">Arama kriterlerinizi değiştirerek tekrar deneyin</p>
        </div>
      )}
        </>
      )}
    </div>
  )
}

// Proposal Card Component
function ProposalCard({ 
  proposal, 
  formatTimeAgo, 
  statusColors, 
  statusLabels 
}: { 
  proposal: any
  formatTimeAgo: (date: Date | string) => string
  statusColors: Record<string, string>
  statusLabels: Record<string, string>
}) {
  return (
    <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[proposal.status] || statusColors.pending}`}>
                {statusLabels[proposal.status] || statusLabels.pending}
              </span>
              <span className="text-sm text-gray-500">{formatTimeAgo(proposal.createdAt)}</span>
            </div>
            <Link
              href={`/profil/firsatlar/${proposal.opportunityId}`}
              className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors block"
            >
              {proposal.opportunityTitle}
            </Link>
            <div className="flex items-center gap-4 text-gray-600 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{proposal.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                  {proposal.category}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
            {proposal.customerAvatar ? (
              <img src={proposal.customerAvatar} alt={proposal.customerName} className="w-full h-full rounded-full object-cover" />
            ) : (
              <span>{proposal.customerName[0]}</span>
            )}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">{proposal.customerName}</p>
            <p className="text-sm text-gray-500">Müşteri</p>
          </div>
        </div>

        {/* Proposal Details */}
        <div className="mb-4">
          <p className="text-gray-700 mb-3 line-clamp-2">{proposal.message}</p>
        </div>

        {/* Price and Duration */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Teklif Fiyatı</p>
            <p className="text-lg font-bold text-blue-600">{proposal.price.toLocaleString('tr-TR')} ₺</p>
            {proposal.opportunityBudget && (
              <p className="text-xs text-gray-500 mt-1">
                Bütçe: {proposal.opportunityBudget.toLocaleString('tr-TR')} ₺
              </p>
            )}
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Tahmini Süre</p>
            <p className="text-lg font-bold text-purple-600">{proposal.estimatedDays} Gün</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            href={`/profil/firsatlar/${proposal.opportunityId}`}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center"
          >
            Fırsatı Görüntüle
          </Link>
          {proposal.status === 'pending' && (
            <button
              className="px-4 py-2 border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors"
              onClick={() => {
                if (confirm('Bu teklifi geri çekmek istediğinizden emin misiniz?')) {
                  alert('Teklif geri çekildi')
                }
              }}
            >
              Geri Çek
            </button>
          )}
        </div>
      </div>

      {/* Hover Effect Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all pointer-events-none" />
    </div>
  )
}

