// Enhanced Dealer Portal Types
// Comprehensive types for the enhanced dealer management system

export interface DealerInventory {
  id: string
  dealer_id: string
  
  // Basic Information
  brand: string
  model: string
  version?: string
  price_eur: number
  gender: 'unisex' | 'male' | 'female' | 'kids'
  
  // Range & Battery
  range_km_claimed?: number
  range_km_verified?: number
  battery_v?: number
  battery_ah?: number
  battery_wh?: number
  
  // Motor & Performance
  motor_power_w_eu?: number
  torque_nm?: number
  top_speed_kmh?: number
  
  // Physical Specifications
  wheel_size?: string
  tire_size?: string
  weight_kg?: number
  payload_kg?: number
  frame?: string
  brakes?: string
  
  // Additional Information
  notes?: string
  where_to_buy?: string
  
  // Inventory Management
  stock_quantity: number
  min_stock_level: number
  is_available: boolean
  is_featured: boolean
  
  // Images
  image_urls: string[]
  thumbnail_url?: string
  
  // SEO & Marketing
  meta_title?: string
  meta_description?: string
  keywords: string[]
  
  // Status & Timestamps
  status: 'active' | 'inactive' | 'discontinued' | 'pending'
  created_at: string
  updated_at: string
}

export interface DealerAnalyticsEvent {
  id: string
  dealer_id: string
  inventory_id: string
  
  // Event Details
  event_type: 'view' | 'click' | 'lead' | 'conversion' | 'sale'
  event_source?: 'website' | 'advertisement' | 'social_media' | 'direct'
  user_id?: string
  
  // Event Data
  event_data?: Record<string, any>
  session_id?: string
  ip_address?: string
  user_agent?: string
  referrer?: string
  
  // Location Data
  country?: string
  city?: string
  region?: string
  
  // Timestamp
  created_at: string
}

export interface DealerLeadEnhanced {
  id: string
  dealer_id: string
  inventory_id: string
  user_id?: string
  
  // Lead Information
  lead_type: 'appointment' | 'inquiry' | 'purchase_intent' | 'test_ride' | 'quote_request'
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost' | 'nurturing'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  source?: 'website' | 'referral' | 'advertisement' | 'direct' | 'social_media' | 'email_campaign'
  
  // Contact Information
  contact_name: string
  contact_email: string
  contact_phone?: string
  preferred_contact: 'email' | 'phone' | 'sms' | 'whatsapp'
  
  // Lead Details
  message?: string
  budget_min?: number
  budget_max?: number
  timeline?: 'immediate' | '1_month' | '3_months' | '6_months' | 'flexible'
  financing_needed: boolean
  trade_in: boolean
  
  // E-bike Interest
  interested_models: string[]
  specific_requirements?: string
  test_ride_requested: boolean
  
  // Lead Scoring
  lead_score: number
  engagement_level: 'low' | 'medium' | 'high' | 'very_high'
  
  // Communication History
  last_contacted_at?: string
  contact_attempts: number
  response_time_hours?: number
  
  // Conversion Tracking
  converted_at?: string
  conversion_value?: number
  conversion_source?: string
  
  // Timestamps
  created_at: string
  updated_at: string
}

export interface DealerCommission {
  id: string
  dealer_id: string
  lead_id: string
  inventory_id: string
  
  // Commission Details
  commission_type: 'lead' | 'conversion' | 'sale' | 'referral' | 'bonus'
  base_amount: number
  commission_rate: number
  calculated_amount: number
  bonus_amount: number
  total_amount: number
  
  // Status & Payment
  status: 'pending' | 'approved' | 'paid' | 'cancelled' | 'disputed'
  payment_method?: string
  payment_reference?: string
  paid_at?: string
  
  // Notes
  notes?: string
  
  // Timestamps
  created_at: string
  updated_at: string
}

export interface DealerPerformanceMetrics {
  id: string
  dealer_id: string
  
  // Time Period
  period_type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  period_start: string
  period_end: string
  
  // Lead Metrics
  total_leads: number
  new_leads: number
  qualified_leads: number
  converted_leads: number
  lost_leads: number
  conversion_rate: number
  
  // View & Click Metrics
  total_views: number
  unique_views: number
  total_clicks: number
  click_through_rate: number
  
  // Revenue Metrics
  total_revenue: number
  commission_earned: number
  average_deal_size: number
  
  // Response Metrics
  avg_response_time_hours: number
  response_rate: number
  
