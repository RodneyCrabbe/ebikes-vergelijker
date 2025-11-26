<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <Header />
    
    <main class="flex-1 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">
            E-Bike Reviews
          </h1>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Lees ervaringen van andere e-bike gebruikers en deel je eigen review
          </p>
        </div>

        <!-- Review Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div class="bg-white rounded-lg shadow-lg p-6 text-center">
            <div class="text-3xl font-bold text-blue-600 mb-2">4.8</div>
            <div class="text-gray-600">Gemiddelde beoordeling</div>
          </div>
          <div class="bg-white rounded-lg shadow-lg p-6 text-center">
            <div class="text-3xl font-bold text-blue-600 mb-2">1,247</div>
            <div class="text-gray-600">Totaal reviews</div>
          </div>
          <div class="bg-white rounded-lg shadow-lg p-6 text-center">
            <div class="text-3xl font-bold text-blue-600 mb-2">89%</div>
            <div class="text-gray-600">Aanbevelingspercentage</div>
          </div>
          <div class="bg-white rounded-lg shadow-lg p-6 text-center">
            <div class="text-3xl font-bold text-blue-600 mb-2">156</div>
            <div class="text-gray-600">E-bikes beoordeeld</div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Reviews List -->
          <div class="lg:col-span-2 space-y-6">
            <div class="flex justify-between items-center">
              <h2 class="text-2xl font-bold text-gray-900">Recente Reviews</h2>
              <select v-model="selectedFilter" class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="all">Alle reviews</option>
                <option value="5">5 sterren</option>
                <option value="4">4 sterren</option>
                <option value="3">3 sterren</option>
                <option value="2">2 sterren</option>
                <option value="1">1 ster</option>
              </select>
            </div>

            <div v-if="loading" class="space-y-4">
              <div v-for="n in 3" :key="n" class="bg-white rounded-lg shadow-lg p-6 animate-pulse">
                <div class="flex items-center mb-4">
                  <div class="w-10 h-10 bg-gray-300 rounded-full mr-4"></div>
                  <div class="flex-1">
                    <div class="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                    <div class="h-3 bg-gray-300 rounded w-1/6"></div>
                  </div>
                </div>
                <div class="space-y-2">
                  <div class="h-4 bg-gray-300 rounded w-full"></div>
                  <div class="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            </div>

            <div v-else class="space-y-6">
              <div
                v-for="review in filteredReviews"
                :key="review.id"
                class="bg-white rounded-lg shadow-lg p-6"
              >
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                      <span class="text-blue-600 font-semibold">{{ review.user.charAt(0) }}</span>
                    </div>
                    <div>
                      <div class="font-semibold text-gray-900">{{ review.user }}</div>
                      <div class="text-sm text-gray-500">{{ formatDate(review.date) }}</div>
                    </div>
                  </div>
                  <div class="flex items-center">
                    <div class="flex text-yellow-400">
                      <svg v-for="i in 5" :key="i" class="w-5 h-5" :class="i <= review.rating ? 'text-yellow-400' : 'text-gray-300'" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div class="mb-4">
                  <h3 class="font-semibold text-gray-900 mb-2">{{ review.ebike }}</h3>
                  <p class="text-gray-700">{{ review.comment }}</p>
                </div>
                
                <div class="flex items-center justify-between text-sm text-gray-500">
                  <div class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                    {{ review.likes }} vond dit nuttig
                  </div>
                  <button class="text-blue-600 hover:text-blue-800">Rapporteer</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Write Review Sidebar -->
          <div class="space-y-6">
            <div class="bg-white rounded-lg shadow-lg p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-4">Schrijf een Review</h3>
              
              <form @submit.prevent="handleSubmitReview" class="space-y-4">
                <div>
                  <label for="ebike" class="block text-sm font-medium text-gray-700 mb-2">
                    E-bike Model
                  </label>
                  <select
                    id="ebike"
                    v-model="reviewForm.ebike"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecteer e-bike</option>
                    <option v-for="ebike in ebikes" :key="ebike.id" :value="ebike.name">
                      {{ ebike.name }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Beoordeling
                  </label>
                  <div class="flex space-x-1">
                    <button
                      v-for="i in 5"
                      :key="i"
                      type="button"
                      @click="reviewForm.rating = i"
                      class="text-2xl focus:outline-none"
                      :class="i <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'"
                    >
                      ★
                    </button>
                  </div>
                </div>

                <div>
                  <label for="comment" class="block text-sm font-medium text-gray-700 mb-2">
                    Jouw ervaring
                  </label>
                  <textarea
                    id="comment"
                    v-model="reviewForm.comment"
                    rows="4"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Deel je ervaring met deze e-bike..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  :disabled="submitting"
                  class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ submitting ? 'Review plaatsen...' : 'Review Plaatsen' }}
                </button>
              </form>

              <div v-if="reviewError" class="mt-4 text-red-600 text-sm">
                {{ reviewError }}
              </div>
            </div>

            <!-- Popular E-bikes -->
            <div class="bg-white rounded-lg shadow-lg p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-4">Populaire E-bikes</h3>
              <div class="space-y-3">
                <div v-for="ebike in popularEbikes" :key="ebike.id" class="flex items-center">
                  <img :src="ebike.image" :alt="ebike.name" class="w-12 h-12 rounded-lg object-cover mr-3" />
                  <div class="flex-1">
                    <div class="font-medium text-gray-900">{{ ebike.name }}</div>
                    <div class="text-sm text-gray-500">{{ ebike.reviews }} reviews</div>
                  </div>
                  <div class="text-yellow-400">★★★★★</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import Header from '../components/common/Header.vue'
