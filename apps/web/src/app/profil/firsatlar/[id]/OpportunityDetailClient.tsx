'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// Dummy data - API'den gelecek
const dummyOpportunities: Record<string, any> = {
  '1': {
    id: '1',
    title: 'Ev Temizliği Hizmeti',
    description: '3+1 daire için haftalık temizlik hizmeti arıyorum. Düzenli olarak her hafta gelinmesini istiyorum. Evin genel temizliği, camlar, banyo ve mutfak dahil. Mümkünse çevre dostu temizlik ürünleri kullanılmasını tercih ederim.',
    fullDescription: `3+1 daire için haftalık temizlik hizmeti arıyorum. Düzenli olarak her hafta gelinmesini istiyorum.

Detaylar:
- Genel ev temizliği (toz alma, yer süpürme, paspas)
- Cam temizliği (tüm pencereler)
- Banyo temizliği (duşakabin, lavabo, klozet)
- Mutfak temizliği (tezgah, ocak, buzdolabı dışı)
- Çevre dostu temizlik ürünleri tercih edilir
- Haftalık 3-4 saat sürmesi bekleniyor
- Uzun vadeli çalışma planlanıyor`,
    budget: 2500,
    location: 'Kadıköy, İstanbul',
    category: 'Temizlik',
    customer: {
      name: 'Ayşe Yılmaz',
      avatar: null,
      rating: 4.8,
      totalReviews: 12,
      memberSince: '2023',
      phone: '+90 555 123 4567',
      verified: true
    },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    urgency: 'high',
    proposalsCount: 3,
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    requirements: [
      'Deneyimli temizlik personeli',
      'Referans gösterebilme',
      'Çevre dostu ürünler kullanımı',
      'Sigorta'
    ]
  },
  '2': {
    id: '2',
    title: 'Bebek Bakıcısı',
    description: '6 aylık bebeğim için deneyimli ve güvenilir bir bebek bakıcısı arıyorum. Pazartesi-Cuma 09:00-17:00 saatleri arası.',
    fullDescription: `6 aylık bebeğim için deneyimli ve güvenilir bir bebek bakıcısı arıyorum.

Çalışma Saatleri:
- Pazartesi - Cuma: 09:00 - 17:00
- Haftalık 40 saat

Görevler:
- Bebek bakımı ve beslenmesi
- Uyku düzeni takibi
- Oyun ve aktivite zamanı
- Temizlik (bebek odası ve eşyaları)
- Günlük rapor tutma

Gereksinimler:
- Bebek bakımı deneyimi
- İlk yardım sertifikası
- Referans
- Sabırlı ve sevecen`,
    budget: 15000,
    location: 'Beşiktaş, İstanbul',
    category: 'Bakım',
    customer: {
      name: 'Mehmet Demir',
      avatar: null,
      rating: 4.9,
      totalReviews: 8,
      memberSince: '2022',
      phone: '+90 555 234 5678',
      verified: true
    },
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    urgency: 'medium',
    proposalsCount: 7,
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    requirements: [
      'Bebek bakımı deneyimi (min 2 yıl)',
      'İlk yardım sertifikası',
      'Referans gösterebilme',
      'Sabırlı ve sevecen kişilik'
    ]
  },
  '3': {
    id: '3',
    title: 'Elektrik Tesisat Tamiri',
    description: 'Evdeki elektrik prizlerinde sorun var. Acil müdahale gerekiyor. Profesyonel bir elektrikçi arıyorum.',
    fullDescription: `Evdeki elektrik prizlerinde sorun var. Acil müdahale gerekiyor.

Sorun:
- Oturma odasında 2 priz çalışmıyor
- Yatak odasında 1 priz çalışmıyor
- Elektrik kesintisi yok, sadece prizler

Acil durum, mümkünse bugün içinde müdahale edilmesi gerekiyor.`,
    budget: 800,
    location: 'Ümraniye, İstanbul',
    category: 'Tamir',
    customer: {
      name: 'Zeynep Kaya',
      avatar: null,
      rating: 4.7,
      totalReviews: 15,
      memberSince: '2021',
      phone: '+90 555 345 6789',
      verified: false
    },
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    urgency: 'high',
    proposalsCount: 1,
    deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    requirements: [
      'Lisanslı elektrikçi',
      'Acil müdahale yapabilme',
      'Garanti'
    ]
  },
  '4': {
    id: '4',
    title: 'Bahçe Düzenleme',
    description: '50m² bahçe için peyzaj ve düzenleme hizmeti. Çim ekimi, çiçek dikimi ve sulama sistemi kurulumu.',
    fullDescription: `50m² bahçe için peyzaj ve düzenleme hizmeti arıyorum.

İşler:
- Mevcut çimlerin temizlenmesi
- Yeni çim ekimi
- Çiçek dikimi (mevsimlik)
- Sulama sistemi kurulumu
- Bahçe yolu düzenlemesi

Bahçe şu anda bakımsız durumda, tam bir yenileme gerekiyor.`,
    budget: 5000,
    location: 'Ataşehir, İstanbul',
    category: 'Bahçıvanlık',
    customer: {
      name: 'Ali Çelik',
      avatar: null,
      rating: 5.0,
      totalReviews: 20,
      memberSince: '2020',
      phone: '+90 555 456 7890',
      verified: true
    },
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    urgency: 'low',
    proposalsCount: 5,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    requirements: [
      'Peyzaj deneyimi',
      'Sulama sistemi kurulum bilgisi',
      'Referans'
    ]
  },
  '5': {
    id: '5',
    title: 'Özel Ders (Matematik)',
    description: 'Lise 2 öğrencisi için matematik özel dersi. Haftada 2 gün, 2 saat. Uzun vadeli çalışma planlanıyor.',
    fullDescription: `Lise 2 öğrencisi için matematik özel dersi arıyorum.

Detaylar:
- Haftada 2 gün (Pazartesi ve Çarşamba)
- Her ders 2 saat
- Lise 2 müfredatı
- Uzun vadeli çalışma (en az 3 ay)
- Evde ders verilmesi tercih edilir

Öğrenci matematikte zorlanıyor, sabırlı ve anlayışlı bir öğretmen arıyoruz.`,
    budget: 2000,
    location: 'Şişli, İstanbul',
    category: 'Eğitim',
    customer: {
      name: 'Fatma Öz',
      avatar: null,
      rating: 4.6,
      totalReviews: 5,
      memberSince: '2023',
      phone: '+90 555 567 8901',
      verified: false
    },
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    urgency: 'medium',
    proposalsCount: 2,
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    requirements: [
      'Matematik öğretmeni veya üniversite öğrencisi',
      'Lise müfredatına hakim',
      'Sabırlı ve anlayışlı',
      'Referans'
    ]
  },
  '6': {
    id: '6',
    title: 'Klima Bakımı ve Temizliği',
    description: '3 adet split klima için bakım ve temizlik hizmeti. Yıllık bakım sözleşmesi yapılabilir.',
    fullDescription: `3 adet split klima için bakım ve temizlik hizmeti arıyorum.

İşler:
- 3 adet split klima temizliği
- Filtre değişimi
- Gaz kontrolü
- Genel bakım

Yıllık bakım sözleşmesi yapılabilir. Düzenli olarak yılda 2-3 kez bakım yapılması planlanıyor.`,
    budget: 1200,
    location: 'Bakırköy, İstanbul',
    category: 'Tamir',
    customer: {
      name: 'Can Yücel',
      avatar: null,
      rating: 4.8,
      totalReviews: 10,
      memberSince: '2022',
      phone: '+90 555 678 9012',
      verified: true
    },
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    urgency: 'low',
    proposalsCount: 4,
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    requirements: [
      'Klima servis deneyimi',
      'Sertifikalı teknisyen',
      'Garanti',
      'Referans'
    ]
  }
}

