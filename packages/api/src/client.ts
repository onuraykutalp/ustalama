import type { 
  User, 
  Category, 
  Service, 
  Request as RequestType,
  ProviderProfile,
  Message,
  Review,
  CreateUserDto,
  UpdateUserDto,
  CreateRequestDto,
  UpdateRequestDto,
  CreateServiceDto,
  UpdateServiceDto,
  CreateCategoryDto,
  UpdateCategoryDto,
  CreateMessageDto,
  CreateReviewDto,
  UpdateReviewDto,
  CreateProviderProfileDto,
  UpdateProviderProfileDto
} from '@talepo/database'

export interface ApiResponse<T = any> {
  message?: string
  error?: string
  data?: T
  user?: T
  token?: string
}

export interface ApiError {
  error: string
  status?: number
}

export class ApiClient {
  baseUrl: string
  private token: string | null = null

  constructor(baseUrl?: string) {
    // Web için relative path, mobil için full URL
    if (baseUrl) {
      this.baseUrl = baseUrl
    } else if (typeof window !== 'undefined') {
      // Browser (Web) - relative path
      this.baseUrl = '/api'
    } else {
      // React Native (Mobile) - full URL
      this.baseUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api'
    }
  }

  setToken(token: string | null) {
    this.token = token
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error: any) {
      throw {
        error: error.message || 'Bir hata oluştu',
        status: error.status,
      } as ApiError
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  }

  async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    })
  }

  async patch<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    })
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

// Singleton instance
export const apiClient = new ApiClient()

