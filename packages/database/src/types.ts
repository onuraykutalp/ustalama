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

export enum PaymentType {
  BALANCE_DEPOSIT = 'BALANCE_DEPOSIT',
  PREMIUM_PURCHASE = 'PREMIUM_PURCHASE',
  SERVICE_PAYMENT = 'SERVICE_PAYMENT'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  AWAITING_3DS = 'AWAITING_3DS',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED'
}

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  PREMIUM = 'PREMIUM',
  REFUND = 'REFUND'
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
  balance: number
  cardUserKey: string | null
  isPremium: boolean
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
export interface Payment {
  id: string
  userId: string
  conversationId: string
  paymentId: string | null
  amount: number
  paidAmount: number
  currency: string
  installment: number
  paymentType: PaymentType
  status: PaymentStatus
  cardLast4: string | null
  cardBrand: string | null
  description: string | null
  errorMessage: string | null
  dataJson: string | null
  ip: string | null
  createdAt: Date
  updatedAt: Date
}

export interface SavedCard {
  id: string
  userId: string
  cardToken: string
  cardAlias: string | null
  cardLast4: string
  cardBrand: string
  cardBankName: string | null
  isDefault: boolean
  createdAt: Date
}

export interface Transaction {
  id: string
  userId: string
  paymentId: string | null
  type: TransactionType
  amount: number
  balanceBefore: number
  balanceAfter: number
  description: string | null
  createdAt: Date
}

export interface UserWithRelations extends User {
  customerRequests?: Request[]
  providerProfile?: ProviderProfileWithRelations
  reviews?: Review[]
  messages?: Message[]
  payments?: Payment[]
  savedCards?: SavedCard[]
  transactions?: Transaction[]
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
  balance: number
  isPremium: boolean
  createdAt: Date
  updatedAt: Date
}

export interface UserWithoutPassword extends Omit<User, 'password'> {}

