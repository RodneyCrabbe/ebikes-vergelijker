import { config } from 'vitest/config'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts']
  }
})

// Mock Supabase
const mockSupabase = {
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    then: vi.fn().mockResolvedValue({ data: [], error: null })
  })),
  auth: {
    getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
    signInWithPassword: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
    signUp: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
    signOut: vi.fn().mockResolvedValue({ error: null }),
    onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } }))
  }
}

vi.mock('../lib/supabase', () => ({
  supabase: mockSupabase
}))

// Mock Intersection Observer
global.IntersectionObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))

// Mock ResizeObserver
global.ResizeObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))

// Mock Speech Recognition
global.SpeechRecognition = vi.fn(() => ({
  start: vi.fn(),
  stop: vi.fn(),
  abort: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn()
}))

// Mock Speech Synthesis
global.speechSynthesis = {
  speak: vi.fn(),
  cancel: vi.fn(),
  getVoices: vi.fn(() => [])
}

// Mock Chart.js
vi.mock('chart.js', () => ({
  Chart: vi.fn(),
  registerables: []
}))

// Mock Anthropic SDK
vi.mock('@anthropic-ai/sdk', () => ({
  Anthropic: vi.fn(() => ({
    messages: {
      create: vi.fn().mockResolvedValue({
        content: [{ text: 'Mock AI response' }]
      })
    }
  }))
}))

// Setup global test utilities
global.testUtils = {
  createMockUser: () => ({
    id: 'test-user-id',
    email: 'test@example.com',
    user_metadata: {
      full_name: 'Test User'
    }
  }),
  createMockEBike: () => ({
    id: 'test-ebike-id',
    model_name: 'Test E-Bike',
    brand: 'Test Brand',
    price: 2500,
    category: 'city',
    image_url: '/test-image.jpg'
  }),
  createMockReview: () => ({
    id: 'test-review-id',
    user_id: 'test-user-id',
    ebike_id: 'test-ebike-id',
    rating: 5,
    comment: 'Great bike!',
    created_at: new Date().toISOString()
  })
}