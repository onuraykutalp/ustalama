'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { apiClient } from '@talepo/api'

interface Service {
  id: string
  title: string
  description: string | null
  price: number | null
  priceType: string
  createdAt: string
  provider: {
    user: {
      name: string | null
      email: string
    }
  }
  category: {
    name: string
  }
  _count: {
    requests: number
  }
}

export default function AdminServicesPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      router.push('/')
      return
    }
    fetchServices()
  }, [isAuthenticated, user, router, page])

  const fetchServices = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('page', page.toString())
      params.append('limit', '20')
      
      const response = await apiClient.get<{ data: Service[]; pagination: any }>(`/admin/services?${params}`)
      setServices(response.data || [])
      setTotalPages(response.pagination?.totalPages || 1)
    } catch (error: any) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (serviceId: string) => {
    if (!confirm('Bu hizmeti silmek istediğinizden emin misiniz?')) return

    try {
      await apiClient.delete(`/admin/services/${serviceId}`)
      fetchServices()
    } catch (error: any) {
      alert(error.error || 'Hizmet silinirken bir hata oluştu')
    }
  }

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/admin-secret-7x9k2m4p8q1w3e5r6t')}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Geri
              </button>
            <h1 className="text-2xl font-bold text-gray-900">Hizmet Yönetimi</h1>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hizmet</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hizmet Sağlayıcı</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fiyat</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Talepler</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {services.map((service) => (
                    <tr key={service.id}>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{service.title}</div>
                        <div className="text-sm text-gray-500 line-clamp-2">{service.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {service.category.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{service.provider.user.name || 'İsimsiz'}</div>
                        <div className="text-sm text-gray-500">{service.provider.user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {service.price ? `${service.price.toLocaleString('tr-TR')} ₺` : 'Teklif Alınır'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {service._count.requests}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDelete(service.id)}
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
    </div>
  )
}

