<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <Header />
    
    <main class="flex-1 py-8">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white rounded-lg shadow-lg p-8">
          <div class="flex items-center justify-between mb-8">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Dealer Portal</h1>
              <p class="text-gray-600 mt-1">Beheer je inventaris, leads en commissies</p>
            </div>
            <div class="flex items-center gap-4">
              <div class="text-right">
                <p class="text-sm text-gray-500">Welkom terug,</p>
                <p class="font-medium">{{ authStore.user?.name || 'Dealer' }}</p>
              </div>
              <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div v-if="!authStore.isAuthenticated" class="text-center py-12">
            <div class="text-gray-500 mb-4">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Toegang Geweigerd</h3>
            <p class="text-gray-500 mb-4">Je moet ingelogd zijn om de dealer portal te bekijken.</p>
            <RouterLink to="/login" class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Inloggen
            </RouterLink>
          </div>
          
          <div v-else>
            <!-- Dashboard Stats -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div class="bg-blue-50 rounded-lg p-6">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <svg class="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-blue-600">Totaal E-bikes</p>
                    <p class="text-2xl font-semibold text-gray-900">24</p>
                  </div>
                </div>
              </div>
              
              <div class="bg-green-50 rounded-lg p-6">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-green-600">Actieve Leads</p>
                    <p class="text-2xl font-semibold text-gray-900">12</p>
                  </div>
                </div>
              </div>
              
              <div class="bg-yellow-50 rounded-lg p-6">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <svg class="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                    </svg>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-yellow-600">Maandelijkse Omzet</p>
                    <p class="text-2xl font-semibold text-gray-900">€45,230</p>
                  </div>
                </div>
              </div>
              
              <div class="bg-purple-50 rounded-lg p-6">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <svg class="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-purple-600">Commissies</p>
                    <p class="text-2xl font-semibold text-gray-900">€2,340</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div class="flex items-center mb-4">
                  <svg class="h-8 w-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                  <h3 class="text-lg font-semibold text-gray-900">Inventaris Beheren</h3>
                </div>
                <p class="text-gray-600 mb-4">Beheer je e-bike voorraad en voeg nieuwe modellen toe.</p>
                <button class="text-blue-600 hover:text-blue-800 font-medium">Bekijk Inventaris →</button>
              </div>
              
              <div class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div class="flex items-center mb-4">
                  <svg class="h-8 w-8 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                  <h3 class="text-lg font-semibold text-gray-900">Leads Beheren</h3>
                </div>
                <p class="text-gray-600 mb-4">Bekijk en beheer potentiële klanten en hun aanvragen.</p>
                <button class="text-green-600 hover:text-green-800 font-medium">Bekijk Leads →</button>
              </div>
              
              <div class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div class="flex items-center mb-4">
                  <svg class="h-8 w-8 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                  <h3 class="text-lg font-semibold text-gray-900">Analytics</h3>
                </div>
                <p class="text-gray-600 mb-4">Bekijk je verkoopstatistieken en prestaties.</p>
                <button class="text-yellow-600 hover:text-yellow-800 font-medium">Bekijk Analytics →</button>
              </div>
            </div>

            <!-- Recent Activity -->
            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Recente Activiteit</h3>
              <div class="space-y-4">
                <div class="flex items-center justify-between py-3 border-b border-gray-100">
                  <div class="flex items-center">
                    <div class="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span class="text-sm text-gray-900">Nieuwe lead: Jan de Vries</span>
                  </div>
                  <span class="text-xs text-gray-500">2 uur geleden</span>
                </div>
                <div class="flex items-center justify-between py-3 border-b border-gray-100">
                  <div class="flex items-center">
                    <div class="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span class="text-sm text-gray-900">E-bike verkocht: Gazelle Ultimate C380</span>
                  </div>
                  <span class="text-xs text-gray-500">1 dag geleden</span>
                </div>
                <div class="flex items-center justify-between py-3 border-b border-gray-100">
                  <div class="flex items-center">
                    <div class="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                    <span class="text-sm text-gray-900">Nieuwe voorraad ontvangen</span>
                  </div>
                  <span class="text-xs text-gray-500">3 dagen geleden</span>
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
import { useAuthStore } from '../stores/auth'
import Header from '../components/common/Header.vue'
import Footer from '../components/common/Footer.vue'

const authStore = useAuthStore()
</script>
