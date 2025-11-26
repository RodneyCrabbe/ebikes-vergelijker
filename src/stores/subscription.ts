import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'
import { useAuthStore } from './auth'
import type { SubscriptionPlan, UserSubscription, SUBSCRIPTION_PLANS } from '../types/subscription'

export const useSubscriptionStore = defineStore('subscription', () => {
  const authStore = useAuthStore()
  const currentSubscription = ref<UserSubscription | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Get current user's subscription
  async function fetchCurrentSubscription() {
    if (!authStore.user?.id) {
      currentSubscription.value = null
      return
    }

    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', authStore.user.id)
        .eq('status', 'active')
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means no rows found
        throw fetchError
      }

      currentSubscription.value = data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch subscription'
      console.error('Error fetching subscription:', err)
    } finally {
      loading.value = false
    }
  }

  // Create new subscription
  async function createSubscription(planId: string, paymentMethodId?: string) {
    if (!authStore.user?.id) {
      error.value = 'User not authenticated'
      return
    }

    loading.value = true
    error.value = null

    try {
      const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId)
      if (!plan) {
        throw new Error('Invalid subscription plan')
      }

      // Calculate subscription dates
      const now = new Date()
      const periodEnd = new Date(now)
      
      if (plan.interval === 'monthly') {
        periodEnd.setMonth(periodEnd.getMonth() + 1)
      } else {
        periodEnd.setFullYear(periodEnd.getFullYear() + 1)
      }

      const { data, error: insertError } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: authStore.user.id,
          plan_id: planId,
          status: 'active',
          current_period_start: now.toISOString(),
          current_period_end: periodEnd.toISOString(),
          cancel_at_period_end: false
        })
        .select()
        .single()

      if (insertError) throw insertError

      currentSubscription.value = data
      
      // Track subscription creation
      const { eventTrackingService } = await import('../services/eventTrackingService')
      eventTrackingService.trackConversion('subscription_created', plan.price, {
        plan_id: planId,
        plan_name: plan.name,
        interval: plan.interval
      })

    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create subscription'
      console.error('Error creating subscription:', err)
    } finally {
      loading.value = false
    }
  }

  // Cancel subscription
  async function cancelSubscription() {
    if (!currentSubscription.value) {
      error.value = 'No active subscription found'
      return
    }

    loading.value = true
    error.value = null

    try {
      const { error: updateError } = await supabase
        .from('user_subscriptions')
        .update({
          cancel_at_period_end: true,
          status: 'cancelled'
        })
        .eq('id', currentSubscription.value.id)

      if (updateError) throw updateError

      // Update local state
      currentSubscription.value.cancel_at_period_end = true
      currentSubscription.value.status = 'cancelled'

      // Track subscription cancellation
      const { eventTrackingService } = await import('../services/eventTrackingService')
      eventTrackingService.trackEvent('subscription_cancelled', {
        plan_id: currentSubscription.value.plan_id,
        subscription_id: currentSubscription.value.id
      })

    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to cancel subscription'
      console.error('Error cancelling subscription:', err)
    } finally {
      loading.value = false
    }
  }

  // Reactivate subscription
  async function reactivateSubscription() {
    if (!currentSubscription.value) {
      error.value = 'No subscription found'
      return
    }

    loading.value = true
    error.value = null

    try {
      const { error: updateError } = await supabase
        .from('user_subscriptions')
        .update({
          cancel_at_period_end: false,
          status: 'active'
        })
        .eq('id', currentSubscription.value.id)

      if (updateError) throw updateError

      // Update local state
      currentSubscription.value.cancel_at_period_end = false
      currentSubscription.value.status = 'active'

    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to reactivate subscription'
      console.error('Error reactivating subscription:', err)
    } finally {
      loading.value = false
    }
  }

  // Get current plan
  const currentPlan = computed(() => {
    if (!currentSubscription.value) {
      return SUBSCRIPTION_PLANS.find(p => p.id === 'free')
    }
    return SUBSCRIPTION_PLANS.find(p => p.id === currentSubscription.value.plan_id)
  })

  // Check if user has premium features
  const hasPremiumFeatures = computed(() => {
    return currentSubscription.value?.status === 'active' && 
           currentSubscription.value?.plan_id !== 'free'
  })

  // Check specific feature access
  const canAccessFeature = (featureId: string) => {
    if (!currentPlan.value) return false

    switch (featureId) {
      case 'unlimited_saved_bikes':
        return currentPlan.value.limits.saved_bikes === -1
      case 'unlimited_comparisons':
        return currentPlan.value.limits.comparisons === -1
      case 'price_alerts':
        return currentPlan.value.limits.price_alerts > 0
      case 'export_reports':
        return currentPlan.value.limits.export_reports
      case 'priority_support':
        return currentPlan.value.limits.priority_support
      case 'ad_free':
        return currentPlan.value.limits.ad_free
      case 'unlimited_ai_chat':
        return currentPlan.value.limits.ai_chat_messages === -1
      default:
        return false
    }
  }

  // Get usage statistics
  const getUsageStats = async () => {
    if (!authStore.user?.id) return null

    try {
      // Get saved bikes count
      const { count: savedBikesCount } = await supabase
        .from('favorites')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', authStore.user.id)

      // Get price alerts count
      const { count: priceAlertsCount } = await supabase
        .from('price_alerts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', authStore.user.id)

      return {
        saved_bikes: savedBikesCount || 0,
        price_alerts: priceAlertsCount || 0,
        comparisons: 0, // This would need to be tracked separately
        ai_chat_messages: 0 // This would need to be tracked separately
      }
    } catch (err) {
      console.error('Error fetching usage stats:', err)
      return null
    }
  }

  // Check if subscription is expiring soon (within 7 days)
  const isExpiringSoon = computed(() => {
    if (!currentSubscription.value) return false
    
    const endDate = new Date(currentSubscription.value.current_period_end)
    const now = new Date()
    const daysUntilExpiry = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0
  })

  // Get days until expiry
  const daysUntilExpiry = computed(() => {
    if (!currentSubscription.value) return null
    
    const endDate = new Date(currentSubscription.value.current_period_end)
    const now = new Date()
    const days = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    return days > 0 ? days : 0
  })

  // Initialize subscription data
  async function initialize() {
    if (authStore.isAuthenticated) {
      await fetchCurrentSubscription()
    }
  }

  return {
    currentSubscription,
    currentPlan,
    hasPremiumFeatures,
    loading,
    error,
    isExpiringSoon,
    daysUntilExpiry,
    fetchCurrentSubscription,
    createSubscription,
    cancelSubscription,
    reactivateSubscription,
    canAccessFeature,
    getUsageStats,
    initialize
  }
})
