import { apiClient } from './client'
import type { Category, CategoryWithRelations, CreateCategoryDto, UpdateCategoryDto } from '@talepo/database'

export interface GetCategoriesParams {
  hasServices?: boolean
}

export const categoriesApi = {
  async getAll(params?: GetCategoriesParams): Promise<CategoryWithRelations[]> {
    const queryParams = new URLSearchParams()
    if (params?.hasServices) queryParams.append('hasServices', 'true')

    const query = queryParams.toString()
    const endpoint = `/categories${query ? `?${query}` : ''}`
    const response = await apiClient.get<CategoryWithRelations[]>(endpoint)
    return response.data && Array.isArray(response.data) ? response.data : []
  },

  async getBySlug(slug: string): Promise<CategoryWithRelations | null> {
    const response = await apiClient.get<CategoryWithRelations>(`/categories?slug=${slug}`)
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

