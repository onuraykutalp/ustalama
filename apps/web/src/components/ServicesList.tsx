'use client'

import { useState, useEffect } from 'react'
import { PriceType } from '@talepo/database'
import { useServicesStore } from '@/store/useServicesStore'
import { useCategoriesStore } from '@/store/useCategoriesStore'
import { useAuthStore } from '@/store/useAuthStore'
import type { Service } from '@talepo/database'

interface ServicesListProps {
  services?: Service[]
}

export default function ServicesList({ services: initialServices = [] }: ServicesListProps) {
  const { user } = useAuthStore()
  const { services: storeServices, fetchServices, createService, updateService, deleteService, loading } = useServicesStore()
  const { categories, fetchCategories } = useCategoriesStore()
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    fetchCategories()
    if (user?.role === 'PROVIDER' && user.id) {
      // userId ile services'leri getir
      fetchServices({ userId: user.id })
    }
  }, [fetchCategories, fetchServices, user])

  // Store'dan gelen services'i kullan, yoksa initialServices'i kullan
  const displayServices = storeServices.length > 0 ? storeServices : initialServices

  const [formData, setFormData] = useState<{
    title: string
    description: string
    price: string
    priceType: PriceType
    categoryId: string
  }>({
    title: '',
    description: '',
    price: '',
    priceType: PriceType.FIXED,
    categoryId: ''
  })

  const filteredServices = displayServices.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || service.categoryId === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.categoryId) {
      alert('Lütfen bir kategori seçin')
      return
    }

    try {
      await createService({
        categoryId: formData.categoryId,
        title: formData.title,
        description: formData.description || null,
        price: formData.price ? parseFloat(formData.price) : null,
        priceType: formData.priceType,
      })
      
      // Listeyi yeniden fetch et
      if (user?.id) {
        await fetchServices({ userId: user.id })
      }
      
      setFormData({
        title: '',
        description: '',
        price: '',
        priceType: PriceType.FIXED,
        categoryId: ''
      })
      setShowAddForm(false)
    } catch (error) {
      // Error zaten store'da
      console.error('Create service error:', error)
    }
  }

  const handleEditService = (service: Service) => {
    setEditingService(service)
    setFormData({
      title: service.title,
      description: service.description || '',
      price: service.price?.toString() || '',
      priceType: service.priceType as PriceType,
      categoryId: service.categoryId
    })
    setShowAddForm(true)
  }

  const handleUpdateService = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingService) return

    try {
      await updateService(editingService.id, {
        title: formData.title,
        description: formData.description || null,
        price: formData.price ? parseFloat(formData.price) : null,
        priceType: formData.priceType,
        categoryId: formData.categoryId,
      })
      
      // Listeyi yeniden fetch et
      if (user?.id) {
        await fetchServices({ userId: user.id })
      }
      
      setFormData({
        title: '',
        description: '',
        price: '',
        priceType: PriceType.FIXED,
        categoryId: ''
      })
      setEditingService(null)
      setShowAddForm(false)
    } catch (error) {
      // Error zaten store'da
      console.error('Update service error:', error)
    }
  }

  const handleDeleteService = async (serviceId: string) => {
    if (confirm('Bu hizmeti silmek istediğinizden emin misiniz?')) {
      try {
        await deleteService(serviceId)
        // Listeyi yeniden fetch et
        if (user?.id) {
          await fetchServices({ userId: user.id })
        }
      } catch (error) {
        // Error zaten store'da
        console.error('Delete service error:', error)
      }
    }
  }

  const handleCancel = () => {
    setShowAddForm(false)
    setEditingService(null)
    setFormData({
      title: '',
      description: '',
      price: '',
      priceType: PriceType.FIXED,
      categoryId: ''
    })
  }

  const getPriceTypeLabel = (priceType: PriceType) => {
    switch (priceType) {
      case PriceType.FIXED:
        return 'Sabit Fiyat'
      case PriceType.HOURLY:
        return 'Saatlik'
      case PriceType.QUOTE:
        return 'Teklif Alınır'
      default:
        return 'Belirtilmemiş'
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Hizmetlerim</h2>
          <p className="text-gray-600">Sunmuş olduğunuz hizmetleri yönetin</p>
        </div>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-semibold shadow-lg flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Yeni Hizmet Ekle
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="mb-6 bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              {editingService ? 'Hizmeti Düzenle' : 'Yeni Hizmet Ekle'}
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

          <form onSubmit={editingService ? handleUpdateService : handleAddService} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hizmet Başlığı *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Örn: Ev Temizliği"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Açıklama
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Hizmetiniz hakkında detaylı bilgi verin..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori *
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Kategori Seçin</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fiyat Türü *
                </label>
                <select
                  value={formData.priceType}
                  onChange={(e) => {
                    const value = e.target.value as PriceType
                    setFormData({ ...formData, priceType: value })
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value={PriceType.FIXED}>Sabit Fiyat</option>
                  <option value={PriceType.HOURLY}>Saatlik</option>
                  <option value={PriceType.QUOTE}>Teklif Alınır</option>
                </select>
              </div>
            </div>

            {(formData.priceType as PriceType) !== PriceType.QUOTE && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fiyat ({(formData.priceType as PriceType) === PriceType.HOURLY ? 'Saatlik' : 'Sabit'}) (₺)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required={(formData.priceType as PriceType) !== PriceType.QUOTE}
                />
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
              >
                {editingService ? 'Güncelle' : 'Ekle'}
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
            placeholder="Hizmet ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tümü
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onEdit={() => handleEditService(service)}
              onDelete={() => handleDeleteService(service.id)}
              getPriceTypeLabel={getPriceTypeLabel}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <svg className="w-20 h-20 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchQuery || selectedCategory !== 'all' ? 'Hizmet bulunamadı' : 'Henüz hizmet eklenmemiş'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || selectedCategory !== 'all' 
              ? 'Arama kriterlerinizi değiştirerek tekrar deneyin'
              : 'İlk hizmetinizi ekleyerek başlayın'}
          </p>
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-semibold shadow-lg"
            >
              İlk Hizmetini Ekle
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// Service Card Component
function ServiceCard({
  service,
  onEdit,
  onDelete,
  getPriceTypeLabel
}: {
  service: Service
  onEdit: () => void
  onDelete: () => void
  getPriceTypeLabel: (priceType: PriceType) => string
}) {
  return (
    <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                {service.category?.name || 'Kategori Yok'}
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                {getPriceTypeLabel(service.priceType)}
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {service.title}
            </h3>
          </div>
        </div>

        {/* Description */}
        {service.description && (
          <p className="text-gray-700 mb-4 line-clamp-3">{service.description}</p>
        )}

        {/* Price */}
        <div className="mb-4">
          {service.price !== null ? (
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-blue-600">
                {service.price.toLocaleString('tr-TR')} ₺
              </span>
              {service.priceType === PriceType.HOURLY && (
                <span className="text-sm text-gray-500">/ saat</span>
              )}
            </div>
          ) : (
            <div className="text-lg font-semibold text-gray-600">
              Teklif Alınır
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={onEdit}
            className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Düzenle
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors"
            title="Sil"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Hover Effect Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all pointer-events-none" />
    </div>
  )
}

