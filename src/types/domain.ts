import { Database } from './supabase'

// Alias convenientes para las tablas de Supabase
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Tipos de dominio principales
export type Profile = Tables<'profiles'>
export type SizeProfile = Tables<'size_profiles'>
export type Collection = Tables<'collections'>
export type Product = Tables<'products'>
export type ProductVariant = Tables<'product_variants'>
export type CustomRequest = Tables<'custom_requests'>
export type Order = Tables<'orders'>
export type OrderItem = Tables<'order_items'>
export type Cart = Tables<'carts'>
export type CartItem = Tables<'cart_items'>
export type Quote = Tables<'quotes'>
export type Message = Tables<'messages'>
export type AuditLog = Tables<'audit_logs'>
export type CustomRequestMedia = Tables<'custom_request_media'>

// Enums del dominio
export type CustomRequestStatus = 
  | 'pending_quote'
  | 'quoted'
  | 'accepted'
  | 'rejected'
  | 'in_production'
  | 'ready'
  | 'shipped'

export type OrderStatus = 
  | 'pending_payment'
  | 'paid'
  | 'in_production'
  | 'ready'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export type NailShape = 
  | 'square'
  | 'round'
  | 'oval'
  | 'almond'
  | 'coffin'
  | 'stiletto'

export type NailLength = 
  | 'short'
  | 'medium'
  | 'long'
  | 'extra_long'

export type NailFinish = 
  | 'glossy'
  | 'matte'
  | 'satin'
  | 'chrome'
  | 'holographic'

// Tipos para i18n
export interface I18nContent {
  es: string
  en?: string
}

// Tipos extendidos con relaciones
export type ProductWithVariants = Product & {
  variants: ProductVariant[]
  collection?: Collection
}

export type CustomRequestWithMessages = CustomRequest & {
  messages: Message[]
  profile: Profile
  custom_request_media: CustomRequestMedia[]
  quote?: Quote
}

export type OrderWithItems = Order & {
  order_items: (OrderItem & {
    product_variant?: ProductVariant & {
      product: Product
    }
  })[]
  profile: Profile
  size_profile?: SizeProfile
}

export type CartWithItems = Cart & {
  cart_items: (CartItem & {
    product_variant: ProductVariant & {
      product: Product
    }
  })[]
}

// Tipos para formularios
export interface ContactInfo {
  name: string
  email: string
  phone?: string
}

export interface DesignPreferences {
  shape: NailShape
  length: NailLength
  colors: string[]
  finish: NailFinish
  theme?: string
}

export interface SizeMeasurements {
  thumb: number
  index: number
  middle: number
  ring: number
  pinky: number
}

export interface HandSizes {
  left: SizeMeasurements
  right: SizeMeasurements
}

export interface CustomRequestFormData {
  contact: ContactInfo
  design: DesignPreferences
  description: string
  inspirationImages: File[]
  sizes: HandSizes
}

// Tipos para filtros
export interface ProductFilters {
  shape?: NailShape[]
  length?: NailLength[]
  finish?: NailFinish[]
  collection?: string[]
  priceRange?: [number, number]
  search?: string
}

// Tipos para respuestas de API
export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Tipos para el carrito
export interface CartItemInput {
  product_variant_id: string
  quantity: number
  size_profile_id?: string
  custom_sizes?: HandSizes
}

// Tipos para autenticación
export interface AuthUser {
  id: string
  email: string
  profile?: Profile
}

// Tipos para storage
export interface StorageFile {
  name: string
  url: string
  size: number
  type: string
}