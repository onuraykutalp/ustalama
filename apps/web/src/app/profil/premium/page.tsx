'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/useAuthStore'
import { usePaymentStore } from '@/store/usePaymentStore'

export default function PremiumPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>}>
      <PremiumPageContent />
    </Suspense>
  )
}

function PremiumPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, token, isAuthenticated } = useAuthStore()
  const {
    cards, isPremium, loading, error,
    fetchCards, fetchBalance,
    initializePayment, payWithSavedCard,
    clearError,
  } = usePaymentStore()

  const [selectedCard, setSelectedCard] = useState('')
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [show3DS, setShow3DS] = useState(false)
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    holderName: '',
    saveCard: false,
  })

  const premiumPrice = 499

  useEffect(() => {
    if (!isAuthenticated || !token) {
      router.push('/login')
      return
    }
    fetchBalance(token)
    fetchCards(token)
  }, [isAuthenticated, token])

  // URL'den gelen ödeme sonuçlarını kontrol et
  useEffect(() => {
    const payment = searchParams.get('payment')
    if (payment === 'success') {
      setNotification({ type: 'success', message: 'Premium üyelik başarıyla aktif edildi!' })
      if (token) {
        fetchBalance(token)
        fetchCards(token)
      }
    } else if (payment === 'failed') {
      const reason = searchParams.get('reason') || 'Bilinmeyen hata'
      setNotification({ type: 'error', message: `Ödeme başarısız: ${decodeURIComponent(reason)}` })
    }
  }, [searchParams])

  // Varsayılan kartı seç
  useEffect(() => {
    const defaultCard = cards.find(c => c.isDefault)
    if (defaultCard) setSelectedCard(defaultCard.id)
  }, [cards])

  if (!isAuthenticated) return null

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const parts = []
    for (let i = 0; i < v.length && i < 16; i += 4) parts.push(v.substring(i, i + 4))
    return parts.join(' ')
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) return v.substring(0, 2) + '/' + v.substring(2, 4)
    return v
  }

  const handlePayWithSavedCard = async () => {
    if (!selectedCard || !token) return
    setIsProcessing(true)

    const result = await payWithSavedCard(token, {
      cardId: selectedCard,
      amount: premiumPrice,
      paymentType: 'PREMIUM_PURCHASE',
      description: 'Premium Üyelik',
    })

    setIsProcessing(false)
    if (result.status) {
      window.location.href = '/profil/premium?payment=success'
    } else {
      setNotification({ type: 'error', message: result.error || 'Ödeme başarısız' })
    }
  }

  const handlePayWithNewCard = async () => {
    if (!cardData.cardNumber || !cardData.expiryDate || !cardData.cvv || !cardData.holderName || !token) return
    setIsProcessing(true)

    const [expMonth, expYear] = cardData.expiryDate.split('/')
    const result = await initializePayment(token, {
      cardHolderName: cardData.holderName,
      cardNumber: cardData.cardNumber.replace(/\s/g, ''),
      expireMonth: expMonth,
      expireYear: '20' + expYear,
      cvc: cardData.cvv,
      amount: premiumPrice,
      paymentType: 'PREMIUM_PURCHASE',
      saveCard: cardData.saveCard,
      description: 'Premium Üyelik',
    })

    if (result.status && result.htmlContent) {
      setShow3DS(true)
      setTimeout(() => {
        if (iframeRef.current) {
          const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document
          if (doc) {
            doc.open()
            doc.write(result.htmlContent!)
            doc.close()
          }
        }
      }, 100)
    } else {
      setIsProcessing(false)
      if (!result.status) {
        setNotification({ type: 'error', message: result.error || 'Ödeme başlatılamadı' })
      }
    }
  }

  const premiumFeatures = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Sınırsız Teklif',
      description: 'Tüm fırsatlara sınırsız sayıda teklif verebilirsiniz'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Öncelikli Görünürlük',
      description: 'Teklifleriniz listede üst sıralarda gösterilir'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Premium Rozet',
      description: 'Profilinizde premium rozeti ile öne çıkın'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Özel Destek',
      description: '7/24 öncelikli müşteri desteği'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'Detaylı İstatistikler',
      description: 'Teklif performansınızı detaylı analiz edin'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Hızlı Teklif',
      description: 'Teklif verme sürecini hızlandırın'
    }
  ]

  // 3DS iframe ekranı
  if (show3DS) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="bg-white shadow-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/profil" className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Profil Sayfasına Dön
            </Link>
          </div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3D Secure Doğrulama</h2>
            <p className="text-gray-600 mb-4">Bankanızın güvenlik sayfasında işlemi onaylayın.</p>
            <iframe ref={iframeRef} className="w-full h-[500px] border-2 border-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    )
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
            Profil Sayfasına Dön
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notification */}
        {notification && (
          <div className={`mb-6 p-4 rounded-xl flex items-center justify-between ${notification.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
            <p className="font-medium">{notification.message}</p>
            <button onClick={() => setNotification(null)} className="ml-4 text-gray-500 hover:text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        )}

        {/* Premium Status Banner */}
        {isPremium && (
          <div className="mb-8 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-2xl shadow-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.363 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-1">Premium Üyesiniz!</h2>
                  <p className="text-yellow-100">Tüm premium özelliklere erişiminiz var</p>
                </div>
              </div>
              <div className="hidden md:block">
                <span className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-lg font-bold text-lg">
                  Aktif
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-semibold mb-4">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.363 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Premium Üyelik
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            İşinizi Büyütün, <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Sınırsız Teklif Verin</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Premium üyelik ile tüm fırsatlara sınırsız teklif verin ve işinizi bir üst seviyeye taşıyın
          </p>
        </div>

        {/* Pricing Card */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-yellow-400">
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 text-white text-center">
              <h2 className="text-3xl font-bold mb-2">Premium Üyelik</h2>
              <div className="flex items-baseline justify-center gap-2 mb-4">
                <span className="text-6xl font-bold">{premiumPrice}</span>
                <span className="text-2xl text-blue-100">₺</span>
              </div>
              <p className="text-blue-100 text-lg">Tek seferlik ödeme</p>
            </div>

            <div className="p-8">
              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {premiumFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Comparison Table */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Premium vs Normal</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Özellik</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-700">Normal</th>
                        <th className="text-center py-3 px-4 font-semibold text-blue-600">Premium</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-4 text-gray-700">Teklif Limiti</td>
                        <td className="py-3 px-4 text-center text-gray-600">Aylık 10 teklif</td>
                        <td className="py-3 px-4 text-center font-semibold text-blue-600">Sınırsız</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-4 text-gray-700">Görünürlük</td>
                        <td className="py-3 px-4 text-center text-gray-600">Standart</td>
                        <td className="py-3 px-4 text-center font-semibold text-blue-600">Öncelikli</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-4 text-gray-700">Premium Rozet</td>
                        <td className="py-3 px-4 text-center text-gray-400">✗</td>
                        <td className="py-3 px-4 text-center font-semibold text-green-600">✓</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-4 text-gray-700">İstatistikler</td>
                        <td className="py-3 px-4 text-center text-gray-400">✗</td>
                        <td className="py-3 px-4 text-center font-semibold text-green-600">✓</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-gray-700">Öncelikli Destek</td>
                        <td className="py-3 px-4 text-center text-gray-400">✗</td>
                        <td className="py-3 px-4 text-center font-semibold text-green-600">✓</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Payment Section */}
              {!isPremium && (
                <div>
                  {!showPaymentForm ? (
                    <div className="space-y-4">
                      {cards.length > 0 && (
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Kayıtlı Kartlarınız
                          </label>
                          <div className="space-y-2">
                            {cards.map((card) => (
                              <label
                                key={card.id}
                                className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                                  selectedCard === card.id
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="card"
                                  value={card.id}
                                  checked={selectedCard === card.id}
                                  onChange={(e) => setSelectedCard(e.target.value)}
                                  className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                                />
                                <div className="ml-4 flex-1 flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-12 h-8 rounded flex items-center justify-center ${
                                      card.cardBrand?.includes('VISA') ? 'bg-blue-600' : 'bg-red-600'
                                    }`}>
                                      <span className="text-white font-bold text-xs">
                                        {card.cardBrand?.includes('VISA') ? 'VISA' : 'MC'}
                                      </span>
                                    </div>
                                    <div>
                                      <p className="font-semibold text-gray-900">
                                        •••• •••• •••• {card.cardLast4}
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        {card.cardAlias} {card.cardBankName ? `• ${card.cardBankName}` : ''}
                                      </p>
                                    </div>
                                  </div>
                                  {card.isDefault && (
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Varsayılan</span>
                                  )}
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}

                      <button
                        onClick={() => setShowPaymentForm(true)}
                        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-gray-700 font-medium mb-4"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Yeni Kart ile Öde
                        </div>
                      </button>

                      {cards.length > 0 && (
                        <button
                          onClick={handlePayWithSavedCard}
                          disabled={!selectedCard || isProcessing}
                          className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {isProcessing ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              İşleniyor...
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.363 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              Premium Üye Ol - {premiumPrice} ₺
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4 p-6 bg-gray-50 rounded-xl border-2 border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-900 text-lg">Kart Bilgileri</h3>
                        <button
                          onClick={() => setShowPaymentForm(false)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Kart Numarası
                        </label>
                        <input
                          type="text"
                          value={cardData.cardNumber}
                          onChange={(e) => setCardData({ ...cardData, cardNumber: formatCardNumber(e.target.value) })}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Son Kullanma
                          </label>
                          <input
                            type="text"
                            value={cardData.expiryDate}
                            onChange={(e) => setCardData({ ...cardData, expiryDate: formatExpiryDate(e.target.value) })}
                            placeholder="MM/YY"
                            maxLength={5}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV
                          </label>
                          <input
                            type="text"
                            value={cardData.cvv}
                            onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                            placeholder="123"
                            maxLength={4}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Kart Sahibi
                        </label>
                        <input
                          type="text"
                          value={cardData.holderName}
                          onChange={(e) => setCardData({ ...cardData, holderName: e.target.value.toUpperCase() })}
                          placeholder="AD SOYAD"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={cardData.saveCard}
                          onChange={(e) => setCardData({ ...cardData, saveCard: e.target.checked })}
                          className="w-5 h-5 text-blue-600 focus:ring-blue-500 rounded"
                        />
                        <span className="text-sm text-gray-700">Bu kartı kaydet</span>
                      </label>

                      <button
                        onClick={handlePayWithNewCard}
                        disabled={!cardData.cardNumber || !cardData.expiryDate || !cardData.cvv || !cardData.holderName || isProcessing}
                        className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isProcessing ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            İşleniyor...
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.363 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            Premium Üye Ol - {premiumPrice} ₺
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Security Notice */}
                  <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
                    <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-green-900 mb-1">Güvenli Ödeme</p>
                      <p className="text-sm text-green-700">
                        Tüm ödemeleriniz 3D Secure ve SSL ile şifrelenir. iyzico altyapısı ile güvenle işlenir. 7 gün içinde iade garantisi.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {isPremium && (
                <div className="text-center py-8">
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-100 text-green-700 rounded-full font-semibold">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Premium Üyeliğiniz Aktif
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Sık Sorulan Sorular</h2>
          <div className="space-y-4">
            {[
              {
                question: 'Premium üyelik ne kadar süre geçerli?',
                answer: 'Premium üyelik tek seferlik ödeme ile ömür boyu geçerlidir. Sınırsız teklif verme hakkınız süresizdir.'
              },
              {
                question: 'İade yapabilir miyim?',
                answer: 'Evet, ödeme yaptıktan sonra 7 gün içinde iade talebinde bulunabilirsiniz. İade işlemi 3-5 iş günü içinde tamamlanır.'
              },
              {
                question: 'Premium üyelik otomatik yenilenir mi?',
                answer: 'Hayır, premium üyelik tek seferlik ödeme ile ömür boyu geçerlidir. Otomatik yenileme yoktur.'
              },
              {
                question: 'Normal üyelikten premium\'a geçiş yapabilir miyim?',
                answer: 'Evet, istediğiniz zaman premium üyeliğe geçiş yapabilirsiniz. Mevcut teklifleriniz korunur.'
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
