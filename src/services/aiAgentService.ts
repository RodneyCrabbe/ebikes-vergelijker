import { supabase } from '../lib/supabase'
import type { EBike } from '../types/ebike'
import type { Dealer } from '../data/locations'

export interface ChatContext {
  userProfile?: {
    name?: string
    email?: string
    location?: string
    preferences?: string[]
  }
  conversationHistory: Array<{
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
  }>
  currentIntent?: 'product_search' | 'comparison' | 'booking' | 'support' | 'general'
  selectedEBikes?: EBike[]
  selectedDealer?: Dealer
}

export interface AIResponse {
  message: string
  intent: string
  actions?: Array<{
    type: 'show_products' | 'book_appointment' | 'compare_products' | 'find_dealers' | 'contact_support'
    data?: any
  }>
  suggestions?: string[]
  confidence: number
}

// Mock interfaces for removed services
interface MCPAction {
  type: string
  parameters: any
  context: any
}

interface WebSearchResult {
  title: string
  url: string
  snippet: string
}

class AIAgentService {
  private context: ChatContext = {
    conversationHistory: []
  }

  // Initialize the AI agent with user context
  async initialize(userProfile?: any) {
    this.context.userProfile = userProfile
    this.context.conversationHistory = []
  }

  // Process user message and generate intelligent response
  async processMessage(userMessage: string): Promise<AIResponse> {
    // Add user message to conversation history
    this.context.conversationHistory.push({
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    })

    // Analyze intent and generate response
    const intent = await this.analyzeIntent(userMessage)
    const response = await this.generateResponse(userMessage, intent)
    
    // Add assistant response to conversation history
    this.context.conversationHistory.push({
      role: 'assistant',
      content: response.message,
      timestamp: new Date()
    })

    return response
  }

  // Analyze user intent using keyword matching and context
  private async analyzeIntent(message: string): Promise<string> {
    const lowerMessage = message.toLowerCase()
    
    // Intent detection patterns
    const intentPatterns = {
      product_search: [
        'zoek', 'vind', 'welke', 'beste', 'aanbeveling', 'advies',
        'e-bike', 'fiets', 'model', 'merk', 'prijs', 'budget',
        'korte afstand', 'krachtige motor', 'powerful motor', 'short distance'
      ],
      comparison: [
        'vergelijk', 'verschil', 'verschillen', 'tegenover', 'versus',
        'welke beter', 'wat is beter', 'vergelijking', 'vs', 'or',
        'lectric', 'aventon', 'trek', 'giant', 'gazelle', 'vanmoof'
      ],
      booking: [
        'afspraak', 'testrit', 'proefrit', 'bezoek', 'komen kijken',
        'reserveren', 'boeken', 'planning'
      ],
      support: [
        'hulp', 'probleem', 'vraag', 'hoe werkt', 'uitleg',
        'ondersteuning', 'service', 'garantie'
      ]
    }

    // Score each intent
    const intentScores: Record<string, number> = {}
    for (const [intent, patterns] of Object.entries(intentPatterns)) {
      intentScores[intent] = patterns.reduce((score, pattern) => {
        return score + (lowerMessage.includes(pattern) ? 1 : 0)
      }, 0)
    }

    // Return intent with highest score, default to general
    const bestIntent = Object.entries(intentScores).reduce((a, b) => 
      intentScores[a[0]] > intentScores[b[0]] ? a : b
    )[0]

    return intentScores[bestIntent] > 0 ? bestIntent : 'general'
  }

  // Generate contextual response based on intent
  private async generateResponse(message: string, intent: string): Promise<AIResponse> {
    switch (intent) {
      case 'product_search':
        return await this.handleProductSearch(message)
      case 'comparison':
        return await this.handleComparison(message)
      case 'booking':
        return await this.handleBooking(message)
      case 'support':
        return await this.handleSupport(message)
      default:
        return await this.handleGeneral(message)
    }
  }

