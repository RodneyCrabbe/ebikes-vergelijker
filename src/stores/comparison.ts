import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { EBike } from '../types/ebike'

export const useComparisonStore = defineStore('comparison', () => {
  const comparisonItems = ref<EBike[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const canAddMore = computed(() => comparisonItems.value.length < 4)
  const comparisonCount = computed(() => comparisonItems.value.length)

  function addToComparison(ebike: EBike) {
    if (comparisonItems.value.length >= 4) {
      error.value = 'Maximum 4 e-bikes kunnen vergeleken worden'
      return false
    }

    if (comparisonItems.value.find(e => e.id === ebike.id)) {
      error.value = 'Deze e-bike is al toegevoegd'
      return false
    }

    comparisonItems.value.push(ebike)
    error.value = null
    return true
  }

  function removeFromComparison(ebikeId: string) {
    const index = comparisonItems.value.findIndex(e => e.id === ebikeId)
    if (index > -1) {
      comparisonItems.value.splice(index, 1)
    }
    error.value = null
  }

  function clearComparison() {
    comparisonItems.value = []
    error.value = null
  }

  function isInComparison(ebikeId: string) {
    return comparisonItems.value.some(e => e.id === ebikeId)
  }

  async function saveComparison(comparisonData: { name: string; ebike_ids: string[] }, userId: string) {
    loading.value = true
    error.value = null
    
    try {
      // Simulate API call for saving comparison
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In a real app, this would save to a database
      console.log('Saving comparison:', comparisonData, 'for user:', userId)
      
      return { success: true, id: Date.now().toString() }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to save comparison'
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    comparisonItems,
    loading,
    error,
    canAddMore,
    comparisonCount,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison,
    saveComparison
  }
})