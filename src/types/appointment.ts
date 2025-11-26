export interface Appointment {
  id: string
  user_id?: string
  ebike_id?: string
  dealer_id: string
  type: 'test_drive' | 'purchase_consultation' | 'repair_service'
  date: string
  time: string
  duration: number // in minutes
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  location: AppointmentLocation
  customer_info: CustomerInfo
  notes?: string
  created_at: string
  updated_at: string
}

export interface CustomerInfo {
  first_name: string
  last_name: string
  email: string
  phone: string
}

export interface CreateAppointmentData {
  ebike_id?: string
  type: 'test_drive' | 'purchase_consultation' | 'repair_service'
  date: string
  time: string
  duration?: number
  dealer_id: string
  location: AppointmentLocation
  customer_info: CustomerInfo
  notes?: string
}

export interface AppointmentLocation {
  id: string
  name: string
  address: string
  city: string
  postal_code: string
  phone: string
  email: string
  services: string[]
  opening_hours: OpeningHours
  coordinates?: {
    lat: number
    lng: number
  }
}

export interface OpeningHours {
  monday: { open: string; close: string; closed: boolean }
  tuesday: { open: string; close: string; closed: boolean }
  wednesday: { open: string; close: string; closed: boolean }
  thursday: { open: string; close: string; closed: boolean }
  friday: { open: string; close: string; closed: boolean }
  saturday: { open: string; close: string; closed: boolean }
  sunday: { open: string; close: string; closed: boolean }
}

export interface TimeSlot {
  time: string
  available: boolean
  booked_by?: string
}

export interface AvailableDate {
  date: string
  time_slots: TimeSlot[]
}