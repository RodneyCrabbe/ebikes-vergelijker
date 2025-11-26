<template>
  <div class="dealer-portal">
    <!-- Header -->
    <div class="bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-12">
      <div class="container mx-auto px-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold mb-2">Dealer Portal</h1>
            <p class="text-lg opacity-90">
              Welkom terug, {{ currentDealer?.name || 'Dealer' }}
            </p>
          </div>
          <div class="flex items-center gap-4">
            <div class="text-right">
              <div class="text-sm opacity-75">Status</div>
              <div class="font-semibold capitalize">{{ currentDealer?.status || 'N/A' }}</div>
            </div>
            <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Overview -->
    <div class="py-8 bg-gray-50">
      <div class="container mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white rounded-lg shadow-sm border p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Totaal Leads</p>
                <p class="text-2xl font-bold text-gray-900">{{ totalLeads }}</p>
              </div>
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm border p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Geconverteerde Leads</p>
                <p class="text-2xl font-bold text-gray-900">{{ convertedLeads }}</p>
              </div>
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm border p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Conversie Rate</p>
                <p class="text-2xl font-bold text-gray-900">{{ conversionRate.toFixed(1) }}%</p>
              </div>
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm border p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Totaal Commissie</p>
                <p class="text-2xl font-bold text-gray-900">€{{ totalCommissions.toFixed(2) }}</p>
              </div>
              <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="py-8">
      <div class="container mx-auto px-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Recent Leads -->
          <div class="lg:col-span-2">
            <div class="bg-white rounded-lg shadow-sm border">
              <div class="p-6 border-b border-gray-200">
                <div class="flex items-center justify-between">
                  <h2 class="text-lg font-semibold text-gray-900">Recente Leads</h2>
                  <div class="flex gap-2">
                    <select
                      v-model="leadStatusFilter"
                      @change="filterLeads"
                      class="px-3 py-1 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="">Alle Status</option>
                      <option value="new">Nieuw</option>
                      <option value="contacted">Gecontacteerd</option>
                      <option value="qualified">Gekwalificeerd</option>
                      <option value="converted">Geconverteerd</option>
                      <option value="lost">Verloren</option>
                    </select>
                    <button
                      @click="refreshLeads"
                      :disabled="loading"
                      class="px-3 py-1 bg-primary-500 text-white rounded-md text-sm hover:bg-primary-600 disabled:opacity-50"
                    >
                      Vernieuwen
                    </button>
                  </div>
                </div>
              </div>

              <div class="divide-y divide-gray-200">
                <div
                  v-for="lead in filteredLeads"
                  :key="lead.id"
                  class="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="flex items-center gap-3 mb-2">
                        <h3 class="font-medium text-gray-900">{{ lead.contact_info.name }}</h3>
                        <span :class="[
                          'px-2 py-1 rounded-full text-xs font-medium',
                          getStatusBadgeClass(lead.status)
                        ]">
                          {{ getStatusLabel(lead.status) }}
                        </span>
                        <span :class="[
                          'px-2 py-1 rounded-full text-xs font-medium',
                          getPriorityBadgeClass(lead.priority)
                        ]">
                          {{ getPriorityLabel(lead.priority) }}
                        </span>
                      </div>
                      <p class="text-sm text-gray-600 mb-2">
                        {{ lead.ebike_info.brand }} {{ lead.ebike_info.model }}
                        <span v-if="lead.ebike_info.price" class="font-medium">
                          - €{{ lead.ebike_info.price.toLocaleString() }}
                        </span>
                      </p>
                      <p class="text-sm text-gray-500">
                        {{ lead.contact_info.email }} • {{ lead.contact_info.phone || 'Geen telefoon' }}
                      </p>
                      <p class="text-xs text-gray-400 mt-1">
                        {{ formatDate(lead.created_at) }}
                      </p>
                    </div>
                    <div class="flex gap-2">
                      <select
                        :value="lead.status"
                        @change="updateLeadStatus(lead.id, $event.target.value)"
                        class="px-2 py-1 border border-gray-300 rounded text-xs"
                      >
                        <option value="new">Nieuw</option>
                        <option value="contacted">Gecontacteerd</option>
                        <option value="qualified">Gekwalificeerd</option>
                        <option value="converted">Geconverteerd</option>
                        <option value="lost">Verloren</option>
                      </select>
                      <button
                        @click="viewLeadDetails(lead)"
                        class="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="filteredLeads.length === 0" class="p-6 text-center text-gray-500">
                Geen leads gevonden
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <!-- Quick Actions -->
            <div class="bg-white rounded-lg shadow-sm border p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Snelle Acties</h3>
              <div class="space-y-3">
                <button
                  @click="viewPerformance"
                  class="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div class="flex items-center gap-3">
                    <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span>Prestatie Bekijken</span>
                  </div>
                </button>
                <button
                  @click="viewCommissions"
                  class="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div class="flex items-center gap-3">
                    <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <span>Commissies Bekijken</span>
                  </div>
                </button>
                <button
                  @click="updateSettings"
                  class="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div class="flex items-center gap-3">
                    <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Instellingen</span>
                  </div>
                </button>
              </div>
            </div>

            <!-- Recent Performance -->
            <div class="bg-white rounded-lg shadow-sm border p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Recente Prestatie</h3>
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Deze maand</span>
                  <span class="font-medium">{{ convertedLeads }} leads</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Conversie rate</span>
                  <span class="font-medium">{{ conversionRate.toFixed(1) }}%</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Gemiddelde responstijd</span>
                  <span class="font-medium">2.5 uur</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useDealerStore } from '../../stores/dealer'
