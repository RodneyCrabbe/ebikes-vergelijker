<template>
  <div class="subscription-page">
    <!-- Header -->
    <div class="bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-16">
      <div class="container mx-auto px-6 text-center">
        <h1 class="text-4xl font-bold mb-4">Kies je E-Bike Platform Plan</h1>
        <p class="text-xl opacity-90 max-w-2xl mx-auto">
          Ontgrendel alle functies en krijg de beste e-bike ervaring
        </p>
      </div>
    </div>

    <!-- Current Plan Status -->
    <div v-if="currentSubscription" class="bg-blue-50 border-b border-blue-200 py-4">
      <div class="container mx-auto px-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
            <span class="font-medium text-blue-900">
              Huidige plan: {{ currentPlan?.name }}
            </span>
            <span v-if="isExpiringSoon" class="text-orange-600 text-sm">
              (Verloopt over {{ daysUntilExpiry }} dagen)
            </span>
          </div>
          <div class="flex gap-2">
            <button
              v-if="currentSubscription.cancel_at_period_end"
              @click="reactivateSubscription"
              :disabled="loading"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              Heractiveer
            </button>
            <button
              @click="cancelSubscription"
              :disabled="loading"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              Annuleer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pricing Plans -->
    <div class="py-16">
      <div class="container mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <!-- Free Plan -->
          <div class="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-8 relative">
            <div class="text-center mb-8">
              <h3 class="text-2xl font-bold text-gray-900 mb-2">Gratis</h3>
              <div class="text-4xl font-bold text-gray-900 mb-2">€0</div>
              <p class="text-gray-600">per maand</p>
            </div>
            
            <ul class="space-y-4 mb-8">
              <li v-for="feature in freePlanFeatures" :key="feature" class="flex items-center gap-3">
                <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="text-gray-700">{{ feature }}</span>
              </li>
            </ul>

            <button
              @click="selectPlan('free')"
              :disabled="currentSubscription?.plan_id === 'free'"
              :class="[
                'w-full py-3 px-6 rounded-lg font-semibold transition-colors',
                currentSubscription?.plan_id === 'free'
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              ]"
            >
              {{ currentSubscription?.plan_id === 'free' ? 'Huidige Plan' : 'Gratis Starten' }}
            </button>
          </div>

          <!-- Premium Monthly -->
          <div class="bg-white rounded-2xl shadow-xl border-2 border-primary-500 p-8 relative">
            <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span class="bg-primary-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                Meest Populair
              </span>
            </div>
            
            <div class="text-center mb-8">
              <h3 class="text-2xl font-bold text-gray-900 mb-2">Premium</h3>
              <div class="text-4xl font-bold text-gray-900 mb-2">€9.99</div>
              <p class="text-gray-600">per maand</p>
            </div>
            
            <ul class="space-y-4 mb-8">
              <li v-for="feature in premiumPlanFeatures" :key="feature" class="flex items-center gap-3">
                <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="text-gray-700">{{ feature }}</span>
              </li>
            </ul>

            <button
              @click="selectPlan('premium')"
              :disabled="loading || currentSubscription?.plan_id === 'premium'"
              :class="[
                'w-full py-3 px-6 rounded-lg font-semibold transition-colors',
                currentSubscription?.plan_id === 'premium'
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                  : 'bg-primary-500 text-white hover:bg-primary-600'
              ]"
            >
              {{ loading ? 'Bezig...' : currentSubscription?.plan_id === 'premium' ? 'Huidige Plan' : 'Upgrade naar Premium' }}
            </button>
          </div>

          <!-- Premium Yearly -->
          <div class="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-8 relative">
            <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span class="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                20% Korting
              </span>
            </div>
            
            <div class="text-center mb-8">
              <h3 class="text-2xl font-bold text-gray-900 mb-2">Premium Jaarlijks</h3>
              <div class="text-4xl font-bold text-gray-900 mb-2">€95.99</div>
              <p class="text-gray-600">per jaar</p>
              <p class="text-sm text-green-600 font-medium">Bespaar €24 per jaar</p>
            </div>
            
            <ul class="space-y-4 mb-8">
              <li v-for="feature in premiumYearlyFeatures" :key="feature" class="flex items-center gap-3">
                <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="text-gray-700">{{ feature }}</span>
              </li>
            </ul>

            <button
              @click="selectPlan('premium_yearly')"
              :disabled="loading || currentSubscription?.plan_id === 'premium_yearly'"
              :class="[
                'w-full py-3 px-6 rounded-lg font-semibold transition-colors',
                currentSubscription?.plan_id === 'premium_yearly'
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              ]"
            >
              {{ loading ? 'Bezig...' : currentSubscription?.plan_id === 'premium_yearly' ? 'Huidige Plan' : 'Kies Jaarlijks' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Comparison -->
    <div class="bg-gray-50 py-16">
      <div class="container mx-auto px-6">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">
          Vergelijk alle functies
        </h2>
        
        <div class="max-w-4xl mx-auto">
          <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-4 text-left text-sm font-medium text-gray-900">Functie</th>
                  <th class="px-6 py-4 text-center text-sm font-medium text-gray-900">Gratis</th>
                  <th class="px-6 py-4 text-center text-sm font-medium text-gray-900">Premium</th>
                  <th class="px-6 py-4 text-center text-sm font-medium text-gray-900">Premium Jaarlijks</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="feature in featureComparison" :key="feature.id">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <span class="text-2xl">{{ feature.icon }}</span>
                      <div>
                        <div class="font-medium text-gray-900">{{ feature.name }}</div>
                        <div class="text-sm text-gray-500">{{ feature.description }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <span v-if="feature.free" class="text-green-600 font-medium">✓</span>
                    <span v-else class="text-gray-400">✗</span>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <span v-if="feature.premium" class="text-green-600 font-medium">✓</span>
                    <span v-else class="text-gray-400">✗</span>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <span v-if="feature.premiumYearly" class="text-green-600 font-medium">✓</span>
                    <span v-else class="text-gray-400">✗</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- FAQ Section -->
    <div class="py-16">
      <div class="container mx-auto px-6">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">
          Veelgestelde Vragen
        </h2>
        
        <div class="max-w-3xl mx-auto space-y-6">
          <div v-for="faq in faqs" :key="faq.question" class="bg-white rounded-lg shadow-sm border p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ faq.question }}</h3>
            <p class="text-gray-600">{{ faq.answer }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSubscriptionStore } from '../stores/subscription'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { SUBSCRIPTION_PLANS, SUBSCRIPTION_FEATURES } from '../types/subscription'

const subscriptionStore = useSubscriptionStore()
const authStore = useAuthStore()
const router = useRouter()

// State
const selectedPlan = ref<string | null>(null)

// Computed
const currentSubscription = computed(() => subscriptionStore.currentSubscription)
const currentPlan = computed(() => subscriptionStore.currentPlan)
const hasPremiumFeatures = computed(() => subscriptionStore.hasPremiumFeatures)
const isExpiringSoon = computed(() => subscriptionStore.isExpiringSoon)
const daysUntilExpiry = computed(() => subscriptionStore.daysUntilExpiry)
const loading = computed(() => subscriptionStore.loading)
const error = computed(() => subscriptionStore.error)

// Plan features
const freePlanFeatures = [
  'Basis e-bike vergelijking',
  '3 opgeslagen e-bikes',
  'Standaard AI chat',
  'Basis zoekfilters',
  'E-bike reviews bekijken'
]

const premiumPlanFeatures = [
  'Onbeperkt opgeslagen e-bikes',
  'Onbeperkte vergelijkingen',
  'Prijsalerts voor 20+ e-bikes',
  'Uitgebreide AI chat met context',
  'Geavanceerde zoekfilters',
  'Export vergelijkingen naar PDF',
  'Ad-vrije ervaring',
  'Prioriteit support',
  'Vroege toegang tot nieuwe e-bikes'
]

const premiumYearlyFeatures = [
  ...premiumPlanFeatures,
  '20% korting op jaarlijkse betaling'
]

// Feature comparison
const featureComparison = computed(() => {
  return SUBSCRIPTION_FEATURES.map(feature => {
    const freePlan = SUBSCRIPTION_PLANS.find(p => p.id === 'free')!
    const premiumPlan = SUBSCRIPTION_PLANS.find(p => p.id === 'premium')!
    const premiumYearlyPlan = SUBSCRIPTION_PLANS.find(p => p.id === 'premium_yearly')!

    return {
      ...feature,
      free: feature.category === 'core',
      premium: true,
      premiumYearly: true
    }
  })
})

// FAQ data
const faqs = [
  {
    question: 'Kan ik op elk moment upgraden of downgraden?',
    answer: 'Ja, je kunt op elk moment upgraden naar een hoger plan. Downgraden kan aan het einde van je huidige factureringsperiode.'
  },
  {
    question: 'Wat gebeurt er met mijn data als ik downgrade?',
    answer: 'Je behoudt toegang tot je opgeslagen e-bikes en vergelijkingen, maar sommige premium functies worden beperkt volgens je nieuwe plan.'
  },
  {
    question: 'Kan ik mijn abonnement annuleren?',
    answer: 'Ja, je kunt je abonnement op elk moment annuleren. Je behoudt toegang tot premium functies tot het einde van je factureringsperiode.'
  },
  {
    question: 'Bieden jullie een geld-terug-garantie?',
    answer: 'Ja, we bieden een 30-dagen geld-terug-garantie voor alle premium abonnementen.'
  },
  {
    question: 'Hoe werkt de jaarlijkse betaling?',
    answer: 'Met de jaarlijkse betaling bespaar je 20% ten opzichte van de maandelijkse betaling. Je wordt één keer per jaar gefactureerd.'
  }
]

// Methods
const selectPlan = async (planId: string) => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  selectedPlan.value = planId
  
  if (planId === 'free') {
    // Free plan - no action needed
    return
  }

  try {
    await subscriptionStore.createSubscription(planId)
    // Redirect to success page or show success message
    router.push('/profiel?subscription=success')
  } catch (err) {
    console.error('Error creating subscription:', err)
  }
}

const cancelSubscription = async () => {
  if (confirm('Weet je zeker dat je je abonnement wilt annuleren?')) {
    await subscriptionStore.cancelSubscription()
  }
}

const reactivateSubscription = async () => {
  await subscriptionStore.reactivateSubscription()
}

// Lifecycle
onMounted(async () => {
  if (authStore.isAuthenticated) {
    await subscriptionStore.initialize()
  }
})
</script>

<style scoped>
.subscription-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}
</style>
