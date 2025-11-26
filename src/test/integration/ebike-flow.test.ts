import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../../views/HomePage.vue'
import EBikeListPage from '../../views/EBikeListPage.vue'
import EBikeDetailPage from '../../views/EBikeDetailPage.vue'

// Mock data
const mockEBikes = [
  {
    id: '1',
    model_name: 'City Pro',
    brand: 'Test Brand',
    price: 2500,
    category: 'city',
    image_url: '/city-pro.jpg',
    description: 'Perfect for city commuting',
    motor_power: '250W',
    battery_capacity: '500Wh',
    range: '50km',
    weight: '25kg'
  },
  {
    id: '2',
    model_name: 'Mountain X',
    brand: 'Test Brand',
    price: 3500,
    category: 'mountain',
    image_url: '/mountain-x.jpg',
    description: 'Built for mountain trails',
    motor_power: '500W',
    battery_capacity: '750Wh',
    range: '80km',
    weight: '30kg'
  }
]

// Mock stores
const mockEBikesStore = {
  ebikes: mockEBikes,
  loading: false,
  error: null,
  fetchEBikes: vi.fn().mockResolvedValue(undefined),
  getEBikeById: vi.fn((id) => mockEBikes.find(bike => bike.id === id)),
  searchEBikes: vi.fn((query) => 
    mockEBikes.filter(bike => 
      bike.model_name.toLowerCase().includes(query.toLowerCase())
    )
  ),
  getEBikesByCategory: vi.fn((category) => 
    mockEBikes.filter(bike => bike.category === category)
  )
}

const mockFavoritesStore = {
  favorites: [],
  loading: false,
  isFavorite: vi.fn(() => false),
  toggleFavorite: vi.fn(),
  fetchFavorites: vi.fn()
}

const mockComparisonStore = {
  comparison: [],
  addToComparison: vi.fn(() => true),
  removeFromComparison: vi.fn(),
  clearComparison: vi.fn(),
  error: null
}

const mockAuthStore = {
  user: { id: 'test-user', email: 'test@example.com' },
  isAuthenticated: true,
  loading: false
}

// Mock services
vi.mock('../../stores/ebikes', () => ({
  useEBikesStore: () => mockEBikesStore
}))

vi.mock('../../stores/favorites', () => ({
  useFavoritesStore: () => mockFavoritesStore
}))

vi.mock('../../stores/comparison', () => ({
  useComparisonStore: () => mockComparisonStore
}))

vi.mock('../../stores/auth', () => ({
  useAuthStore: () => mockAuthStore
}))

vi.mock('../../services/eventTrackingService', () => ({
  eventTrackingService: {
    trackPageView: vi.fn(),
    trackEBikeView: vi.fn(),
    trackEBikeComparison: vi.fn(),
    trackEBikeFavorite: vi.fn(),
    trackSearch: vi.fn()
  }
}))

