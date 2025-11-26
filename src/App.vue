<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useAuthStore } from './stores/auth'
import { useCookieConsentStore } from './stores/cookieConsent'
import { useEBikesStore } from './stores/ebikes-simple'
import { startupHealthCheck } from './utils/startupHealthCheck'
import CookieBanner from './components/CookieBanner.vue'
import CookieSettings from './components/CookieSettings.vue'
import ErrorBoundary from './components/ErrorBoundary.vue'

const authStore = useAuthStore()
const cookieStore = useCookieConsentStore()
const ebikeStore = useEBikesStore()

onMounted(async () => {
  try {
    // Run startup health check first
    const healthResult = await startupHealthCheck.runHealthCheck()

    if (!healthResult.isHealthy) {
      console.warn('Health check failed, continuing with local mode')
    }

    await authStore.initialize()
    cookieStore.initialize()

    // Skip user-specific stores that may have Supabase dependencies
    // They will be initialized when needed

    // Fetch e-bikes initially and start auto-refresh
    await ebikeStore.fetchEBikes()
    ebikeStore.startAutoRefresh()
  } catch (error) {
    console.error('App initialization error:', error)
    // Continue despite errors
  }
})

onUnmounted(() => {
  // Cleanup auto-refresh on unmount
  ebikeStore.stopAutoRefresh()
})
</script>

<template>
  <ErrorBoundary>
    <div id="app" class="min-h-screen bg-background flex flex-col">
      <main class="flex-1">
        <RouterView />
      </main>
      
      <!-- Cookie Components -->
      <CookieBanner />
      <CookieSettings />
    </div>
  </ErrorBoundary>
</template>
