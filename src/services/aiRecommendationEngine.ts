import { supabase } from '../lib/supabase'
import type { EBike } from '../types/ebike'
import type { User, UserPreferences } from '../types/user'

export interface RecommendationContext {
  user: User | null
  preferences: UserPreferences | null
  recentActivity: Array<{
    type: string
    ebike_id: string
    timestamp: string
  }>
  location?: {
    city: string
    province: string
  }
}

export interface RecommendationResult {
  ebike: EBike
  score: number
  reasons: string[]
  confidence: number
}

export interface UserBehavior {
  views: Array<{ ebike_id: string; count: number; last_viewed: string }>
  favorites: Array<{ ebike_id: string; added_at: string }>
  comparisons: Array<{ ebike_ids: string[]; created_at: string }>
  searches: Array<{ query: string; filters: any; timestamp: string }>
}

class AIRecommendationEngine {
  private cache = new Map<string, RecommendationResult[]>()
  private cacheTimeout = 10 * 60 * 1000 // 10 minutes

  // Generate personalized recommendations for a user
  async generatePersonalizedRecommendations(
    userId: string,
    limit = 10
  ): Promise<RecommendationResult[]> {
    const cacheKey = `recommendations:${userId}:${limit}`
    const cached = this.cache.get(cacheKey)
    
    if (cached && this.isCacheValid(cacheKey)) {
      return cached
    }

    try {
      // Get user context
      const context = await this.getUserContext(userId)
      
      // Get all e-bikes
      const { data: ebikes, error } = await supabase
        .from('ebikes')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      // Generate recommendations using multiple algorithms
      const recommendations = await this.generateRecommendations(
        ebikes || [],
        context,
        limit
      )

      // Cache results
      this.cache.set(cacheKey, recommendations)
      setTimeout(() => this.cache.delete(cacheKey), this.cacheTimeout)

      return recommendations
    } catch (error) {
      console.error('Error generating recommendations:', error)
      return []
    }
  }

  // Get user context for recommendations
  private async getUserContext(userId: string): Promise<RecommendationContext> {
    const [userData, preferencesData, behaviorData] = await Promise.all([
      this.getUserData(userId),
      this.getUserPreferences(userId),
      this.getUserBehavior(userId)
    ])

    return {
      user: userData,
      preferences: preferencesData,
      recentActivity: behaviorData.views.map(view => ({
        type: 'view',
        ebike_id: view.ebike_id,
        timestamp: view.last_viewed
      })),
      location: userData ? {
        city: userData.city || '',
        province: userData.province || ''
      } : undefined
    }
  }

  // Get user data
  private async getUserData(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  }

