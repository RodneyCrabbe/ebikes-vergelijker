import { envValidator } from './envValidator'
import { logger } from './logger'

interface HealthCheckResult {
  isHealthy: boolean
  checks: {
    environment: boolean
    supabase: boolean
    browser: boolean
  }
  errors: string[]
  warnings: string[]
}

class StartupHealthCheck {
  private async checkSupabaseConnection(): Promise<boolean> {
    try {
      // Using local storage instead of Supabase
      logger.log('✅ Local storage mode - skipping Supabase check')
      return true
    } catch (error) {
      logger.error('❌ Storage check error:', error)
      return false
    }
  }

  private checkBrowserEnvironment(): boolean {
    const required = [
      'localStorage',
      'sessionStorage',
      'fetch',
      'Promise'
    ]
    
    const missing = required.filter(feature => 
      typeof (window as any)[feature] === 'undefined'
    )
    
    if (missing.length > 0) {
      logger.error('❌ Missing browser features:', missing)
      return false
    }
    
    logger.log('✅ Browser environment healthy')
    return true
  }

  private checkEnvironment(): boolean {
    const result = envValidator.validate()
    
    if (!result.isValid) {
      logger.error('❌ Environment validation failed:', result.errors)
      return false
    }
    
    if (result.warnings.length > 0) {
      logger.warn('⚠️ Environment warnings:', result.warnings)
    }
    
    logger.log('✅ Environment validation healthy')
    return true
  }

  async runHealthCheck(): Promise<HealthCheckResult> {
    logger.log('🔍 Running startup health check...')
    
    const errors: string[] = []
    const warnings: string[] = []
    
    // Check environment
    const envHealthy = this.checkEnvironment()
    if (!envHealthy) {
      errors.push('Environment validation failed')
    }
    
    // Check browser environment
    const browserHealthy = this.checkBrowserEnvironment()
    if (!browserHealthy) {
      errors.push('Browser environment check failed')
    }
    
    // Check Supabase connection
    const supabaseHealthy = await this.checkSupabaseConnection()
    if (!supabaseHealthy) {
      errors.push('Supabase connection failed')
    }
    
    const isHealthy = envHealthy && browserHealthy && supabaseHealthy
    
    const result: HealthCheckResult = {
      isHealthy,
      checks: {
        environment: envHealthy,
        supabase: supabaseHealthy,
        browser: browserHealthy
      },
      errors,
      warnings
    }
    
    if (isHealthy) {
      logger.log('✅ All health checks passed - Application ready!')
    } else {
      logger.error('❌ Health check failed:', result)
    }
    
    return result
  }

  // Show user-friendly error message if health check fails
  showHealthCheckError(result: HealthCheckResult): void {
    if (result.isHealthy) return
    
    const errorMessage = `
🚨 Application Health Check Failed

The application encountered issues during startup:

${result.errors.map(error => `❌ ${error}`).join('\n')}

${result.warnings.length > 0 ? `
Warnings:
${result.warnings.map(warning => `⚠️ ${warning}`).join('\n')}
` : ''}

Please check:
1. Ensure Supabase is running (npm run supabase:start)
2. Verify .env file exists and has correct values
3. Restart the development server if you recently modified .env
4. Check browser console for more details

If the problem persists, please contact support.
    `.trim()
    
    // Show error in console
    console.error(errorMessage)
    
    // Show error in UI if possible
    if (typeof document !== 'undefined') {
      const errorDiv = document.createElement('div')
      errorDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: #dc2626;
        color: white;
        padding: 1rem;
        z-index: 9999;
        font-family: monospace;
        white-space: pre-line;
        max-height: 50vh;
        overflow-y: auto;
      `
      errorDiv.textContent = errorMessage
      document.body.appendChild(errorDiv)
      
      // Auto-remove after 10 seconds
      setTimeout(() => {
        if (errorDiv.parentNode) {
          errorDiv.parentNode.removeChild(errorDiv)
        }
      }, 10000)
    }
  }
}

export const startupHealthCheck = new StartupHealthCheck()
export type { HealthCheckResult }
