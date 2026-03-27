'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/useAuthStore'
import { usePaymentStore } from '@/store/usePaymentStore'

export default function BalancePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>}>
      <BalancePageContent />
    </Suspense>
  )
}

function BalancePageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, token, isAuthenticated } = useAuthStore()
  const {
    cards, transactions, balance, loading, error,
    fetchCards, fetchBalance, fetchTransactions,
    initializePayment, payWithSavedCard, addCard, deleteCard, setDefaultCard,
    clearError,
  } = usePaymentStore()

  const [activeTab, setActiveTab] = useState<'balance' | 'cards' | 'history'>('balance')
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    if (!isAuthenticated || !token) {
      router.push('/login')
      return
    }
    fetchBalance(token)
    fetchCards(token)
    fetchTransactions(token)
  }, [isAuthenticated, token])

  // URL'den gelen ödeme sonuçlarını kontrol et
  useEffect(() => {
    const payment = searchParams.get('payment')
    const amount = searchParams.get('amount')
    if (payment === 'success') {
      setNotification({ type: 'success', message: `Ödeme başarılı${amount ? ` - ${amount} TL yüklendi` : ''}` })
      if (token) {
        fetchBalance(token)
        fetchTransactions(token)
        fetchCards(token)
      }
    } else if (payment === 'failed') {
      const reason = searchParams.get('reason') || 'Bilinmeyen hata'
      setNotification({ type: 'error', message: `Ödeme başarısız: ${decodeURIComponent(reason)}` })
    }
  }, [searchParams])

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
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
        {/* Notification */}
        {notification && (
          <div className={`mb-6 p-4 rounded-xl flex items-center justify-between ${notification.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
            <p className="font-medium">{notification.message}</p>
            <button onClick={() => setNotification(null)} className="ml-4 text-gray-500 hover:text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        )}

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Bakiye ve Ödemeler</h1>
          <p className="text-gray-600">Bakiyenizi yükleyin ve ödeme yöntemlerinizi yönetin</p>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-2">Mevcut Bakiye</p>
              <h2 className="text-5xl font-bold">{balance.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺</h2>
            </div>
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setActiveTab('balance')} className="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-all backdrop-blur-sm">Bakiye Yükle</button>
            <button onClick={() => setActiveTab('cards')} className="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-all backdrop-blur-sm">Kartlarım</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {[
                { key: 'balance' as const, label: 'Bakiye Yükle', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                { key: 'cards' as const, label: 'Kartlarım', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
                { key: 'history' as const, label: 'Ödeme Geçmişi', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
              ].map((tab) => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 px-6 py-4 text-center font-semibold transition-all ${activeTab === tab.key ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} /></svg>
                    {tab.label}
                  </div>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'balance' && <BalanceDepositForm token={token!} cards={cards} />}
            {activeTab === 'cards' && <CardsManagement token={token!} cards={cards} />}
            {activeTab === 'history' && <PaymentHistory transactions={transactions} />}
          </div>
        </div>
      </div>
    </div>
  )
}

// Bakiye Yükleme Formu
function BalanceDepositForm({ token, cards }: { token: string; cards: any[] }) {
  const { initializePayment, payWithSavedCard, loading } = usePaymentStore()
  const [amount, setAmount] = useState('')
  const [selectedCard, setSelectedCard] = useState('')
  const [showNewCardForm, setShowNewCardForm] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [show3DS, setShow3DS] = useState(false)
  const [cardData, setCardData] = useState({ cardNumber: '', expiryDate: '', cvv: '', holderName: '', saveCard: false })

  const quickAmounts = [100, 250, 500, 1000, 2000, 5000]

  useEffect(() => {
    const defaultCard = cards.find(c => c.isDefault)
    if (defaultCard) setSelectedCard(defaultCard.id)
  }, [cards])

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

  const handleSubmitNewCard = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || parseFloat(amount) < 10) return
    setIsProcessing(true)

    const [expMonth, expYear] = cardData.expiryDate.split('/')
    const result = await initializePayment(token, {
      cardHolderName: cardData.holderName,
      cardNumber: cardData.cardNumber.replace(/\s/g, ''),
      expireMonth: expMonth,
      expireYear: '20' + expYear,
      cvc: cardData.cvv,
      amount: parseFloat(amount),
      paymentType: 'BALANCE_DEPOSIT',
      saveCard: cardData.saveCard,
      description: 'Bakiye Yükleme',
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
    }
  }

  const handleSubmitSavedCard = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || parseFloat(amount) < 10 || !selectedCard) return
    setIsProcessing(true)

    const result = await payWithSavedCard(token, {
      cardId: selectedCard,
      amount: parseFloat(amount),
      paymentType: 'BALANCE_DEPOSIT',
      description: 'Bakiye Yükleme',
    })

    setIsProcessing(false)
    if (result.status) {
      window.location.href = '/profil/bakiye?payment=success&amount=' + amount
    }
  }

  if (show3DS) {
    return (
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">3D Secure Doğrulama</h2>
        <p className="text-gray-600 mb-4">Bankanızın güvenlik sayfasında işlemi onaylayın.</p>
        <iframe ref={iframeRef} className="w-full h-[500px] border-2 border-gray-200 rounded-xl" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Bakiye Yükle</h2>
        <p className="text-gray-600">Hızlı ve güvenli ödeme ile bakiyenizi yükleyin</p>
      </div>

      {/* Quick Amount */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">Hızlı Tutar Seçimi</label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {quickAmounts.map((q) => (
            <button key={q} onClick={() => setAmount(q.toString())}
              className={`px-4 py-3 rounded-lg font-semibold transition-all ${amount === q.toString() ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              {q} ₺
            </button>
          ))}
        </div>
      </div>

      {/* Amount Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Tutar (₺)</label>
        <div className="relative">
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" min="10" step="0.01" required
            className="w-full px-4 py-4 text-2xl font-bold border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" />
          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">₺</span>
        </div>
        <p className="mt-2 text-sm text-gray-500">Minimum yükleme tutarı: 10 ₺</p>
      </div>

      {/* Payment Method */}
      {!showNewCardForm ? (
        <form onSubmit={handleSubmitSavedCard} className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 mb-3">Ödeme Yöntemi</label>
          {cards.length > 0 && (
            <div className="space-y-2">
              {cards.map((card) => (
                <label key={card.id}
                  className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${selectedCard === card.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" name="card" value={card.id} checked={selectedCard === card.id} onChange={(e) => setSelectedCard(e.target.value)} className="w-5 h-5 text-blue-600" />
                  <div className="ml-4 flex-1 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-8 rounded flex items-center justify-center ${card.cardBrand?.includes('VISA') ? 'bg-blue-600' : 'bg-red-600'}`}>
                        <span className="text-white font-bold text-xs">{card.cardBrand?.includes('VISA') ? 'VISA' : 'MC'}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">•••• •••• •••• {card.cardLast4}</p>
                        <p className="text-sm text-gray-500">{card.cardAlias} {card.cardBankName ? `• ${card.cardBankName}` : ''}</p>
                      </div>
                    </div>
                    {card.isDefault && <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Varsayılan</span>}
                  </div>
                </label>
              ))}
            </div>
          )}
          <button type="button" onClick={() => setShowNewCardForm(true)}
            className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-gray-700 font-medium">
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Yeni Kart ile Öde
            </div>
          </button>
          {cards.length > 0 && (
            <button type="submit" disabled={!amount || parseFloat(amount) < 10 || !selectedCard || isProcessing}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isProcessing ? (<><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>İşleniyor...</>) : (amount ? `${parseFloat(amount).toLocaleString('tr-TR')} ₺ Yükle` : 'Bakiye Yükle')}
            </button>
          )}
        </form>
      ) : (
        <form onSubmit={handleSubmitNewCard} className="space-y-4">
          <div className="p-6 bg-gray-50 rounded-xl border-2 border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Yeni Kart Bilgileri</h3>
              <button type="button" onClick={() => setShowNewCardForm(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kart Numarası</label>
                <input type="text" value={cardData.cardNumber} onChange={(e) => setCardData({ ...cardData, cardNumber: formatCardNumber(e.target.value) })} placeholder="1234 5678 9012 3456" maxLength={19} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Son Kullanma</label>
                  <input type="text" value={cardData.expiryDate} onChange={(e) => setCardData({ ...cardData, expiryDate: formatExpiryDate(e.target.value) })} placeholder="MM/YY" maxLength={5} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                  <input type="text" value={cardData.cvv} onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })} placeholder="123" maxLength={4} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kart Sahibi</label>
                <input type="text" value={cardData.holderName} onChange={(e) => setCardData({ ...cardData, holderName: e.target.value.toUpperCase() })} placeholder="AD SOYAD" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={cardData.saveCard} onChange={(e) => setCardData({ ...cardData, saveCard: e.target.checked })} className="w-5 h-5 text-blue-600 rounded" />
                <span className="text-sm text-gray-700">Bu kartı kaydet</span>
              </label>
            </div>
          </div>
          <button type="submit" disabled={!amount || parseFloat(amount) < 10 || isProcessing}
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {isProcessing ? (<><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>İşleniyor...</>) : (amount ? `${parseFloat(amount).toLocaleString('tr-TR')} ₺ Yükle` : 'Bakiye Yükle')}
          </button>
        </form>
      )}

      {/* Security Notice */}
      <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
        <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <div>
          <p className="font-semibold text-green-900 mb-1">Güvenli Ödeme</p>
          <p className="text-sm text-green-700">Tüm ödemeleriniz 3D Secure ve SSL ile şifrelenir. iyzico altyapısı ile güvenle işlenir.</p>
        </div>
      </div>
    </div>
  )
}

