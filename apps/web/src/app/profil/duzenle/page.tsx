'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/useAuthStore'
import { apiClient } from '@talepo/api'

export default function EditProfilePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'cards' | 'danger'>('profile')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: ''
  })

  // Dummy saved cards
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

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const { user, fetchProfile } = useAuthStore()

  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true)
      try {
        if (user) {
          setUserData({
            name: user.name || '',
            email: user.email,
            phone: user.phone || '',
            avatar: user.avatar || ''
          })
        } else {
          await fetchProfile()
        }
      } catch (error) {
        console.error('Error loading user data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [user, fetchProfile])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      const response = await apiClient.patch('/profile', {
        name: userData.name,
        phone: userData.phone,
        avatar: userData.avatar
      })
      
      if (response.data) {
        await fetchProfile() // Refresh user data
        alert('Profil bilgileri başarıyla güncellendi!')
      }
    } catch (error: any) {
      alert(error.error || 'Profil güncellenirken bir hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Yeni şifreler eşleşmiyor!')
      return
    }

    if (passwordData.newPassword.length < 6) {
      alert('Şifre en az 6 karakter olmalıdır!')
      return
    }

    setSaving(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    setSaving(false)
    alert('Şifre başarıyla değiştirildi!')
  }

  const handleDeleteAccount = async () => {
    const confirmText = 'HESABIMI SİL'
    const userInput = prompt(
      'Hesabınızı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.\n\n' +
      'Onaylamak için "' + confirmText + '" yazın:'
    )

    if (userInput !== confirmText) {
      return
    }

    setSaving(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    router.push('/')
    alert('Hesabınız başarıyla silindi.')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Yükleniyor...</p>
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
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Profil Ayarları</h1>
          <p className="text-gray-600">Hesap bilgilerinizi düzenleyin ve yönetin</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-4 sticky top-24">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'profile'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="font-medium">Profil</span>
                </button>
                <button
                  onClick={() => setActiveTab('password')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'password'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="font-medium">Şifre</span>
                </button>
                <button
                  onClick={() => setActiveTab('cards')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'cards'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span className="font-medium">Kartlar</span>
                </button>
                <button
                  onClick={() => setActiveTab('danger')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'danger'
                      ? 'bg-red-600 text-white shadow-lg'
                      : 'text-red-600 hover:bg-red-50'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span className="font-medium">Tehlikeli Bölge</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Kişisel Bilgiler</h2>
                
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  {/* Avatar Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Profil Fotoğrafı
                    </label>
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg overflow-hidden">
                        {userData.avatar ? (
                          <img src={userData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span>{userData.name?.[0]?.toUpperCase() || userData.email[0].toUpperCase()}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              const reader = new FileReader()
                              reader.onloadend = () => {
                                setUserData({ ...userData, avatar: reader.result as string })
                              }
                              reader.readAsDataURL(file)
                            }
                          }}
                          className="hidden"
                          id="avatar-upload"
                        />
                        <label
                          htmlFor="avatar-upload"
                          className="inline-block px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-gray-700 cursor-pointer transition-colors"
                        >
                          Fotoğraf Yükle
                        </label>
                        <p className="text-sm text-gray-500 mt-2">JPG, PNG veya GIF (Max. 5MB)</p>
                      </div>
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ad Soyad
                    </label>
                    <input
                      type="text"
                      value={userData.name}
                      onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Adınız ve soyadınız"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-posta Adresi
                    </label>
                    <input
                      type="email"
                      value={userData.email}
                      onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                      placeholder="ornek@email.com"
                      disabled
                    />
                    <p className="text-sm text-gray-500 mt-2">E-posta adresi değiştirilemez</p>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefon Numarası
                    </label>
                    <input
                      type="tel"
                      value={userData.phone}
                      onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="+90 555 123 4567"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {saving ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Kaydediliyor...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Değişiklikleri Kaydet
                        </>
                      )}
                    </button>
                    <Link
                      href="/profil"
                      className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      İptal
                    </Link>
                  </div>
                </form>
              </div>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Şifre Değiştir</h2>
                
                <form onSubmit={handlePasswordChange} className="space-y-6">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mevcut Şifre
                    </label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Mevcut şifrenizi girin"
                      required
                    />
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yeni Şifre
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Yeni şifrenizi girin (min. 6 karakter)"
                      required
                      minLength={6}
                    />
                    <p className="text-sm text-gray-500 mt-2">Şifre en az 6 karakter olmalıdır</p>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yeni Şifre (Tekrar)
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Yeni şifrenizi tekrar girin"
                      required
                    />
                    {passwordData.newPassword && passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                      <p className="text-sm text-red-600 mt-2">Şifreler eşleşmiyor</p>
                    )}
                  </div>

                  {/* Security Notice */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                    <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-blue-900 mb-1">Güvenlik İpuçları</p>
                      <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                        <li>Şifreniz en az 6 karakter olmalıdır</li>
                        <li>Büyük ve küçük harf, rakam ve özel karakter kullanın</li>
                        <li>Şifrenizi düzenli olarak değiştirin</li>
                      </ul>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={saving || passwordData.newPassword !== passwordData.confirmPassword}
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {saving ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Değiştiriliyor...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Şifreyi Değiştir
                        </>
                      )}
                    </button>
                    <Link
                      href="/profil"
                      className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      İptal
                    </Link>
                  </div>
                </form>
              </div>
            )}

            {/* Cards Tab */}
            {activeTab === 'cards' && (
              <CardsManagement 
                savedCards={savedCards}
                setSavedCards={setSavedCards}
              />
            )}

            {/* Danger Zone Tab */}
            {activeTab === 'danger' && (
              <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border-2 border-red-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Tehlikeli Bölge</h2>
                    <p className="text-gray-600">Bu işlemler geri alınamaz</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Delete Account */}
                  <div className="border-2 border-red-200 rounded-xl p-6 bg-red-50">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Hesabı Sil</h3>
                        <p className="text-gray-600 text-sm">
                          Hesabınızı silmek istediğinizde, tüm verileriniz kalıcı olarak silinir. 
                          Bu işlem geri alınamaz.
                        </p>
                      </div>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-2 mb-6 list-disc list-inside">
                      <li>Tüm profil bilgileriniz silinir</li>
                      <li>Tüm hizmetleriniz ve talepleriniz silinir</li>
                      <li>Değerlendirmeleriniz silinir</li>
                      <li>Mesaj geçmişiniz silinir</li>
                    </ul>
                    <button
                      onClick={handleDeleteAccount}
                      disabled={saving}
                      className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {saving ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Siliniyor...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Hesabımı Sil
                        </>
                      )}
                    </button>
                  </div>

                  {/* Warning Notice */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
                    <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-yellow-900 mb-1">Dikkat!</p>
                      <p className="text-sm text-yellow-700">
                        Hesap silme işlemi geri alınamaz. Lütfen bu işlemi yapmadan önce tüm verilerinizi yedeklediğinizden emin olun.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
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
      alert('Kart başarıyla silindi!')
    }
  }

  const handleSetDefault = (cardId: string) => {
    setSavedCards(savedCards.map(c => ({
      ...c,
      isDefault: c.id === cardId
    })))
    alert('Varsayılan kart güncellendi!')
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
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
                    title="Kartı Sil"
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

