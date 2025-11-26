// API caching utility for better performance

export interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

export class APICache {
  private cache = new Map<string, CacheEntry<any>>()
  private defaultTTL = 5 * 60 * 1000 // 5 minutes

  constructor(defaultTTL?: number) {
    this.defaultTTL = defaultTTL || this.defaultTTL
  }

  // Set cache entry
  set<T>(key: string, data: T, ttl?: number): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    }
    this.cache.set(key, entry)
  }

  // Get cache entry
  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.data
  }

  // Check if key exists and is valid
  has(key: string): boolean {
    const entry = this.cache.get(key)
    if (!entry) return false

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  // Delete cache entry
  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  // Clear all cache
  clear(): void {
    this.cache.clear()
  }

  // Get cache size
  size(): number {
    return this.cache.size
  }

  // Clean expired entries
  cleanExpired(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key)
      }
    }
  }

  // Generate cache key from parameters
  static generateKey(prefix: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${JSON.stringify(params[key])}`)
      .join('&')
    
    return `${prefix}:${sortedParams}`
  }
}

// Global API cache instance
export const apiCache = new APICache()

// Clean expired entries every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    apiCache.cleanExpired()
  }, 5 * 60 * 1000)
}

// Enhanced fetch with caching
export async function cachedFetch<T>(
  url: string,
  options: RequestInit = {},
  cacheKey?: string,
  ttl?: number
): Promise<T> {
  const key = cacheKey || url
  const cached = apiCache.get<T>(key)
  
  if (cached) {
    console.log('🚀 Cache hit for:', key)
    return cached
  }

  console.log('🌐 Fetching from API:', key)
  const response = await fetch(url, options)
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data = await response.json()
  apiCache.set(key, data, ttl)
  
  return data
}

// Supabase-specific caching wrapper
export class SupabaseCache {
  private cache = new APICache(10 * 60 * 1000) // 10 minutes TTL for Supabase data

  async fetchEBikes(filters?: any): Promise<any[]> {
    const cacheKey = APICache.generateKey('ebikes', filters || {})
    const cached = this.cache.get<any[]>(cacheKey)
    
    if (cached) {
      console.log('🚀 E-bikes cache hit')
      return cached
    }

    // This method is not used directly - the actual fetching is done in the store
    console.log('🌐 E-bikes cache miss - will fetch from Supabase')
    return []
  }

  async fetchEBikeById(id: string): Promise<any> {
    const cacheKey = `ebike:${id}`
    const cached = this.cache.get<any>(cacheKey)
    
    if (cached) {
      console.log('🚀 E-bike cache hit for ID:', id)
      return cached
    }

    console.log('🌐 Fetching e-bike from Supabase for ID:', id)
    return null
  }

  // Invalidate cache entries
  invalidateEBikes(): void {
    // Remove all e-bike related cache entries
    for (const key of this.cache['cache'].keys()) {
      if (key.startsWith('ebikes') || key.startsWith('ebike:')) {
        this.cache.delete(key)
      }
    }
    console.log('🗑️ E-bikes cache invalidated')
  }

  // Clear all cache
  clear(): void {
    this.cache.clear()
    console.log('🗑️ All cache cleared')
  }
}

export const supabaseCache = new SupabaseCache()
