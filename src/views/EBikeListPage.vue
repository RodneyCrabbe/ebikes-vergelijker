<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed, watch, shallowRef, defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEBikesStore } from '../stores/ebikes-simple'
import { useComparisonStore } from '../stores/comparison'
import { useFavoritesStore } from '../stores/favorites'
import { useAuthStore } from '../stores/auth'
import type { EBikeFilters } from '../types/ebike'
import { getEBikeImageUrl } from '../utils/imagePlaceholder'
import { topicalPages, getTopicalPageBySlug } from '../data/topicalPages'
import { useDebounce } from '../composables/useDebounce'
import { useVirtualizer } from '@tanstack/vue-virtual'
import Header from '../components/common/Header.vue'
import Footer from '../components/common/Footer.vue'
import LazyImage from '../components/LazyImage.vue'
import EBikeSkeleton from '../components/EBikeSkeleton.vue'

// Lazy load AI Chatbot only when needed
const EnhancedAIChatbot = defineAsyncComponent(() => import('../components/EnhancedAIChatbot.vue'))

const ebikeStore = useEBikesStore()
const comparisonStore = useComparisonStore()
const favoritesStore = useFavoritesStore()
const authStore = useAuthStore()

// View mode

// Mobile filter state
const showMobileFilters = ref(false)

// Enhanced filters with comprehensive options (using shallowRef for better performance)
const filters = shallowRef<EBikeFilters>({
  // Basic filters
  brand: undefined,
  gender_type: undefined,
  bike_type: undefined,
  color: undefined,
  
  // Price and performance ranges
  min_price: undefined,
  max_price: undefined,
  min_action_radius: undefined,
  max_action_radius: undefined,
  min_battery_capacity: undefined,
  max_battery_capacity: undefined,
  min_top_speed: undefined,
  max_top_speed: undefined,
  min_torque: undefined,
  max_torque: undefined,
  min_weight: undefined,
  max_weight: undefined,
  
  // Motor specifications
  motor_location: undefined,
  motor_brand: undefined,
  motor_type: undefined,
  torque_range: undefined,
  
  // Drivetrain and mechanics
  gear_type: undefined,
  brake_type: undefined,
  drive_type: undefined,
  frame_material: undefined,
  wheel_size: undefined,
  suspension_type: undefined,
  
  // Battery specifications
  battery_type: undefined,
  battery_position: undefined,
  removable_battery: undefined,
  
  // Features and accessories
  seating_position: undefined,
  lighting_type: undefined,
  display_type: undefined,
  connectivity_type: undefined,
  
  // Special features
  special_features: undefined,
  warranty_range: undefined,
  
  // Status and availability
  on_sale: undefined,
  new_collection: undefined,
  outlet: undefined,
  free_shipping: undefined
})

// Search with debouncing
const searchQuery = ref('')
const debouncedSearchQuery = useDebounce(searchQuery, 300) // 300ms debounce delay
const route = useRoute()
const router = useRouter()

const topicalPage = computed(() => {
  const metaSlug = route.meta?.topicalSlug as string | undefined
  const querySlug = (route.query.topical as string) || metaSlug
  return getTopicalPageBySlug(querySlug || route.path) || null
})

const topicalIdSet = computed(() => {
  if (!topicalPage.value) return null
  return new Set(topicalPage.value.ebikeIds)
})

const topicalTitle = computed(() => topicalPage.value?.title ?? 'Alle e-bikes')
const topicalDescription = computed(() => topicalPage.value?.description ?? 'Vind de beste e-bikes met onze filters en vergelijkingen.')
const topicalIntent = computed(() => topicalPage.value?.intent)

// Initialize search from URL query parameter
onMounted(() => {
  if (route.query.search) {
    searchQuery.value = route.query.search as string
  }
})

// Watch for route changes to update search query
watch(() => route.query.search, (newSearch) => {
  if (newSearch) {
    searchQuery.value = newSearch as string
  } else {
    searchQuery.value = ''
  }
})

// Clear search when navigating away from e-bikes page
const clearSearch = () => {
  searchQuery.value = ''
}

// Sorting
const sortBy = ref<'price' | 'action_radius' | 'battery_capacity' | 'created_at'>('created_at')
const sortOrder = ref<'asc' | 'desc'>('desc')

// Available filter options
const brands = computed(() => {
  if (!ebikeStore.ebikes || !Array.isArray(ebikeStore.ebikes)) {
    return []
  }
  const uniqueBrands = new Set(ebikeStore.ebikes.map(e => e.brand))
  return Array.from(uniqueBrands).sort()
})

// Enhanced filter options based on 12GO Biking and ANWB
const bikeTypes = [
  'stadsfiets', 'transport', 'vouwfiets', 'mountainbike', 'trekking', 
  'premium', 'bakfiets', 'racefiets', 'hybride', 'gravelbike', 
  'moederfiets', 'longtail', 'speed-pedelec', 'elektrische-mountainbike'
]

const genderTypes = ['unisex', 'man', 'vrouw']
const colors = ['zwart', 'wit', 'grijs', 'blauw', 'rood', 'groen', 'geel', 'oranje', 'zilver', 'goud']
const motorLocations = ['midden', 'achterwiel', 'voorwiel']

// New comprehensive filter options
const motorBrands = ['Bosch', 'Shimano', 'Bafang', 'Yamaha', 'Brose', 'Fazua', 'Mahle', 'TQ']
const motorTypes = ['Performance Line', 'Performance CX', 'Active Line', 'Cargo Line', 'Intuvia', 'Kiox', 'Purion']
const gearTypes = ['naafversnelling', 'derailleur', 'enviolo', 'enkelvoudig', 'cvt', 'automatisch']
const brakeTypes = ['schijfrem', 'velgrem', 'hydraulisch', 'mechanisch', 'hydraulische-schijfrem', 'v-brake']
const frameMaterials = ['aluminium', 'carbon', 'staal', 'titanium', 'magnesium']
const wheelSizes = ['20"', '24"', '26"', '27.5"', '28"', '29"', '700c']
const batteryTypes = ['lithium-ion', 'lithium-polymer', 'loodzuur']
const batteryPositions = ['bagagedrager', 'frame', 'geïntegreerd']
const seatingPositions = ['recht', 'gebogen', 'sportief']
const driveTypes = ['ketting', 'riem', 'naafmotor']
const suspensionTypes = ['geen', 'voorvork', 'volledige-vering', 'achtervering']
const lightingTypes = ['geen', 'led', 'halogeen', 'dynamo']
const displayTypes = ['geen', 'intuvia', 'kiox', 'purion', 'led', 'lcd']
const connectivityTypes = ['geen', 'bluetooth', 'wifi', 'gps', 'app']
const torqueRanges = ['<50Nm', '50-70Nm', '70-85Nm', '85-100Nm', '>100Nm']
const warrantyRanges = ['1 jaar', '2 jaar', '3 jaar', '4 jaar', '5+ jaar']
const specialFeatures = ['opvouwbaar', 'lichtgewicht', 'goedkoop', 'premium', 'nieuw', 'outlet', 'gratis-verzending']

