import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../../stores/auth'

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('should initialize with unauthenticated state', () => {
    const store = useAuthStore()
    
    expect(store.user).toBe(null)
    expect(store.isAuthenticated).toBe(false)
    expect(store.loading).toBe(false)
  })

  it('should sign in successfully', async () => {
    const mockUser = {
      id: 'test-user-id',
      email: 'test@example.com',
      user_metadata: { full_name: 'Test User' }
    }

    const mockSupabase = {
      auth: {
        signInWithPassword: vi.fn().mockResolvedValue({
          data: { user: mockUser },
          error: null
        })
      }
    }

    vi.doMock('../../lib/supabase', () => ({
      supabase: mockSupabase
    }))

    const store = useAuthStore()
    const result = await store.signIn('test@example.com', 'password123')

    expect(result.success).toBe(true)
    expect(store.user).toEqual(mockUser)
    expect(store.isAuthenticated).toBe(true)
  })

  it('should handle sign in error', async () => {
    const mockError = new Error('Invalid credentials')
    
    const mockSupabase = {
      auth: {
        signInWithPassword: vi.fn().mockResolvedValue({
          data: { user: null },
          error: mockError
        })
      }
    }

    vi.doMock('../../lib/supabase', () => ({
      supabase: mockSupabase
    }))

    const store = useAuthStore()
    const result = await store.signIn('test@example.com', 'wrongpassword')

    expect(result.success).toBe(false)
    expect(result.error).toBe('Invalid credentials')
    expect(store.user).toBe(null)
    expect(store.isAuthenticated).toBe(false)
  })

  it('should sign up successfully', async () => {
    const mockUser = {
      id: 'test-user-id',
      email: 'test@example.com',
      user_metadata: { full_name: 'Test User' }
    }

    const mockSupabase = {
      auth: {
        signUp: vi.fn().mockResolvedValue({
          data: { user: mockUser },
          error: null
        })
      }
    }

    vi.doMock('../../lib/supabase', () => ({
      supabase: mockSupabase
    }))

    const store = useAuthStore()
    const result = await store.signUp('test@example.com', 'password123', 'Test User')

    expect(result.success).toBe(true)
    expect(store.user).toEqual(mockUser)
    expect(store.isAuthenticated).toBe(true)
  })

  it('should handle sign up error', async () => {
    const mockError = new Error('Email already registered')
    
    const mockSupabase = {
      auth: {
        signUp: vi.fn().mockResolvedValue({
          data: { user: null },
          error: mockError
        })
      }
    }

    vi.doMock('../../lib/supabase', () => ({
      supabase: mockSupabase
    }))

    const store = useAuthStore()
    const result = await store.signUp('test@example.com', 'password123', 'Test User')

    expect(result.success).toBe(false)
    expect(result.error).toBe('Email already registered')
    expect(store.user).toBe(null)
    expect(store.isAuthenticated).toBe(false)
  })

  it('should sign out successfully', async () => {
    const mockSupabase = {
      auth: {
        signOut: vi.fn().mockResolvedValue({ error: null })
      }
    }

    vi.doMock('../../lib/supabase', () => ({
      supabase: mockSupabase
    }))

    const store = useAuthStore()
    store.user = { id: 'test-user-id', email: 'test@example.com' }
    store.isAuthenticated = true

    await store.signOut()

    expect(store.user).toBe(null)
    expect(store.isAuthenticated).toBe(false)
  })

  it('should initialize auth state', async () => {
    const mockUser = {
      id: 'test-user-id',
      email: 'test@example.com',
      user_metadata: { full_name: 'Test User' }
    }

    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: mockUser },
          error: null
        }),
        onAuthStateChange: vi.fn(() => ({
          data: { subscription: { unsubscribe: vi.fn() } }
        }))
      }
    }

    vi.doMock('../../lib/supabase', () => ({
      supabase: mockSupabase
    }))

    const store = useAuthStore()
    await store.initialize()

    expect(store.user).toEqual(mockUser)
    expect(store.isAuthenticated).toBe(true)
  })

  it('should validate email format', () => {
    const store = useAuthStore()
    
    expect(store.isValidEmail('test@example.com')).toBe(true)
    expect(store.isValidEmail('invalid-email')).toBe(false)
    expect(store.isValidEmail('')).toBe(false)
  })

  it('should validate password strength', () => {
    const store = useAuthStore()
    
    expect(store.isValidPassword('password123')).toBe(true)
    expect(store.isValidPassword('12345678')).toBe(true)
    expect(store.isValidPassword('123')).toBe(false)
    expect(store.isValidPassword('')).toBe(false)
  })
})
