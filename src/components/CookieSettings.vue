<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div
      v-if="cookieStore.showSettings"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click.self="cookieStore.closeSettings()"
    >
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black bg-opacity-50"></div>

      <!-- Modal -->
      <div class="relative min-h-screen flex items-center justify-center p-4">
        <div class="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <!-- Header -->
          <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
            <div class="flex items-center justify-between">
              <h2 class="text-2xl font-bold text-gray-900">
                Cookie-instellingen
              </h2>
              <button
                @click="cookieStore.closeSettings()"
                class="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <p class="text-gray-600 mt-2">
              Kies welke cookies je wilt toestaan. Je kunt je keuze altijd wijzigen.
            </p>
          </div>

          <!-- Content -->
          <div class="p-6">
            <div class="space-y-6">
              <!-- Cookie Categories -->
              <div
                v-for="category in cookieStore.cookieCategories"
                :key="category.key"
                class="border border-gray-200 rounded-xl p-6"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                      <h3 class="text-lg font-semibold text-gray-900">
                        {{ category.label }}
                      </h3>
                      <span
                        v-if="category.required"
                        class="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                      >
                        Altijd actief
                      </span>
                    </div>
                    <p class="text-gray-600 text-sm mb-4">
                      {{ category.description }}
                    </p>

                    <!-- Cookie Details -->
                    <div class="bg-gray-50 rounded-lg p-4">
                      <h4 class="text-sm font-medium text-gray-900 mb-2">Voorbeelden van cookies:</h4>
                      <div class="space-y-2">
                        <div
                          v-for="cookie in category.cookies"
                          :key="cookie.name"
                          class="text-xs text-gray-600"
                        >
                          <span class="font-mono bg-white px-2 py-1 rounded border">{{ cookie.name }}</span>
                          <span class="mx-2">•</span>
                          <span>{{ cookie.provider }}</span>
                          <span class="mx-2">•</span>
                          <span>{{ cookie.retention }}</span>
                          <span class="mx-2">•</span>
                          <span>{{ cookie.purpose }}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Toggle -->
                  <div class="ml-4">
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        :checked="category.enabled"
                        :disabled="category.required"
                        @change="updateCategory(category.key, ($event.target as HTMLInputElement).checked)"
                        class="sr-only peer"
                      >
                      <div
                        :class="[
                          'w-11 h-6 rounded-full peer peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 transition-colors',
                          category.required || category.enabled
                            ? 'bg-blue-600'
                            : 'bg-gray-200',
                          category.required
                            ? 'opacity-50 cursor-not-allowed'
                            : 'peer-checked:bg-blue-600'
                        ]"
                      ></div>
                      <div
                        :class="[
                          'absolute top-0.5 left-0.5 bg-white border-gray-300 rounded-full h-5 w-5 transition-transform',
                          category.required || category.enabled
                            ? 'translate-x-5'
                            : 'translate-x-0'
                        ]"
                      ></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Legal Notice -->
            <div class="mt-8 p-4 bg-blue-50 rounded-lg">
              <h4 class="text-sm font-medium text-blue-900 mb-2">Wettelijke informatie</h4>
              <p class="text-xs text-blue-800">
                Noodzakelijke cookies zijn altijd actief omdat ze essentieel zijn voor de werking van de website. 
                Voor alle andere cookies vragen we je toestemming. Je kunt je keuze op elk moment wijzigen via 
                "Cookie-instellingen" onderaan elke pagina.
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div class="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl">
            <div class="flex flex-col sm:flex-row gap-3 justify-between items-center">
              <div class="flex gap-4 text-sm">
                <a
                  href="/cookiebeleid"
                  class="text-blue-600 hover:text-blue-800 underline"
                >
                  Cookiebeleid
                </a>
                <a
                  href="/privacy"
                  class="text-blue-600 hover:text-blue-800 underline"
                >
                  Privacyverklaring
                </a>
              </div>

              <div class="flex gap-3">
                <button
                  @click="acceptAll"
                  class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Alles accepteren
                </button>
                <button
                  @click="rejectAll"
                  class="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Alles weigeren
                </button>
                <button
                  @click="saveSettings"
                  class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Opslaan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCookieConsentStore } from '../stores/cookieConsent'

const cookieStore = useCookieConsentStore()

// Local state for settings
const localSettings = ref<Record<string, boolean>>({})

// Initialize local settings from store
const initializeSettings = () => {
  const settings: Record<string, boolean> = {}
  cookieStore.cookieCategories.forEach(category => {
    settings[category.key] = category.enabled
  })
  localSettings.value = settings
}

// Update category setting
const updateCategory = (key: string, enabled: boolean) => {
  localSettings.value[key] = enabled
}

// Accept all
const acceptAll = () => {
  cookieStore.acceptAll()
}

// Reject all
const rejectAll = () => {
  cookieStore.rejectAll()
}

// Save custom settings
const saveSettings = () => {
  cookieStore.saveCustomConsent({
    preferences: localSettings.value.preferences,
    analytics: localSettings.value.analytics,
    marketing: localSettings.value.marketing,
    support: localSettings.value.support
  })
}

// Initialize when component mounts
initializeSettings()
</script>
