// Enhanced EBike interface with better type safety and validation
export interface EBike {
  readonly id: string
  readonly brand: string
  readonly model_name: string
  readonly version?: string
  readonly price: number
  readonly currency: Currency
  readonly build_date?: Date
  readonly gender_type: GenderType
  readonly action_radius_text?: string
  readonly action_radius_km?: number
  readonly battery_capacity?: number
  readonly top_speed_text?: string
  readonly top_speed_kmh?: number
  readonly image_url?: string
  readonly images?: string[]
  readonly affiliate_url: string
  readonly cpl_rate: number
  readonly description?: string
  readonly bike_type?: BikeType
  readonly color?: Color
  readonly motor_location?: MotorLocation
  readonly removable_battery?: boolean
  readonly on_sale?: boolean
  readonly created_at: Date
  readonly updated_at: Date
}

// Type-safe enums for better validation
export type Currency = 'EUR' | 'USD' | 'GBP' | 'CHF'
export type GenderType = 'man' | 'vrouw' | 'unisex'
export type BikeType = 'stadsfiets' | 'transport' | 'vouwfiets' | 'mountainbike' | 'trekking' | 'premium' | 'bakfiets' | 'racefiets'
export type Color = 'zwart' | 'wit' | 'grijs' | 'blauw' | 'rood' | 'groen' | 'geel' | 'oranje'
export type MotorLocation = 'midden' | 'achterwiel' | 'voorwiel' | 'midden-achterwiel'
export type BatteryLocation = 'in-frame' | 'frame' | 'bagagedrager' | 'onder-frame'
export type DriveType = 'ketting' | 'riem' | 'naaf'
export type FrameMaterial = 'aluminium' | 'staal' | 'carbon' | 'titanium'
export type LockType = 'accuslot' | 'ringslot' | 'kabelslot' | 'geen'

// Enhanced EBike creation interface for validation
export interface CreateEBikeInput {
  brand: string
  model_name: string
  version?: string
  price: number
  currency: Currency
  build_date?: Date
  gender_type: GenderType
  action_radius_text?: string
  action_radius_km?: number
  battery_capacity?: number
  top_speed_text?: string
  top_speed_kmh?: number
  image_url?: string
  affiliate_url: string
  cpl_rate: number
  description?: string
}

// EBike update interface (partial updates allowed)
export interface UpdateEBikeInput extends Partial<CreateEBikeInput> {
  id: string
}

// Validation result type for better error handling
export interface ValidationResult<T> {
  success: boolean
  data?: T
  errors: ValidationError[]
}

export interface ValidationError {
  field: string
  message: string
  code: string
}

// EBike search criteria with validation
export interface EBikeSearchCriteria {
  query?: string
  brand?: string
  gender_type?: GenderType
  price_range?: {
    min: number
    max: number
  }
  action_radius_range?: {
    min: number
    max: number
  }
  battery_capacity_range?: {
    min: number
    max: number
  }
  top_speed_range?: {
    min: number
    max: number
  }
  bike_type?: BikeType
  color?: Color
  motor_location?: MotorLocation
  battery_location?: BatteryLocation
  drive_type?: DriveType
  frame_material?: FrameMaterial
  removable_battery?: boolean
  art_certification?: number
  lock_type?: LockType
  on_sale?: boolean
  sort_by?: 'price' | 'action_radius' | 'battery_capacity' | 'top_speed' | 'created_at'
  sort_order?: 'asc' | 'desc'
  limit?: number
  offset?: number
}

// Legacy EBikeFilters interface for backward compatibility
export interface EBikeFilters {
  brand?: string
  gender_type?: GenderType
  min_price?: number
  max_price?: number
  min_action_radius?: number
  max_action_radius?: number
  min_battery_capacity?: number
  max_battery_capacity?: number
  min_top_speed?: number
  max_top_speed?: number
  bike_type?: BikeType
  color?: Color
  motor_location?: MotorLocation
  battery_location?: BatteryLocation
  drive_type?: DriveType
  frame_material?: FrameMaterial
  removable_battery?: boolean
  art_certification?: number
  lock_type?: LockType
  on_sale?: boolean
}

// Enhanced API response types
export interface EBikeListResponse {
  data: EBike[]
  total: number
  page: number
  limit: number
  has_more: boolean
}

export interface EBikeDetailResponse {
  data: EBike
  related_ebikes: EBike[]
  dealer_info: DealerInfo[]
}

export interface DealerInfo {
  id: string
  name: string
  location: string
  distance_km?: number
  price: number
  currency: Currency
  availability: 'in_stock' | 'limited' | 'out_of_stock' | 'pre_order'
  contact_info: {
    phone?: string
    email?: string
    website?: string
  }
}

// Error types for better error handling
export interface EBikeError extends Error {
  code: string
  field?: string
  statusCode?: number
}

export class EBikeValidationError extends Error implements EBikeError {
  public readonly code = 'VALIDATION_ERROR'
  public readonly field?: string
  public readonly statusCode = 400

  constructor(message: string, field?: string) {
    super(message)
    this.name = 'EBikeValidationError'
    this.field = field
  }
}

export class EBikeNotFoundError extends Error implements EBikeError {
  public readonly code = 'EBIKE_NOT_FOUND'
  public readonly statusCode = 404

  constructor(id: string) {
    super(`EBike with id ${id} not found`)
    this.name = 'EBikeNotFoundError'
  }
}

export class EBikeServiceError extends Error implements EBikeError {
  public readonly code = 'SERVICE_ERROR'
  public readonly statusCode = 500

  constructor(message: string, originalError?: Error) {
    super(message)
    this.name = 'EBikeServiceError'
    if (originalError) {
      this.cause = originalError
    }
  }
}

// Enhanced EBikeFilters interface with comprehensive filtering options
export interface EBikeFilters {
  // Basic filters
  brand?: string
  gender_type?: GenderType
  bike_type?: BikeType
  color?: Color
  
  // Price and performance ranges
  min_price?: number
  max_price?: number
  min_action_radius?: number
  max_action_radius?: number
  min_battery_capacity?: number
  max_battery_capacity?: number
  min_top_speed?: number
  max_top_speed?: number
  min_torque?: number
  max_torque?: number
  min_weight?: number
  max_weight?: number
  
  // Motor specifications
  motor_location?: MotorLocation
  motor_brand?: string
  motor_type?: string
  torque_range?: string
  
  // Drivetrain and mechanics
  gear_type?: string
  brake_type?: string
  drive_type?: string
  frame_material?: string
  wheel_size?: string
  suspension_type?: string
  
  // Battery specifications
  battery_type?: string
  battery_position?: string
  removable_battery?: boolean
  
  // Features and accessories
  seating_position?: string
  lighting_type?: string
  display_type?: string
  connectivity_type?: string
  
  // Special features
  special_features?: string[]
  warranty_range?: string
  
  // Status and availability
  on_sale?: boolean
  new_collection?: boolean
  outlet?: boolean
  free_shipping?: boolean
}