export default function OpportunityDetailClient({ id }: { id: string }) {
  const router = useRouter()
  const [opportunity, setOpportunity] = useState<any>(null)
  const [showProposalForm, setShowProposalForm] = useState(true) // Varsayılan olarak açık
  const [proposalData, setProposalData] = useState({
    price: '',
    message: '',
    estimatedDays: '',
    isProcessing: false
  })

  useEffect(() => {
    // Simulate API call
    const opp = dummyOpportunities[id]
    if (opp) {
      setOpportunity(opp)
    }
  }, [id])

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return `${diffInSeconds} saniye önce`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} dakika önce`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} saat önce`
    return `${Math.floor(diffInSeconds / 86400)} gün önce`
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!proposalData.price || !proposalData.message || !proposalData.estimatedDays) {
      alert('Lütfen tüm alanları doldurun!')
      return
    }

    setProposalData({ ...proposalData, isProcessing: true })
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setProposalData({
      price: '',
      message: '',
      estimatedDays: '',
      isProcessing: false
    })
    setShowProposalForm(false)
    alert('Teklifiniz başarıyla gönderildi! Müşteriye bildirim gönderildi.')
  }

  if (!opportunity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Yükleniyor...</p>
        </div>
      </div>
    )
  }

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/profil"
            className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Fırsatlar Listesine Dön
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Opportunity Header */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 h-24"></div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {opportunity.category}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${urgencyColors[opportunity.urgency] || urgencyColors.medium}`}>
                        {urgencyLabels[opportunity.urgency] || urgencyLabels.medium}
                      </span>
                      <span className="text-sm text-gray-500">{formatTimeAgo(opportunity.createdAt)}</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">{opportunity.title}</h1>
                    <div className="flex items-center gap-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{opportunity.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>{opportunity.proposalsCount} teklif verildi</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">İş Detayları</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {opportunity.fullDescription || opportunity.description}
                </p>
              </div>
            </div>

            {/* Requirements */}
            {opportunity.requirements && opportunity.requirements.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Gereksinimler</h2>
                <ul className="space-y-2">
                  {opportunity.requirements.map((req: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Proposal Form */}
            {showProposalForm && (
              <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-200">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Teklif Ver</h2>
                    <p className="text-sm text-gray-600 mt-1">Müşteriye teklifinizi gönderin</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowProposalForm(false)
                      setProposalData({
                        price: '',
                        message: '',
                        estimatedDays: '',
                        isProcessing: false
                      })
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Budget Comparison */}
                {opportunity.budget && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Müşteri Bütçesi</p>
                        <p className="text-2xl font-bold text-blue-600">{opportunity.budget.toLocaleString('tr-TR')} ₺</p>
                      </div>
                      {proposalData.price && parseFloat(proposalData.price) > 0 && (
                        <div className="text-right">
                          <p className="text-sm text-gray-600 mb-1">Teklifiniz</p>
                          <p className={`text-2xl font-bold ${
                            parseFloat(proposalData.price) <= opportunity.budget 
                              ? 'text-green-600' 
                              : 'text-orange-600'
                          }`}>
                            {parseFloat(proposalData.price).toLocaleString('tr-TR')} ₺
                          </p>
                          {parseFloat(proposalData.price) > opportunity.budget && (
                            <p className="text-xs text-orange-600 mt-1">
                              Bütçeden {((parseFloat(proposalData.price) - opportunity.budget) / opportunity.budget * 100).toFixed(0)}% fazla
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmitProposal} className="space-y-5">
                  {/* Price Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teklif Fiyatı (₺) *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={proposalData.price}
                        onChange={(e) => setProposalData({ ...proposalData, price: e.target.value })}
                        className="w-full px-4 py-3 pl-12 text-lg font-semibold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        required
                      />
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                        ₺
                      </span>
                    </div>
                    {opportunity.budget && proposalData.price && parseFloat(proposalData.price) > 0 && (
                      <div className="mt-2">
                        {parseFloat(proposalData.price) <= opportunity.budget ? (
                          <div className="flex items-center gap-2 text-sm text-green-600">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Bütçe içinde</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-sm text-orange-600">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span>Bütçeyi aşıyor</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Estimated Days */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tahmini Süre *
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        value={proposalData.estimatedDays}
                        onChange={(e) => setProposalData({ ...proposalData, estimatedDays: e.target.value })}
                        className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Örn: 7"
                        min="1"
                        required
                      />
                      <span className="text-gray-600 font-medium whitespace-nowrap">Gün</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">İşin tamamlanması için tahmini süre</p>
                  </div>

                  {/* Message Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Müşteriye Mesajınız *
                    </label>
                    <textarea
                      value={proposalData.message}
                      onChange={(e) => {
                        const value = e.target.value
                        if (value.length <= 1000) {
                          setProposalData({ ...proposalData, message: value })
                        }
                      }}
                      rows={6}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                      placeholder="Müşteriye neden sizi seçmeleri gerektiğini açıklayın. Deneyimleriniz, referanslarınız ve yaklaşımınız hakkında bilgi verin..."
                      required
                      maxLength={1000}
                    />
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-gray-500">
                        Müşteri bu mesajı görecek ve karar vermesinde etkili olacaktır
                      </p>
                      <span className={`text-xs font-medium ${
                        proposalData.message.length > 900 
                          ? 'text-orange-600' 
                          : proposalData.message.length > 500
                          ? 'text-gray-600'
                          : 'text-gray-400'
                      }`}>
                        {proposalData.message.length} / 1000
                      </span>
                    </div>
                  </div>

                  {/* Tips */}
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="font-semibold text-purple-900 mb-1 text-sm">İpuçları</p>
                        <ul className="text-xs text-purple-700 space-y-1 list-disc list-inside">
                          <li>Deneyimlerinizi ve referanslarınızı belirtin</li>
                          <li>İşe yaklaşımınızı açıklayın</li>
                          <li>Neden sizi seçmeleri gerektiğini vurgulayın</li>
                          <li>Profesyonel ve samimi bir dil kullanın</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={proposalData.isProcessing || !proposalData.price || !proposalData.message || !proposalData.estimatedDays}
                    className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {proposalData.isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Gönderiliyor...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        Teklifi Gönder 
                        <span className="ml-2 text-sm font-medium bg-white bg-opacity-20 rounded px-2 py-0.5">
                          (49.99₺)
                        </span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Budget Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {opportunity.budget.toLocaleString('tr-TR')} ₺
                </div>
                <p className="text-gray-600 mb-6">Bütçe</p>
                {!showProposalForm && (
                  <button
                    onClick={() => setShowProposalForm(true)}
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    Teklif Ver
                  </button>
                )}
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Müşteri Bilgileri</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                  {opportunity.customer?.name?.[0] || 'U'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900">{opportunity.customer?.name || 'Müşteri'}</h4>
                    {opportunity.customer?.verified && (
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.363 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-900">{opportunity.customer?.rating || 0}</span>
                    <span className="text-sm text-gray-500">({opportunity.customer?.totalReviews || 0} değerlendirme)</span>
                  </div>
                  <p className="text-sm text-gray-500">Üye: {opportunity.customer?.memberSince || 'Bilinmiyor'}</p>
                </div>
              </div>
              <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                Profili Görüntüle
              </button>
            </div>

            {/* Details */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Detaylar</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Yayınlanma</p>
                  <p className="font-medium text-gray-900">{formatTimeAgo(opportunity.createdAt)}</p>
                </div>
                {opportunity.deadline && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Son Başvuru</p>
                    <p className="font-medium text-gray-900">{formatDate(opportunity.deadline)}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Teklif Sayısı</p>
                  <p className="font-medium text-gray-900">{opportunity.proposalsCount} teklif</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

