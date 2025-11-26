import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../lib/supabase'
import type { AnalyticsMetrics, ConversionFunnelStep, RevenueMetrics, DateRange } from '../types/analytics'

export const useAnalyticsStore = defineStore('analytics', () => {
  const metrics = ref<AnalyticsMetrics | null>(null)
  const conversionFunnel = ref<ConversionFunnelStep[]>([])
  const revenueMetrics = ref<RevenueMetrics | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const dateRange = ref<DateRange>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    end: new Date()
  })

  // Fetch analytics metrics
  async function fetchAnalyticsMetrics() {
    loading.value = true
    error.value = null
    
    try {
      const { supabase } = await import('../lib/supabase')
      
      // Get daily stats for the date range
      const { data: dailyStats, error: dailyError } = await supabase
        .from('analytics_daily_stats')
        .select('*')
        .gte('date', dateRange.value.start.toISOString().split('T')[0])
        .lte('date', dateRange.value.end.toISOString().split('T')[0])
        .order('date', { ascending: false })
      
      if (dailyError) throw dailyError
      
      // Get top pages
      const { data: topPages, error: pagesError } = await supabase
        .from('analytics_top_pages')
        .select('*')
        .limit(10)
      
      if (pagesError) throw pagesError
      
      // Get top e-bikes
      const { data: topEBikes, error: ebikesError } = await supabase
        .from('analytics_top_ebikes')
        .select('*')
        .limit(10)
      
      if (ebikesError) throw ebikesError
      
      // Calculate metrics from daily stats
      const totalPageViews = dailyStats?.reduce((sum, day) => sum + (day.page_views || 0), 0) || 0
      const totalEBikeViews = dailyStats?.reduce((sum, day) => sum + (day.ebike_views || 0), 0) || 0
      const totalConversions = dailyStats?.reduce((sum, day) => sum + (day.conversions || 0), 0) || 0
      const totalAppointments = dailyStats?.reduce((sum, day) => sum + (day.appointments || 0), 0) || 0
      
      const avgDailyUsers = dailyStats?.length ? 
        dailyStats.reduce((sum, day) => sum + (day.daily_active_users || 0), 0) / dailyStats.length : 0
      
      const conversionRate = totalPageViews > 0 ? totalConversions / totalPageViews : 0
      const avgSessionDuration = 180 // This would be calculated from actual session data
      
      metrics.value = {
        daily_active_users: Math.round(avgDailyUsers),
        monthly_active_users: Math.round(avgDailyUsers * 30),
        page_views: totalPageViews,
        unique_visitors: Math.round(avgDailyUsers * 1.5), // Estimate
        bounce_rate: 0.35, // This would be calculated from actual data
        average_session_duration: avgSessionDuration,
        conversion_rate: conversionRate,
        top_pages: topPages?.map(p => ({ page: p.page_url, views: p.views })) || [],
        top_ebikes: topEBikes?.map(e => ({ ebike_id: e.ebike_id, views: e.views })) || [],
        user_retention: dailyStats?.map(d => ({ 
          date: d.date, 
          retention_rate: 0.65 + Math.random() * 0.1 // Mock data for now
        })) || []
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch analytics metrics'
      console.error('Error fetching analytics metrics:', err)
    } finally {
      loading.value = false
    }
  }

  // Fetch conversion funnel
  async function fetchConversionFunnel() {
    loading.value = true
    error.value = null
    
    try {
      const { supabase } = await import('../lib/supabase')
      
      const { data, error: funnelError } = await supabase
        .from('analytics_conversion_funnel')
        .select('*')
      
      if (funnelError) throw funnelError
      
      conversionFunnel.value = data || []
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch conversion funnel'
      console.error('Error fetching conversion funnel:', err)
    } finally {
      loading.value = false
    }
  }

  // Fetch revenue metrics
  async function fetchRevenueMetrics() {
    loading.value = true
    error.value = null
    
    try {
      const { supabase } = await import('../lib/supabase')
      
      // Get appointments and leads for revenue calculation
      const { data: appointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select('*, ebikes(cpl_rate)')
        .gte('created_at', dateRange.value.start.toISOString())
        .lte('created_at', dateRange.value.end.toISOString())
      
      if (appointmentsError) throw appointmentsError
      
      // Calculate revenue metrics
      const totalRevenue = appointments?.reduce((sum, apt) => {
        const cplRate = apt.ebikes?.cpl_rate || 0
        return sum + cplRate
      }, 0) || 0
      
      const monthlyRevenue = totalRevenue // For now, same as total
      
      const cplPerformance = appointments?.reduce((acc, apt) => {
        const ebikeId = apt.ebike_id
        const cplRate = apt.ebikes?.cpl_rate || 0
        
        if (!acc[ebikeId]) {
          acc[ebikeId] = { ebike_id: ebikeId, cpl_rate: cplRate, conversions: 0 }
        }
        acc[ebikeId].conversions += 1
        return acc
      }, {} as Record<string, any>) || {}
      
      const cplArray = Object.values(cplPerformance)
      const topConverters = cplArray
        .map(c => ({ ebike_id: c.ebike_id, revenue: c.cpl_rate * c.conversions }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10)
      
      revenueMetrics.value = {
        total_revenue: totalRevenue,
        monthly_revenue: monthlyRevenue,
        cpl_performance: cplArray,
        top_converters: topConverters
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch revenue metrics'
      console.error('Error fetching revenue metrics:', err)
    } finally {
      loading.value = false
    }
  }

  // Set date range
  function setDateRange(start: Date, end: Date) {
    dateRange.value = { start, end }
  }

  return {
    metrics,
    conversionFunnel,
    revenueMetrics,
    loading,
    error,
    dateRange,
    fetchAnalyticsMetrics,
    fetchConversionFunnel,
    fetchRevenueMetrics,
    setDateRange
  }
})