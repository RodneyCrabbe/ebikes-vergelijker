export interface Review {
  id: string
  user_id?: string // Optional for anonymous reviews
  ebike_id: string
  rating: number // 1-5 stars
  title: string
  content: string
  pros: string[]
  cons: string[]
  verified_purchase: boolean
  helpful_count: number
  created_at: string
  updated_at: string
  // User info (if authenticated)
  user_name?: string
  user_avatar?: string
  // E-bike info
  ebike_brand?: string
  ebike_model?: string
}

export interface CreateReviewData {
  ebike_id: string
  rating: number
  title: string
  content: string
  pros: string[]
  cons: string[]
  verified_purchase: boolean
  anonymous?: boolean
}

export interface ReviewFilters {
  ebike_id?: string
  rating?: number
  verified_purchase?: boolean
  sort_by?: 'newest' | 'oldest' | 'highest_rating' | 'lowest_rating' | 'most_helpful'
}

export interface ReviewStats {
  total_reviews: number
  average_rating: number
  rating_distribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
  verified_purchase_percentage: number
}