// Optimized single-pass filter predicate function
const createFilterPredicate = () => {
  const searchQuery = debouncedSearchQuery.value?.toLowerCase() || ''
  const filterValues = filters.value

  return (ebike: any): boolean => {
    // Topical page filter
    if (topicalIdSet.value && !topicalIdSet.value.has(ebike.id)) {
      return false
    }

    // Search filter (single pass)
    if (searchQuery) {
      const matchesSearch =
        ebike.brand.toLowerCase().includes(searchQuery) ||
        ebike.model_name.toLowerCase().includes(searchQuery) ||
        (ebike.version && ebike.version.toLowerCase().includes(searchQuery)) ||
        (ebike.description && ebike.description.toLowerCase().includes(searchQuery)) ||
        (ebike.bike_type && ebike.bike_type.toLowerCase().includes(searchQuery)) ||
        (ebike.color && ebike.color.toLowerCase().includes(searchQuery)) ||
        (ebike.motor_location && ebike.motor_location.toLowerCase().includes(searchQuery))
      if (!matchesSearch) return false
    }

    // All filters in single pass
    if (filterValues.brand && ebike.brand !== filterValues.brand) return false
    if (filterValues.gender_type && ebike.gender_type !== filterValues.gender_type) return false
    if (filterValues.bike_type && ebike.bike_type !== filterValues.bike_type) return false
    if (filterValues.color && ebike.color !== filterValues.color) return false
    if (filterValues.motor_location && ebike.motor_location !== filterValues.motor_location) return false
    if (filterValues.removable_battery !== undefined && ebike.removable_battery !== filterValues.removable_battery) return false
    if (filterValues.on_sale !== undefined && ebike.on_sale !== filterValues.on_sale) return false

    // Range filters
    if (filterValues.min_price !== undefined && (!ebike.price || ebike.price < filterValues.min_price)) return false
    if (filterValues.max_price !== undefined && (!ebike.price || ebike.price > filterValues.max_price)) return false
    if (filterValues.min_action_radius !== undefined && (!ebike.action_radius_km || ebike.action_radius_km < filterValues.min_action_radius)) return false
    if (filterValues.max_action_radius !== undefined && (!ebike.action_radius_km || ebike.action_radius_km > filterValues.max_action_radius)) return false
    if (filterValues.min_battery_capacity !== undefined && (!ebike.battery_capacity || ebike.battery_capacity < filterValues.min_battery_capacity)) return false
    if (filterValues.max_battery_capacity !== undefined && (!ebike.battery_capacity || ebike.battery_capacity > filterValues.max_battery_capacity)) return false

    return true
  }
}

// Filtered and sorted e-bikes (optimized single-pass filtering)
const filteredEBikes = computed(() => {
  if (!ebikeStore.ebikes || !Array.isArray(ebikeStore.ebikes)) {
    return []
  }

  // Single-pass filtering
  const predicate = createFilterPredicate()
  let result = ebikeStore.ebikes.filter(predicate)

  // Apply sorting
  result.sort((a, b) => {
    let aVal: any, bVal: any

    switch (sortBy.value) {
      case 'price':
        aVal = a.price || 0
        bVal = b.price || 0
        break
      case 'action_radius':
        aVal = a.action_radius_km || 0
        bVal = b.action_radius_km || 0
        break
      case 'battery_capacity':
        aVal = a.battery_capacity || 0
        bVal = b.battery_capacity || 0
        break
      case 'created_at':
        aVal = new Date(a.created_at).getTime()
        bVal = new Date(b.created_at).getTime()
        break
      default:
        return 0
    }

    if (sortOrder.value === 'asc') {
      return aVal - bVal
    } else {
      return bVal - aVal
    }
  })

  return result
})

const totalPool = computed(() => {
  if (topicalPage.value) return topicalPage.value.ebikeIds.length
  return ebikeStore.totalEBikes || ebikeStore.ebikes.length
})

// Clear filters
const clearFilters = () => {
  filters.value = {
    brand: undefined,
    gender_type: undefined,
    min_price: undefined,
    max_price: undefined,
    min_action_radius: undefined,
    max_action_radius: undefined,
    min_battery_capacity: undefined,
    max_battery_capacity: undefined,
    bike_type: undefined,
    color: undefined,
    motor_location: undefined,
    removable_battery: undefined,
    on_sale: undefined
  }
  searchQuery.value = ''
}

// Toggle mobile filters
const toggleMobileFilters = () => {
  showMobileFilters.value = !showMobileFilters.value
}

// Close mobile filters
const closeMobileFilters = () => {
  showMobileFilters.value = false
}