import Footer from '../components/common/Footer.vue'

const loading = ref(false)
const submitting = ref(false)
const reviewError = ref('')
const selectedFilter = ref('all')

const reviewForm = reactive({
  ebike: '',
  rating: 0,
  comment: ''
})

// Sample data - in a real app this would come from an API
const reviews = ref([
  {
    id: 1,
    user: 'Jan de Vries',
    date: new Date('2024-01-15'),
    rating: 5,
    ebike: 'Gazelle Ultimate C380 HMB',
    comment: 'Fantastische e-bike! Zeer comfortabel en betrouwbaar. De actieradius is precies zoals beloofd.',
    likes: 12
  },
  {
    id: 2,
    user: 'Maria Jansen',
    date: new Date('2024-01-10'),
    rating: 4,
    ebike: 'Trek Allant+ 7 Gen 2',
    comment: 'Goede e-bike voor dagelijks gebruik. De motor is krachtig en de batterij gaat lang mee.',
    likes: 8
  },
  {
    id: 3,
    user: 'Piet Bakker',
    date: new Date('2024-01-08'),
    rating: 5,
    ebike: 'Riese & Müller Charger4 GT',
    comment: 'Top kwaliteit! Prijzig maar het waard. Perfect voor lange ritten.',
    likes: 15
  },
  {
    id: 4,
    user: 'Lisa van der Berg',
    date: new Date('2024-01-05'),
    rating: 3,
    ebike: 'VanMoof S5',
    comment: 'Mooi design maar de app werkt niet altijd goed. Voor de rest tevreden.',
    likes: 3
  }
])

const ebikes = ref([
  { id: 1, name: 'Gazelle Ultimate C380 HMB' },
  { id: 2, name: 'Trek Allant+ 7 Gen 2' },
  { id: 3, name: 'Riese & Müller Charger4 GT' },
  { id: 4, name: 'VanMoof S5' },
  { id: 5, name: 'Cube Kathmandu Hybrid Pro 625' }
])

const popularEbikes = ref([
  { id: 1, name: 'Gazelle Ultimate C380 HMB', image: '/img/Gazelle Ultimate C380 HMB/20230372A00_Gazelle_Ultimate_C380_HMB_500Wh.avif', reviews: 45 },
  { id: 2, name: 'Trek Allant+ 7 Gen 2', image: '/img/Trek Allant+ 7 Gen 2/23_36560_A_Allant_7_Gen2_BL_Detail_Battery.jpeg', reviews: 32 },
  { id: 3, name: 'Riese & Müller Charger4 GT', image: '/img/Riese & Müller Charger4 GT/charger4_gt_touring_HS_front_side.jpg', reviews: 28 }
])

const filteredReviews = computed(() => {
  if (selectedFilter.value === 'all') {
    return reviews.value
  }
  return reviews.value.filter(review => review.rating === parseInt(selectedFilter.value))
})

const formatDate = (date: Date) => {
  return date.toLocaleDateString('nl-NL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const handleSubmitReview = async () => {
  if (!reviewForm.ebike || !reviewForm.rating || !reviewForm.comment) {
    reviewError.value = 'Vul alle velden in'
    return
  }

  submitting.value = true
  reviewError.value = ''

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Add new review
    const newReview = {
      id: reviews.value.length + 1,
      user: 'Anonieme gebruiker',
      date: new Date(),
      rating: reviewForm.rating,
      ebike: reviewForm.ebike,
      comment: reviewForm.comment,
      likes: 0
    }
    
    reviews.value.unshift(newReview)
    
    // Reset form
    Object.assign(reviewForm, {
      ebike: '',
      rating: 0,
      comment: ''
    })
  } catch (err) {
    reviewError.value = 'Er is een fout opgetreden bij het plaatsen van je review'
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loading.value = true
  // Simulate loading
  setTimeout(() => {
    loading.value = false
  }, 1000)
})
</script>