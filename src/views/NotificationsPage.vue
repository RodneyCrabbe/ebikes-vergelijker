<template>
  <div class="min-h-screen bg-gray-50">
    <Header />
    
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Notifications</h1>
              <p class="text-gray-600">Stay updated with your e-bike activities</p>
            </div>
            <div class="flex gap-2">
              <button
                v-if="unreadCount > 0"
                @click="markAllAsRead"
                class="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
              >
                Mark All Read
              </button>
              <button
                @click="showSettingsModal = true"
                class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Settings
              </button>
            </div>
          </div>
        </div>

        <!-- Notification List -->
        <div class="bg-white rounded-lg shadow-sm border">
          <div v-if="notifications.length === 0" class="text-center py-12">
            <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5-5-5 5h5z" />
            </svg>
            <h3 class="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
            <p class="text-gray-500">We'll notify you when something important happens!</p>
          </div>
          
          <div v-else>
            <div
              v-for="notification in notifications"
              :key="notification.id"
              :class="[
                'p-6 border-b hover:bg-gray-50 transition-colors',
                !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              ]"
            >
              <div class="flex items-start gap-4">
                <!-- Notification Icon -->
                <div class="flex-shrink-0">
                  <div :class="getNotificationIconClass(notification.type)">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path :d="getNotificationIcon(notification.type)" />
                    </svg>
                  </div>
                </div>
                
                <!-- Notification Content -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <h3 class="text-lg font-medium text-gray-900 mb-1">
                        {{ notification.title }}
                      </h3>
                      <p class="text-gray-600 mb-2">
                        {{ notification.message }}
                      </p>
                      <div class="flex items-center gap-4 text-sm text-gray-500">
                        <span>{{ formatTimeAgo(notification.created_at) }}</span>
                        <span :class="[
                          'px-2 py-1 rounded-full text-xs font-medium',
                          getPriorityClass(notification.priority)
                        ]">
                          {{ notification.priority }}
                        </span>
                      </div>
                    </div>
                    
                    <!-- Actions -->
                    <div class="flex gap-2 ml-4">
                      <button
                        v-if="!notification.read"
                        @click="markAsRead([notification.id])"
                        class="text-sm text-primary-600 hover:text-primary-700"
                      >
                        Mark read
                      </button>
                      <button
                        @click="deleteNotification(notification.id)"
                        class="text-gray-400 hover:text-gray-600"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <!-- Action Button -->
                  <div v-if="notification.link" class="mt-3">
                    <button
                      @click="handleNotificationClick(notification)"
                      class="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Price Alerts Section -->
        <div class="mt-6 bg-white rounded-lg shadow-sm border p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-900">Price Alerts</h2>
            <button
              @click="showPriceAlertModal = true"
              class="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
            >
              Create Alert
            </button>
          </div>
          
          <div v-if="activePriceAlerts.length === 0" class="text-center py-8 text-gray-500">
            <p>No active price alerts</p>
            <p class="text-sm">Create alerts to get notified when bike prices drop!</p>
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="alert in activePriceAlerts"
              :key="alert.id"
              class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center gap-3">
                <img
                  :src="alert.ebike.image_url || '/placeholder-bike.png'"
                  :alt="alert.ebike.model_name"
                  class="w-12 h-12 rounded object-cover"
                />
                <div>
                  <h4 class="font-medium text-gray-900">
                    {{ alert.ebike.brand }} {{ alert.ebike.model_name }}
                  </h4>
                  <p class="text-sm text-gray-500">
                    Alert at €{{ alert.target_price.toLocaleString() }}
                  </p>
                  <p class="text-sm text-gray-500">
                    Current: €{{ alert.current_price.toLocaleString() }}
                  </p>
                </div>
              </div>
              <div class="flex gap-2">
                <button
                  @click="editPriceAlert(alert)"
                  class="text-sm text-blue-600 hover:text-blue-700"
                >
                  Edit
                </button>
                <button
                  @click="deletePriceAlert(alert.id)"
                  class="text-sm text-red-600 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Footer />
    <EnhancedAIChatbot />

    <!-- Settings Modal -->
    <div v-if="showSettingsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold mb-4">Notification Settings</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium">Email Notifications</span>
            <input
              v-model="emailDigestPreferences.include_price_alerts"
              type="checkbox"
              class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium">Price Drop Alerts</span>
            <input
              v-model="emailDigestPreferences.include_price_alerts"
              type="checkbox"
              class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium">New Reviews</span>
            <input
              v-model="emailDigestPreferences.include_new_reviews"
              type="checkbox"
              class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium">Community Activity</span>
            <input
              v-model="emailDigestPreferences.include_community_activity"
              type="checkbox"
              class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <button
            @click="showSettingsModal = false"
            class="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            @click="saveNotificationSettings"
            class="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, defineAsyncComponent } from 'vue'
