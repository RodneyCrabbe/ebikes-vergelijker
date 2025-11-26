import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useEBikesStore } from '../../stores/ebikes'

describe('EBikes Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('should initialize with empty state', () => {
    const store = useEBikesStore()
    
    expect(store.ebikes).toEqual([])
    expect(store.loading).toBe(false)
    expect(store.error).toBe(null)
  })

  it('should fetch e-bikes successfully', async () => {
    const mockEBikes = [
      {
        id: '1',
        model_name: 'Test Bike 1',
        brand: 'Test Brand',
        price: 2500,
        category: 'city'
      },
      {
        id: '2',
        model_name: 'Test Bike 2',
        brand: 'Test Brand',
        price: 3000,
        category: 'mountain'
      }
    ]

    const mockSupabase = {
      from: vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockEBikes, error: null })
      }))
    }

    vi.doMock('../../lib/supabase', () => ({
      supabase: mockSupabase
    }))

    const store = useEBikesStore()
    await store.fetchEBikes()

    expect(store.ebikes).toEqual(mockEBikes)
    expect(store.loading).toBe(false)
    expect(store.error).toBe(null)
  })

  it('should handle fetch error', async () => {
    const mockError = new Error('Failed to fetch e-bikes')
    
    const mockSupabase = {
      from: vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: null, error: mockError })
      }))
    }

    vi.doMock('../../lib/supabase', () => ({
      supabase: mockSupabase
    }))

    const store = useEBikesStore()
    await store.fetchEBikes()

    expect(store.ebikes).toEqual([])
    expect(store.loading).toBe(false)
    expect(store.error).toBe('Failed to fetch e-bikes')
  })

  it('should filter e-bikes by category', () => {
    const store = useEBikesStore()
    store.ebikes = [
      { id: '1', category: 'city', brand: 'Brand A' },
      { id: '2', category: 'mountain', brand: 'Brand B' },
      { id: '3', category: 'city', brand: 'Brand C' }
    ]

    const cityBikes = store.getEBikesByCategory('city')
    expect(cityBikes).toHaveLength(2)
    expect(cityBikes.every(bike => bike.category === 'city')).toBe(true)
  })

  it('should search e-bikes by query', () => {
    const store = useEBikesStore()
    store.ebikes = [
      { id: '1', model_name: 'City Pro', brand: 'Brand A' },
      { id: '2', model_name: 'Mountain X', brand: 'Brand B' },
      { id: '3', model_name: 'City Plus', brand: 'Brand C' }
    ]

    const results = store.searchEBikes('city')
    expect(results).toHaveLength(2)
    expect(results.every(bike => 
      bike.model_name.toLowerCase().includes('city')
    )).toBe(true)
  })

  it('should get e-bike by id', () => {
    const store = useEBikesStore()
    const testBike = { id: '1', model_name: 'Test Bike', brand: 'Test Brand' }
    store.ebikes = [testBike]

    const foundBike = store.getEBikeById('1')
    expect(foundBike).toEqual(testBike)

    const notFoundBike = store.getEBikeById('999')
    expect(notFoundBike).toBeUndefined()
  })

  it('should track lead successfully', async () => {
    const mockSupabase = {
      from: vi.fn(() => ({
        insert: vi.fn().mockResolvedValue({ data: null, error: null })
      }))
    }

    vi.doMock('../../lib/supabase', () => ({
      supabase: mockSupabase
    }))

    const store = useEBikesStore()
    const result = await store.trackLead('test-ebike-id')

    expect(result).toBe(true)
    expect(mockSupabase.from).toHaveBeenCalledWith('leads')
  })

  it('should handle lead tracking error', async () => {
    const mockError = new Error('Failed to track lead')
    
    const mockSupabase = {
      from: vi.fn(() => ({
        insert: vi.fn().mockResolvedValue({ data: null, error: mockError })
      }))
    }

    vi.doMock('../../lib/supabase', () => ({
      supabase: mockSupabase
    }))

    const store = useEBikesStore()
    const result = await store.trackLead('test-ebike-id')

    expect(result).toBe(false)
  })
})
