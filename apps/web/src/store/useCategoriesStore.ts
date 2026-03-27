import { create } from 'zustand'
import { categoriesApi } from '@talepo/api'
import type { CategoryWithRelations } from '@talepo/database'

interface CategoriesState {
  categories: CategoryWithRelations[]
  selectedCategory: CategoryWithRelations | null
  loading: boolean
  error: string | null

  // Actions
  fetchCategories: (params?: { hasServices?: boolean }) => Promise<void>
  getCategoryBySlug: (slug: string) => Promise<CategoryWithRelations | null>
  setSelectedCategory: (category: CategoryWithRelations | null) => void
  clearError: () => void
}

export const useCategoriesStore = create<CategoriesState>()((set, get) => ({
  categories: [],
  selectedCategory: null,
  loading: false,
  error: null,

  fetchCategories: async (params) => {
    set({ loading: true, error: null })
    try {
      const categories = await categoriesApi.getAll(params)
      set({ categories, loading: false, error: null })
    } catch (error: any) {
      const errorMessage = error?.error || error?.message || 'Kategoriler yüklenirken bir hata oluştu'
      set({
        error: errorMessage,
        loading: false,
        categories: []
      })
    }
  },
  
  getCategoryBySlug: async (slug: string) => {
    set({ loading: true, error: null })
    try {
      const category = await categoriesApi.getBySlug(slug)
      set({ selectedCategory: category, loading: false })
      return category
    } catch (error: any) {
      set({ 
        error: error.error || 'Kategori yüklenirken bir hata oluştu',
        loading: false 
      })
      return null
    }
  },
  
  setSelectedCategory: (category) => {
    set({ selectedCategory: category })
  },
  
  clearError: () => {
    set({ error: null })
  },
}))

