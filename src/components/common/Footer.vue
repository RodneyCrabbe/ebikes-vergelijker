<template>
  <footer class="bg-white text-gray-900 mt-16 border-t border-gray-200">
    <div class="w-full px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Company Info -->
        <div class="lg:col-span-1">
          <div class="flex items-center mb-6">
            <div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
              <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-blue-600">E-Bike Vergelijker</h3>
          </div>
          <p class="text-gray-600 mb-6 leading-relaxed">
            Vergelijk de beste e-bikes van Nederland en vind jouw perfecte fiets. 
            Met onze AI-powered aanbevelingen vind je altijd de beste deal.
          </p>
          
          <!-- Social Media -->
          <div class="space-y-4">
            <h4 class="font-semibold text-blue-600 text-lg">Volg ons</h4>
            <div class="flex space-x-4">
              <a href="https://facebook.com/ebikevergelijker" target="_blank" rel="noopener noreferrer"
                 title="Volg ons op Facebook"
                 aria-label="Volg ons op Facebook"
                 class="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://instagram.com/ebikevergelijker" target="_blank" rel="noopener noreferrer"
                 title="Volg ons op Instagram"
                 aria-label="Volg ons op Instagram"
                 class="w-10 h-10 bg-pink-600 hover:bg-pink-700 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.807-.875-1.297-2.026-1.297-3.323s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323z"/>
                </svg>
              </a>
              <a href="https://twitter.com/ebikevergelijker" target="_blank" rel="noopener noreferrer"
                 title="Volg ons op Twitter"
                 aria-label="Volg ons op Twitter"
                 class="w-10 h-10 bg-blue-400 hover:bg-blue-500 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="https://youtube.com/@ebikevergelijker" target="_blank" rel="noopener noreferrer"
                 title="Bekijk onze YouTube kanaal"
                 aria-label="Bekijk onze YouTube kanaal"
                 class="w-10 h-10 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <div>
          <h4 class="font-bold text-blue-600 text-lg mb-6 flex items-center">
            <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
            Navigatie
          </h4>
          <ul class="space-y-3">
            <li>
              <RouterLink to="/e-bikes" class="text-gray-700 hover:text-blue-600 transition-colors duration-300 flex items-center group">
                <svg class="w-4 h-4 mr-2 text-gray-500 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
                E-Bikes
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/vergelijk" class="text-gray-700 hover:text-blue-600 transition-colors duration-300 flex items-center group">
                <svg class="w-4 h-4 mr-2 text-gray-500 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                Vergelijken
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/reviews" class="text-gray-700 hover:text-blue-600 transition-colors duration-300 flex items-center group">
                <svg class="w-4 h-4 mr-2 text-gray-500 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                </svg>
                Reviews
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/afspraak" class="text-gray-700 hover:text-blue-600 transition-colors duration-300 flex items-center group">
                <svg class="w-4 h-4 mr-2 text-gray-500 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                Afspraak Maken
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Information -->
        <div>
          <h4 class="font-bold text-blue-600 text-lg mb-6 flex items-center">
            <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Informatie
          </h4>
          <ul class="space-y-3">
            <li>
              <RouterLink to="/over-ons" class="text-gray-700 hover:text-blue-600 transition-colors duration-300 flex items-center group">
                <svg class="w-4 h-4 mr-2 text-gray-500 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                Over Ons
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/contact" class="text-gray-700 hover:text-blue-600 transition-colors duration-300 flex items-center group">
                <svg class="w-4 h-4 mr-2 text-gray-500 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                Contact
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/privacy-policy" class="text-gray-700 hover:text-blue-600 transition-colors duration-300 flex items-center group">
                <svg class="w-4 h-4 mr-2 text-gray-500 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
                Privacy Policy
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/disclaimer" class="text-gray-700 hover:text-blue-600 transition-colors duration-300 flex items-center group">
                <svg class="w-4 h-4 mr-2 text-gray-500 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Disclaimer
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Newsletter Subscription -->
        <div>
          <h4 class="font-bold text-blue-600 text-lg mb-6 flex items-center">
            <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            Nieuwsbrief
          </h4>
          <p class="text-gray-600 mb-6 leading-relaxed">
            Ontvang de laatste e-bike nieuwtjes, exclusieve aanbiedingen en tips direct in je inbox.
          </p>
          
          <!-- Email Subscription Form -->
          <form @submit.prevent="subscribeToNewsletter" class="space-y-4">
            <div class="relative">
              <input
                v-model="email"
                type="email"
                placeholder="Je e-mailadres"
                required
                class="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
              <svg class="absolute right-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
              </svg>
            </div>
            <button
              type="submit"
              :disabled="isSubscribing"
              class="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
            >
              <svg v-if="isSubscribing" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
              {{ isSubscribing ? 'Aanmelden...' : 'Aanmelden' }}
            </button>
          </form>
          
          <!-- Success/Error Messages -->
          <div v-if="subscriptionMessage" class="mt-4 p-3 rounded-lg" :class="subscriptionSuccess ? 'bg-green-500/20 text-green-200 border border-green-500/30' : 'bg-red-500/20 text-red-200 border border-red-500/30'">
            {{ subscriptionMessage }}
          </div>
          
          <!-- Trust Indicators -->
          <div class="mt-6 space-y-2">
            <div class="flex items-center text-sm text-gray-600">
              <svg class="w-4 h-4 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              Geen spam, alleen waardevolle content
            </div>
            <div class="flex items-center text-sm text-gray-600">
              <svg class="w-4 h-4 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              Uitschrijven kan altijd
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Section -->
      <div class="border-t border-gray-200 mt-12 pt-8">
        <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div class="text-center md:text-left">
            <p class="text-gray-900 text-lg font-medium">
              &copy; {{ new Date().getFullYear() }} E-Bike Vergelijker. Alle rechten voorbehouden.
            </p>
            <p class="text-gray-600 text-sm mt-2">
              Affiliate disclaimer: Deze website bevat affiliate links. Wij ontvangen mogelijk een vergoeding bij aankoop.
            </p>
          </div>
          
          <!-- Additional Links -->
          <div class="flex space-x-6 text-sm">
            <RouterLink to="/algemene-voorwaarden" class="text-gray-600 hover:text-blue-600 transition-colors duration-300">Algemene Voorwaarden</RouterLink>
            <RouterLink to="/cookie-policy" class="text-gray-600 hover:text-blue-600 transition-colors duration-300">Cookie Policy</RouterLink>
            <RouterLink to="/sitemap" class="text-gray-600 hover:text-blue-600 transition-colors duration-300">Sitemap</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()

// Newsletter subscription state
const email = ref('')
const isSubscribing = ref(false)
const subscriptionMessage = ref('')
const subscriptionSuccess = ref(false)

// Newsletter subscription function
const subscribeToNewsletter = async () => {
  if (!email.value) return
  
  isSubscribing.value = true
  subscriptionMessage.value = ''
  
  try {
    // Simulate API call - replace with actual newsletter service
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // For now, just show success message
    subscriptionSuccess.value = true
    subscriptionMessage.value = 'Bedankt! Je bent succesvol aangemeld voor onze nieuwsbrief.'
    email.value = ''
    
    // Clear message after 5 seconds
    setTimeout(() => {
      subscriptionMessage.value = ''
    }, 5000)
    
  } catch (error) {
    subscriptionSuccess.value = false
    subscriptionMessage.value = 'Er is een fout opgetreden. Probeer het later opnieuw.'
  } finally {
    isSubscribing.value = false
  }
}
</script>
