import { supabase } from '../lib/supabase'
import type { EBike } from '../types/ebike'

export interface ContentGenerationRequest {
  type: 'description' | 'summary' | 'meta_description' | 'review_summary' | 'comparison_summary'
  context?: any
  targetLength?: number
  language?: 'nl' | 'en' | 'de'
}

export interface GeneratedContent {
  content: string
  metadata: {
    wordCount: number
    language: string
    generatedAt: string
    confidence: number
  }
}

class AIContentGenerator {
  private cache = new Map<string, GeneratedContent>()
  private cacheTimeout = 24 * 60 * 60 * 1000 // 24 hours

  // Generate bike description
  async generateBikeDescription(ebike: EBike, language: 'nl' | 'en' | 'de' = 'nl'): Promise<GeneratedContent> {
    const cacheKey = `description:${ebike.id}:${language}`
    const cached = this.cache.get(cacheKey)
    
    if (cached && this.isCacheValid(cacheKey)) {
      return cached
    }

    const content = await this.generateDescription(ebike, language)
    const result = {
      content,
      metadata: {
        wordCount: content.split(' ').length,
        language,
        generatedAt: new Date().toISOString(),
        confidence: 0.9
      }
    }

    this.cache.set(cacheKey, result)
    setTimeout(() => this.cache.delete(cacheKey), this.cacheTimeout)

    return result
  }

  // Generate bike summary
  async generateBikeSummary(ebike: EBike, language: 'nl' | 'en' | 'de' = 'nl'): Promise<GeneratedContent> {
    const cacheKey = `summary:${ebike.id}:${language}`
    const cached = this.cache.get(cacheKey)
    
    if (cached && this.isCacheValid(cacheKey)) {
      return cached
    }

    const content = await this.generateSummary(ebike, language)
    const result = {
      content,
      metadata: {
        wordCount: content.split(' ').length,
        language,
        generatedAt: new Date().toISOString(),
        confidence: 0.85
      }
    }

    this.cache.set(cacheKey, result)
    setTimeout(() => this.cache.delete(cacheKey), this.cacheTimeout)

    return result
  }

  // Generate SEO meta description
  async generateMetaDescription(ebike: EBike, language: 'nl' | 'en' | 'de' = 'nl'): Promise<GeneratedContent> {
    const cacheKey = `meta:${ebike.id}:${language}`
    const cached = this.cache.get(cacheKey)
    
    if (cached && this.isCacheValid(cacheKey)) {
      return cached
    }

    const content = await this.generateMetaDesc(ebike, language)
    const result = {
      content,
      metadata: {
        wordCount: content.split(' ').length,
        language,
        generatedAt: new Date().toISOString(),
        confidence: 0.8
      }
    }

    this.cache.set(cacheKey, result)
    setTimeout(() => this.cache.delete(cacheKey), this.cacheTimeout)

    return result
  }