// Kart Yönetimi
function CardsManagement({ token, cards }: { token: string; cards: any[] }) {
  const { addCard, deleteCard, setDefaultCard, loading } = usePaymentStore()
  const [showAddForm, setShowAddForm] = useState(false)
  const [newCard, setNewCard] = useState({ cardNumber: '', expiryDate: '', holderName: '', cardAlias: '' })

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

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault()
    const [expMonth, expYear] = newCard.expiryDate.split('/')
    try {
      await addCard(token, {
        cardHolderName: newCard.holderName,
        cardNumber: newCard.cardNumber,
        expireMonth: expMonth,
        expireYear: '20' + expYear,
        cardAlias: newCard.cardAlias || 'Kartım',
      })
      setShowAddForm(false)
      setNewCard({ cardNumber: '', expiryDate: '', holderName: '', cardAlias: '' })
    } catch (e) {}
  }

  const handleDelete = async (cardId: string) => {
    if (confirm('Bu kartı silmek istediğinizden emin misiniz?')) {
      await deleteCard(token, cardId)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Kayıtlı Kartlarım</h2>
          <p className="text-gray-600">Ödeme kartlarınızı yönetin</p>
        </div>
        {!showAddForm && (
          <button onClick={() => setShowAddForm(true)} className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Yeni Kart Ekle
            </div>
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="bg-gray-50 rounded-xl p-6 mb-6 border-2 border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Yeni Kart Ekle</h3>
            <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <form onSubmit={handleAddCard} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kart Adı (opsiyonel)</label>
              <input type="text" value={newCard.cardAlias} onChange={(e) => setNewCard({ ...newCard, cardAlias: e.target.value })} placeholder="Örn: İş Bankası Kartım" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kart Numarası</label>
              <input type="text" value={newCard.cardNumber} onChange={(e) => setNewCard({ ...newCard, cardNumber: formatCardNumber(e.target.value) })} placeholder="1234 5678 9012 3456" maxLength={19} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Son Kullanma</label>
                <input type="text" value={newCard.expiryDate} onChange={(e) => setNewCard({ ...newCard, expiryDate: formatExpiryDate(e.target.value) })} placeholder="MM/YY" maxLength={5} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kart Sahibi</label>
                <input type="text" value={newCard.holderName} onChange={(e) => setNewCard({ ...newCard, holderName: e.target.value.toUpperCase() })} placeholder="AD SOYAD" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={loading} className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50">
                {loading ? 'Kaydediliyor...' : 'Kartı Kaydet'}
              </button>
              <button type="button" onClick={() => setShowAddForm(false)} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all">İptal</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {cards.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
            <p className="text-gray-600 mb-2">Henüz kayıtlı kartınız yok</p>
            <button onClick={() => setShowAddForm(true)} className="text-blue-600 hover:text-blue-700 font-semibold">İlk kartınızı ekleyin</button>
          </div>
        ) : (
          cards.map((card) => (
            <div key={card.id} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-gray-200 hover:border-blue-300 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-10 rounded flex items-center justify-center shadow-lg ${card.cardBrand?.includes('VISA') ? 'bg-blue-600' : 'bg-red-600'}`}>
                    <span className="text-white font-bold text-sm">{card.cardBrand?.includes('VISA') ? 'VISA' : 'MC'}</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg mb-1">•••• •••• •••• {card.cardLast4}</p>
                    <p className="text-sm text-gray-600">{card.cardAlias} {card.cardBankName ? `• ${card.cardBankName}` : ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {card.isDefault ? (
                    <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold">Varsayılan</span>
                  ) : (
                    <button onClick={() => setDefaultCard(token, card.id)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-all">Varsayılan Yap</button>
                  )}
                  <button onClick={() => handleDelete(card.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// Ödeme Geçmişi
function PaymentHistory({ transactions }: { transactions: any[] }) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const typeLabels: Record<string, string> = {
    DEPOSIT: 'Bakiye Yükleme',
    WITHDRAWAL: 'Ödeme',
    PREMIUM: 'Premium Üyelik',
    REFUND: 'İade',
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Ödeme Geçmişi</h2>
        <p className="text-gray-600">Tüm ödeme işlemlerinizin geçmişi</p>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p className="text-gray-600">Henüz ödeme geçmişi bulunmuyor</p>
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((tx) => (
            <div key={tx.id} className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-blue-300 transition-all shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${tx.type === 'DEPOSIT' || tx.type === 'REFUND' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {tx.type === 'DEPOSIT' || tx.type === 'REFUND' ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    ) : (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{tx.description || typeLabels[tx.type] || tx.type}</p>
                    <p className="text-sm text-gray-500">{formatDate(tx.createdAt)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-xl font-bold ${tx.type === 'DEPOSIT' || tx.type === 'REFUND' ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.type === 'DEPOSIT' || tx.type === 'REFUND' ? '+' : '-'}{tx.amount.toLocaleString('tr-TR')} ₺
                  </p>
                  <p className="text-sm text-gray-500">Bakiye: {tx.balanceAfter.toLocaleString('tr-TR')} ₺</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