  // Handle product search requests
  private async handleProductSearch(message: string): Promise<AIResponse> {
    // Extract search criteria from message
    const criteria = this.extractSearchCriteria(message)
    
    // Search e-bikes based on criteria
    const ebikes = await this.searchEBikes(criteria)
    
    if (ebikes.length === 0) {
      return {
        message: "Ik heb geen e-bikes gevonden die aan jouw criteria voldoen. Kun je je zoekopdracht wat aanpassen? Bijvoorbeeld: 'e-bike onder €2000' of 'e-bike met actieradius 50km+'",
        intent: 'product_search',
        suggestions: [
          'Beste e-bikes onder €2000',
          'E-bikes met actieradius 50km+',
          'Populaire e-bike merken',
          'E-bikes voor woon-werkverkeer'
        ],
        confidence: 0.8
      }
    }
    
    const recommendations = this.generateRecommendations(ebikes, criteria)
    
    return {
      message: `Ik heb ${ebikes.length} e-bikes gevonden die aan jouw criteria voldoen:\n\n${recommendations}\n\nWil je meer details over een specifiek model of deze e-bikes vergelijken?`,
      intent: 'product_search',
      actions: [
        {
          type: 'show_products',
          data: { ebikes, criteria }
        }
      ],
      suggestions: [
        'Vergelijk deze e-bikes',
        'Bekijk details van een specifiek model',
        'Maak een afspraak voor een testrit',
        'Zoek naar dealers in mijn omgeving'
      ],
      confidence: 0.95
    }
  }

  // Handle comparison requests
  private async handleComparison(message: string): Promise<AIResponse> {
    const ebikeNames = this.extractEBikeNames(message)
    
    // Check for specific e-bike comparisons mentioned in the user's message
    const specificComparisons = this.checkSpecificComparisons(message)
    if (specificComparisons) {
      return specificComparisons
    }
    
    if (ebikeNames.length < 2) {
      return {
        message: "Ik kan je helpen met het vergelijken van e-bikes! Noem 2 of meer e-bike modellen die je wilt vergelijken, bijvoorbeeld: 'Vergelijk de Trek Allant+ 7 met de Giant Explore E+'",
        intent: 'comparison',
        suggestions: [
          'Populaire e-bikes om te vergelijken',
          'Beste e-bikes in verschillende prijsklassen',
          'E-bikes voor verschillende doeleinden'
        ],
        confidence: 0.7
      }
    }

    // Fetch e-bikes for comparison
    const ebikes = await this.findEBikesByName(ebikeNames)
    
    if (ebikes.length < 2) {
      return {
        message: "Ik kon niet alle genoemde e-bikes vinden. Zorg ervoor dat je de exacte modelnamen gebruikt. Wil je dat ik je help met het vinden van de juiste namen?",
        intent: 'comparison',
        confidence: 0.6
      }
    }

    // Generate simple comparison
    const comparison = this.generateSimpleComparison(ebikes)

    return {
      message: comparison,
      intent: 'comparison',
      actions: [
        {
          type: 'compare_products',
          data: { ebikes, comparison }
        }
      ],
      suggestions: [
        'Plan testritten voor deze e-bikes',
        'Vergelijk met andere modellen',
        'Bekijk dealers die deze e-bikes verkopen',
        'Vergelijk prijzen bij verschillende dealers'
      ],
      confidence: 0.95
    }
  }

  // Handle booking requests
  private async handleBooking(message: string): Promise<AIResponse> {
    const location = this.extractLocation(message)
    const ebikeInterest = this.extractEBikeInterest(message)
    
    return {
      message: `Geweldig! Ik help je graag met het maken van een afspraak. ${location ? `Ik zie dat je geïnteresseerd bent in een locatie rond ${location}.` : ''} ${ebikeInterest ? `Je bent geïnteresseerd in ${ebikeInterest}.` : ''} Laat me de beschikbare dealers en tijdslots voor je opzoeken.`,
      intent: 'booking',
      actions: [
        {
          type: 'book_appointment',
          data: { location, ebikeInterest }
        }
      ],
      suggestions: [
        'Testrit plannen',
        'Dealers in mijn omgeving',
        'Beschikbare tijdslots',
        'Wat meenemen naar de afspraak'
      ],
      confidence: 0.9
    }
  }

