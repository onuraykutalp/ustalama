'use client'

import { useState, useEffect } from 'react'
import { RequestStatus } from '@talepo/database'
import type { RequestWithRelations } from '@talepo/database'
import { useRequestsStore } from '@/store/useRequestsStore'
import { useCategoriesStore } from '@/store/useCategoriesStore'
import { useAuthStore } from '@/store/useAuthStore'

interface CustomerRequestsListProps {
  requests?: RequestWithRelations[]
}

export default function CustomerRequestsList({ requests: initialRequests = [] }: CustomerRequestsListProps) {
  const { user } = useAuthStore()
  const { requests: storeRequests, fetchRequests, createRequest, updateRequest, deleteRequest, loading } = useRequestsStore()
  const { categories, fetchCategories } = useCategoriesStore()
  const [requests, setRequests] = useState<RequestWithRelations[]>(initialRequests)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingRequest, setEditingRequest] = useState<RequestWithRelations | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchCategories()
    if (user?.id) {
      fetchRequests({ customerId: user.id })
    }
  }, [fetchCategories, fetchRequests, user])

  // Store'dan gelen requests'i kullan
  useEffect(() => {
    if (storeRequests.length > 0) {
      setRequests(storeRequests as RequestWithRelations[])
    }
  }, [storeRequests])

  // Dummy requests if none provided
  const dummyRequests = (requests.length === 0 ? [
    {
      id: '1',
      customerId: 'user1',
      providerId: null,
      serviceId: null,
      title: 'Ev Temizliği İhtiyacı',
      description: '3+1 daire için haftalık temizlik hizmeti arıyorum. Düzenli olarak her hafta gelinmesini istiyorum.',
      status: RequestStatus.PENDING as RequestStatus,
      budget: 2500,
      location: 'Kadıköy, İstanbul',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      completedAt: null,
      customer: {
        id: 'user1',
        email: 'user@example.com',
        name: 'Ahmet Yılmaz',
        phone: null,
        password: '',
        role: 'CUSTOMER' as any,
        avatar: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      provider: undefined,
      service: undefined,
      messages: [],
      reviews: []
    },
    {
      id: '2',
      customerId: 'user1',
      providerId: 'provider1',
      serviceId: null,
      title: 'Elektrik Tamiri',
      description: 'Evdeki elektrik prizlerinde sorun var. Acil müdahale gerekiyor.',
      status: RequestStatus.ACCEPTED as RequestStatus,
      budget: 800,
      location: 'Ümraniye, İstanbul',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      completedAt: null,
      customer: {
        id: 'user1',
        email: 'user@example.com',
        name: 'Ahmet Yılmaz',
        phone: null,
        password: '',
        role: 'CUSTOMER' as any,
        avatar: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      provider: {
        id: 'provider1',
        userId: 'provider1',
        bio: null,
        rating: 4.8,
        totalJobs: 10,
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          id: 'provider1',
          email: 'provider@example.com',
          name: 'Mehmet Demir',
          phone: null,
          password: '',
          role: 'PROVIDER' as any,
          avatar: null,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      },
      service: undefined,
      messages: [],
      reviews: []
    }
  ] : []) as RequestWithRelations[]

  const displayRequests = requests.length > 0 ? requests : dummyRequests

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    location: '',
    categoryId: ''
  })

  const filteredRequests = displayRequests.filter(request => {
    const matchesStatus = selectedStatus === 'all' || request.status === selectedStatus
    const matchesSearch = request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.location?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user?.id) {
      alert('Giriş yapmanız gerekiyor')
      return
    }

    try {
      await createRequest({
        customerId: user.id,
        serviceId: formData.categoryId || null,
        title: formData.title,
        description: formData.description,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        location: formData.location || null,
      })
      
      setFormData({
        title: '',
        description: '',
        budget: '',
        location: '',
        categoryId: ''
      })
      setShowAddForm(false)
    } catch (error) {
      // Error zaten store'da
    }
  }

  const handleEditRequest = (request: RequestWithRelations) => {
    setEditingRequest(request)
    setFormData({
      title: request.title,
      description: request.description,
      budget: request.budget?.toString() || '',
      location: request.location || '',
      categoryId: ''
    })
    setShowAddForm(true)
  }

  const handleUpdateRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingRequest || !user?.id) return

    try {
      await updateRequest(editingRequest.id, {
        title: formData.title,
        description: formData.description,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        location: formData.location || null,
      })
      
      // Listeyi yeniden fetch et
      await fetchRequests({ customerId: user.id })
      
      setFormData({
        title: '',
        description: '',
        budget: '',
        location: '',
        categoryId: ''
      })
      setEditingRequest(null)
      setShowAddForm(false)
    } catch (error) {
      // Error zaten store'da
      console.error('Update request error:', error)
    }
  }

  const handleDeleteRequest = async (requestId: string) => {
    if (confirm('Bu iş ilanını silmek istediğinizden emin misiniz?')) {
      try {
        await deleteRequest(requestId)
        // Listeyi yeniden fetch et
        if (user?.id) {
          await fetchRequests({ customerId: user.id })
        }
      } catch (error) {
        // Error zaten store'da
        console.error('Delete request error:', error)
      }
    }
  }

  const handleCancel = () => {
    setShowAddForm(false)
    setEditingRequest(null)
    setFormData({
      title: '',
      description: '',
      budget: '',
      location: '',
      categoryId: ''
    })
  }

  const statusColors: Record<RequestStatus, string> = {
    [RequestStatus.PENDING]: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    [RequestStatus.ACCEPTED]: 'bg-blue-100 text-blue-700 border-blue-200',
    [RequestStatus.IN_PROGRESS]: 'bg-purple-100 text-purple-700 border-purple-200',
    [RequestStatus.COMPLETED]: 'bg-green-100 text-green-700 border-green-200',
    [RequestStatus.CANCELLED]: 'bg-red-100 text-red-700 border-red-200'
  }

  const statusLabels: Record<RequestStatus, string> = {
    [RequestStatus.PENDING]: 'Beklemede',
    [RequestStatus.ACCEPTED]: 'Kabul Edildi',
    [RequestStatus.IN_PROGRESS]: 'Devam Ediyor',
    [RequestStatus.COMPLETED]: 'Tamamlandı',
    [RequestStatus.CANCELLED]: 'İptal Edildi'
  }

  const formatTimeAgo = (date: Date | string) => {
    const now = new Date()
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)
    
    if (diffInSeconds < 60) return `${diffInSeconds} saniye önce`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} dakika önce`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} saat önce`
    return `${Math.floor(diffInSeconds / 86400)} gün önce`
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Taleplerim</h2>
          <p className="text-gray-600">Verdiğiniz iş ilanlarını yönetin</p>
        </div>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-semibold shadow-lg flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Yeni İş İlanı Oluştur
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="mb-6 bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              {editingRequest ? 'İş İlanını Düzenle' : 'Yeni İş İlanı Oluştur'}
            </h3>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={editingRequest ? handleUpdateRequest : handleCreateRequest} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                İş Başlığı *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Örn: Ev Temizliği İhtiyacı"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Açıklama *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="İhtiyacınızı detaylı bir şekilde açıklayın..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bütçe (₺)
                </label>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
                <p className="text-xs text-gray-500 mt-1">Opsiyonel - Bütçe belirtmek zorunlu değildir</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Konum
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Örn: Kadıköy, İstanbul"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
              >
                {editingRequest ? 'Güncelle' : 'İlanı Yayınla'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Talep ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
          {['all', RequestStatus.PENDING, RequestStatus.ACCEPTED, RequestStatus.IN_PROGRESS, RequestStatus.COMPLETED, RequestStatus.CANCELLED].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                selectedStatus === status
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'Tümü' : statusLabels[status as RequestStatus]}
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      {filteredRequests.length > 0 ? (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              onEdit={() => handleEditRequest(request)}
              onDelete={() => handleDeleteRequest(request.id)}
              statusColors={statusColors}
              statusLabels={statusLabels}
              formatTimeAgo={formatTimeAgo}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <svg className="w-20 h-20 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchQuery || selectedStatus !== 'all' ? 'Talep bulunamadı' : 'Henüz iş ilanı oluşturulmamış'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || selectedStatus !== 'all'
              ? 'Arama kriterlerinizi değiştirerek tekrar deneyin'
              : 'İlk iş ilanınızı oluşturarak başlayın'}
          </p>
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-semibold shadow-lg"
            >
              İlk İş İlanını Oluştur
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// Request Card Component
function RequestCard({
  request,
  onEdit,
  onDelete,
  statusColors,
  statusLabels,
  formatTimeAgo
}: {
  request: RequestWithRelations
  onEdit: () => void
  onDelete: () => void
  statusColors: Record<RequestStatus, string>
  statusLabels: Record<RequestStatus, string>
  formatTimeAgo: (date: Date | string) => string
}) {
  return (
    <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[request.status] || statusColors[RequestStatus.PENDING]}`}>
                {statusLabels[request.status] || statusLabels[RequestStatus.PENDING]}
              </span>
              <span className="text-sm text-gray-500">{formatTimeAgo(request.createdAt)}</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {request.title}
            </h3>
            <p className="text-gray-700 mb-3 line-clamp-2">{request.description}</p>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {request.budget && (
            <div className="flex items-center gap-2 text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold text-gray-900">{request.budget.toLocaleString('tr-TR')} ₺</span>
            </div>
          )}
          {request.location && (
            <div className="flex items-center gap-2 text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{request.location}</span>
            </div>
          )}
          {request.provider && (
            <div className="flex items-center gap-2 text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Hizmet Sağlayıcı: {request.provider.user?.name || 'Belirtilmemiş'}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          {request.status === RequestStatus.PENDING && (
            <button
              onClick={onEdit}
              className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Düzenle
            </button>
          )}
          {request.status === RequestStatus.PENDING && (
            <button
              onClick={onDelete}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors"
              title="Sil"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
          {request.provider && (
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.href = `/profil/talepler/${request.id}`
                }
              }}
              className="flex-1 px-4 py-2 bg-green-50 text-green-600 rounded-lg font-medium hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Mesajlaş
            </button>
          )}
        </div>
      </div>

      {/* Hover Effect Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all pointer-events-none" />
    </div>
  )
}

