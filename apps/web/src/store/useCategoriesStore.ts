import { create } from 'zustand'
import { categoriesApi } from '@talepo/api'
import type { Category } from '@talepo/database'

interface CategoriesState {
  categories: Category[]
  selectedCategory: Category | null
  loading: boolean
  error: string | null
  
  // Actions
  fetchCategories: () => Promise<void>
  getCategoryBySlug: (slug: string) => Promise<Category | null>
  setSelectedCategory: (category: Category | null) => void
  clearError: () => void
}

export const useCategoriesStore = create<CategoriesState>()((set, get) => ({
  categories: [],
  selectedCategory: null,
  loading: false,
  error: null,
  
  fetchCategories: async () => {
    set({ loading: true, error: null })
    try {
      const categories = await categoriesApi.getAll()
      set({ categories, loading: false })
    } catch (error: any) {
      set({ 
        error: error.error || 'Kategoriler yüklenirken bir hata oluştu',
        loading: false 
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