  // Handle support requests
  private async handleSupport(message: string): Promise<AIResponse> {
    const supportTopics = {
      'hoe werkt': 'Onze e-bike vergelijker werkt heel eenvoudig: je kunt zoeken op prijs, actieradius, merk en andere specificaties. Vervolgens kun je e-bikes vergelijken en direct een afspraak maken voor een testrit.',
      'garantie': 'Alle e-bikes die we aanbieden komen met de volledige fabrieksgarantie. De exacte garantievoorwaarden verschillen per merk en model.',
      'onderhoud': 'E-bikes hebben regelmatig onderhoud nodig. De meeste dealers bieden onderhoudsservice aan. Ik kan je helpen een dealer te vinden die onderhoudsservice biedt.',
      'financiering': 'Veel dealers bieden financieringsmogelijkheden aan. Ik kan je helpen een dealer te vinden die financiering aanbiedt.'
    }

    const topic = Object.keys(supportTopics).find(t => message.toLowerCase().includes(t))
    const response = topic ? supportTopics[topic as keyof typeof supportTopics] : 
      'Ik help je graag verder! Kun je specifiek aangeven waar je hulp bij nodig hebt? Bijvoorbeeld: garantie, onderhoud, financiering, of hoe de vergelijker werkt?'

    return {
      message: response,
      intent: 'support',
      suggestions: [
        'Hoe werkt de e-bike vergelijker?',
        'Wat zijn de garantievoorwaarden?',
        'Waar kan ik onderhoud laten doen?',
        'Zijn er financieringsmogelijkheden?'
      ],
      confidence: 0.8
    }
  }

  // Handle general conversation
  private async handleGeneral(message: string): Promise<AIResponse> {
    const lowerMessage = message.toLowerCase()
    
    // Check if user is asking about specific e-bikes
    if (lowerMessage.includes('lectric') || lowerMessage.includes('aventon') || 
        lowerMessage.includes('trek') || lowerMessage.includes('giant') || 
        lowerMessage.includes('gazelle') || lowerMessage.includes('vanmoof')) {
      
      return {
        message: `Ik kan je helpen met informatie over ${lowerMessage.includes('lectric') ? 'Lectric' : lowerMessage.includes('aventon') ? 'Aventon' : lowerMessage.includes('trek') ? 'Trek' : lowerMessage.includes('giant') ? 'Giant' : lowerMessage.includes('gazelle') ? 'Gazelle' : 'VanMoof'} e-bikes. Wil je specifieke modellen vergelijken of meer informatie over een bepaald model?`,
        intent: 'product_search',
        suggestions: [
          'Vergelijk populaire modellen',
          'Bekijk specificaties en prijzen',
          'Zoek dealers in mijn omgeving',
          'Plan testritten'
        ],
        confidence: 0.9
      }
    }
    
    // Check if user is asking about short distances and powerful motors
    if (lowerMessage.includes('korte afstand') || lowerMessage.includes('krachtige motor') || 
        lowerMessage.includes('powerful motor') || lowerMessage.includes('short distance')) {
      
      return {
        message: "Voor korte afstanden met een krachtige motor raad ik je aan om te kijken naar foldbare e-bikes zoals de Lectric XP 3.0 of stadsfietsen met een sterke motor. Wil je dat ik specifieke modellen voor je opzoek?",
        intent: 'product_search',
        suggestions: [
          'Vergelijk Lectric XP 3.0 vs Aventon Level.2',
          'Beste e-bikes onder €1500',
          'Foldbare e-bikes vergelijken',
          'Speed-pedelecs bekijken'
        ],
        confidence: 0.95
      }
    }

    // For general questions, provide helpful response
    return {
      message: "Ik help je graag met het vinden van de perfecte e-bike! Je kunt me vragen stellen over specifieke merken, prijsklassen, actieradius, of andere specificaties. Wat zoek je precies?",
      intent: 'general',
      suggestions: [
        'Beste e-bikes onder €2000',
        'E-bikes voor woon-werkverkeer',
        'Vergelijk populaire modellen',
        'Maak een afspraak voor een testrit'
      ],
      confidence: 0.8
    }
  }

  // Extract search criteria from user message
  private extractSearchCriteria(message: string): any {
    const criteria: any = {}
    
    // Extract price range
    const priceMatch = message.match(/(?:onder|tot|maximaal|max)\s*€?(\d+)/i)
    if (priceMatch) {
      criteria.maxPrice = parseInt(priceMatch[1])
    }

    // Extract range
    const rangeMatch = message.match(/(\d+)\s*km/i)
    if (rangeMatch) {
      criteria.minRange = parseInt(rangeMatch[1])
    }

    // Extract brand
    const brandMatch = message.match(/(trek|giant|gazelle|vanmoof|sparta|batavus|koga|aventon|rad power|riese|müller|cube|cannondale|canyon|orbea)/i)
    if (brandMatch) {
      criteria.brand = brandMatch[1]
    }

    // Extract usage
    if (message.includes('woon-werk') || message.includes('forenzen')) {
      criteria.usage = 'commuting'
    } else if (message.includes('recreatief') || message.includes('vrije tijd')) {
      criteria.usage = 'recreational'
    } else if (message.includes('sport') || message.includes('mountainbike')) {
      criteria.usage = 'sport'
    }

    return criteria
  }

