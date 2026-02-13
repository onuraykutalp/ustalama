// Export API client
export { apiClient, ApiClient } from './client'
export type { ApiResponse, ApiError } from './client'

// Export all API modules
export * from './auth'
export * from './categories'
export * from './services'
export * from './requests'
export * from './messages'
export * from './reviews'
export * from './providers'
export * from './opportunities'
export * from './proposals'

// Re-export for convenience
export { authApi } from './auth'
export { categoriesApi } from './categories'
export { servicesApi } from './services'
export { requestsApi } from './requests'
export { messagesApi } from './messages'
export { reviewsApi } from './reviews'
export { providersApi } from './providers'
export { opportunitiesApi } from './opportunities'
export { proposalsApi } from './proposals'