// Active filter count for mobile button
const activeFilterCount = computed(() => {
  let count = 0
  // Basic filters
  if (filters.value.brand) count++
  if (filters.value.gender_type) count++
  if (filters.value.bike_type) count++
  if (filters.value.color) count++
  
  // Price and performance ranges
  if (filters.value.min_price !== undefined) count++
  if (filters.value.max_price !== undefined) count++
  if (filters.value.min_action_radius !== undefined) count++
  if (filters.value.max_action_radius !== undefined) count++
  if (filters.value.min_battery_capacity !== undefined) count++
  if (filters.value.max_battery_capacity !== undefined) count++
  if (filters.value.min_top_speed !== undefined) count++
  if (filters.value.max_top_speed !== undefined) count++
  if (filters.value.min_torque !== undefined) count++
  if (filters.value.max_torque !== undefined) count++
  if (filters.value.min_weight !== undefined) count++
  if (filters.value.max_weight !== undefined) count++
  
  // Motor specifications
  if (filters.value.motor_location) count++
  if (filters.value.motor_brand) count++
  if (filters.value.motor_type) count++
  if (filters.value.torque_range) count++
  
  // Drivetrain and mechanics
  if (filters.value.gear_type) count++
  if (filters.value.brake_type) count++
  if (filters.value.drive_type) count++
  if (filters.value.frame_material) count++
  if (filters.value.wheel_size) count++
  if (filters.value.suspension_type) count++
  
  // Battery specifications
  if (filters.value.battery_type) count++
  if (filters.value.battery_position) count++
  if (filters.value.removable_battery !== undefined) count++
  
  // Features and accessories
  if (filters.value.seating_position) count++
  if (filters.value.lighting_type) count++
  if (filters.value.display_type) count++
  if (filters.value.connectivity_type) count++
  
  // Special features
  if (filters.value.special_features && filters.value.special_features.length > 0) count++
  if (filters.value.warranty_range) count++
  
  // Status and availability
  if (filters.value.on_sale !== undefined) count++
  if (filters.value.new_collection !== undefined) count++
  if (filters.value.outlet !== undefined) count++
  if (filters.value.free_shipping !== undefined) count++
  
  return count
})

const hasActiveFilters = computed(() => activeFilterCount.value > 0)

// Comparison functions
const isInComparison = (ebikeId: string) => {
  return comparisonStore.comparisonItems && Array.isArray(comparisonStore.comparisonItems) 
    ? comparisonStore.comparisonItems.some(e => e.id === ebikeId)
    : false
}

const toggleComparison = (ebike: any) => {
  if (isInComparison(ebike.id)) {
    comparisonStore.removeFromComparison(ebike.id)
  } else {
    comparisonStore.addToComparison(ebike)
  }
}

// Favorites functions
const isInFavorites = (ebikeId: string) => {
  return favoritesStore.favorites && Array.isArray(favoritesStore.favorites)
    ? favoritesStore.favorites.some(e => e.id === ebikeId)
    : false
}

const toggleFavorite = async (ebike: any) => {
  if (!authStore.user) {
    // Redirect to login or show message
    alert('Log in om favorieten toe te voegen')
    return
  }

  if (isInFavorites(ebike.id)) {
    await favoritesStore.removeFromFavorites(ebike.id)
  } else {
    await favoritesStore.addToFavorites(ebike)
  }
}

// Removed unused affiliate click tracking function

// Navigation function
const navigateToDetail = (ebikeId: string) => {
  router.push(`/e-bikes/${ebikeId}`)
}

// Virtual scrolling setup for grid layout
const gridContainerRef = ref<HTMLElement>()
const itemsPerRow = computed(() => {
  // Calculate based on screen size (matching grid-cols classes)
  if (typeof window === 'undefined') return 5
  const width = window.innerWidth
  if (width >= 1536) return 5 // 2xl
  if (width >= 1280) return 4 // xl
  if (width >= 1024) return 3 // lg
  if (width >= 640) return 2  // sm
  return 1 // mobile
})

// Calculate rows for virtual scrolling
const rows = computed(() => {
  const items = filteredEBikes.value
  const perRow = itemsPerRow.value
  const rowCount = Math.ceil(items.length / perRow)
  return Array.from({ length: rowCount }, (_, i) => {
    const start = i * perRow
    const end = start + perRow
    return items.slice(start, end)
  })
})

const rowVirtualizer = useVirtualizer({
  count: computed(() => rows.value.length),
  getScrollElement: () => gridContainerRef.value || undefined,
  estimateSize: () => 320, // Estimated row height
  overscan: 5, // Render 5 extra rows for smooth scrolling
})

onMounted(async () => {
  await ebikeStore.fetchEBikes()
  if (authStore.user) {
    await favoritesStore.fetchFavorites()
  }
})


