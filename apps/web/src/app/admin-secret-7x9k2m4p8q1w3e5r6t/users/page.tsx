'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { UserRole } from '@talepo/database'
import { apiClient } from '@talepo/api'

interface User {
  id: string
  email: string
  name: string | null
  phone: string | null
  role: UserRole
  avatar: string | null
  createdAt: string
  updatedAt: string
  _count: {
    customerRequests: number
    reviews: number
    messages: number
  }
  providerProfile?: {
    id: string
    isVerified: boolean
    rating: number
    totalJobs: number
  }
}

export default function AdminUsersPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRole, setSelectedRole] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      router.push('/')
      return
    }
    fetchUsers()
  }, [isAuthenticated, user, router, selectedRole, page])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedRole !== 'all') params.append('role', selectedRole)
      params.append('page', page.toString())
      params.append('limit', '20')
      
      const response = await apiClient.get<{ data: User[]; pagination: any }>(`/admin/users?${params}`)
      setUsers(response.data || [])
      setTotalPages(response.pagination?.totalPages || 1)
    } catch (error: any) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (userId: string) => {
    if (!confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) return

    try {
      await apiClient.delete(`/admin/users/${userId}`)
      fetchUsers()
    } catch (error: any) {
      alert(error.error || 'Kullanıcı silinirken bir hata oluştu')
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setShowEditModal(true)
  }

  const handleSaveEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingUser) return

    const formData = new FormData(e.currentTarget)
    try {
      await apiClient.patch(`/admin/users/${editingUser.id}`, {
        name: formData.get('name') || null,
        email: formData.get('email'),
        phone: formData.get('phone') || null,
        role: formData.get('role')
      })
      setShowEditModal(false)
      setEditingUser(null)
      fetchUsers()
    } catch (error: any) {
      alert(error.error || 'Kullanıcı güncellenirken bir hata oluştu')
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
              <h1 className="text-2xl font-bold text-gray-900">Kullanıcı Yönetimi</h1>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={selectedRole}
                onChange={(e) => {
                  setSelectedRole(e.target.value)
                  setPage(1)
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">Tüm Roller</option>
                <option value="CUSTOMER">Müşteri</option>
                <option value="PROVIDER">Hizmet Sağlayıcı</option>
                <option value="ADMIN">Admin</option>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İstatistikler</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Oluşturulma</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {user.avatar ? (
                              <img className="h-10 w-10 rounded-full" src={user.avatar} alt={user.name || ''} />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-gray-600 font-medium">
                                  {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name || 'İsimsiz'}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                            {user.phone && <div className="text-sm text-gray-500">{user.phone}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                          user.role === 'PROVIDER' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {user.role}
                        </span>
                        {user.providerProfile?.isVerified && (
                          <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Doğrulanmış
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>Talepler: {user._count.customerRequests}</div>
                        <div>Yorumlar: {user._count.reviews}</div>
                        <div>Mesajlar: {user._count.messages}</div>
                        {user.providerProfile && (
                          <div>Puan: {user.providerProfile.rating.toFixed(1)}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
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
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Kullanıcı Düzenle</h2>
            <form onSubmit={handleSaveEdit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">İsim</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingUser.name || ''}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  defaultValue={editingUser.email}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                <input
                  type="tel"
                  name="phone"
                  defaultValue={editingUser.phone || ''}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
                <select
                  name="role"
                  defaultValue={editingUser.role}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="CUSTOMER">Müşteri</option>
                  <option value="PROVIDER">Hizmet Sağlayıcı</option>
                  <option value="ADMIN">Admin</option>
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
                    setEditingUser(null)
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

