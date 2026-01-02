<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useEBikesStore } from '../stores/ebikes-simple'
import { useComparisonStore } from '../stores/comparison'
import { useFavoritesStore } from '../stores/favorites'
import { useAuthStore } from '../stores/auth'
import { eventTrackingService } from '../services/eventTrackingService'
import { getEBikeImageUrl } from '../utils/imagePlaceholder'
import Header from '../components/common/Header.vue'
import Footer from '../components/common/Footer.vue'
import MarkdownRenderer from '../components/common/MarkdownRenderer.vue'

// Lazy load AI Chatbot only when needed
const EnhancedAIChatbot = defineAsyncComponent(() => import('../components/EnhancedAIChatbot.vue'))

const route = useRoute()
const ebikeStore = useEBikesStore()
const comparisonStore = useComparisonStore()
const favoritesStore = useFavoritesStore()
const authStore = useAuthStore()
const ebike = ref<any>(null)

// Interactive features
const selectedImage = ref(0)
const selectedBattery = ref('standard')
const selectedColor = ref('zwart')
const showSpecs = ref(false)
const showReviews = ref(false)
const showImageCarousel = ref(false)
const carouselImageIndex = ref(0)

// External website URLs mapping
const externalUrls: Record<string, Record<string, string>> = {
  'Aventon': {
    'Level.2': 'https://www.aventon.com/products/aventon-level-2-commuter-ebike',
    'Aventure.2': 'https://www.aventon.com/products/aventure-2-fat-tire-ebike'
  },
  'Batavus': {
    'Diva E-go': 'https://www.batavus.com/nl-nl/elektrische-fietsen/diva-e-go'
  },
  'CUBE': {
    'Kathmandu Hybrid Pro 625': 'https://www.cube.eu/de-en/cube-kathmandu-hybrid-pro-625-flashstone-n-black/631312'
  },
  'Cannondale': {
    'Tesoro Neo X 3': 'https://www.cannondale.com/en/bikes/electric/e-touring/tesoro-neo-x/tesoro-neo-x-3'
  },
  'Canyon': {
    'Precede:ON 7 / Precede:ON Comfort 7': 'https://www.canyon.com/en-us/electric-bikes/city-electric-bikes/precede-on/comfort/precede-on-comfort-7/3925.html'
  },
  'ENGWE': {
    'EP-2 Pro': 'https://engwe-bikes.com/products/ep-2-pro-750w-folding-electric-mountain-bike',
    'X26': 'https://engwe-bikes.com/products/x26-1000w-fat-tire-folding-electric-bike',
    'M20': 'https://engwe-bikes.com/products/m20-1000w-dual-suspension-fat-tire-electric-bike',
    'L20': 'https://engwe-bikes.com/products/l20-250w-step-thru-electric-bike'
  },
  'Fiido': {
    'M1 Pro': 'https://fiido.com/fiido-m1pro-fat-tire-electric-bike.html'
  },
  'Gazelle': {
    'Ultimate C380 HMB': 'https://www.gazellebikes.com/en-us/ultimate-c380-hmb',
    'Ultimate C8+ HMB': 'https://www.gazellebikes.com/en-us/ultimate-c8-hmb'
  },
  'Giant': {
    'Explore E+': 'https://www.giant-bicycles.com/global/showcase/explore-e-plus',
    'Explore E+ 1': 'https://www.giant-bicycles.com/gb/explore-e-1-2023',
    'Trance E+ 3': 'https://www.giant-bicycles.com/us/trance-e-plus-3'
  },
  'Knaap': {
    'AMS X': 'https://knaapbikes.com/products/ams-x',
    'RTD X': 'https://knaapbikes.com/products/rtd-x',
    'LON': 'https://knaapbikes.com/products/lon',
    'BCN': 'https://knaapbikes.com/products/bcn',
    'NYC': 'https://knaapbikes.com/products/nyc',
    'LAX': 'https://knaapbikes.com/products/lax'
  },
  'Koga': {
    'E-Nova Evo': 'https://www.koga.com/en/bikes/e-bikes/e-nova-evo-pt.htm'
  },
  'Lectric': {
    'XP 3.0': 'https://lectricebikes.com/products/xp-step-thru-3-0'
  },
  'Orbea': {
    'Vibe H30': 'https://www.orbea.com/us-en/ebikes/urban/vibe/cat/vibe-h30-2023'
  },
  'Phatfour': {
    'FLS': 'https://en.phatfour.com/products/fls-phatfour-e-bike',
    'FLB': 'https://en.phatfour.com/products/flb-phatfour-e-bike',
    'FLX': 'https://en.phatfour.com/products/flx-phatfour-e-bike'
  },
  'Rad Power Bikes': {
    'RadRunner 2': 'https://www.radpowerbikes.com/products/radrunner-2-electric-utility-bike'
  },
  'Riese & Müller': {
    'Charger4 GT Vario': 'https://www.r-m.de/en-de/bikes/charger4/charger4-gt-vario/#F00833_04030209'
  },
  'SUPER73': {
    'S2': 'https://super73.com/products/super73-s2',
    'ZX': 'https://super73.com/products/super73-zx'
  },
  'Sparta': {
    'e-Speed D11S': 'https://www.sparta.nl/elektrische-fietsen'
  },
  'Trek': {
    'Allant+ 7 Gen 2': 'https://www.trekbikes.com/us/en_US/bikes/electric-bikes/e-city-bikes/allant/allant-7-gen-2/p/41549/'
  },
  'Urban Drivestyle': {
    'UNI MK Classic': 'https://urbandrivestyle.com/products/uni-mk-classic-250w-electric-bike'
  },
  'VANMOOF': {
    'S5': 'https://www.vanmoof.com/en-US/s5'
  }
}

