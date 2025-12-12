import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { EBike, EBikeFilters } from '../types/ebike'
import { logger } from '../utils/logger'

// Import all e-bikes data
import allEBikesData from '../data/ebikes.json'

export const useEBikesStore = defineStore('ebikes', () => {
  const ebikes = ref<EBike[]>([])
  const currentEBike = ref<EBike | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const initialized = ref(false)

  // Convert and cache all e-bikes data
  const allEBikes: EBike[] = allEBikesData.map((item: any) => ({
    ...item,
    build_date: item.build_date ? new Date(item.build_date) : undefined,
    created_at: new Date(item.created_at),
    updated_at: new Date(item.updated_at),
    images: item.images || [item.image_url || '/api/placeholder/600/600']
  })) as EBike[]

  // Computed properties
  const totalEBikes = computed(() => allEBikes.length)
  const isLoading = computed(() => loading.value)
  const hasError = computed(() => !!error.value)

  // Load all e-bikes with error handling
  async function fetchEBikes(filters?: EBikeFilters) {
    if (initialized.value && !filters) {
      return // Already loaded
    }

    loading.value = true
    error.value = null

    try {
      logger.log('Loading all e-bikes...')
      
      // Simulate small delay to prevent blocking
      await new Promise(resolve => setTimeout(resolve, 100))

      let filteredData = [...allEBikes]

      // Apply filters if provided
      if (filters) {
        filteredData = applyFilters(filteredData, filters)
      }

      ebikes.value = filteredData
      initialized.value = true

      logger.log(`Loaded ${filteredData.length} e-bikes successfully`)
    } catch (err) {
      error.value = 'Failed to load e-bikes'
      logger.error('Error loading e-bikes:', err)
      
      // Fallback: try to load at least some e-bikes
      try {
        ebikes.value = allEBikes.slice(0, 20) // Load first 20 as fallback
        initialized.value = true
        logger.log('Loaded fallback e-bikes')
      } catch (fallbackErr) {
        logger.error('Fallback loading failed:', fallbackErr)
        ebikes.value = []
      }
    } finally {
      loading.value = false
    }
  }

  // Apply filters to e-bikes
  function applyFilters(data: EBike[], filters: EBikeFilters): EBike[] {
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
    if (filters.bike_type) {
      filtered = filtered.filter(ebike => ebike.bike_type === filters.bike_type)
    }
    if (filters.color) {
      filtered = filtered.filter(ebike => ebike.color === filters.color)
    }
    if (filters.motor_location) {
      filtered = filtered.filter(ebike => ebike.motor_location === filters.motor_location)
    }
    if (filters.removable_battery !== undefined) {
      filtered = filtered.filter(ebike => ebike.removable_battery === filters.removable_battery)
    }
    if (filters.on_sale !== undefined) {
      filtered = filtered.filter(ebike => ebike.on_sale === filters.on_sale)
    }

    return filtered
  }

  // Get e-bike by ID
  async function getEBikeById(id: string): Promise<EBike | null> {
    // First check loaded e-bikes
    let ebike = ebikes.value.find(e => e.id === id)
    if (ebike) {
      currentEBike.value = ebike
      return ebike
    }

    // If not found, search in all e-bikes
    ebike = allEBikes.find(e => e.id === id)
    if (ebike) {
      currentEBike.value = ebike
      return ebike
    }

    return null
  }

  // Alias for getEBikeById to maintain compatibility
  async function fetchEBikeById(id: string): Promise<EBike | null> {
    return getEBikeById(id)
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

  function getEBikesByIds(ids: string[]): EBike[] {
    const set = new Set(ids)
    return allEBikes.filter(ebike => set.has(ebike.id))
  }

  // Auto-refresh functionality
  let refreshInterval: NodeJS.Timeout | null = null

  function startAutoRefresh() {
    if (refreshInterval) return
    refreshInterval = setInterval(() => {
      if (initialized.value) {
        fetchEBikes()
      }
    }, 60000) // 60 seconds
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

  // Reset store
  function reset() {
    ebikes.value = []
    currentEBike.value = null
    loading.value = false
    error.value = null
    initialized.value = false
    stopAutoRefresh()
  }

  return {
    // State
    ebikes,
    currentEBike,
    loading,
    error,
    initialized,

    // Computed
    totalEBikes,
    isLoading,
    hasError,

    // Actions
    fetchEBikes,
    getEBikeById,
    fetchEBikeById,
    searchEBikes,
    getEBikesByIds,
    startAutoRefresh,
    stopAutoRefresh,
    trackLead,
    reset
  }
})

