export interface EventData {
  event_type: string
  user_id?: string
  session_id?: string
  page_url: string
  referrer?: string
  user_agent?: string
  timestamp: string
  properties?: Record<string, any>
  metadata?: Record<string, any>
}

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

export interface ConversionFunnel {
  step: string
  users: number
  conversion_rate: number
  drop_off_rate: number
}

export interface RevenueMetrics {
  total_revenue: number
  monthly_revenue: number
  cpl_performance: Array<{ ebike_id: string; cpl_rate: number; conversions: number }>
  top_converters: Array<{ ebike_id: string; revenue: number }>
}

class EventTrackingService {
  private events: EventData[] = []
  private sessionId: string
  private userId: string | null = null
  private isEnabled: boolean = true
  private batchSize: number = 10
  private flushInterval: number = 30000 // 30 seconds

  constructor() {
    this.sessionId = this.generateSessionId()
    this.initializeTracking()
  }

  // Initialize tracking
  initialize() {
    this.initializeTracking()
  }

  // Initialize tracking
  private initializeTracking() {
    // Track page views
    this.trackPageView()
    
    // Track user interactions
    this.setupEventListeners()
    
    // Flush events periodically
    setInterval(() => this.flushEvents(), this.flushInterval)
    
    // Flush events before page unload
    window.addEventListener('beforeunload', () => this.flushEvents())
  }

  // Generate unique session ID
  private generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  // Set user ID for tracking
  setUserId(userId: string | null) {
    this.userId = userId
  }

  // Track page view
  trackPageView(page?: string, properties?: Record<string, any>) {
    const event: EventData = {
      event_type: 'page_view',
      user_id: this.userId || undefined,
      session_id: this.sessionId,
      page_url: page || window.location.href,
      referrer: document.referrer || undefined,
      user_agent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      properties: {
        page_title: document.title,
        ...properties
      }
    }
    
    this.addEvent(event)
  }

  // Track custom event
  trackEvent(eventType: string, properties?: Record<string, any>, metadata?: Record<string, any>) {
    const event: EventData = {
      event_type: eventType,
      user_id: this.userId || undefined,
      session_id: this.sessionId,
      page_url: window.location.href,
      referrer: document.referrer || undefined,
      user_agent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      properties,
      metadata
    }
    
    this.addEvent(event)
  }

  // Track e-bike specific events
  trackEBikeView(ebikeId: string, ebikeName: string, properties?: Record<string, any>) {
    this.trackEvent('ebike_view', {
      ebike_id: ebikeId,
      ebike_name: ebikeName,
      ...properties
    })
  }

  trackEBikeComparison(ebikeIds: string[], properties?: Record<string, any>) {
    this.trackEvent('ebike_comparison', {
      ebike_ids: ebikeIds,
      comparison_count: ebikeIds.length,
      ...properties
    })
  }

  trackEBikeFavorite(ebikeId: string, action: 'add' | 'remove', properties?: Record<string, any>) {
    this.trackEvent('ebike_favorite', {
      ebike_id: ebikeId,
      action,
      ...properties
    })
  }

  trackAppointmentBooking(appointmentId: string, ebikeId: string, properties?: Record<string, any>) {
    this.trackEvent('appointment_booked', {
      appointment_id: appointmentId,
      ebike_id: ebikeId,
      ...properties
    })
  }

  trackSearch(query: string, filters: Record<string, any>, resultsCount: number) {
    this.trackEvent('search_performed', {
      search_query: query,
      filters,
      results_count: resultsCount
    })
  }

  trackReviewPosted(ebikeId: string, rating: number, properties?: Record<string, any>) {
    this.trackEvent('review_posted', {
      ebike_id: ebikeId,
      rating,
      ...properties
    })
  }

  trackUserRegistration(properties?: Record<string, any>) {
    this.trackEvent('user_registered', {
      registration_method: 'email',
      ...properties
    })
  }

  trackUserLogin(properties?: Record<string, any>) {
    this.trackEvent('user_login', {
      login_method: 'email',
      ...properties
    })
  }

  trackConversion(conversionType: string, value?: number, properties?: Record<string, any>) {
    this.trackEvent('conversion', {
      conversion_type: conversionType,
      value,
      ...properties
    })
  }

  // Track performance metrics
  trackPerformance(metric: string, value: number, properties?: Record<string, any>) {
    this.trackEvent('performance_metric', {
      metric_name: metric,
      metric_value: value,
      ...properties
    })
  }

  // Track error
  trackError(error: Error, context?: Record<string, any>) {
    this.trackEvent('error', {
      error_message: error.message,
      error_stack: error.stack,
      ...context
    })
  }

  // Add event to queue
  private addEvent(event: EventData) {
    if (!this.isEnabled) return
    
    this.events.push(event)
    
    // Flush if batch size reached
    if (this.events.length >= this.batchSize) {
      this.flushEvents()
    }
  }

