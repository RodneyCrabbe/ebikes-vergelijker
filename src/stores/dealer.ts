import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'
import { useAuthStore } from './auth'
import type { Dealer, DealerLead, DealerPerformance, DealerCommission, DealerSettings } from '../types/dealer'

export const useDealerStore = defineStore('dealer', () => {
  const authStore = useAuthStore()
  const dealers = ref<Dealer[]>([])
  const currentDealer = ref<Dealer | null>(null)
  const leads = ref<DealerLead[]>([])
  const performance = ref<DealerPerformance[]>([])
  const commissions = ref<DealerCommission[]>([])
  const settings = ref<DealerSettings | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Get current dealer profile
  async function fetchCurrentDealer() {
    if (!authStore.user?.id) {
      currentDealer.value = null
      return
    }

    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('dealers')
        .select('*')
        .eq('user_id', authStore.user.id)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means no rows found
        throw fetchError
      }

      currentDealer.value = data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch dealer profile'
      console.error('Error fetching dealer profile:', err)
    } finally {
      loading.value = false
    }
  }

  // Create dealer profile
  async function createDealerProfile(dealerData: Omit<Dealer, 'id' | 'created_at' | 'updated_at'>) {
    if (!authStore.user?.id) {
      error.value = 'User not authenticated'
      return
    }

    loading.value = true
    error.value = null

    try {
      const { data, error: insertError } = await supabase
        .from('dealers')
        .insert({
          user_id: authStore.user.id,
          ...dealerData
        })
        .select()
        .single()

      if (insertError) throw insertError

      currentDealer.value = data

      // Track dealer registration
      const { eventTrackingService } = await import('../services/eventTrackingService')
      eventTrackingService.trackEvent('dealer_registered', {
        dealer_id: data.id,
        dealer_name: data.name,
        city: data.city
      })

    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create dealer profile'
      console.error('Error creating dealer profile:', err)
    } finally {
      loading.value = false
    }
  }

  // Update dealer profile
  async function updateDealerProfile(updates: Partial<Dealer>) {
    if (!currentDealer.value) {
      error.value = 'No dealer profile found'
      return
    }

    loading.value = true
    error.value = null

    try {
      const { data, error: updateError } = await supabase
        .from('dealers')
        .update(updates)
        .eq('id', currentDealer.value.id)
        .select()
        .single()

      if (updateError) throw updateError

      currentDealer.value = data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update dealer profile'
      console.error('Error updating dealer profile:', err)
    } finally {
      loading.value = false
    }
  }

  // Fetch dealer leads
  async function fetchDealerLeads(filters?: {
    status?: string
    lead_type?: string
    date_from?: string
    date_to?: string
  }) {
    if (!currentDealer.value) {
      leads.value = []
      return
    }

    loading.value = true
    error.value = null

    try {
      let query = supabase
        .from('dealer_leads')
        .select('*')
        .eq('dealer_id', currentDealer.value.id)
        .order('created_at', { ascending: false })

      if (filters?.status) {
        query = query.eq('status', filters.status)
      }
      if (filters?.lead_type) {
        query = query.eq('lead_type', filters.lead_type)
      }
      if (filters?.date_from) {
        query = query.gte('created_at', filters.date_from)
      }
      if (filters?.date_to) {
        query = query.lte('created_at', filters.date_to)
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError
      leads.value = data || []
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch leads'
      console.error('Error fetching leads:', err)
    } finally {
      loading.value = false
    }
  }

  // Update lead status
  async function updateLeadStatus(leadId: string, status: string, notes?: string) {
    loading.value = true
    error.value = null

    try {
      const updateData: any = { status }
      if (notes) updateData.notes = notes
      if (status === 'contacted') updateData.contacted_at = new Date().toISOString()
      if (status === 'converted') updateData.converted_at = new Date().toISOString()

      const { data, error: updateError } = await supabase
        .from('dealer_leads')
        .update(updateData)
        .eq('id', leadId)
        .select()
        .single()

      if (updateError) throw updateError

      // Update local state
      const index = leads.value.findIndex(lead => lead.id === leadId)
      if (index !== -1) {
        leads.value[index] = data
      }

      // Track lead status update
      const { eventTrackingService } = await import('../services/eventTrackingService')
      eventTrackingService.trackEvent('lead_status_updated', {
        lead_id: leadId,
        new_status: status,
        dealer_id: currentDealer.value?.id
      })

    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update lead status'
      console.error('Error updating lead status:', err)
    } finally {
      loading.value = false
    }
  }

  // Fetch dealer performance
  async function fetchDealerPerformance(period: string = '30d') {
    if (!currentDealer.value) {
      performance.value = []
      return
    }

    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('dealer_performance')
        .select('*')
        .eq('dealer_id', currentDealer.value.id)
        .eq('period', period)

      if (fetchError) throw fetchError
      performance.value = data || []
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch performance data'
      console.error('Error fetching performance data:', err)
    } finally {
      loading.value = false
    }
  }

  // Fetch dealer commissions
  async function fetchDealerCommissions() {
    if (!currentDealer.value) {
      commissions.value = []
      return
    }

    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('dealer_commissions')
        .select('*')
        .eq('dealer_id', currentDealer.value.id)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      commissions.value = data || []
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch commissions'
      console.error('Error fetching commissions:', err)
    } finally {
      loading.value = false
    }
  }

  // Fetch dealer settings
  async function fetchDealerSettings() {
    if (!currentDealer.value) {
      settings.value = null
      return
    }

    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('dealer_settings')
        .select('*')
        .eq('dealer_id', currentDealer.value.id)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means no rows found
        throw fetchError
      }

      settings.value = data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch settings'
      console.error('Error fetching settings:', err)
    } finally {
      loading.value = false
    }
  }

  // Update dealer settings
  async function updateDealerSettings(updates: Partial<DealerSettings>) {
    if (!currentDealer.value) {
      error.value = 'No dealer profile found'
      return
    }

    loading.value = true
    error.value = null

    try {
      const { data, error: upsertError } = await supabase
        .from('dealer_settings')
        .upsert({
          dealer_id: currentDealer.value.id,
          ...updates
        }, { onConflict: 'dealer_id' })
        .select()
        .single()

      if (upsertError) throw upsertError
      settings.value = data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update settings'
      console.error('Error updating settings:', err)
    } finally {
      loading.value = false
    }
  }

  // Computed properties
  const isDealer = computed(() => !!currentDealer.value)
  const totalLeads = computed(() => leads.value.length)
  const convertedLeads = computed(() => leads.value.filter(lead => lead.status === 'converted').length)
  const conversionRate = computed(() => {
    if (totalLeads.value === 0) return 0
    return (convertedLeads.value / totalLeads.value) * 100
  })
  const totalCommissions = computed(() => 
    commissions.value
      .filter(commission => commission.status === 'paid')
      .reduce((sum, commission) => sum + commission.amount, 0)
  )
  const pendingCommissions = computed(() => 
    commissions.value
      .filter(commission => commission.status === 'pending')
      .reduce((sum, commission) => sum + commission.amount, 0)
  )

  // Initialize dealer data
  async function initialize() {
    if (authStore.isAuthenticated) {
      await fetchCurrentDealer()
      if (currentDealer.value) {
        await Promise.all([
          fetchDealerLeads(),
          fetchDealerPerformance(),
          fetchDealerCommissions(),
          fetchDealerSettings()
        ])
      }
    }
  }

  return {
    dealers,
    currentDealer,
    leads,
    performance,
    commissions,
    settings,
    loading,
    error,
    isDealer,
    totalLeads,
    convertedLeads,
    conversionRate,
    totalCommissions,
    pendingCommissions,
    fetchCurrentDealer,
    createDealerProfile,
    updateDealerProfile,
    fetchDealerLeads,
    updateLeadStatus,
    fetchDealerPerformance,
    fetchDealerCommissions,
    fetchDealerSettings,
    updateDealerSettings,
    initialize
  }
})
