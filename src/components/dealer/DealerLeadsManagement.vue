<!-- Dealer Leads Management Component -->
<!-- Advanced lead management with scoring and conversion tracking -->

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Lead Management</h2>
        <p class="text-gray-600">Track and manage your leads with advanced scoring</p>
      </div>
      <button
        @click="showAddModal = true"
        class="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Lead
      </button>
    </div>

    <!-- Lead Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Leads</p>
            <p class="text-2xl font-bold text-gray-900">{{ leads.length }}</p>
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
            <p class="text-sm font-medium text-gray-600">Converted</p>
            <p class="text-2xl font-bold text-gray-900">{{ leads.filter(l => l.status === 'converted').length }}</p>
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
            <p class="text-sm font-medium text-gray-600">Conversion Rate</p>
            <p class="text-2xl font-bold text-gray-900">{{ conversionRate.toFixed(1) }}%</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-lg">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Avg Score</p>
            <p class="text-2xl font-bold text-gray-900">{{ averageLeadScore.toFixed(0) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-sm border p-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            v-model="filters.status"
            @change="applyFilters"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="converted">Converted</option>
            <option value="lost">Lost</option>
            <option value="nurturing">Nurturing</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Priority</label>
          <select
            v-model="filters.priority"
            @change="applyFilters"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Lead Type</label>
          <select
            v-model="filters.lead_type"
            @change="applyFilters"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Types</option>
            <option value="appointment">Appointment</option>
            <option value="inquiry">Inquiry</option>
            <option value="purchase_intent">Purchase Intent</option>
            <option value="test_ride">Test Ride</option>
            <option value="quote_request">Quote Request</option>
          </select>
        </div>

        <div class="flex items-end">
          <button
            @click="clearFilters"
            class="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Leads Table -->
    <div class="bg-white rounded-lg shadow-sm border">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="lead in filteredLeads" :key="lead.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ lead.contact_name }}</div>
                  <div class="text-sm text-gray-500">{{ lead.contact_email }}</div>
                  <div v-if="lead.contact_phone" class="text-sm text-gray-500">{{ lead.contact_phone }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {{ lead.lead_type.replace('_', ' ') }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  lead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                  lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                  lead.status === 'qualified' ? 'bg-purple-100 text-purple-800' :
                  lead.status === 'converted' ? 'bg-green-100 text-green-800' :
                  lead.status === 'lost' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                ]">
                  {{ lead.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-16 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      :class="[
                        'h-2 rounded-full',
                        lead.lead_score >= 80 ? 'bg-green-500' :
                        lead.lead_score >= 60 ? 'bg-yellow-500' :
                        'bg-red-500'
                      ]"
                      :style="{ width: `${lead.lead_score}%` }"
                    ></div>
                  </div>
                  <span class="text-sm font-medium text-gray-900">{{ lead.lead_score }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  lead.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                  lead.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                  lead.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                ]">
                  {{ lead.priority }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(lead.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center gap-2">
                  <button
                    @click="viewLead(lead)"
                    class="text-primary-600 hover:text-primary-900"
                  >
                    View
                  </button>
                  <button
                    @click="editLead(lead)"
                    class="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>
                  <button
                    @click="convertLead(lead.id)"
                    v-if="lead.status !== 'converted'"
                    class="text-green-600 hover:text-green-900"
                  >
                    Convert
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Lead Detail Modal -->
    <div v-if="showLeadModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-semibold">Lead Details</h3>
          <button @click="showLeadModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div v-if="selectedLead" class="space-y-6">
          <!-- Lead Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="text-md font-semibold mb-3">Contact Information</h4>
              <div class="space-y-2">
                <p><span class="font-medium">Name:</span> {{ selectedLead.contact_name }}</p>
                <p><span class="font-medium">Email:</span> {{ selectedLead.contact_email }}</p>
                <p v-if="selectedLead.contact_phone"><span class="font-medium">Phone:</span> {{ selectedLead.contact_phone }}</p>
                <p><span class="font-medium">Preferred Contact:</span> {{ selectedLead.preferred_contact }}</p>
              </div>
            </div>
            <div>
              <h4 class="text-md font-semibold mb-3">Lead Details</h4>
              <div class="space-y-2">
                <p><span class="font-medium">Type:</span> {{ selectedLead.lead_type.replace('_', ' ') }}</p>
                <p><span class="font-medium">Status:</span> {{ selectedLead.status }}</p>
                <p><span class="font-medium">Priority:</span> {{ selectedLead.priority }}</p>
                <p><span class="font-medium">Score:</span> {{ selectedLead.lead_score }}</p>
                <p><span class="font-medium">Source:</span> {{ selectedLead.source || 'Unknown' }}</p>
              </div>
            </div>
          </div>

          <!-- Budget and Timeline -->
          <div v-if="selectedLead.budget_min || selectedLead.budget_max || selectedLead.timeline">
            <h4 class="text-md font-semibold mb-3">Budget & Timeline</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-if="selectedLead.budget_min || selectedLead.budget_max">
                <p class="font-medium">Budget Range:</p>
                <p>€{{ selectedLead.budget_min || 0 }} - €{{ selectedLead.budget_max || 'No limit' }}</p>
              </div>
              <div v-if="selectedLead.timeline">
                <p class="font-medium">Timeline:</p>
                <p>{{ selectedLead.timeline.replace('_', ' ') }}</p>
              </div>
            </div>
          </div>

          <!-- Message -->
          <div v-if="selectedLead.message">
            <h4 class="text-md font-semibold mb-3">Message</h4>
            <p class="text-gray-700">{{ selectedLead.message }}</p>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-3 pt-6 border-t">
            <button
              @click="showLeadModal = false"
              class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Close
            </button>
            <button
              @click="editLead(selectedLead)"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Edit Lead
            </button>
            <button
              @click="convertLead(selectedLead.id)"
              v-if="selectedLead.status !== 'converted'"
              class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Convert Lead
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useDealerLeadsStore } from '../../stores/dealerLeads'
import { useAuthStore } from '../../stores/auth'
import type { DealerLeadEnhanced } from '../../types/dealerEnhanced'

const leadsStore = useDealerLeadsStore()
const authStore = useAuthStore()

// State
const showAddModal = ref(false)
const showLeadModal = ref(false)
const selectedLead = ref<DealerLeadEnhanced | null>(null)

// Computed
const leads = computed(() => leadsStore.leads)
const filteredLeads = computed(() => leadsStore.filteredLeads)
const conversionRate = computed(() => leadsStore.conversionRate)
const averageLeadScore = computed(() => leadsStore.averageLeadScore)
const loading = computed(() => leadsStore.loading)
const filters = computed(() => leadsStore.filters)

// Methods
const applyFilters = () => {
  leadsStore.setFilters(filters.value)
}

const clearFilters = () => {
  leadsStore.clearFilters()
}

const viewLead = (lead: DealerLeadEnhanced) => {
  selectedLead.value = lead
  showLeadModal.value = true
}

const editLead = (lead: DealerLeadEnhanced) => {
  selectedLead.value = lead
  showLeadModal.value = false
  // TODO: Open edit modal
}

const convertLead = async (leadId: string) => {
  try {
    await leadsStore.convertLead(leadId)
  } catch (error) {
    console.error('Error converting lead:', error)
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('nl-NL', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Lifecycle
onMounted(async () => {
  if (authStore.user?.id) {
    await leadsStore.fetchLeads(authStore.user.id)
  }
})
</script>
