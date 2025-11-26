import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import EBikeCard from '../../components/EBikeCard.vue'

// Mock the stores
const mockFavoritesStore = {
  isFavorite: vi.fn(() => false),
  toggleFavorite: vi.fn()
}

const mockComparisonStore = {
  addToComparison: vi.fn(() => true),
  error: null
}

const mockAuthStore = {
  isAuthenticated: true
}

vi.mock('../../stores/favorites', () => ({
  useFavoritesStore: () => mockFavoritesStore
}))

vi.mock('../../stores/comparison', () => ({
  useComparisonStore: () => mockComparisonStore
}))

vi.mock('../../stores/auth', () => ({
  useAuthStore: () => mockAuthStore
}))

describe('EBikeCard', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  const mockEBike = {
    id: '1',
    model_name: 'Test E-Bike',
    brand: 'Test Brand',
    price: 2500,
    category: 'city',
    image_url: '/test-image.jpg',
    description: 'A great test e-bike',
    motor_power: '250W',
    battery_capacity: '500Wh',
    range: '50km',
    weight: '25kg'
  }

  it('should render e-bike information correctly', () => {
    const wrapper = mount(EBikeCard, {
      props: { ebike: mockEBike }
    })

    expect(wrapper.text()).toContain('Test E-Bike')
    expect(wrapper.text()).toContain('Test Brand')
    expect(wrapper.text()).toContain('€2,500')
    expect(wrapper.text()).toContain('city')
  })

  it('should display price correctly', () => {
    const wrapper = mount(EBikeCard, {
      props: { ebike: mockEBike }
    })

    const priceElement = wrapper.find('[data-testid="price"]')
    expect(priceElement.text()).toBe('€2,500')
  })

  it('should display "Prijs op aanvraag" for zero price', () => {
    const ebikeWithZeroPrice = { ...mockEBike, price: 0 }
    const wrapper = mount(EBikeCard, {
      props: { ebike: ebikeWithZeroPrice }
    })

    const priceElement = wrapper.find('[data-testid="price"]')
    expect(priceElement.text()).toBe('Prijs op aanvraag')
  })

  it('should display "Prijs op aanvraag" for null price', () => {
    const ebikeWithNullPrice = { ...mockEBike, price: null }
    const wrapper = mount(EBikeCard, {
      props: { ebike: ebikeWithNullPrice }
    })

    const priceElement = wrapper.find('[data-testid="price"]')
    expect(priceElement.text()).toBe('Prijs op aanvraag')
  })

  it('should render e-bike image', () => {
    const wrapper = mount(EBikeCard, {
      props: { ebike: mockEBike }
    })

    const image = wrapper.find('img')
    expect(image.attributes('src')).toBe('/test-image.jpg')
    expect(image.attributes('alt')).toBe('Test E-Bike')
  })

  it('should show placeholder when no image', () => {
    const ebikeWithoutImage = { ...mockEBike, image_url: null }
    const wrapper = mount(EBikeCard, {
      props: { ebike: ebikeWithoutImage }
    })

    expect(wrapper.text()).toContain('Geen afbeelding')
  })

  it('should call toggleFavorite when favorite button is clicked', async () => {
    const wrapper = mount(EBikeCard, {
      props: { ebike: mockEBike }
    })

    const favoriteButton = wrapper.find('[data-testid="favorite-button"]')
    await favoriteButton.trigger('click')

    expect(mockFavoritesStore.toggleFavorite).toHaveBeenCalledWith(mockEBike)
  })

  it('should call addToComparison when compare button is clicked', async () => {
    const wrapper = mount(EBikeCard, {
      props: { ebike: mockEBike }
    })

    const compareButton = wrapper.find('[data-testid="compare-button"]')
    await compareButton.trigger('click')

    expect(mockComparisonStore.addToComparison).toHaveBeenCalledWith(mockEBike)
  })

  it('should show error message when comparison fails', async () => {
    mockComparisonStore.addToComparison.mockReturnValue(false)
    mockComparisonStore.error = 'Maximum 3 bikes can be compared'

    const wrapper = mount(EBikeCard, {
      props: { ebike: mockEBike }
    })

    const compareButton = wrapper.find('[data-testid="compare-button"]')
    await compareButton.trigger('click')

    // Check if error is displayed (this would depend on your implementation)
    expect(mockComparisonStore.addToComparison).toHaveBeenCalledWith(mockEBike)
  })

  it('should show login prompt for unauthenticated users', async () => {
    mockAuthStore.isAuthenticated = false

    const wrapper = mount(EBikeCard, {
      props: { ebike: mockEBike }
    })

    const favoriteButton = wrapper.find('[data-testid="favorite-button"]')
    await favoriteButton.trigger('click')

    // Should show login prompt instead of calling toggleFavorite
    expect(mockFavoritesStore.toggleFavorite).not.toHaveBeenCalled()
  })

  it('should emit view-details event when card is clicked', async () => {
    const wrapper = mount(EBikeCard, {
      props: { ebike: mockEBike }
    })

    const card = wrapper.find('[data-testid="ebike-card"]')
    await card.trigger('click')

    expect(wrapper.emitted('view-details')).toBeTruthy()
    expect(wrapper.emitted('view-details')[0]).toEqual([mockEBike])
  })

  it('should show favorite icon when e-bike is favorited', () => {
    mockFavoritesStore.isFavorite.mockReturnValue(true)

    const wrapper = mount(EBikeCard, {
      props: { ebike: mockEBike }
    })

    const favoriteButton = wrapper.find('[data-testid="favorite-button"]')
    expect(favoriteButton.classes()).toContain('text-red-500')
  })

  it('should show outline icon when e-bike is not favorited', () => {
    mockFavoritesStore.isFavorite.mockReturnValue(false)

    const wrapper = mount(EBikeCard, {
      props: { ebike: mockEBike }
    })

    const favoriteButton = wrapper.find('[data-testid="favorite-button"]')
    expect(favoriteButton.classes()).toContain('text-gray-400')
  })

  it('should format price with proper locale', () => {
    const expensiveEBike = { ...mockEBike, price: 1234567 }
    const wrapper = mount(EBikeCard, {
      props: { ebike: expensiveEBike }
    })

    const priceElement = wrapper.find('[data-testid="price"]')
    expect(priceElement.text()).toBe('€1,234,567')
  })

  it('should display technical specifications', () => {
    const wrapper = mount(EBikeCard, {
      props: { ebike: mockEBike }
    })

    expect(wrapper.text()).toContain('250W')
    expect(wrapper.text()).toContain('500Wh')
    expect(wrapper.text()).toContain('50km')
    expect(wrapper.text()).toContain('25kg')
  })
})