import { useNotificationStore } from '../stores/notifications'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import Header from '../components/common/Header.vue'
import Footer from '../components/common/Footer.vue'

// Lazy load AI Chatbot only when needed
const EnhancedAIChatbot = defineAsyncComponent(() => import('../components/EnhancedAIChatbot.vue'))

const notificationStore = useNotificationStore()
const authStore = useAuthStore()
const router = useRouter()

// State
const showSettingsModal = ref(false)
const showPriceAlertModal = ref(false)

// Computed
const isAuthenticated = computed(() => authStore.isAuthenticated)
const notifications = computed(() => notificationStore.notifications)
const unreadCount = computed(() => notificationStore.unreadCount)
const activePriceAlerts = computed(() => notificationStore.activePriceAlerts)
const emailDigestPreferences = computed(() => notificationStore.emailDigestPreferences || {
  include_price_alerts: true,
  include_new_reviews: true,
  include_community_activity: true,
  include_recommendations: true
})

// Methods
const formatTimeAgo = (dateString: string) => {
  const now = new Date()
  const date = new Date(dateString)
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
  
  return date.toLocaleDateString('nl-NL', {
    month: 'short',
    day: 'numeric'
  })
}

const getNotificationIcon = (type: string) => {
  const icons: Record<string, string> = {
    price_drop: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1',
    new_review: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
    appointment_reminder: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    achievement_unlocked: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
    new_follower: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    qa_answer: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
    weekly_digest: 'M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    new_bike_launch: 'M13 10V3L4 14h7v7l9-11h-7z',
    maintenance_reminder: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
  }
  return icons[type] || icons['appointment_reminder']
}

const getNotificationIconClass = (type: string) => {
  const classes: Record<string, string> = {
    price_drop: 'w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center',
    new_review: 'w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center',
    appointment_reminder: 'w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center',
    achievement_unlocked: 'w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center',
    new_follower: 'w-12 h-12 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center',
    qa_answer: 'w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center',
    weekly_digest: 'w-12 h-12 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center',
    new_bike_launch: 'w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center',
    maintenance_reminder: 'w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center'
  }
  return classes[type] || classes['appointment_reminder']
}

const getPriorityClass = (priority: string) => {
  const classes: Record<string, string> = {
    low: 'bg-gray-100 text-gray-800',
    normal: 'bg-blue-100 text-blue-800',
    high: 'bg-yellow-100 text-yellow-800',
    urgent: 'bg-red-100 text-red-800'
  }
  return classes[priority] || classes['normal']
}

const markAsRead = async (notificationIds: string[]) => {
  try {
    await notificationStore.markAsRead(notificationIds)
  } catch (error) {
    console.error('Error marking notifications as read:', error)
  }
}

const markAllAsRead = async () => {
  try {
    await notificationStore.markAllAsRead()
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
  }
}

const deleteNotification = async (notificationId: string) => {
  try {
    await notificationStore.deleteNotification(notificationId)
  } catch (error) {
    console.error('Error deleting notification:', error)
  }
}

const deletePriceAlert = async (alertId: string) => {
  try {
    await notificationStore.deletePriceAlert(alertId)
  } catch (error) {
    console.error('Error deleting price alert:', error)
  }
}

const editPriceAlert = (alert: any) => {
  // Implement edit price alert functionality
  console.log('Edit price alert:', alert.id)
}

const handleNotificationClick = (notification: any) => {
  if (!notification.read) {
    markAsRead([notification.id])
  }
  
  if (notification.link) {
    router.push(notification.link)
  }
}

const saveNotificationSettings = async () => {
  try {
    await notificationStore.updateEmailDigestPreferences(emailDigestPreferences.value)
    showSettingsModal.value = false
  } catch (error) {
    console.error('Error saving notification settings:', error)
  }
}

// Lifecycle
onMounted(async () => {
  if (isAuthenticated.value) {
    await notificationStore.initialize()
  }
})
</script>

<style scoped>
/* Custom styles if needed */
</style>
