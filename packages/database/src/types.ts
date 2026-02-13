// Enums
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  PROVIDER = 'PROVIDER',
  ADMIN = 'ADMIN'
}

export enum PriceType {
  FIXED = 'FIXED',
  HOURLY = 'HOURLY',
  QUOTE = 'QUOTE'
}

export enum RequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

// Base interfaces (without relations)
export interface User {
  id: string
  email: string
  name: string | null
  phone: string | null
  password: string
  role: UserRole
  avatar: string | null
  createdAt: Date
  updatedAt: Date
}

export interface ProviderProfile {
  id: string
  userId: string
  bio: string | null
  rating: number
  totalJobs: number
  isVerified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Service {
  id: string
  providerId: string
  categoryId: string
  title: string
  description: string | null
  price: number | null
  priceType: PriceType
  createdAt: Date
  updatedAt: Date
}

export interface Request {
  id: string
  customerId: string
  providerId: string | null
  serviceId: string | null
  title: string
  description: string
  status: RequestStatus
  budget: number | null
  location: string | null
  createdAt: Date
  updatedAt: Date
  completedAt: Date | null
}

export interface Message {
  id: string
  requestId: string
  senderId: string
  content: string
  createdAt: Date
}

export interface Review {
  id: string
  requestId: string
  userId: string
  providerId: string
  rating: number
  comment: string | null
  createdAt: Date
  updatedAt: Date
}

// Interfaces with relations (for includes)
export interface UserWithRelations extends User {
  customerRequests?: Request[]
  providerProfile?: ProviderProfileWithRelations
  reviews?: Review[]
  messages?: Message[]
}

export interface ProviderProfileWithRelations extends ProviderProfile {
  user?: User
  services?: Service[]
  requests?: Request[]
  reviews?: Review[]
}

export interface CategoryWithRelations extends Category {
  services?: Service[]
}

export interface ServiceWithRelations extends Service {
  provider?: ProviderProfileWithRelations
  category?: Category
  requests?: Request[]
}

export interface RequestWithRelations extends Request {
  customer?: User
  provider?: ProviderProfileWithRelations
  service?: Service
  messages?: Message[]
  reviews?: Review[]
}

export interface MessageWithRelations extends Message {
  request?: Request
  sender?: User
}

export interface ReviewWithRelations extends Review {
  request?: Request
  user?: User
  provider?: ProviderProfileWithRelations
}

// Create/Update DTOs (without id, timestamps, and relations)
export interface CreateUserDto {
  email: string
  name?: string | null
  phone?: string | null
  password: string
  role?: UserRole
  avatar?: string | null
}

export interface UpdateUserDto {
  email?: string
  name?: string | null
  phone?: string | null
  password?: string
  role?: UserRole
  avatar?: string | null
}

export interface CreateProviderProfileDto {
  userId: string
  bio?: string | null
  isVerified?: boolean
}

export interface UpdateProviderProfileDto {
  bio?: string | null
  rating?: number
  totalJobs?: number
  isVerified?: boolean
}

export interface CreateCategoryDto {
  name: string
  slug: string
  description?: string | null
  icon?: string | null
}

export interface UpdateCategoryDto {
  name?: string
  slug?: string
  description?: string | null
  icon?: string | null
}

export interface CreateServiceDto {
  providerId: string
  categoryId: string
  title: string
  description?: string | null
  price?: number | null
  priceType?: PriceType
}

export interface UpdateServiceDto {
  title?: string
  description?: string | null
  price?: number | null
  priceType?: PriceType
  categoryId?: string
}

export interface CreateRequestDto {
  customerId: string
  providerId?: string | null
  serviceId?: string | null
  title: string
  description: string
  status?: RequestStatus
  budget?: number | null
  location?: string | null
}

export interface UpdateRequestDto {
  providerId?: string | null
  serviceId?: string | null
  title?: string
  description?: string
  status?: RequestStatus
  budget?: number | null
  location?: string | null
  completedAt?: Date | null
}

export interface CreateMessageDto {
  requestId: string
  senderId: string
  content: string
}

export interface CreateReviewDto {
  requestId: string
  userId: string
  providerId: string
  rating: number
  comment?: string | null
}

export interface UpdateReviewDto {
  rating?: number
  comment?: string | null
}

// Public interfaces (without sensitive data like password)
export interface PublicUser {
  id: string
  email: string
  name: string | null
  phone: string | null
  role: UserRole
  avatar: string | null
  createdAt: Date
  updatedAt: Date
}

export interface UserWithoutPassword extends Omit<User, 'password'> {}

