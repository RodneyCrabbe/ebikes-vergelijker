<template>
  <div class="recommendations-section">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h3 class="text-xl font-semibold text-gray-900">{{ title }}</h3>
        <p v-if="subtitle" class="text-gray-600 mt-1">{{ subtitle }}</p>
      </div>
      <div v-if="showRefresh" class="flex items-center gap-2">
        <button
          @click="refreshRecommendations"
          :disabled="loading"
          class="text-sm text-primary-600 hover:text-primary-700 disabled:opacity-50"
        >
          {{ loading ? 'Refreshing...' : 'Refresh' }}
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading && recommendations.length === 0" class="space-y-4">
      <div v-for="n in 3" :key="n" class="bg-white rounded-lg shadow-sm border p-4 animate-pulse">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 bg-gray-200 rounded-lg"></div>
          <div class="flex-1">
            <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div class="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div class="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
          <div class="w-20 h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <span class="text-red-700">{{ error }}</span>
      </div>
    </div>

    <!-- Recommendations Grid -->
    <div v-else-if="recommendations.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="recommendation in recommendations"
        :key="recommendation.ebike.id"
        class="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
        @click="viewEBike(recommendation.ebike)"
      >
        <!-- Image -->
        <div class="relative h-48 bg-gray-100 rounded-t-lg overflow-hidden">
          <img
            v-if="recommendation.ebike.image_url"
            :src="recommendation.ebike.image_url"
            :alt="recommendation.ebike.model_name"
            class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
            <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          
          <!-- Confidence Badge -->
          <div class="absolute top-3 right-3">
            <div :class="[
              'px-2 py-1 rounded-full text-xs font-medium',
              getConfidenceClass(recommendation.confidence)
            ]">
              {{ Math.round(recommendation.confidence * 100) }}% match
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="p-4">
          <!-- Brand and Model -->
          <h4 class="font-semibold text-gray-900 mb-1">
            {{ recommendation.ebike.brand }} {{ recommendation.ebike.model_name }}
          </h4>
          
          <!-- Price -->
          <div class="mb-3">
            <span v-if="recommendation.ebike.price && recommendation.ebike.price > 0" class="text-lg font-bold text-primary-600">
              €{{ recommendation.ebike.price.toLocaleString() }}
            </span>
            <span v-else class="text-lg text-gray-400">Prijs op aanvraag</span>
          </div>

          <!-- Key Specs -->
          <div class="space-y-1 mb-3 text-sm text-gray-600">
            <div v-if="recommendation.ebike.action_radius" class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
              </svg>
              <span>{{ recommendation.ebike.action_radius }}km bereik</span>
            </div>
            <div v-if="recommendation.ebike.battery_capacity" class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clip-rule="evenodd" />
              </svg>
              <span>{{ recommendation.ebike.battery_capacity }}Wh accu</span>
            </div>
            <div v-if="recommendation.ebike.top_speed" class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clip-rule="evenodd" />
              </svg>
              <span>{{ recommendation.ebike.top_speed }}km/h topsnelheid</span>
            </div>
          </div>

          <!-- Reasons -->
          <div v-if="recommendation.reasons.length > 0" class="mb-3">
            <div class="flex flex-wrap gap-1">
              <span
                v-for="reason in recommendation.reasons.slice(0, 2)"
                :key="reason"
                class="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
              >
                {{ reason }}
              </span>
              <span
                v-if="recommendation.reasons.length > 2"
                class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                +{{ recommendation.reasons.length - 2 }} meer
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-2">
            <button
              @click.stop="addToFavorites(recommendation.ebike)"
              class="flex-1 bg-primary-500 text-white px-3 py-2 rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
            >
              Bekijk Details
            </button>
            <button
              @click.stop="addToComparison(recommendation.ebike)"
              class="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Geen aanbevelingen gevonden</h3>
      <p class="text-gray-500">Probeer je voorkeuren aan te passen of bekijk alle e-bikes.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useFavoritesStore } from '../stores/favorites'
import { useComparisonStore } from '../stores/comparison'
import type { RecommendationResult } from '../services/aiRecommendationEngine'

interface Props {
  recommendations: RecommendationResult[]
  title: string
  subtitle?: string
  loading?: boolean
  error?: string | null
  showRefresh?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  subtitle: '',
  loading: false,
  error: null,
  showRefresh: false
})

const emit = defineEmits<{
  refresh: []
}>()

const router = useRouter()
const favoritesStore = useFavoritesStore()
const comparisonStore = useComparisonStore()

// Methods
const viewEBike = (ebike: any) => {
  router.push(`/e-bikes/${ebike.id}`)
}

const addToFavorites = async (ebike: any) => {
  try {
    await favoritesStore.addToFavorites(ebike.id)
  } catch (error) {
    console.error('Error adding to favorites:', error)
  }
}

const addToComparison = async (ebike: any) => {
  try {
    await comparisonStore.addToComparison(ebike.id)
  } catch (error) {
    console.error('Error adding to comparison:', error)
  }
}

const refreshRecommendations = () => {
  emit('refresh')
}

const getConfidenceClass = (confidence: number) => {
  if (confidence >= 0.8) return 'bg-green-100 text-green-800'
  if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800'
  return 'bg-gray-100 text-gray-800'
}
</script>

<style scoped>
.recommendations-section {
  /* Custom styles if needed */
}
</style>
