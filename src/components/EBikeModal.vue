<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 overflow-y-auto"
    @click="closeModal"
  >
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
    
    <!-- Modal -->
    <div class="flex min-h-full items-center justify-center p-4">
      <div
        class="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        @click.stop
      >
        <!-- Close Button -->
        <button
          @click="closeModal"
          class="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <!-- Content -->
        <div v-if="ebike" class="overflow-y-auto max-h-[90vh]">
          <!-- Header -->
          <div class="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
            <div class="flex items-center space-x-4">
              <div class="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span class="text-2xl">🚴‍♂️</span>
              </div>
              <div>
                <h2 class="text-2xl font-bold">{{ ebike.brand }} {{ ebike.model_name }}</h2>
                <p v-if="ebike.version" class="text-blue-100">{{ ebike.version }}</p>
              </div>
            </div>
          </div>

          <!-- Body -->
          <div class="p-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- Image -->
              <div class="space-y-4">
                <div class="aspect-w-16 aspect-h-9 bg-gray-100 rounded-xl overflow-hidden">
                  <img
                    v-if="ebike.image_url"
                    :src="ebike.image_url"
                    :alt="`${ebike.brand} ${ebike.model_name}`"
                    class="w-full h-64 object-contain"
                  />
                  <div v-else class="w-full h-64 flex items-center justify-center text-gray-400">
                    <span class="text-4xl">🚴‍♂️</span>
                  </div>
                </div>
              </div>

              <!-- Details -->
              <div class="space-y-6">
                <!-- Price -->
                <div class="text-center">
                  <div class="text-4xl font-bold text-blue-600 mb-2">
                    €{{ ebike.price?.toLocaleString() || 'N/A' }}
                  </div>
                  <div v-if="ebike.currency && ebike.currency !== 'EUR'" class="text-sm text-gray-500">
                    ({{ ebike.currency }})
                  </div>
                </div>

                <!-- Key Specs -->
                <div class="grid grid-cols-2 gap-4">
                  <div class="text-center p-4 bg-gray-50 rounded-lg">
                    <div class="text-2xl mb-2">🔋</div>
                    <div class="font-semibold">{{ ebike.action_radius_km || 'N/A' }} km</div>
                    <div class="text-sm text-gray-600">Actieradius</div>
                  </div>
                  <div class="text-center p-4 bg-gray-50 rounded-lg">
                    <div class="text-2xl mb-2">⚡</div>
                    <div class="font-semibold">{{ ebike.top_speed_kmh || 'N/A' }} km/h</div>
                    <div class="text-sm text-gray-600">Topsnelheid</div>
                  </div>
                  <div class="text-center p-4 bg-gray-50 rounded-lg">
                    <div class="text-2xl mb-2">🔌</div>
                    <div class="font-semibold">{{ ebike.battery_capacity || 'N/A' }} Wh</div>
                    <div class="text-sm text-gray-600">Batterij</div>
                  </div>
                  <div class="text-center p-4 bg-gray-50 rounded-lg">
                    <div class="text-2xl mb-2">👤</div>
                    <div class="font-semibold">{{ ebike.gender_type || 'Unisex' }}</div>
                    <div class="text-sm text-gray-600">Type</div>
                  </div>
                </div>

                <!-- Description -->
                <div v-if="ebike.description">
                  <h3 class="font-semibold text-lg mb-2">Beschrijving</h3>
                  <p class="text-gray-600 text-sm leading-relaxed">{{ ebike.description }}</p>
                </div>

                <!-- Action Buttons -->
                <div class="space-y-3">
                  <button
                    @click="handleAffiliateClick"
                    class="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Bekijk Beste Deal →
                  </button>
                  
                  <div class="grid grid-cols-2 gap-3">
                    <button
                      @click="addToComparison"
                      :disabled="isInComparison"
                      :class="[
                        'py-2 px-4 rounded-lg font-semibold transition-colors border-2',
                        isInComparison
                          ? 'bg-gray-200 text-gray-600 cursor-not-allowed border-gray-300'
                          : 'bg-green-500 text-white hover:bg-green-600 border-green-500'
                      ]"
                    >
                      {{ isInComparison ? '✓ Toegevoegd' : '+ Vergelijk' }}
                    </button>
                    
                    <button
                      @click="toggleFavorite"
                      :class="[
                        'py-2 px-4 rounded-lg font-semibold transition-colors border-2',
                        isFavorite
                          ? 'bg-red-500 text-white hover:bg-red-600 border-red-500'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300 border-gray-400'
                      ]"
                    >
                      {{ isFavorite ? '❤️ Favoriet' : '🤍 Toevoegen' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-else class="p-12 text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p class="mt-4 text-gray-600">Laden...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useComparisonStore } from '../stores/comparison'
import { useFavoritesStore } from '../stores/favorites'
import { useAuthStore } from '../stores/auth'

interface Props {
  isOpen: boolean
  ebike: any | null
}

interface Emits {
  (e: 'close'): void
  (e: 'update:isOpen', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const comparisonStore = useComparisonStore()
const favoritesStore = useFavoritesStore()
const authStore = useAuthStore()

const isInComparison = computed(() => {
  return props.ebike ? comparisonStore.comparisonItems.some(e => e.id === props.ebike.id) : false
})

const isFavorite = computed(() => {
  return props.ebike ? favoritesStore.isFavorite(props.ebike.id) : false
})

const closeModal = () => {
  emit('close')
  emit('update:isOpen', false)
}

const handleAffiliateClick = async () => {
  if (props.ebike?.affiliate_url) {
    window.open(props.ebike.affiliate_url, '_blank')
  }
}

const addToComparison = () => {
  if (props.ebike) {
    comparisonStore.addToComparison(props.ebike)
  }
}

const toggleFavorite = async () => {
  if (!authStore.isAuthenticated) {
    alert('Je moet ingelogd zijn om e-bikes toe te voegen aan je favorieten.')
    return
  }

  if (props.ebike) {
    try {
      await favoritesStore.toggleFavorite(props.ebike)
    } catch (error) {
      console.error('Error toggling favorite:', error)
      alert('Er is een fout opgetreden bij het toevoegen/verwijderen van favorieten.')
    }
  }
}

// Close modal on escape key
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    document.addEventListener('keydown', handleEscape)
  } else {
    document.removeEventListener('keydown', handleEscape)
  }
})

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeModal()
  }
}
</script>

<style scoped>
.aspect-w-16 {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
}

.aspect-w-16 > * {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>
