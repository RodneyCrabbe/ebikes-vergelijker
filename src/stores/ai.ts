import { defineStore } from 'pinia'
import { ref } from 'vue'
import { aiRecommendationEngine } from '../services/aiRecommendationEngine'
import { aiContentGenerator } from '../services/aiContentGenerator'
import type { EBike } from '../types/ebike'
import type { RecommendationResult, GeneratedContent } from '../services/aiRecommendationEngine'

export const useAIStore = defineStore('ai', () => {
  const personalizedRecommendations = ref<RecommendationResult[]>([])
  const similarBikes = ref<RecommendationResult[]>([])
  const generatedContent = ref<Map<string, GeneratedContent>>(new Map())
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Generate personalized recommendations
  async function generatePersonalizedRecommendations(userId: string, limit = 10) {
    loading.value = true
    error.value = null
    
    try {
      const recommendations = await aiRecommendationEngine.generatePersonalizedRecommendations(userId, limit)
      personalizedRecommendations.value = recommendations
      return recommendations
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to generate recommendations'
      console.error('Error generating personalized recommendations:', e)
      return []
    } finally {
      loading.value = false
    }
  }

  // Get similar bikes
  async function getSimilarBikes(ebikeId: string, limit = 5) {
    loading.value = true
    error.value = null
    
    try {
      const recommendations = await aiRecommendationEngine.getSimilarBikes(ebikeId, limit)
      similarBikes.value = recommendations
      return recommendations
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to get similar bikes'
      console.error('Error getting similar bikes:', e)
      return []
    } finally {
      loading.value = false
    }
  }

  // Predict user intent
  async function predictUserIntent(searchQuery: string, context: any) {
    try {
      return await aiRecommendationEngine.predictUserIntent(searchQuery, context)
    } catch (e) {
      console.error('Error predicting user intent:', e)
      return {
        intent: 'general_search',
        confidence: 0.5,
        suggestedFilters: {}
      }
    }
  }

  // Generate bike description
  async function generateBikeDescription(ebike: EBike, language: 'nl' | 'en' | 'de' = 'nl') {
    const cacheKey = `description:${ebike.id}:${language}`
    
    if (generatedContent.value.has(cacheKey)) {
      return generatedContent.value.get(cacheKey)!
    }

    try {
      const content = await aiContentGenerator.generateBikeDescription(ebike, language)
      generatedContent.value.set(cacheKey, content)
      return content
    } catch (e) {
      console.error('Error generating bike description:', e)
      return {
        content: language === 'nl' ? 'Beschrijving niet beschikbaar.' : 'Description not available.',
        metadata: {
          wordCount: 0,
          language,
          generatedAt: new Date().toISOString(),
          confidence: 0
        }
      }
    }
  }

  // Generate bike summary
  async function generateBikeSummary(ebike: EBike, language: 'nl' | 'en' | 'de' = 'nl') {
    const cacheKey = `summary:${ebike.id}:${language}`
    
    if (generatedContent.value.has(cacheKey)) {
      return generatedContent.value.get(cacheKey)!
    }

    try {
      const content = await aiContentGenerator.generateBikeSummary(ebike, language)
      generatedContent.value.set(cacheKey, content)
      return content
    } catch (e) {
      console.error('Error generating bike summary:', e)
      return {
        content: language === 'nl' ? 'Samenvatting niet beschikbaar.' : 'Summary not available.',
        metadata: {
          wordCount: 0,
          language,
          generatedAt: new Date().toISOString(),
          confidence: 0
        }
      }
    }
  }

  // Generate meta description
  async function generateMetaDescription(ebike: EBike, language: 'nl' | 'en' | 'de' = 'nl') {
    const cacheKey = `meta:${ebike.id}:${language}`
    
    if (generatedContent.value.has(cacheKey)) {
      return generatedContent.value.get(cacheKey)!
    }

    try {
      const content = await aiContentGenerator.generateMetaDescription(ebike, language)
      generatedContent.value.set(cacheKey, content)
      return content
    } catch (e) {
      console.error('Error generating meta description:', e)
      return {
        content: language === 'nl' ? 'Meta beschrijving niet beschikbaar.' : 'Meta description not available.',
        metadata: {
          wordCount: 0,
          language,
          generatedAt: new Date().toISOString(),
          confidence: 0
        }
      }
    }
  }

  // Generate review summary
  async function generateReviewSummary(ebikeId: string, language: 'nl' | 'en' | 'de' = 'nl') {
    const cacheKey = `review_summary:${ebikeId}:${language}`
    
    if (generatedContent.value.has(cacheKey)) {
      return generatedContent.value.get(cacheKey)!
    }

    try {
      const content = await aiContentGenerator.generateReviewSummary(ebikeId, language)
      generatedContent.value.set(cacheKey, content)
      return content
    } catch (e) {
      console.error('Error generating review summary:', e)
      return {
        content: language === 'nl' ? 'Review samenvatting niet beschikbaar.' : 'Review summary not available.',
        metadata: {
          wordCount: 0,
          language,
          generatedAt: new Date().toISOString(),
          confidence: 0
        }
      }
    }
  }

  // Generate comparison summary
  async function generateComparisonSummary(ebikeIds: string[], language: 'nl' | 'en' | 'de' = 'nl') {
    const cacheKey = `comparison:${ebikeIds.sort().join(',')}:${language}`
    
    if (generatedContent.value.has(cacheKey)) {
      return generatedContent.value.get(cacheKey)!
    }

    try {
      const content = await aiContentGenerator.generateComparisonSummary(ebikeIds, language)
      generatedContent.value.set(cacheKey, content)
      return content
    } catch (e) {
      console.error('Error generating comparison summary:', e)
      return {
        content: language === 'nl' ? 'Vergelijking niet beschikbaar.' : 'Comparison not available.',
        metadata: {
          wordCount: 0,
          language,
          generatedAt: new Date().toISOString(),
          confidence: 0
        }
      }
    }
  }

  // Generate FAQ
  async function generateFAQ(ebike: EBike, language: 'nl' | 'en' | 'de' = 'nl') {
    try {
      return await aiContentGenerator.generateFAQ(ebike, language)
    } catch (e) {
      console.error('Error generating FAQ:', e)
      return []
    }
  }

  // Clear cache
  function clearCache() {
    generatedContent.value.clear()
  }

  // Clear specific cache entry
  function clearCacheEntry(key: string) {
    generatedContent.value.delete(key)
  }

  return {
    personalizedRecommendations,
    similarBikes,
    generatedContent,
    loading,
    error,
    generatePersonalizedRecommendations,
    getSimilarBikes,
    predictUserIntent,
    generateBikeDescription,
    generateBikeSummary,
    generateMetaDescription,
    generateReviewSummary,
    generateComparisonSummary,
    generateFAQ,
    clearCache,
    clearCacheEntry
  }
})
