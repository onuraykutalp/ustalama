'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { RequestStatus } from '@talepo/database'
import { apiClient } from '@talepo/api'

interface Request {
  id: string
  title: string
  description: string
  status: RequestStatus
  budget: number | null
  location: string | null
  createdAt: string
  updatedAt: string
  customer: {
    id: string
    name: string | null
    email: string
  }
  provider?: {
    user: {
      id: string
      name: string | null
      email: string
    }
  }
  service?: {
    title: string
    category: {
      name: string
    }
  }
  _count: {
    messages: number
    reviews: number
  }
}

export default function AdminRequestsPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [editingRequest, setEditingRequest] = useState<Request | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      router.push('/')
      return
    }
    fetchRequests()
  }, [isAuthenticated, user, router, selectedStatus, page])

  const fetchRequests = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedStatus !== 'all') params.append('status', selectedStatus)
      params.append('page', page.toString())
      params.append('limit', '20')
      
      const response = await apiClient.get<{ data: Request[]; pagination: any }>(`/admin/requests?${params}`)
      setRequests(response.data || [])
      setTotalPages(response.pagination?.totalPages || 1)
    } catch (error: any) {
      console.error('Error fetching requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (requestId: string) => {
    if (!confirm('Bu talebi silmek istediğinizden emin misiniz?')) return

    try {
      await apiClient.delete(`/admin/requests/${requestId}`)
      fetchRequests()
    } catch (error: any) {
      alert(error.error || 'Talep silinirken bir hata oluştu')
    }
  }

  const handleEdit = (request: Request) => {
    setEditingRequest(request)
    setShowEditModal(true)
  }

  const handleSaveEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingRequest) return

    const formData = new FormData(e.currentTarget)
    try {
      await apiClient.patch(`/admin/requests/${editingRequest.id}`, {
        status: formData.get('status')
      })
      setShowEditModal(false)
      setEditingRequest(null)
      fetchRequests()
    } catch (error: any) {
      alert(error.error || 'Talep güncellenirken bir hata oluştu')
    }
  }

  const statusColors: Record<RequestStatus, string> = {
    [RequestStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
    [RequestStatus.ACCEPTED]: 'bg-blue-100 text-blue-800',
    [RequestStatus.IN_PROGRESS]: 'bg-purple-100 text-purple-800',
    [RequestStatus.COMPLETED]: 'bg-green-100 text-green-800',
    [RequestStatus.CANCELLED]: 'bg-red-100 text-red-800'
  }

  const statusLabels: Record<RequestStatus, string> = {
    [RequestStatus.PENDING]: 'Beklemede',
    [RequestStatus.ACCEPTED]: 'Kabul Edildi',
    [RequestStatus.IN_PROGRESS]: 'Devam Ediyor',
    [RequestStatus.COMPLETED]: 'Tamamlandı',
    [RequestStatus.CANCELLED]: 'İptal Edildi'
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
              <h1 className="text-2xl font-bold text-gray-900">Talep Yönetimi</h1>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value)
                  setPage(1)
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="PENDING">Beklemede</option>
                <option value="ACCEPTED">Kabul Edildi</option>
                <option value="IN_PROGRESS">Devam Ediyor</option>
                <option value="COMPLETED">Tamamlandı</option>
                <option value="CANCELLED">İptal Edildi</option>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Talep</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Müşteri</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hizmet Sağlayıcı</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bütçe</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Oluşturulma</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {requests.map((request) => (
                    <tr key={request.id}>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{request.title}</div>
                        <div className="text-sm text-gray-500 line-clamp-2">{request.description}</div>
                        {request.service && (
                          <div className="text-xs text-gray-400 mt-1">
                            {request.service.category.name} - {request.service.title}
                          </div>
                        )}
                        <div className="text-xs text-gray-400 mt-1">
                          Mesajlar: {request._count.messages} | Yorumlar: {request._count.reviews}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{request.customer.name || 'İsimsiz'}</div>
                        <div className="text-sm text-gray-500">{request.customer.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {request.provider ? (
                          <>
                            <div className="text-sm text-gray-900">{request.provider.user.name || 'İsimsiz'}</div>
                            <div className="text-sm text-gray-500">{request.provider.user.email}</div>
                          </>
                        ) : (
                          <span className="text-sm text-gray-400">Atanmamış</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[request.status]}`}>
                          {statusLabels[request.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {request.budget ? `${request.budget.toLocaleString('tr-TR')} ₺` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(request.createdAt).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(request)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => handleDelete(request.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Sil
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
      {showEditModal && editingRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Talep Düzenle</h2>
            <form onSubmit={handleSaveEdit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Durum</label>
                <select
                  name="status"
                  defaultValue={editingRequest.status}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="PENDING">Beklemede</option>
                  <option value="ACCEPTED">Kabul Edildi</option>
                  <option value="IN_PROGRESS">Devam Ediyor</option>
                  <option value="COMPLETED">Tamamlandı</option>
                  <option value="CANCELLED">İptal Edildi</option>
                </select>
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
                    setEditingRequest(null)
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

