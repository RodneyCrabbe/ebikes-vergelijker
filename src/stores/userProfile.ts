import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { 
  User, 
  UserActivity, 
  UserPreferences, 
  UserBikeHistory, 
  MaintenanceReminder,
  UserBadge,
  ActivityType,
  RidingStyle,
  ExperienceLevel,
  NotificationPreferences
} from '../types/user'
import { supabase } from '../lib/supabase'
import { useAuthStore } from './auth'

export const useUserProfileStore = defineStore('userProfile', () => {
  const authStore = useAuthStore()
  
  // State
  const activities = ref<UserActivity[]>([])
  const preferences = ref<UserPreferences | null>(null)
  const bikeHistory = ref<UserBikeHistory[]>([])
  const maintenanceReminders = ref<MaintenanceReminder[]>([])
  const achievements = ref<UserBadge[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const user = computed(() => authStore.user)
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const totalPoints = computed(() => user.value?.activity_points || 0)
  const recentActivities = computed(() => 
    activities.value.slice(0, 10).sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  )
  const upcomingMaintenance = computed(() => 
    maintenanceReminders.value
      .filter(reminder => !reminder.completed)
      .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
  )

  // Activity tracking
  async function trackActivity(
    activityType: ActivityType, 
    data?: Record<string, any>
  ) {
    if (!isAuthenticated.value) return

    try {
      const pointsEarned = getActivityPoints(activityType)
      
      const { data: activity, error: insertError } = await supabase
        .from('user_activities')
        .insert({
          user_id: user.value!.id,
          activity_type: activityType,
          activity_data: data,
          points_earned: pointsEarned
        })
        .select()
        .single()

      if (insertError) throw insertError

      activities.value.unshift(activity)
      
      // Update user points in auth store
      if (authStore.user) {
        authStore.user.activity_points = (authStore.user.activity_points || 0) + pointsEarned
      }
    } catch (e) {
      console.error('Error tracking activity:', e)
    }
  }

  function getActivityPoints(activityType: ActivityType): number {
    const pointsMap: Record<ActivityType, number> = {
      bike_view: 1,
      bike_compare: 5,
      review_posted: 10,
      favorite_added: 2,
      appointment_booked: 15,
      profile_updated: 3,
      search_performed: 1,
      achievement_unlocked: 25
    }
    return pointsMap[activityType] || 0
  }

  // User preferences
  async function fetchPreferences() {
    if (!isAuthenticated.value) return

    try {
      const { data, error: fetchError } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.value!.id)
        .maybeSingle()

      if (fetchError) throw fetchError

      preferences.value = data
    } catch (e) {
      console.warn('[UserProfile] Failed to fetch preferences:', e)
      error.value = null // Don't set error for missing preferences
    }
  }

  async function updatePreferences(updates: Partial<UserPreferences>) {
    if (!isAuthenticated.value) return

    try {
      const { data, error: updateError } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.value!.id,
          ...updates,
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (updateError) throw updateError

      preferences.value = data
      await trackActivity('profile_updated', { section: 'preferences' })
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to update preferences'
      throw e
    }
  }

  // Profile updates
  async function updateProfile(updates: Partial<User>) {
    if (!isAuthenticated.value) return

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.value!.id)

      if (updateError) throw updateError

      // Update local user state
      if (authStore.user) {
        authStore.user = { ...authStore.user, ...updates }
      }
      
      await trackActivity('profile_updated', { section: 'profile' })
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to update profile'
      throw e
    }
  }

  // Bike history
  async function fetchBikeHistory() {
    if (!isAuthenticated.value) return

    try {
      const { data, error: fetchError } = await supabase
        .from('user_bike_history')
        .select(`
          *,
          ebikes (
            id,
            brand,
            model_name,
            image_url
          )
        `)
        .eq('user_id', user.value!.id)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      bikeHistory.value = data || []
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch bike history'
    }
  }

  async function addBikeToHistory(bikeData: Omit<UserBikeHistory, 'id' | 'user_id' | 'created_at'>) {
    if (!isAuthenticated.value) return

    try {
      const { data, error: insertError } = await supabase
        .from('user_bike_history')
        .insert({
          user_id: user.value!.id,
          ...bikeData
        })
        .select()
        .single()

      if (insertError) throw insertError

      bikeHistory.value.unshift(data)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to add bike to history'
      throw e
    }
  }

  // Maintenance reminders
  async function fetchMaintenanceReminders() {
    if (!isAuthenticated.value) return

    try {
      const { data, error: fetchError } = await supabase
        .from('maintenance_reminders')
        .select(`
          *,
          user_bike_history (
            ebikes (
              brand,
              model_name
            )
          )
        `)
        .eq('user_id', user.value!.id)
        .order('due_date', { ascending: true })

      if (fetchError) throw fetchError

      maintenanceReminders.value = data || []
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch maintenance reminders'
    }
  }

  async function createMaintenanceReminder(reminderData: Omit<MaintenanceReminder, 'id' | 'user_id' | 'created_at'>) {
    if (!isAuthenticated.value) return

    try {
      const { data, error: insertError } = await supabase
        .from('maintenance_reminders')
        .insert({
          user_id: user.value!.id,
          ...reminderData
        })
        .select()
        .single()

      if (insertError) throw insertError

      maintenanceReminders.value.push(data)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to create maintenance reminder'
      throw e
    }
  }

  async function markMaintenanceComplete(reminderId: string) {
    try {
      const { error: updateError } = await supabase
        .from('maintenance_reminders')
        .update({ completed: true })
        .eq('id', reminderId)

      if (updateError) throw updateError

      const reminder = maintenanceReminders.value.find(r => r.id === reminderId)
      if (reminder) {
        reminder.completed = true
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to mark maintenance complete'
      throw e
    }
  }

  // Achievements
  async function fetchAchievements() {
    if (!isAuthenticated.value) return

    try {
      const { data, error: fetchError } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.value!.id)
        .order('unlocked_at', { ascending: false })

      if (fetchError) throw fetchError

      achievements.value = data?.map(achievement => ({
        id: achievement.id,
        type: achievement.achievement_type,
        title: achievement.achievement_data.title,
        description: achievement.achievement_data.description,
        icon: achievement.achievement_data.icon,
        unlocked_at: achievement.unlocked_at
      })) || []
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch achievements'
    }
  }

  // Activities
  async function fetchActivities(limit = 50) {
    if (!isAuthenticated.value) return

    try {
      const { data, error: fetchError } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', user.value!.id)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (fetchError) throw fetchError

      activities.value = data || []
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch activities'
    }
  }

  // Initialize user profile data
  async function initialize() {
    if (!isAuthenticated.value) return

    loading.value = true
    error.value = null

    try {
      // Initialize each function separately to prevent one failure from breaking others
      try {
        await fetchPreferences()
      } catch (e) {
        console.warn('Failed to fetch preferences:', e)
      }

      try {
        await fetchBikeHistory()
      } catch (e) {
        console.warn('Failed to fetch bike history:', e)
      }

      try {
        await fetchMaintenanceReminders()
      } catch (e) {
        console.warn('Failed to fetch maintenance reminders:', e)
      }

      try {
        await fetchAchievements()
      } catch (e) {
        console.warn('Failed to fetch achievements:', e)
      }

      try {
        await fetchActivities()
      } catch (e) {
        console.warn('Failed to fetch activities:', e)
      }
    } catch (e) {
      console.error('Error initializing user profile:', e)
    } finally {
      loading.value = false
    }
  }

  // Riding style quiz
  async function completeRidingStyleQuiz(answers: {
    primaryUse: string
    terrain: string
    distance: string
    budget: string
    experience: string
  }) {
    const ridingStyle = determineRidingStyle(answers)
    
    await updateProfile({ riding_style: ridingStyle })
    await trackActivity('profile_updated', { section: 'riding_style_quiz' })
    
    return ridingStyle
  }

  function determineRidingStyle(answers: any): RidingStyle {
    const { primaryUse, terrain, distance } = answers
    
    if (primaryUse === 'commute') return 'commute'
    if (primaryUse === 'recreation' && terrain === 'city') return 'city'
    if (primaryUse === 'recreation' && terrain === 'mountain') return 'mountain'
    if (primaryUse === 'touring') return 'touring'
    if (primaryUse === 'cargo') return 'cargo'
    if (primaryUse === 'folding') return 'folding'
    
    return 'hybrid'
  }

  return {
    // State
    activities,
    preferences,
    bikeHistory,
    maintenanceReminders,
    achievements,
    loading,
    error,
    
    // Computed
    user,
    isAuthenticated,
    totalPoints,
    recentActivities,
    upcomingMaintenance,
    
    // Actions
    trackActivity,
    fetchPreferences,
    updatePreferences,
    updateProfile,
    fetchBikeHistory,
    addBikeToHistory,
    fetchMaintenanceReminders,
    createMaintenanceReminder,
    markMaintenanceComplete,
    fetchAchievements,
    fetchActivities,
    initialize,
    completeRidingStyleQuiz
  }
})
