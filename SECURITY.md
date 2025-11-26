# 🔒 Security Documentation

This document outlines the comprehensive security measures implemented in the E-Bike Platform.

## 🛡️ Security Features

### 1. Input Validation & Sanitization
- **XSS Protection**: All user input is sanitized to prevent cross-site scripting attacks
- **SQL Injection Prevention**: Input is cleaned to prevent SQL injection attacks
- **File Upload Security**: Strict validation of file types, sizes, and content
- **Input Length Limits**: Maximum length restrictions on all text inputs

### 2. Rate Limiting
- **API Rate Limiting**: 1000 requests per 15 minutes for general API calls
- **Authentication Rate Limiting**: 5 login attempts per 15 minutes
- **Search Rate Limiting**: 30 searches per minute
- **Review Submission**: 10 reviews per hour
- **Contact Form**: 3 submissions per hour
- **File Upload**: 20 uploads per hour

### 3. CSRF Protection
- **Token Generation**: Unique CSRF tokens for each session
- **Token Validation**: All state-changing requests require valid CSRF tokens
- **Token Expiration**: Tokens expire after 24 hours
- **Automatic Refresh**: Tokens are refreshed on each request

### 4. Content Security Policy (CSP)
```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://api.anthropic.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests
```

### 5. Security Headers
- **X-Content-Type-Options**: nosniff
- **X-Frame-Options**: DENY
- **X-XSS-Protection**: 1; mode=block
- **Referrer-Policy**: strict-origin-when-cross-origin
- **Strict-Transport-Security**: max-age=31536000; includeSubDomains

## 🔧 Implementation

### Security Manager
```typescript
import { securityManager } from './utils/security'

// Sanitize user input
const cleanInput = securityManager.sanitizeInput(userInput)

// Validate email
const isValidEmail = securityManager.validateEmail(email)

// Validate password strength
const passwordValidation = securityManager.validatePassword(password)

// Generate secure random string
const secureToken = securityManager.generateSecureRandomString(32)
```

### Rate Limiting
```typescript
import { rateLimiter } from './middleware/rateLimiter'

// Check if request is allowed
const result = rateLimiter.isAllowed(userId, 'api')

// Get rate limit headers
const headers = rateLimiter.getRateLimitHeaders(userId, 'api')
```

### CSRF Protection
```typescript
import { csrfProtection } from './middleware/csrfProtection'

// Generate token for session
const token = csrfProtection.generateToken(sessionId)

// Validate token
const isValid = csrfProtection.validateToken(sessionId, token)
```

### Input Validation
```typescript
import { inputValidator } from './middleware/inputValidation'

// Validate data against schema
const validation = inputValidator.validate(data, 'userRegistration')

// Validate specific field
const fieldValidation = inputValidator.validateField(value, rules, 'email')
```

### Vue Security Composable
```typescript
import { useSecurity } from './composables/useSecurity'

export default {
  setup() {
    const {
      sanitizeInput,
      validateInput,
      secureApiCall,
      secureFormSubmit,
      isSecure,
      securityStatus
    } = useSecurity()

    // Use security features in component
    const handleSubmit = async (formData) => {
      try {
        await secureFormSubmit(formData, '/api/submit', 'contactForm')
      } catch (error) {
        console.error('Security error:', error)
      }
    }

    return {
      handleSubmit,
      isSecure,
      securityStatus
    }
  }
}
```

## 📋 Validation Schemas

### User Registration
```typescript
{
  email: {
    required: true,
    type: 'email',
    maxLength: 254,
    sanitize: true
  },
  password: {
    required: true,
    type: 'string',
    minLength: 8,
    maxLength: 128,
    custom: (value) => securityManager.validatePassword(value)
  },
  fullName: {
    required: true,
    type: 'string',
    minLength: 2,
    maxLength: 100,
    sanitize: true
  }
}
```

### E-bike Review
```typescript
{
  ebikeId: {
    required: true,
    type: 'string',
    pattern: /^[a-zA-Z0-9-_]+$/,
    sanitize: true
  },
  rating: {
    required: true,
    type: 'number',
    min: 1,
    max: 5
  },
  comment: {
    required: true,
    type: 'string',
    minLength: 10,
    maxLength: 1000,
    sanitize: true
  }
}
```

