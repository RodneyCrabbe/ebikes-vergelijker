import { describe, it, expect, beforeEach, vi } from 'vitest'
import { eventTrackingService } from '../../services/eventTrackingService'

// Mock Supabase
const mockSupabase = {
  from: vi.fn(() => ({
    insert: vi.fn().mockResolvedValue({ data: null, error: null })
  }))
}

vi.mock('../../lib/supabase', () => ({
  supabase: mockSupabase
}))

describe('Event Tracking Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset the service state
    eventTrackingService['sessionId'] = 'test-session-id'
    eventTrackingService['userId'] = null
  })

  it('should initialize tracking', () => {
    const mockAddEventListener = vi.spyOn(document, 'addEventListener')
    
    eventTrackingService.initialize()
    
    expect(mockAddEventListener).toHaveBeenCalledWith('click', expect.any(Function))
    expect(mockAddEventListener).toHaveBeenCalledWith('scroll', expect.any(Function))
    expect(mockAddEventListener).toHaveBeenCalledWith('beforeunload', expect.any(Function))
  })

  it('should track page view', async () => {
    const mockInsert = vi.fn().mockResolvedValue({ data: null, error: null })
    mockSupabase.from.mockReturnValue({ insert: mockInsert })

    await eventTrackingService.trackPageView('/test-page', 'Test Page')

    expect(mockSupabase.from).toHaveBeenCalledWith('analytics_events')
    expect(mockInsert).toHaveBeenCalledWith({
      event_type: 'page_view',
      session_id: 'test-session-id',
      page_url: '/test-page',
      properties: {
        page_title: 'Test Page',
        referrer: document.referrer,
        user_agent: navigator.userAgent
      },
      metadata: {
        timestamp: expect.any(String),
        viewport: expect.any(Object)
      }
    })
  })

  it('should track custom event', async () => {
    const mockInsert = vi.fn().mockResolvedValue({ data: null, error: null })
    mockSupabase.from.mockReturnValue({ insert: mockInsert })

    await eventTrackingService.trackEvent('button_click', {
      button_id: 'test-button',
      page: '/test-page'
    })

    expect(mockSupabase.from).toHaveBeenCalledWith('analytics_events')
    expect(mockInsert).toHaveBeenCalledWith({
      event_type: 'button_click',
      session_id: 'test-session-id',
      page_url: window.location.pathname,
      properties: {
        button_id: 'test-button',
        page: '/test-page'
      },
      metadata: {
        timestamp: expect.any(String),
        viewport: expect.any(Object)
      }
    })
  })

  it('should track e-bike view', async () => {
    const mockInsert = vi.fn().mockResolvedValue({ data: null, error: null })
    mockSupabase.from.mockReturnValue({ insert: mockInsert })

    await eventTrackingService.trackEBikeView('ebike-123', 'Test E-Bike', {
      brand: 'Test Brand',
      price: 2500,
      category: 'city'
    })

    expect(mockInsert).toHaveBeenCalledWith({
      event_type: 'ebike_view',
      session_id: 'test-session-id',
      page_url: window.location.pathname,
      properties: {
        ebike_id: 'ebike-123',
        ebike_name: 'Test E-Bike',
        brand: 'Test Brand',
        price: 2500,
        category: 'city'
      },
      metadata: {
        timestamp: expect.any(String),
        viewport: expect.any(Object)
      }
    })
  })

  it('should track e-bike comparison', async () => {
    const mockInsert = vi.fn().mockResolvedValue({ data: null, error: null })
    mockSupabase.from.mockReturnValue({ insert: mockInsert })

    await eventTrackingService.trackEBikeComparison(['ebike-1', 'ebike-2'], {
      ebike_names: ['Bike 1', 'Bike 2'],
      brands: ['Brand A', 'Brand B']
    })

    expect(mockInsert).toHaveBeenCalledWith({
      event_type: 'ebike_comparison',
      session_id: 'test-session-id',
      page_url: window.location.pathname,
      properties: {
        ebike_ids: ['ebike-1', 'ebike-2'],
        ebike_names: ['Bike 1', 'Bike 2'],
        brands: ['Brand A', 'Brand B'],
        comparison_count: 2
      },
      metadata: {
        timestamp: expect.any(String),
        viewport: expect.any(Object)
      }
    })
  })

  it('should track e-bike favorite', async () => {
    const mockInsert = vi.fn().mockResolvedValue({ data: null, error: null })
    mockSupabase.from.mockReturnValue({ insert: mockInsert })

    await eventTrackingService.trackEBikeFavorite('ebike-123', 'add', {
      ebike_name: 'Test E-Bike',
      brand: 'Test Brand'
    })

    expect(mockInsert).toHaveBeenCalledWith({
      event_type: 'ebike_favorite',
      session_id: 'test-session-id',
      page_url: window.location.pathname,
      properties: {
        ebike_id: 'ebike-123',
        action: 'add',
        ebike_name: 'Test E-Bike',
        brand: 'Test Brand'
      },
      metadata: {
        timestamp: expect.any(String),
        viewport: expect.any(Object)
      }
    })
  })

  it('should track search', async () => {
    const mockInsert = vi.fn().mockResolvedValue({ data: null, error: null })
    mockSupabase.from.mockReturnValue({ insert: mockInsert })

    await eventTrackingService.trackSearch('mountain bike', { category: 'mountain' }, 5)

    expect(mockInsert).toHaveBeenCalledWith({
      event_type: 'search',
      session_id: 'test-session-id',
      page_url: window.location.pathname,
      properties: {
        query: 'mountain bike',
        filters: { category: 'mountain' },
        results_count: 5
      },
      metadata: {
        timestamp: expect.any(String),
        viewport: expect.any(Object)
      }
    })
  })

  it('should track conversion', async () => {
    const mockInsert = vi.fn().mockResolvedValue({ data: null, error: null })
    mockSupabase.from.mockReturnValue({ insert: mockInsert })

    await eventTrackingService.trackConversion('purchase', 2500, {
      ebike_id: 'ebike-123',
      ebike_name: 'Test E-Bike'
    })

    expect(mockInsert).toHaveBeenCalledWith({
      event_type: 'conversion',
      session_id: 'test-session-id',
      page_url: window.location.pathname,
      properties: {
        conversion_type: 'purchase',
        value: 2500,
        ebike_id: 'ebike-123',
        ebike_name: 'Test E-Bike'
      },
      metadata: {
        timestamp: expect.any(String),
        viewport: expect.any(Object)
      }
    })
  })

  it('should set user ID', () => {
    eventTrackingService.setUserId('user-123')
    expect(eventTrackingService['userId']).toBe('user-123')
  })

  it('should track user login', async () => {
    const mockInsert = vi.fn().mockResolvedValue({ data: null, error: null })
    mockSupabase.from.mockReturnValue({ insert: mockInsert })

    eventTrackingService.setUserId('user-123')
    await eventTrackingService.trackUserLogin()

    expect(mockInsert).toHaveBeenCalledWith({
      event_type: 'user_login',
      session_id: 'test-session-id',
      user_id: 'user-123',
      page_url: window.location.pathname,
      properties: {
        login_method: 'email'
      },
      metadata: {
        timestamp: expect.any(String),
        viewport: expect.any(Object)
      }
    })
  })

  it('should handle tracking errors gracefully', async () => {
    const mockError = new Error('Database error')
    mockSupabase.from.mockReturnValue({
      insert: vi.fn().mockRejectedValue(mockError)
    })

    // Should not throw error
    await expect(eventTrackingService.trackEvent('test_event')).resolves.toBeUndefined()
  })
})
