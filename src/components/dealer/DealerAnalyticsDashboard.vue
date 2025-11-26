<!-- Dealer Analytics Dashboard Component -->
<!-- Comprehensive analytics and performance tracking -->

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <p class="text-gray-600">Track your performance and optimize your business</p>
      </div>
      <div class="flex gap-2">
        <select
          v-model="selectedPeriod"
          @change="updatePeriod"
          class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last year</option>
        </select>
        <button
          @click="refreshData"
          class="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>
    </div>

    <!-- Key Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Views</p>
            <p class="text-2xl font-bold text-gray-900">{{ dashboardSummary?.total_views || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Conversion Rate</p>
            <p class="text-2xl font-bold text-gray-900">{{ (dashboardSummary?.conversion_rate || 0).toFixed(1) }}%</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center">
          <div class="p-2 bg-yellow-100 rounded-lg">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Click Through Rate</p>
            <p class="text-2xl font-bold text-gray-900">{{ (dashboardSummary?.click_through_rate || 0).toFixed(1) }}%</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-lg">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Revenue</p>
            <p class="text-2xl font-bold text-gray-900">€{{ (dashboardSummary?.total_revenue || 0).toLocaleString() }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Event Types Chart -->
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <h3 class="text-lg font-semibold mb-4">Event Types</h3>
        <div v-if="eventTypeChart.length === 0" class="text-center py-8 text-gray-500">
          <p>No data available</p>
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="item in eventTypeChart"
            :key="item.label"
            class="flex items-center justify-between"
          >
            <div class="flex items-center">
              <div
                class="w-4 h-4 rounded-full mr-3"
                :style="{ backgroundColor: item.color }"
              ></div>
              <span class="text-sm font-medium text-gray-700">{{ item.label }}</span>
            </div>
            <span class="text-sm font-bold text-gray-900">{{ item.value }}</span>
          </div>
        </div>
      </div>

      <!-- Daily Events Chart -->
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <h3 class="text-lg font-semibold mb-4">Daily Activity</h3>
        <div v-if="dailyEventsChart.length === 0" class="text-center py-8 text-gray-500">
          <p>No data available</p>
        </div>
        <div v-else class="space-y-2">
          <div
            v-for="item in dailyEventsChart.slice(-7)"
            :key="item.date"
            class="flex items-center justify-between"
          >
            <span class="text-sm text-gray-600">{{ item.label }}</span>
            <div class="flex items-center">
              <div class="w-32 bg-gray-200 rounded-full h-2 mr-2">
                <div
                  class="bg-primary-500 h-2 rounded-full"
                  :style="{ width: `${(item.value / Math.max(...dailyEventsChart.map(d => d.value))) * 100}%` }"
                ></div>
              </div>
              <span class="text-sm font-medium text-gray-900">{{ item.value }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Performance Metrics -->
    <div class="bg-white rounded-lg shadow-sm border p-6">
      <h3 class="text-lg font-semibold mb-4">Performance Metrics</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="text-center">
          <div class="text-3xl font-bold text-gray-900">{{ dashboardSummary?.total_leads || 0 }}</div>
          <div class="text-sm text-gray-600">Total Leads</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold text-gray-900">{{ dashboardSummary?.converted_leads || 0 }}</div>
          <div class="text-sm text-gray-600">Converted Leads</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold text-gray-900">€{{ (dashboardSummary?.commission_earned || 0).toLocaleString() }}</div>
          <div class="text-sm text-gray-600">Commission Earned</div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white rounded-lg shadow-sm border p-6">
      <h3 class="text-lg font-semibold mb-4">Recent Activity</h3>
      <div v-if="recentEvents.length === 0" class="text-center py-8 text-gray-500">
        <p>No recent activity</p>
      </div>
      <div v-else class="space-y-4">
        <div
          v-for="event in recentEvents.slice(0, 10)"
          :key="event.id"
          class="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
        >
          <div class="flex items-center gap-4">
            <div :class="[
              'w-3 h-3 rounded-full',
              event.event_type === 'view' ? 'bg-blue-500' :
              event.event_type === 'click' ? 'bg-green-500' :
              event.event_type === 'lead' ? 'bg-yellow-500' :
              event.event_type === 'conversion' ? 'bg-purple-500' :
              'bg-gray-500'
            ]"></div>
            <div>
              <p class="font-medium">{{ event.event_type.charAt(0).toUpperCase() + event.event_type.slice(1) }}</p>
              <p class="text-sm text-gray-500">{{ formatDate(event.created_at) }}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-600">{{ event.event_source || 'Unknown' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useDealerAnalyticsStore } from '../../stores/dealerAnalytics'
import { useAuthStore } from '../../stores/auth'

const analyticsStore = useDealerAnalyticsStore()
const authStore = useAuthStore()

// State
const selectedPeriod = ref('30')

// Computed
const dashboardSummary = computed(() => analyticsStore.dashboardSummary)
const eventTypeChart = computed(() => analyticsStore.generateEventTypeChart())
const dailyEventsChart = computed(() => analyticsStore.generateDailyEventsChart())
const recentEvents = computed(() => analyticsStore.filteredEvents)

// Methods
const updatePeriod = async () => {
  if (authStore.user?.id) {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - parseInt(selectedPeriod.value))
    
    await analyticsStore.fetchAnalyticsEvents(authStore.user.id, {
      date_from: startDate.toISOString().split('T')[0],
      date_to: endDate.toISOString().split('T')[0]
    })
  }
}

const refreshData = async () => {
  if (authStore.user?.id) {
    await Promise.all([
      analyticsStore.fetchDashboardSummary(authStore.user.id),
      updatePeriod()
    ])
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('nl-NL', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Lifecycle
onMounted(async () => {
  if (authStore.user?.id) {
    await refreshData()
  }
})
</script>