### Search Query
```typescript
{
  query: {
    required: true,
    type: 'string',
    minLength: 1,
    maxLength: 100,
    sanitize: true
  },
  category: {
    required: false,
    type: 'string',
    pattern: /^(city|mountain|commute|touring|cargo|folding|fat_bike|road|hybrid)$/,
    sanitize: true
  }
}
```

## 🚨 Security Monitoring

### Event Logging
All security events are logged and monitored:
- Failed authentication attempts
- Rate limit violations
- Suspicious input patterns
- File upload violations
- CSRF token mismatches

### Security Event Types
```typescript
// Authentication events
logSecurityEvent('Failed Login', { email, ip, userAgent })

// Rate limiting events
logSecurityEvent('Rate Limit Exceeded', { action, identifier, count })

// Input validation events
logSecurityEvent('Invalid Input', { field, value, error })

// File upload events
logSecurityEvent('File Upload Violation', { filename, type, size })
```

## 🔍 Security Testing

### Unit Tests
```typescript
describe('Security Manager', () => {
  it('should sanitize XSS attempts', () => {
    const maliciousInput = '<script>alert("xss")</script>'
    const sanitized = securityManager.sanitizeInput(maliciousInput)
    expect(sanitized).not.toContain('<script>')
  })

  it('should validate email format', () => {
    expect(securityManager.validateEmail('test@example.com')).toBe(true)
    expect(securityManager.validateEmail('invalid-email')).toBe(false)
  })
})
```

### Integration Tests
```typescript
describe('Rate Limiting', () => {
  it('should block requests after limit exceeded', async () => {
    // Make requests up to limit
    for (let i = 0; i < 5; i++) {
      await makeAuthRequest()
    }
    
    // Next request should be blocked
    const response = await makeAuthRequest()
    expect(response.status).toBe(429)
  })
})
```

## 🛠️ Configuration

### Environment Variables
```env
# Security settings
SECURITY_CSRF_SECRET=your-csrf-secret
SECURITY_RATE_LIMIT_WINDOW=900000
SECURITY_MAX_REQUESTS=1000
SECURITY_PASSWORD_MIN_LENGTH=8
SECURITY_FILE_MAX_SIZE=5242880
```

### Rate Limit Configuration
```typescript
const rateLimits = {
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 1000
  },
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5
  },
  search: {
    windowMs: 1 * 60 * 1000, // 1 minute
    maxRequests: 30
  }
}
```

## 📊 Security Metrics

### Key Performance Indicators
- **Failed Authentication Rate**: < 5%
- **Rate Limit Violations**: < 1%
- **Input Validation Failures**: < 2%
- **CSRF Token Mismatches**: < 0.1%

### Monitoring Dashboard
- Real-time security event monitoring
- Rate limit status tracking
- Failed authentication attempts
- Suspicious activity alerts

## 🔄 Security Updates

### Regular Security Tasks
1. **Daily**: Review security event logs
2. **Weekly**: Update rate limit configurations
3. **Monthly**: Rotate CSRF secrets
4. **Quarterly**: Security audit and penetration testing

### Security Patch Management
- Automated dependency updates
- Security vulnerability scanning
- Regular security assessments
- Incident response procedures

## 🚀 Best Practices

### Development
1. Always validate and sanitize user input
2. Use HTTPS for all communications
3. Implement proper error handling
4. Log security events
5. Regular security testing

### Deployment
1. Use secure headers
2. Enable CSP
3. Implement rate limiting
4. Monitor security metrics
5. Regular security updates

### Maintenance
1. Keep dependencies updated
2. Monitor security logs
3. Regular security audits
4. Incident response planning
5. Security training for team

## 📞 Security Contacts

### Incident Response
- **Email**: security@ebike-platform.com
- **Phone**: +31-20-123-4567
- **Emergency**: Available 24/7

### Security Team
- **Lead Security Engineer**: security-lead@ebike-platform.com
- **Security Analyst**: security-analyst@ebike-platform.com
- **DevOps Security**: devops-security@ebike-platform.com

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Vue.js Security Guide](https://vuejs.org/guide/best-practices/security.html)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Rate Limiting Best Practices](https://cloud.google.com/architecture/rate-limiting-strategies-techniques)
