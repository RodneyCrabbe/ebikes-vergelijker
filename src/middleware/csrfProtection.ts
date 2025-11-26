import { securityManager } from '../utils/security'

export class CSRFProtection {
  private static instance: CSRFProtection
  private tokens = new Map<string, { token: string; expires: number }>()

  static getInstance(): CSRFProtection {
    if (!CSRFProtection.instance) {
      CSRFProtection.instance = new CSRFProtection()
    }
    return CSRFProtection.instance
  }

  // Generate CSRF token for session
  generateToken(sessionId: string): string {
    const token = securityManager.generateSecureRandomString(32)
    const expires = Date.now() + (24 * 60 * 60 * 1000) // 24 hours

    this.tokens.set(sessionId, { token, expires })
    return token
  }

  // Validate CSRF token
  validateToken(sessionId: string, token: string): boolean {
    const tokenData = this.tokens.get(sessionId)
    
    if (!tokenData) {
      return false
    }

    // Check if token has expired
    if (Date.now() > tokenData.expires) {
      this.tokens.delete(sessionId)
      return false
    }

    // Check if token matches
    return tokenData.token === token
  }

  // Get CSRF token for session
  getToken(sessionId: string): string | null {
    const tokenData = this.tokens.get(sessionId)
    
    if (!tokenData || Date.now() > tokenData.expires) {
      return null
    }

    return tokenData.token
  }

  // Refresh CSRF token
  refreshToken(sessionId: string): string {
    return this.generateToken(sessionId)
  }

  // Revoke CSRF token
  revokeToken(sessionId: string): void {
    this.tokens.delete(sessionId)
  }

  // Clean up expired tokens
  cleanupExpiredTokens(): void {
    const now = Date.now()
    for (const [sessionId, tokenData] of this.tokens.entries()) {
      if (now > tokenData.expires) {
        this.tokens.delete(sessionId)
      }
    }
  }

  // Middleware function
  createMiddleware() {
    return (req: any, res: any, next: any) => {
      const sessionId = this.getSessionId(req)
      
      if (!sessionId) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Session required for CSRF protection'
        })
      }

      // Skip CSRF check for safe methods
      if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        return next()
      }

      const token = this.extractToken(req)
      
      if (!token) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'CSRF token required'
        })
      }

      if (!this.validateToken(sessionId, token)) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'Invalid CSRF token'
        })
      }

      next()
    }
  }

  // Get session ID from request
  private getSessionId(req: any): string | null {
    // Try to get from session cookie
    const sessionCookie = req.cookies?.sessionId
    if (sessionCookie) {
      return sessionCookie
    }

    // Try to get from authorization header
    const authHeader = req.headers?.authorization
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.substring(7)
    }

    // Try to get from custom header
    return req.headers?.['x-session-id']
  }

  // Extract CSRF token from request
  private extractToken(req: any): string | null {
    // Try to get from header first
    const headerToken = req.headers?.['x-csrf-token']
    if (headerToken) {
      return headerToken
    }

    // Try to get from body
    const bodyToken = req.body?._csrf
    if (bodyToken) {
      return bodyToken
    }

    // Try to get from query parameters
    const queryToken = req.query?._csrf
    if (queryToken) {
      return queryToken
    }

    return null
  }

  // Generate CSRF token endpoint
  generateTokenEndpoint(req: any, res: any) {
    const sessionId = this.getSessionId(req)
    
    if (!sessionId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Session required'
      })
    }

    const token = this.generateToken(sessionId)
    
    res.json({
      csrfToken: token,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    })
  }

  // Validate token endpoint
  validateTokenEndpoint(req: any, res: any) {
    const sessionId = this.getSessionId(req)
    const token = this.extractToken(req)
    
    if (!sessionId || !token) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Session ID and token required'
      })
    }

    const isValid = this.validateToken(sessionId, token)
    
    res.json({
      valid: isValid,
      message: isValid ? 'Token is valid' : 'Token is invalid or expired'
    })
  }

  // Get all active tokens (for admin purposes)
  getActiveTokens(): Array<{ sessionId: string; expires: Date }> {
    const now = Date.now()
    const activeTokens: Array<{ sessionId: string; expires: Date }> = []
    
    for (const [sessionId, tokenData] of this.tokens.entries()) {
      if (now <= tokenData.expires) {
        activeTokens.push({
          sessionId,
          expires: new Date(tokenData.expires)
        })
      }
    }
    
    return activeTokens
  }

  // Clear all tokens
  clearAllTokens(): void {
    this.tokens.clear()
  }
}

export const csrfProtection = CSRFProtection.getInstance()

// Auto-cleanup expired tokens every hour
setInterval(() => {
  csrfProtection.cleanupExpiredTokens()
}, 60 * 60 * 1000)
