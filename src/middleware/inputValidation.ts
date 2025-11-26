import { securityManager } from '../utils/security'

export interface ValidationRule {
  required?: boolean
  type?: 'string' | 'number' | 'boolean' | 'email' | 'phone' | 'url' | 'date'
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: RegExp
  custom?: (value: any) => { isValid: boolean; error?: string }
  sanitize?: boolean
}

export interface ValidationSchema {
  [key: string]: ValidationRule
}

export class InputValidator {
  private static instance: InputValidator
  private schemas = new Map<string, ValidationSchema>()

  static getInstance(): InputValidator {
    if (!InputValidator.instance) {
      InputValidator.instance = new InputValidator()
    }
    return InputValidator.instance
  }

  // Register validation schema
  registerSchema(name: string, schema: ValidationSchema): void {
    this.schemas.set(name, schema)
  }

  // Validate data against schema
  validate(data: any, schemaName: string): { isValid: boolean; errors: Record<string, string[]>; sanitizedData: any } {
    const schema = this.schemas.get(schemaName)
    if (!schema) {
      return {
        isValid: false,
        errors: { general: ['Validation schema not found'] },
        sanitizedData: {}
      }
    }

    const errors: Record<string, string[]> = {}
    const sanitizedData: any = {}

    for (const [field, rules] of Object.entries(schema)) {
      const value = data[field]
      const fieldErrors: string[] = []

      // Check if required field is present
      if (rules.required && (value === undefined || value === null || value === '')) {
        fieldErrors.push(`${field} is required`)
        continue
      }

      // Skip validation if field is not required and empty
      if (!rules.required && (value === undefined || value === null || value === '')) {
        sanitizedData[field] = value
        continue
      }

      // Type validation
      if (rules.type) {
        const typeError = this.validateType(value, rules.type, field)
        if (typeError) {
          fieldErrors.push(typeError)
          continue
        }
      }

      // String validations
      if (typeof value === 'string') {
        // Length validations
        if (rules.minLength && value.length < rules.minLength) {
          fieldErrors.push(`${field} must be at least ${rules.minLength} characters long`)
        }
        if (rules.maxLength && value.length > rules.maxLength) {
          fieldErrors.push(`${field} must be no more than ${rules.maxLength} characters long`)
        }

        // Pattern validation
        if (rules.pattern && !rules.pattern.test(value)) {
          fieldErrors.push(`${field} format is invalid`)
        }

        // Sanitize if required
        if (rules.sanitize) {
          sanitizedData[field] = securityManager.sanitizeInput(value)
        } else {
          sanitizedData[field] = value
        }
      }

      // Number validations
      if (typeof value === 'number') {
        if (rules.min !== undefined && value < rules.min) {
          fieldErrors.push(`${field} must be at least ${rules.min}`)
        }
        if (rules.max !== undefined && value > rules.max) {
          fieldErrors.push(`${field} must be no more than ${rules.max}`)
        }
        sanitizedData[field] = value
      }

      // Custom validation
      if (rules.custom) {
        const customResult = rules.custom(value)
        if (!customResult.isValid) {
          fieldErrors.push(customResult.error || `${field} is invalid`)
        }
      }

      // If no sanitization was applied, use original value
      if (!rules.sanitize && sanitizedData[field] === undefined) {
        sanitizedData[field] = value
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      sanitizedData
    }
  }

  // Validate specific field
  validateField(value: any, rules: ValidationRule, fieldName: string): { isValid: boolean; error?: string; sanitizedValue?: any } {
    // Required check
    if (rules.required && (value === undefined || value === null || value === '')) {
      return { isValid: false, error: `${fieldName} is required` }
    }

    // Skip if not required and empty
    if (!rules.required && (value === undefined || value === null || value === '')) {
      return { isValid: true, sanitizedValue: value }
    }

    // Type validation
    if (rules.type) {
      const typeError = this.validateType(value, rules.type, fieldName)
      if (typeError) {
        return { isValid: false, error: typeError }
      }
    }

    // String validations
    if (typeof value === 'string') {
      if (rules.minLength && value.length < rules.minLength) {
        return { isValid: false, error: `${fieldName} must be at least ${rules.minLength} characters long` }
      }
      if (rules.maxLength && value.length > rules.maxLength) {
        return { isValid: false, error: `${fieldName} must be no more than ${rules.maxLength} characters long` }
      }
      if (rules.pattern && !rules.pattern.test(value)) {
        return { isValid: false, error: `${fieldName} format is invalid` }
      }

      const sanitizedValue = rules.sanitize ? securityManager.sanitizeInput(value) : value
      return { isValid: true, sanitizedValue }
    }

    // Number validations
    if (typeof value === 'number') {
      if (rules.min !== undefined && value < rules.min) {
        return { isValid: false, error: `${fieldName} must be at least ${rules.min}` }
      }
      if (rules.max !== undefined && value > rules.max) {
        return { isValid: false, error: `${fieldName} must be no more than ${rules.max}` }
      }
      return { isValid: true, sanitizedValue: value }
    }

    // Custom validation
    if (rules.custom) {
      const customResult = rules.custom(value)
      if (!customResult.isValid) {
        return { isValid: false, error: customResult.error || `${fieldName} is invalid` }
      }
    }

    return { isValid: true, sanitizedValue: value }
  }

  // Validate type
  private validateType(value: any, type: string, fieldName: string): string | null {
    switch (type) {
      case 'string':
        if (typeof value !== 'string') {
          return `${fieldName} must be a string`
        }
        break
      case 'number':
        if (typeof value !== 'number' && !Number.isFinite(Number(value))) {
          return `${fieldName} must be a number`
        }
        break
      case 'boolean':
        if (typeof value !== 'boolean') {
          return `${fieldName} must be a boolean`
        }
        break
      case 'email':
        if (!securityManager.validateEmail(value)) {
          return `${fieldName} must be a valid email address`
        }
        break
      case 'phone':
        if (!securityManager.validatePhoneNumber(value)) {
          return `${fieldName} must be a valid phone number`
        }
        break
      case 'url':
        try {
          new URL(value)
        } catch {
          return `${fieldName} must be a valid URL`
        }
        break
      case 'date':
        if (!(value instanceof Date) && isNaN(Date.parse(value))) {
          return `${fieldName} must be a valid date`
        }
        break
    }
    return null
  }

  // Middleware function
  createMiddleware(schemaName: string) {
    return (req: any, res: any, next: any) => {
      const validation = this.validate(req.body, schemaName)
      
      if (!validation.isValid) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Invalid input data',
          details: validation.errors
        })
      }

