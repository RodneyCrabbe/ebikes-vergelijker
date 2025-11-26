export interface User {
  id: string
  email: string
  name?: string
  phone?: string
  address?: string
  avatar_url?: string
  newsletter_subscribed: boolean
  created_at: string
  postcode?: string
  city?: string
  province?: string
  coordinates?: {
    lat: number
    lng: number
  }
  // Enhanced profile fields
  riding_style?: RidingStyle
  preferred_brands?: string[]
  price_range_min?: number
  price_range_max?: number
  badges?: UserBadge[]
  activity_points?: number
  bio?: string
  location?: string
  experience_level?: ExperienceLevel
  notification_preferences?: NotificationPreferences
}

export type RidingStyle = 'city' | 'mountain' | 'commute' | 'touring' | 'cargo' | 'folding' | 'fat_bike' | 'road' | 'hybrid'

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert'

export interface UserBadge {
  id: string
  type: string
  title: string
  description: string
  icon: string
  unlocked_at: string
}

export interface NotificationPreferences {
  email: boolean
  push: boolean
  price_alerts: boolean
  new_reviews: boolean
  appointment_reminders: boolean
  weekly_digest: boolean
}

export interface UserActivity {
  id: string
  user_id: string
  activity_type: ActivityType
  activity_data?: Record<string, any>
  points_earned: number
  created_at: string
}

export type ActivityType = 
  | 'bike_view' 
  | 'bike_compare' 
  | 'review_posted' 
  | 'favorite_added' 
  | 'appointment_booked' 
  | 'profile_updated' 
  | 'search_performed'
  | 'achievement_unlocked'

export interface UserPreferences {
  id: string
  user_id: string
  bike_types: string[]
  max_weight?: number
  min_range_km?: number
  max_price?: number
  preferred_colors: string[]
  must_have_features: string[]
  nice_to_have_features: string[]
  created_at: string
  updated_at: string
}

export interface UserBikeHistory {
  id: string
  user_id: string
  ebike_id: string
  ownership_type: 'owned' | 'test_rode' | 'rented' | 'borrowed'
  start_date?: string
  end_date?: string
  mileage_km?: number
  maintenance_notes?: string
  satisfaction_rating?: number
  created_at: string
}

export interface MaintenanceReminder {
  id: string
  user_id: string
  bike_history_id: string
  reminder_type: string
  due_date: string
  completed: boolean
  notes?: string
  created_at: string
}

export interface RegisterData {
  email: string
  password: string
  name?: string
  newsletter_subscribed?: boolean
  postcode?: string
  city?: string
  province?: string
}

export interface LoginData {
  email: string
  password: string
}