  // Get user preferences
  private async getUserPreferences(userId: string) {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  // Get user behavior data
  private async getUserBehavior(userId: string): Promise<UserBehavior> {
    const [viewsResult, favoritesResult, comparisonsResult, searchesResult] = await Promise.all([
      supabase
        .from('user_activities')
        .select('activity_data')
        .eq('user_id', userId)
        .eq('activity_type', 'bike_view'),
      supabase
        .from('favorites')
        .select('ebike_id, created_at')
        .eq('user_id', userId),
      supabase
        .from('saved_comparisons')
        .select('ebike_ids, created_at')
        .eq('user_id', userId),
      supabase
        .from('user_activities')
        .select('activity_data')
        .eq('user_id', userId)
        .eq('activity_type', 'search_performed')
    ])

    // Process views data
    const viewCounts = new Map<string, { count: number; last_viewed: string }>()
    viewsResult.data?.forEach(activity => {
      const ebikeId = activity.activity_data?.ebike_id
      if (ebikeId) {
        const existing = viewCounts.get(ebikeId)
        if (existing) {
          existing.count++
          if (activity.activity_data.timestamp > existing.last_viewed) {
            existing.last_viewed = activity.activity_data.timestamp
          }
        } else {
          viewCounts.set(ebikeId, {
            count: 1,
            last_viewed: activity.activity_data.timestamp
          })
        }
      }
    })

    return {
      views: Array.from(viewCounts.entries()).map(([ebike_id, data]) => ({
        ebike_id,
        ...data
      })),
      favorites: favoritesResult.data || [],
      comparisons: comparisonsResult.data || [],
      searches: searchesResult.data?.map(s => ({
        query: s.activity_data?.query || '',
        filters: s.activity_data?.filters || {},
        timestamp: s.activity_data?.timestamp || ''
      })) || []
    }
  }

  // Generate recommendations using multiple algorithms
  private async generateRecommendations(
    ebikes: EBike[],
    context: RecommendationContext,
    limit: number
  ): Promise<RecommendationResult[]> {
    const recommendations = new Map<string, RecommendationResult>()

    // 1. Content-based filtering (based on user preferences)
    const contentBased = this.contentBasedFiltering(ebikes, context)
    contentBased.forEach(rec => {
      recommendations.set(rec.ebike.id, rec)
    })

    // 2. Collaborative filtering (based on similar users)
    const collaborative = await this.collaborativeFiltering(ebikes, context)
    collaborative.forEach(rec => {
      const existing = recommendations.get(rec.ebike.id)
      if (existing) {
        existing.score = (existing.score + rec.score) / 2
        existing.reasons.push(...rec.reasons)
      } else {
        recommendations.set(rec.ebike.id, rec)
      }
    })

    // 3. Trending bikes (popular in user's area)
    const trending = await this.trendingBikes(ebikes, context)
    trending.forEach(rec => {
      const existing = recommendations.get(rec.ebike.id)
      if (existing) {
        existing.score = existing.score * 0.7 + rec.score * 0.3
        existing.reasons.push(...rec.reasons)
      } else {
        recommendations.set(rec.ebike.id, rec)
      }
    })

    // 4. Price-based recommendations
    const priceBased = this.priceBasedRecommendations(ebikes, context)
    priceBased.forEach(rec => {
      const existing = recommendations.get(rec.ebike.id)
      if (existing) {
        existing.score = existing.score * 0.8 + rec.score * 0.2
        existing.reasons.push(...rec.reasons)
      } else {
        recommendations.set(rec.ebike.id, rec)
      }
    })

    // Sort by score and return top recommendations
    return Array.from(recommendations.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
  }

  // Content-based filtering
  private contentBasedFiltering(
    ebikes: EBike[],
    context: RecommendationContext
  ): RecommendationResult[] {
    if (!context.preferences) return []

    const results: RecommendationResult[] = []

    ebikes.forEach(ebike => {
      let score = 0
      const reasons: string[] = []

      // Riding style match
      if (context.preferences?.bike_types?.includes(ebike.category || '')) {
        score += 0.3
        reasons.push('Matches your preferred bike type')
      }

      // Brand preference
      if (context.preferences?.preferred_brands?.includes(ebike.brand)) {
        score += 0.2
        reasons.push('From your preferred brand')
      }

      // Price range
      if (context.preferences?.max_price && ebike.price <= context.preferences.max_price) {
        score += 0.2
        reasons.push('Within your budget')
      }

      // Weight preference
      if (context.preferences?.max_weight && ebike.weight_kg && ebike.weight_kg <= context.preferences.max_weight) {
        score += 0.1
        reasons.push('Lightweight option')
      }

      // Range preference
      if (context.preferences?.min_range_km && ebike.action_radius && ebike.action_radius >= context.preferences.min_range_km) {
        score += 0.1
        reasons.push('Good range for your needs')
      }

      // Color preference
      if (context.preferences?.preferred_colors?.length) {
        const colors = ebike.colors || []
        const hasPreferredColor = colors.some(color => 
          context.preferences?.preferred_colors?.some(pref => 
            color.toLowerCase().includes(pref.toLowerCase())
          )
        )
        if (hasPreferredColor) {
          score += 0.05
          reasons.push('Available in your preferred color')
        }
      }

      if (score > 0) {
        results.push({
          ebike,
          score,
          reasons,
          confidence: Math.min(score * 2, 1)
        })
      }
    })

    return results
  }

  // Collaborative filtering
  private async collaborativeFiltering(
    ebikes: EBike[],
    context: RecommendationContext
  ): Promise<RecommendationResult[]> {
    if (!context.user) return []

    try {
      // Find similar users based on activity patterns
      const similarUsers = await this.findSimilarUsers(context.user.id)
      
      const results: RecommendationResult[] = []
      const ebikeScores = new Map<string, { score: number; reasons: string[] }>()

      // Get bikes liked by similar users
      for (const userId of similarUsers) {
        const { data: favorites } = await supabase
          .from('favorites')
          .select('ebike_id')
          .eq('user_id', userId)

        favorites?.forEach(fav => {
          const existing = ebikeScores.get(fav.ebike_id)
          if (existing) {
            existing.score += 0.1
            existing.reasons.push('Liked by users with similar preferences')
          } else {
            ebikeScores.set(fav.ebike_id, {
              score: 0.1,
              reasons: ['Liked by users with similar preferences']
            })
          }
        })
      }

      // Convert to recommendation results
      ebikeScores.forEach((data, ebikeId) => {
        const ebike = ebikes.find(e => e.id === ebikeId)
        if (ebike) {
          results.push({
            ebike,
            score: data.score,
            reasons: data.reasons,
            confidence: Math.min(data.score * 5, 1)
          })
        }
      })

      return results
    } catch (error) {
      console.error('Error in collaborative filtering:', error)
      return []
    }
  }

  // Find similar users
  private async findSimilarUsers(userId: string): Promise<string[]> {
    // Get user's preferences
    const { data: userPrefs } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (!userPrefs) return []

    // Find users with similar preferences
    const { data: similarUsers } = await supabase
      .from('user_preferences')
      .select('user_id')
      .neq('user_id', userId)
      .limit(10)

    // Simple similarity based on bike types and brands
    const similarUserIds: string[] = []
    
    similarUsers?.forEach(user => {
      // This is a simplified similarity check
      // In a real implementation, you'd use more sophisticated algorithms
      similarUserIds.push(user.user_id)
    })

    return similarUserIds.slice(0, 5) // Return top 5 similar users
  }

  // Trending bikes in user's area
  private async trendingBikes(
    ebikes: EBike[],
    context: RecommendationContext
  ): Promise<RecommendationResult[]> {
    if (!context.location) return []

    try {
      // Get recent views from users in the same area
      const { data: recentViews } = await supabase
        .from('user_activities')
        .select('activity_data')
        .eq('activity_type', 'bike_view')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Last 7 days

      const viewCounts = new Map<string, number>()
      recentViews?.forEach(activity => {
        const ebikeId = activity.activity_data?.ebike_id
        if (ebikeId) {
          viewCounts.set(ebikeId, (viewCounts.get(ebikeId) || 0) + 1)
        }
      })

      const results: RecommendationResult[] = []
      const maxViews = Math.max(...Array.from(viewCounts.values()))

      viewCounts.forEach((count, ebikeId) => {
        const ebike = ebikes.find(e => e.id === ebikeId)
        if (ebike) {
          const score = count / maxViews * 0.3 // Normalize to 0-0.3 range
          results.push({
            ebike,
            score,
            reasons: ['Trending in your area'],
            confidence: Math.min(score * 3, 1)
          })
        }
      })

      return results
    } catch (error) {
      console.error('Error getting trending bikes:', error)
      return []
    }
  }

  // Price-based recommendations
  private priceBasedRecommendations(
    ebikes: EBike[],
    context: RecommendationContext
  ): RecommendationResult[] {
    if (!context.preferences?.max_price) return []

    const results: RecommendationResult[] = []
    const maxPrice = context.preferences.max_price

    ebikes.forEach(ebike => {
      if (ebike.price && ebike.price <= maxPrice) {
        const priceRatio = ebike.price / maxPrice
        const score = (1 - priceRatio) * 0.2 // Higher score for lower prices

        results.push({
          ebike,
          score,
          reasons: ['Good value for money'],
          confidence: 0.8
        })
      }
    })

    return results
  }

  // Cache management
  private isCacheValid(key: string): boolean {
    // Simple cache validation - in production you'd want more sophisticated caching
    return true
  }

  // Predict user intent from search query
  async predictUserIntent(
    searchQuery: string,
    context: RecommendationContext
  ): Promise<{
    intent: string
    confidence: number
    suggestedFilters: any
  }> {
    const query = searchQuery.toLowerCase()
    
    // Simple intent detection based on keywords
    if (query.includes('budget') || query.includes('goedkoop') || query.includes('prijs')) {
      return {
        intent: 'budget_search',
        confidence: 0.8,
        suggestedFilters: { max_price: 2000 }
      }
    }
    
    if (query.includes('mountain') || query.includes('offroad')) {
      return {
        intent: 'mountain_bike',
        confidence: 0.9,
        suggestedFilters: { category: 'mountain' }
      }
    }
    
    if (query.includes('commute') || query.includes('woon-werk')) {
      return {
        intent: 'commute_bike',
        confidence: 0.9,
        suggestedFilters: { category: 'commute' }
      }
    }
    
    if (query.includes('long') || query.includes('range') || query.includes('bereik')) {
      return {
        intent: 'long_range',
        confidence: 0.8,
        suggestedFilters: { min_range: 80 }
      }
    }
    
    return {
      intent: 'general_search',
      confidence: 0.5,
      suggestedFilters: {}
    }
  }

  // Get similar bikes to a given bike
  async getSimilarBikes(
    ebikeId: string,
    limit = 5
  ): Promise<RecommendationResult[]> {
    try {
      const { data: targetBike, error } = await supabase
        .from('ebikes')
        .select('*')
        .eq('id', ebikeId)
        .single()

      if (error) throw error

      const { data: allBikes, error: bikesError } = await supabase
        .from('ebikes')
        .select('*')
        .neq('id', ebikeId)

      if (bikesError) throw bikesError

      const results: RecommendationResult[] = []

      allBikes?.forEach(bike => {
        let score = 0
        const reasons: string[] = []

        // Same brand
        if (bike.brand === targetBike.brand) {
          score += 0.3
          reasons.push('Same brand')
        }

        // Similar price range (±20%)
        if (targetBike.price && bike.price) {
          const priceDiff = Math.abs(bike.price - targetBike.price) / targetBike.price
          if (priceDiff <= 0.2) {
            score += 0.2
            reasons.push('Similar price range')
          }
        }

        // Similar specifications
        if (targetBike.action_radius && bike.action_radius) {
          const rangeDiff = Math.abs(bike.action_radius - targetBike.action_radius) / targetBike.action_radius
          if (rangeDiff <= 0.2) {
            score += 0.15
            reasons.push('Similar range')
          }
        }

        if (targetBike.battery_capacity && bike.battery_capacity) {
          const batteryDiff = Math.abs(bike.battery_capacity - targetBike.battery_capacity) / targetBike.battery_capacity
          if (batteryDiff <= 0.2) {
            score += 0.15
            reasons.push('Similar battery capacity')
          }
        }

        // Same category
        if (bike.category === targetBike.category) {
          score += 0.2
          reasons.push('Same category')
        }

        if (score > 0) {
          results.push({
            ebike: bike,
            score,
            reasons,
            confidence: Math.min(score * 2, 1)
          })
        }
      })

      return results
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
    } catch (error) {
      console.error('Error getting similar bikes:', error)
      return []
    }
  }
}

export const aiRecommendationEngine = new AIRecommendationEngine()
