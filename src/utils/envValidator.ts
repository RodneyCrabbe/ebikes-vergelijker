interface EnvironmentConfig {
  VITE_SUPABASE_URL: string
  VITE_SUPABASE_ANON_KEY: string
  NODE_ENV: string
  DEV: boolean
  PROD: boolean
}

interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  config: Partial<EnvironmentConfig>
}

class EnvironmentValidator {
  private requiredVars = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'] as const
  private fallbackConfig = {
    VITE_SUPABASE_URL: 'http://127.0.0.1:54321',
    VITE_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
  }

  validate(): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []
    const config: Partial<EnvironmentConfig> = {}

    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      errors.push('Environment validation can only run in browser context')
      return { isValid: false, errors, warnings, config }
    }

    // Validate required environment variables
    for (const varName of this.requiredVars) {
      const value = import.meta.env[varName]
      
      if (!value) {
        errors.push(`Missing required environment variable: ${varName}`)
        continue
      }

      // Validate Supabase URL format
      if (varName === 'VITE_SUPABASE_URL') {
        try {
          new URL(value)
          config[varName] = value
        } catch {
          errors.push(`Invalid VITE_SUPABASE_URL format: ${value}`)
        }
      } else {
        config[varName] = value
      }
    }

    // Check for development-specific warnings
    if (import.meta.env.DEV) {
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        warnings.push('Using fallback Supabase configuration for development')
        config.VITE_SUPABASE_URL = this.fallbackConfig.VITE_SUPABASE_URL
        config.VITE_SUPABASE_ANON_KEY = this.fallbackConfig.VITE_SUPABASE_ANON_KEY
      }
    }

    // Add other environment info
    config.NODE_ENV = import.meta.env.MODE
    config.DEV = import.meta.env.DEV
    config.PROD = import.meta.env.PROD

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      config: config as EnvironmentConfig
    }
  }

  getConfig(): EnvironmentConfig {
    const result = this.validate()
    
    if (!result.isValid && result.errors.length > 0) {
      console.error('❌ Environment validation failed:', result.errors)
      console.warn('⚠️ Using fallback configuration')
      return {
        ...this.fallbackConfig,
        NODE_ENV: import.meta.env.MODE,
        DEV: import.meta.env.DEV,
        PROD: import.meta.env.PROD
      } as EnvironmentConfig
    }

    if (result.warnings.length > 0) {
      console.warn('⚠️ Environment warnings:', result.warnings)
    }

    return result.config as EnvironmentConfig
  }

  logValidationResult(): void {
    const result = this.validate()
    
    console.group('🔧 Environment Validation')
    console.log('Status:', result.isValid ? '✅ Valid' : '❌ Invalid')
    
    if (result.errors.length > 0) {
      console.error('Errors:', result.errors)
    }
    
    if (result.warnings.length > 0) {
      console.warn('Warnings:', result.warnings)
    }
    
    console.log('Configuration:', result.config)
    console.groupEnd()
  }

  // Legacy functions for backward compatibility
  validateEnvironment() {
    const result = this.validate()
    return {
      isValid: result.isValid,
      missing: result.errors.filter(e => e.includes('Missing required'))
    }
  }

  getEnvironmentInfo() {
    const config = this.getConfig()
    return {
      mode: config.NODE_ENV,
      dev: config.DEV,
      prod: config.PROD,
      supabaseUrl: config.VITE_SUPABASE_URL,
      hasSupabaseKey: !!config.VITE_SUPABASE_ANON_KEY
    }
  }
}

export const envValidator = new EnvironmentValidator()
export type { EnvironmentConfig, ValidationResult }

// Legacy exports for backward compatibility
export const validateEnvironment = () => envValidator.validateEnvironment()
export const getEnvironmentInfo = () => envValidator.getEnvironmentInfo()