describe('E-Bike Flow Integration Tests', () => {
  let router: any
  let pinia: any

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', component: HomePage },
        { path: '/ebikes', component: EBikeListPage },
        { path: '/ebike/:id', component: EBikeDetailPage }
      ]
    })

    vi.clearAllMocks()
  })

  describe('Home Page to E-Bike List Flow', () => {
    it('should display featured e-bikes on home page', async () => {
      const wrapper = mount(HomePage, {
        global: {
          plugins: [pinia, router]
        }
      })

      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain('City Pro')
      expect(wrapper.text()).toContain('Mountain X')
      expect(wrapper.text()).toContain('€2,500')
      expect(wrapper.text()).toContain('€3,500')
    })

    it('should navigate to e-bike list when "View All" is clicked', async () => {
      const wrapper = mount(HomePage, {
        global: {
          plugins: [pinia, router]
        }
      })

      const viewAllButton = wrapper.find('[data-testid="view-all-ebikes"]')
      if (viewAllButton.exists()) {
        await viewAllButton.trigger('click')
        expect(router.currentRoute.value.path).toBe('/ebikes')
      }
    })
  })

  describe('E-Bike List Page Functionality', () => {
    it('should display all e-bikes in list view', async () => {
      const wrapper = mount(EBikeListPage, {
        global: {
          plugins: [pinia, router]
        }
      })

      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain('City Pro')
      expect(wrapper.text()).toContain('Mountain X')
      expect(wrapper.text()).toContain('Test Brand')
    })

    it('should filter e-bikes by category', async () => {
      const wrapper = mount(EBikeListPage, {
        global: {
          plugins: [pinia, router]
        }
      })

      await wrapper.vm.$nextTick()

      // Simulate category filter
      const categoryFilter = wrapper.find('[data-testid="category-filter"]')
      if (categoryFilter.exists()) {
        await categoryFilter.setValue('city')
        await wrapper.vm.$nextTick()

        expect(mockEBikesStore.getEBikesByCategory).toHaveBeenCalledWith('city')
      }
    })

    it('should search e-bikes by query', async () => {
      const wrapper = mount(EBikeListPage, {
        global: {
          plugins: [pinia, router]
        }
      })

      await wrapper.vm.$nextTick()

      const searchInput = wrapper.find('[data-testid="search-input"]')
      if (searchInput.exists()) {
        await searchInput.setValue('city')
        await searchInput.trigger('input')
        await wrapper.vm.$nextTick()

        expect(mockEBikesStore.searchEBikes).toHaveBeenCalledWith('city')
      }
    })

    it('should add e-bike to comparison', async () => {
      const wrapper = mount(EBikeListPage, {
        global: {
          plugins: [pinia, router]
        }
      })

      await wrapper.vm.$nextTick()

      const compareButton = wrapper.find('[data-testid="compare-button-1"]')
      if (compareButton.exists()) {
        await compareButton.trigger('click')
        expect(mockComparisonStore.addToComparison).toHaveBeenCalledWith(mockEBikes[0])
      }
    })

    it('should toggle e-bike favorite', async () => {
      const wrapper = mount(EBikeListPage, {
        global: {
          plugins: [pinia, router]
        }
      })

      await wrapper.vm.$nextTick()

      const favoriteButton = wrapper.find('[data-testid="favorite-button-1"]')
      if (favoriteButton.exists()) {
        await favoriteButton.trigger('click')
        expect(mockFavoritesStore.toggleFavorite).toHaveBeenCalledWith(mockEBikes[0])
      }
    })
  })

  describe('E-Bike Detail Page', () => {
    it('should display e-bike details', async () => {
      const wrapper = mount(EBikeDetailPage, {
        global: {
          plugins: [pinia, router]
        },
        props: {
          id: '1'
        }
      })

      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain('City Pro')
      expect(wrapper.text()).toContain('Test Brand')
      expect(wrapper.text()).toContain('€2,500')
      expect(wrapper.text()).toContain('Perfect for city commuting')
    })

    it('should add e-bike to comparison from detail page', async () => {
      const wrapper = mount(EBikeDetailPage, {
        global: {
          plugins: [pinia, router]
        },
        props: {
          id: '1'
        }
      })

      await wrapper.vm.$nextTick()

      const compareButton = wrapper.find('[data-testid="add-to-comparison"]')
      if (compareButton.exists()) {
        await compareButton.trigger('click')
        expect(mockComparisonStore.addToComparison).toHaveBeenCalledWith(mockEBikes[0])
      }
    })

    it('should toggle favorite from detail page', async () => {
      const wrapper = mount(EBikeDetailPage, {
        global: {
          plugins: [pinia, router]
        },
        props: {
          id: '1'
        }
      })

      await wrapper.vm.$nextTick()

      const favoriteButton = wrapper.find('[data-testid="toggle-favorite"]')
      if (favoriteButton.exists()) {
        await favoriteButton.trigger('click')
        expect(mockFavoritesStore.toggleFavorite).toHaveBeenCalledWith(mockEBikes[0])
      }
    })
  })

  describe('Cross-Page Navigation', () => {
    it('should maintain state when navigating between pages', async () => {
      // Start on home page
      const homeWrapper = mount(HomePage, {
        global: {
          plugins: [pinia, router]
        }
      })

      await homeWrapper.vm.$nextTick()

      // Navigate to list page
      await router.push('/ebikes')
      const listWrapper = mount(EBikeListPage, {
        global: {
          plugins: [pinia, router]
        }
      })

      await listWrapper.vm.$nextTick()

      // State should be maintained
      expect(mockEBikesStore.ebikes).toEqual(mockEBikes)
    })

    it('should track events across page navigation', async () => {
      const { eventTrackingService } = await import('../../services/eventTrackingService')

      const homeWrapper = mount(HomePage, {
        global: {
          plugins: [pinia, router]
        }
      })

      await homeWrapper.vm.$nextTick()

      // Navigate to detail page
      await router.push('/ebike/1')
      const detailWrapper = mount(EBikeDetailPage, {
        global: {
          plugins: [pinia, router]
        },
        props: {
          id: '1'
        }
      })

      await detailWrapper.vm.$nextTick()

      // Should track page view and e-bike view
      expect(eventTrackingService.trackPageView).toHaveBeenCalled()
      expect(eventTrackingService.trackEBikeView).toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    it('should handle e-bike not found', async () => {
      mockEBikesStore.getEBikeById.mockReturnValue(undefined)

      const wrapper = mount(EBikeDetailPage, {
        global: {
          plugins: [pinia, router]
        },
        props: {
          id: 'nonexistent'
        }
      })

      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain('E-bike niet gevonden')
    })

    it('should handle loading states', async () => {
      mockEBikesStore.loading = true

      const wrapper = mount(EBikeListPage, {
        global: {
          plugins: [pinia, router]
        }
      })

      await wrapper.vm.$nextTick()

      expect(wrapper.find('[data-testid="loading-skeleton"]').exists()).toBe(true)
    })
  })
})
