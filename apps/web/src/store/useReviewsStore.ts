import { create } from 'zustand'
import { reviewsApi } from '@talepo/api'
import type { Review, CreateReviewDto, UpdateReviewDto } from '@talepo/database'

interface ReviewsState {
  reviews: Review[]
  loading: boolean
  error: string | null
  
  // Actions
  fetchReviews: (params?: { providerId?: string; requestId?: string }) => Promise<void>
  createReview: (data: CreateReviewDto) => Promise<Review | null>
  updateReview: (id: string, data: UpdateReviewDto) => Promise<void>
  deleteReview: (id: string) => Promise<void>
  clearError: () => void
}

export const useReviewsStore = create<ReviewsState>()((set) => ({
  reviews: [],
  loading: false,
  error: null,
  
  fetchReviews: async (params) => {
    set({ loading: true, error: null })
    try {
      const reviews = await reviewsApi.getAll(params)
      set({ reviews, loading: false })
    } catch (error: any) {
      set({ 
        error: error.error || 'Değerlendirmeler yüklenirken bir hata oluştu',
        loading: false 
      })
    }
  },
  
  createReview: async (data) => {
    set({ loading: true, error: null })
    try {
      const review = await reviewsApi.create(data)
      set((state) => ({
        reviews: [review, ...state.reviews],
        loading: false
      }))
      return review
    } catch (error: any) {
      set({ 
        error: error.error || 'Değerlendirme oluşturulurken bir hata oluştu',
        loading: false 
      })
      return null
    }
  },
  
  updateReview: async (id, data) => {
    set({ loading: true, error: null })
    try {
      const updatedReview = await reviewsApi.update(id, data)
      set((state) => ({
        reviews: state.reviews.map(r => r.id === id ? updatedReview : r),
        loading: false
      }))
    } catch (error: any) {
      set({ 
        error: error.error || 'Değerlendirme güncellenirken bir hata oluştu',
        loading: false 
      })
    }
  },
  
  deleteReview: async (id) => {
    set({ loading: true, error: null })
    try {
      await reviewsApi.delete(id)
      set((state) => ({
        reviews: state.reviews.filter(r => r.id !== id),
        loading: false
      }))
    } catch (error: any) {
      set({ 
        error: error.error || 'Değerlendirme silinirken bir hata oluştu',
        loading: false 
      })
    }
  },
  
  clearError: () => {
    set({ error: null })
  },
}))

