'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { apiClient } from '@talepo/api'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  createdAt: string
  _count: {
    services: number
  }
}

export default function AdminCategoriesPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      router.push('/')
      return
    }
    fetchCategories()
  }, [isAuthenticated, user, router])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const response = await apiClient.get<{ data: Category[] }>('/admin/categories')
      setCategories(response.data || [])
    } catch (error: any) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (categoryId: string) => {
    if (!confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) return

    try {
      await apiClient.delete(`/admin/categories/${categoryId}`)
      fetchCategories()
    } catch (error: any) {
      alert(error.error || 'Kategori silinirken bir hata oluştu')
    }
  }

  const handleAdd = () => {
    setEditingCategory(null)
    setShowAddModal(true)
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setShowAddModal(true)
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    try {
      if (editingCategory) {
        await apiClient.patch(`/admin/categories/${editingCategory.id}`, {
          name: formData.get('name'),
          slug: formData.get('slug'),
          description: formData.get('description') || null,
          icon: formData.get('icon') || null
        })
      } else {
        await apiClient.post('/admin/categories', {
          name: formData.get('name'),
          slug: formData.get('slug'),
          description: formData.get('description') || null,
          icon: formData.get('icon') || null
        })
      }
      setShowAddModal(false)
      setEditingCategory(null)
      fetchCategories()
    } catch (error: any) {
      alert(error.error || 'Kategori kaydedilirken bir hata oluştu')
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
              <h1 className="text-2xl font-bold text-gray-900">Kategori Yönetimi</h1>
            </div>
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              + Kategori Ekle
            </button>
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
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hizmetler</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{category.name}</div>
                      {category.description && (
                        <div className="text-sm text-gray-500">{category.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {category.slug}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {category._count.services}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(category)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
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
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              {editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori'}
            </h2>
            <form onSubmit={handleSave}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">İsim *</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingCategory?.name || ''}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Slug *</label>
                <input
                  type="text"
                  name="slug"
                  defaultValue={editingCategory?.slug || ''}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                <textarea
                  name="description"
                  defaultValue={editingCategory?.description || ''}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">İkon</label>
                <input
                  type="text"
                  name="icon"
                  defaultValue={editingCategory?.icon || ''}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="İkon URL veya emoji"
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
                    setShowAddModal(false)
                    setEditingCategory(null)
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