      // Replace request body with sanitized data
      req.body = validation.sanitizedData
      next()
    }
  }
}

export const inputValidator = InputValidator.getInstance()

// Predefined validation schemas
export const validationSchemas = {
  // User registration
  userRegistration: {
    email: {
      required: true,
      type: 'email' as const,
      maxLength: 254,
      sanitize: true
    },
    password: {
      required: true,
      type: 'string' as const,
      minLength: 8,
      maxLength: 128,
      custom: (value: string) => securityManager.validatePassword(value)
    },
    fullName: {
      required: true,
      type: 'string' as const,
      minLength: 2,
      maxLength: 100,
      sanitize: true
    },
    phone: {
      required: false,
      type: 'phone' as const,
      sanitize: true
    }
  },

  // User login
  userLogin: {
    email: {
      required: true,
      type: 'email' as const,
      maxLength: 254,
      sanitize: true
    },
    password: {
      required: true,
      type: 'string' as const,
      minLength: 1,
      maxLength: 128
    }
  },

  // E-bike review
  ebikeReview: {
    ebikeId: {
      required: true,
      type: 'string' as const,
      pattern: /^[a-zA-Z0-9-_]+$/,
      sanitize: true
    },
    rating: {
      required: true,
      type: 'number' as const,
      min: 1,
      max: 5
    },
    comment: {
      required: true,
      type: 'string' as const,
      minLength: 10,
      maxLength: 1000,
      sanitize: true
    },
    pros: {
      required: false,
      type: 'string' as const,
      maxLength: 500,
      sanitize: true
    },
    cons: {
      required: false,
      type: 'string' as const,
      maxLength: 500,
      sanitize: true
    }
  },

  // Contact form
  contactForm: {
    name: {
      required: true,
      type: 'string' as const,
      minLength: 2,
      maxLength: 100,
      sanitize: true
    },
    email: {
      required: true,
      type: 'email' as const,
      maxLength: 254,
      sanitize: true
    },
    subject: {
      required: true,
      type: 'string' as const,
      minLength: 5,
      maxLength: 200,
      sanitize: true
    },
    message: {
      required: true,
      type: 'string' as const,
      minLength: 20,
      maxLength: 2000,
      sanitize: true
    }
  },

  // Search query
  searchQuery: {
    query: {
      required: true,
      type: 'string' as const,
      minLength: 1,
      maxLength: 100,
      sanitize: true
    },
    category: {
      required: false,
      type: 'string' as const,
      pattern: /^(city|mountain|commute|touring|cargo|folding|fat_bike|road|hybrid)$/,
      sanitize: true
    },
    minPrice: {
      required: false,
      type: 'number' as const,
      min: 0,
      max: 100000
    },
    maxPrice: {
      required: false,
      type: 'number' as const,
      min: 0,
      max: 100000
    }
  },

  // File upload
  fileUpload: {
    file: {
      required: true,
      type: 'string' as const,
      custom: (value: any) => {
        if (!value || typeof value !== 'object') {
          return { isValid: false, error: 'File is required' }
        }
        return { isValid: true }
      }
    }
  }
}

// Register all schemas
Object.entries(validationSchemas).forEach(([name, schema]) => {
  inputValidator.registerSchema(name, schema)
})
