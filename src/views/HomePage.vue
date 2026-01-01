<script setup lang="ts">
import { onMounted, ref, computed, defineAsyncComponent } from 'vue'
import { useEBikesStore } from '../stores/ebikes-simple'
import { useScrollAnimations, useParallax } from '../composables/useScrollAnimations'
import Header from '../components/common/Header.vue'
import Footer from '../components/common/Footer.vue'
import LazyImage from '../components/LazyImage.vue'
import EBikeSkeleton from '../components/EBikeSkeleton.vue'

// Lazy load AI Chatbot only when needed
const EnhancedAIChatbot = defineAsyncComponent(() => import('../components/EnhancedAIChatbot.vue'))

const ebikeStore = useEBikesStore()
const currentSlide = ref(0)

// Make featuredEBikes reactive to store changes
const featuredEBikes = computed(() => ebikeStore.ebikes.slice(0, 6))

// Hero image
const heroImage = ref({
  src: '/src/img/Aventon/Level2-Traditional-Glacier-02.avif',
  title: 'Vind de Perfecte E-Bike',
  subtitle: 'Vergelijk honderden e-bikes en vind de beste deal',
  cta: 'Ontdek E-Bikes'
})

useScrollAnimations()
useParallax()

// Data is already loaded in App.vue, no need to fetch again

const handleAffiliateClick = async (ebike: any) => {
  await ebikeStore.trackLead(ebike.id)
  window.open(ebike.affiliate_url, '_blank')
}

