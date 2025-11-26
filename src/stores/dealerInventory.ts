// Enhanced Dealer Inventory Store
// Comprehensive inventory management for dealers

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'
import type { DealerInventory, DealerInventoryForm } from '../types/dealerEnhanced'

export const useDealerInventoryStore = defineStore('dealerInventory', () => {
  // State
  const inventory = ref<DealerInventory[]>([])
  const currentInventory = ref<DealerInventory | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filters = ref({
    brand: '',
    status: 'active',
    price_min: null as number | null,
    price_max: null as number | null,
    in_stock: false
  })

  // Computed
  const filteredInventory = computed(() => {
    let filtered = inventory.value

    if (filters.value.brand) {
      filtered = filtered.filter(item => 
        item.brand.toLowerCase().includes(filters.value.brand.toLowerCase())
      )
    }

    if (filters.value.status) {
      filtered = filtered.filter(item => item.status === filters.value.status)
    }

    if (filters.value.price_min !== null) {
      filtered = filtered.filter(item => item.price_eur >= filters.value.price_min!)
    }

    if (filters.value.price_max !== null) {
      filtered = filtered.filter(item => item.price_eur <= filters.value.price_max!)
    }

    if (filters.value.in_stock) {
      filtered = filtered.filter(item => item.stock_quantity > 0)
    }

    return filtered
  })

  const lowStockItems = computed(() => 
    inventory.value.filter(item => 
      item.stock_quantity <= item.min_stock_level
    )
  )

  const featuredItems = computed(() => 
    inventory.value.filter(item => item.is_featured)
  )

  const totalValue = computed(() => 
    inventory.value.reduce((sum, item) => sum + (item.price_eur * item.stock_quantity), 0)
  )

  const brands = computed(() => {
    const brandSet = new Set(inventory.value.map(item => item.brand))
    return Array.from(brandSet).sort()
  })

  // Actions
  async function fetchInventory(dealerId: string) {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('dealer_inventory')
        .select('*')
        .eq('dealer_id', dealerId)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      inventory.value = data || []
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch inventory'
      console.error('Error fetching inventory:', e)
    } finally {
      loading.value = false
    }
  }

  async function fetchInventoryItem(id: string) {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('dealer_inventory')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError) throw fetchError

      currentInventory.value = data
      return data
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch inventory item'
      console.error('Error fetching inventory item:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function createInventoryItem(dealerId: string, formData: DealerInventoryForm) {
    loading.value = true
    error.value = null

    try {
      const inventoryData = {
        dealer_id: dealerId,
        ...formData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data, error: insertError } = await supabase
        .from('dealer_inventory')
        .insert(inventoryData)
        .select()
        .single()

      if (insertError) throw insertError

      inventory.value.unshift(data)
      return data
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to create inventory item'
      console.error('Error creating inventory item:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateInventoryItem(id: string, updates: Partial<DealerInventoryForm>) {
    loading.value = true
    error.value = null

    try {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString()
      }

      const { data, error: updateError } = await supabase
        .from('dealer_inventory')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (updateError) throw updateError

      const index = inventory.value.findIndex(item => item.id === id)
      if (index !== -1) {
        inventory.value[index] = data
      }

      if (currentInventory.value?.id === id) {
        currentInventory.value = data
      }

      return data
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to update inventory item'
      console.error('Error updating inventory item:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteInventoryItem(id: string) {
    loading.value = true
    error.value = null

    try {
      const { error: deleteError } = await supabase
        .from('dealer_inventory')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      inventory.value = inventory.value.filter(item => item.id !== id)
      
      if (currentInventory.value?.id === id) {
        currentInventory.value = null
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to delete inventory item'
      console.error('Error deleting inventory item:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateStock(id: string, quantity: number) {
    loading.value = true
    error.value = null

    try {
      const { data, error: updateError } = await supabase
        .from('dealer_inventory')
        .update({ 
          stock_quantity: quantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (updateError) throw updateError

      const index = inventory.value.findIndex(item => item.id === id)
      if (index !== -1) {
        inventory.value[index] = data
      }

      if (currentInventory.value?.id === id) {
        currentInventory.value = data
      }

      return data
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to update stock'
      console.error('Error updating stock:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function toggleFeatured(id: string) {
    const item = inventory.value.find(item => item.id === id)
    if (!item) return

    return updateInventoryItem(id, { is_featured: !item.is_featured })
  }

  async function updateStatus(id: string, status: DealerInventory['status']) {
    return updateInventoryItem(id, { status })
  }

  function setFilters(newFilters: Partial<typeof filters.value>) {
    filters.value = { ...filters.value, ...newFilters }
  }

  function clearFilters() {
    filters.value = {
      brand: '',
      status: 'active',
      price_min: null,
      price_max: null,
      in_stock: false
    }
  }

  function setCurrentInventory(item: DealerInventory | null) {
    currentInventory.value = item
  }

  // Analytics helpers
  async function trackInventoryView(inventoryId: string, userId?: string) {
    try {
      await supabase
        .from('dealer_analytics_events')
        .insert({
          inventory_id: inventoryId,
          event_type: 'view',
          event_source: 'website',
          user_id: userId,
          created_at: new Date().toISOString()
        })
    } catch (e) {
      console.error('Error tracking inventory view:', e)
    }
  }

  async function trackInventoryClick(inventoryId: string, userId?: string) {
    try {
      await supabase
        .from('dealer_analytics_events')
        .insert({
          inventory_id: inventoryId,
          event_type: 'click',
          event_source: 'website',
          user_id: userId,
          created_at: new Date().toISOString()
        })
    } catch (e) {
      console.error('Error tracking inventory click:', e)
    }
  }

  return {
    // State
    inventory,
    currentInventory,
    loading,
    error,
    filters,

    // Computed
    filteredInventory,
    lowStockItems,
    featuredItems,
    totalValue,
    brands,

    // Actions
    fetchInventory,
    fetchInventoryItem,
    createInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    updateStock,
    toggleFeatured,
    updateStatus,
    setFilters,
    clearFilters,
    setCurrentInventory,
    trackInventoryView,
    trackInventoryClick
  }
})