  // Search e-bikes based on criteria
  private async searchEBikes(criteria: any): Promise<EBike[]> {
    try {
      let query = supabase.from('ebikes').select('*')
      
      if (criteria.maxPrice) {
        query = query.lte('price', criteria.maxPrice)
      }
      
      if (criteria.minRange) {
        query = query.gte('action_radius_km', criteria.minRange)
      }
      
      if (criteria.brand) {
        query = query.ilike('brand', `%${criteria.brand}%`)
      }

      const { data, error } = await query.limit(10)
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error searching e-bikes:', error)
      return []
    }
  }

  // Generate personalized recommendations
  private generateRecommendations(ebikes: EBike[], criteria: any): string {
    return ebikes.slice(0, 3).map((ebike, index) => {
      const price = ebike.price?.toLocaleString() || 'N/A'
      const range = ebike.action_radius_km || ebike.action_radius || 'N/A'
      return `${index + 1}. **${ebike.brand} ${ebike.model_name}** - €${price} (${range}km actieradius)`
    }).join('\n')
  }

  // Check for specific e-bike comparisons and provide detailed responses
  private checkSpecificComparisons(message: string): AIResponse | null {
    const lowerMessage = message.toLowerCase()
    
    // Lectric XP 3.0 vs Aventon Level.2 comparison
    if (lowerMessage.includes('lectric xp 3.0') && lowerMessage.includes('aventon level.2')) {
      return {
        message: `**Lectric XP 3.0 vs Aventon Level.2 - Gedetailleerde Vergelijking**\n\n**Lectric XP 3.0:**\n• Prijs: €1.099\n• Actieradius: ~40-65 km\n• Motor: 500W achterwielmotor\n• Accu: 48V 9.6Ah (460Wh)\n• Gewicht: ~32 kg\n• Type: Foldbare e-bike\n• Topsnelheid: 28 mph (45 km/h)\n• Ideaal voor: Korte afstanden, compacte opslag\n\n**Aventon Level.2:**\n• Prijs: €1.299\n• Actieradius: ~40-60 km\n• Motor: 500W middenmotor\n• Accu: 48V 12.8Ah (614Wh)\n• Gewicht: ~28 kg\n• Type: Stadsfiets\n• Topsnelheid: 20 mph (32 km/h)\n• Ideaal voor: Dagelijks woon-werkverkeer\n\n**Voor korte afstanden en krachtige motor:**\nDe **Lectric XP 3.0** is beter voor jouw behoeften omdat:\n• Krachtigere motor (500W vs 500W, maar achterwielmotor geeft meer directe kracht)\n• Hogere topsnelheid (45 km/h vs 32 km/h)\n• Foldbaar design voor compacte opslag\n• Goedkoper (€1.099 vs €1.299)\n• Betere prijs-kwaliteitverhouding voor korte afstanden\n\nDe Aventon Level.2 is beter voor comfortabel dagelijks gebruik met middenmotor en betere accu.`,
        intent: 'comparison',
        actions: [
          {
            type: 'compare_products',
            data: { 
              ebikes: [
                { id: '550e8400-e29b-41d4-a716-446655440001', brand: 'Lectric', model_name: 'XP 3.0' },
                { id: '550e8400-e29b-41d4-a716-446655440002', brand: 'Aventon', model_name: 'Level.2' }
              ]
            }
          }
        ],
        suggestions: [
          'Plan testritten voor beide e-bikes',
          'Vergelijk met andere foldbare e-bikes',
          'Bekijk dealers die deze e-bikes verkopen',
          'Vergelijk prijzen bij verschillende dealers'
        ],
        confidence: 0.95
      }
    }

    // Trek Allant+ 7 vs Giant Explore E+ comparison
    if (lowerMessage.includes('trek allant') && lowerMessage.includes('giant explore')) {
      return {
        message: `**Trek Allant+ 7 vs Giant Explore E+ - Gedetailleerde Vergelijking**\n\n**Trek Allant+ 7 Gen 2:**\n• Prijs: €2.999\n• Actieradius: ~70-100 km\n• Motor: Bosch Active Line Plus (50 Nm)\n• Accu: 500Wh\n• Gewicht: ~25 kg\n• Type: Stads/trekking e-bike\n• Topsnelheid: 25 km/h\n• Ideaal voor: Dagelijks woon-werkverkeer\n\n**Giant Explore E+:**\n• Prijs: €2.799\n• Actieradius: ~50-80 km\n• Motor: SyncDrive (50 Nm)\n• Accu: 500Wh\n• Gewicht: ~27 kg\n• Type: Trekking e-bike\n• Topsnelheid: 25 km/h\n• Ideaal voor: Recreatief gebruik\n\n**Voor dagelijks gebruik:**\nDe **Trek Allant+ 7** is beter voor dagelijks gebruik omdat:\n• Betere actieradius (70-100 km vs 50-80 km)\n• Lichter gewicht (25 kg vs 27 kg)\n• Betere stadsuitrusting\n• Bosch motor is betrouwbaarder\n• Betere prijs-kwaliteitverhouding voor dagelijks gebruik`,
        intent: 'comparison',
        suggestions: [
          'Plan testritten voor beide e-bikes',
          'Vergelijk prijzen bij dealers',
          'Bekijk onderhoudskosten',
          'Vergelijk garantievoorwaarden'
        ],
        confidence: 0.95
      }
    }

    // Add more specific comparisons here as needed
    return null
  }

