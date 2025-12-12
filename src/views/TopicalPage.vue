<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Header from '../components/common/Header.vue'
import Footer from '../components/common/Footer.vue'
import LazyImage from '../components/LazyImage.vue'
import { topicalPages, getTopicalPageBySlug, partnerStores } from '../data/topicalPages'
import { useEBikesStore } from '../stores/ebikes-simple'
import { getEBikeImageUrl } from '../utils/imagePlaceholder'

const route = useRoute()
const ebikeStore = useEBikesStore()

const normalizedSlug = computed(() => {
  const path = route.path.endsWith('/') && route.path !== '/' ? route.path.slice(0, -1) : route.path
  return path
})

const topicalPage = computed(() => getTopicalPageBySlug(normalizedSlug.value))
const bikes = computed(() => topicalPage.value ? ebikeStore.getEBikesByIds(topicalPage.value.ebikeIds) : [])

onMounted(() => {
  if (!ebikeStore.initialized) {
    ebikeStore.fetchEBikes()
  }
})

function formatPrice(price?: number | null) {
  if (!price || price <= 0) return 'Prijs op aanvraag'
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 text-gray-900">
    <Header />
    <main class="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <section v-if="topicalPage" class="bg-white shadow rounded-xl p-6 md:p-8 space-y-4">
        <div class="flex flex-wrap items-center gap-3">
          <span class="text-xs font-semibold uppercase tracking-wide text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
            {{ topicalPage.template }}
          </span>
          <span class="text-xs text-gray-500">Koopintentie: {{ topicalPage.intent }}</span>
          <span class="text-xs text-gray-500">Slug: {{ topicalPage.slug }}</span>
        </div>
        <div class="space-y-2">
          <h1 class="text-3xl md:text-4xl font-bold">{{ topicalPage.title }}</h1>
          <p class="text-gray-600 leading-relaxed">{{ topicalPage.description }}</p>
        </div>
        <div class="space-y-2">
          <h2 class="text-lg font-semibold">Waarom deze pagina werkt</h2>
          <ul class="list-disc list-inside space-y-1 text-gray-700">
            <li v-for="point in topicalPage.criteria" :key="point">{{ point }}</li>
          </ul>
        </div>
      </section>

      <section v-if="topicalPage" class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-semibold">Uitgelichte e-bikes ({{ bikes.length }})</h2>
            <p class="text-gray-600">Curatie op basis van het topical template en koopintentie.</p>
          </div>
        </div>

        <div v-if="bikes.length" class="grid gap-6 md:grid-cols-2">
          <article
            v-for="bike in bikes"
            :key="bike.id"
            class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col"
          >
            <div class="relative h-48 bg-gray-100">
              <LazyImage
                :src="getEBikeImageUrl(bike)"
                :alt="`${bike.brand} ${bike.model_name}`"
                class="w-full h-full object-cover"
              />
              <span class="absolute top-3 left-3 bg-white/90 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">
                {{ bike.brand }}
              </span>
            </div>
            <div class="p-4 space-y-3 flex-1 flex flex-col">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold leading-tight">
                  {{ bike.brand }} {{ bike.model_name }}
                </h3>
                <span class="text-sm font-semibold text-orange-600">
                  {{ formatPrice(bike.price) }}
                </span>
              </div>
              <p class="text-sm text-gray-600 line-clamp-3">{{ bike.description }}</p>
              <dl class="text-sm text-gray-700 grid grid-cols-2 gap-2">
                <div>
                  <dt class="font-semibold">Bereik</dt>
                  <dd>{{ bike.action_radius_km ? `${bike.action_radius_km} km` : 'n.t.b.' }}</dd>
                </div>
                <div>
                  <dt class="font-semibold">Accu</dt>
                  <dd>{{ bike.battery_capacity ? `${bike.battery_capacity} Wh` : 'n.t.b.' }}</dd>
                </div>
                <div>
                  <dt class="font-semibold">Snelheid</dt>
                  <dd>{{ bike.top_speed_kmh ? `${bike.top_speed_kmh} km/u` : '25 km/u (pedelec)' }}</dd>
                </div>
                <div>
                  <dt class="font-semibold">Gewicht</dt>
                  <dd>{{ bike.weight_kg ? `${bike.weight_kg} kg` : 'n.t.b.' }}</dd>
                </div>
              </dl>
              <div class="mt-auto">
                <a
                  v-if="bike.affiliate_url"
                  :href="bike.affiliate_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center justify-center w-full text-center bg-orange-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-orange-600 transition"
                >
                  Bekijk aanbieding
                </a>
              </div>
            </div>
          </article>
        </div>
        <div v-else class="bg-white rounded-lg p-6 text-gray-600 shadow-sm border border-gray-100">
          Nog geen e-bikes gekoppeld aan deze pagina.
        </div>
      </section>

      <section v-if="topicalPage" class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-3">
        <h3 class="text-lg font-semibold">Aanbevolen partners/winkels</h3>
        <p class="text-gray-600">Koppeling voor voorraad en leadgeneratie.</p>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="store in topicalPage.partnerStores || partnerStores"
            :key="store"
            class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
          >
            {{ store }}
          </span>
        </div>
      </section>

      <section v-else class="bg-white rounded-xl shadow p-6 text-center text-gray-700">
        <h1 class="text-2xl font-semibold mb-2">Pagina niet gevonden</h1>
        <p>De aangevraagde topical page bestaat nog niet.</p>
      </section>
    </main>
    <Footer />
  </div>
</template>



