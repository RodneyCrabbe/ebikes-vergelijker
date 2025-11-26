import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginData, RegisterData } from '../types/user'
import { WordPressService } from '../services/wordpress'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => user.value !== null)

  async function register(data: RegisterData) {
    loading.value = true
    error.value = null

    try {
      console.log('[Auth] Starting registration for:', data.email)
      await WordPressService.register(data)
      console.log('[Auth] Registration successful')
      
      // Auto login after registration if desired, or ask user to login
      // For now, we'll just log them in
      await login({ email: data.email, password: data.password })
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Registration failed'
      console.error('[Auth] Registration failed:', errorMessage)
      error.value = errorMessage
      throw e
    } finally {
      loading.value = false
    }
  }

  async function login(data: LoginData) {
    loading.value = true
    error.value = null

    try {
      console.log('[Auth] Starting login for:', data.email)
      
      const { user_id, user_email, user_display_name } = await WordPressService.login(data)

      // Construct a basic user object from login response
      // We might want to fetch full profile afterwards
      const loggedInUser: User = {
        id: String(user_id),
        email: user_email,
        name: user_display_name,
        newsletter_subscribed: false, // Default
        created_at: new Date().toISOString(),
      }

      user.value = loggedInUser
      console.log('[Auth] Login successful:', user_id)
      
      // Optionally fetch full user details if needed
      // await fetchUser() 
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Login failed'
      console.error('[Auth] Login failed:', errorMessage)
      error.value = errorMessage
      throw e
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    loading.value = true
    error.value = null

    try {
      console.log('[Auth] Logging out')
      WordPressService.logout()
      user.value = null
      console.log('[Auth] Logout successful')
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Logout failed'
      console.error('Logout error:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchUser() {
    loading.value = true
    try {
        const currentUser = await WordPressService.getCurrentUser()
        if (currentUser) {
            user.value = currentUser
        } else {
            user.value = null
        }
        return user.value
    } catch (e) {
        console.error('Error fetching user:', e)
        user.value = null
        return null
    } finally {
        loading.value = false
    }
  }

  async function initialize() {
    try {
      console.log('[Auth] Initializing authentication')
      await fetchUser()
    } catch (e) {
      console.error('Auth initialization error:', e)
      user.value = null
    }
  }

  async function updateProfile(updates: Partial<User>) {
      // TODO: Implement profile update via WP API if needed
      console.warn('Update profile not fully implemented for WP yet')
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    register,
    login,
    logout,
    fetchUser,
    updateProfile,
    initialize,
  }
})
