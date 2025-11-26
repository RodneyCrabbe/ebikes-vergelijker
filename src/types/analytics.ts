export interface AnalyticsMetrics {
  daily_active_users: number
  monthly_active_users: number
  page_views: number
  unique_visitors: number
  bounce_rate: number
  average_session_duration: number
  conversion_rate: number
  top_pages: Array<{ page: string; views: number }>
  top_ebikes: Array<{ ebike_id: string; views: number }>
  user_retention: Array<{ date: string; retention_rate: number }>
}

export interface ConversionFunnelStep {
  step: string
  count: number
}

export interface RevenueMetrics {
  total_revenue: number
  monthly_revenue: number
  cpl_performance: Array<{ ebike_id: string; cpl_rate: number; conversions: number }>
  top_converters: Array<{ ebike_id: string; revenue: number }>
}

export interface DateRange {
  start: Date
  end: Date
}