</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <Header />

    <main class="flex-1 py-8">
      <div class="w-full">
        <!-- Add spacing at the top -->
        <div class="mb-8 lg:mb-12"></div>

        <!-- Topical banner -->
        <div
          v-if="topicalPage"
          class="mx-6 lg:mx-8 mb-6 lg:mb-8 rounded-2xl overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white shadow-lg"
        >
          <div class="p-6 lg:p-8 space-y-3">
            <div class="flex items-center gap-3 flex-wrap">
              <span class="px-3 py-1 text-xs font-semibold uppercase tracking-wide bg-white/20 rounded-full">
                {{ topicalPage.template }}
              </span>
              <span v-if="topicalIntent" class="text-sm text-white/90">
                {{ topicalIntent }}
              </span>
            </div>
            <h1 class="text-2xl lg:text-3xl font-bold leading-snug">{{ topicalTitle }}</h1>
            <p class="text-white/90 max-w-4xl text-sm lg:text-base">
              {{ topicalDescription }}
            </p>
          </div>
        </div>

        <!-- Mobile Filter Status and View Toggle -->
        <div class="mb-6 flex flex-col lg:flex-row gap-4 items-center justify-between px-6">
          <!-- Mobile Filter Status -->
          <div v-if="hasActiveFilters" class="lg:hidden w-full bg-blue-50/50 border border-blue-200/50 rounded-xl p-3 mb-2 backdrop-blur-sm">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
              </svg>
                <span class="text-sm font-medium text-blue-800">{{ activeFilterCount }} filter(s) actief</span>
              </div>
              <button @click="clearFilters" class="text-sm text-blue-600 hover:text-blue-800 font-medium">
                Wissen
              </button>
            </div>
          </div>

          <div class="flex gap-3 w-full lg:w-auto">
            <!-- Mobile Filter Button -->
            <button
              @click="toggleMobileFilters"
              class="lg:hidden flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl text-lg"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
              </svg>
              <span>Filters</span>
              <span v-if="hasActiveFilters" class="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                {{ activeFilterCount }}
              </span>
            </button>

          </div>
        </div>

        <!-- Main Content Layout -->
        <div class="flex">
          <!-- Left Sidebar Filters (Desktop) -->
          <div class="hidden lg:block w-80 flex-shrink-0">
            <div class="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm sticky top-4 mx-6 border border-gray-100/50">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-lg font-semibold text-gray-900">Filters</h3>
                <button 
                  @click="clearFilters"
                  class="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Wissen
                </button>
              </div>

              <div class="space-y-6">
                <!-- Sorting - Moved to top -->
                <div class="pb-4 border-b border-gray-200">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Sorteren op</label>
                  <select v-model="sortBy" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="created_at">Nieuwste eerst</option>
                    <option value="price">Prijs (laag-hoog)</option>
                    <option value="action_radius">Bereik (hoog-laag)</option>
                    <option value="battery_capacity">Accu (hoog-laag)</option>
                  </select>
                </div>

                <!-- Brand Filter -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Merk</label>
                  <select v-model="filters.brand" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option :value="undefined">Alle merken</option>
                    <option v-for="brand in brands" :key="brand" :value="brand">{{ brand }}</option>
                  </select>
                </div>

                <!-- Bike Type Filter -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select v-model="filters.bike_type" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option :value="undefined">Alle types</option>
                    <option v-for="type in bikeTypes" :key="type" :value="type">{{ type }}</option>
                  </select>
                </div>

                <!-- Gender Type Filter -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Doelgroep</label>
                  <select v-model="filters.gender_type" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option :value="undefined">Alle</option>
                    <option v-for="gender in genderTypes" :key="gender" :value="gender">{{ gender }}</option>
                  </select>
                </div>

                <!-- Price Range -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-3">Prijs (€)</label>
                  <div class="space-y-2">
                    <input 
                      v-model.number="filters.min_price" 
                      type="number" 
                      placeholder="Min prijs" 
                      class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                    <input 
                      v-model.number="filters.max_price" 
                      type="number" 
                      placeholder="Max prijs" 
                      class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                  </div>
                </div>

                <!-- Action Radius -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-3">Actieradius (km)</label>
                  <div class="space-y-2">
                    <input 
                      v-model.number="filters.min_action_radius" 
                      type="number" 
                      placeholder="Min bereik" 
                      class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                    <input 
                      v-model.number="filters.max_action_radius" 
                      type="number" 
                      placeholder="Max bereik" 
                      class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                  </div>
                </div>

                <!-- Battery Capacity -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-3">Accucapaciteit (Wh)</label>
                  <div class="space-y-2">
                    <input 
                      v-model.number="filters.min_battery_capacity" 
                      type="number" 
                      placeholder="Min capaciteit" 
                      class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                    <input 
                      v-model.number="filters.max_battery_capacity" 
                      type="number" 
                      placeholder="Max capaciteit" 
                      class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                  </div>
                </div>

                <!-- Color Filter -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Kleur</label>
                  <select v-model="filters.color" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option :value="undefined">Alle kleuren</option>
                    <option v-for="color in colors" :key="color" :value="color">{{ color }}</option>
                  </select>
                </div>

                <!-- Motor Location -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Motorpositie</label>
                  <select v-model="filters.motor_location" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option :value="undefined">Alle posities</option>
                    <option v-for="location in motorLocations" :key="location" :value="location">{{ location }}</option>
                  </select>
                </div>

                <!-- Removable Battery -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Verwijderbare accu</label>
                  <select v-model="filters.removable_battery" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option :value="undefined">Alle</option>
                    <option :value="true">Ja</option>
                    <option :value="false">Nee</option>
                  </select>
                </div>

                <!-- On Sale -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Aanbieding</label>
                  <select v-model="filters.on_sale" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option :value="undefined">Alle</option>
                    <option :value="true">Alleen aanbiedingen</option>
                    <option :value="false">Geen aanbiedingen</option>
                  </select>
                </div>

                <!-- Motor Specifications Section -->
                <div class="border-t border-gray-200 pt-6">
                  <h4 class="text-lg font-semibold text-gray-900 mb-4">Motor Specificaties</h4>
                  
                  <!-- Motor Brand -->
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Motormerk</label>
                    <select v-model="filters.motor_brand" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option :value="undefined">Alle merken</option>
                      <option v-for="brand in motorBrands" :key="brand" :value="brand">{{ brand }}</option>
                  </select>
                </div>

                  <!-- Motor Type -->
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Motortype</label>
                    <select v-model="filters.motor_type" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option :value="undefined">Alle types</option>
                      <option v-for="type in motorTypes" :key="type" :value="type">{{ type }}</option>
                    </select>
                  </div>

                  <!-- Torque Range -->
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Koppel (Nm)</label>
                    <select v-model="filters.torque_range" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option :value="undefined">Alle koppel</option>
                      <option v-for="range in torqueRanges" :key="range" :value="range">{{ range }}</option>
                    </select>
                  </div>
                </div>

                <!-- Drivetrain & Mechanics Section -->
                <div class="border-t border-gray-200 pt-6">
                  <h4 class="text-lg font-semibold text-gray-900 mb-4">Aandrijving & Mechaniek</h4>
                  
                  <!-- Gear Type -->
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Versnelling</label>
                    <select v-model="filters.gear_type" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option :value="undefined">Alle types</option>
                      <option v-for="type in gearTypes" :key="type" :value="type">{{ type }}</option>
                    </select>
                  </div>

                  <!-- Brake Type -->
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Remsysteem</label>
                    <select v-model="filters.brake_type" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option :value="undefined">Alle types</option>
                      <option v-for="type in brakeTypes" :key="type" :value="type">{{ type }}</option>
                    </select>
                  </div>

                  <!-- Drive Type -->
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Aandrijving</label>
                    <select v-model="filters.drive_type" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option :value="undefined">Alle types</option>
                      <option v-for="type in driveTypes" :key="type" :value="type">{{ type }}</option>
                    </select>
                  </div>

                  <!-- Frame Material -->
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Framemateriaal</label>
                    <select v-model="filters.frame_material" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option :value="undefined">Alle materialen</option>
                      <option v-for="material in frameMaterials" :key="material" :value="material">{{ material }}</option>
                    </select>
                  </div>

                  <!-- Wheel Size -->
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Wielmaat</label>
                    <select v-model="filters.wheel_size" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option :value="undefined">Alle maten</option>
                      <option v-for="size in wheelSizes" :key="size" :value="size">{{ size }}</option>
                    </select>
                  </div>

                  <!-- Suspension Type -->
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Vering</label>
                    <select v-model="filters.suspension_type" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option :value="undefined">Alle types</option>
                      <option v-for="type in suspensionTypes" :key="type" :value="type">{{ type }}</option>
                    </select>
                  </div>
                </div>

                <!-- Battery Specifications Section -->
                <div class="border-t border-gray-200 pt-6">
                  <h4 class="text-lg font-semibold text-gray-900 mb-4">Accu Specificaties</h4>
                  
                  <!-- Battery Type -->
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Accutype</label>
                    <select v-model="filters.battery_type" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option :value="undefined">Alle types</option>
                      <option v-for="type in batteryTypes" :key="type" :value="type">{{ type }}</option>
                    </select>
                  </div>

                  <!-- Battery Position -->
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Accupositie</label>
                    <select v-model="filters.battery_position" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option :value="undefined">Alle posities</option>
                      <option v-for="position in batteryPositions" :key="position" :value="position">{{ position }}</option>
                    </select>
                  </div>
                </div>

                <!-- Features & Accessories Section -->
                <div class="border-t border-gray-200 pt-6">
                  <h4 class="text-lg font-semibold text-gray-900 mb-4">Features & Accessoires</h4>
                  
                  <!-- Seating Position -->
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Zithouding</label>
                    <select v-model="filters.seating_position" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option :value="undefined">Alle houdingen</option>
                      <option v-for="position in seatingPositions" :key="position" :value="position">{{ position }}</option>
                    </select>
                  </div>

                  <!-- Lighting Type -->
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Verlichting</label>
                    <select v-model="filters.lighting_type" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option :value="undefined">Alle types</option>
                      <option v-for="type in lightingTypes" :key="type" :value="type">{{ type }}</option>
                    </select>
                  </div>

                  <!-- Display Type -->
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Display</label>
                    <select v-model="filters.display_type" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option :value="undefined">Alle types</option>
                      <option v-for="type in displayTypes" :key="type" :value="type">{{ type }}</option>
                    </select>
                  </div>

                  <!-- Connectivity Type -->
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Connectiviteit</label>
                    <select v-model="filters.connectivity_type" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option :value="undefined">Alle types</option>
                      <option v-for="type in connectivityTypes" :key="type" :value="type">{{ type }}</option>
                    </select>
                  </div>
                </div>

                <!-- Special Features Section -->
                <div class="border-t border-gray-200 pt-6">
                  <h4 class="text-lg font-semibold text-gray-900 mb-4">Speciale Features</h4>
                  
                  <!-- Special Features Checkboxes -->
                  <div class="space-y-2">
                    <label v-for="feature in specialFeatures" :key="feature" class="flex items-center">
                      <input 
                        type="checkbox" 
                        :value="feature"
                        v-model="filters.special_features"
                        class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <span class="ml-2 text-sm text-gray-700">{{ feature }}</span>
                    </label>
                  </div>

                  <!-- Warranty Range -->
                  <div class="mt-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Garantie</label>
                    <select v-model="filters.warranty_range" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option :value="undefined">Alle garanties</option>
                      <option v-for="range in warrantyRanges" :key="range" :value="range">{{ range }}</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Main Content Area -->
          <div class="flex-1 min-w-0">
            <!-- Loading State -->
            <div v-if="ebikeStore.loading" class="px-6">
              <EBikeSkeleton :count="12" />
            </div>

            <!-- Error State -->
            <div v-else-if="ebikeStore.error" class="text-center py-12 px-6">
              <p class="text-red-600 text-lg">{{ ebikeStore.error }}</p>
            </div>

            <!-- Empty State -->
            <div v-else-if="filteredEBikes.length === 0" class="text-center py-12 px-6">
              <svg class="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h3 class="text-2xl font-semibold text-gray-900 mb-2">Geen e-bikes gevonden</h3>
              <p class="text-gray-600 mb-6">Probeer andere filters of zoektermen</p>
              <button @click="clearFilters" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                Filters wissen
              </button>
            </div>

            <!-- Search Results Header -->
            <div v-if="searchQuery" class="px-6 mb-6">
              <div class="bg-blue-50/50 border border-blue-200/50 rounded-xl p-4 backdrop-blur-sm">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    <div>
                      <h3 class="text-lg font-semibold text-gray-900">
                        Zoekresultaten voor "{{ searchQuery }}"
                      </h3>
                      <p class="text-sm text-gray-600">
                        {{ filteredEBikes.length }} e-bike(s) gevonden
                      </p>
                    </div>
                  </div>
                  <button
                    @click="searchQuery = ''"
                    class="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                  >
                    Wissen
                  </button>
                </div>
              </div>
            </div>

            <!-- E-bike Grid with Virtual Scrolling -->
            <div v-if="!ebikeStore.loading && !ebikeStore.error && filteredEBikes.length > 0" class="px-6">
              <!-- Count indicator -->
              <div class="mb-4 text-sm text-gray-600">
                {{ filteredEBikes.length }} van {{ totalPool }} e-bikes
              </div>
              <div
                ref="gridContainerRef"
                class="overflow-auto"
                style="height: calc(100vh - 300px);"
              >
                <div
                  :style="{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                    position: 'relative',
                  }"
                >
                  <div
                    v-for="virtualRow in rowVirtualizer.getVirtualItems()"
                    :key="virtualRow.key"
                    :style="{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }"
                  >
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 pb-4">
                      <div
                        v-for="ebike in rows[virtualRow.index]"
                        :key="ebike.id"
                        @click="navigateToDetail(ebike.id)"
                        class="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border border-gray-100/50 cursor-pointer"
                      >
                <!-- Image -->
                <div class="relative h-40 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
                  <LazyImage
                    :src="getEBikeImageUrl(ebike)"
                    :alt="ebike.model_name"
                    height="160px"
                    img-class="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  <!-- Gradient Overlay -->
                  <div class="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>

                  <!-- Brand Badge -->
                  <div class="absolute top-2 right-2 glass-badge px-2 py-1 rounded-full text-xs font-bold text-gray-800 shadow-md">
                    {{ ebike.brand }}
                  </div>

                  <!-- Favorite Button -->
                  <button
                    @click.prevent="toggleFavorite(ebike)"
                    class="absolute top-2 left-2 w-7 h-7 glass-badge rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-md"
                  >
                    <svg
                      :class="[
                        'w-4 h-4 transition-all duration-300',
                        isInFavorites(ebike.id) ? 'text-red-500 fill-current scale-110' : 'text-gray-700'
                      ]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                  </button>

                  <!-- Price Display - More Compact -->
                  <div class="absolute bottom-2 left-2 right-2 flex justify-between items-end">
                    <div class="glass-price px-3 py-1.5 rounded-lg shadow-lg">
                      <div class="text-xs font-medium text-gray-600">Prijs</div>
                      <div class="text-base font-bold text-gray-900">
                    <span v-if="ebike.price && ebike.price > 0">€{{ ebike.price.toLocaleString() }}</span>
                        <span v-else class="text-sm">Op aanvraag</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Content -->
                <div class="p-3 bg-white/40 backdrop-blur-sm">
                  <h3 class="text-sm font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[2.5rem]">
                    {{ ebike.model_name }}
                  </h3>

                  <!-- Features -->
                  <div class="space-y-1.5 mb-3">
                    <div v-if="ebike.action_radius_km" class="flex items-center text-gray-700 text-xs">
                      <div class="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center mr-1.5">
                        <svg class="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      </svg>
                    </div>
                      <span class="font-medium">{{ ebike.action_radius_km }}km bereik</span>
                    </div>
                    <div v-if="ebike.battery_capacity" class="flex items-center text-gray-700 text-xs">
                      <div class="w-6 h-6 rounded-lg bg-green-100 flex items-center justify-center mr-1.5">
                        <svg class="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                      <span class="font-medium">{{ ebike.battery_capacity }}Wh accu</span>
                    </div>
                    <div v-if="ebike.top_speed_kmh" class="flex items-center text-gray-700 text-xs">
                      <div class="w-6 h-6 rounded-lg bg-purple-100 flex items-center justify-center mr-1.5">
                        <svg class="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                      </svg>
                      </div>
                      <span class="font-medium">{{ ebike.top_speed_kmh }}km/h topsnelheid</span>
                    </div>
                    <div v-if="ebike.bike_type" class="flex items-center text-gray-700 text-xs">
                      <div class="w-6 h-6 rounded-lg bg-orange-100 flex items-center justify-center mr-1.5">
                        <svg class="w-3 h-3 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                      </svg>
                      </div>
                      <span class="font-medium">{{ ebike.bike_type }}</span>
                    </div>
                    <div v-if="ebike.motor_location" class="flex items-center text-gray-700 text-xs">
                      <div class="w-6 h-6 rounded-lg bg-red-100 flex items-center justify-center mr-1.5">
                        <svg class="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                      </svg>
                      </div>
                      <span class="font-medium">{{ ebike.motor_location }} motor</span>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="flex gap-1.5">
                    <RouterLink
                      :to="`/e-bikes/${ebike.id}`"
                      class="flex-1 text-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-3 py-2 rounded-lg font-semibold text-xs transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      Details
                    </RouterLink>
                    <button
                      @click.stop="toggleComparison(ebike)"
                      :class="[
                        'px-3 py-2 rounded-lg font-semibold text-xs transition-all duration-300 shadow-md hover:shadow-lg',
                        isInComparison(ebike.id)
                          ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800'
                          : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white border border-gray-200/50'
                      ]"
                      :title="isInComparison(ebike.id) ? 'Verwijderen uit vergelijking' : 'Toevoegen aan vergelijking'"
                    >
                      {{ isInComparison(ebike.id) ? 'Verwijder' : 'Vergelijk' }}
                    </button>
                  </div>
                </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile Filter Modal -->
        <Transition name="slide-up">
          <div v-if="showMobileFilters" class="fixed inset-0 z-50 lg:hidden">
            <!-- Backdrop -->
            <div
              class="fixed inset-0 bg-black/50 backdrop-blur-sm"
              @click="closeMobileFilters"
            ></div>

            <!-- Modal Content -->
            <div class="fixed inset-x-0 bottom-0 max-h-[90vh] bg-white/95 backdrop-blur-md rounded-t-3xl shadow-2xl overflow-hidden flex flex-col border-t border-gray-200/50">
              <!-- Header -->
              <div class="flex items-center justify-between p-6 border-b border-gray-200/50 bg-gradient-to-r from-blue-50/50 to-purple-50/50 backdrop-blur-sm">
                <h3 class="text-xl font-bold text-gray-900">Filters</h3>
                <button
                  @click="closeMobileFilters"
                  class="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-md"
                >
                  <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              <!-- Scrollable Filter Content -->
              <div class="flex-1 overflow-y-auto p-6">
                <div class="space-y-6">
                  <!-- Sorting - Moved to top -->
                  <div class="pb-4 border-b border-gray-200">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Sorteren op</label>
                    <select v-model="sortBy" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="created_at">Nieuwste eerst</option>
                      <option value="price">Prijs (laag-hoog)</option>
                      <option value="action_radius">Bereik (hoog-laag)</option>
                      <option value="battery_capacity">Accu (hoog-laag)</option>
                    </select>
                  </div>

                  <!-- Brand Filter -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Merk</label>
                    <select v-model="filters.brand" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option :value="undefined">Alle merken</option>
                      <option v-for="brand in brands" :key="brand" :value="brand">{{ brand }}</option>
                    </select>
                  </div>

                  <!-- Bike Type Filter -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select v-model="filters.bike_type" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option :value="undefined">Alle types</option>
                      <option v-for="type in bikeTypes" :key="type" :value="type">{{ type }}</option>
                    </select>
                  </div>

                  <!-- Gender Type Filter -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Doelgroep</label>
                    <select v-model="filters.gender_type" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option :value="undefined">Alle</option>
                      <option v-for="gender in genderTypes" :key="gender" :value="gender">{{ gender }}</option>
                    </select>
                  </div>

                  <!-- Price Range -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-3">Prijs (€)</label>
                    <div class="space-y-2">
                      <input
                        v-model.number="filters.min_price"
                        type="number"
                        placeholder="Min prijs"
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        v-model.number="filters.max_price"
                        type="number"
                        placeholder="Max prijs"
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <!-- Action Radius -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-3">Actieradius (km)</label>
                    <div class="space-y-2">
                      <input
                        v-model.number="filters.min_action_radius"
                        type="number"
                        placeholder="Min bereik"
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        v-model.number="filters.max_action_radius"
                        type="number"
                        placeholder="Max bereik"
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    </div>

                  <!-- Battery Capacity -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-3">Accucapaciteit (Wh)</label>
                    <div class="space-y-2">
                      <input
                        v-model.number="filters.min_battery_capacity"
                        type="number"
                        placeholder="Min capaciteit"
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        v-model.number="filters.max_battery_capacity"
                        type="number"
                        placeholder="Max capaciteit"
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <!-- Color Filter -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Kleur</label>
                    <select v-model="filters.color" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option :value="undefined">Alle kleuren</option>
                      <option v-for="color in colors" :key="color" :value="color">{{ color }}</option>
                    </select>
                    </div>

                  <!-- Motor Location -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Motorpositie</label>
                    <select v-model="filters.motor_location" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option :value="undefined">Alle posities</option>
                      <option v-for="location in motorLocations" :key="location" :value="location">{{ location }}</option>
                    </select>
                      </div>

                  <!-- Removable Battery -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Verwijderbare accu</label>
                    <select v-model="filters.removable_battery" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option :value="undefined">Alle</option>
                      <option :value="true">Ja</option>
                      <option :value="false">Nee</option>
                    </select>
                      </div>

                  <!-- On Sale -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Aanbieding</label>
                    <select v-model="filters.on_sale" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option :value="undefined">Alle</option>
                      <option :value="true">Alleen aanbiedingen</option>
                      <option :value="false">Geen aanbiedingen</option>
                    </select>
                      </div>

                  <!-- Motor Specifications Section -->
                  <div class="border-t border-gray-200 pt-6">
                    <h4 class="text-lg font-semibold text-gray-900 mb-4">Motor Specificaties</h4>
                    
                    <!-- Motor Brand -->
                    <div class="mb-4">
                      <label class="block text-sm font-medium text-gray-700 mb-2">Motormerk</label>
                      <select v-model="filters.motor_brand" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option :value="undefined">Alle merken</option>
                        <option v-for="brand in motorBrands" :key="brand" :value="brand">{{ brand }}</option>
                      </select>
                      </div>

                    <!-- Motor Type -->
                    <div class="mb-4">
                      <label class="block text-sm font-medium text-gray-700 mb-2">Motortype</label>
                      <select v-model="filters.motor_type" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option :value="undefined">Alle types</option>
                        <option v-for="type in motorTypes" :key="type" :value="type">{{ type }}</option>
                      </select>
                    </div>

                    <!-- Torque Range -->
                    <div class="mb-4">
                      <label class="block text-sm font-medium text-gray-700 mb-2">Koppel (Nm)</label>
                      <select v-model="filters.torque_range" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option :value="undefined">Alle koppel</option>
                        <option v-for="range in torqueRanges" :key="range" :value="range">{{ range }}</option>
                      </select>
                    </div>
                  </div>

                  <!-- Drivetrain & Mechanics Section -->
                  <div class="border-t border-gray-200 pt-6">
                    <h4 class="text-lg font-semibold text-gray-900 mb-4">Aandrijving & Mechaniek</h4>
                    
                    <!-- Gear Type -->
                    <div class="mb-4">
                      <label class="block text-sm font-medium text-gray-700 mb-2">Versnelling</label>
                      <select v-model="filters.gear_type" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option :value="undefined">Alle types</option>
                        <option v-for="type in gearTypes" :key="type" :value="type">{{ type }}</option>
                      </select>
                    </div>

                    <!-- Brake Type -->
                    <div class="mb-4">
                      <label class="block text-sm font-medium text-gray-700 mb-2">Remsysteem</label>
                      <select v-model="filters.brake_type" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option :value="undefined">Alle types</option>
                        <option v-for="type in brakeTypes" :key="type" :value="type">{{ type }}</option>
                      </select>
                    </div>

                    <!-- Drive Type -->
                    <div class="mb-4">
                      <label class="block text-sm font-medium text-gray-700 mb-2">Aandrijving</label>
                      <select v-model="filters.drive_type" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option :value="undefined">Alle types</option>
                        <option v-for="type in driveTypes" :key="type" :value="type">{{ type }}</option>
                      </select>
                    </div>

                    <!-- Frame Material -->
                    <div class="mb-4">
                      <label class="block text-sm font-medium text-gray-700 mb-2">Framemateriaal</label>
                      <select v-model="filters.frame_material" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option :value="undefined">Alle materialen</option>
                        <option v-for="material in frameMaterials" :key="material" :value="material">{{ material }}</option>
                      </select>
                    </div>

                    <!-- Wheel Size -->
                    <div class="mb-4">
                      <label class="block text-sm font-medium text-gray-700 mb-2">Wielmaat</label>
                      <select v-model="filters.wheel_size" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option :value="undefined">Alle maten</option>
                        <option v-for="size in wheelSizes" :key="size" :value="size">{{ size }}</option>
                      </select>
                    </div>

                    <!-- Suspension Type -->
                    <div class="mb-4">
                      <label class="block text-sm font-medium text-gray-700 mb-2">Vering</label>
                      <select v-model="filters.suspension_type" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option :value="undefined">Alle types</option>
                        <option v-for="type in suspensionTypes" :key="type" :value="type">{{ type }}</option>
                      </select>
                    </div>
                  </div>

                  <!-- Battery Specifications Section -->
                  <div class="border-t border-gray-200 pt-6">
                    <h4 class="text-lg font-semibold text-gray-900 mb-4">Accu Specificaties</h4>
                    
                    <!-- Battery Type -->
                    <div class="mb-4">
                      <label class="block text-sm font-medium text-gray-700 mb-2">Accutype</label>
                      <select v-model="filters.battery_type" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option :value="undefined">Alle types</option>
                        <option v-for="type in batteryTypes" :key="type" :value="type">{{ type }}</option>
                      </select>
                    </div>

                    <!-- Battery Position -->
                    <div class="mb-4">
                      <label class="block text-sm font-medium text-gray-700 mb-2">Accupositie</label>
                      <select v-model="filters.battery_position" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option :value="undefined">Alle posities</option>
                        <option v-for="position in batteryPositions" :key="position" :value="position">{{ position }}</option>
                      </select>
                    </div>
                  </div>

                  <!-- Features & Accessories Section -->
                  <div class="border-t border-gray-200 pt-6">
                    <h4 class="text-lg font-semibold text-gray-900 mb-4">Features & Accessoires</h4>
                    
                    <!-- Seating Position -->
                    <div class="mb-4">
                      <label class="block text-sm font-medium text-gray-700 mb-2">Zithouding</label>
                      <select v-model="filters.seating_position" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option :value="undefined">Alle houdingen</option>
                        <option v-for="position in seatingPositions" :key="position" :value="position">{{ position }}</option>
                      </select>
                    </div>

                    <!-- Lighting Type -->
                    <div class="mb-4">
                      <label class="block text-sm font-medium text-gray-700 mb-2">Verlichting</label>
                      <select v-model="filters.lighting_type" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option :value="undefined">Alle types</option>
                        <option v-for="type in lightingTypes" :key="type" :value="type">{{ type }}</option>
                      </select>
                    </div>

                    <!-- Display Type -->
                    <div class="mb-4">
                      <label class="block text-sm font-medium text-gray-700 mb-2">Display</label>
                      <select v-model="filters.display_type" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option :value="undefined">Alle types</option>
                        <option v-for="type in displayTypes" :key="type" :value="type">{{ type }}</option>
                      </select>
                    </div>

                    <!-- Connectivity Type -->
                    <div class="mb-4">
                      <label class="block text-sm font-medium text-gray-700 mb-2">Connectiviteit</label>
                      <select v-model="filters.connectivity_type" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option :value="undefined">Alle types</option>
                        <option v-for="type in connectivityTypes" :key="type" :value="type">{{ type }}</option>
                      </select>
                    </div>
                  </div>

                  <!-- Special Features Section -->
                  <div class="border-t border-gray-200 pt-6">
                    <h4 class="text-lg font-semibold text-gray-900 mb-4">Speciale Features</h4>
                    
                    <!-- Special Features Checkboxes -->
                    <div class="space-y-2">
                      <label v-for="feature in specialFeatures" :key="feature" class="flex items-center">
                        <input 
                          type="checkbox" 
                          :value="feature"
                          v-model="filters.special_features"
                          class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <span class="ml-2 text-sm text-gray-700">{{ feature }}</span>
                      </label>
                    </div>

                    <!-- Warranty Range -->
                    <div class="mt-4">
                      <label class="block text-sm font-medium text-gray-700 mb-2">Garantie</label>
                      <select v-model="filters.warranty_range" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option :value="undefined">Alle garanties</option>
                        <option v-for="range in warrantyRanges" :key="range" :value="range">{{ range }}</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer Actions -->
              <div class="p-6 border-t border-gray-200 bg-gray-50 flex gap-3">
                      <button
                  @click="clearFilters"
                  class="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                >
                  Wissen
                      </button>
                      <button
                  @click="closeMobileFilters"
                  class="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all shadow-md"
                >
                  Toon resultaten
                      </button>
                    </div>
                  </div>
                </div>
        </Transition>

        <!-- Comparison Bar (floating at bottom center if items in comparison) -->
        <div v-if="comparisonStore.comparisonItems && comparisonStore.comparisonItems.length > 0" class="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 shadow-lg z-50 rounded-xl max-w-4xl mx-4">
          <div class="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="flex flex-col sm:flex-row items-center gap-4">
              <span class="font-semibold text-gray-900 whitespace-nowrap">
                {{ comparisonStore.comparisonItems ? comparisonStore.comparisonItems.length : 0 }} e-bikes geselecteerd
              </span>
              <div class="flex flex-wrap gap-2 max-w-md">
                <div
                  v-for="ebike in (comparisonStore.comparisonItems || [])"
                  :key="ebike.id"
                  class="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full text-sm"
                >
                  <span class="truncate max-w-32">{{ ebike.brand }} {{ ebike.model_name }}</span>
                  <button @click="comparisonStore.removeFromComparison(ebike.id)" class="text-red-500 hover:text-red-700 flex-shrink-0">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div class="flex gap-2 flex-shrink-0">
              <button @click="comparisonStore.clearComparison()" class="px-4 py-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors">
                Wissen
              </button>
              <RouterLink to="/vergelijk" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Vergelijken
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </main>

    <Footer />
    <EnhancedAIChatbot />
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Glassmorphism Effects */
.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.glass-badge {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.glass-price {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .glass-price {
    padding: 0.5rem 0.75rem;
  }

  .glass-price .text-lg {
    font-size: 1rem;
  }
}

/* Hover effects enhancement */
.group:hover .glass-card {
  background: rgba(255, 255, 255, 0.85);
}

/* Support for browsers without backdrop-filter */
@supports not (backdrop-filter: blur(10px)) {
  .glass-card {
    background: rgba(255, 255, 255, 0.95);
  }

  .glass-badge {
    background: rgba(255, 255, 255, 0.98);
  }

  .glass-price {
    background: rgba(255, 255, 255, 1);
  }
}

/* Mobile Filter Modal Animations */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-active > div:first-child,
.slide-up-leave-active > div:first-child {
  transition: opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-active > div:last-child,
.slide-up-leave-active > div:last-child {
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from > div:first-child,
.slide-up-leave-to > div:first-child {
  opacity: 0;
}

.slide-up-enter-from > div:last-child {
  transform: translateY(100%);
}

.slide-up-leave-to > div:last-child {
  transform: translateY(100%);
}

.slide-up-enter-to > div:last-child {
  transform: translateY(0);
}

/* Prevent body scroll when modal is open */
body:has(.slide-up-enter-active),
body:has(.slide-up-leave-active) {
  overflow: hidden;
}
</style>