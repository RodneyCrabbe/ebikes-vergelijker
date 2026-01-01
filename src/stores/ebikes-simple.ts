import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { EBike, EBikeFilters } from '../types/ebike'
import { logger } from '../utils/logger'

// Load e-bikes data dynamically from public directory to avoid Vite JSON parsing issues
let allEBikesData: any[] = []
let dataLoaded = false

export const useEBikesStore = defineStore('ebikes', () => {
  const ebikes = ref<EBike[]>([])
  const currentEBike = ref<EBike | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const initialized = ref(false)
  const fetching = ref(false) // Guard to prevent concurrent fetches

  // Load data from public directory
  async function loadEBikesData(): Promise<any[]> {
    if (dataLoaded && allEBikesData.length > 0) {
      return allEBikesData
    }
    
    try {
      const response = await fetch('/ebikes-data.json')
      if (!response.ok) {
        throw new Error(`Failed to load e-bikes data: ${response.status}`)
      }
      const data = await response.json()
      if (Array.isArray(data)) {
        allEBikesData = data
        dataLoaded = true
        logger.log(`Loaded ${data.length} e-bikes from public data file`)
        return data
      }
      throw new Error('E-bikes data is not an array')
    } catch (err) {
      logger.error('Error loading e-bikes data:', err)
      // Try fallback from src/data if available
      try {
        const fallbackResponse = await fetch('/src/data/ebikes.json')
        if (fallbackResponse.ok) {
          const data = await fallbackResponse.json()
          if (Array.isArray(data)) {
            allEBikesData = data
            dataLoaded = true
            return data
          }
        }
      } catch (e) {
        logger.error('Fallback data load also failed:', e)
      }
      return []
    }
  }
  
  // Lazy data transformation - only convert when needed
  let allEBikesCache: EBike[] | null = null
  let dataLoadPromise: Promise<any[]> | null = null
  
  const getAllEBikes = async (): Promise<EBike[]> => {
    if (!allEBikesCache) {
      try {
        // Load data if not already loaded
        if (!dataLoadPromise) {
          dataLoadPromise = loadEBikesData()
        }
        const data = await dataLoadPromise
        
        // Ensure we have data
        if (!data || !Array.isArray(data) || data.length === 0) {
          logger.error('E-bikes data is empty or invalid')
          return []
        }
        
        allEBikesCache = data.map((item: any) => ({
          ...item,
          build_date: item.build_date ? new Date(item.build_date) : undefined,
          created_at: new Date(item.created_at),
          updated_at: new Date(item.updated_at),
          images: item.images || [item.image_url || '/api/placeholder/600/600']
        })) as EBike[]
        
        logger.log(`Successfully transformed ${allEBikesCache.length} e-bikes`)
        console.log('E-bikes data loaded:', allEBikesCache.length, 'items')
      } catch (err) {
        logger.error('Error transforming e-bikes data:', err)
        return []
      }
    }
    return allEBikesCache
  }

  // Computed properties
  const totalEBikes = computed(() => {
    if (allEBikesCache) return allEBikesCache.length
    if (allEBikesData.length > 0) return allEBikesData.length
    return 0
  })
  const isLoading = computed(() => loading.value)
  const hasError = computed(() => !!error.value)

  // Load all e-bikes with error handling
  async function fetchEBikes(filters?: EBikeFilters) {
    // Prevent concurrent fetches
    if (fetching.value) {
      logger.log('Fetch already in progress, skipping...')
      return
    }

    if (initialized.value && !filters) {
      return // Already loaded
    }

    fetching.value = true
    loading.value = true
    error.value = null

    try {
      logger.log('Loading all e-bikes...')
      
      // Simulate small delay to prevent blocking
      await new Promise(resolve => setTimeout(resolve, 100))

      const allEBikes = await getAllEBikes()
      
      if (allEBikes.length === 0) {
        logger.error('No e-bikes data available')
        error.value = 'Geen e-bikes data beschikbaar'
        return
      }

      let filteredData = [...allEBikes]

      // Apply filters if provided
      if (filters) {
        filteredData = applyFilters(filteredData, filters)
      }

      ebikes.value = filteredData
      initialized.value = true

      logger.log(`Loaded ${filteredData.length} e-bikes successfully`)
      console.log('E-bikes loaded:', filteredData.length, 'items')
    } catch (err) {
      error.value = 'Failed to load e-bikes'
      logger.error('Error loading e-bikes:', err)
      
      // Fallback: try to load at least some e-bikes
      try {
        const fallbackData = await getAllEBikes()
        ebikes.value = fallbackData.slice(0, 20) // Load first 20 as fallback
        initialized.value = true
        logger.log('Loaded fallback e-bikes')
      } catch (fallbackErr) {
        logger.error('Fallback loading failed:', fallbackErr)
        ebikes.value = []
      }
    } finally {
      loading.value = false
      fetching.value = false
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
    const allEBikes = await getAllEBikes()
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
    const allEBikes = await getAllEBikes()
    return allEBikes.filter(ebike => 
      ebike.brand.toLowerCase().includes(searchQuery) ||
      ebike.model_name.toLowerCase().includes(searchQuery) ||
      (ebike.description && ebike.description.toLowerCase().includes(searchQuery))
    )
  }

  async function getEBikesByIds(ids: string[]): Promise<EBike[]> {
    const set = new Set(ids)
    const allEBikes = await getAllEBikes()
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
    }, 300000) // 5 minutes (reduced frequency for better performance)
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

