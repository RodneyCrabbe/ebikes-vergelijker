// Enhanced Dealer Leads Store
// Advanced lead management with scoring and conversion tracking

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'
import type { 
  DealerLeadEnhanced, 
  DealerLeadFilters,
  DealerCommunicationLog 
} from '../types/dealerEnhanced'

export const useDealerLeadsStore = defineStore('dealerLeads', () => {
  // State
  const leads = ref<DealerLeadEnhanced[]>([])
  const currentLead = ref<DealerLeadEnhanced | null>(null)
  const communicationLog = ref<DealerCommunicationLog[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filters = ref<DealerLeadFilters>({
    status: '',
    priority: '',
    lead_type: '',
    source: '',
    date_from: '',
    date_to: '',
    min_score: 0,
    max_score: 100,
    engagement_level: ''
  })

  // Computed
  const filteredLeads = computed(() => {
    let filtered = leads.value

    if (filters.value.status) {
      filtered = filtered.filter(lead => lead.status === filters.value.status)
    }

    if (filters.value.priority) {
      filtered = filtered.filter(lead => lead.priority === filters.value.priority)
    }

    if (filters.value.lead_type) {
      filtered = filtered.filter(lead => lead.lead_type === filters.value.lead_type)
    }

    if (filters.value.source) {
      filtered = filtered.filter(lead => lead.source === filters.value.source)
    }

    if (filters.value.date_from) {
      filtered = filtered.filter(lead => 
        new Date(lead.created_at) >= new Date(filters.value.date_from!)
      )
    }

    if (filters.value.date_to) {
      filtered = filtered.filter(lead => 
        new Date(lead.created_at) <= new Date(filters.value.date_to!)
      )
    }

    if (filters.value.min_score !== undefined) {
      filtered = filtered.filter(lead => lead.lead_score >= filters.value.min_score!)
    }

    if (filters.value.max_score !== undefined) {
      filtered = filtered.filter(lead => lead.lead_score <= filters.value.max_score!)
    }

    if (filters.value.engagement_level) {
      filtered = filtered.filter(lead => lead.engagement_level === filters.value.engagement_level)
    }

    return filtered
  })

  const leadsByStatus = computed(() => {
    const statusCounts: Record<string, number> = {}
    leads.value.forEach(lead => {
      statusCounts[lead.status] = (statusCounts[lead.status] || 0) + 1
    })
    return statusCounts
  })

  const leadsByPriority = computed(() => {
    const priorityCounts: Record<string, number> = {}
    leads.value.forEach(lead => {
      priorityCounts[lead.priority] = (priorityCounts[lead.priority] || 0) + 1
    })
    return priorityCounts
  })

  const highValueLeads = computed(() => 
    leads.value.filter(lead => lead.lead_score >= 80)
  )

  const urgentLeads = computed(() => 
    leads.value.filter(lead => lead.priority === 'urgent')
  )

  const recentLeads = computed(() => 
    leads.value
      .filter(lead => {
        const leadDate = new Date(lead.created_at)
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return leadDate >= weekAgo
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  )

  const conversionRate = computed(() => {
    const totalLeads = leads.value.length
    const convertedLeads = leads.value.filter(lead => lead.status === 'converted').length
    return totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0
  })

  const averageLeadScore = computed(() => {
    if (leads.value.length === 0) return 0
    const totalScore = leads.value.reduce((sum, lead) => sum + lead.lead_score, 0)
    return totalScore / leads.value.length
  })

  // Actions
  async function fetchLeads(dealerId: string, customFilters?: DealerLeadFilters) {
    loading.value = true
    error.value = null

    try {
      let query = supabase
        .from('dealer_leads_enhanced')
        .select('*')
        .eq('dealer_id', dealerId)
        .order('created_at', { ascending: false })

      const activeFilters = customFilters || filters.value

      if (activeFilters.status) {
        query = query.eq('status', activeFilters.status)
      }

      if (activeFilters.priority) {
        query = query.eq('priority', activeFilters.priority)
      }

      if (activeFilters.lead_type) {
        query = query.eq('lead_type', activeFilters.lead_type)
      }

      if (activeFilters.source) {
        query = query.eq('source', activeFilters.source)
      }

      if (activeFilters.date_from) {
        query = query.gte('created_at', activeFilters.date_from)
      }

      if (activeFilters.date_to) {
        query = query.lte('created_at', activeFilters.date_to)
      }

      if (activeFilters.min_score !== undefined) {
        query = query.gte('lead_score', activeFilters.min_score)
      }

      if (activeFilters.max_score !== undefined) {
        query = query.lte('lead_score', activeFilters.max_score)
      }

      if (activeFilters.engagement_level) {
        query = query.eq('engagement_level', activeFilters.engagement_level)
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError

      leads.value = data || []
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch leads'
      console.error('Error fetching leads:', e)
    } finally {
      loading.value = false
    }
  }

  async function fetchLead(id: string) {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('dealer_leads_enhanced')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError) throw fetchError

      currentLead.value = data
      return data
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch lead'
      console.error('Error fetching lead:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function createLead(dealerId: string, leadData: Partial<DealerLeadEnhanced>) {
    loading.value = true
    error.value = null

    try {
      const newLead = {
        dealer_id: dealerId,
        lead_type: 'inquiry',
        status: 'new',
        priority: 'medium',
        engagement_level: 'low',
        lead_score: 10,
        contact_attempts: 0,
        financing_needed: false,
        trade_in: false,
        test_ride_requested: false,
        interested_models: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...leadData
      }

      const { data, error: insertError } = await supabase
        .from('dealer_leads_enhanced')
        .insert(newLead)
        .select()
        .single()

      if (insertError) throw insertError

      leads.value.unshift(data)
      return data
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to create lead'
      console.error('Error creating lead:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateLead(id: string, updates: Partial<DealerLeadEnhanced>) {
    loading.value = true
    error.value = null

    try {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString()
      }

      const { data, error: updateError } = await supabase
        .from('dealer_leads_enhanced')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (updateError) throw updateError

      const index = leads.value.findIndex(lead => lead.id === id)
      if (index !== -1) {
        leads.value[index] = data
      }

      if (currentLead.value?.id === id) {
        currentLead.value = data
      }

      return data
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to update lead'
      console.error('Error updating lead:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateLeadStatus(id: string, status: DealerLeadEnhanced['status']) {
    return updateLead(id, { status })
  }

  async function updateLeadPriority(id: string, priority: DealerLeadEnhanced['priority']) {
    return updateLead(id, { priority })
  }

  async function updateLeadScore(id: string, score: number) {
    return updateLead(id, { lead_score: score })
  }

  async function addCommunicationLog(
    dealerId: string,
    leadId: string,
    communication: Omit<DealerCommunicationLog, 'id' | 'dealer_id' | 'lead_id' | 'created_at'>
  ) {
    loading.value = true
    error.value = null

    try {
      const logEntry = {
        dealer_id: dealerId,
        lead_id: leadId,
        ...communication,
        created_at: new Date().toISOString()
      }

      const { data, error: insertError } = await supabase
        .from('dealer_communication_log')
        .insert(logEntry)
        .select()
        .single()

      if (insertError) throw insertError

      communicationLog.value.unshift(data)

      // Update lead's last contacted time and contact attempts
      const lead = leads.value.find(l => l.id === leadId)
      if (lead) {
        await updateLead(leadId, {
          last_contacted_at: new Date().toISOString(),
          contact_attempts: lead.contact_attempts + 1
        })
      }

      return data
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to add communication log'
      console.error('Error adding communication log:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchCommunicationLog(leadId: string) {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('dealer_communication_log')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      communicationLog.value = data || []
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch communication log'
      console.error('Error fetching communication log:', e)
    } finally {
      loading.value = false
    }
  }

  async function convertLead(id: string, conversionValue?: number, conversionSource?: string) {
    return updateLead(id, {
      status: 'converted',
      converted_at: new Date().toISOString(),
      conversion_value: conversionValue,
      conversion_source: conversionSource
    })
  }

  async function markLeadAsLost(id: string, reason?: string) {
    return updateLead(id, {
      status: 'lost',
      notes: reason ? `${lead.notes || ''}\nLost: ${reason}`.trim() : lead.notes
    })
  }

  async function calculateLeadScore(id: string) {
    try {
      const { data, error } = await supabase.rpc('calculate_lead_score', {
        lead_uuid: id
      })

      if (error) throw error

      if (data !== null) {
        await updateLeadScore(id, data)
      }
    } catch (e) {
      console.error('Error calculating lead score:', e)
    }
  }

  function setFilters(newFilters: Partial<DealerLeadFilters>) {
    filters.value = { ...filters.value, ...newFilters }
  }

  function clearFilters() {
    filters.value = {
      status: '',
      priority: '',
      lead_type: '',
      source: '',
      date_from: '',
      date_to: '',
      min_score: 0,
      max_score: 100,
      engagement_level: ''
    }
  }

  function setCurrentLead(lead: DealerLeadEnhanced | null) {
    currentLead.value = lead
  }

  // Lead scoring helpers
  function calculateManualLeadScore(lead: Partial<DealerLeadEnhanced>): number {
    let score = 10 // Base score

    // Budget scoring
    if (lead.budget_max) {
      if (lead.budget_max > 5000) score += 20
      else if (lead.budget_max > 3000) score += 15
      else if (lead.budget_max > 1500) score += 10
    }

    // Timeline scoring
    if (lead.timeline === 'immediate') score += 25
    else if (lead.timeline === '1_month') score += 20
    else if (lead.timeline === '3_months') score += 10

    // Engagement scoring
    if (lead.contact_attempts && lead.contact_attempts > 3) score += 15
    else if (lead.contact_attempts && lead.contact_attempts > 1) score += 10

    // Test ride request
    if (lead.test_ride_requested) score += 15

    // Financing need
    if (lead.financing_needed) score += 10

    // Cap at 100
    return Math.min(score, 100)
  }

  return {
    // State
    leads,
    currentLead,
    communicationLog,
    loading,
    error,
    filters,

    // Computed
    filteredLeads,
    leadsByStatus,
    leadsByPriority,
    highValueLeads,
    urgentLeads,
    recentLeads,
    conversionRate,
    averageLeadScore,

    // Actions
    fetchLeads,
    fetchLead,
    createLead,
    updateLead,
    updateLeadStatus,
    updateLeadPriority,
    updateLeadScore,
    addCommunicationLog,
    fetchCommunicationLog,
    convertLead,
    markLeadAsLost,
    calculateLeadScore,
    setFilters,
    clearFilters,
    setCurrentLead,
    calculateManualLeadScore
  }
})
