import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
  provinces, 
  getAllDealers, 
  getDealersByCity, 
  getDealersByProvince, 
  getCitiesByProvince,
  findNearestDealers,
  searchDealers,
  type Dealer,
  type City,
  type Province
} from '../data/locations'

export const useLocationStore = defineStore('location', () => {
  // State
  const selectedProvince = ref<string>('')
  const selectedCity = ref<string>('')
  const userLocation = ref<{ lat: number; lng: number } | null>(null)
  const searchQuery = ref<string>('')
  const maxDistance = ref<number>(50) // km

  // Getters
  const allProvinces = computed(() => provinces)
  
  const allCities = computed(() => {
    if (selectedProvince.value) {
      return getCitiesByProvince(selectedProvince.value)
    }
    return provinces.flatMap(province => province.cities)
  })

  const allDealers = computed(() => getAllDealers())

  const filteredDealers = computed(() => {
    let dealers = allDealers.value

    // Filter by search query
    if (searchQuery.value) {
      dealers = searchDealers(searchQuery.value)
    }

    // Filter by city
    if (selectedCity.value) {
      dealers = getDealersByCity(selectedCity.value)
    }
    // Filter by province (if no city selected)
    else if (selectedProvince.value) {
      dealers = getDealersByProvince(selectedProvince.value)
    }

    // Filter by distance if user location is available
    if (userLocation.value) {
      const nearbyDealers = findNearestDealers(
        userLocation.value.lat, 
        userLocation.value.lng, 
        maxDistance.value
      )
      
      // If we have location-based filtering, use it
      if (selectedCity.value || selectedProvince.value) {
        // Filter nearby dealers by selected location
        const cityDealers = selectedCity.value ? 
          getDealersByCity(selectedCity.value) : 
          getDealersByProvince(selectedProvince.value)
        
        dealers = nearbyDealers.filter(dealer => 
          cityDealers.some(cityDealer => cityDealer.id === dealer.id)
        )
      } else {
        dealers = nearbyDealers
      }
    }

    return dealers
  })

  const nearestDealers = computed(() => {
    if (!userLocation.value) return []
    return findNearestDealers(
      userLocation.value.lat, 
      userLocation.value.lng, 
      maxDistance.value
    )
  })

  // Actions
  function setSelectedProvince(province: string) {
    selectedProvince.value = province
    selectedCity.value = '' // Reset city when province changes
  }

  function setSelectedCity(city: string) {
    selectedCity.value = city
  }

  function setUserLocation(lat: number, lng: number) {
    userLocation.value = { lat, lng }
  }

  function setSearchQuery(query: string) {
    searchQuery.value = query
  }

  function setMaxDistance(distance: number) {
    maxDistance.value = distance
  }

  function clearFilters() {
    selectedProvince.value = ''
    selectedCity.value = ''
    searchQuery.value = ''
    userLocation.value = null
  }

  function getDealersForAppointment() {
    // Return dealers based on current filters for appointment booking
    return filteredDealers.value
  }

  function getDealerById(id: string): Dealer | undefined {
    return allDealers.value.find(dealer => dealer.id === id)
  }

  function getCitiesForProvince(provinceName: string): City[] {
    return getCitiesByProvince(provinceName)
  }

  function getCitiesByProvince(provinceName: string): City[] {
    const province = provinces.find(p => 
      p.name.toLowerCase() === provinceName.toLowerCase()
    )
    return province ? province.cities : []
  }

  function getDealersForCity(cityName: string): Dealer[] {
    return getDealersByCity(cityName)
  }

  // Get user's current location using browser geolocation
  function requestUserLocation(): Promise<{ lat: number; lng: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setUserLocation(location.lat, location.lng)
          resolve(location)
        },
        (error) => {
          reject(error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      )
    })
  }

  // Find closest dealer to user
  function findClosestDealer(): Dealer | null {
    if (!userLocation.value) return null
    
    const nearest = findNearestDealers(
      userLocation.value.lat, 
      userLocation.value.lng, 
      1 // Very small radius to get the closest one
    )
    
    return nearest.length > 0 ? nearest[0] : null
  }

  return {
    // State
    selectedProvince,
    selectedCity,
    userLocation,
    searchQuery,
    maxDistance,
    
    // Getters
    allProvinces,
    allCities,
    allDealers,
    filteredDealers,
    nearestDealers,
    
    // Actions
    setSelectedProvince,
    setSelectedCity,
    setUserLocation,
    setSearchQuery,
    setMaxDistance,
    clearFilters,
    getDealersForAppointment,
    getDealerById,
    getCitiesForProvince,
    getCitiesByProvince,
    getDealersForCity,
    requestUserLocation,
    findClosestDealer
  }
})
