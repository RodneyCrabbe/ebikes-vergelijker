<script setup lang="ts">
import { ref, computed } from 'vue'
import { useComparisonStore } from '../stores/comparison'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import Header from '../components/common/Header.vue'
import Footer from '../components/common/Footer.vue'
import EnhancedAIChatbot from '../components/EnhancedAIChatbot.vue'

const comparisonStore = useComparisonStore()
const authStore = useAuthStore()
const router = useRouter()

const showSaveModal = ref(false)
const comparisonName = ref('')
const saveSuccess = ref(false)
const saveError = ref('')

const specifications = [
  { key: 'price', label: 'Prijs', format: (val: number) => `€${val.toLocaleString()}`, better: 'lower' },
  { key: 'action_radius_km', label: 'Bereik', format: (val: number) => `~${val} km`, better: 'higher' },
  { key: 'battery_capacity', label: 'Batterij', format: (val: number) => `${val} Wh`, better: 'higher' },
  { key: 'top_speed_kmh', label: 'Topsnelheid', format: (val: number) => `${val} km/h`, better: 'higher' },
  { key: 'build_date', label: 'Bouwjaar', format: (val: string) => val, better: 'none' },
]

const goToEBikes = () => {
  router.push('/e-bikes')
}

const getBestValue = (key: string) => {
  const values = comparisonStore.comparisonItems
    .map(e => (e as any)[key])
    .filter(v => v !== null && v !== undefined && v !== 0)

  if (values.length === 0) return null

  if (key === 'price') {
    return Math.min(...values)
  } else if (['action_radius_km', 'battery_capacity', 'top_speed_kmh'].includes(key)) {
    return Math.max(...values)
  }

  return null
}

const getWorstValue = (key: string) => {
  const values = comparisonStore.comparisonItems
    .map(e => (e as any)[key])
    .filter(v => v !== null && v !== undefined && v !== 0)

  if (values.length === 0) return null

  if (key === 'price') {
    return Math.max(...values)
  } else if (['action_radius_km', 'battery_capacity', 'top_speed_kmh'].includes(key)) {
    return Math.min(...values)
  }

  return null
}

const openSaveModal = () => {
  if (!authStore.user) {
    alert('Log in om vergelijkingen op te slaan')
    router.push('/login')
    return
  }
  showSaveModal.value = true
  saveSuccess.value = false
  saveError.value = ''
}

const saveCurrentComparison = async () => {
  if (!authStore.user) return

  try {
    const ebikeIds = comparisonStore.comparisonItems.map(e => e.id)

    await comparisonStore.saveComparison(
      {
        name: comparisonName.value || `Vergelijking ${new Date().toLocaleDateString()}`,
        ebike_ids: ebikeIds,
      },
      authStore.user.id
    )

    saveSuccess.value = true
    setTimeout(() => {
      showSaveModal.value = false
      comparisonName.value = ''
    }, 2000)
  } catch (e) {
    saveError.value = 'Opslaan mislukt. Probeer opnieuw.'
  }
}

// Calculate price differences
const priceDifferences = computed(() => {
  const prices = comparisonStore.comparisonItems
    .filter(e => e.price > 0)
    .map(e => e.price)

  if (prices.length === 0) return {}

  const avg = prices.reduce((a, b) => a + b, 0) / prices.length

  const result: Record<string, number> = {}
  comparisonStore.comparisonItems.forEach(e => {
    if (e.price > 0) {
      result[e.id] = Math.round(((e.price - avg) / avg) * 100)
    }
  })

  return result
})
</script>

