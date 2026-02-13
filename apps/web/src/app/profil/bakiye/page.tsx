'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
// Static export - no auth store

export default function BalancePage() {
  const router = useRouter()
  // Static export - no authentication
  const isAuthenticated = false
  const [activeTab, setActiveTab] = useState<'balance' | 'cards' | 'history'>('balance')
  const [balance, setBalance] = useState(1250.50) // Dummy balance
  const [savedCards, setSavedCards] = useState([
    {
      id: '1',
      last4: '4242',
      brand: 'visa',
      expiryMonth: '12',
      expiryYear: '2025',
      holderName: 'Ahmet Yılmaz',
      isDefault: true
    },
    {
      id: '2',
      last4: '8888',
      brand: 'mastercard',
      expiryMonth: '06',
      expiryYear: '2026',
      holderName: 'Ahmet Yılmaz',
      isDefault: false
    }
  ])

  const [paymentHistory] = useState([
    {
      id: '1',
      amount: 500,
      type: 'deposit',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: 'completed',
      description: 'Bakiye yükleme'
    },
    {
      id: '2',
      amount: 250,
      type: 'withdrawal',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      status: 'completed',
      description: 'Ödeme'
    },
    {
      id: '3',
      amount: 1000,
      type: 'deposit',
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      status: 'completed',
      description: 'Bakiye yükleme'
    }
  ])

  // Static export - no redirect needed, just show content

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
            <button
              onClick={() => setActiveTab('balance')}
              className="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-all backdrop-blur-sm"
            >
              Bakiye Yükle
            </button>
            <button
              onClick={() => setActiveTab('cards')}
              className="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-all backdrop-blur-sm"
            >
              Kartlarım
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('balance')}
                className={`flex-1 px-6 py-4 text-center font-semibold transition-all ${
                  activeTab === 'balance'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Bakiye Yükle
                </div>
              </button>
              <button
                onClick={() => setActiveTab('cards')}
                className={`flex-1 px-6 py-4 text-center font-semibold transition-all ${
                  activeTab === 'cards'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Kartlarım
                </div>
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 px-6 py-4 text-center font-semibold transition-all ${
                  activeTab === 'history'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Ödeme Geçmişi
                </div>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Balance Tab */}
            {activeTab === 'balance' && (
              <BalanceDepositForm 
                balance={balance} 
                setBalance={setBalance}
                savedCards={savedCards}
              />
            )}

            {/* Cards Tab */}
            {activeTab === 'cards' && (
              <CardsManagement 
                savedCards={savedCards}
                setSavedCards={setSavedCards}
              />
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <PaymentHistory paymentHistory={paymentHistory} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Balance Deposit Form Component
function BalanceDepositForm({ 
  balance, 
  setBalance,
  savedCards 
}: { 
  balance: number
  setBalance: (balance: number) => void
  savedCards: any[]
}) {
  const [amount, setAmount] = useState('')
  const [selectedCard, setSelectedCard] = useState(savedCards.find(c => c.isDefault)?.id || savedCards[0]?.id || '')
  const [showNewCardForm, setShowNewCardForm] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    holderName: '',
    saveCard: false
  })

  const quickAmounts = [100, 250, 500, 1000, 2000, 5000]

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setBalance(balance + parseFloat(amount))
    setAmount('')
    setIsProcessing(false)
    alert('Bakiye başarıyla yüklendi!')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Bakiye Yükle</h2>
        <p className="text-gray-600">Hızlı ve güvenli ödeme ile bakiyenizi yükleyin</p>
      </div>

      {/* Quick Amount Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">Hızlı Tutar Seçimi</label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {quickAmounts.map((quickAmount) => (
            <button
              key={quickAmount}
              onClick={() => setAmount(quickAmount.toString())}
              className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                amount === quickAmount.toString()
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {quickAmount} ₺
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tutar (₺)
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="10"
              step="0.01"
              required
              className="w-full px-4 py-4 text-2xl font-bold border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
              ₺
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-500">Minimum yükleme tutarı: 10 ₺</p>
        </div>

        {/* Payment Method Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Ödeme Yöntemi
          </label>
          
          {!showNewCardForm ? (
            <div className="space-y-3">
              {savedCards.length > 0 && (
                <div className="space-y-2">
                  {savedCards.map((card) => (
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
                            card.brand === 'visa' ? 'bg-blue-600' : 'bg-red-600'
                          }`}>
                            <span className="text-white font-bold text-xs">
                              {card.brand === 'visa' ? 'VISA' : 'MC'}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              •••• •••• •••• {card.last4}
                            </p>
                            <p className="text-sm text-gray-500">
                              {card.expiryMonth}/{card.expiryYear} • {card.holderName}
                            </p>
                          </div>
                        </div>
                        {card.isDefault && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                            Varsayılan
                          </span>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              )}
              
              <button
                type="button"
                onClick={() => setShowNewCardForm(true)}
                className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-gray-700 font-medium"
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Yeni Kart Ekle
                </div>
              </button>
            </div>
          ) : (
            <div className="space-y-4 p-6 bg-gray-50 rounded-xl border-2 border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Yeni Kart Bilgileri</h3>
                <button
                  type="button"
                  onClick={() => setShowNewCardForm(false)}
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
                    Son Kullanma Tarihi
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
                    onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                    placeholder="123"
                    maxLength={3}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kart Sahibi Adı
                </label>
                <input
                  type="text"
                  value={cardData.holderName}
                  onChange={(e) => setCardData({ ...cardData, holderName: e.target.value.toUpperCase() })}
                  placeholder="AHMET YILMAZ"
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
                <span className="text-sm text-gray-700">Bu kartı kaydet ve varsayılan yap</span>
              </label>
            </div>
          )}
        </div>

        {/* Security Notice */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
          <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <div>
            <p className="font-semibold text-green-900 mb-1">Güvenli Ödeme</p>
            <p className="text-sm text-green-700">
              Tüm ödemeleriniz SSL ile şifrelenir ve güvenli bir şekilde işlenir. Kart bilgileriniz saklanmaz.
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!amount || parseFloat(amount) < 10 || isProcessing}
          className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              İşleniyor...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {amount ? `${parseFloat(amount).toLocaleString('tr-TR')} ₺ Yükle` : 'Bakiye Yükle'}
            </>
          )}
        </button>
      </form>
    </div>
  )
}