// Get external URL for current e-bike
// Priority: 1. affiliate_url from data, 2. externalUrls mapping
const getExternalUrl = computed(() => {
  if (!ebike.value) return null
  
  // First priority: use affiliate_url from e-bike data
  if (ebike.value.affiliate_url) {
    return ebike.value.affiliate_url
  }
  
  // Fallback: use hardcoded externalUrls mapping
  const brand = ebike.value.brand
  const model = ebike.value.model_name
  return externalUrls[brand]?.[model] || null
})

// Handle external link click
const handleExternalLinkClick = () => {
  const url = getExternalUrl.value
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer')
    // Track the event
    eventTrackingService.trackEvent({
      category: 'external_link',
      action: 'click',
      label: `${ebike.value?.brand} ${ebike.value?.model_name} - ${url}`,
      value: 1
    })
  } else {
    console.warn('No external URL available for this e-bike')
  }
}

// Go to specific image in carousel
const goToImage = (index: number) => {
  carouselImageIndex.value = index
}

const nextImage = () => {
  if (ebike.value?.images) {
    carouselImageIndex.value = (carouselImageIndex.value + 1) % ebike.value.images.length
  }
}

const prevImage = () => {
  if (ebike.value?.images) {
    carouselImageIndex.value = (carouselImageIndex.value - 1 + ebike.value.images.length) % ebike.value.images.length
  }
}

const openImageCarousel = (index: number) => {
  carouselImageIndex.value = index
  showImageCarousel.value = true
  document.body.style.overflow = 'hidden'
}

const closeImageCarousel = () => {
  showImageCarousel.value = false
  document.body.style.overflow = ''
}

// Keyboard navigation for carousel
const handleKeydown = (e: KeyboardEvent) => {
  if (!showImageCarousel.value) return
  
  if (e.key === 'ArrowRight') nextImage()
  if (e.key === 'ArrowLeft') prevImage()
  if (e.key === 'Escape') closeImageCarousel()
}

