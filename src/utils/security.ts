export class SecurityManager {
  private static instance: SecurityManager
  private rateLimitMap = new Map<string, { count: number; resetTime: number }>()
  private csrfToken: string | null = null

  static getInstance(): SecurityManager {
    if (!SecurityManager.instance) {
      SecurityManager.instance = new SecurityManager()
    }
    return SecurityManager.instance
  }

  // XSS Protection - Sanitize user input
  sanitizeInput(input: string): string {
    if (typeof input !== 'string') return ''
    
    return input
      .replace(/[<>]/g, '') // Remove < and >
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .replace(/script/gi, '') // Remove script tags
      .replace(/iframe/gi, '') // Remove iframe tags
      .replace(/object/gi, '') // Remove object tags
      .replace(/embed/gi, '') // Remove embed tags
      .replace(/link/gi, '') // Remove link tags
      .replace(/meta/gi, '') // Remove meta tags
      .replace(/style/gi, '') // Remove style tags
      .trim()
  }

  // HTML Entity Encoding
  encodeHtmlEntities(text: string): string {
    const entityMap: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;',
      '`': '&#x60;',
      '=': '&#x3D;'
    }
    
    return text.replace(/[&<>"'`=\/]/g, (s) => entityMap[s])
  }

  // Rate Limiting
  checkRateLimit(identifier: string, maxRequests: number = 100, windowMs: number = 60000): boolean {
    const now = Date.now()
    const key = identifier
    const record = this.rateLimitMap.get(key)

    if (!record || now > record.resetTime) {
      // Reset or create new record
      this.rateLimitMap.set(key, {
        count: 1,
        resetTime: now + windowMs
      })
      return true
    }

    if (record.count >= maxRequests) {
      return false
    }

    record.count++
    return true
  }

  // Generate CSRF Token
  generateCSRFToken(): string {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    this.csrfToken = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
    return this.csrfToken
  }

  // Validate CSRF Token
  validateCSRFToken(token: string): boolean {
    return this.csrfToken !== null && this.csrfToken === token
  }

  // Content Security Policy
  generateCSP(): string {
    return [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://api.anthropic.com https://www.google-analytics.com wss:",
      "media-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests"
    ].join('; ')
  }

  // Input Validation
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email) && email.length <= 254
  }

  validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = []
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long')
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter')
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter')
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number')
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }

  validatePhoneNumber(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))
  }

  // SQL Injection Prevention
  sanitizeSQLInput(input: string): string {
    return input
      .replace(/[';]/g, '') // Remove single quotes and semicolons
      .replace(/--/g, '') // Remove SQL comments
      .replace(/\/\*/g, '') // Remove block comment starts
      .replace(/\*\//g, '') // Remove block comment ends
      .replace(/union/gi, '') // Remove UNION keywords
      .replace(/select/gi, '') // Remove SELECT keywords
      .replace(/insert/gi, '') // Remove INSERT keywords
      .replace(/update/gi, '') // Remove UPDATE keywords
      .replace(/delete/gi, '') // Remove DELETE keywords
      .replace(/drop/gi, '') // Remove DROP keywords
      .trim()
  }

  // File Upload Security
  validateFileUpload(file: File, allowedTypes: string[], maxSize: number): { isValid: boolean; error?: string } {
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`
      }
    }

    // Check file size
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: `File size ${file.size} bytes exceeds maximum allowed size ${maxSize} bytes`
      }
    }

    // Check file name for malicious patterns
    const maliciousPatterns = [
      /\.\./, // Directory traversal
      /[<>:"|?*]/, // Invalid characters
      /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i // Reserved names
    ]

    for (const pattern of maliciousPatterns) {
      if (pattern.test(file.name)) {
        return {
          isValid: false,
          error: 'Invalid file name'
        }
      }
    }

    return { isValid: true }
  }

  // Secure Headers
  getSecurityHeaders(): Record<string, string> {
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Content-Security-Policy': this.generateCSP()
    }
  }

  // Session Security
  generateSecureSessionId(): string {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  }

  // API Key Validation
  validateAPIKey(apiKey: string): boolean {
    // Check format (32 character hex string)
    const apiKeyRegex = /^[a-f0-9]{32}$/
    return apiKeyRegex.test(apiKey)
  }

  // Request Validation
  validateRequest(request: any, requiredFields: string[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = []
    
    for (const field of requiredFields) {
      if (!request[field]) {
        errors.push(`Missing required field: ${field}`)
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Log Security Events
  logSecurityEvent(event: string, details: any): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      details,
      userAgent: navigator.userAgent,
      url: window.location.href
    }
    
    console.warn('Security Event:', logEntry)
    
    // In production, send to security monitoring service
    // this.sendToSecurityService(logEntry)
  }

  // Clean up sensitive data
  clearSensitiveData(): void {
    this.csrfToken = null
    this.rateLimitMap.clear()
  }

  // Check for suspicious activity
  detectSuspiciousActivity(identifier: string, action: string): boolean {
    const suspiciousPatterns = [
      /script/i,
      /javascript/i,
      /vbscript/i,
      /onload/i,
      /onerror/i,
      /<script/i,
      /<iframe/i,
      /<object/i,
      /<embed/i
    ]

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(action)) {
        this.logSecurityEvent('Suspicious Activity Detected', {
          identifier,
          action,
          pattern: pattern.toString()
        })
        return true
      }
    }

    return false
  }

  // Secure random string generation
  generateSecureRandomString(length: number = 32): string {
    const array = new Uint8Array(length)
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  }

  // Hash sensitive data (client-side hashing for additional security)
  async hashData(data: string): Promise<string> {
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(data)
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }
}

export const securityManager = SecurityManager.getInstance()
