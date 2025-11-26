// Enhanced Dealer Analytics Store
// Comprehensive analytics and performance tracking for dealers

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'
import type { 
  DealerAnalyticsEvent, 
  DealerPerformanceMetrics, 
  DealerAnalyticsFilters,
  DealerDashboardSummary,
  ChartDataPoint,
  TimeSeriesData
} from '../types/dealerEnhanced'

export const useDealerAnalyticsStore = defineStore('dealerAnalytics', () => {
  // State
  const events = ref<DealerAnalyticsEvent[]>([])
  const performanceMetrics = ref<DealerPerformanceMetrics[]>([])
  const dashboardSummary = ref<DealerDashboardSummary | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filters = ref<DealerAnalyticsFilters>({
    date_from: '',
    date_to: '',
    event_type: '',
    inventory_id: '',
    source: '',
    period: 'monthly'
  })

  // Computed
  const filteredEvents = computed(() => {
    let filtered = events.value

    if (filters.value.date_from) {
      filtered = filtered.filter(event => 
        new Date(event.created_at) >= new Date(filters.value.date_from!)
      )
    }

    if (filters.value.date_to) {
      filtered = filtered.filter(event => 
        new Date(event.created_at) <= new Date(filters.value.date_to!)
      )
    }

    if (filters.value.event_type) {
      filtered = filtered.filter(event => event.event_type === filters.value.event_type)
    }

    if (filters.value.inventory_id) {
      filtered = filtered.filter(event => event.inventory_id === filters.value.inventory_id)
    }

    if (filters.value.source) {
      filtered = filtered.filter(event => event.event_source === filters.value.source)
    }

    return filtered
  })

  const eventCounts = computed(() => {
    const counts: Record<string, number> = {}
    filteredEvents.value.forEach(event => {
      counts[event.event_type] = (counts[event.event_type] || 0) + 1
    })
    return counts
  })

  const sourceCounts = computed(() => {
    const counts: Record<string, number> = {}
    filteredEvents.value.forEach(event => {
      const source = event.event_source || 'unknown'
      counts[source] = (counts[source] || 0) + 1
    })
    return counts
  })

  const dailyEvents = computed(() => {
    const daily: Record<string, number> = {}
    filteredEvents.value.forEach(event => {
      const date = new Date(event.created_at).toISOString().split('T')[0]
      daily[date] = (daily[date] || 0) + 1
    })
    return daily
  })

  // Actions
  async function fetchAnalyticsEvents(dealerId: string, customFilters?: DealerAnalyticsFilters) {
    loading.value = true
    error.value = null

    try {
      let query = supabase
        .from('dealer_analytics_events')
        .select('*')
        .eq('dealer_id', dealerId)
        .order('created_at', { ascending: false })

      const activeFilters = customFilters || filters.value

      if (activeFilters.date_from) {
        query = query.gte('created_at', activeFilters.date_from)
      }

      if (activeFilters.date_to) {
        query = query.lte('created_at', activeFilters.date_to)
      }

      if (activeFilters.event_type) {
        query = query.eq('event_type', activeFilters.event_type)
      }

      if (activeFilters.inventory_id) {
        query = query.eq('inventory_id', activeFilters.inventory_id)
      }

      if (activeFilters.source) {
        query = query.eq('event_source', activeFilters.source)
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError

      events.value = data || []
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch analytics events'
      console.error('Error fetching analytics events:', e)
    } finally {
      loading.value = false
    }
  }

  async function fetchPerformanceMetrics(dealerId: string, period: string = 'monthly') {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('dealer_performance_metrics')
        .select('*')
        .eq('dealer_id', dealerId)
        .eq('period_type', period)
        .order('period_start', { ascending: false })

      if (fetchError) throw fetchError

      performanceMetrics.value = data || []
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch performance metrics'
      console.error('Error fetching performance metrics:', e)
    } finally {
      loading.value = false
    }
  }

  async function fetchDashboardSummary(dealerId: string) {
    loading.value = true
    error.value = null

    try {
      // Fetch current period data
      const endDate = new Date()
      const startDate = new Date()
      startDate.setMonth(startDate.getMonth() - 1)

      const { data: eventsData, error: eventsError } = await supabase
        .from('dealer_analytics_events')
        .select('*')
        .eq('dealer_id', dealerId)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())

      if (eventsError) throw eventsError

      const { data: leadsData, error: leadsError } = await supabase
        .from('dealer_leads_enhanced')
        .select('*')
        .eq('dealer_id', dealerId)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())

      if (leadsError) throw leadsError

      const { data: inventoryData, error: inventoryError } = await supabase
        .from('dealer_inventory')
        .select('*')
        .eq('dealer_id', dealerId)

      if (inventoryError) throw inventoryError

      const { data: commissionsData, error: commissionsError } = await supabase
        .from('dealer_commissions')
        .select('*')
        .eq('dealer_id', dealerId)
        .eq('status', 'pending')

      if (commissionsError) throw commissionsError

      // Calculate summary metrics
      const totalViews = eventsData?.filter(e => e.event_type === 'view').length || 0
      const totalClicks = eventsData?.filter(e => e.event_type === 'click').length || 0
      const totalLeads = leadsData?.length || 0
      const convertedLeads = leadsData?.filter(l => l.status === 'converted').length || 0
      const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0
      const clickThroughRate = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0

      const totalRevenue = leadsData?.reduce((sum, lead) => 
        sum + (lead.conversion_value || 0), 0) || 0

      const commissionEarned = leadsData?.reduce((sum, lead) => 
        sum + (lead.conversion_value || 0) * 0.05, 0) || 0 // Assuming 5% commission

      const pendingCommissions = commissionsData?.reduce((sum, comm) => 
        sum + comm.total_amount, 0) || 0

      const activeInventory = inventoryData?.filter(i => i.status === 'active').length || 0
      const lowStockItems = inventoryData?.filter(i => 
        i.stock_quantity <= i.min_stock_level).length || 0

      dashboardSummary.value = {
        total_inventory: inventoryData?.length || 0,
        active_inventory: activeInventory,
        low_stock_items: lowStockItems,
        total_leads: totalLeads,
        new_leads: leadsData?.filter(l => l.status === 'new').length || 0,
        converted_leads: convertedLeads,
        conversion_rate: conversionRate,
        total_views: totalViews,
        total_clicks: totalClicks,
        click_through_rate: clickThroughRate,
        total_revenue: totalRevenue,
        commission_earned: commissionEarned,
        pending_commissions: pendingCommissions,
        avg_response_time: 0, // TODO: Calculate from communication logs
        customer_satisfaction: 0 // TODO: Calculate from reviews
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch dashboard summary'
      console.error('Error fetching dashboard summary:', e)
    } finally {
      loading.value = false
    }
  }

  async function trackEvent(
    dealerId: string,
    inventoryId: string,
    eventType: DealerAnalyticsEvent['event_type'],
    eventData?: Record<string, any>,
    userId?: string
  ) {
    try {
      const { error: insertError } = await supabase
        .from('dealer_analytics_events')
        .insert({
          dealer_id: dealerId,
          inventory_id: inventoryId,
          event_type: eventType,
          event_source: 'website',
          user_id: userId,
          event_data: eventData,
          created_at: new Date().toISOString()
        })

      if (insertError) throw insertError
    } catch (e) {
      console.error('Error tracking event:', e)
    }
  }

  function setFilters(newFilters: Partial<DealerAnalyticsFilters>) {
    filters.value = { ...filters.value, ...newFilters }
  }

  function clearFilters() {
    filters.value = {
      date_from: '',
      date_to: '',
      event_type: '',
      inventory_id: '',
      source: '',
      period: 'monthly'
    }
  }

  // Chart data generators
  function generateEventTypeChart(): ChartDataPoint[] {
    return Object.entries(eventCounts.value).map(([type, count]) => ({
      label: type.charAt(0).toUpperCase() + type.slice(1),
      value: count,
      color: getEventTypeColor(type)
    }))
  }

  function generateSourceChart(): ChartDataPoint[] {
    return Object.entries(sourceCounts.value).map(([source, count]) => ({
      label: source.charAt(0).toUpperCase() + source.slice(1),
      value: count,
      color: getSourceColor(source)
    }))
  }

  function generateDailyEventsChart(): TimeSeriesData[] {
    return Object.entries(dailyEvents.value)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .map(([date, count]) => ({
        date,
        value: count,
        label: new Date(date).toLocaleDateString()
      }))
  }

  function generatePerformanceChart(): TimeSeriesData[] {
    return performanceMetrics.value
      .sort((a, b) => new Date(a.period_start).getTime() - new Date(b.period_start).getTime())
      .map(metric => ({
        date: metric.period_start,
        value: metric.conversion_rate,
        label: `${metric.period_type} ${metric.period_start}`
      }))
  }

  // Helper functions
  function getEventTypeColor(type: string): string {
    const colors: Record<string, string> = {
      view: '#3B82F6',
      click: '#10B981',
      lead: '#F59E0B',
      conversion: '#EF4444',
      sale: '#8B5CF6'
    }
    return colors[type] || '#6B7280'
  }

  function getSourceColor(source: string): string {
    const colors: Record<string, string> = {
      website: '#3B82F6',
      advertisement: '#10B981',
      social_media: '#F59E0B',
      direct: '#EF4444',
      unknown: '#6B7280'
    }
    return colors[source] || '#6B7280'
  }

  return {
    // State
    events,
    performanceMetrics,
    dashboardSummary,
    loading,
    error,
    filters,

    // Computed
    filteredEvents,
    eventCounts,
    sourceCounts,
    dailyEvents,

    // Actions
    fetchAnalyticsEvents,
    fetchPerformanceMetrics,
    fetchDashboardSummary,
    trackEvent,
    setFilters,
    clearFilters,

    // Chart generators
    generateEventTypeChart,
    generateSourceChart,
    generateDailyEventsChart,
    generatePerformanceChart
  }
})