// Removed carousel functions as we now have a single hero image
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 flex flex-col overflow-hidden">
    <Header />


    <main class="flex-1">
      <!-- Hero Image Background -->
      <section class="relative h-screen overflow-hidden">
        <!-- Background Image -->
        <div 
          class="absolute inset-0 bg-cover bg-center bg-no-repeat"
          :style="`background-image: url('${heroImage.src}')`"
        ></div>
        
        <!-- Overlay -->
        <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/20"></div>
        
        <!-- Floating Elements -->
        <div class="absolute top-20 left-20 w-32 h-32 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
        <div class="absolute bottom-20 right-20 w-24 h-24 bg-purple-500/20 rounded-full blur-xl animate-pulse" style="animation-delay: 2s;"></div>
        <div class="absolute top-1/2 left-1/4 w-16 h-16 bg-indigo-500/20 rounded-full blur-xl animate-pulse" style="animation-delay: 4s;"></div>
        
        <!-- Content Overlay -->
        <div class="relative z-10 h-full flex items-center">
          <div class="w-full px-6">
            <div class="text-center text-white">
              <div class="space-y-8">
                <div class="space-y-6">
                  <h1 class="text-6xl lg:text-8xl font-bold leading-tight">
                    {{ heroImage.title }}
                  </h1>
                  <p class="text-2xl lg:text-3xl text-blue-100 font-light leading-relaxed max-w-4xl mx-auto">
                    {{ heroImage.subtitle }}
                  </p>
                </div>
                
                <!-- Key Features -->
                <div class="flex flex-wrap justify-center gap-4">
                  <span class="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-sm font-medium border border-white/30">
                    🔍 500+ E-Bikes Vergelijken
                  </span>
                  <span class="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-sm font-medium border border-white/30">
                    ⭐ Echte Reviews & Ratings
                  </span>
                  <span class="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-sm font-medium border border-white/30">
                    🤖 AI-Powered Aanbevelingen
                  </span>
                </div>
                
                <!-- CTA Buttons -->
                <div class="flex flex-col sm:flex-row gap-6 justify-center">
                  <RouterLink
                    to="/e-bikes"
                    class="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl font-bold text-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl inline-flex items-center justify-center group"
                  >
                    {{ heroImage.cta }}
                    <svg class="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </RouterLink>
                  <RouterLink
                    to="/vergelijk"
                    class="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-10 py-5 rounded-2xl font-bold text-xl transition-all duration-300 border border-white/30 inline-flex items-center justify-center group"
                  >
                    Start Vergelijking
                    <svg class="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </RouterLink>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Scroll Indicator -->
        <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg class="w-8 h-8 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </section>

      <!-- Modern Features Section -->
      <section class="py-24 bg-gradient-to-b from-white to-gray-50">
        <div class="container mx-auto px-6 max-w-7xl">
          <div class="text-center mb-20">
            <h2 class="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Waarom E-Bike Vergelijker?
            </h2>
            <p class="text-xl text-gray-600 max-w-3xl mx-auto">
              De modernste platform voor het vergelijken van e-bikes in Nederland
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <!-- Feature 1 -->
            <div class="group text-center p-8 rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div class="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-gray-900 mb-4">Uitgebreid Zoeken</h3>
              <p class="text-gray-600 leading-relaxed">
                Filter op prijs, merk, actieradius, en meer om exact te vinden wat je zoekt met AI-assistentie.
              </p>
            </div>

            <!-- Feature 2 -->
            <div class="group text-center p-8 rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div class="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-gray-900 mb-4">Vergelijk tot 4 E-Bikes</h3>
              <p class="text-gray-600 leading-relaxed">
                Bekijk specificaties naast elkaar met visual indicators voor de beste keuze.
              </p>
            </div>

            <!-- Feature 3 -->
            <div class="group text-center p-8 rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div class="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-gray-900 mb-4">Echte Reviews</h3>
              <p class="text-gray-600 leading-relaxed">
                Lees betrouwbare reviews met AI sentiment analysis van echte gebruikers.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Featured E-Bikes Section -->
      <section class="py-24 bg-gray-50">
        <div class="w-full px-6">
          <div class="text-center mb-20">
            <h2 class="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Uitgelichte E-Bikes
            </h2>
            <p class="text-xl text-gray-600">
              De meest populaire modellen van dit moment
            </p>
          </div>

          <div v-if="ebikeStore.loading">
            <EBikeSkeleton :count="6" />
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            <div
              v-for="(ebike, index) in featuredEBikes"
              :key="ebike.id"
              class="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
            >
              <!-- Image Container -->
              <div class="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                <LazyImage
                  v-if="ebike.image_url"
                  :src="ebike.image_url"
                  :alt="ebike.model_name"
                  height="256px"
                  img-class="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div v-else class="h-full flex items-center justify-center text-gray-400 text-lg">
                  Geen afbeelding
                </div>
                
                <!-- Brand Badge -->
                <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-gray-800">
                  {{ ebike.brand }}
                </div>
                
                <!-- Price Badge -->
                <div class="absolute bottom-4 left-4 bg-green-500 text-white px-4 py-2 rounded-full text-lg font-bold">
                  <span v-if="ebike.price && ebike.price > 0">€{{ ebike.price.toLocaleString() }}</span>
                  <span v-else>Prijs op aanvraag</span>
                </div>
              </div>

              <!-- Content -->
              <div class="p-8">
                <h3 class="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {{ ebike.model_name }}
                </h3>

                <!-- Features -->
                <div class="space-y-3 mb-6">
                  <div v-if="ebike.action_radius_km" class="flex items-center text-gray-600">
                    <svg class="w-5 h-5 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span>{{ ebike.action_radius_km }}km bereik</span>
                  </div>
                  <div v-if="ebike.battery_capacity" class="flex items-center text-gray-600">
                    <svg class="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>{{ ebike.battery_capacity }}Wh accu</span>
                  </div>
                  <div v-if="ebike.top_speed_kmh" class="flex items-center text-gray-600">
                    <svg class="w-5 h-5 mr-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                    <span>{{ ebike.top_speed_kmh }}km/h topsnelheid</span>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex gap-3">
                  <RouterLink
                    :to="`/e-bikes/${ebike.id}`"
                    class="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                  >
                    Details
                  </RouterLink>
                  <button
                    @click="handleAffiliateClick(ebike)"
                    class="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                  >
                    Bekijk Deal
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- View All Button -->
          <div class="text-center mt-16">
            <RouterLink 
              to="/e-bikes" 
              class="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Bekijk Alle E-Bikes
              <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </RouterLink>
          </div>
        </div>
      </section>

      <!-- Stats Section -->
      <section class="py-24 bg-white">
        <div class="container mx-auto px-6 max-w-7xl">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div class="text-center">
              <div class="text-4xl lg:text-5xl font-bold text-blue-600 mb-2">500+</div>
              <div class="text-gray-600 font-medium">E-Bikes Vergelijken</div>
            </div>
            <div class="text-center">
              <div class="text-4xl lg:text-5xl font-bold text-green-600 mb-2">10K+</div>
              <div class="text-gray-600 font-medium">Tevreden Gebruikers</div>
            </div>
            <div class="text-center">
              <div class="text-4xl lg:text-5xl font-bold text-purple-600 mb-2">50K+</div>
              <div class="text-gray-600 font-medium">Reviews & Ratings</div>
            </div>
            <div class="text-center">
              <div class="text-4xl lg:text-5xl font-bold text-orange-600 mb-2">24/7</div>
              <div class="text-gray-600 font-medium">AI Ondersteuning</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Testimonials Section -->
      <section class="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div class="container mx-auto px-6 max-w-7xl">
          <div class="text-center mb-20">
            <h2 class="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Wat Onze Gebruikers Zeggen
            </h2>
            <p class="text-xl text-gray-600">
              Echte ervaringen van e-bike liefhebbers
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Testimonial 1 -->
            <div class="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300">
              <div class="flex items-center mb-6">
                <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  J
                </div>
                <div class="ml-4">
                  <div class="font-semibold text-gray-900">John Doe</div>
                  <div class="text-gray-600 text-sm">Aventon Level.2 eigenaar</div>
                </div>
              </div>
              <div class="text-yellow-500 mb-4">
                ⭐⭐⭐⭐⭐
              </div>
              <p class="text-gray-700 leading-relaxed">
                "Fantastische service! Dankzij de vergelijker heb ik de perfecte e-bike gevonden voor mijn dagelijkse woon-werkverkeer. De AI-aanbevelingen waren spot on!"
              </p>
            </div>

            <!-- Testimonial 2 -->
            <div class="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300">
              <div class="flex items-center mb-6">
                <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  S
                </div>
                <div class="ml-4">
                  <div class="font-semibold text-gray-900">Sarah Smith</div>
                  <div class="text-gray-600 text-sm">Lectric XP 3.0 eigenaar</div>
                </div>
              </div>
              <div class="text-yellow-500 mb-4">
                ⭐⭐⭐⭐⭐
              </div>
              <p class="text-gray-700 leading-relaxed">
                "De vouwbare e-bike vergelijker heeft me geholpen om de beste keuze te maken. De reviews waren super behulpzaam en de interface is gebruiksvriendelijk."
              </p>
            </div>

            <!-- Testimonial 3 -->
            <div class="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300">
              <div class="flex items-center mb-6">
                <div class="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  M
                </div>
                <div class="ml-4">
                  <div class="font-semibold text-gray-900">Mike Johnson</div>
                  <div class="text-gray-600 text-sm">Trek Allant+ eigenaar</div>
                </div>
              </div>
              <div class="text-yellow-500 mb-4">
                ⭐⭐⭐⭐⭐
              </div>
              <p class="text-gray-700 leading-relaxed">
                "Uitstekende vergelijkingstool! Ik kon alle specificaties naast elkaar zien en de AI-chatbot gaf me perfecte adviezen. Zeker een aanrader!"
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Modern CTA Section -->
      <section class="py-24 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white relative overflow-hidden">
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-20">
          <div class="absolute inset-0" style="background-image: radial-gradient(circle at 20% 20%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 80% 80%, #8b5cf6 0%, transparent 50%);"></div>
        </div>
        
        <!-- Floating Elements -->
        <div class="absolute top-20 left-20 w-32 h-32 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
        <div class="absolute bottom-20 right-20 w-24 h-24 bg-purple-500/20 rounded-full blur-xl animate-pulse" style="animation-delay: 2s;"></div>
        <div class="absolute top-1/2 left-1/4 w-16 h-16 bg-indigo-500/20 rounded-full blur-xl animate-pulse" style="animation-delay: 4s;"></div>

        <div class="container mx-auto px-6 text-center relative z-10 max-w-4xl">
          <h2 class="text-5xl lg:text-6xl font-bold mb-8 leading-tight">
            Klaar om jouw Droomfiets te Vinden?
          </h2>
          <p class="text-xl lg:text-2xl mb-12 text-blue-100 leading-relaxed">
            Maak een account aan en bewaar je favoriete e-bikes, vergelijkingen en ontvang persoonlijke aanbevelingen.
          </p>
          
          <div class="flex flex-col sm:flex-row gap-6 justify-center">
            <RouterLink
              to="/registreer"
              class="bg-white text-blue-900 px-12 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 hover:shadow-2xl hover:scale-105 transition-all duration-300 inline-flex items-center justify-center"
            >
              Gratis Registreren
              <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </RouterLink>
            <RouterLink
              to="/e-bikes"
              class="bg-white/20 backdrop-blur-sm text-white px-12 py-4 rounded-xl font-bold text-lg hover:bg-white/30 hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-white/30 inline-flex items-center justify-center"
            >
              Ontdek E-Bikes
            </RouterLink>
          </div>
        </div>
      </section>
    </main>

    <Footer />
    
    <!-- Enhanced AI Chatbot -->
    <EnhancedAIChatbot />
  </div>
</template>

<style scoped>
/* Additional component-specific animations */
@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}
</style>

