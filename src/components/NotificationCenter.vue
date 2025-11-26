<template>
  <div class="notification-center">
    <!-- Notification Bell Icon -->
    <div class="relative">
      <button
        @click="toggleNotifications"
        class="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5-5-5 5h5z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
        </svg>
        
        <!-- Unread Badge -->
        <span
          v-if="unreadCount > 0"
          class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
        >
          {{ unreadCount > 99 ? '99+' : unreadCount }}
        </span>
      </button>

      <!-- Notification Dropdown -->
      <div
        v-if="showNotifications"
        class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50"
      >
        <!-- Header -->
        <div class="p-4 border-b">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Notifications</h3>
            <div class="flex gap-2">
              <button
                v-if="unreadCount > 0"
                @click="markAllAsRead"
                class="text-sm text-primary-600 hover:text-primary-700"
              >
                Mark all read
              </button>
              <button
                @click="showNotifications = false"
                class="text-gray-400 hover:text-gray-600"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Notification List -->
        <div class="max-h-96 overflow-y-auto">
          <div v-if="notifications.length === 0" class="p-8 text-center text-gray-500">
            <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5-5-5 5h5z" />
            </svg>
            <p>No notifications yet</p>
            <p class="text-sm">We'll notify you when something important happens!</p>
          </div>
          
          <div
            v-for="notification in recentNotifications"
            :key="notification.id"
            :class="[
              'p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors',
              !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
            ]"
            @click="handleNotificationClick(notification)"
          >
            <div class="flex items-start gap-3">
              <!-- Notification Icon -->
              <div class="flex-shrink-0 mt-1">
                <div :class="getNotificationIconClass(notification.type)">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path :d="getNotificationIcon(notification.type)" />
                  </svg>
                </div>
              </div>
              
              <!-- Notification Content -->
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-medium text-gray-900 mb-1">
                  {{ notification.title }}
                </h4>
                <p class="text-sm text-gray-600 mb-2">
                  {{ notification.message }}
                </p>
                <div class="flex items-center justify-between">
                  <span class="text-xs text-gray-500">
                    {{ formatTimeAgo(notification.created_at) }}
                  </span>
                  <button
                    v-if="!notification.read"
                    @click.stop="markAsRead([notification.id])"
                    class="text-xs text-primary-600 hover:text-primary-700"
                  >
                    Mark read
                  </button>
                </div>
              </div>
              
              <!-- Delete Button -->
              <button
                @click.stop="deleteNotification(notification.id)"
                class="flex-shrink-0 text-gray-400 hover:text-gray-600"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-4 border-t bg-gray-50">
          <button
            @click="viewAllNotifications"
            class="w-full text-center text-sm text-primary-600 hover:text-primary-700"
          >
            View all notifications
          </button>
        </div>
      </div>
    </div>

    <!-- Price Alerts Section -->
    <div v-if="showPriceAlerts" class="mt-4 bg-white rounded-lg shadow-sm border p-4">
      <h4 class="font-medium text-gray-900 mb-3">Price Alerts</h4>
      <div v-if="activePriceAlerts.length === 0" class="text-sm text-gray-500">
        No active price alerts
      </div>
      <div v-else class="space-y-2">
        <div
          v-for="alert in activePriceAlerts.slice(0, 3)"
          :key="alert.id"
          class="flex items-center justify-between p-2 bg-gray-50 rounded"
        >
          <div class="flex items-center gap-2">
            <img
              :src="alert.ebike.image_url || '/placeholder-bike.png'"
              :alt="alert.ebike.model_name"
              class="w-8 h-8 rounded object-cover"
            />
            <div>
              <p class="text-sm font-medium">{{ alert.ebike.brand }} {{ alert.ebike.model_name }}</p>
              <p class="text-xs text-gray-500">Alert at €{{ alert.target_price.toLocaleString() }}</p>
            </div>
          </div>
          <button
            @click="deletePriceAlert(alert.id)"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useNotificationStore } from '../stores/notifications'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const notificationStore = useNotificationStore()
const authStore = useAuthStore()
const router = useRouter()

// State
const showNotifications = ref(false)
const showPriceAlerts = ref(false)

// Computed
const isAuthenticated = computed(() => authStore.isAuthenticated)
const notifications = computed(() => notificationStore.notifications)
const recentNotifications = computed(() => notificationStore.recentNotifications)
const unreadCount = computed(() => notificationStore.unreadCount)
const activePriceAlerts = computed(() => notificationStore.activePriceAlerts)

// Methods
const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  if (showNotifications.value && notifications.value.length === 0) {
    notificationStore.fetchNotifications()
  }
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

const handleNotificationClick = (notification: any) => {
  // Mark as read
  if (!notification.read) {
    markAsRead([notification.id])
  }
  
  // Navigate if there's a link
  if (notification.link) {
    router.push(notification.link)
  }
  
  showNotifications.value = false
}

const viewAllNotifications = () => {
  router.push('/notifications')
  showNotifications.value = false
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
    price_drop: 'w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center',
    new_review: 'w-8 h-8 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center',
    appointment_reminder: 'w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center',
    achievement_unlocked: 'w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center',
    new_follower: 'w-8 h-8 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center',
    qa_answer: 'w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center',
    weekly_digest: 'w-8 h-8 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center',
    new_bike_launch: 'w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center',
    maintenance_reminder: 'w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center'
  }
  return classes[type] || classes['appointment_reminder']
}

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

// Lifecycle
onMounted(async () => {
  if (isAuthenticated.value) {
    await notificationStore.initialize()
    notificationStore.subscribeToNotifications()
    await notificationStore.requestNotificationPermission()
  }
})

onUnmounted(() => {
  // Cleanup subscription if needed
})
</script>

<style scoped>
.notification-center {
  position: relative;
}
</style>