  // Customer Satisfaction
  customer_satisfaction_score: number
  total_reviews: number
  average_rating: number
  
  // Timestamps
  created_at: string
  updated_at: string
}

export interface DealerSettingsEnhanced {
  id: string
  dealer_id: string
  
  // Business Information
  business_name?: string
  business_type?: 'retail' | 'wholesale' | 'service' | 'franchise' | 'online'
  tax_id?: string
  business_license?: string
  
  // Contact & Location
  primary_contact_name?: string
  primary_contact_email?: string
  primary_contact_phone?: string
  website_url?: string
  social_media: Record<string, string>
  
  // Working Hours
  working_hours: {
    monday: { start: string; end: string; enabled: boolean }
    tuesday: { start: string; end: string; enabled: boolean }
    wednesday: { start: string; end: string; enabled: boolean }
    thursday: { start: string; end: string; enabled: boolean }
    friday: { start: string; end: string; enabled: boolean }
    saturday: { start: string; end: string; enabled: boolean }
    sunday: { start: string; end: string; enabled: boolean }
  }
  
  // Service Areas
  service_areas: string[]
  delivery_radius_km: number
  delivery_fee: number
  
  // Commission Settings
  default_commission_rate: number
  commission_tiers: Record<string, any>
  
  // Notification Preferences
  notification_preferences: {
    email: boolean
    sms: boolean
    push: boolean
    lead_notifications: boolean
    commission_notifications: boolean
    inventory_alerts: boolean
    performance_reports: boolean
  }
  
  // Marketing Settings
  marketing_settings: {
    auto_respond: boolean
    response_template: string
    follow_up_sequence: boolean
    email_signature: string
    social_sharing: boolean
  }
  
  // Inventory Settings
  inventory_settings: {
    auto_approve: boolean
    low_stock_threshold: number
    featured_rotation_days: number
    price_update_frequency: string
  }
  
  // Timestamps
  created_at: string
  updated_at: string
}

export interface DealerCommunicationLog {
  id: string
  dealer_id: string
  lead_id: string
  
  // Communication Details
  communication_type: 'email' | 'phone' | 'sms' | 'whatsapp' | 'meeting' | 'note'
  direction: 'inbound' | 'outbound'
  subject?: string
  content: string
  
  // Status
  status: 'sent' | 'delivered' | 'read' | 'replied' | 'failed'
  
  // Timestamp
  created_at: string
}

// Form Types for UI
export interface DealerInventoryForm {
  brand: string
  model: string
  version?: string
  price_eur: number
  gender: 'unisex' | 'male' | 'female' | 'kids'
  range_km_claimed?: number
  range_km_verified?: number
  battery_v?: number
  battery_ah?: number
  battery_wh?: number
  motor_power_w_eu?: number
  torque_nm?: number
  top_speed_kmh?: number
  wheel_size?: string
  tire_size?: string
  weight_kg?: number
  payload_kg?: number
  frame?: string
  brakes?: string
  notes?: string
  where_to_buy?: string
  stock_quantity: number
  min_stock_level: number
  is_available: boolean
  is_featured: boolean
  meta_title?: string
  meta_description?: string
  keywords: string[]
}

export interface DealerAnalyticsFilters {
  date_from?: string
  date_to?: string
  event_type?: string
  inventory_id?: string
  source?: string
  period?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
}

export interface DealerLeadFilters {
  status?: string
  priority?: string
  lead_type?: string
  source?: string
  date_from?: string
  date_to?: string
  min_score?: number
  max_score?: number
  engagement_level?: string
}

// Dashboard Summary Types
export interface DealerDashboardSummary {
  total_inventory: number
  active_inventory: number
  low_stock_items: number
  total_leads: number
  new_leads: number
  converted_leads: number
  conversion_rate: number
  total_views: number
  total_clicks: number
  click_through_rate: number
  total_revenue: number
  commission_earned: number
  pending_commissions: number
  avg_response_time: number
  customer_satisfaction: number
}

// Chart Data Types
export interface ChartDataPoint {
  label: string
  value: number
  color?: string
}

export interface TimeSeriesData {
  date: string
  value: number
  label?: string
}

export interface DealerAnalyticsChart {
  title: string
  type: 'line' | 'bar' | 'pie' | 'doughnut' | 'area'
  data: ChartDataPoint[] | TimeSeriesData[]
  options?: Record<string, any>
}
