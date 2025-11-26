<!-- Enhanced Dealer Portal -->
<!-- Comprehensive dealer management interface with inventory, analytics, leads, and commissions -->

<template>
  <div class="min-h-screen bg-gray-50">
    <Header />
    
    <!-- Loading State -->
    <div v-if="isLoading" class="container mx-auto px-4 py-8">
      <div class="flex items-center justify-center min-h-96">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p class="text-gray-600">Loading dealer portal...</p>
        </div>
      </div>
    </div>
    
    <!-- Main Content -->
    <div v-else class="container mx-auto px-4 py-8">
      <!-- Portal Header -->
      <div class="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Dealer Portal</h1>
            <p class="text-gray-600 mt-1">Manage your inventory, leads, and commissions</p>
          </div>
          <div class="flex items-center gap-4">
            <div class="text-right">
              <p class="text-sm text-gray-500">Welcome back,</p>
              <p class="font-medium">{{ dealerName }}</p>
            </div>
            <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Dashboard Summary -->
      <div v-if="activeTab === 'dashboard'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Inventory</p>
              <p class="text-2xl font-bold text-gray-900">{{ dashboardSummary?.total_inventory || 0 }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border p-6">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Leads</p>
              <p class="text-2xl font-bold text-gray-900">{{ dashboardSummary?.total_leads || 0 }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border p-6">
          <div class="flex items-center">
            <div class="p-2 bg-yellow-100 rounded-lg">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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
            <div class="p-2 bg-purple-100 rounded-lg">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Commission Earned</p>
              <p class="text-2xl font-bold text-gray-900">€{{ (dashboardSummary?.commission_earned || 0).toLocaleString() }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="bg-white rounded-lg shadow-sm border mb-6">
        <nav class="flex border-b">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'px-6 py-4 text-sm font-medium border-b-2 transition-colors',
              activeTab === tab.id
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            {{ tab.label }}
            <span v-if="tab.count !== undefined" class="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
              {{ tab.count }}
            </span>
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="tab-content">
        <!-- Dashboard Tab -->
        <div v-if="activeTab === 'dashboard'" class="space-y-6">
          <!-- Quick Actions -->
          <div class="bg-white rounded-lg shadow-sm border p-6">
            <h3 class="text-lg font-semibold mb-4">Quick Actions</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                @click="activeTab = 'inventory'"
                class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg class="w-8 h-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <div class="text-left">
                  <p class="font-medium">Add New E-bike</p>
                  <p class="text-sm text-gray-500">Add a new e-bike to your inventory</p>
                </div>
              </button>

              <button
                @click="activeTab = 'leads'"
                class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg class="w-8 h-8 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <div class="text-left">
                  <p class="font-medium">View Leads</p>
                  <p class="text-sm text-gray-500">Manage your leads and conversions</p>
                </div>
              </button>

              <button
                @click="activeTab = 'analytics'"
                class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg class="w-8 h-8 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <div class="text-left">
                  <p class="font-medium">View Analytics</p>
                  <p class="text-sm text-gray-500">Track performance and metrics</p>
                </div>
              </button>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="bg-white rounded-lg shadow-sm border p-6">
            <h3 class="text-lg font-semibold mb-4">Recent Activity</h3>
            <div v-if="recentLeads.length === 0" class="text-center py-8 text-gray-500">
              <p>No recent activity</p>
              <p class="text-sm">Start by adding inventory or managing leads!</p>
            </div>
            <div v-else class="space-y-4">
              <div
                v-for="lead in recentLeads.slice(0, 5)"
                :key="lead.id"
                class="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div class="flex items-center gap-4">
                  <div :class="[
                    'w-3 h-3 rounded-full',
                    lead.status === 'new' ? 'bg-blue-500' :
                    lead.status === 'contacted' ? 'bg-yellow-500' :
                    lead.status === 'converted' ? 'bg-green-500' :
                    'bg-gray-500'
                  ]"></div>
                  <div>
                    <p class="font-medium">{{ lead.contact_name }}</p>
                    <p class="text-sm text-gray-500">{{ lead.lead_type }} • {{ formatDate(lead.created_at) }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm font-medium">{{ lead.lead_score }} points</p>
                  <p class="text-xs text-gray-500">{{ lead.priority }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Inventory Tab -->
        <div v-if="activeTab === 'inventory'" class="space-y-6">
          <DealerInventoryManagement />
        </div>

        <!-- Leads Tab -->
        <div v-if="activeTab === 'leads'" class="space-y-6">
          <DealerLeadsManagement />
        </div>

        <!-- Analytics Tab -->
        <div v-if="activeTab === 'analytics'" class="space-y-6">
          <DealerAnalyticsDashboard />
        </div>

        <!-- Commissions Tab -->
        <div v-if="activeTab === 'commissions'" class="space-y-6">
          <DealerCommissionsManagement />
        </div>

        <!-- Settings Tab -->
        <div v-if="activeTab === 'settings'" class="space-y-6">
          <DealerSettingsManagement />
        </div>
      </div>
    </div>
    
    <Footer />
    <EnhancedAIChatbot />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useDealerAnalyticsStore } from '../stores/dealerAnalytics'
import { useDealerLeadsStore } from '../stores/dealerLeads'
import { useDealerInventoryStore } from '../stores/dealerInventory'
import { useDealerCommissionsStore } from '../stores/dealerCommissions'
import { useDealerSettingsStore } from '../stores/dealerSettings'
import Header from '../components/common/Header.vue'
import Footer from '../components/common/Footer.vue'
import EnhancedAIChatbot from '../components/EnhancedAIChatbot.vue'

// Import component placeholders (to be created)
import DealerInventoryManagement from '../components/dealer/DealerInventoryManagement.vue'
import DealerLeadsManagement from '../components/dealer/DealerLeadsManagement.vue'
import DealerAnalyticsDashboard from '../components/dealer/DealerAnalyticsDashboard.vue'
import DealerCommissionsManagement from '../components/dealer/DealerCommissionsManagement.vue'
import DealerSettingsManagement from '../components/dealer/DealerSettingsManagement.vue'

const authStore = useAuthStore()
const analyticsStore = useDealerAnalyticsStore()
const leadsStore = useDealerLeadsStore()
const inventoryStore = useDealerInventoryStore()
const commissionsStore = useDealerCommissionsStore()
const settingsStore = useDealerSettingsStore()

// State
const activeTab = ref('dashboard')
const isLoading = ref(true)

// Computed
const user = computed(() => authStore.user)
const isAuthenticated = computed(() => authStore.isAuthenticated)
const dealerName = computed(() => user.value?.name || 'Dealer')

const dashboardSummary = computed(() => analyticsStore.dashboardSummary)
const recentLeads = computed(() => leadsStore.recentLeads)

const tabs = computed(() => [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'inventory', label: 'Inventory', count: inventoryStore.inventory.length },
  { id: 'leads', label: 'Leads', count: leadsStore.leads.length },
  { id: 'analytics', label: 'Analytics' },
  { id: 'commissions', label: 'Commissions', count: commissionsStore.commissions.length },
  { id: 'settings', label: 'Settings' }
])

// Methods
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('nl-NL', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const initializeDealerPortal = async () => {
  if (!user.value?.id) return

  try {
    isLoading.value = true

    // Initialize all stores
    await Promise.all([
      analyticsStore.fetchDashboardSummary(user.value.id),
      leadsStore.fetchLeads(user.value.id),
      inventoryStore.fetchInventory(user.value.id),
      commissionsStore.fetchCommissions(user.value.id),
      settingsStore.fetchSettings(user.value.id)
    ])
  } catch (error) {
    console.error('Error initializing dealer portal:', error)
  } finally {
    isLoading.value = false
  }
}

// Lifecycle
onMounted(async () => {
  if (isAuthenticated.value) {
    await initializeDealerPortal()
  }
})
</script>

<style scoped>
.tab-content {
  min-height: 400px;
}
</style>
