<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import type { Review } from '../types/review'
import StarRating from './StarRating.vue'

interface Props {
  review: Review
}

const props = defineProps<Props>()
const emit = defineEmits<{
  markHelpful: [reviewId: string]
  deleteReview: [reviewId: string]
}>()

const authStore = useAuthStore()
const isHelpful = ref(false)

const canDelete = computed(() => {
  return authStore.isAuthenticated && 
         authStore.user?.id === props.review.user_id
})

const handleMarkHelpful = () => {
  if (!isHelpful.value) {
    emit('markHelpful', props.review.id)
    isHelpful.value = true
  }
}

const handleDelete = () => {
  if (confirm('Weet je zeker dat je deze review wilt verwijderen?')) {
    emit('deleteReview', props.review.id)
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('nl-NL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
    <!-- Review Header -->
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center space-x-4">
        <!-- User Avatar -->
        <div class="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
          <img
            v-if="review.user_avatar"
            :src="review.user_avatar"
            :alt="review.user_name"
            class="w-12 h-12 rounded-full object-cover"
          />
          <span
            v-else
            class="text-primary-600 font-semibold text-lg"
          >
            {{ review.user_name?.charAt(0).toUpperCase() || 'A' }}
          </span>
        </div>

        <!-- User Info -->
        <div>
          <div class="flex items-center space-x-2">
            <h3 class="font-semibold text-gray-900">{{ review.user_name || 'Anonieme gebruiker' }}</h3>
            <span
              v-if="review.verified_purchase"
              class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium"
            >
              ✓ Geverifieerde aankoop
            </span>
          </div>
          <div class="flex items-center space-x-2 mt-1">
            <StarRating :rating="review.rating" :size="'sm'" />
            <span class="text-sm text-gray-500">{{ formatDate(review.created_at) }}</span>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center space-x-2">
        <button
          v-if="canDelete"
          @click="handleDelete"
          class="text-red-600 hover:text-red-800 text-sm font-medium"
        >
          Verwijderen
        </button>
      </div>
    </div>

    <!-- Review Content -->
    <div class="mb-4">
      <h4 class="text-lg font-semibold text-gray-900 mb-2">{{ review.title }}</h4>
      <p class="text-gray-700 leading-relaxed">{{ review.content }}</p>
    </div>

    <!-- Pros and Cons -->
    <div v-if="review.pros.length > 0 || review.cons.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <!-- Pros -->
      <div v-if="review.pros.length > 0">
        <h5 class="font-medium text-green-700 mb-2">👍 Voordelen</h5>
        <ul class="space-y-1">
          <li
            v-for="pro in review.pros"
            :key="pro"
            class="text-sm text-green-600 flex items-start"
          >
            <span class="mr-2">•</span>
            <span>{{ pro }}</span>
          </li>
        </ul>
      </div>

      <!-- Cons -->
      <div v-if="review.cons.length > 0">
        <h5 class="font-medium text-red-700 mb-2">👎 Nadelen</h5>
        <ul class="space-y-1">
          <li
            v-for="con in review.cons"
            :key="con"
            class="text-sm text-red-600 flex items-start"
          >
            <span class="mr-2">•</span>
            <span>{{ con }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- E-bike Info -->
    <div class="bg-gray-50 rounded-lg p-4 mb-4">
      <div class="flex items-center space-x-3">
        <div class="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
          <span class="text-2xl">🚲</span>
        </div>
        <div>
          <h5 class="font-medium text-gray-900">
            {{ review.ebike_brand }} {{ review.ebike_model }}
          </h5>
          <p class="text-sm text-gray-600">E-bike beoordeeld</p>
        </div>
      </div>
    </div>

    <!-- Review Footer -->
    <div class="flex items-center justify-between pt-4 border-t border-gray-200">
      <div class="flex items-center space-x-4">
        <button
          @click="handleMarkHelpful"
          :disabled="isHelpful"
          class="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            :class="isHelpful ? 'text-primary-600' : 'text-gray-400'"
            class="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.834a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"
            />
          </svg>
          <span class="text-sm font-medium">
            {{ isHelpful ? 'Behulpzaam!' : 'Behulpzaam' }}
            ({{ review.helpful_count }})
          </span>
        </button>
      </div>

      <div class="text-sm text-gray-500">
        Review #{{ review.id.slice(-6) }}
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom styles for review cards */
</style>
