<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useRouter, useRoute } from 'vue-router'
import NotificationCenter from '../NotificationCenter.vue'
import { topicalPages } from '../../data/topicalPages'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)
const isEbikeSubmenuOpen = ref(false)
const searchQuery = ref('')
const allTopicalLinks = computed(() => topicalPages)

const handleLogout = async () => {
  try {
    await authStore.logout()
    // Force navigation to home page
    await router.push('/')
    closeMobileMenu()
  } catch (error) {
    console.error('Logout error:', error)
    // Still navigate to home page even if logout fails
    await router.push('/')
    closeMobileMenu()
  }
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 100
}

// Check if we're on the home page
const isHomePage = computed(() => route.path === '/')

const toggleMobileMenu = () => {
  console.log('Toggle mobile menu clicked, current state:', isMobileMenuOpen.value)
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  console.log('New state:', isMobileMenuOpen.value)
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
  isEbikeSubmenuOpen.value = false
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    // Navigate to e-bikes page with search query
    router.push({
      path: '/e-bikes',
      query: { search: searchQuery.value.trim() }
    })
    closeMobileMenu()
  }
}

// Close mobile menu when route changes
const handleRouteChange = () => {
  closeMobileMenu()
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  router.afterEach(handleRouteChange)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header 
    :class="[
      'fixed top-0 left-0 right-0 z-[1000] transition-all duration-300',
      isHomePage 
        ? (isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent')
        : 'bg-white/95 backdrop-blur-md shadow-lg'
    ]"
    style="z-index: 1000 !important;"
  >
    <nav class="w-full px-4 sm:px-6 py-4">
      <div class="flex items-center justify-between">
        <!-- Left side: Hamburger Menu + Logo -->
        <div class="flex items-center space-x-4">
          <!-- Hamburger Menu Button -->
          <button
            @click="toggleMobileMenu"
            :class="[
              'p-2 rounded-lg transition-all duration-300 hover:bg-white/20 backdrop-blur-sm border-2 border-transparent hover:border-blue-500',
              isHomePage
                ? (isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white')
                : 'text-gray-700 hover:bg-gray-100'
            ]"
            aria-label="Toggle menu"
            style="cursor: pointer;"
          >
            <svg 
              class="w-6 h-6 transition-transform duration-300"
              :class="{ 'rotate-90': isMobileMenuOpen }"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>

          <!-- Logo -->
          <RouterLink
            to="/"
            :class="[
              'text-xl sm:text-2xl font-display font-bold hover:scale-105 transition-all duration-300',
              isHomePage
                ? (isScrolled ? 'text-blue-600' : 'text-white')
                : 'text-blue-600'
            ]"
          >
            E-Bike Vergelijker
          </RouterLink>
        </div>

        <!-- Center: Search Bar -->
        <div class="flex-1 max-w-md mx-4">
          <div class="relative">
            <input
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              type="text"
              placeholder="Zoek e-bikes..."
              :class="[
                'w-full pl-10 pr-4 py-2 rounded-full border-0 transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:outline-none',
                isHomePage
                  ? (isScrolled 
                      ? 'bg-gray-100 text-gray-900 placeholder-gray-500' 
                      : 'bg-white/20 text-white placeholder-white/70 backdrop-blur-sm border border-white/30')
                  : 'bg-gray-100 text-gray-900 placeholder-gray-500'
              ]"
            />
            <svg 
              :class="[
                'absolute left-3 top-2.5 w-4 h-4 transition-colors duration-300',
                isHomePage
                  ? (isScrolled ? 'text-gray-400' : 'text-white/70')
                  : 'text-gray-400'
              ]" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>

        <!-- Right side: Auth Buttons -->
        <div class="flex items-center space-x-3">
          <template v-if="authStore.isAuthenticated">
            <RouterLink
              to="/profiel"
              :class="[
                'hidden sm:flex items-center px-3 py-2 rounded-full text-sm font-medium transition-all duration-300',
                isHomePage
                  ? (isScrolled 
                      ? 'text-gray-700 hover:bg-gray-100' 
                      : 'text-white hover:bg-white/20 backdrop-blur-sm')
                  : 'text-gray-700 hover:bg-gray-100'
              ]"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              Profiel
            </RouterLink>
            <button 
              @click="handleLogout" 
              :class="[
                'px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300',
                isHomePage
                  ? (isScrolled 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border border-white/30')
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              ]"
            >
              Uitloggen
            </button>
          </template>
          <template v-else>
            <RouterLink
              to="/login"
              :class="[
                'hidden sm:flex items-center px-3 py-2 rounded-full text-sm font-medium transition-all duration-300',
                isHomePage
                  ? (isScrolled 
                      ? 'text-gray-700 hover:bg-gray-100' 
                      : 'text-white hover:bg-white/20 backdrop-blur-sm')
                  : 'text-gray-700 hover:bg-gray-100'
              ]"
            >
              Inloggen
            </RouterLink>
            <RouterLink 
              to="/registreer" 
              :class="[
                'px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300',
                isHomePage
                  ? (isScrolled 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border border-white/30')
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              ]"
            >
              Registreren
            </RouterLink>
          </template>
        </div>
      </div>
    </nav>

  </header>

  <!-- Mobile Menu Overlay -->
  <div 
    v-if="isMobileMenuOpen"
    class="fixed inset-0 z-[99999]"
    @click="closeMobileMenu"
    style="z-index: 99999 !important; background-color: rgba(0,0,0,0.5);"
  >
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
    
    <!-- Mobile Menu Panel -->
    <div 
      class="absolute top-0 left-0 h-full w-full max-w-sm bg-white/95 backdrop-blur-md shadow-2xl transform transition-transform duration-300 ease-in-out z-[100000] overflow-hidden"
      @click.stop
    >
      <div class="flex flex-col h-full">
        <!-- Mobile Menu Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200/50">
          <h2 class="text-xl font-bold text-gray-900">Menu</h2>
          <button
            @click="closeMobileMenu"
            class="p-2 rounded-lg text-gray-500 hover:bg-gray-100/50 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Search Section -->
        <div class="p-6 border-b border-gray-200/50">
          <div class="relative">
            <input
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              type="text"
              placeholder="Zoek e-bikes..."
              class="w-full pl-10 pr-4 py-3 border border-gray-300/50 rounded-full bg-gray-50/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-300"
            />
            <svg class="absolute left-3 top-3.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>

        <!-- Navigation Links -->
        <div class="flex-1 overflow-y-auto">
          <nav class="p-6 space-y-2">
            <button
              type="button"
              @click="isEbikeSubmenuOpen = !isEbikeSubmenuOpen"
              class="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-blue-50/50 hover:text-blue-600 rounded-xl transition-all duration-300 group backdrop-blur-sm"
            >
              <svg class="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
              </svg>
              E-Bikes
              <svg
                class="w-4 h-4 ml-auto text-gray-400 group-hover:text-blue-500 transition-transform"
                :class="isEbikeSubmenuOpen ? 'rotate-180' : ''"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div v-if="isEbikeSubmenuOpen" class="pl-12 space-y-2">
              <RouterLink
                to="/e-bikes"
                @click="closeMobileMenu"
                class="flex items-center px-3 py-2 text-gray-700 hover:bg-blue-50/70 hover:text-blue-600 rounded-lg transition-all duration-300"
              >
                <span class="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></span>
                Alle e-bikes
              </RouterLink>
              <RouterLink
                v-for="link in allTopicalLinks"
                :key="link.slug"
                :to="link.slug"
                @click="closeMobileMenu"
                class="flex items-center px-3 py-2 text-gray-700 hover:bg-blue-50/70 hover:text-blue-600 rounded-lg transition-all duration-300"
              >
                <span class="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></span>
                {{ link.title }}
            </RouterLink>
            </div>
            
            <RouterLink
              to="/vergelijk"
              @click="closeMobileMenu"
              class="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50/50 hover:text-blue-600 rounded-xl transition-all duration-300 group backdrop-blur-sm"
            >
              <svg class="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              Vergelijken
            </RouterLink>
            
            <RouterLink
              to="/reviews"
              @click="closeMobileMenu"
              class="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50/50 hover:text-blue-600 rounded-xl transition-all duration-300 group backdrop-blur-sm"
            >
              <svg class="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
              </svg>
              Reviews
            </RouterLink>
            
            <RouterLink
              to="/afspraak"
              @click="closeMobileMenu"
              class="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50/50 hover:text-blue-600 rounded-xl transition-all duration-300 group backdrop-blur-sm"
            >
              <svg class="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              Afspraak
            </RouterLink>
            
            <RouterLink
              to="/over-ons"
              @click="closeMobileMenu"
              class="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50/50 hover:text-blue-600 rounded-xl transition-all duration-300 group backdrop-blur-sm"
            >
              <svg class="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              Over Ons
            </RouterLink>
            
            <RouterLink
              to="/contact"
              @click="closeMobileMenu"
              class="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50/50 hover:text-blue-600 rounded-xl transition-all duration-300 group backdrop-blur-sm"
            >
              <svg class="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              Contact
            </RouterLink>

            <div class="pt-4 border-t border-gray-200/60">
              <p class="text-xs font-semibold text-gray-500 mb-2">Topical pages</p>
              <div class="flex flex-col space-y-2">
                <RouterLink
                  v-for="link in allTopicalLinks"
                  :key="link.slug"
                  :to="link.slug"
                  @click="closeMobileMenu"
                  class="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50/50 hover:text-blue-600 rounded-xl transition-all duration-300 group backdrop-blur-sm"
                >
                  <svg class="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                  {{ link.title }}
                </RouterLink>
              </div>
            </div>
          </nav>
        </div>

        <!-- Social Media Icons -->
        <div class="p-6 border-t border-gray-200/50">
          <h3 class="text-sm font-semibold text-gray-500 mb-4">Volg ons</h3>
          <div class="flex flex-wrap gap-3">
            <!-- TikTok -->
            <a href="#" class="p-2 rounded-lg bg-black/10 text-black hover:bg-black hover:text-white transition-all duration-300">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </a>
            <!-- Instagram -->
            <a href="#" class="p-2 rounded-lg bg-pink-500/10 text-pink-500 hover:bg-pink-500 hover:text-white transition-all duration-300">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <!-- Facebook -->
            <a href="#" class="p-2 rounded-lg bg-blue-600/10 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <!-- Snapchat -->
            <a href="#" class="p-2 rounded-lg bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 hover:text-white transition-all duration-300">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
              </svg>
            </a>
            <!-- Twitter -->
            <a href="#" class="p-2 rounded-lg bg-sky-500/10 text-sky-500 hover:bg-sky-500 hover:text-white transition-all duration-300">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Mobile Auth Section -->
        <div class="p-6 border-t border-gray-200/50 space-y-3">
          <template v-if="authStore.isAuthenticated">
            <RouterLink
              to="/profiel"
              @click="closeMobileMenu"
              class="flex items-center justify-center px-4 py-3 bg-blue-600/10 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300 backdrop-blur-sm"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              Profiel
            </RouterLink>
            <RouterLink
              to="/dealer"
              @click="closeMobileMenu"
              class="flex items-center justify-center px-4 py-3 bg-gray-100/50 text-gray-700 rounded-xl hover:bg-gray-200/50 transition-all duration-300 backdrop-blur-sm"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
              Dealer Portal
            </RouterLink>
            <button
              @click="handleLogout"
              class="w-full flex items-center justify-center px-4 py-3 bg-gray-100/50 text-gray-700 rounded-xl hover:bg-gray-200/50 transition-all duration-300 backdrop-blur-sm"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              Uitloggen
            </button>
          </template>
          <template v-else>
            <RouterLink
              to="/login"
              @click="closeMobileMenu"
              class="flex items-center justify-center px-4 py-3 bg-blue-600/10 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300 backdrop-blur-sm"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
              </svg>
              Inloggen
            </RouterLink>
            <RouterLink
              to="/registreer"
              @click="closeMobileMenu"
              class="flex items-center justify-center px-4 py-3 bg-gray-100/50 text-gray-700 rounded-xl hover:bg-gray-200/50 transition-all duration-300 backdrop-blur-sm"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
              </svg>
              Registreren
            </RouterLink>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
