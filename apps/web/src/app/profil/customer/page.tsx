'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { RequestStatus } from '@talepo/database'
import type { RequestWithRelations, ReviewWithRelations } from '@talepo/database'
import { useAuthStore } from '@/store/useAuthStore'
import { useRequestsStore } from '@/store/useRequestsStore'
import { useReviewsStore } from '@/store/useReviewsStore'
import MessagesList from '@/components/MessagesList'

export default function CustomerProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, fetchProfile } = useAuthStore()
  const { requests, fetchRequests } = useRequestsStore()
  const { reviews, fetchReviews } = useReviewsStore()
  const [balance] = useState(1250.50)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/login')
      return
    }

    const loadData = async () => {
      setLoading(true)
      try {
        await fetchProfile()
        if (user.id) {
          await fetchRequests({ customerId: user.id })
          await fetchReviews({ requestId: undefined }) // Customer'ın verdiği reviews
        }
      } catch (error) {
        console.error('Error loading profile data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [isAuthenticated, user, fetchProfile, fetchRequests, fetchReviews, router])

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

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.push('/')}
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Ana Sayfaya Dön
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 h-32"></div>
            <div className="px-6 pb-6 -mt-16">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg border-4 border-white">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name || ''} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span>{user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}</span>
                  )}
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name || 'İsimsiz Kullanıcı'}</h1>
                  <p className="text-gray-600 mb-2">{user.email}</p>
                  {user.phone && <p className="text-gray-600">{user.phone}</p>}
                </div>
                <button
                  onClick={() => router.push('/profil/duzenle')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Profili Düzenle
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <BalanceCard balance={balance} />
            <StatCard
              title="Toplam Talep"
              value={requests.length}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
              color="from-blue-500 to-blue-600"
            />
            <StatCard
              title="Değerlendirme"
              value={reviews.length}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              }
              color="from-yellow-500 to-yellow-600"
            />
            <StatCard
              title="Aktif Talep"
              value={requests.filter(r => r.status === RequestStatus.PENDING || r.status === RequestStatus.ACCEPTED || r.status === RequestStatus.IN_PROGRESS).length}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              color="from-green-500 to-green-600"
            />
          </div>

          {/* Requests Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Taleplerim</h2>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                + Yeni Talep Oluştur
              </button>
            </div>
            {requests.length > 0 ? (
              <div className="space-y-4">
                {requests.map((request) => (
                  <RequestCard key={request.id} request={request as RequestWithRelations} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-600 text-lg mb-4">Henüz talep oluşturmadınız</p>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  İlk Talebinizi Oluşturun
                </button>
              </div>
            )}
          </div>

          {/* Reviews Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Verdiğim Değerlendirmeler</h2>
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review as ReviewWithRelations} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">Henüz değerlendirme vermediniz</p>
              </div>
            )}
          </div>

          {/* Messages Section */}
          <div>
            <MessagesList />
          </div>
        </div>
      </div>
    </div>
  )
}

// Balance Card Component
function BalanceCard({ balance }: { balance: number }) {
  return (
    <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <h3 className="text-white/80 text-sm font-medium mb-1">Mevcut Bakiye</h3>
        <p className="text-3xl font-bold">{balance.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺</p>
      </div>
    </div>
  )
}

// Stat Card Component
function StatCard({ title, value, icon, color }: { title: string; value: string | number; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-white mb-4`}>
        {icon}
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  )
}

// Request Card Component
function RequestCard({ request }: { request: RequestWithRelations }) {
  const router = useRouter()
  const statusColors: Record<RequestStatus, string> = {
    [RequestStatus.PENDING]: 'bg-yellow-100 text-yellow-700',
    [RequestStatus.ACCEPTED]: 'bg-blue-100 text-blue-700',
    [RequestStatus.IN_PROGRESS]: 'bg-purple-100 text-purple-700',
    [RequestStatus.COMPLETED]: 'bg-green-100 text-green-700',
    [RequestStatus.CANCELLED]: 'bg-red-100 text-red-700'
  }

  const statusLabels: Record<RequestStatus, string> = {
    [RequestStatus.PENDING]: 'Beklemede',
    [RequestStatus.ACCEPTED]: 'Kabul Edildi',
    [RequestStatus.IN_PROGRESS]: 'Devam Ediyor',
    [RequestStatus.COMPLETED]: 'Tamamlandı',
    [RequestStatus.CANCELLED]: 'İptal Edildi'
  }

  return (
    <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{request.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-2">{request.description}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[request.status] || 'bg-gray-100 text-gray-700'}`}>
          {statusLabels[request.status] || request.status}
        </span>
      </div>
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center gap-4">
          {request.budget && (
            <span className="font-semibold text-gray-900">{request.budget.toLocaleString('tr-TR')} ₺</span>
          )}
          {request.location && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {request.location}
            </span>
          )}
        </div>
        <span className="text-gray-500">
          {new Date(request.createdAt).toLocaleDateString('tr-TR')}
        </span>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={() => router.push(`/profil/talepler/${request.id}`)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Mesajlar
        </button>
      </div>
    </div>
  )
}

// Review Card Component
function ReviewCard({ review }: { review: ReviewWithRelations }) {
  return (
    <div className="border border-gray-200 rounded-xl p-4">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">
          {review.user?.name?.[0]?.toUpperCase() || review.user?.email[0].toUpperCase() || 'U'}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-semibold text-gray-900">{review.request?.title || 'Değerlendirme'}</h4>
              {review.provider && (
                <p className="text-sm text-gray-600">Hizmet Sağlayıcı: {review.provider.user?.name || 'Bilinmiyor'}</p>
              )}
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.363 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
          {review.comment && (
            <p className="text-gray-700 mb-2">{review.comment}</p>
          )}
          <span className="text-sm text-gray-500">
            {new Date(review.createdAt).toLocaleDateString('tr-TR')}
          </span>
        </div>
      </div>
    </div>
  )
}