  // Generate review summary
  async generateReviewSummary(ebikeId: string, language: 'nl' | 'en' | 'de' = 'nl'): Promise<GeneratedContent> {
    const cacheKey = `review_summary:${ebikeId}:${language}`
    const cached = this.cache.get(cacheKey)
    
    if (cached && this.isCacheValid(cacheKey)) {
      return cached
    }

    try {
      const { data: reviews, error } = await supabase
        .from('reviews')
        .select('rating, content, title')
        .eq('ebike_id', ebikeId)
        .not('content', 'is', null)

      if (error) throw error

      if (!reviews || reviews.length === 0) {
        return {
          content: language === 'nl' ? 'Nog geen reviews beschikbaar.' : 'No reviews available yet.',
          metadata: {
            wordCount: 0,
            language,
            generatedAt: new Date().toISOString(),
            confidence: 0
          }
        }
      }

      const content = await this.generateReviewSummaryContent(reviews, language)
      const result = {
        content,
        metadata: {
          wordCount: content.split(' ').length,
          language,
          generatedAt: new Date().toISOString(),
          confidence: 0.75
        }
      }

      this.cache.set(cacheKey, result)
      setTimeout(() => this.cache.delete(cacheKey), this.cacheTimeout)

      return result
    } catch (error) {
      console.error('Error generating review summary:', error)
      return {
        content: language === 'nl' ? 'Fout bij het genereren van review samenvatting.' : 'Error generating review summary.',
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
  async generateComparisonSummary(ebikeIds: string[], language: 'nl' | 'en' | 'de' = 'nl'): Promise<GeneratedContent> {
    const cacheKey = `comparison:${ebikeIds.sort().join(',')}:${language}`
    const cached = this.cache.get(cacheKey)
    
    if (cached && this.isCacheValid(cacheKey)) {
      return cached
    }

    try {
      const { data: ebikes, error } = await supabase
        .from('ebikes')
        .select('*')
        .in('id', ebikeIds)

      if (error) throw error

      if (!ebikes || ebikes.length < 2) {
        return {
          content: language === 'nl' ? 'Niet genoeg e-bikes om te vergelijken.' : 'Not enough e-bikes to compare.',
          metadata: {
            wordCount: 0,
            language,
            generatedAt: new Date().toISOString(),
            confidence: 0
          }
        }
      }

      const content = await this.generateComparisonContent(ebikes, language)
      const result = {
        content,
        metadata: {
          wordCount: content.split(' ').length,
          language,
          generatedAt: new Date().toISOString(),
          confidence: 0.8
        }
      }

      this.cache.set(cacheKey, result)
      setTimeout(() => this.cache.delete(cacheKey), this.cacheTimeout)

      return result
    } catch (error) {
      console.error('Error generating comparison summary:', error)
      return {
        content: language === 'nl' ? 'Fout bij het genereren van vergelijking.' : 'Error generating comparison.',
        metadata: {
          wordCount: 0,
          language,
          generatedAt: new Date().toISOString(),
          confidence: 0
        }
      }
    }
  }

  // Generate FAQ content
  async generateFAQ(ebike: EBike, language: 'nl' | 'en' | 'de' = 'nl'): Promise<Array<{ question: string; answer: string }>> {
    const faqs: Array<{ question: string; answer: string }> = []

    // Common questions based on bike specifications
    if (ebike.action_radius) {
      faqs.push({
        question: language === 'nl' ? 'Wat is de actieradius van deze e-bike?' : 'What is the range of this e-bike?',
        answer: language === 'nl' 
          ? `Deze e-bike heeft een actieradius van ongeveer ${ebike.action_radius} km per lading.`
          : `This e-bike has a range of approximately ${ebike.action_radius} km per charge.`
      })
    }

    if (ebike.battery_capacity) {
      faqs.push({
        question: language === 'nl' ? 'Hoe groot is de accu?' : 'How big is the battery?',
        answer: language === 'nl'
          ? `De accu heeft een capaciteit van ${ebike.battery_capacity} Wh.`
          : `The battery has a capacity of ${ebike.battery_capacity} Wh.`
      })
    }

    if (ebike.weight_kg) {
      faqs.push({
        question: language === 'nl' ? 'Hoe zwaar is deze e-bike?' : 'How heavy is this e-bike?',
        answer: language === 'nl'
          ? `Deze e-bike weegt ${ebike.weight_kg} kg.`
          : `This e-bike weighs ${ebike.weight_kg} kg.`
      })
    }

    if (ebike.top_speed) {
      faqs.push({
        question: language === 'nl' ? 'Wat is de topsnelheid?' : 'What is the top speed?',
        answer: language === 'nl'
          ? `De topsnelheid is ${ebike.top_speed} km/h.`
          : `The top speed is ${ebike.top_speed} km/h.`
      })
    }

    return faqs
  }

  // Private methods for content generation
  private async generateDescription(ebike: EBike, language: string): Promise<string> {
    const specs = this.extractSpecifications(ebike)
    
    if (language === 'nl') {
      return this.generateDutchDescription(ebike, specs)
    } else if (language === 'en') {
      return this.generateEnglishDescription(ebike, specs)
    } else {
      return this.generateGermanDescription(ebike, specs)
    }
  }

  private async generateSummary(ebike: EBike, language: string): Promise<string> {
    const specs = this.extractSpecifications(ebike)
    
    if (language === 'nl') {
      return this.generateDutchSummary(ebike, specs)
    } else if (language === 'en') {
      return this.generateEnglishSummary(ebike, specs)
    } else {
      return this.generateGermanSummary(ebike, specs)
    }
  }

  private async generateMetaDesc(ebike: EBike, language: string): Promise<string> {
    const specs = this.extractSpecifications(ebike)
    
    if (language === 'nl') {
      return `${ebike.brand} ${ebike.model_name} - ${specs.range}km bereik, ${specs.battery}Wh accu. ${specs.price ? `Vanaf €${ebike.price.toLocaleString()}` : 'Prijs op aanvraag'}. Bekijk specificaties en reviews.`
    } else if (language === 'en') {
      return `${ebike.brand} ${ebike.model_name} - ${specs.range}km range, ${specs.battery}Wh battery. ${specs.price ? `From €${ebike.price.toLocaleString()}` : 'Price on request'}. View specifications and reviews.`
    } else {
      return `${ebike.brand} ${ebike.model_name} - ${specs.range}km Reichweite, ${specs.battery}Wh Akku. ${specs.price ? `Ab €${ebike.price.toLocaleString()}` : 'Preis auf Anfrage'}. Spezifikationen und Bewertungen ansehen.`
    }
  }

  private async generateReviewSummaryContent(reviews: any[], language: string): Promise<string> {
    const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    const totalReviews = reviews.length

    if (language === 'nl') {
      return `Gebaseerd op ${totalReviews} reviews heeft deze e-bike een gemiddelde beoordeling van ${avgRating.toFixed(1)} sterren. ${this.getRatingSummary(avgRating, 'nl')}`
    } else if (language === 'en') {
      return `Based on ${totalReviews} reviews, this e-bike has an average rating of ${avgRating.toFixed(1)} stars. ${this.getRatingSummary(avgRating, 'en')}`
    } else {
      return `Basierend auf ${totalReviews} Bewertungen hat dieses E-Bike eine durchschnittliche Bewertung von ${avgRating.toFixed(1)} Sternen. ${this.getRatingSummary(avgRating, 'de')}`
    }
  }

  private async generateComparisonContent(ebikes: EBike[], language: string): Promise<string> {
    const specs = ebikes.map(ebike => this.extractSpecifications(ebike))
    
    if (language === 'nl') {
      return this.generateDutchComparison(ebikes, specs)
    } else if (language === 'en') {
      return this.generateEnglishComparison(ebikes, specs)
    } else {
      return this.generateGermanComparison(ebikes, specs)
    }
  }

  // Language-specific content generators
  private generateDutchDescription(ebike: EBike, specs: any): string {
    return `De ${ebike.brand} ${ebike.model_name} is een ${specs.category || 'hoogwaardige'} e-bike die perfect geschikt is voor ${specs.use_case || 'dagelijks gebruik'}. Met een ${specs.battery}Wh accu en een actieradius van ${specs.range}km biedt deze fiets uitstekende prestaties voor ${specs.target_audience || 'alle fietsers'}.

Deze e-bike beschikt over ${specs.motor_power || 'krachtige'} motorondersteuning tot ${specs.top_speed || 25} km/h, wat zorgt voor een soepele en efficiënte rijervaring. Het ${specs.frame_material || 'aluminium'} frame zorgt voor een goede balans tussen stevigheid en gewicht.

${specs.features ? `Bijzondere kenmerken: ${specs.features.join(', ')}.` : ''}

${ebike.price ? `De ${ebike.brand} ${ebike.model_name} is verkrijgbaar vanaf €${ebike.price.toLocaleString()}.` : 'Voor de actuele prijs kunt u contact opnemen met een dealer.'}`
  }

  private generateEnglishDescription(ebike: EBike, specs: any): string {
    return `The ${ebike.brand} ${ebike.model_name} is a ${specs.category || 'high-quality'} e-bike that's perfect for ${specs.use_case || 'daily commuting'}. With a ${specs.battery}Wh battery and a range of ${specs.range}km, this bike offers excellent performance for ${specs.target_audience || 'all cyclists'}.

This e-bike features ${specs.motor_power || 'powerful'} motor assistance up to ${specs.top_speed || 25} km/h, providing a smooth and efficient riding experience. The ${specs.frame_material || 'aluminum'} frame ensures a good balance between strength and weight.

${specs.features ? `Key features: ${specs.features.join(', ')}.` : ''}

${ebike.price ? `The ${ebike.brand} ${ebike.model_name} is available from €${ebike.price.toLocaleString()}.` : 'For current pricing, please contact a dealer.'}`
  }

  private generateGermanDescription(ebike: EBike, specs: any): string {
    return `Das ${ebike.brand} ${ebike.model_name} ist ein ${specs.category || 'hochwertiges'} E-Bike, das perfekt für ${specs.use_case || 'den täglichen Gebrauch'} geeignet ist. Mit einem ${specs.battery}Wh Akku und einer Reichweite von ${specs.range}km bietet dieses Fahrrad ausgezeichnete Leistung für ${specs.target_audience || 'alle Radfahrer'}.

Dieses E-Bike verfügt über ${specs.motor_power || 'leistungsstarke'} Motorunterstützung bis zu ${specs.top_speed || 25} km/h, was für ein sanftes und effizientes Fahrerlebnis sorgt. Der ${specs.frame_material || 'Aluminium'}-Rahmen sorgt für ein gutes Gleichgewicht zwischen Stärke und Gewicht.

${specs.features ? `Besondere Merkmale: ${specs.features.join(', ')}.` : ''}

${ebike.price ? `Das ${ebike.brand} ${ebike.model_name} ist ab €${ebike.price.toLocaleString()} erhältlich.` : 'Für aktuelle Preise wenden Sie sich bitte an einen Händler.'}`
  }

  private generateDutchSummary(ebike: EBike, specs: any): string {
    return `${ebike.brand} ${ebike.model_name}: ${specs.range}km bereik, ${specs.battery}Wh accu, ${specs.top_speed || 25}km/h topsnelheid. ${specs.category || 'Hoogwaardige'} e-bike voor ${specs.use_case || 'dagelijks gebruik'}.`
  }

  private generateEnglishSummary(ebike: EBike, specs: any): string {
    return `${ebike.brand} ${ebike.model_name}: ${specs.range}km range, ${specs.battery}Wh battery, ${specs.top_speed || 25}km/h top speed. ${specs.category || 'High-quality'} e-bike for ${specs.use_case || 'daily commuting'}.`
  }

  private generateGermanSummary(ebike: EBike, specs: any): string {
    return `${ebike.brand} ${ebike.model_name}: ${specs.range}km Reichweite, ${specs.battery}Wh Akku, ${specs.top_speed || 25}km/h Höchstgeschwindigkeit. ${specs.category || 'Hochwertiges'} E-Bike für ${specs.use_case || 'den täglichen Gebrauch'}.`
  }

  private generateDutchComparison(ebikes: EBike[], specs: any[]): string {
    const bikeNames = ebikes.map(ebike => `${ebike.brand} ${ebike.model_name}`).join(' vs ')
    return `Vergelijking tussen ${bikeNames}: ${this.getComparisonPoints(ebikes, specs, 'nl')}`
  }

  private generateEnglishComparison(ebikes: EBike[], specs: any[]): string {
    const bikeNames = ebikes.map(ebike => `${ebike.brand} ${ebike.model_name}`).join(' vs ')
    return `Comparison between ${bikeNames}: ${this.getComparisonPoints(ebikes, specs, 'en')}`
  }

  private generateGermanComparison(ebikes: EBike[], specs: any[]): string {
    const bikeNames = ebikes.map(ebike => `${ebike.brand} ${ebike.model_name}`).join(' vs ')
    return `Vergleich zwischen ${bikeNames}: ${this.getComparisonPoints(ebikes, specs, 'de')}`
  }

  // Helper methods
  private extractSpecifications(ebike: EBike): any {
    return {
      range: ebike.action_radius || 'Onbekend',
      battery: ebike.battery_capacity || 'Onbekend',
      top_speed: ebike.top_speed || 25,
      weight: ebike.weight_kg || 'Onbekend',
      category: ebike.category || 'Standaard',
      frame_material: ebike.frame_material || 'Aluminium',
      motor_power: ebike.motor_power_w ? `${ebike.motor_power_w}W` : '250W',
      use_case: this.determineUseCase(ebike),
      target_audience: this.determineTargetAudience(ebike),
      features: ebike.features || []
    }
  }

  private determineUseCase(ebike: EBike): string {
    if (ebike.category?.toLowerCase().includes('mountain')) return 'offroad avonturen'
    if (ebike.category?.toLowerCase().includes('commute')) return 'woon-werkverkeer'
    if (ebike.category?.toLowerCase().includes('cargo')) return 'transport'
    if (ebike.category?.toLowerCase().includes('folding')) return 'compacte opslag'
    return 'dagelijks gebruik'
  }

  private determineTargetAudience(ebike: EBike): string {
    if (ebike.gender_type === 'man') return 'mannen'
    if (ebike.gender_type === 'vrouw') return 'vrouwen'
    return 'alle fietsers'
  }

  private getRatingSummary(rating: number, language: string): string {
    if (rating >= 4.5) {
      return language === 'nl' ? 'Uitstekende beoordelingen!' : 'Excellent ratings!'
    } else if (rating >= 4.0) {
      return language === 'nl' ? 'Zeer goede beoordelingen.' : 'Very good ratings.'
    } else if (rating >= 3.5) {
      return language === 'nl' ? 'Goede beoordelingen.' : 'Good ratings.'
    } else {
      return language === 'nl' ? 'Gemengde beoordelingen.' : 'Mixed ratings.'
    }
  }

  private getComparisonPoints(ebikes: EBike[], specs: any[], language: string): string {
    const points: string[] = []
    
    // Price comparison
    const prices = ebikes.filter(e => e.price).map(e => e.price!)
    if (prices.length > 1) {
      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)
      if (language === 'nl') {
        points.push(`prijzen van €${minPrice.toLocaleString()} tot €${maxPrice.toLocaleString()}`)
      } else {
        points.push(`prices from €${minPrice.toLocaleString()} to €${maxPrice.toLocaleString()}`)
      }
    }

    // Range comparison
    const ranges = ebikes.filter(e => e.action_radius).map(e => e.action_radius!)
    if (ranges.length > 1) {
      const minRange = Math.min(...ranges)
      const maxRange = Math.max(...ranges)
      if (language === 'nl') {
        points.push(`bereik van ${minRange}km tot ${maxRange}km`)
      } else {
        points.push(`range from ${minRange}km to ${maxRange}km`)
      }
    }

    return points.join(', ')
  }

  private isCacheValid(key: string): boolean {
    // Simple cache validation
    return true
  }
}

export const aiContentGenerator = new AIContentGenerator()
