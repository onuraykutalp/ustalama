import { apiClient } from './client'
import type { Category, CreateCategoryDto, UpdateCategoryDto } from '@talepo/database'

export const categoriesApi = {
  async getAll(): Promise<Category[]> {
    const response = await apiClient.get<Category[]>('/categories')
    return response.data || []
  },

  async getBySlug(slug: string): Promise<Category | null> {
    const response = await apiClient.get<Category>(`/categories?slug=${slug}`)
    return response.data || null
  },

  async create(data: CreateCategoryDto): Promise<Category> {
    const response = await apiClient.post<Category>('/categories', data)
    return response.data!
  },

  async update(id: string, data: UpdateCategoryDto): Promise<Category> {
    const response = await apiClient.patch<Category>(`/categories/${id}`, data)
    return response.data!
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/categories/${id}`)
  },
}

