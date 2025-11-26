import { createClient } from '@supabase/supabase-js'
import { logger } from '../utils/logger'

// Using localStorage mode - Supabase is only initialized as fallback
// All data operations should use localStorage through stores
let supabaseClient: any = null

try {
  // Only create client if explicitly needed (for legacy code compatibility)
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321'
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'dummy-key'

  supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
      storage: window.localStorage,
      storageKey: 'eb-auth'
    }
  })

  logger.log('⚠️ Supabase client created for compatibility - using localStorage mode')
} catch (error) {
  logger.warn('Supabase initialization skipped - using localStorage mode')
}

// Export a dummy supabase client that won't throw errors
export const supabase = supabaseClient || {
  auth: {
    signUp: async () => ({ data: null, error: new Error('Using localStorage mode') }),
    signInWithPassword: async () => ({ data: null, error: new Error('Using localStorage mode') }),
    signOut: async () => ({ error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: null, error: new Error('Using localStorage mode') }),
        order: () => ({ data: [], error: null })
      }),
      order: () => ({ data: [], error: null }),
      limit: async () => ({ data: [], error: null })
    }),
    insert: () => ({
      select: () => ({
        single: async () => ({ data: null, error: new Error('Using localStorage mode') })
      })
    }),
    update: () => ({
      eq: () => ({
        select: () => ({
          single: async () => ({ data: null, error: new Error('Using localStorage mode') })
        })
      })
    }),
    delete: () => ({
      eq: async () => ({ error: null })
    })
  })
}