onMounted(async () => {
  window.addEventListener('keydown', handleKeydown)
  
  const id = route.params.id as string
  
  // Try to fetch by ID first (numeric or UUID)
  let fetchedEBike = await ebikeStore.fetchEBikeById(id)
  
  // If not found and ID looks like a slug (non-numeric), try to find by matching slug/name
  if (!fetchedEBike && isNaN(Number(id))) {
    // Ensure all ebikes are loaded
    await ebikeStore.fetchEBikes()
    // Use the ebikes from the store directly
    const allEBikes = ebikeStore.ebikes
    
    // Simple slug matching logic
    fetchedEBike = allEBikes.find(e => {
      // Convert brand + model to slug format to compare
      const slug = `${e.brand}-${e.model_name}`.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      const legacyId = e.id // Check if the ebike object itself has the legacy ID stored
      return slug === id || slug.includes(id) || legacyId === id
    }) || null
  }

  if (fetchedEBike) {
    ebike.value = fetchedEBike
    // Pre-select first image if available
    if (fetchedEBike.images && fetchedEBike.images.length > 0) {
      selectedImage.value = 0
    }
    
    // Track view event
    eventTrackingService.trackEvent({
      category: 'ebike',
      action: 'view',
      label: `${fetchedEBike.brand} ${fetchedEBike.model_name}`,
      value: fetchedEBike.price
    })
  } else {
    console.error(`E-bike not found: ${id}`)
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})

const addToComparison = () => {
  if (ebike.value) {
    comparisonStore.addToComparison(ebike.value)
  }
}

const toggleFavorite = () => {
  if (ebike.value) {
    favoritesStore.toggleFavorite(ebike.value)
  }
}

const isFavorite = computed(() => {
  return ebike.value ? favoritesStore.isFavorite(ebike.value.id) : false
})

// Helper function to remove a section from markdown content
function removeSection(content: string, sectionPattern: RegExp): string {
  const lines = content.split('\n')
  const result: string[] = []
  let skipSection = false
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    
    // Check if this line matches the section heading pattern
    if (sectionPattern.test(line)) {
      skipSection = true
      continue // Skip the heading line
    }
    
    // If we're in a section to skip, check if we've reached the next major heading
    if (skipSection) {
      // Check if this is a new heading (starts with #)
      if (/^#{1,6}\s+/.test(line)) {
        // We've reached the next section, stop skipping
        skipSection = false
        result.push(line) // Include this heading
      }
      // Otherwise, continue skipping this line
      continue
    }
    
    // Normal line, include it
    result.push(line)
  }
  
  return result.join('\n')
}

// Filter out unwanted sections from description
const filteredDescription = computed(() => {
  if (!ebike.value?.description) return ''
  
  const description = ebike.value.description
  // Normalize line endings (handle both \r\n and \n)
  let normalized = description.replace(/\r\n/g, '\n')
  
  // Remove "Specificaties" or "Volledige specificaties" section
  const specsPattern = /^#{1,6}\s*(volledige\s+)?specificaties\s*.*$/im
  normalized = removeSection(normalized, specsPattern)
  
  // Remove "Prijs & beschikbaarheid" section (with variations)
  // Matches: "Prijs & beschikbaarheid", "Prijs & Beschikbaarheid", "Prijs en beschikbaarheid", etc.
  const pricePattern = /^#{1,6}\s*prijs\s*(&\s+|en\s+)beschikbaarheid.*$/im
  normalized = removeSection(normalized, pricePattern)
  
  // Remove "Links" section
  const linksPattern = /^#{1,6}\s*links\s*.*$/im
  normalized = removeSection(normalized, linksPattern)
  
  return normalized.trim()
})

// Category icons mapping with styling
const categoryIcons = {
  accu: {
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50'
  },
  frame: {
    color: 'text-blue-500',
    bgColor: 'bg-blue-50'
  },
  motor: {
    color: 'text-green-500',
    bgColor: 'bg-green-50'
  },
  wielen: {
    color: 'text-purple-500',
    bgColor: 'bg-purple-50'
  },
  algemeen: {
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-50'
  },
  features: {
    color: 'text-orange-500',
    bgColor: 'bg-orange-50'
  }
}

