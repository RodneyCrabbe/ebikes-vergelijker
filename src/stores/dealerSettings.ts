// Enhanced Dealer Settings Store
// Comprehensive dealer settings and profile management

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'
import type { DealerSettingsEnhanced } from '../types/dealerEnhanced'

export const useDealerSettingsStore = defineStore('dealerSettings', () => {
  // State
  const settings = ref<DealerSettingsEnhanced | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const isDirty = ref(false)

  // Computed
  const isConfigured = computed(() => {
    if (!settings.value) return false
    return !!(
      settings.value.business_name &&
      settings.value.primary_contact_name &&
      settings.value.primary_contact_email &&
      settings.value.primary_contact_phone
    )
  })

  const workingHours = computed(() => {
    return settings.value?.working_hours || {
      monday: { start: '09:00', end: '17:00', enabled: true },
      tuesday: { start: '09:00', end: '17:00', enabled: true },
      wednesday: { start: '09:00', end: '17:00', enabled: true },
      thursday: { start: '09:00', end: '17:00', enabled: true },
      friday: { start: '09:00', end: '17:00', enabled: true },
      saturday: { start: '10:00', end: '16:00', enabled: true },
      sunday: { start: '10:00', end: '16:00', enabled: false }
    }
  })

  const notificationPreferences = computed(() => {
    return settings.value?.notification_preferences || {
      email: true,
      sms: false,
      push: true,
      lead_notifications: true,
      commission_notifications: true,
      inventory_alerts: true,
      performance_reports: true
    }
  })

  const marketingSettings = computed(() => {
    return settings.value?.marketing_settings || {
      auto_respond: true,
      response_template: 'Thank you for your interest in our e-bikes! We will contact you within 24 hours.',
      follow_up_sequence: true,
      email_signature: '',
      social_sharing: true
    }
  })

  const inventorySettings = computed(() => {
    return settings.value?.inventory_settings || {
      auto_approve: false,
      low_stock_threshold: 5,
      featured_rotation_days: 7,
      price_update_frequency: 'weekly'
    }
  })

  // Actions
  async function fetchSettings(dealerId: string) {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('dealer_settings_enhanced')
        .select('*')
        .eq('dealer_id', dealerId)
        .single()

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          // No settings found, create default
          await createDefaultSettings(dealerId)
          return
        }
        throw fetchError
      }

      settings.value = data
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch settings'
      console.error('Error fetching settings:', e)
    } finally {
      loading.value = false
    }
  }

  async function createDefaultSettings(dealerId: string) {
    loading.value = true
    error.value = null

    try {
      const defaultSettings: Omit<DealerSettingsEnhanced, 'id' | 'created_at' | 'updated_at'> = {
        dealer_id: dealerId,
        business_name: '',
        business_type: 'retail',
        primary_contact_name: '',
        primary_contact_email: '',
        primary_contact_phone: '',
        website_url: '',
        social_media: {},
        working_hours: {
          monday: { start: '09:00', end: '17:00', enabled: true },
          tuesday: { start: '09:00', end: '17:00', enabled: true },
          wednesday: { start: '09:00', end: '17:00', enabled: true },
          thursday: { start: '09:00', end: '17:00', enabled: true },
          friday: { start: '09:00', end: '17:00', enabled: true },
          saturday: { start: '10:00', end: '16:00', enabled: true },
          sunday: { start: '10:00', end: '16:00', enabled: false }
        },
        service_areas: [],
        delivery_radius_km: 50,
        delivery_fee: 0,
        default_commission_rate: 0.05,
        commission_tiers: {},
        notification_preferences: {
          email: true,
          sms: false,
          push: true,
          lead_notifications: true,
          commission_notifications: true,
          inventory_alerts: true,
          performance_reports: true
        },
        marketing_settings: {
          auto_respond: true,
          response_template: 'Thank you for your interest in our e-bikes! We will contact you within 24 hours.',
          follow_up_sequence: true,
          email_signature: '',
          social_sharing: true
        },
        inventory_settings: {
          auto_approve: false,
          low_stock_threshold: 5,
          featured_rotation_days: 7,
          price_update_frequency: 'weekly'
        }
      }

      const { data, error: insertError } = await supabase
        .from('dealer_settings_enhanced')
        .insert(defaultSettings)
        .select()
        .single()

      if (insertError) throw insertError

      settings.value = data
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to create default settings'
      console.error('Error creating default settings:', e)
    } finally {
      loading.value = false
    }
  }

  async function updateSettings(updates: Partial<DealerSettingsEnhanced>) {
    if (!settings.value) return

    loading.value = true
    error.value = null

    try {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString()
      }

      const { data, error: updateError } = await supabase
        .from('dealer_settings_enhanced')
        .update(updateData)
        .eq('dealer_id', settings.value.dealer_id)
        .select()
        .single()

      if (updateError) throw updateError

      settings.value = data
      isDirty.value = false
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to update settings'
      console.error('Error updating settings:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateBusinessInfo(info: {
    business_name?: string
    business_type?: DealerSettingsEnhanced['business_type']
    tax_id?: string
    business_license?: string
  }) {
    return updateSettings(info)
  }

  async function updateContactInfo(info: {
    primary_contact_name?: string
    primary_contact_email?: string
    primary_contact_phone?: string
    website_url?: string
  }) {
    return updateSettings(info)
  }

  async function updateSocialMedia(socialMedia: Record<string, string>) {
    return updateSettings({ social_media: socialMedia })
  }

  async function updateWorkingHours(hours: DealerSettingsEnhanced['working_hours']) {
    return updateSettings({ working_hours: hours })
  }

  async function updateServiceAreas(areas: {
    service_areas?: string[]
    delivery_radius_km?: number
    delivery_fee?: number
  }) {
    return updateSettings(areas)
  }

  async function updateCommissionSettings(settings: {
    default_commission_rate?: number
    commission_tiers?: Record<string, any>
  }) {
    return updateSettings(settings)
  }

  async function updateNotificationPreferences(preferences: DealerSettingsEnhanced['notification_preferences']) {
    return updateSettings({ notification_preferences: preferences })
  }

  async function updateMarketingSettings(marketing: DealerSettingsEnhanced['marketing_settings']) {
    return updateSettings({ marketing_settings: marketing })
  }

  async function updateInventorySettings(inventory: DealerSettingsEnhanced['inventory_settings']) {
    return updateSettings({ inventory_settings: inventory })
  }

  // Working hours helpers
  function isOpenOnDay(day: keyof DealerSettingsEnhanced['working_hours']): boolean {
    return workingHours.value[day].enabled
  }

  function getWorkingHoursForDay(day: keyof DealerSettingsEnhanced['working_hours']): { start: string; end: string } | null {
    const dayHours = workingHours.value[day]
    return dayHours.enabled ? { start: dayHours.start, end: dayHours.end } : null
  }

  function getNextOpenTime(): Date | null {
    const now = new Date()
    const currentDay = now.toLocaleLowerCase().substring(0, 3) as keyof DealerSettingsEnhanced['working_hours']
    const currentTime = now.toTimeString().substring(0, 5)

    // Check if currently open
    if (isOpenOnDay(currentDay)) {
      const dayHours = getWorkingHoursForDay(currentDay)
      if (dayHours && currentTime < dayHours.end) {
        return now // Currently open
      }
    }

    // Find next open day
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const
    const currentDayIndex = days.indexOf(currentDay)
    
    for (let i = 1; i <= 7; i++) {
      const nextDayIndex = (currentDayIndex + i) % 7
      const nextDay = days[nextDayIndex]
      
      if (isOpenOnDay(nextDay)) {
        const dayHours = getWorkingHoursForDay(nextDay)
        if (dayHours) {
          const nextOpenDate = new Date(now)
          nextOpenDate.setDate(nextOpenDate.getDate() + i)
          const [hours, minutes] = dayHours.start.split(':').map(Number)
          nextOpenDate.setHours(hours, minutes, 0, 0)
          return nextOpenDate
        }
      }
    }

    return null
  }

  // Validation helpers
  function validateSettings(): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!settings.value) {
      errors.push('Settings not loaded')
      return { isValid: false, errors }
    }

    if (!settings.value.business_name?.trim()) {
      errors.push('Business name is required')
    }

    if (!settings.value.primary_contact_name?.trim()) {
      errors.push('Primary contact name is required')
    }

    if (!settings.value.primary_contact_email?.trim()) {
      errors.push('Primary contact email is required')
    } else if (!isValidEmail(settings.value.primary_contact_email)) {
      errors.push('Primary contact email is invalid')
    }

    if (!settings.value.primary_contact_phone?.trim()) {
      errors.push('Primary contact phone is required')
    }

    if (settings.value.delivery_radius_km < 0) {
      errors.push('Delivery radius cannot be negative')
    }

    if (settings.value.delivery_fee < 0) {
      errors.push('Delivery fee cannot be negative')
    }

    if (settings.value.default_commission_rate < 0 || settings.value.default_commission_rate > 1) {
      errors.push('Commission rate must be between 0 and 1')
    }

    return { isValid: errors.length === 0, errors }
  }

  function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Reset functions
  function resetToDefaults() {
    if (settings.value) {
      settings.value = {
        ...settings.value,
        working_hours: {
          monday: { start: '09:00', end: '17:00', enabled: true },
          tuesday: { start: '09:00', end: '17:00', enabled: true },
          wednesday: { start: '09:00', end: '17:00', enabled: true },
          thursday: { start: '09:00', end: '17:00', enabled: true },
          friday: { start: '09:00', end: '17:00', enabled: true },
          saturday: { start: '10:00', end: '16:00', enabled: true },
          sunday: { start: '10:00', end: '16:00', enabled: false }
        },
        notification_preferences: {
          email: true,
          sms: false,
          push: true,
          lead_notifications: true,
          commission_notifications: true,
          inventory_alerts: true,
          performance_reports: true
        },
        marketing_settings: {
          auto_respond: true,
          response_template: 'Thank you for your interest in our e-bikes! We will contact you within 24 hours.',
          follow_up_sequence: true,
          email_signature: '',
          social_sharing: true
        },
        inventory_settings: {
          auto_approve: false,
          low_stock_threshold: 5,
          featured_rotation_days: 7,
          price_update_frequency: 'weekly'
        }
      }
      isDirty.value = true
    }
  }

  function markDirty() {
    isDirty.value = true
  }

  function markClean() {
    isDirty.value = false
  }

  return {
    // State
    settings,
    loading,
    error,
    isDirty,

    // Computed
    isConfigured,
    workingHours,
    notificationPreferences,
    marketingSettings,
    inventorySettings,

    // Actions
    fetchSettings,
    createDefaultSettings,
    updateSettings,
    updateBusinessInfo,
    updateContactInfo,
    updateSocialMedia,
    updateWorkingHours,
    updateServiceAreas,
    updateCommissionSettings,
    updateNotificationPreferences,
    updateMarketingSettings,
    updateInventorySettings,

    // Helpers
    isOpenOnDay,
    getWorkingHoursForDay,
    getNextOpenTime,
    validateSettings,
    resetToDefaults,
    markDirty,
    markClean
  }
})
