import type { EBike, CreateEBikeInput } from '../types/ebike'
import type { LoginData, RegisterData } from '../types/user'
import { logger } from '../utils/logger'

const WP_API_URL = import.meta.env.VITE_WP_API_URL || ''

interface WPAuthResponse {
  token: string
  user_email: string
  user_nicename: string
  user_display_name: string
}

export class WordPressService {
  private static tokenKey = 'wp_jwt_token'

  private static getStoredToken(): string | null {
    return localStorage.getItem(this.tokenKey)
  }

  private static setStoredToken(token: string) {
    localStorage.setItem(this.tokenKey, token)
  }

  private static removeStoredToken() {
    localStorage.removeItem(this.tokenKey)
  }

  private static async getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    const token = this.getStoredToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    return headers
  }

  static async login(data: LoginData): Promise<WPAuthResponse> {
    try {
      const response = await fetch(`${WP_API_URL}/jwt-auth/v1/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            username: data.email, // WP JWT usually expects username, but we can often use email if plugin allows or if we map it
            password: data.password 
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Login failed')
      }

      const result = await response.json()
      if (result.token) {
          this.setStoredToken(result.token)
      }
      return result
    } catch (error) {
      logger.error('WP Login Error:', error)
      throw error
    }
  }

  static async register(data: RegisterData): Promise<any> {
      try {
        // Note: Public registration needs to be enabled in WP or use a plugin endpoint
        const response = await fetch(`${WP_API_URL}/wp/v2/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: data.email, // Using email as username for simplicity
                email: data.email,
                password: data.password,
                name: data.name
            })
        })
        
        if (!response.ok) {
             const error = await response.json()
             throw new Error(error.message || 'Registration failed')
        }
        return await response.json()
      } catch (error) {
          logger.error('WP Register Error:', error)
          throw error
      }
  }

  static logout() {
      this.removeStoredToken()
  }

  static async getCurrentUser() {
      const token = this.getStoredToken()
      if (!token) return null

      try {
          const response = await fetch(`${WP_API_URL}/wp/v2/users/me`, {
              headers: {
                  'Authorization': `Bearer ${token}`
              }
          })

          if (!response.ok) {
              this.removeStoredToken() // Token invalid
              return null
          }

          const user = await response.json()
          // Map WP user to our User type
          return {
              id: String(user.id),
              email: user.email, // Note: Standard WP REST API might not return email for all roles/contexts without proper permissions
              name: user.name,
              created_at: new Date().toISOString(), // WP doesn't easily give registration date in /me without extra fields
              newsletter_subscribed: false
          }
      } catch (e) {
          return null
      }
  }

  static async getEBikes(): Promise<EBike[]> {
    try {
      const response = await fetch(`${WP_API_URL}/wp/v2/ebike?per_page=100&_embed`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch e-bikes from WordPress')
      }

      const posts = await response.json()
      return posts.map(this.mapPostToEBike)
    } catch (error) {
      logger.error('Fetch EBikes Error:', error)
      throw error
    }
  }

  static async createEBike(data: CreateEBikeInput): Promise<EBike> {
    try {
      const postData = {
        title: `${data.brand} ${data.model_name}`,
        content: data.description || '',
        status: 'pending',
        acf: { ...data }
      }

      const headers = await this.getHeaders()
      const response = await fetch(`${WP_API_URL}/wp/v2/ebike`, {
        method: 'POST',
        headers,
        body: JSON.stringify(postData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create e-bike')
      }

      const newPost = await response.json()
      return this.mapPostToEBike(newPost)
    } catch (error) {
      logger.error('Create EBike Error:', error)
      throw error
    }
  }

  private static mapPostToEBike(post: any): EBike {
    const acf = post.acf || {}
    
    // Handle image: ACF field OR featured media
    let imageUrl = acf.image_url
    if (!imageUrl && post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0]) {
        imageUrl = post._embedded['wp:featuredmedia'][0].source_url
    }

    return {
      id: post.id.toString(),
      brand: acf.brand || '',
      model_name: post.title?.rendered || '',
      version: acf.version,
      price: Number(acf.price) || 0,
      currency: acf.currency || 'EUR',
      build_date: acf.build_date ? new Date(acf.build_date) : undefined,
      gender_type: acf.gender_type || 'unisex',
      action_radius_km: Number(acf.action_radius_km) || undefined,
      battery_capacity: Number(acf.battery_capacity) || undefined,
      top_speed_kmh: Number(acf.top_speed_kmh) || undefined,
      image_url: imageUrl,
      affiliate_url: acf.affiliate_url || '',
      cpl_rate: Number(acf.cpl_rate) || 0,
      description: post.content?.rendered || '',
      bike_type: acf.bike_type,
      color: acf.color,
      motor_location: acf.motor_location,
      removable_battery: !!acf.removable_battery,
      on_sale: !!acf.on_sale,
      created_at: new Date(post.date),
      updated_at: new Date(post.modified)
    }
  }
}