  // Extract e-bike names from message
  private extractEBikeNames(message: string): string[] {
    const ebikePatterns = [
      /(trek\s+allant[+\s]*\d*)/gi,
      /(giant\s+explore[+\s]*e*)/gi,
      /(gazelle\s+ultimate[+\s]*\w*)/gi,
      /(vanmoof\s+s\d+)/gi,
      /(sparta\s+e-speed[+\s]*\w*)/gi,
      /(batavus\s+diva[+\s]*\w*)/gi,
      /(koga\s+e-nova[+\s]*\w*)/gi,
      /(aventon\s+\w+[.\s]*\d*)/gi,
      /(rad\s+power[+\s]*\w*)/gi,
      /(riese[+\s]*&[+\s]*müller[+\s]*\w*)/gi,
      /(cube\s+\w+[+\s]*\d*)/gi,
      /(cannondale\s+\w+[+\s]*\w*)/gi,
      /(canyon\s+\w+[+\s]*\w*)/gi,
      /(orbea\s+\w+[+\s]*\w*)/gi,
      /(lectric\s+xp[+\s]*\d*)/gi
    ]

    const names: string[] = []
    ebikePatterns.forEach(pattern => {
      const matches = message.match(pattern)
      if (matches) {
        names.push(...matches.map(match => match.trim()))
      }
    })

    return names
  }

  // Find e-bikes by name
  private async findEBikesByName(names: string[]): Promise<EBike[]> {
    try {
      const ebikes: EBike[] = []
      
      for (const name of names) {
        const { data, error } = await supabase
          .from('ebikes')
          .select('*')
          .or(`brand.ilike.%${name}%,model_name.ilike.%${name}%`)
          .limit(1)
        
        if (!error && data && data.length > 0) {
          ebikes.push(data[0])
        }
      }
      
      return ebikes
    } catch (error) {
      console.error('Error finding e-bikes by name:', error)
      return []
    }
  }

  // Extract location from message
  private extractLocation(message: string): string | null {
    const locationPatterns = [
      /(?:in|rond|bij|omgeving)\s+([a-zA-Z\s]+)/i,
      /([a-zA-Z\s]+)\s+(?:omgeving|gebied)/i
    ]

    for (const pattern of locationPatterns) {
      const match = message.match(pattern)
      if (match) {
        return match[1].trim()
      }
    }

    return null
  }

  // Extract e-bike interest from message
  private extractEBikeInterest(message: string): string | null {
    const interestPatterns = [
      /(?:geïnteresseerd|interesse)\s+(?:in|voor)\s+([^.!?]+)/i,
      /(?:kijken naar|bekijken)\s+([^.!?]+)/i
    ]

    for (const pattern of interestPatterns) {
      const match = message.match(pattern)
      if (match) {
        return match[1].trim()
      }
    }

    return null
  }

  // Get conversation context
  getContext(): ChatContext {
    return this.context
  }

  // Clear conversation history
  clearHistory() {
    this.context.conversationHistory = []
  }

}

export const aiAgentService = new AIAgentService()
