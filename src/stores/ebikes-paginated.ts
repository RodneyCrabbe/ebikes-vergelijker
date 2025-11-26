import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { EBike, EBikeFilters } from '../types/ebike'
import { logger } from '../utils/logger'

// Load all e-bikes data from the full dataset
import allEBikesData from '../data/ebikes.json'

// Convert JSON data to EBike objects with proper types
const allEBikes: EBike[] = allEBikesData.map((item: any) => ({
  ...item,
  build_date: item.build_date ? new Date(item.build_date) : undefined,
  created_at: new Date(item.created_at),
  updated_at: new Date(item.updated_at),
  images: item.images || [item.image_url || '/api/placeholder/600/600']
})) as EBike[]

export const useEBikesStore = defineStore('ebikes', () => {
  const ebikes = ref<EBike[]>([])
  const currentEBike = ref<EBike | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Pagination
  const page = ref(1)
  const pageSize = ref(20)
  const hasMore = ref(true)
  const totalEBikes = ref(allEBikes.length)
  
  // Cache for loaded e-bikes
  const loadedEBikes = ref<EBike[]>([])
  const currentFilters = ref<EBikeFilters>({})

  // Computed properties
  const totalPages = computed(() => Math.ceil(totalEBikes.value / pageSize.value))
  const currentPage = computed(() => page.value)
  const isLastPage = computed(() => page.value >= totalPages.value)

  // Load e-bikes with pagination
  async function fetchEBikes(filters?: EBikeFilters, reset = true) {
    loading.value = true
    error.value = null

    try {
      logger.log('Loading e-bikes with pagination...')
      
      // Reset pagination if requested
      if (reset) {
        page.value = 1
        loadedEBikes.value = []
        hasMore.value = true
      }

      // Apply filters to all e-bikes
      let filteredData = [...allEBikes]
      if (filters) {
        currentFilters.value = filters
        filteredData = applyFiltersToData(filteredData, filters)
      }

      // Update total count
      totalEBikes.value = filteredData.length

      // Get current page data
      const startIndex = (page.value - 1) * pageSize.value
      const endIndex = startIndex + pageSize.value
      const pageData = filteredData.slice(startIndex, endIndex)

      if (reset) {
        loadedEBikes.value = pageData
        ebikes.value = pageData
      } else {
        loadedEBikes.value = [...loadedEBikes.value, ...pageData]
        ebikes.value = loadedEBikes.value
      }

      // Check if there are more pages
      hasMore.value = endIndex < filteredData.length

      logger.log(`Loaded page ${page.value}: ${pageData.length} e-bikes (${ebikes.value.length}/${totalEBikes.value} total)`)
    } catch (err) {
      error.value = 'Failed to load e-bikes'
      logger.error('Error loading e-bikes:', err)
    } finally {
      loading.value = false
    }
  }

  // Load more e-bikes (next page)
  async function loadMore() {
    if (!hasMore.value || loading.value) return

    page.value++
    await fetchEBikes(currentFilters.value, false)
  }

  // Apply filters to data
  function applyFiltersToData(data: EBike[], filters: EBikeFilters): EBike[] {
    let filtered = [...data]

    if (filters.brand) {
      filtered = filtered.filter(ebike => ebike.brand === filters.brand)
    }
    if (filters.gender_type) {
      filtered = filtered.filter(ebike => ebike.gender_type === filters.gender_type)
    }
    if (filters.min_price !== undefined) {
      filtered = filtered.filter(ebike => ebike.price >= filters.min_price!)
    }
    if (filters.max_price !== undefined) {
      filtered = filtered.filter(ebike => ebike.price <= filters.max_price!)
    }
    if (filters.min_action_radius !== undefined) {
      filtered = filtered.filter(ebike => (ebike.action_radius_km || 0) >= filters.min_action_radius!)
    }
    if (filters.max_action_radius !== undefined) {
      filtered = filtered.filter(ebike => (ebike.action_radius_km || 0) <= filters.max_action_radius!)
    }
    if (filters.min_battery_capacity !== undefined) {
      filtered = filtered.filter(ebike => (ebike.battery_capacity || 0) >= filters.min_battery_capacity!)
    }
    if (filters.max_battery_capacity !== undefined) {
      filtered = filtered.filter(ebike => (ebike.battery_capacity || 0) <= filters.max_battery_capacity!)
    }

    return filtered
  }

  // Get e-bike by ID
  async function getEBikeById(id: string): Promise<EBike | null> {
    // First check loaded e-bikes
    let ebike = ebikes.value.find(e => e.id === id)
    if (ebike) return ebike

    // If not found, search in all e-bikes
    ebike = allEBikes.find(e => e.id === id)
    if (ebike) {
      currentEBike.value = ebike
      return ebike
    }

    return null
  }

  // Search e-bikes
  async function searchEBikes(query: string): Promise<EBike[]> {
    const searchQuery = query.toLowerCase()
    return allEBikes.filter(ebike => 
      ebike.brand.toLowerCase().includes(searchQuery) ||
      ebike.model_name.toLowerCase().includes(searchQuery) ||
      (ebike.description && ebike.description.toLowerCase().includes(searchQuery))
    )
  }

  // Auto-refresh functionality
  let refreshInterval: NodeJS.Timeout | null = null

  function startAutoRefresh() {
    if (refreshInterval) return
    refreshInterval = setInterval(() => {
      if (ebikes.value.length > 0) {
        fetchEBikes(currentFilters.value, false)
      }
    }, 30000) // 30 seconds
  }

  function stopAutoRefresh() {
    if (refreshInterval) {
      clearInterval(refreshInterval)
      refreshInterval = null
    }
  }

  // Track lead
  async function trackLead(ebikeId: string) {
    try {
      logger.log('Tracking lead for e-bike:', ebikeId)
      // Add your tracking logic here
    } catch (err) {
      logger.error('Failed to track lead:', err)
    }
  }

  return {
    // State
    ebikes,
    currentEBike,
    loading,
    error,
    page,
    pageSize,
    hasMore,
    totalEBikes,
    
    // Computed
    totalPages,
    currentPage,
    isLastPage,
    
    // Actions
    fetchEBikes,
    loadMore,
    getEBikeById,
    searchEBikes,
    startAutoRefresh,
    stopAutoRefresh,
    trackLead
  }
})
