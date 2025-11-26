<!-- Dealer Commissions Management Component -->
<!-- Commission tracking and payment management -->

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Commission Management</h2>
        <p class="text-gray-600">Track and manage your commissions and payments</p>
      </div>
      <div class="flex gap-2">
        <button
          @click="exportCommissions"
          class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export
        </button>
      </div>
    </div>

    <!-- Commission Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Earned</p>
            <p class="text-2xl font-bold text-gray-900">€{{ totalEarned.toLocaleString() }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center">
          <div class="p-2 bg-yellow-100 rounded-lg">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Pending</p>
            <p class="text-2xl font-bold text-gray-900">€{{ totalPending.toLocaleString() }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Approved</p>
            <p class="text-2xl font-bold text-gray-900">€{{ totalApproved.toLocaleString() }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-lg">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Avg Commission</p>
            <p class="text-2xl font-bold text-gray-900">€{{ averageCommission.toLocaleString() }}</p>
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
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="paid">Paid</option>
            <option value="cancelled">Cancelled</option>
            <option value="disputed">Disputed</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Type</label>
          <select
            v-model="filters.commission_type"
            @change="applyFilters"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Types</option>
            <option value="lead">Lead</option>
            <option value="conversion">Conversion</option>
            <option value="sale">Sale</option>
            <option value="referral">Referral</option>
            <option value="bonus">Bonus</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Date From</label>
          <input
            v-model="filters.date_from"
            type="date"
            @change="applyFilters"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
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

    <!-- Commissions Table -->
    <div class="bg-white rounded-lg shadow-sm border">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base Amount</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Calculated</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bonus</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="commission in filteredCommissions" :key="commission.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {{ commission.commission_type }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                €{{ commission.base_amount.toLocaleString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ (commission.commission_rate * 100).toFixed(1) }}%
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                €{{ commission.calculated_amount.toLocaleString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                €{{ commission.bonus_amount.toLocaleString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                €{{ commission.total_amount.toLocaleString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  commission.status === 'paid' ? 'bg-green-100 text-green-800' :
                  commission.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                  commission.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  commission.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  commission.status === 'disputed' ? 'bg-orange-100 text-orange-800' :
                  'bg-gray-100 text-gray-800'
                ]">
                  {{ commission.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(commission.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center gap-2">
                  <button
                    @click="viewCommission(commission)"
                    class="text-primary-600 hover:text-primary-900"
                  >
                    View
                  </button>
                  <button
                    @click="approveCommission(commission.id)"
                    v-if="commission.status === 'pending'"
                    class="text-green-600 hover:text-green-900"
                  >
                    Approve
                  </button>
                  <button
                    @click="payCommission(commission.id)"
                    v-if="commission.status === 'approved'"
                    class="text-blue-600 hover:text-blue-900"
                  >
                    Pay
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Commission Detail Modal -->
    <div v-if="showCommissionModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-semibold">Commission Details</h3>
          <button @click="showCommissionModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div v-if="selectedCommission" class="space-y-6">
          <!-- Commission Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="text-md font-semibold mb-3">Commission Details</h4>
              <div class="space-y-2">
                <p><span class="font-medium">Type:</span> {{ selectedCommission.commission_type }}</p>
                <p><span class="font-medium">Base Amount:</span> €{{ selectedCommission.base_amount.toLocaleString() }}</p>
                <p><span class="font-medium">Rate:</span> {{ (selectedCommission.commission_rate * 100).toFixed(1) }}%</p>
                <p><span class="font-medium">Calculated:</span> €{{ selectedCommission.calculated_amount.toLocaleString() }}</p>
                <p><span class="font-medium">Bonus:</span> €{{ selectedCommission.bonus_amount.toLocaleString() }}</p>
                <p><span class="font-medium">Total:</span> €{{ selectedCommission.total_amount.toLocaleString() }}</p>
              </div>
            </div>
            <div>
              <h4 class="text-md font-semibold mb-3">Status & Payment</h4>
              <div class="space-y-2">
                <p><span class="font-medium">Status:</span> {{ selectedCommission.status }}</p>
                <p v-if="selectedCommission.payment_method"><span class="font-medium">Payment Method:</span> {{ selectedCommission.payment_method }}</p>
                <p v-if="selectedCommission.payment_reference"><span class="font-medium">Reference:</span> {{ selectedCommission.payment_reference }}</p>
                <p v-if="selectedCommission.paid_at"><span class="font-medium">Paid At:</span> {{ formatDate(selectedCommission.paid_at) }}</p>
                <p><span class="font-medium">Created:</span> {{ formatDate(selectedCommission.created_at) }}</p>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div v-if="selectedCommission.notes">
            <h4 class="text-md font-semibold mb-3">Notes</h4>
            <p class="text-gray-700">{{ selectedCommission.notes }}</p>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-3 pt-6 border-t">
            <button
              @click="showCommissionModal = false"
              class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Close
            </button>
            <button
              @click="approveCommission(selectedCommission.id)"
              v-if="selectedCommission.status === 'pending'"
              class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Approve
            </button>
            <button
              @click="payCommission(selectedCommission.id)"
              v-if="selectedCommission.status === 'approved'"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Mark as Paid
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useDealerCommissionsStore } from '../../stores/dealerCommissions'
import { useAuthStore } from '../../stores/auth'
import type { DealerCommission } from '../../types/dealerEnhanced'

const commissionsStore = useDealerCommissionsStore()
const authStore = useAuthStore()

// State
const showCommissionModal = ref(false)
const selectedCommission = ref<DealerCommission | null>(null)

// Computed
const commissions = computed(() => commissionsStore.commissions)
const filteredCommissions = computed(() => commissionsStore.filteredCommissions)
const totalEarned = computed(() => commissionsStore.totalEarned)
const totalPending = computed(() => commissionsStore.totalPending)
const totalApproved = computed(() => commissionsStore.totalApproved)
const averageCommission = computed(() => commissionsStore.averageCommission)
const loading = computed(() => commissionsStore.loading)
const filters = computed(() => commissionsStore.filters)

// Methods
const applyFilters = () => {
  commissionsStore.setFilters(filters.value)
}

const clearFilters = () => {
  commissionsStore.clearFilters()
}

const viewCommission = (commission: DealerCommission) => {
  selectedCommission.value = commission
  showCommissionModal.value = true
}

const approveCommission = async (commissionId: string) => {
  try {
    await commissionsStore.approveCommission(commissionId)
    showCommissionModal.value = false
  } catch (error) {
    console.error('Error approving commission:', error)
  }
}

const payCommission = async (commissionId: string) => {
  try {
    await commissionsStore.payCommission(commissionId, 'bank_transfer', `PAY-${Date.now()}`)
    showCommissionModal.value = false
  } catch (error) {
    console.error('Error paying commission:', error)
  }
}

const exportCommissions = async () => {
  try {
    await commissionsStore.exportCommissions('csv')
  } catch (error) {
    console.error('Error exporting commissions:', error)
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
    await commissionsStore.fetchCommissions(authStore.user.id)
  }
})
</script>
