export class PageSpeedOptimizer {
  private static instance: PageSpeedOptimizer
  private observer: IntersectionObserver | null = null
  private loadedImages = new Set<string>()

  static getInstance(): PageSpeedOptimizer {
    if (!PageSpeedOptimizer.instance) {
      PageSpeedOptimizer.instance = new PageSpeedOptimizer()
    }
    return PageSpeedOptimizer.instance
  }

  // Initialize page speed optimizations
  initialize(): void {
    this.setupImageLazyLoading()
    this.setupPreloading()
    this.setupResourceHints()
    this.setupCriticalCSS()
    this.setupServiceWorker()
  }

  // Lazy load images
  setupImageLazyLoading(): void {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            this.loadImage(img)
            this.observer?.unobserve(img)
          }
        })
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      })

      // Observe all images with data-src
      document.querySelectorAll('img[data-src]').forEach(img => {
        this.observer?.observe(img)
      })
    } else {
      // Fallback for older browsers
      document.querySelectorAll('img[data-src]').forEach(img => {
        this.loadImage(img as HTMLImageElement)
      })
    }
  }

  // Load image with error handling
  private loadImage(img: HTMLImageElement): void {
    const src = img.dataset.src
    if (!src || this.loadedImages.has(src)) return

    const imageLoader = new Image()
    imageLoader.onload = () => {
      img.src = src
      img.classList.add('loaded')
      this.loadedImages.add(src)
    }
    imageLoader.onerror = () => {
      img.classList.add('error')
      console.warn(`Failed to load image: ${src}`)
    }
    imageLoader.src = src
  }

  // Preload critical resources
  setupPreloading(): void {
    // Preload critical CSS
    this.preloadResource('/css/critical.css', 'style')
    
    // Preload critical fonts
    this.preloadResource('/fonts/inter-var.woff2', 'font')
    
    // Preload critical images
    this.preloadResource('/images/hero-bg.webp', 'image')
    
    // Preload critical JavaScript
    this.preloadResource('/js/critical.js', 'script')
  }

  // Preload resource
  private preloadResource(href: string, as: string, type?: string): void {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = href
    link.as = as
    if (type) link.type = type
    if (as === 'font') link.crossOrigin = 'anonymous'
    document.head.appendChild(link)
  }

  // Setup resource hints
  setupResourceHints(): void {
    // DNS prefetch for external domains
    const externalDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://cdn.jsdelivr.net'
    ]

    externalDomains.forEach(domain => {
      const link = document.createElement('link')
      link.rel = 'dns-prefetch'
      link.href = domain
      document.head.appendChild(link)
    })

    // Preconnect to important origins
    const preconnectOrigins = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ]

    preconnectOrigins.forEach(origin => {
      const link = document.createElement('link')
      link.rel = 'preconnect'
      link.href = origin
      link.crossOrigin = 'anonymous'
      document.head.appendChild(link)
    })
  }

  // Setup critical CSS
  setupCriticalCSS(): void {
    const criticalCSS = `
      /* Critical CSS for above-the-fold content */
      body { margin: 0; font-family: Inter, sans-serif; }
      .header { position: fixed; top: 0; width: 100%; z-index: 1000; }
      .hero { min-height: 100vh; display: flex; align-items: center; }
      .loading { display: flex; justify-content: center; align-items: center; }
    `

    const style = document.createElement('style')
    style.textContent = criticalCSS
    style.setAttribute('data-critical', 'true')
    document.head.appendChild(style)
  }

  // Setup service worker for caching
  setupServiceWorker(): void {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('SW registered: ', registration)
          })
          .catch(registrationError => {
            console.log('SW registration failed: ', registrationError)
          })
      })
    }
  }

  // Optimize images
  optimizeImage(img: HTMLImageElement, options: {
    width?: number
    height?: number
    quality?: number
    format?: 'webp' | 'avif' | 'jpeg' | 'png'
  } = {}): string {
    const { width, height, quality = 80, format = 'webp' } = options
    
    // For now, return original src
    // In production, this would generate optimized image URLs
    return img.src
  }

  // Defer non-critical JavaScript
  deferScript(src: string, callback?: () => void): void {
    const script = document.createElement('script')
    script.src = src
    script.defer = true
    script.onload = callback
    document.head.appendChild(script)
  }

  // Load script asynchronously
  loadScriptAsync(src: string, callback?: () => void): void {
    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.onload = callback
    document.head.appendChild(script)
  }

  // Optimize third-party scripts
  optimizeThirdPartyScripts(): void {
    // Load Google Analytics asynchronously
    this.loadScriptAsync('https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID')
    
    // Load other third-party scripts with delay
    setTimeout(() => {
      this.loadScriptAsync('https://cdn.jsdelivr.net/npm/chart.js')
    }, 2000)
  }

  // Compress and optimize data
  compressData(data: any): string {
    // Simple compression for demo - in production use proper compression
    return JSON.stringify(data)
  }

  // Setup performance monitoring
  setupPerformanceMonitoring(): void {
    // Monitor Core Web Vitals
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        console.log('LCP:', lastEntry.startTime)
      }).observe({ entryTypes: ['largest-contentful-paint'] })

      // First Input Delay
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach(entry => {
          console.log('FID:', entry.processingStart - entry.startTime)
        })
      }).observe({ entryTypes: ['first-input'] })

      // Cumulative Layout Shift
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach(entry => {
          if (!entry.hadRecentInput) {
            console.log('CLS:', entry.value)
          }
        })
      }).observe({ entryTypes: ['layout-shift'] })
    }
  }

  // Optimize bundle loading
  optimizeBundleLoading(): void {
    // Load critical bundles first
    this.deferScript('/js/vendor.js')
    this.deferScript('/js/app.js')
    
    // Load non-critical bundles later
    setTimeout(() => {
      this.deferScript('/js/analytics.js')
      this.deferScript('/js/chatbot.js')
    }, 3000)
  }

  // Setup resource prioritization
  setupResourcePrioritization(): void {
    // High priority resources
    const highPriority = [
      '/css/critical.css',
      '/js/critical.js',
      '/images/logo.svg'
    ]

    highPriority.forEach(resource => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = resource
      link.as = resource.endsWith('.css') ? 'style' : 'script'
      link.setAttribute('data-priority', 'high')
      document.head.appendChild(link)
    })

    // Low priority resources
    const lowPriority = [
      '/js/analytics.js',
      '/js/chatbot.js',
      '/images/background.jpg'
    ]

    lowPriority.forEach(resource => {
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = resource
      link.setAttribute('data-priority', 'low')
      document.head.appendChild(link)
    })
  }

  // Cleanup
  destroy(): void {
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }
  }
}

export const pageSpeedOptimizer = PageSpeedOptimizer.getInstance()
