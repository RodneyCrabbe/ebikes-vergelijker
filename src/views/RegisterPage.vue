<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <Header />
    
    <main class="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Maak een account aan
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Of
            <RouterLink to="/login" class="font-medium text-blue-600 hover:text-blue-500">
              log in op je bestaande account
            </RouterLink>
          </p>
        </div>
        
        <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
          <div class="space-y-4">
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700">Voornaam</label>
              <input
                id="firstName"
                v-model="form.firstName"
                name="firstName"
                type="text"
                required
                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Voornaam"
              />
            </div>
            
            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700">Achternaam</label>
              <input
                id="lastName"
                v-model="form.lastName"
                name="lastName"
                type="text"
                required
                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Achternaam"
              />
            </div>
            
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">E-mailadres</label>
              <input
                id="email"
                v-model="form.email"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="E-mailadres"
              />
            </div>
            
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">Wachtwoord</label>
              <input
                id="password"
                v-model="form.password"
                name="password"
                type="password"
                autocomplete="new-password"
                required
                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Wachtwoord"
              />
            </div>
            
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Bevestig wachtwoord</label>
              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                name="confirmPassword"
                type="password"
                autocomplete="new-password"
                required
                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Bevestig wachtwoord"
              />
            </div>
          </div>

          <div class="flex items-center">
            <input
              id="agree-terms"
              v-model="form.agreeTerms"
              name="agree-terms"
              type="checkbox"
              required
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="agree-terms" class="ml-2 block text-sm text-gray-900">
              Ik ga akkoord met de
              <a href="/algemene-voorwaarden" class="text-blue-600 hover:text-blue-500">Algemene Voorwaarden</a>
              en
              <a href="/privacy-policy" class="text-blue-600 hover:text-blue-500">Privacy Policy</a>
            </label>
          </div>

          <div>
            <button
              type="submit"
              :disabled="loading || !isFormValid"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg class="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              {{ loading ? 'Account aanmaken...' : 'Account aanmaken' }}
            </button>
          </div>

          <div v-if="error" class="rounded-md bg-red-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">
                  Registratie mislukt
                </h3>
                <div class="mt-2 text-sm text-red-700">
                  {{ error }}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
    
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Header from '../components/common/Header.vue'
import Footer from '../components/common/Footer.vue'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const error = ref('')

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false
})

const isFormValid = computed(() => {
  return form.firstName && 
         form.lastName && 
         form.email && 
         form.password && 
         form.password === form.confirmPassword && 
         form.agreeTerms
})

const handleRegister = async () => {
  loading.value = true
  error.value = ''

  try {
    if (form.password !== form.confirmPassword) {
      throw new Error('Wachtwoorden komen niet overeen')
    }

    await authStore.register({
      email: form.email,
      password: form.password,
      name: `${form.firstName} ${form.lastName}`,
      newsletter_subscribed: false
    })
    
    // Redirect to home page after successful registration
    await router.push('/')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Er is een fout opgetreden bij het aanmaken van je account'
  } finally {
    loading.value = false
  }
}
</script>