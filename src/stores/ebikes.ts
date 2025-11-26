import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { EBike, EBikeFilters } from '../types/ebike'
import { logger } from '../utils/logger'
import { WordPressService } from '../services/wordpress'

export const useEBikesStore = defineStore('ebikes', () => {
  const ebikes = ref<EBike[]>([])
  const currentEBike = ref<EBike | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  let refreshInterval: NodeJS.Timeout | null = null
  let retryCount = 0
  const MAX_RETRIES = 3

  async function fetchEBikes(filters?: EBikeFilters) {
    loading.value = true
    error.value = null

    try {
      logger.log('Loading e-bikes from WordPress...')
      
      // Fetch all bikes from WP
      const allBikes = await WordPressService.getEBikes()

      let filteredData = [...allBikes]

      // Apply filters client-side for now
      if (filters) {
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
          filteredData = filteredData.filter(ebike => ebike.action_radius_km && ebike.action_radius_km >= filters.min_action_radius!)
        }
        if (filters.max_action_radius !== undefined) {
          filteredData = filteredData.filter(ebike => ebike.action_radius_km && ebike.action_radius_km <= filters.max_action_radius!)
        }
        if (filters.min_battery_capacity !== undefined) {
          filteredData = filteredData.filter(ebike => ebike.battery_capacity && ebike.battery_capacity >= filters.min_battery_capacity!)
        }
        if (filters.max_battery_capacity !== undefined) {
          filteredData = filteredData.filter(ebike => ebike.battery_capacity && ebike.battery_capacity <= filters.max_battery_capacity!)
        }
        if (filters.min_top_speed !== undefined) {
          filteredData = filteredData.filter(ebike => ebike.top_speed_kmh && ebike.top_speed_kmh >= filters.min_top_speed!)
        }
        if (filters.max_top_speed !== undefined) {
          filteredData = filteredData.filter(ebike => ebike.top_speed_kmh && ebike.top_speed_kmh <= filters.max_top_speed!)
        }
        if (filters.bike_type) {
          filteredData = filteredData.filter(ebike => ebike.bike_type === filters.bike_type)
        }
        if (filters.color) {
          filteredData = filteredData.filter(ebike => ebike.color === filters.color)
        }
        if (filters.motor_location) {
          filteredData = filteredData.filter(ebike => ebike.motor_location === filters.motor_location)
        }
        if (filters.removable_battery !== undefined) {
          filteredData = filteredData.filter(ebike => ebike.removable_battery === filters.removable_battery)
        }
        if (filters.on_sale !== undefined) {
          filteredData = filteredData.filter(ebike => ebike.on_sale === filters.on_sale)
        }
      }

      ebikes.value = filteredData
      logger.log('Loaded e-bikes:', ebikes.value.length, 'items')
      retryCount = 0 // Reset retry count on success
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch e-bikes'
      logger.error('Error fetching e-bikes:', e)
      if (retryCount < MAX_RETRIES) {
        retryCount++
        logger.warn(`Retrying fetchEBikes... (${retryCount}/${MAX_RETRIES})`)
        await new Promise(resolve => setTimeout(resolve, 2000)) // Wait before retrying
        await fetchEBikes(filters) // Retry the fetch
      } else {
        logger.error('Max retries reached for fetchEBikes.')
      }
    } finally {
      loading.value = false
    }
  }

  async function fetchEBikeById(id: string) {
    loading.value = true
    error.value = null
    try {
      logger.log(`Fetching e-bike by ID: ${id}`)
      // First check if we have it in store
      let ebike = ebikes.value.find(e => e.id === id)
      
      if (!ebike) {
          // If not, fetch all (or implement single fetch in service)
          await fetchEBikes() 
          ebike = ebikes.value.find(e => e.id === id)
      }

      if (ebike) {
        currentEBike.value = ebike
        logger.log(`Found e-bike: ${ebike.brand} ${ebike.model_name}`)
        return ebike
      } else {
        throw new Error(`E-bike with ID ${id} not found`)
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to fetch e-bike'
      logger.error('Error fetching e-bike:', errorMessage)
      error.value = errorMessage
      return null
    } finally {
      loading.value = false
    }
  }

  function getAllEBikes() {
    return ebikes.value
  }

  function getEBikeById(id: string) {
    return ebikes.value.find(e => e.id === id) || null
  }

  async function trackLead(ebikeId: string) {
    try {
      logger.log(`Tracking lead for e-bike: ${ebikeId}`)
      // Simulate tracking
      await new Promise(resolve => setTimeout(resolve, 100))
      logger.log(`Lead tracked successfully for e-bike: ${ebikeId}`)
    } catch (e) {
      logger.error('Error tracking lead:', e)
    }
  }

  function startAutoRefresh(intervalMinutes = 5) {
    if (refreshInterval) {
      clearInterval(refreshInterval)
    }
    
    refreshInterval = setInterval(() => {
      logger.log('Auto-refreshing e-bikes data...')
      fetchEBikes()
    }, intervalMinutes * 60 * 1000)
    
    logger.log(`Auto-refresh enabled (${intervalMinutes} minutes)`)
  }

  function stopAutoRefresh() {
    if (refreshInterval) {
      clearInterval(refreshInterval)
      refreshInterval = null
      logger.log('Auto-refresh disabled')
    }
  }

  return {
    ebikes,
    currentEBike,
    loading,
    error,
    fetchEBikes,
    fetchEBikeById,
    getAllEBikes,
    getEBikeById,
    trackLead,
    startAutoRefresh,
    stopAutoRefresh
  }
})
