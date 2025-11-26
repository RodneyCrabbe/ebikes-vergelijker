export interface Dealer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  postal_code: string
  country: string
  website?: string
  description?: string
  logo_url?: string
  status: 'active' | 'inactive' | 'pending' | 'suspended'
  commission_rate: number
  created_at: string
  updated_at: string
}

export interface DealerLead {
  id: string
  dealer_id: string
  user_id?: string
  ebike_id: string
  lead_type: 'appointment' | 'inquiry' | 'purchase_intent' | 'test_ride'
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
  source: 'website' | 'referral' | 'advertisement' | 'direct'
  priority: 'low' | 'medium' | 'high'
  notes?: string
  contact_info: {
    name: string
    email: string
    phone?: string
    preferred_contact: 'email' | 'phone' | 'sms'
  }
  ebike_info: {
    brand: string
    model: string
    price?: number
  }
  created_at: string
  updated_at: string
  contacted_at?: string
  converted_at?: string
}

export interface DealerPerformance {
  dealer_id: string
  period: string
  total_leads: number
  converted_leads: number
  conversion_rate: number
  total_revenue: number
  commission_earned: number
  avg_response_time: number // in hours
  customer_satisfaction: number // 1-5 rating
  top_ebikes: Array<{
    ebike_id: string
    leads_count: number
    conversion_rate: number
  }>
}

export interface DealerCommission {
  id: string
  dealer_id: string
  lead_id: string
  amount: number
  status: 'pending' | 'paid' | 'cancelled'
  payment_date?: string
  created_at: string
}

export interface DealerSettings {
  dealer_id: string
  auto_respond: boolean
  response_template: string
  working_hours: {
    monday: { start: string; end: string; enabled: boolean }
    tuesday: { start: string; end: string; enabled: boolean }
    wednesday: { start: string; end: string; enabled: boolean }
    thursday: { start: string; end: string; enabled: boolean }
    friday: { start: string; end: string; enabled: boolean }
    saturday: { start: string; end: string; enabled: boolean }
    sunday: { start: string; end: string; enabled: boolean }
  }
  notification_preferences: {
    email: boolean
    sms: boolean
    push: boolean
  }
  commission_rate: number
  created_at: string
  updated_at: string
}
