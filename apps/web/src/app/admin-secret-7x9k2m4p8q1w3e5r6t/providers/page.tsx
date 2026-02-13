'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { apiClient } from '@talepo/api'

interface Provider {
  id: string
  bio: string | null
  rating: number
  totalJobs: number
  isVerified: boolean
  createdAt: string
  user: {
    id: string
    name: string | null
    email: string
    phone: string | null
    avatar: string | null
  }
  _count: {
    services: number
    requests: number
    reviews: number
  }
}

export default function AdminProvidersPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [verifiedFilter, setVerifiedFilter] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      router.push('/')
      return
    }
    fetchProviders()
  }, [isAuthenticated, user, router, verifiedFilter, page])

  const fetchProviders = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (verifiedFilter !== 'all') params.append('verified', verifiedFilter)
      params.append('page', page.toString())
      params.append('limit', '20')
      
      const response = await apiClient.get<{ data: Provider[]; pagination: any }>(`/admin/providers?${params}`)
      setProviders(response.data || [])
      setTotalPages(response.pagination?.totalPages || 1)
    } catch (error: any) {
      console.error('Error fetching providers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (provider: Provider) => {
    setEditingProvider(provider)
    setShowEditModal(true)
  }

  const handleSaveEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingProvider) return

    const formData = new FormData(e.currentTarget)
    try {
      await apiClient.patch(`/admin/providers/${editingProvider.id}`, {
        isVerified: formData.get('isVerified') === 'true',
        bio: formData.get('bio') || null,
        rating: parseFloat(formData.get('rating') as string),
        totalJobs: parseInt(formData.get('totalJobs') as string)
      })
      setShowEditModal(false)
      setEditingProvider(null)
      fetchProviders()
    } catch (error: any) {
      alert(error.error || 'Hizmet sağlayıcı güncellenirken bir hata oluştu')
    }
  }

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/admin-secret-7x9k2m4p8q1w3e5r6t')}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Geri
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Hizmet Sağlayıcı Yönetimi</h1>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={verifiedFilter}
                onChange={(e) => {
                  setVerifiedFilter(e.target.value)
                  setPage(1)
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">Tümü</option>
                <option value="true">Doğrulanmış</option>
                <option value="false">Doğrulanmamış</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Yükleniyor...</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kullanıcı</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Puan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşler</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İstatistikler</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {providers.map((provider) => (
                    <tr key={provider.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {provider.user.avatar ? (
                              <img className="h-10 w-10 rounded-full" src={provider.user.avatar} alt={provider.user.name || ''} />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-gray-600 font-medium">
                                  {provider.user.name?.[0]?.toUpperCase() || provider.user.email[0].toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{provider.user.name || 'İsimsiz'}</div>
                            <div className="text-sm text-gray-500">{provider.user.email}</div>
                            {provider.user.phone && <div className="text-sm text-gray-500">{provider.user.phone}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          provider.isVerified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {provider.isVerified ? 'Doğrulanmış' : 'Doğrulanmamış'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {provider.rating.toFixed(1)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {provider.totalJobs}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>Hizmetler: {provider._count.services}</div>
                        <div>Talepler: {provider._count.requests}</div>
                        <div>Yorumlar: {provider._count.reviews}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(provider)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Düzenle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
              >
                Önceki
              </button>
              <span className="text-sm text-gray-700">
                Sayfa {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
              >
                Sonraki
              </button>
            </div>
          </>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && editingProvider && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Hizmet Sağlayıcı Düzenle</h2>
            <form onSubmit={handleSaveEdit}>
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isVerified"
                    defaultChecked={editingProvider.isVerified}
                    value="true"
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Doğrulanmış</span>
                </label>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Biyografi</label>
                <textarea
                  name="bio"
                  defaultValue={editingProvider.bio || ''}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Puan</label>
                <input
                  type="number"
                  name="rating"
                  defaultValue={editingProvider.rating}
                  min="0"
                  max="5"
                  step="0.1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Toplam İş</label>
                <input
                  type="number"
                  name="totalJobs"
                  defaultValue={editingProvider.totalJobs}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Kaydet
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingProvider(null)
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

