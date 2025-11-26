import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { EBike } from '../types/ebike'
import { supabase } from '../lib/supabase'
import { useAuthStore } from './auth'

export const useFavoritesStore = defineStore('favorites', () => {
  const favorites = ref<EBike[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const authStore = useAuthStore()

  const favoriteIds = computed(() => favorites.value.map(fav => fav.id))
  const favoritesCount = computed(() => favorites.value.length)

  async function fetchFavorites() {
    if (!authStore.isAuthenticated) {
      favorites.value = []
      return
    }

    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('favorites')
        .select(`
          ebike_id,
          ebikes (
            id,
            brand,
            model_name,
            version,
            price,
            currency,
            build_date,
            gender_type,
            action_radius_km,
            battery_capacity,
            top_speed_kmh,
            image_url,
            affiliate_url,
            description
          )
        `)
        .eq('user_id', authStore.user?.id)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      // Extract e-bike data from the joined query
      favorites.value = data?.map(item => item.ebikes).filter(Boolean) || []
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch favorites'
      console.error('Error fetching favorites:', e)
    } finally {
      loading.value = false
    }
  }

  async function addToFavorites(ebike: EBike) {
    if (!authStore.isAuthenticated) {
      throw new Error('You must be logged in to add favorites')
    }

    loading.value = true
    error.value = null

    try {
      // Check if already in favorites
      const isAlreadyFavorite = favoriteIds.value.includes(ebike.id)
      if (isAlreadyFavorite) {
        return // Already in favorites
      }

      const { error: insertError } = await supabase
        .from('favorites')
        .insert({
          user_id: authStore.user!.id,
          ebike_id: ebike.id
        })

      if (insertError) throw insertError

      // Add to local state
      favorites.value.unshift(ebike)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to add to favorites'
      console.error('Error adding to favorites:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function removeFromFavorites(ebikeId: string) {
    if (!authStore.isAuthenticated) {
      throw new Error('You must be logged in to remove favorites')
    }

    loading.value = true
    error.value = null

    try {
      const { error: deleteError } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', authStore.user!.id)
        .eq('ebike_id', ebikeId)

      if (deleteError) throw deleteError

      // Remove from local state
      favorites.value = favorites.value.filter(fav => fav.id !== ebikeId)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to remove from favorites'
      console.error('Error removing from favorites:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function toggleFavorite(ebike: EBike) {
    const isFavorite = favoriteIds.value.includes(ebike.id)
    
    if (isFavorite) {
      await removeFromFavorites(ebike.id)
    } else {
      await addToFavorites(ebike)
    }
  }

  function isFavorite(ebikeId: string): boolean {
    return favoriteIds.value.includes(ebikeId)
  }

  function clearFavorites() {
    favorites.value = []
  }

  return {
    favorites,
    loading,
    error,
    favoriteIds,
    favoritesCount,
    fetchFavorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    clearFavorites
  }
})
