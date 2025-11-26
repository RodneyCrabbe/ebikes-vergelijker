import { securityManager } from '../utils/security'

export interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  message?: string
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
}

export class RateLimiter {
  private static instance: RateLimiter
  private configs = new Map<string, RateLimitConfig>()

  static getInstance(): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter()
    }
    return RateLimiter.instance
  }

  // Add rate limit configuration
  addLimit(name: string, config: RateLimitConfig): void {
    this.configs.set(name, config)
  }

  // Check if request is allowed
  isAllowed(identifier: string, limitName: string): { allowed: boolean; remaining: number; resetTime: number } {
    const config = this.configs.get(limitName)
    if (!config) {
      return { allowed: true, remaining: Infinity, resetTime: 0 }
    }

    const allowed = securityManager.checkRateLimit(
      `${identifier}:${limitName}`,
      config.maxRequests,
      config.windowMs
    )

    // Get current rate limit info
    const key = `${identifier}:${limitName}`
    const record = securityManager['rateLimitMap'].get(key)
    
    return {
      allowed,
      remaining: record ? Math.max(0, config.maxRequests - record.count) : config.maxRequests,
      resetTime: record ? record.resetTime : Date.now() + config.windowMs
    }
  }

  // Get rate limit headers
  getRateLimitHeaders(identifier: string, limitName: string): Record<string, string> {
    const result = this.isAllowed(identifier, limitName)
    const config = this.configs.get(limitName)
    
    if (!config) return {}

    return {
      'X-RateLimit-Limit': config.maxRequests.toString(),
      'X-RateLimit-Remaining': result.remaining.toString(),
      'X-RateLimit-Reset': Math.ceil(result.resetTime / 1000).toString()
    }
  }

  // Middleware function for API routes
  createMiddleware(limitName: string) {
    return (req: any, res: any, next: any) => {
      const identifier = this.getIdentifier(req)
      const result = this.isAllowed(identifier, limitName)

      if (!result.allowed) {
        const config = this.configs.get(limitName)
        const headers = this.getRateLimitHeaders(identifier, limitName)
        
        Object.entries(headers).forEach(([key, value]) => {
          res.setHeader(key, value)
        })

        return res.status(429).json({
          error: 'Too Many Requests',
          message: config?.message || 'Rate limit exceeded',
          retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000)
        })
      }

      // Add rate limit headers to successful responses
      const headers = this.getRateLimitHeaders(identifier, limitName)
      Object.entries(headers).forEach(([key, value]) => {
        res.setHeader(key, value)
      })

      next()
    }
  }

  // Get client identifier
  private getIdentifier(req: any): string {
    // Try to get user ID first
    if (req.user?.id) {
      return `user:${req.user.id}`
    }

    // Fall back to IP address
    return `ip:${req.ip || req.connection.remoteAddress || 'unknown'}`
  }

  // Reset rate limit for specific identifier
  resetLimit(identifier: string, limitName: string): void {
    const key = `${identifier}:${limitName}`
    securityManager['rateLimitMap'].delete(key)
  }

  // Clear all rate limits
  clearAllLimits(): void {
    securityManager['rateLimitMap'].clear()
  }
}

export const rateLimiter = RateLimiter.getInstance()

// Predefined rate limit configurations
export const rateLimits = {
  // General API rate limiting
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 1000,
    message: 'Too many API requests, please try again later'
  },

  // Authentication rate limiting
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
    message: 'Too many authentication attempts, please try again later'
  },

  // Search rate limiting
  search: {
    windowMs: 1 * 60 * 1000, // 1 minute
    maxRequests: 30,
    message: 'Too many search requests, please slow down'
  },

  // Review submission rate limiting
  reviews: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 10,
    message: 'Too many review submissions, please try again later'
  },

  // Contact form rate limiting
  contact: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3,
    message: 'Too many contact form submissions, please try again later'
  },

  // Password reset rate limiting
  passwordReset: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3,
    message: 'Too many password reset requests, please try again later'
  },

  // File upload rate limiting
  upload: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 20,
    message: 'Too many file uploads, please try again later'
  }
}

// Initialize rate limits
Object.entries(rateLimits).forEach(([name, config]) => {
  rateLimiter.addLimit(name, config)
})
