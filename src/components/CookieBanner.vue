<template>
  <Transition
    enter-active-class="transition-all duration-500 ease-out"
    enter-from-class="translate-y-full opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition-all duration-300 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-full opacity-0"
  >
    <div
      v-if="cookieStore.showBanner"
      class="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-blue-600 shadow-2xl"
    >
      <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <!-- Content -->
          <div class="flex-1">
            <h3 class="text-lg font-bold text-gray-900 mb-2">
              We gebruiken cookies
            </h3>
            <p class="text-sm text-gray-700 leading-relaxed">
              Wij gebruiken cookies en vergelijkbare technologieën om onze site goed te laten werken (vereist), 
              je voorkeuren te onthouden en het gebruik te meten. Met jouw toestemming gebruiken we ook cookies 
              voor marketing (zoals advertentiemetingen en affiliates). Je kunt je keuze altijd wijzigen.
            </p>
          </div>

          <!-- Buttons -->
          <div class="flex flex-col sm:flex-row gap-3 lg:ml-6">
            <!-- Accept All -->
            <button
              @click="cookieStore.acceptAll()"
              class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Alles accepteren
            </button>

            <!-- Reject All -->
            <button
              @click="cookieStore.rejectAll()"
              class="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Alleen noodzakelijk
            </button>

             <!-- Settings -->
             <button
               @click="cookieStore.openSettings()"
               class="px-6 py-3 bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
             >
               Instellingen
             </button>
          </div>
        </div>

        <!-- Links -->
        <div class="mt-4 pt-4 border-t border-gray-200">
          <div class="flex flex-wrap gap-4 text-sm">
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
            <span class="text-gray-500">
              Je kunt je toestemming altijd wijzigen via "Cookie-instellingen"
            </span>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useCookieConsentStore } from '../stores/cookieConsent'

const cookieStore = useCookieConsentStore()
</script>
