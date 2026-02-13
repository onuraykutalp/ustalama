'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { useAdminStore } from '@/store/useAdminStore'
import Link from 'next/link'

export default function AdminDashboard() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const { stats, fetchStats, loading, error, clearError } = useAdminStore()

  useEffect(() => {
    if (!isAuthenticated) {
      // Admin paneli için özel login sayfasına yönlendir
      router.push('/admin-secret-7x9k2m4p8q1w3e5r6t/login')
      return
    }

    if (user?.role !== 'ADMIN') {
      router.push('/')
      return
    }

    // Ek güvenlik: Sadece belirli email adresine izin ver (opsiyonel)
    // Eğer NEXT_PUBLIC_ADMIN_EMAIL ayarlanmışsa, sadece o email erişebilir
    const allowedEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL
    if (allowedEmail && allowedEmail.trim() !== '' && user.email !== allowedEmail) {
      router.push('/')
      return
    }

    fetchStats()
  }, [isAuthenticated, user, router, fetchStats])

  // Email kontrolü için tekrar kontrol et
  const allowedEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL
  const isEmailAllowed = !allowedEmail || allowedEmail.trim() === '' || user?.email === allowedEmail

  if (!isAuthenticated || user?.role !== 'ADMIN' || !isEmailAllowed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Erişim Reddedildi</h2>
          <p className="text-gray-600">Bu sayfaya erişim yetkiniz yok.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Admin Paneli</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user?.email}</span>
              <Link
                href="/"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Ana Sayfa
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <p className="font-medium">Hata:</p>
            <p>{error}</p>
            <button
              onClick={() => {
                clearError()
                fetchStats()
              }}
              className="mt-2 text-sm underline hover:text-red-900"
            >
              Tekrar Dene
            </button>
          </div>
        )}

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Toplam Kullanıcılar"
              value={stats.users.total}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              }
              color="bg-blue-500"
            />
            <StatCard
              title="Toplam Talepler"
              value={stats.requests.total}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
              color="bg-green-500"
            />
            <StatCard
              title="Toplam Hizmetler"
              value={stats.services.total}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
              color="bg-purple-500"
            />
            <StatCard
              title="Toplam Kategoriler"
              value={stats.categories.total}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              }
              color="bg-yellow-500"
            />
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AdminCard
            title="Kullanıcılar"
            description="Tüm kullanıcıları görüntüle ve yönet"
            href="/admin-secret-7x9k2m4p8q1w3e5r6t/users"
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
            color="from-blue-500 to-blue-600"
          />
          <AdminCard
            title="Talepler"
            description="Tüm talepleri görüntüle, düzenle veya sil"
            href="/admin-secret-7x9k2m4p8q1w3e5r6t/requests"
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
            color="from-green-500 to-green-600"
          />
          <AdminCard
            title="Hizmetler"
            description="Tüm hizmetleri görüntüle ve yönet"
            href="/admin-secret-7x9k2m4p8q1w3e5r6t/services"
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
            color="from-purple-500 to-purple-600"
          />
          <AdminCard
            title="Kategoriler"
            description="Kategorileri görüntüle, ekle, düzenle veya sil"
            href="/admin-secret-7x9k2m4p8q1w3e5r6t/categories"
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            }
            color="from-yellow-500 to-yellow-600"
          />
          <AdminCard
            title="Değerlendirmeler"
            description="Tüm değerlendirmeleri görüntüle ve yönet"
            href="/admin-secret-7x9k2m4p8q1w3e5r6t/reviews"
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            }
            color="from-pink-500 to-pink-600"
          />
          <AdminCard
            title="Mesajlar"
            description="Tüm mesajları görüntüle ve yönet"
            href="/admin-secret-7x9k2m4p8q1w3e5r6t/messages"
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            }
            color="from-indigo-500 to-indigo-600"
          />
          <AdminCard
            title="Hizmet Sağlayıcılar"
            description="Tüm hizmet sağlayıcıları görüntüle ve yönet"
            href="/admin-secret-7x9k2m4p8q1w3e5r6t/providers"
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
            color="from-teal-500 to-teal-600"
          />
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, color }: { title: string; value: number; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`${color} rounded-lg p-3 text-white`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

function AdminCard({ title, description, href, icon, color }: { 
  title: string
  description: string
  href: string
  icon: React.ReactNode
  color: string
}) {
  return (
    <Link
      href={href}
      className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 block"
    >
      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${color} text-white flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </Link>
  )
}

