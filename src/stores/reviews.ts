import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Review, CreateReviewData, ReviewFilters, ReviewStats } from '../types/review'
import { useEBikesStore } from './ebikes'

// Local storage key
const STORAGE_KEY = 'ebike-reviews'

// Helper functions for localStorage
function getStoredReviews(): Review[] {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

function saveReviews(reviews: Review[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews))
}

export const useReviewsStore = defineStore('reviews', () => {
  const reviews = ref<Review[]>(getStoredReviews())
  const currentReview = ref<Review | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const reviewStats = ref<ReviewStats | null>(null)

  // Computed properties
  const averageRating = computed(() => {
    if (reviews.value.length === 0) return 0
    const total = reviews.value.reduce((sum, review) => sum + review.rating, 0)
    return Math.round((total / reviews.value.length) * 10) / 10
  })

  const ratingDistribution = computed(() => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    reviews.value.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++
    })
    return distribution
  })

  // Fetch all reviews with optional filters
  async function fetchReviews(filters?: ReviewFilters) {
    loading.value = true
    error.value = null

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))

      // Get all reviews from localStorage
      let allReviews = getStoredReviews()

      // Apply filters
      if (filters?.ebike_id) {
        allReviews = allReviews.filter(r => r.ebike_id === filters.ebike_id)
      }
      if (filters?.rating) {
        allReviews = allReviews.filter(r => r.rating === filters.rating)
      }
      if (filters?.verified_purchase !== undefined) {
        allReviews = allReviews.filter(r => r.verified_purchase === filters.verified_purchase)
      }

      // Apply sorting
      const sortBy = filters?.sort_by || 'newest'
      allReviews.sort((a, b) => {
        switch (sortBy) {
          case 'newest':
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          case 'oldest':
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          case 'highest_rating':
            return b.rating - a.rating
          case 'lowest_rating':
            return a.rating - b.rating
          case 'most_helpful':
            return (b.helpful_count || 0) - (a.helpful_count || 0)
          default:
            return 0
        }
      })

      // Get e-bike store to populate e-bike information
      const eBikesStore = useEBikesStore()
      const allEBikes = eBikesStore.getAllEBikes()

      // Transform the data to include e-bike info
      reviews.value = allReviews.map(review => {
        const ebike = allEBikes.find(e => e.id === review.ebike_id)
        return {
          ...review,
          ebike_brand: ebike?.brand || 'Unknown',
          ebike_model: ebike?.model_name || 'Unknown'
        }
      })

    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch reviews'
      throw e
    } finally {
      loading.value = false
    }
  }

  // Fetch a single review by ID
  async function fetchReviewById(id: string) {
    loading.value = true
    error.value = null

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200))

      const allReviews = getStoredReviews()
      const review = allReviews.find(r => r.id === id)

      if (!review) {
        throw new Error('Review not found')
      }

      // Get e-bike store to populate e-bike information
      const eBikesStore = useEBikesStore()
      const allEBikes = eBikesStore.getAllEBikes()
      const ebike = allEBikes.find(e => e.id === review.ebike_id)

      currentReview.value = {
        ...review,
        ebike_brand: ebike?.brand || 'Unknown',
        ebike_model: ebike?.model_name || 'Unknown'
      }

      return currentReview.value
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch review'
      throw e
    } finally {
      loading.value = false
    }
  }

  // Create a new review
  async function createReview(reviewData: CreateReviewData, userId?: string) {
    loading.value = true
    error.value = null

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))

      // Get current user from localStorage
      const currentUser = localStorage.getItem('ebike-current-user')
      const user = currentUser ? JSON.parse(currentUser) : null

      const newReview: Review = {
        id: crypto.randomUUID(),
        user_id: reviewData.anonymous ? null : (userId || user?.id || null),
        user_name: reviewData.anonymous ? 'Anonieme gebruiker' : (user?.name || 'Gebruiker'),
        user_avatar: null,
        ebike_id: reviewData.ebike_id,
        ebike_brand: '',
        ebike_model: '',
        rating: reviewData.rating,
        title: reviewData.title,
        content: reviewData.content,
        pros: reviewData.pros,
        cons: reviewData.cons,
        verified_purchase: reviewData.verified_purchase || false,
        helpful_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      // Add to reviews
      const allReviews = getStoredReviews()
      allReviews.unshift(newReview)
      saveReviews(allReviews)

      // Update local state
      reviews.value.unshift(newReview)

      return newReview
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to create review'
      throw e
    } finally {
      loading.value = false
    }
  }

  // Update a review
  async function updateReview(id: string, updates: Partial<CreateReviewData>) {
    loading.value = true
    error.value = null

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))

      const allReviews = getStoredReviews()
      const index = allReviews.findIndex(r => r.id === id)

      if (index === -1) {
        throw new Error('Review not found')
      }

      // Update the review
      allReviews[index] = {
        ...allReviews[index],
        ...updates,
        updated_at: new Date().toISOString()
      }

      saveReviews(allReviews)

      // Update the review in the current list
      const localIndex = reviews.value.findIndex(review => review.id === id)
      if (localIndex !== -1) {
        reviews.value[localIndex] = { ...reviews.value[localIndex], ...allReviews[index] }
      }

      return allReviews[index]
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to update review'
      throw e
    } finally {
      loading.value = false
    }
  }

  // Delete a review
  async function deleteReview(id: string) {
    loading.value = true
    error.value = null

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200))

      const allReviews = getStoredReviews()
      const filteredReviews = allReviews.filter(r => r.id !== id)
      saveReviews(filteredReviews)

      // Remove the review from the current list
      reviews.value = reviews.value.filter(review => review.id !== id)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to delete review'
      throw e
    } finally {
      loading.value = false
    }
  }

  // Mark a review as helpful
  async function markHelpful(id: string) {
    try {
      const allReviews = getStoredReviews()
      const index = allReviews.findIndex(r => r.id === id)

      if (index !== -1) {
        allReviews[index].helpful_count = (allReviews[index].helpful_count || 0) + 1
        saveReviews(allReviews)

        // Update the helpful count in the current list
        const review = reviews.value.find(r => r.id === id)
        if (review) {
          review.helpful_count = (review.helpful_count || 0) + 1
        }
      }
    } catch (e) {
      console.error('Failed to mark review as helpful:', e)
    }
  }

  // Fetch review stats for an e-bike
  async function fetchReviewStats(ebikeId: string) {
    loading.value = true
    error.value = null

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200))

      const allReviews = getStoredReviews()
      const ebikeReviews = allReviews.filter(r => r.ebike_id === ebikeId)

      const stats: ReviewStats = {
        total_reviews: ebikeReviews.length,
        average_rating: 0,
        rating_distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        verified_purchases: ebikeReviews.filter(r => r.verified_purchase).length
      }

      if (ebikeReviews.length > 0) {
        const totalRating = ebikeReviews.reduce((sum, review) => sum + review.rating, 0)
        stats.average_rating = Math.round((totalRating / ebikeReviews.length) * 10) / 10

        ebikeReviews.forEach(review => {
          stats.rating_distribution[review.rating as keyof typeof stats.rating_distribution]++
        })
      }

      reviewStats.value = stats
      return stats
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch review stats'
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    reviews,
    currentReview,
    loading,
    error,
    reviewStats,
    averageRating,
    ratingDistribution,
    fetchReviews,
    fetchReviewById,
    createReview,
    updateReview,
    deleteReview,
    markHelpful,
    fetchReviewStats
  }
})