// Cards Management Component
function CardsManagement({ 
  savedCards, 
  setSavedCards 
}: { 
  savedCards: any[]
  setSavedCards: (cards: any[]) => void
}) {
  const [showAddCardForm, setShowAddCardForm] = useState(false)
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    holderName: '',
    saveAsDefault: false
  })

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault()
    const cardNumber = newCard.cardNumber.replace(/\s/g, '')
    const last4 = cardNumber.slice(-4)
    const brand = cardNumber.startsWith('4') ? 'visa' : 'mastercard'
    
    const card = {
      id: Date.now().toString(),
      last4,
      brand,
      expiryMonth: newCard.expiryDate.split('/')[0],
      expiryYear: '20' + newCard.expiryDate.split('/')[1],
      holderName: newCard.holderName,
      isDefault: newCard.saveAsDefault || savedCards.length === 0
    }

    if (newCard.saveAsDefault) {
      setSavedCards(savedCards.map(c => ({ ...c, isDefault: false })).concat(card))
    } else {
      setSavedCards([...savedCards, card])
    }

    setNewCard({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      holderName: '',
      saveAsDefault: false
    })
    setShowAddCardForm(false)
    alert('Kart başarıyla eklendi!')
  }

  const handleDeleteCard = (cardId: string) => {
    if (confirm('Bu kartı silmek istediğinizden emin misiniz?')) {
      setSavedCards(savedCards.filter(c => c.id !== cardId))
    }
  }

  const handleSetDefault = (cardId: string) => {
    setSavedCards(savedCards.map(c => ({
      ...c,
      isDefault: c.id === cardId
    })))
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Kayıtlı Kartlarım</h2>
          <p className="text-gray-600">Ödeme kartlarınızı yönetin</p>
        </div>
        {!showAddCardForm && (
          <button
            onClick={() => setShowAddCardForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Yeni Kart Ekle
            </div>
          </button>
        )}
      </div>

      {showAddCardForm && (
        <div className="bg-gray-50 rounded-xl p-6 mb-6 border-2 border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Yeni Kart Ekle</h3>
            <button
              onClick={() => setShowAddCardForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleAddCard} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kart Numarası
              </label>
              <input
                type="text"
                value={newCard.cardNumber}
                onChange={(e) => setNewCard({ ...newCard, cardNumber: formatCardNumber(e.target.value) })}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Son Kullanma Tarihi
                </label>
                <input
                  type="text"
                  value={newCard.expiryDate}
                  onChange={(e) => setNewCard({ ...newCard, expiryDate: formatExpiryDate(e.target.value) })}
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
                  value={newCard.cvv}
                  onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                  placeholder="123"
                  maxLength={3}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kart Sahibi Adı
              </label>
              <input
                type="text"
                value={newCard.holderName}
                onChange={(e) => setNewCard({ ...newCard, holderName: e.target.value.toUpperCase() })}
                placeholder="AHMET YILMAZ"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={newCard.saveAsDefault}
                onChange={(e) => setNewCard({ ...newCard, saveAsDefault: e.target.checked })}
                className="w-5 h-5 text-blue-600 focus:ring-blue-500 rounded"
              />
              <span className="text-sm text-gray-700">Varsayılan kart olarak kaydet</span>
            </label>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Kartı Kaydet
              </button>
              <button
                type="button"
                onClick={() => setShowAddCardForm(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {savedCards.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <p className="text-gray-600 mb-2">Henüz kayıtlı kartınız yok</p>
            <button
              onClick={() => setShowAddCardForm(true)}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              İlk kartınızı ekleyin
            </button>
          </div>
        ) : (
          savedCards.map((card) => (
            <div
              key={card.id}
              className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-gray-200 hover:border-blue-300 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-10 rounded flex items-center justify-center shadow-lg ${
                    card.brand === 'visa' ? 'bg-blue-600' : 'bg-red-600'
                  }`}>
                    <span className="text-white font-bold text-sm">
                      {card.brand === 'visa' ? 'VISA' : 'MC'}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg mb-1">
                      •••• •••• •••• {card.last4}
                    </p>
                    <p className="text-sm text-gray-600">
                      {card.expiryMonth}/{card.expiryYear} • {card.holderName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {card.isDefault ? (
                    <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold">
                      Varsayılan
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSetDefault(card.id)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-all"
                    >
                      Varsayılan Yap
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteCard(card.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
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

// Payment History Component
function PaymentHistory({ paymentHistory }: { paymentHistory: any[] }) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Ödeme Geçmişi</h2>
        <p className="text-gray-600">Tüm ödeme işlemlerinizin geçmişi</p>
      </div>

      {paymentHistory.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-600">Henüz ödeme geçmişi bulunmuyor</p>
        </div>
      ) : (
        <div className="space-y-4">
          {paymentHistory.map((payment) => (
            <div
              key={payment.id}
              className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-blue-300 transition-all shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    payment.type === 'deposit'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {payment.type === 'deposit' ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{payment.description}</p>
                    <p className="text-sm text-gray-500">{formatDate(payment.date)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-xl font-bold ${
                    payment.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {payment.type === 'deposit' ? '+' : '-'}{payment.amount.toLocaleString('tr-TR')} ₺
                  </p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    payment.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {payment.status === 'completed' ? 'Tamamlandı' : 'Beklemede'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

