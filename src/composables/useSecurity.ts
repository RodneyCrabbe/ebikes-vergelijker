import { ref, computed, onMounted, onUnmounted } from 'vue'
import { securityManager } from '../utils/security'
import { rateLimiter } from '../middleware/rateLimiter'
import { csrfProtection } from '../middleware/csrfProtection'
import { inputValidator } from '../middleware/inputValidation'

export function useSecurity() {
  const csrfToken = ref<string | null>(null)
  const isRateLimited = ref(false)
  const rateLimitInfo = ref<{ remaining: number; resetTime: number } | null>(null)
  const securityEvents = ref<Array<{ event: string; timestamp: string; details: any }>>([])

  // Initialize security features
  const initializeSecurity = async () => {
    // Generate CSRF token
    const sessionId = getSessionId()
    if (sessionId) {
      csrfToken.value = csrfProtection.generateToken(sessionId)
    }

    // Set up security event logging
    setupSecurityEventLogging()
  }

  // Get session ID
  const getSessionId = (): string | null => {
    // Try to get from localStorage
    const storedSessionId = localStorage.getItem('sessionId')
    if (storedSessionId) {
      return storedSessionId
    }

    // Generate new session ID
    const newSessionId = securityManager.generateSecureSessionId()
    localStorage.setItem('sessionId', newSessionId)
    return newSessionId
  }

  // Sanitize user input
  const sanitizeInput = (input: string): string => {
    return securityManager.sanitizeInput(input)
  }

  // Validate input
  const validateInput = (data: any, schemaName: string) => {
    return inputValidator.validate(data, schemaName)
  }

  // Check rate limit
  const checkRateLimit = (action: string): boolean => {
    const sessionId = getSessionId()
    if (!sessionId) return false

    const result = rateLimiter.isAllowed(sessionId, action)
    isRateLimited.value = !result.allowed
    rateLimitInfo.value = {
      remaining: result.remaining,
      resetTime: result.resetTime
    }

    return result.allowed
  }

  // Get rate limit headers
  const getRateLimitHeaders = (action: string): Record<string, string> => {
    const sessionId = getSessionId()
    if (!sessionId) return {}

    return rateLimiter.getRateLimitHeaders(sessionId, action)
  }

  // Validate CSRF token
  const validateCSRFToken = (token: string): boolean => {
    const sessionId = getSessionId()
    if (!sessionId) return false

    return csrfProtection.validateToken(sessionId, token)
  }

  // Refresh CSRF token
  const refreshCSRFToken = (): string | null => {
    const sessionId = getSessionId()
    if (!sessionId) return null

    csrfToken.value = csrfProtection.refreshToken(sessionId)
    return csrfToken.value
  }

  // Secure API call
  const secureApiCall = async (url: string, options: RequestInit = {}): Promise<Response> => {
    // Check rate limit
    if (!checkRateLimit('api')) {
      throw new Error('Rate limit exceeded')
    }

    // Add CSRF token to headers
    const headers = new Headers(options.headers)
    if (csrfToken.value) {
      headers.set('X-CSRF-Token', csrfToken.value)
    }

    // Add security headers
    headers.set('X-Requested-With', 'XMLHttpRequest')
    headers.set('Content-Type', 'application/json')

    const secureOptions: RequestInit = {
      ...options,
      headers,
      credentials: 'same-origin'
    }

    try {
      const response = await fetch(url, secureOptions)
      
      // Check for security-related response headers
      const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining')
      if (rateLimitRemaining) {
        rateLimitInfo.value = {
          remaining: parseInt(rateLimitRemaining),
          resetTime: Date.now() + 60000 // Assume 1 minute window
        }
      }

      return response
    } catch (error) {
      logSecurityEvent('API Call Failed', { url, error: error.message })
      throw error
    }
  }

  // Secure form submission
  const secureFormSubmit = async (formData: any, endpoint: string, schemaName?: string) => {
    // Validate input if schema provided
    if (schemaName) {
      const validation = validateInput(formData, schemaName)
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${JSON.stringify(validation.errors)}`)
      }
      formData = validation.sanitizedData
    }

    // Check rate limit
    if (!checkRateLimit('api')) {
      throw new Error('Rate limit exceeded')
    }

    // Add CSRF token
    if (csrfToken.value) {
      formData._csrf = csrfToken.value
    }

    return secureApiCall(endpoint, {
      method: 'POST',
      body: JSON.stringify(formData)
    })
  }

  // File upload security
  const secureFileUpload = (file: File, allowedTypes: string[], maxSize: number) => {
    const validation = securityManager.validateFileUpload(file, allowedTypes, maxSize)
    if (!validation.isValid) {
      throw new Error(validation.error)
    }

    // Check for suspicious file content
    if (securityManager.detectSuspiciousActivity('file-upload', file.name)) {
      throw new Error('Suspicious file detected')
    }

    return validation.isValid
  }

  // Log security events
  const logSecurityEvent = (event: string, details: any) => {
    const eventData = {
      event,
      timestamp: new Date().toISOString(),
      details
    }
    
    securityEvents.value.unshift(eventData)
    
    // Keep only last 100 events
    if (securityEvents.value.length > 100) {
      securityEvents.value = securityEvents.value.slice(0, 100)
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('Security Event:', eventData)
    }
  }

  // Setup security event logging
  const setupSecurityEventLogging = () => {
    // Monitor for suspicious activity
    const originalConsoleError = console.error
    console.error = (...args) => {
      logSecurityEvent('Console Error', { message: args.join(' ') })
      originalConsoleError.apply(console, args)
    }

    // Monitor for XSS attempts
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element
              if (element.innerHTML.includes('<script') || element.innerHTML.includes('javascript:')) {
                logSecurityEvent('Potential XSS Attempt', {
                  element: element.tagName,
                  content: element.innerHTML.substring(0, 100)
                })
              }
            }
          })
        }
      })
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    // Cleanup on unmount
    onUnmounted(() => {
      observer.disconnect()
    })
  }

  // Computed properties
  const isSecure = computed(() => {
    return csrfToken.value !== null && !isRateLimited.value
  })

  const securityStatus = computed(() => {
    return {
      csrfToken: csrfToken.value !== null,
      rateLimited: isRateLimited.value,
      remainingRequests: rateLimitInfo.value?.remaining || 0,
      resetTime: rateLimitInfo.value?.resetTime || 0
    }
  })

  // Initialize on mount
  onMounted(() => {
    initializeSecurity()
  })

  return {
    // State
    csrfToken,
    isRateLimited,
    rateLimitInfo,
    securityEvents,
    
    // Computed
    isSecure,
    securityStatus,
    
    // Methods
    sanitizeInput,
    validateInput,
    checkRateLimit,
    getRateLimitHeaders,
    validateCSRFToken,
    refreshCSRFToken,
    secureApiCall,
    secureFormSubmit,
    secureFileUpload,
    logSecurityEvent
  }
}

// Security composable for specific use cases
export function useFormSecurity(schemaName: string) {
  const security = useSecurity()

  const validateForm = (formData: any) => {
    return security.validateInput(formData, schemaName)
  }

  const submitForm = async (formData: any, endpoint: string) => {
    return security.secureFormSubmit(formData, endpoint, schemaName)
  }

  return {
    ...security,
    validateForm,
    submitForm
  }
}

// Security composable for file uploads
export function useFileUploadSecurity() {
  const security = useSecurity()

  const uploadFile = async (file: File, endpoint: string, allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/webp'], maxSize: number = 5 * 1024 * 1024) => {
    // Validate file
    security.secureFileUpload(file, allowedTypes, maxSize)

    // Check rate limit
    if (!security.checkRateLimit('upload')) {
      throw new Error('Upload rate limit exceeded')
    }

    // Create form data
    const formData = new FormData()
    formData.append('file', file)
    
    if (security.csrfToken.value) {
      formData.append('_csrf', security.csrfToken.value)
    }

    return security.secureApiCall(endpoint, {
      method: 'POST',
      body: formData
    })
  }

  return {
    ...security,
    uploadFile
  }
}
