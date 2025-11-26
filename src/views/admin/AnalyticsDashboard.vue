<template>
  <div class="analytics-dashboard">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p class="text-gray-600">Monitor platform performance and user engagement</p>
        </div>
        <div class="flex items-center gap-4">
          <!-- Date Range Selector -->
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium text-gray-700">Date Range:</label>
            <select
              v-model="selectedDateRange"
              @change="onDateRangeChange"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
          </div>
          
          <!-- Refresh Button -->
          <button
            @click="refreshData"
            :disabled="loading"
            class="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 disabled:opacity-50 flex items-center gap-2"
          >
            <svg class="w-4 h-4" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {{ loading ? 'Refreshing...' : 'Refresh' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mx-6 mt-4">
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 00-1.414-1.414L8.586 10l-1.293-1.293z" clip-rule="evenodd" />
        </svg>
        <span class="text-red-700">{{ error }}</span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading && !metrics" class="p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="n in 4" :key="n" class="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
          <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div class="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div class="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="p-6 space-y-6">
      <!-- Key Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="metric in keyMetrics"
          :key="metric.title"
          class="bg-white rounded-lg shadow-sm border p-6"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">{{ metric.title }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ metric.value }}</p>
              <div class="flex items-center gap-1 mt-1">
                <span :class="[
                  'text-sm font-medium',
                  metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                ]">
                  {{ metric.change }}
                </span>
                <span class="text-sm text-gray-500">vs last period</span>
              </div>
            </div>
            <div class="text-3xl">{{ metric.icon }}</div>
          </div>
        </div>
      </div>

      <!-- Charts Row 1 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Page Views Chart -->
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Top Pages</h3>
          <div class="h-64">
            <canvas ref="pageViewsChart"></canvas>
          </div>
        </div>

        <!-- E-bike Views Chart -->
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Top E-bikes</h3>
          <div class="h-64">
            <canvas ref="ebikeViewsChart"></canvas>
          </div>
        </div>
      </div>

      <!-- Charts Row 2 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Conversion Funnel -->
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Conversion Funnel</h3>
          <div class="h-64">
            <canvas ref="conversionFunnelChart"></canvas>
          </div>
        </div>

        <!-- User Retention -->
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">User Retention</h3>
          <div class="h-64">
            <canvas ref="userRetentionChart"></canvas>
          </div>
        </div>
      </div>

      <!-- Revenue Section -->
      <div v-if="revenueMetrics" class="space-y-6">
        <!-- Revenue Metrics -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="metric in revenueSummary"
            :key="metric.title"
            class="bg-white rounded-lg shadow-sm border p-6"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">{{ metric.title }}</p>
                <p class="text-2xl font-bold text-gray-900">{{ metric.value }}</p>
                <div class="flex items-center gap-1 mt-1">
                  <span :class="[
                    'text-sm font-medium',
                    metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  ]">
                    {{ metric.change }}
                  </span>
                  <span class="text-sm text-gray-500">vs last period</span>
                </div>
              </div>
              <div class="text-3xl">{{ metric.icon }}</div>
            </div>
          </div>
        </div>

        <!-- Revenue Charts -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- CPL Performance -->
          <div class="bg-white rounded-lg shadow-sm border p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">CPL Performance</h3>
            <div class="h-64">
              <canvas ref="cplPerformanceChart"></canvas>
            </div>
          </div>

          <!-- Revenue by E-bike -->
          <div class="bg-white rounded-lg shadow-sm border p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Revenue by E-bike</h3>
            <div class="h-64">
              <canvas ref="revenueChart"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- Detailed Tables -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Top Pages Table -->
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Top Pages</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="page in metrics?.top_pages || []" :key="page.page">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ page.page }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ page.views.toLocaleString() }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Top E-bikes Table -->
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Top E-bikes</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-bike</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="ebike in metrics?.top_ebikes || []" :key="ebike.ebike_id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ ebike.ebike_id }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ ebike.views.toLocaleString() }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useAnalyticsStore } from '../../stores/analytics'
import { Chart, registerables } from 'chart.js'

// Register Chart.js components
Chart.register(...registerables)

const analyticsStore = useAnalyticsStore()

// State
const selectedDateRange = ref('30')
const pageViewsChart = ref<HTMLCanvasElement | null>(null)
const ebikeViewsChart = ref<HTMLCanvasElement | null>(null)
const conversionFunnelChart = ref<HTMLCanvasElement | null>(null)
const userRetentionChart = ref<HTMLCanvasElement | null>(null)
const cplPerformanceChart = ref<HTMLCanvasElement | null>(null)
const revenueChart = ref<HTMLCanvasElement | null>(null)

// Chart instances
const chartInstances = ref<Chart[]>([])

// Computed
const metrics = computed(() => analyticsStore.metrics)
const keyMetrics = computed(() => analyticsStore.keyMetrics)
const revenueSummary = computed(() => analyticsStore.revenueSummary)
const loading = computed(() => analyticsStore.loading)
const error = computed(() => analyticsStore.error)

// Methods
const onDateRangeChange = () => {
  const days = parseInt(selectedDateRange.value)
  const end = new Date()
  const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000)
  
  analyticsStore.setDateRange(start, end)
  refreshData()
}

const refreshData = async () => {
  await analyticsStore.refresh()
  await nextTick()
  updateCharts()
}

const createChart = (canvas: HTMLCanvasElement, data: any, type: string = 'bar') => {
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const chart = new Chart(ctx, {
    type: type as any,
    data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top' as const
        }
      },
      scales: type === 'line' ? {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return value + '%'
            }
          }
        }
      } : {
        y: {
          beginAtZero: true
        }
      }
    }
  })

  chartInstances.value.push(chart)
  return chart
}

const updateCharts = () => {
  // Clear existing charts
  chartInstances.value.forEach(chart => chart.destroy())
  chartInstances.value = []

  // Create new charts
  if (pageViewsChart.value) {
    createChart(pageViewsChart.value, analyticsStore.pageViewsChartData, 'bar')
  }

  if (ebikeViewsChart.value) {
    createChart(ebikeViewsChart.value, analyticsStore.ebikeViewsChartData, 'bar')
  }

  if (conversionFunnelChart.value) {
    createChart(conversionFunnelChart.value, analyticsStore.conversionFunnelChartData, 'bar')
  }

  if (userRetentionChart.value) {
    createChart(userRetentionChart.value, analyticsStore.userRetentionChartData, 'line')
  }

  if (cplPerformanceChart.value) {
    createChart(cplPerformanceChart.value, analyticsStore.cplPerformanceChartData, 'bar')
  }

  if (revenueChart.value) {
    createChart(revenueChart.value, analyticsStore.revenueChartData, 'bar')
  }
}

// Lifecycle
onMounted(async () => {
  await analyticsStore.initialize()
  await nextTick()
  updateCharts()
})

onUnmounted(() => {
  chartInstances.value.forEach(chart => chart.destroy())
})
</script>

<style scoped>
.analytics-dashboard {
  min-height: 100vh;
  background-color: #f9fafb;
}
</style>
