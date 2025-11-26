import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'
import { useAuthStore } from './auth'

export interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  message: string
  link?: string
  read: boolean
  data?: Record<string, any>
  priority: 'low' | 'normal' | 'high' | 'urgent'
  expires_at?: string
  created_at: string
}

export interface PriceAlert {
  id: string
  user_id: string
  ebike_id: string
  target_price: number
  current_price: number
  is_active: boolean
  last_checked: string
  created_at: string
  ebike: {
    id: string
    brand: string
    model_name: string
    image_url?: string
  }
}

export interface EmailDigestPreferences {
  id: string
  user_id: string
  frequency: 'daily' | 'weekly' | 'monthly' | 'never'
  include_price_alerts: boolean
  include_new_reviews: boolean
  include_community_activity: boolean
  include_recommendations: boolean
  last_sent?: string
  created_at: string
  updated_at: string
}

export const useNotificationStore = defineStore('notifications', () => {
  const authStore = useAuthStore()
  
  // State
  const notifications = ref<Notification[]>([])
  const priceAlerts = ref<PriceAlert[]>([])
  const emailDigestPreferences = ref<EmailDigestPreferences | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const user = computed(() => authStore.user)
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)
  const recentNotifications = computed(() => 
    notifications.value.slice(0, 10).sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  )
  const activePriceAlerts = computed(() => 
    priceAlerts.value.filter(alert => alert.is_active)
  )

  // Notifications
  async function fetchNotifications(limit = 50) {
    if (!isAuthenticated.value) return

    try {
      const { data, error: fetchError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.value!.id)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (fetchError) throw fetchError

      notifications.value = data || []
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch notifications'
    }
  }

  async function markAsRead(notificationIds: string[]) {
    if (!isAuthenticated.value) return

    try {
      const { error: updateError } = await supabase
        .from('notifications')
        .update({ read: true })
        .in('id', notificationIds)

      if (updateError) throw updateError

      // Update local state
      notifications.value.forEach(notification => {
        if (notificationIds.includes(notification.id)) {
          notification.read = true
        }
      })
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to mark notifications as read'
    }
  }

  async function markAllAsRead() {
    if (!isAuthenticated.value) return

    try {
      const { error: updateError } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.value!.id)
        .eq('read', false)

      if (updateError) throw updateError

      // Update local state
      notifications.value.forEach(notification => {
        notification.read = true
      })
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to mark all notifications as read'
    }
  }

  async function deleteNotification(notificationId: string) {
    try {
      const { error: deleteError } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)

      if (deleteError) throw deleteError

      // Update local state
      notifications.value = notifications.value.filter(n => n.id !== notificationId)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to delete notification'
    }
  }

  // Price Alerts
  async function fetchPriceAlerts() {
    if (!isAuthenticated.value) return

    try {
      const { data, error: fetchError } = await supabase
        .from('price_alerts')
        .select(`
          *,
          ebike:ebikes(id, brand, model_name, image_url)
        `)
        .eq('user_id', user.value!.id)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      priceAlerts.value = data || []
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch price alerts'
    }
  }

  async function createPriceAlert(ebikeId: string, targetPrice: number) {
    if (!isAuthenticated.value) throw new Error('Must be authenticated')

    try {
      // Get current price
      const { data: ebike, error: ebikeError } = await supabase
        .from('ebikes')
        .select('price')
        .eq('id', ebikeId)
        .single()

      if (ebikeError) throw ebikeError

      const { data, error: insertError } = await supabase
        .from('price_alerts')
        .upsert({
          user_id: user.value!.id,
          ebike_id: ebikeId,
          target_price: targetPrice,
          current_price: ebike.price || 0,
          is_active: true
        })
        .select(`
          *,
          ebike:ebikes(id, brand, model_name, image_url)
        `)
        .single()

      if (insertError) throw insertError

      // Update local state
      const existingIndex = priceAlerts.value.findIndex(alert => alert.ebike_id === ebikeId)
      if (existingIndex >= 0) {
        priceAlerts.value[existingIndex] = data
      } else {
        priceAlerts.value.unshift(data)
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to create price alert'
      throw e
    }
  }

  async function updatePriceAlert(alertId: string, updates: Partial<PriceAlert>) {
    try {
      const { data, error: updateError } = await supabase
        .from('price_alerts')
        .update(updates)
        .eq('id', alertId)
        .select(`
          *,
          ebike:ebikes(id, brand, model_name, image_url)
        `)
        .single()

      if (updateError) throw updateError

      // Update local state
      const index = priceAlerts.value.findIndex(alert => alert.id === alertId)
      if (index >= 0) {
        priceAlerts.value[index] = data
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to update price alert'
      throw e
    }
  }

  async function deletePriceAlert(alertId: string) {
    try {
      const { error: deleteError } = await supabase
        .from('price_alerts')
        .delete()
        .eq('id', alertId)

      if (deleteError) throw deleteError

      // Update local state
      priceAlerts.value = priceAlerts.value.filter(alert => alert.id !== alertId)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to delete price alert'
    }
  }

  // Email Digest Preferences
  async function fetchEmailDigestPreferences() {
    if (!isAuthenticated.value) return

    try {
      const { data, error: fetchError } = await supabase
        .from('email_digest_preferences')
        .select('*')
        .eq('user_id', user.value!.id)
        .maybeSingle()

      if (fetchError) throw fetchError

      emailDigestPreferences.value = data
    } catch (e) {
      console.warn('[Notifications] Failed to fetch email digest preferences:', e)
      error.value = null // Don't set error for missing preferences
    }
  }

  async function updateEmailDigestPreferences(updates: Partial<EmailDigestPreferences>) {
    if (!isAuthenticated.value) throw new Error('Must be authenticated')

    try {
      const { data, error: updateError } = await supabase
        .from('email_digest_preferences')
        .upsert({
          user_id: user.value!.id,
          ...updates,
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (updateError) throw updateError

      emailDigestPreferences.value = data
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to update email digest preferences'
      throw e
    }
  }

  // Notification creation helpers
  async function createNotification(
    type: string,
    title: string,
    message: string,
    link?: string,
    data?: Record<string, any>,
    priority: 'low' | 'normal' | 'high' | 'urgent' = 'normal'
  ) {
    if (!isAuthenticated.value) return

    try {
      const { data: notification, error: insertError } = await supabase
        .from('notifications')
        .insert({
          user_id: user.value!.id,
          type,
          title,
          message,
          link,
          data,
          priority
        })
        .select()
        .single()

      if (insertError) throw insertError

      // Add to local state
      notifications.value.unshift(notification)
    } catch (e) {
      console.error('Error creating notification:', e)
    }
  }

  // Initialize notification system
  async function initialize() {
    if (!isAuthenticated.value) return

    loading.value = true
    error.value = null

    try {
      // Initialize each function separately to prevent one failure from breaking others
      try {
        await fetchNotifications()
      } catch (e) {
        console.warn('Failed to fetch notifications:', e)
      }

      try {
        await fetchPriceAlerts()
      } catch (e) {
        console.warn('Failed to fetch price alerts:', e)
      }

      try {
        await fetchEmailDigestPreferences()
      } catch (e) {
        console.warn('Failed to fetch email digest preferences:', e)
      }
    } catch (e) {
      console.error('Error initializing notifications:', e)
    } finally {
      loading.value = false
    }
  }

  // Real-time subscription for new notifications
  function subscribeToNotifications() {
    if (!isAuthenticated.value) return

    return supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.value!.id}`
        },
        (payload) => {
          const newNotification = payload.new as Notification
          notifications.value.unshift(newNotification)
          
          // Show browser notification if permission granted
          if (Notification.permission === 'granted') {
            new Notification(newNotification.title, {
              body: newNotification.message,
              icon: '/favicon.ico'
            })
          }
        }
      )
      .subscribe()
  }

  // Request notification permission
  async function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }
    return Notification.permission === 'granted'
  }

  return {
    // State
    notifications,
    priceAlerts,
    emailDigestPreferences,
    loading,
    error,
    
    // Computed
    user,
    isAuthenticated,
    unreadCount,
    recentNotifications,
    activePriceAlerts,
    
    // Notification Actions
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification,
    
    // Price Alert Actions
    fetchPriceAlerts,
    createPriceAlert,
    updatePriceAlert,
    deletePriceAlert,
    
    // Email Digest Actions
    fetchEmailDigestPreferences,
    updateEmailDigestPreferences,
    
    // Initialize & Subscribe
    initialize,
    subscribeToNotifications,
    requestNotificationPermission
  }
})