import { useRouter } from 'vue-router'
import type { DealerLead } from '../../types/dealer'

const dealerStore = useDealerStore()
const router = useRouter()

// State
const leadStatusFilter = ref('')

// Computed
const currentDealer = computed(() => dealerStore.currentDealer)
const leads = computed(() => dealerStore.leads)
const loading = computed(() => dealerStore.loading)
const error = computed(() => dealerStore.error)
const totalLeads = computed(() => dealerStore.totalLeads)
const convertedLeads = computed(() => dealerStore.convertedLeads)
const conversionRate = computed(() => dealerStore.conversionRate)
const totalCommissions = computed(() => dealerStore.totalCommissions)

const filteredLeads = computed(() => {
  if (!leadStatusFilter.value) return leads.value
  return leads.value.filter(lead => lead.status === leadStatusFilter.value)
})

// Methods
const filterLeads = () => {
  // Filter is handled by computed property
}

const refreshLeads = async () => {
  await dealerStore.fetchDealerLeads()
}

const updateLeadStatus = async (leadId: string, newStatus: string) => {
  await dealerStore.updateLeadStatus(leadId, newStatus)
}

const viewLeadDetails = (lead: DealerLead) => {
  // Open lead details modal or navigate to details page
  console.log('View lead details:', lead)
}

const viewPerformance = () => {
  // Navigate to performance page
  console.log('View performance')
}

const viewCommissions = () => {
  // Navigate to commissions page
  console.log('View commissions')
}

const updateSettings = () => {
  // Navigate to settings page
  console.log('Update settings')
}

const getStatusBadgeClass = (status: string) => {
  const classes = {
    new: 'bg-blue-100 text-blue-800',
    contacted: 'bg-yellow-100 text-yellow-800',
    qualified: 'bg-purple-100 text-purple-800',
    converted: 'bg-green-100 text-green-800',
    lost: 'bg-red-100 text-red-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const getStatusLabel = (status: string) => {
  const labels = {
    new: 'Nieuw',
    contacted: 'Gecontacteerd',
    qualified: 'Gekwalificeerd',
    converted: 'Geconverteerd',
    lost: 'Verloren'
  }
  return labels[status as keyof typeof labels] || status
}

const getPriorityBadgeClass = (priority: string) => {
  const classes = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  }
  return classes[priority as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const getPriorityLabel = (priority: string) => {
  const labels = {
    low: 'Laag',
    medium: 'Gemiddeld',
    high: 'Hoog'
  }
  return labels[priority as keyof typeof labels] || priority
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
  await dealerStore.initialize()
})
</script>

<style scoped>
.dealer-portal {
  min-height: 100vh;
  background-color: #f9fafb;
}
</style>
