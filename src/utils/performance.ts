// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Map<string, number> = new Map()

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  startTiming(label: string): void {
    this.metrics.set(`${label}_start`, performance.now())
  }

  endTiming(label: string): number {
    const startTime = this.metrics.get(`${label}_start`)
    if (!startTime) {
      console.warn(`No start time found for ${label}`)
      return 0
    }
    
    const duration = performance.now() - startTime
    this.metrics.set(label, duration)
    this.metrics.delete(`${label}_start`)
    
    return duration
  }

  getTiming(label: string): number | undefined {
    return this.metrics.get(label)
  }

  getAllMetrics(): Record<string, number> {
    const result: Record<string, number> = {}
    this.metrics.forEach((value, key) => {
      if (!key.endsWith('_start')) {
        result[key] = value
      }
    })
    return result
  }

  // Measure page load performance
  measurePageLoad(): void {
    if (typeof window !== 'undefined' && window.performance) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      
      if (navigation) {
        this.metrics.set('page_load_dom_content_loaded', navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart)
        this.metrics.set('page_load_complete', navigation.loadEventEnd - navigation.loadEventStart)
        this.metrics.set('page_load_total', navigation.loadEventEnd - navigation.fetchStart)
      }
    }
  }

  // Measure API call performance
  measureApiCall<T>(label: string, apiCall: () => Promise<T>): Promise<T> {
    this.startTiming(label)
    return apiCall().finally(() => {
      const duration = this.endTiming(label)
      if (process.env.NODE_ENV === 'development') {
        console.log(`API call ${label} took ${duration.toFixed(2)}ms`)
      }
    })
  }

  // Measure component render performance
  measureRender(label: string, renderFn: () => void): void {
    this.startTiming(`render_${label}`)
    renderFn()
    // Use nextTick to measure after DOM updates
    if (typeof window !== 'undefined') {
      requestAnimationFrame(() => {
        const duration = this.endTiming(`render_${label}`)
        if (process.env.NODE_ENV === 'development') {
          console.log(`Render ${label} took ${duration.toFixed(2)}ms`)
        }
      })
    }
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance()

// Auto-measure page load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    performanceMonitor.measurePageLoad()
  })
}
