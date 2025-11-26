<template>
  <div v-if="error" class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
      <div class="text-6xl mb-4">⚠️</div>
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Er is iets misgegaan</h2>
      <p class="text-gray-600 mb-6">{{ error.message }}</p>
      <div class="space-y-3">
        <button 
          @click="reset" 
          class="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Probeer opnieuw
        </button>
        <button 
          @click="goHome" 
          class="w-full bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Terug naar start
        </button>
      </div>
      <details class="mt-6 text-left">
        <summary class="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
          Technische details
        </summary>
        <pre class="mt-2 text-xs text-gray-400 bg-gray-100 p-2 rounded overflow-auto">{{ error.stack }}</pre>
      </details>
    </div>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const error = ref<Error | null>(null)

onErrorCaptured((err) => {
  // Only catch critical errors, not navigation or minor issues
  if (err.message && (
    err.message.includes('ChunkLoadError') ||
    err.message.includes('Loading chunk') ||
    err.message.includes('Loading CSS chunk') ||
    err.message.includes('Failed to fetch')
  )) {
    error.value = err
    console.error('Error boundary caught critical error:', err)
    return false
  } else {
    // Log non-critical errors but don't show error boundary
    console.warn('Non-critical error caught by boundary:', err.message)
    return true // Continue error propagation
  }
})

function reset() {
  error.value = null
  window.location.reload()
}

function goHome() {
  error.value = null
  router.push('/')
}
</script>
