import { apiClient } from './client'
import type { User, CreateUserDto, PublicUser } from '@talepo/database'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData extends CreateUserDto {
  password: string
  confirmPassword?: string
}

export interface AuthResponse {
  user: PublicUser
  token: string
  message?: string
}

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials)
    if (response.token) {
      apiClient.setToken(response.token)
    }
    return {
      user: response.user!,
      token: response.token!,
      message: response.message || 'Giriş başarılı'
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const { confirmPassword, ...registerData } = data
    const response = await apiClient.post<AuthResponse>('/auth/register', registerData)
    if (response.token) {
      apiClient.setToken(response.token)
    }
    return {
      user: response.user!,
      token: response.token!,
      message: response.message || 'Kayıt başarılı'
    }
  },

  async logout() {
    apiClient.setToken(null)
  },

  setToken(token: string | null) {
    apiClient.setToken(token)
  }
}