  // Setup event listeners for automatic tracking
  private setupEventListeners() {
    // Track clicks on important elements
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement
      if (target.matches('[data-track]')) {
        const eventType = target.getAttribute('data-track')
        const properties = this.getDataAttributes(target)
        this.trackEvent(eventType || 'click', properties)
      }
    })

    // Track form submissions
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement
      if (form.matches('[data-track-form]')) {
        const formName = form.getAttribute('data-track-form')
        this.trackEvent('form_submit', {
          form_name: formName,
          form_id: form.id
        })
      }
    })

    // Track scroll depth
    let maxScrollDepth = 0
    window.addEventListener('scroll', () => {
      const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100)
      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth
        this.trackEvent('scroll_depth', {
          scroll_percentage: scrollDepth
        })
      }
    })

    // Track time on page
    let startTime = Date.now()
    window.addEventListener('beforeunload', () => {
      const timeOnPage = Date.now() - startTime
      this.trackEvent('time_on_page', {
        duration_seconds: Math.round(timeOnPage / 1000)
      })
    })
  }

  // Get data attributes from element
  private getDataAttributes(element: HTMLElement): Record<string, any> {
    const attributes: Record<string, any> = {}
    for (const attr of element.attributes) {
      if (attr.name.startsWith('data-') && attr.name !== 'data-track') {
        const key = attr.name.replace('data-', '').replace(/-/g, '_')
        attributes[key] = attr.value
      }
    }
    return attributes
  }

  // Flush events to server
  private async flushEvents() {
    if (this.events.length === 0) return

    const eventsToFlush = [...this.events]
    this.events = []

    try {
      await this.sendEvents(eventsToFlush)
    } catch (error) {
      console.error('Error flushing events:', error)
      // Re-add events to queue for retry
      this.events.unshift(...eventsToFlush)
    }
  }

  // Send events to server
  private async sendEvents(events: EventData[]) {
    try {
      // Skip Supabase analytics in production if not configured
      // Only use Supabase if it's properly configured (not localhost)
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
      const isLocalhost = supabaseUrl.includes('127.0.0.1') || supabaseUrl.includes('localhost')
      
      // In production, skip analytics if Supabase is not configured
      if (import.meta.env.PROD && (isLocalhost || !supabaseUrl)) {
        logger.log('Skipping analytics events - Supabase not configured for production')
        return
      }
      
      // Import Supabase client dynamically to avoid circular dependencies
      const { supabase } = await import('../lib/supabase')
      
      // Check if Supabase is available (not the dummy client)
      if (!supabase || !supabase.from) {
        logger.log('Skipping analytics events - Supabase not available')
        return
      }
      
      // Insert events in batches
      const batchSize = 100
      for (let i = 0; i < events.length; i += batchSize) {
        const batch = events.slice(i, i + batchSize)
        
        const { error } = await supabase
          .from('analytics_events')
          .insert(batch.map(event => ({
            event_type: event.event_type,
            user_id: event.user_id || null,
            session_id: event.session_id,
            page_url: event.page_url,
            referrer: event.referrer || null,
            user_agent: event.user_agent || null,
            properties: event.properties || {},
            metadata: event.metadata || {}
          })))
        
        if (error) {
          // Don't throw in production - just log and continue
          if (import.meta.env.PROD) {
            logger.warn('Analytics event insertion failed (non-critical):', error.message)
            return
          }
          console.error('Error inserting analytics events:', error)
          throw error
        }
      }
    } catch (error) {
      // In production, don't let analytics errors break the app
      if (import.meta.env.PROD) {
        logger.warn('Analytics error (non-critical):', error instanceof Error ? error.message : 'Unknown error')
        return
      }
      console.error('Error sending events to Supabase:', error)
      throw error
    }
  }

  // Get analytics metrics
  async getAnalyticsMetrics(dateRange: { start: Date; end: Date }): Promise<AnalyticsMetrics> {
    // This would query your analytics database
    // For now, return mock data
    return {
      daily_active_users: 150,
      monthly_active_users: 1200,
      page_views: 5000,
      unique_visitors: 800,
      bounce_rate: 0.35,
      average_session_duration: 180, // seconds
      conversion_rate: 0.08,
      top_pages: [
        { page: '/e-bikes', views: 1200 },
        { page: '/e-bikes/vanmoof-s5', views: 800 },
        { page: '/compare', views: 600 }
      ],
      top_ebikes: [
        { ebike_id: 'vanmoof-s5', views: 800 },
        { ebike_id: 'gazelle-ultimate-c8', views: 600 },
        { ebike_id: 'trek-allant-7', views: 400 }
      ],
      user_retention: [
        { date: '2024-01-01', retention_rate: 0.65 },
        { date: '2024-01-02', retention_rate: 0.70 },
        { date: '2024-01-03', retention_rate: 0.68 }
      ]
    }
  }

  // Get conversion funnel
  async getConversionFunnel(dateRange: { start: Date; end: Date }): Promise<ConversionFunnel[]> {
    return [
      { step: 'Page View', users: 1000, conversion_rate: 1.0, drop_off_rate: 0 },
      { step: 'EBike View', users: 600, conversion_rate: 0.6, drop_off_rate: 0.4 },
      { step: 'Comparison', users: 200, conversion_rate: 0.2, drop_off_rate: 0.67 },
      { step: 'Appointment', users: 80, conversion_rate: 0.08, drop_off_rate: 0.6 },
      { step: 'Conversion', users: 40, conversion_rate: 0.04, drop_off_rate: 0.5 }
    ]
  }

  // Get revenue metrics
  async getRevenueMetrics(dateRange: { start: Date; end: Date }): Promise<RevenueMetrics> {
    return {
      total_revenue: 15000,
      monthly_revenue: 5000,
      cpl_performance: [
        { ebike_id: 'vanmoof-s5', cpl_rate: 25.50, conversions: 20 },
        { ebike_id: 'gazelle-ultimate-c8', cpl_rate: 30.00, conversions: 15 },
        { ebike_id: 'trek-allant-7', cpl_rate: 22.75, conversions: 12 }
      ],
      top_converters: [
        { ebike_id: 'vanmoof-s5', revenue: 510 },
        { ebike_id: 'gazelle-ultimate-c8', revenue: 450 },
        { ebike_id: 'trek-allant-7', revenue: 273 }
      ]
    }
  }

  // Enable/disable tracking
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled
  }

  // Get current session ID
  getSessionId(): string {
    return this.sessionId
  }

  // Get current user ID
  getUserId(): string | null {
    return this.userId
  }
}

export const eventTrackingService = new EventTrackingService()
