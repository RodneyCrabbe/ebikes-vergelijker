<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <Header />
    
    <main class="flex-1 py-8">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white rounded-lg shadow-lg p-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-6">Mijn Profiel</h1>
          
          <div v-if="!authStore.isAuthenticated" class="text-center py-12">
            <div class="text-gray-500 mb-4">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Niet ingelogd</h3>
            <p class="text-gray-500 mb-4">Je moet ingelogd zijn om je profiel te bekijken.</p>
            <RouterLink to="/login" class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Inloggen
            </RouterLink>
          </div>
          
          <div v-else class="space-y-6">
            <!-- User Info -->
            <div class="border-b border-gray-200 pb-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">Persoonlijke Informatie</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Naam</label>
                  <p class="mt-1 text-sm text-gray-900">{{ authStore.user?.name || 'Niet opgegeven' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">E-mailadres</label>
                  <p class="mt-1 text-sm text-gray-900">{{ authStore.user?.email || 'Niet opgegeven' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Lid sinds</label>
                  <p class="mt-1 text-sm text-gray-900">{{ formatDate(authStore.user?.created_at) }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Status</label>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Actief
                  </span>
                </div>
              </div>
            </div>
            
            <!-- Quick Actions -->
            <div class="border-b border-gray-200 pb-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">Snelle Acties</h2>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <RouterLink to="/e-bikes" class="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <svg class="h-8 w-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                  <div>
                    <h3 class="font-medium text-gray-900">E-bikes Bekijken</h3>
                    <p class="text-sm text-gray-500">Ontdek nieuwe e-bikes</p>
                  </div>
                </RouterLink>
                
                <RouterLink to="/vergelijk" class="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <svg class="h-8 w-8 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                  <div>
                    <h3 class="font-medium text-gray-900">E-bikes Vergelijken</h3>
                    <p class="text-sm text-gray-500">Vergelijk je favoriete e-bikes</p>
                  </div>
                </RouterLink>
                
                <RouterLink to="/afspraak" class="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                  <svg class="h-8 w-8 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <div>
                    <h3 class="font-medium text-gray-900">Afspraak Maken</h3>
                    <p class="text-sm text-gray-500">Plan een proefrit</p>
                  </div>
                </RouterLink>
              </div>
            </div>
            
            <!-- Account Actions -->
            <div>
              <h2 class="text-xl font-semibold text-gray-900 mb-4">Account</h2>
              <div class="space-y-3">
                <button 
                  @click="handleLogout"
                  class="w-full md:w-auto px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Uitloggen
                </button>
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
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import Header from '../components/common/Header.vue'
import Footer from '../components/common/Footer.vue'

const authStore = useAuthStore()
const router = useRouter()

const formatDate = (dateString?: string) => {
  if (!dateString) return 'Onbekend'
  return new Date(dateString).toLocaleDateString('nl-NL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const handleLogout = async () => {
  try {
    await authStore.logout()
    await router.push('/')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>
