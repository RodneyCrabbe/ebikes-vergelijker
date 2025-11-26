import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { EBike, EBikeFilters } from '../types/ebike'
import { logger } from '../utils/logger'

// Import initial data (small file)
import initialEBikesData from '../data/ebikes.json'

// Convert initial data to EBike objects
const initialEBikes: EBike[] = initialEBikesData.map((item: any) => ({
  ...item,
  build_date: item.build_date ? new Date(item.build_date) : undefined,
  created_at: new Date(item.created_at),
  updated_at: new Date(item.updated_at),
  images: item.images || [item.image_url || '/api/placeholder/600/600']
})) as EBike[]

export const useEBikesStore = defineStore('ebikes', () => {
  const ebikes = ref<EBike[]>(initialEBikes)
  const currentEBike = ref<EBike | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const loadedCategories = ref<Set<string>>(new Set(['initial']))
  const metadata = ref<any>(null)

  // Pagination
  const page = ref(1)
  const pageSize = ref(20)
  const hasMore = ref(true)

  // Cache for loaded data
  const categoryCache = ref<Map<string, EBike[]>>(new Map())

  // Load metadata
  async function loadMetadata() {
    try {
      const response = await fetch('/src/data/categories/metadata.json')
      metadata.value = await response.json()
      logger.log('Metadata loaded:', metadata.value)
    } catch (err) {
      logger.error('Failed to load metadata:', err)
    }
  }

  // Load e-bikes from a specific category
  async function loadCategory(categoryName: string): Promise<EBike[]> {
    if (categoryCache.value.has(categoryName)) {
      return categoryCache.value.get(categoryName)!
    }

    try {
      const response = await fetch(`/src/data/categories/${categoryName}.json`)
      const data = await response.json()
      
      const categoryEBikes: EBike[] = data.map((item: any) => ({
        ...item,
        build_date: item.build_date ? new Date(item.build_date) : undefined,
        created_at: new Date(item.created_at),
        updated_at: new Date(item.updated_at),
        images: item.images || [item.image_url || '/api/placeholder/600/600']
      })) as EBike[]

      categoryCache.value.set(categoryName, categoryEBikes)
      loadedCategories.value.add(categoryName)
      
      logger.log(`Loaded category ${categoryName}:`, categoryEBikes.length, 'e-bikes')
      return categoryEBikes
    } catch (err) {
      logger.error(`Failed to load category ${categoryName}:`, err)
      return []
    }
  }

  // Load all e-bikes with lazy loading
  async function fetchEBikes(filters?: EBikeFilters, loadAll = true) {
    loading.value = true
    error.value = null

    try {
      // Load metadata if not loaded
      if (!metadata.value) {
        await loadMetadata()
      }

      // Always load all categories for now
      const allCategories = metadata.value?.categories || []
      const allEBikes: EBike[] = [...initialEBikes]

      for (const category of allCategories) {
        const categoryEBikes = await loadCategory(category.name)
        allEBikes.push(...categoryEBikes)
      }

      ebikes.value = allEBikes
      hasMore.value = false

      // Apply filters if provided
      if (filters) {
        applyFilters(filters)
      }

      logger.log('E-bikes loaded:', ebikes.value.length)
    } catch (err) {
      error.value = 'Failed to load e-bikes'
      logger.error('Error loading e-bikes:', err)
    } finally {
      loading.value = false
    }
  }

  // Load more e-bikes (pagination)
  async function loadMore() {
    if (!hasMore.value || loading.value) return

    loading.value = true

    try {
      const categories = metadata.value?.categories || []
      const currentPage = page.value
      const startIndex = (currentPage - 1) * pageSize.value
      const endIndex = startIndex + pageSize.value

      // Calculate which category to load
      let categoryIndex = Math.floor(startIndex / pageSize.value)
      if (categoryIndex >= categories.length) {
        hasMore.value = false
        return
      }

      const category = categories[categoryIndex]
      if (!loadedCategories.value.has(category.name)) {
        const categoryEBikes = await loadCategory(category.name)
        ebikes.value.push(...categoryEBikes)
      }

      page.value++
      
      // Check if we've loaded all categories
      if (loadedCategories.value.size >= categories.length) {
        hasMore.value = false
      }

      logger.log('Loaded more e-bikes, total:', ebikes.value.length)
    } catch (err) {
      error.value = 'Failed to load more e-bikes'
      logger.error('Error loading more e-bikes:', err)
    } finally {
      loading.value = false
    }
  }

  // Apply filters to current e-bikes
  function applyFilters(filters: EBikeFilters) {
    let filteredData = [...ebikes.value]

    if (filters.brand) {
      filteredData = filteredData.filter(ebike => ebike.brand === filters.brand)
    }
    if (filters.gender_type) {
      filteredData = filteredData.filter(ebike => ebike.gender_type === filters.gender_type)
    }
    if (filters.min_price !== undefined) {
      filteredData = filteredData.filter(ebike => ebike.price >= filters.min_price!)
    }
    if (filters.max_price !== undefined) {
      filteredData = filteredData.filter(ebike => ebike.price <= filters.max_price!)
    }
    if (filters.min_action_radius !== undefined) {
      filteredData = filteredData.filter(ebike => (ebike.action_radius_km || 0) >= filters.min_action_radius!)
    }
    if (filters.max_action_radius !== undefined) {
      filteredData = filteredData.filter(ebike => (ebike.action_radius_km || 0) <= filters.max_action_radius!)
    }
    if (filters.min_battery_capacity !== undefined) {
      filteredData = filteredData.filter(ebike => (ebike.battery_capacity || 0) >= filters.min_battery_capacity!)
    }
    if (filters.max_battery_capacity !== undefined) {
      filteredData = filteredData.filter(ebike => (ebike.battery_capacity || 0) <= filters.max_battery_capacity!)
    }

    ebikes.value = filteredData
  }

  // Get e-bike by ID
  async function getEBikeById(id: string): Promise<EBike | null> {
    // First check if we already have it
    let ebike = ebikes.value.find(e => e.id === id)
    if (ebike) return ebike

    // If not found, search in all categories
    const categories = metadata.value?.categories || []
    for (const category of categories) {
      if (!loadedCategories.value.has(category.name)) {
        const categoryEBikes = await loadCategory(category.name)
        ebike = categoryEBikes.find(e => e.id === id)
        if (ebike) {
          currentEBike.value = ebike
          return ebike
        }
      }
    }

    return null
  }

  // Search e-bikes
  async function searchEBikes(query: string): Promise<EBike[]> {
    const results: EBike[] = []
    const searchQuery = query.toLowerCase()

    // Search in loaded e-bikes first
    const loadedResults = ebikes.value.filter(ebike => 
      ebike.brand.toLowerCase().includes(searchQuery) ||
      ebike.model_name.toLowerCase().includes(searchQuery) ||
      (ebike.description && ebike.description.toLowerCase().includes(searchQuery))
    )
    results.push(...loadedResults)

    // If not enough results, search in other categories
    if (results.length < 10) {
      const categories = metadata.value?.categories || []
      for (const category of categories) {
        if (!loadedCategories.value.has(category.name)) {
          const categoryEBikes = await loadCategory(category.name)
          const categoryResults = categoryEBikes.filter(ebike => 
            ebike.brand.toLowerCase().includes(searchQuery) ||
            ebike.model_name.toLowerCase().includes(searchQuery) ||
            (ebike.description && ebike.description.toLowerCase().includes(searchQuery))
          )
          results.push(...categoryResults)
        }
      }
    }

    return results
  }

  // Computed properties
  const totalEBikes = computed(() => metadata.value?.totalEBikes || ebikes.value.length)
  const loadedCount = computed(() => ebikes.value.length)
  const isLoading = computed(() => loading.value)
  const hasError = computed(() => !!error.value)

  // Auto-refresh functionality (simplified)
  let refreshInterval: NodeJS.Timeout | null = null

  function startAutoRefresh() {
    if (refreshInterval) return
    refreshInterval = setInterval(() => {
      // Only refresh if we have loaded data
      if (ebikes.value.length > 0) {
        fetchEBikes()
      }
    }, 30000) // 30 seconds
  }

  function stopAutoRefresh() {
    if (refreshInterval) {
      clearInterval(refreshInterval)
      refreshInterval = null
    }
  }

  // Track lead (simplified)
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
    
    // Computed
    totalEBikes,
    loadedCount,
    isLoading,
    hasError,
    
    // Actions
    fetchEBikes,
    loadMore,
    getEBikeById,
    searchEBikes,
    applyFilters,
    startAutoRefresh,
    stopAutoRefresh,
    trackLead
  }
})
