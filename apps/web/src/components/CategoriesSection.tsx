'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import CategoryCard from './CategoryCard'
import { useCategoriesStore } from '@/store/useCategoriesStore'

export default function CategoriesSection() {
  const { categories, fetchCategories, loading, error } = useCategoriesStore()

  useEffect(() => {
    fetchCategories({ hasServices: true })
  }, [fetchCategories])

  // İlk 8 kategoriyi göster
  const displayedCategories = categories.slice(0, 8).map((category) => ({
    name: category.name,
    icon: category.icon || '📦',
    description: category.description || '',
    count: category.services?.length || 0,
    href: `/kategori/${category.slug}`
  }))

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Hizmet Kategorileri
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            İhtiyacın olan hizmeti kategoriler arasından kolayca bul
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Kategoriler yükleniyor...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">Kategoriler yüklenirken bir hata oluştu: {error}</p>
            <button
              onClick={() => fetchCategories({ hasServices: true })}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Tekrar Dene
            </button>
          </div>
        ) : displayedCategories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Henüz kategori bulunmuyor.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayedCategories.map((category) => (
                <CategoryCard key={category.name} {...category} />
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/categories"
                className="inline-block text-blue-600 hover:text-blue-700 font-semibold text-lg"
              >
                Tüm Kategorileri Gör →
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