// Transform technical keys to human-readable labels
const getReadableLabel = (key: string): string => {
  const labelMap: Record<string, string> = {
    // Accu
    accu: 'Accu',
    type: 'Type',
    lader_laadtijd: 'Laadtijd',
    actieradius_claim_opgave: 'Actieradius (claim)',
    
    // Frame
    materiaal: 'Materiaal',
    vork_vering: 'Vork/Vering',
    bijzonderheden: 'Bijzonderheden',
    ergonomie_zadel: 'Ergonomie Zadel',
    
    // Motor
    vermogen_eu: 'Vermogen (EU)',
    koppel_opgave: 'Koppel',
    display_bediening: 'Display/Bediening',
    
    // Wielen
    remmen: 'Remmen',
    wielmaat: 'Wielmaat',
    bandenmaat: 'Bandenmaat',
    aandrijving_versnellingen: 'Versnellingen',
    
    // Algemeen
    gewicht: 'Gewicht',
    prijs_eu: 'Prijs (EU)',
    categorie: 'Categorie',
    doelgroep: 'Doelgroep',
    merk_model: 'Merk/Model',
    afmetingen_zithoogte: 'Afmetingen/Zithoogte',
    payload_totaal_toelaatbaar: 'Max. Belading',
    
    // Features
    accessoires: 'Accessoires',
    verlichting: 'Verlichting',
    connectiviteit: 'Connectiviteit',
    waterdichtheid: 'Waterdichtheid'
  }
  
  return labelMap[key] || key.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

// Get category display name
const getCategoryName = (category: string): string => {
  const categoryNames: Record<string, string> = {
    accu: 'Accu',
    frame: 'Frame',
    motor: 'Motor',
    wielen: 'Wielen',
    algemeen: 'Algemeen',
    features: 'Features'
  }
  return categoryNames[category] || category.charAt(0).toUpperCase() + category.slice(1)
}

// Get category icon and styling
const getCategoryIcon = (category: string) => {
  return categoryIcons[category as keyof typeof categoryIcons] || {
    icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z',
    color: 'text-gray-500',
    bgColor: 'bg-gray-50'
  }
}

// Format value display (handle n.t.b. and special cases)
const formatValue = (value: string | null | undefined): string => {
  if (!value || value === 'n.t.b.' || value === 'n.t.b') {
    return 'Niet opgegeven'
  }
  return value
}

// Check if value is empty/not provided
const isEmptyValue = (value: string | null | undefined): boolean => {
  return !value || value === 'n.t.b.' || value === 'n.t.b'
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <Header />
    
    <main class="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div v-if="!ebike" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <div v-else class="max-w-7xl mx-auto">
        <!-- Breadcrumb -->
        <nav class="flex mb-8 text-sm text-gray-500">
          <router-link to="/" class="hover:text-blue-600 transition-colors">Home</router-link>
          <span class="mx-2">/</span>
          <router-link to="/ebikes" class="hover:text-blue-600 transition-colors">E-Bikes</router-link>
          <span class="mx-2">/</span>
          <span class="text-gray-900 font-medium">{{ ebike.brand }} {{ ebike.model_name }}</span>
        </nav>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <!-- Image Gallery -->
          <div class="space-y-6">
            <div 
              class="aspect-w-4 aspect-h-3 rounded-2xl overflow-hidden bg-white shadow-lg relative group cursor-pointer"
              @click="openImageCarousel(selectedImage)"
            >
              <img 
                :src="ebike.images && ebike.images.length > 0 ? ebike.images[selectedImage] : getEBikeImageUrl(ebike)" 
                :alt="ebike.model_name" 
                class="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300 flex items-center justify-center">
                <span class="opacity-0 group-hover:opacity-100 bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-medium shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  Vergroot Afbeelding
                </span>
              </div>
              <div v-if="ebike.on_sale" class="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                Aanbieding
              </div>
            </div>
            
            <div v-if="ebike.images && ebike.images.length > 1" class="grid grid-cols-4 gap-4">
              <button 
                v-for="(image, index) in ebike.images.slice(0, 4)" 
                :key="index"
                @click="selectedImage = index"
                class="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden border-2 transition-all duration-200 focus:outline-none relative group"
                :class="selectedImage === index ? 'border-blue-600 ring-2 ring-blue-200' : 'border-transparent hover:border-gray-300'"
              >
                <img :src="image" :alt="`${ebike.model_name} view ${index + 1}`" class="w-full h-full object-cover" />
                <div v-if="index === 3 && ebike.images.length > 4" class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span class="text-white font-medium text-lg">+{{ ebike.images.length - 4 }}</span>
                </div>
              </button>
            </div>
          </div>

          <!-- Product Info -->
          <div class="flex flex-col">
            <div class="mb-8">
              <div class="flex justify-between items-start">
                <div>
                  <h1 class="text-4xl font-bold text-gray-900 mb-2">{{ ebike.brand }} {{ ebike.model_name }}</h1>
                  <p class="text-xl text-gray-600">{{ ebike.version || 'Elektrische Fiets' }}</p>
                </div>
                <div class="flex space-x-3">
                  <button 
                    @click="toggleFavorite"
                    class="p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200"
                    :class="isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" :fill="isFavorite ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                  <button 
                    @click="addToComparison"
                    class="p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200 text-blue-600 hover:bg-blue-50"
                    title="Vergelijken"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div class="mt-6 flex items-baseline">
                <span class="text-4xl font-bold text-blue-600">€{{ ebike.price }}</span>
                <span v-if="ebike.old_price" class="ml-4 text-xl text-gray-400 line-through">€{{ ebike.old_price }}</span>
              </div>

              <!-- Key Features Grid -->
              <div class="grid grid-cols-2 gap-4 mt-8">
                <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <div class="text-gray-500 text-sm mb-1">Actieradius</div>
                  <div class="font-semibold text-gray-900 flex items-center">
                    <svg class="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {{ ebike.action_radius_km || ebike.action_radius_text || 'Onbekend' }}
                  </div>
                </div>
                <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <div class="text-gray-500 text-sm mb-1">Accu Capaciteit</div>
                  <div class="font-semibold text-gray-900 flex items-center">
                    <svg class="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    {{ ebike.battery_capacity ? ebike.battery_capacity + ' Wh' : 'Onbekend' }}
                  </div>
                </div>
                <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <div class="text-gray-500 text-sm mb-1">Motor Type</div>
                  <div class="font-semibold text-gray-900 flex items-center">
                    <svg class="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    {{ ebike.motor_location ? ebike.motor_location + ' Motor' : 'Onbekend' }}
                  </div>
                </div>
                <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <div class="text-gray-500 text-sm mb-1">Snelheid</div>
                  <div class="font-semibold text-gray-900 flex items-center">
                    <svg class="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {{ ebike.top_speed_kmh ? ebike.top_speed_kmh + ' km/u' : '25 km/u' }}
                  </div>
                </div>
              </div>

              <!-- Product Description -->
              <div v-if="filteredDescription" class="mt-8 sm:mt-10">
                <MarkdownRenderer :content="filteredDescription" />
              </div>

              <!-- Action Buttons -->
              <div class="mt-8 flex flex-col sm:flex-row gap-4">
                <button 
                  @click="handleExternalLinkClick"
                  class="flex-1 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
                >
                  <span>Bekijk Beste Deal</span>
                  <svg class="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
                <button 
                  class="flex-1 bg-white text-gray-900 border-2 border-gray-200 px-8 py-4 rounded-xl font-semibold hover:border-blue-600 hover:text-blue-600 transition-all duration-200"
                >
                  Proefrit Aanvragen
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabs Section -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden mt-12">
          <!-- Tab Navigation -->
          <div class="border-b border-gray-200">
            <nav class="flex space-x-8 px-8">
              <button
                @click="showSpecs = true; showReviews = false"
                :class="[
                  'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                  showSpecs ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-800 hover:text-gray-900 hover:border-gray-400'
                ]"
              >
                Specificaties
              </button>
              <button
                @click="showSpecs = false; showReviews = true"
                :class="[
                  'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                  showReviews ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-800 hover:text-gray-900 hover:border-gray-400'
                ]"
              >
                Reviews
              </button>
            </nav>
          </div>

          <!-- Tab Content -->
          <div class="p-8">
            <!-- Specifications Tab -->
            <div v-if="showSpecs" class="space-y-6">
              <div 
                v-for="(specs, category) in ebike.specifications" 
                :key="category"
                class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
              >
                <!-- Category Header with Icon -->
                <div class="flex items-center mb-6 pb-4 border-b border-gray-100">
                  <div :class="['p-2 rounded-lg', getCategoryIcon(category).bgColor]">
                    <svg 
                      class="w-6 h-6"
                      :class="getCategoryIcon(category).color"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      v-if="category === 'accu'"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM10 6a2 2 0 0 1 4 0v1h-4V6zm8 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h12v10z" />
                    </svg>
                    <svg 
                      class="w-6 h-6"
                      :class="getCategoryIcon(category).color"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      v-else-if="category === 'frame'"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <svg 
                      class="w-6 h-6"
                      :class="getCategoryIcon(category).color"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      v-else-if="category === 'motor'"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <svg 
                      class="w-6 h-6"
                      :class="getCategoryIcon(category).color"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      v-else-if="category === 'wielen'"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    <svg 
                      class="w-6 h-6"
                      :class="getCategoryIcon(category).color"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      v-else-if="category === 'algemeen'"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <svg 
                      class="w-6 h-6"
                      :class="getCategoryIcon(category).color"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      v-else
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <h3 class="ml-3 text-xl font-semibold text-gray-900">{{ getCategoryName(category) }}</h3>
                </div>
                
                <!-- Specification Items -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    v-for="(value, key) in specs" 
                    :key="key"
                    class="flex flex-col sm:flex-row sm:justify-between py-3 px-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <span class="font-medium text-gray-700 mb-1 sm:mb-0 sm:mr-4">{{ getReadableLabel(key) }}:</span>
                    <span 
                      :class="[
                        'text-gray-900 font-normal sm:text-right flex-1',
                        isEmptyValue(value) ? 'text-gray-400 italic' : ''
                      ]"
                    >
                      {{ formatValue(value) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Reviews Tab -->
            <div v-if="showReviews">
              <div class="text-center py-12 text-gray-500">
                <p>Nog geen reviews beschikbaar voor deze e-bike.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <Footer />
    
    <!-- Enhanced AI Chatbot -->
    <EnhancedAIChatbot />

    <!-- Full-Screen Image Carousel Modal -->
    <div
      v-if="showImageCarousel"
      class="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
      @click="closeImageCarousel"
    >
      <!-- Close Button -->
      <button
        @click="closeImageCarousel"
        class="absolute top-4 right-4 z-10 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-all duration-200"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>

      <!-- Navigation Arrows -->
      <button
        v-if="ebike?.images && ebike.images.length > 1"
        @click.stop="prevImage"
        class="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-3 transition-all duration-200"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>

      <button
        v-if="ebike?.images && ebike.images.length > 1"
        @click.stop="nextImage"
        class="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-3 transition-all duration-200"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>

      <!-- Main Image Container -->
      <div class="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center p-8" @click.stop>
        <img
          v-if="ebike?.images?.[carouselImageIndex]"
          :src="ebike.images[carouselImageIndex]"
          :alt="`${ebike.model_name} - Image ${carouselImageIndex + 1}`"
          class="max-w-full max-h-full object-contain"
        />
        <img
          v-else
          :src="getEBikeImageUrl(ebike)"
          :alt="ebike.model_name"
          class="max-w-full max-h-full object-contain"
        />
      </div>

      <!-- Image Counter -->
      <div
        v-if="ebike?.images && ebike.images.length > 1"
        class="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full text-sm"
      >
        {{ carouselImageIndex + 1 }} / {{ ebike.images.length }}
      </div>

      <!-- Thumbnail Strip -->
      <div
        v-if="ebike?.images && ebike.images.length > 1"
        class="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-2 max-w-4xl overflow-x-auto px-4"
      >
        <button
          v-for="(image, index) in ebike.images"
          :key="index"
          @click.stop="goToImage(index)"
          :class="[
            'flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all',
            carouselImageIndex === index 
              ? 'border-white' 
              : 'border-white border-opacity-50 hover:border-opacity-75'
          ]"
        >
          <img :src="image" :alt="`${ebike.model_name} view ${index + 1}`" class="w-full h-full object-cover" />
        </button>
      </div>
    </div>
  </div>
</template>
