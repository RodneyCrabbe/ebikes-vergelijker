<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useReviewsStore } from '../stores/reviews'
import { useEBikesStore } from '../stores/ebikes'
import { useAuthStore } from '../stores/auth'
import type { CreateReviewData } from '../types/review'
import StarRating from './StarRating.vue'

interface Props {
  ebikeId?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  reviewCreated: []
  cancel: []
}>()

const reviewsStore = useReviewsStore()
const eBikesStore = useEBikesStore()
const authStore = useAuthStore()

// Form state
const form = ref<CreateReviewData>({
  ebike_id: props.ebikeId || '',
  rating: 0,
  title: '',
  content: '',
  pros: [],
  cons: [],
  verified_purchase: false,
  anonymous: false
})

const newPro = ref('')
const newCon = ref('')
const submitting = ref(false)
const error = ref('')

// Computed properties
const eBikes = computed(() => eBikesStore.ebikes)
const selectedEBike = computed(() => 
  eBikes.value.find(ebike => ebike.id === form.value.ebike_id)
)

const canSubmit = computed(() => {
  return form.value.ebike_id && 
         form.value.rating > 0 && 
         form.value.title.trim() && 
         form.value.content.trim()
})

// Methods
const addPro = () => {
  if (newPro.value.trim()) {
    form.value.pros.push(newPro.value.trim())
    newPro.value = ''
  }
}

const removePro = (index: number) => {
  form.value.pros.splice(index, 1)
}

const addCon = () => {
  if (newCon.value.trim()) {
    form.value.cons.push(newCon.value.trim())
    newCon.value = ''
  }
}

const removeCon = (index: number) => {
  form.value.cons.splice(index, 1)
}

const handleRatingChange = (rating: number) => {
  form.value.rating = rating
}

const handleSubmit = async () => {
  if (!canSubmit.value) return

  submitting.value = true
  error.value = ''

  try {
    await reviewsStore.createReview(form.value, authStore.user?.id)
    emit('reviewCreated')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Er is een fout opgetreden bij het opslaan van de review'
  } finally {
    submitting.value = false
  }
}

const handleCancel = () => {
  emit('cancel')
}

onMounted(async () => {
  // Load e-bikes if not already loaded
  if (eBikes.value.length === 0) {
    await eBikesStore.fetchEBikes()
  }
})
</script>

<template>
  <div class="p-6">
    <!-- Modal Header -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Review Schrijven</h2>
      <button
        @click="handleCancel"
        class="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
      {{ error }}
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- E-bike Selection -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          E-bike <span class="text-red-500">*</span>
        </label>
        <select
          v-model="form.ebike_id"
          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          required
        >
          <option value="">Selecteer een e-bike</option>
          <option
            v-for="ebike in eBikes"
            :key="ebike.id"
            :value="ebike.id"
          >
            {{ ebike.brand }} {{ ebike.model_name }} - €{{ ebike.price?.toLocaleString() }}
          </option>
        </select>
      </div>

      <!-- Selected E-bike Info -->
      <div v-if="selectedEBike" class="bg-gray-50 rounded-lg p-4">
        <div class="flex items-center space-x-4">
          <img
            :src="selectedEBike.image_url"
            :alt="selectedEBike.model_name"
            class="w-16 h-16 object-cover rounded-lg"
          />
          <div>
            <h3 class="font-semibold text-gray-900">
              {{ selectedEBike.brand }} {{ selectedEBike.model_name }}
            </h3>
            <p class="text-sm text-gray-600">{{ selectedEBike.description }}</p>
          </div>
        </div>
      </div>

      <!-- Rating -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Beoordeling <span class="text-red-500">*</span>
        </label>
        <StarRating
          :rating="form.rating"
          :editable="true"
          :size="'lg'"
          @rating-change="handleRatingChange"
        />
        <p class="text-sm text-gray-500 mt-2">
          Klik op de sterren om je beoordeling te geven
        </p>
      </div>

      <!-- Title -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Titel <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.title"
          type="text"
          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Geef je review een pakkende titel"
          required
        />
      </div>

      <!-- Content -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Review <span class="text-red-500">*</span>
        </label>
        <textarea
          v-model="form.content"
          rows="4"
          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Vertel ons over je ervaring met deze e-bike..."
          required
        ></textarea>
      </div>

      <!-- Pros -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Voordelen</label>
        <div class="space-y-2">
          <div class="flex space-x-2">
            <input
              v-model="newPro"
              type="text"
              class="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Voeg een voordeel toe"
              @keyup.enter="addPro"
            />
            <button
              type="button"
              @click="addPro"
              class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Toevoegen
            </button>
          </div>
          <div v-if="form.pros.length > 0" class="space-y-1">
            <div
              v-for="(pro, index) in form.pros"
              :key="index"
              class="flex items-center justify-between bg-green-50 text-green-800 px-3 py-2 rounded-lg"
            >
              <span>{{ pro }}</span>
              <button
                type="button"
                @click="removePro(index)"
                class="text-green-600 hover:text-green-800"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Cons -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Nadelen</label>
        <div class="space-y-2">
          <div class="flex space-x-2">
            <input
              v-model="newCon"
              type="text"
              class="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Voeg een nadeel toe"
              @keyup.enter="addCon"
            />
            <button
              type="button"
              @click="addCon"
              class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Toevoegen
            </button>
          </div>
          <div v-if="form.cons.length > 0" class="space-y-1">
            <div
              v-for="(con, index) in form.cons"
              :key="index"
              class="flex items-center justify-between bg-red-50 text-red-800 px-3 py-2 rounded-lg"
            >
              <span>{{ con }}</span>
              <button
                type="button"
                @click="removeCon(index)"
                class="text-red-600 hover:text-red-800"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Options -->
      <div class="space-y-4">
        <div class="flex items-center">
          <input
            v-model="form.verified_purchase"
            type="checkbox"
            id="verified_purchase"
            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label for="verified_purchase" class="ml-2 block text-sm text-gray-700">
            Ik heb deze e-bike daadwerkelijk gekocht
          </label>
        </div>

        <div v-if="!authStore.isAuthenticated" class="flex items-center">
          <input
            v-model="form.anonymous"
            type="checkbox"
            id="anonymous"
            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label for="anonymous" class="ml-2 block text-sm text-gray-700">
            Anonieme review (je naam wordt niet getoond)
          </label>
        </div>
      </div>

      <!-- Submit Buttons -->
      <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          @click="handleCancel"
          class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Annuleren
        </button>
        <button
          type="submit"
          :disabled="!canSubmit || submitting"
          class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ submitting ? 'Opslaan...' : 'Review Opslaan' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
/* Custom styles for the review form */
</style>