<template>
  <div class="min-h-screen bg-white flex flex-col">
    <Header />

    <main class="container mx-auto px-4 py-8 pt-24 flex-1">
      <h1 class="text-4xl font-bold mb-8 text-gray-900">E-Bikes Vergelijken</h1>

      <div v-if="comparisonStore.comparisonItems.length === 0" class="text-center py-12">
        <div class="text-6xl mb-4">⚖️</div>
        <h2 class="text-2xl font-semibold mb-4">Geen e-bikes geselecteerd</h2>
        <p class="text-gray-600 mb-8">
          Selecteer minimaal 2 e-bikes om te vergelijken
        </p>
        <button @click="goToEBikes" class="btn-primary">
          Naar E-Bikes
        </button>
      </div>

      <div v-else>
        <!-- Action Bar -->
        <div class="mb-6 bg-white p-4 rounded-lg shadow flex flex-wrap justify-between items-center gap-4">
          <div class="flex items-center gap-4">
            <span class="text-gray-700 font-medium">
              {{ comparisonStore.comparisonCount }} van 4 e-bikes geselecteerd
            </span>
            <button
              @click="comparisonStore.clearComparison"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors border-2 border-blue-600"
            >
              🗑️ Alles Wissen
            </button>
          </div>
          <div class="flex gap-2">
      <button
        @click="openSaveModal"
        class="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors border-2 border-green-600"
      >
        💾 Opslaan
      </button>
            <button
              @click="goToEBikes"
              class="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors border-2 border-gray-400"
            >
              + Meer Toevoegen
            </button>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-lg overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b">
                <th class="p-4 text-left sticky left-0 bg-white z-10">Specificatie</th>
                <th
                  v-for="ebike in comparisonStore.comparisonItems"
                  :key="ebike.id"
                  class="p-4 min-w-[250px]"
                >
                  <div class="flex flex-col items-center">
                    <div class="h-40 w-full bg-gray-200 rounded mb-3 flex items-center justify-center">
                      <img
                        v-if="ebike.image_url"
                        :src="ebike.image_url"
                        :alt="ebike.model_name"
                        class="h-full w-full object-contain rounded"
                      />
                      <span v-else class="text-gray-400 text-sm">Geen afbeelding</span>
                    </div>
                    <div class="text-sm text-gray-500">{{ ebike.brand }}</div>
                    <div class="font-semibold">{{ ebike.model_name }}</div>
                    <button
                      @click="comparisonStore.removeFromComparison(ebike.id)"
                      class="text-red-500 text-sm mt-2 hover:underline"
                    >
                      Verwijderen
                    </button>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="spec in specifications"
                :key="spec.key"
                class="border-b hover:bg-gray-50"
              >
                <td class="p-4 font-medium sticky left-0 bg-white border-r">
                  {{ spec.label }}
                </td>
                <td
                  v-for="ebike in comparisonStore.comparisonItems"
                  :key="ebike.id"
                  class="p-4 text-center relative"
                  :class="{
                    'bg-green-50': (ebike as any)[spec.key] === getBestValue(spec.key) && getBestValue(spec.key) !== null,
                    'bg-red-50': (ebike as any)[spec.key] === getWorstValue(spec.key) && getWorstValue(spec.key) !== null && comparisonStore.comparisonItems.length > 2
                  }"
                >
                  <div class="flex flex-col items-center gap-1">
                    <template v-if="(ebike as any)[spec.key]">
                      <span :class="{'font-bold': (ebike as any)[spec.key] === getBestValue(spec.key)}">
                        {{ spec.format((ebike as any)[spec.key]) }}
                      </span>

                      <!-- Best indicator -->
                      <span v-if="(ebike as any)[spec.key] === getBestValue(spec.key) && getBestValue(spec.key) !== null" class="text-xs text-green-600 font-semibold">
                        🏆 Beste
                      </span>

                      <!-- Price difference -->
                      <span v-if="spec.key === 'price' && ebike.price > 0 && priceDifferences[ebike.id]" class="text-xs">
                        <span v-if="priceDifferences[ebike.id] < -10" class="text-green-600 font-semibold">
                          {{ priceDifferences[ebike.id] }}% 💰
                        </span>
                        <span v-else-if="priceDifferences[ebike.id] > 10" class="text-red-600 font-semibold">
                          +{{ priceDifferences[ebike.id] }}%
                        </span>
                      </span>
                    </template>
                    <span v-else class="text-gray-400">-</span>
                  </div>
                </td>
              </tr>
              <tr class="border-b hover:bg-gray-50">
                <td class="p-4 font-medium sticky left-0 bg-white">Beschrijving</td>
                <td
                  v-for="ebike in comparisonStore.comparisonItems"
                  :key="ebike.id"
                  class="p-4"
                >
                  <p class="text-sm text-gray-600 line-clamp-3">
                    {{ ebike.description || 'Geen beschrijving beschikbaar' }}
                  </p>
                </td>
              </tr>
              <tr>
                <td class="p-4 sticky left-0 bg-white"></td>
                <td
                  v-for="ebike in comparisonStore.comparisonItems"
                  :key="ebike.id"
                  class="p-4"
                >
                  <div class="space-y-2">
                    <RouterLink
                      :to="`/e-bikes/${ebike.id}`"
                      class="block text-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                    >
                      Details
                    </RouterLink>
                    <a
                      :href="ebike.affiliate_url"
                      target="_blank"
                      class="block text-center btn-primary"
                      @click="() => {}"
                    >
                      Bekijk Deal
                    </a>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mt-8 text-center">
          <button @click="goToEBikes" class="btn-secondary">
            Meer E-Bikes Toevoegen
          </button>
        </div>
      </div>

      <!-- Save Comparison Modal -->
      <div
        v-if="showSaveModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click.self="showSaveModal = false"
      >
        <div class="bg-white rounded-lg p-6 max-w-md w-full">
          <h3 class="text-2xl font-bold mb-4">Vergelijking Opslaan</h3>

          <div v-if="saveSuccess" class="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-4">
            ✓ Vergelijking succesvol opgeslagen!
          </div>

          <div v-if="saveError" class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
            {{ saveError }}
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">Naam (optioneel)</label>
            <input
              v-model="comparisonName"
              type="text"
              class="w-full border rounded-lg px-4 py-2"
              placeholder="Mijn e-bike vergelijking"
              @keyup.enter="saveCurrentComparison"
            />
          </div>

          <div class="mb-4 p-3 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-600 mb-2">Je vergelijkt:</p>
            <ul class="text-sm space-y-1">
              <li v-for="ebike in comparisonStore.comparisonItems" :key="ebike.id" class="flex items-center gap-2">
                <span class="text-accent">•</span>
                <span>{{ ebike.brand }} {{ ebike.model_name }}</span>
              </li>
            </ul>
          </div>

          <div class="flex gap-3">
            <button
              @click="saveCurrentComparison"
              class="flex-1 bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              :disabled="comparisonStore.loading || saveSuccess"
            >
              {{ comparisonStore.loading ? 'Opslaan...' : 'Opslaan' }}
            </button>
            <button
              @click="showSaveModal = false"
              class="flex-1 bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Annuleren
            </button>
          </div>
        </div>
      </div>
    </main>

    <Footer />
    
    <!-- Enhanced AI Chatbot -->
    <EnhancedAIChatbot />
  </div>
</template>
