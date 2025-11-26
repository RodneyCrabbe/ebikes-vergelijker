export interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
  rtl: boolean
}

export interface Translation {
  key: string
  value: string
  language: string
  context?: string
}

export interface LanguageDetection {
  language: string
  confidence: number
  isReliable: boolean
}

class MultiLanguageService {
  private currentLanguage = 'nl'
  private fallbackLanguage = 'en'
  private translations = new Map<string, Map<string, string>>()
  private supportedLanguages: Language[] = [
    { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱', rtl: false },
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', rtl: false },
    { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', rtl: false },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', rtl: false },
    { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', rtl: false },
    { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', rtl: false }
  ]

  // Chatbot translations
  private chatbotTranslations = {
    nl: {
      welcome: 'Hallo! Ik ben je persoonlijke E-Bike AI-assistent powered by Claude 4.5! 🚴‍♂️ Ik kan je helpen met:',
      features: [
        '**Gedetailleerde e-bike aanbevelingen** op basis van jouw behoeften',
        '**Actuele prijsvergelijkingen** van verschillende dealers',
        '**Uitgebreide vergelijkingen** tussen modellen',
        '**Real-time webinformatie** over nieuwe modellen en reviews',
        '**Persoonlijk koopadvies** met specifieke modellenamen en prijzen',
        '**Afspraken plannen** voor testritten'
      ],
      suggestions: [
        'Beste e-bikes onder €2000',
        'E-bikes voor woon-werkverkeer',
        'Vergelijk populaire modellen',
        'Maak een afspraak voor een testrit'
      ],
      voiceEnabled: 'Spraak ingeschakeld',
      voiceDisabled: 'Spraak uitgeschakeld',
      listening: 'Luisteren...',
      speaking: 'Spreken...',
      typeMessage: 'Typ je bericht...',
      send: 'Verstuur',
      clear: 'Wissen',
      newChat: 'Nieuw gesprek',
      settings: 'Instellingen',
      language: 'Taal',
      voice: 'Spraak',
      memory: 'Geheugen',
      error: 'Er is een fout opgetreden. Probeer het opnieuw.',
      noResponse: 'Ik kon geen antwoord genereren. Probeer het opnieuw.',
      thinking: 'Ik denk na...',
      poweredBy: 'Powered by Claude 4.5'
    },
    en: {
      welcome: 'Hello! I\'m your personal E-Bike AI assistant powered by Claude 4.5! 🚴‍♂️ I can help you with:',
      features: [
        '**Detailed e-bike recommendations** based on your needs',
        '**Current price comparisons** from different dealers',
        '**Comprehensive comparisons** between models',
        '**Real-time web information** about new models and reviews',
        '**Personal buying advice** with specific model names and prices',
        '**Schedule appointments** for test rides'
      ],
      suggestions: [
        'Best e-bikes under €2000',
        'E-bikes for commuting',
        'Compare popular models',
        'Schedule a test ride'
      ],
      voiceEnabled: 'Voice enabled',
      voiceDisabled: 'Voice disabled',
      listening: 'Listening...',
      speaking: 'Speaking...',
      typeMessage: 'Type your message...',
      send: 'Send',
      clear: 'Clear',
      newChat: 'New chat',
      settings: 'Settings',
      language: 'Language',
      voice: 'Voice',
      memory: 'Memory',
      error: 'An error occurred. Please try again.',
      noResponse: 'I couldn\'t generate a response. Please try again.',
      thinking: 'Thinking...',
      poweredBy: 'Powered by Claude 4.5'
    },
    de: {
      welcome: 'Hallo! Ich bin Ihr persönlicher E-Bike KI-Assistent powered by Claude 4.5! 🚴‍♂️ Ich kann Ihnen helfen bei:',
      features: [
        '**Detaillierte E-Bike-Empfehlungen** basierend auf Ihren Bedürfnissen',
        '**Aktuelle Preisvergleiche** von verschiedenen Händlern',
        '**Umfassende Vergleiche** zwischen Modellen',
        '**Echtzeit-Webinformationen** über neue Modelle und Bewertungen',
        '**Persönliche Kaufberatung** mit spezifischen Modellnamen und Preisen',
        '**Termine planen** für Probefahrten'
      ],
      suggestions: [
        'Beste E-Bikes unter €2000',
        'E-Bikes für den Arbeitsweg',
        'Beliebte Modelle vergleichen',
        'Eine Probefahrt vereinbaren'
      ],
      voiceEnabled: 'Sprache aktiviert',
      voiceDisabled: 'Sprache deaktiviert',
      listening: 'Hören...',
      speaking: 'Sprechen...',
      typeMessage: 'Geben Sie Ihre Nachricht ein...',
      send: 'Senden',
      clear: 'Löschen',
      newChat: 'Neuer Chat',
      settings: 'Einstellungen',
      language: 'Sprache',
      voice: 'Stimme',
      memory: 'Speicher',
      error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
      noResponse: 'Ich konnte keine Antwort generieren. Bitte versuchen Sie es erneut.',
      thinking: 'Denke nach...',
      poweredBy: 'Powered by Claude 4.5'
    },
    fr: {
      welcome: 'Bonjour! Je suis votre assistant IA personnel pour vélos électriques powered by Claude 4.5! 🚴‍♂️ Je peux vous aider avec:',
      features: [
        '**Recommandations détaillées de vélos électriques** basées sur vos besoins',
        '**Comparaisons de prix actuelles** de différents revendeurs',
        '**Comparaisons complètes** entre modèles',
        '**Informations web en temps réel** sur les nouveaux modèles et avis',
        '**Conseils d\'achat personnalisés** avec noms de modèles et prix spécifiques',
        '**Planifier des rendez-vous** pour des essais'
      ],
      suggestions: [
        'Meilleurs vélos électriques sous €2000',
        'Vélos électriques pour les trajets domicile-travail',
        'Comparer les modèles populaires',
        'Planifier un essai'
      ],
      voiceEnabled: 'Voix activée',
      voiceDisabled: 'Voix désactivée',
      listening: 'Écoute...',
      speaking: 'Parle...',
      typeMessage: 'Tapez votre message...',
      send: 'Envoyer',
      clear: 'Effacer',
      newChat: 'Nouveau chat',
      settings: 'Paramètres',
      language: 'Langue',
      voice: 'Voix',
      memory: 'Mémoire',
      error: 'Une erreur s\'est produite. Veuillez réessayer.',
      noResponse: 'Je n\'ai pas pu générer de réponse. Veuillez réessayer.',
      thinking: 'Réfléchis...',
      poweredBy: 'Powered by Claude 4.5'
    },
    es: {
      welcome: '¡Hola! ¡Soy tu asistente de IA personal para bicicletas eléctricas powered by Claude 4.5! 🚴‍♂️ Puedo ayudarte con:',
      features: [
        '**Recomendaciones detalladas de bicicletas eléctricas** basadas en tus necesidades',
        '**Comparaciones de precios actuales** de diferentes distribuidores',
        '**Comparaciones completas** entre modelos',
        '**Información web en tiempo real** sobre nuevos modelos y reseñas',
        '**Consejos de compra personalizados** con nombres de modelos y precios específicos',
        '**Programar citas** para pruebas'
      ],
      suggestions: [
        'Mejores bicicletas eléctricas bajo €2000',
        'Bicicletas eléctricas para desplazamientos',
        'Comparar modelos populares',
        'Programar una prueba'
      ],
      voiceEnabled: 'Voz habilitada',
      voiceDisabled: 'Voz deshabilitada',
      listening: 'Escuchando...',
      speaking: 'Hablando...',
      typeMessage: 'Escribe tu mensaje...',
      send: 'Enviar',
      clear: 'Limpiar',
      newChat: 'Nuevo chat',
      settings: 'Configuración',
      language: 'Idioma',
      voice: 'Voz',
      memory: 'Memoria',
      error: 'Ocurrió un error. Por favor, inténtalo de nuevo.',
      noResponse: 'No pude generar una respuesta. Por favor, inténtalo de nuevo.',
      thinking: 'Pensando...',
      poweredBy: 'Powered by Claude 4.5'
    },
    it: {
      welcome: 'Ciao! Sono il tuo assistente IA personale per e-bike powered by Claude 4.5! 🚴‍♂️ Posso aiutarti con:',
      features: [
        '**Raccomandazioni dettagliate di e-bike** basate sulle tue esigenze',
        '**Confronti di prezzi attuali** da diversi rivenditori',
        '**Confronti completi** tra modelli',
        '**Informazioni web in tempo reale** su nuovi modelli e recensioni',
        '**Consigli di acquisto personalizzati** con nomi di modelli e prezzi specifici',
        '**Pianificare appuntamenti** per test drive'
      ],
      suggestions: [
        'Migliori e-bike sotto €2000',
        'E-bike per il pendolarismo',
        'Confronta modelli popolari',
        'Pianifica un test drive'
      ],
      voiceEnabled: 'Voce abilitata',
      voiceDisabled: 'Voce disabilitata',
      listening: 'Ascoltando...',
      speaking: 'Parlando...',
      typeMessage: 'Digita il tuo messaggio...',
      send: 'Invia',
      clear: 'Cancella',
      newChat: 'Nuova chat',
      settings: 'Impostazioni',
      language: 'Lingua',
      voice: 'Voce',
      memory: 'Memoria',
      error: 'Si è verificato un errore. Riprova.',
      noResponse: 'Non sono riuscito a generare una risposta. Riprova.',
      thinking: 'Pensando...',
      poweredBy: 'Powered by Claude 4.5'
    }
  }

  // Initialize the service
  initialize() {
    this.loadLanguageFromStorage()
    this.loadTranslations()
  }

  // Get current language
  getCurrentLanguage(): string {
    return this.currentLanguage
  }

  // Set current language
  setCurrentLanguage(language: string): void {
    if (this.isLanguageSupported(language)) {
      this.currentLanguage = language
      this.saveLanguageToStorage()
    }
  }

  // Get supported languages
  getSupportedLanguages(): Language[] {
    return [...this.supportedLanguages]
  }

  // Check if language is supported
  isLanguageSupported(language: string): boolean {
    return this.supportedLanguages.some(lang => lang.code === language)
  }

  // Get language info
  getLanguageInfo(language: string): Language | null {
    return this.supportedLanguages.find(lang => lang.code === language) || null
  }

  // Translate text
  translate(key: string, params?: Record<string, any>): string {
    const translations = this.translations.get(this.currentLanguage) || new Map()
    let translation = translations.get(key) || key

    // Replace parameters
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        translation = translation.replace(`{{${paramKey}}}`, String(value))
      })
    }

    return translation
  }

  // Get chatbot translation
  getChatbotTranslation(key: string): string {
    const langTranslations = this.chatbotTranslations[this.currentLanguage as keyof typeof this.chatbotTranslations]
    return langTranslations?.[key as keyof typeof langTranslations] || key
  }

  // Get chatbot features list
  getChatbotFeatures(): string[] {
    const langTranslations = this.chatbotTranslations[this.currentLanguage as keyof typeof this.chatbotTranslations]
    return langTranslations?.features || []
  }

  // Get chatbot suggestions
  getChatbotSuggestions(): string[] {
    const langTranslations = this.chatbotTranslations[this.currentLanguage as keyof typeof this.chatbotTranslations]
    return langTranslations?.suggestions || []
  }

  // Detect language from text
  detectLanguage(text: string): LanguageDetection {
    // Simple language detection based on common words
    const languagePatterns = {
      nl: /\b(de|het|een|is|zijn|hebben|kunnen|willen|gaan|komen|zien|horen|weten|denken|zeggen|doen|maken|kopen|verkopen|fiets|e-bike|elektrisch|accu|bereik|snelheid|prijs|dealer|testrit|aanbeveling|vergelijk|review|afspraak)\b/i,
      en: /\b(the|a|an|is|are|have|can|will|go|come|see|hear|know|think|say|do|make|buy|sell|bike|e-bike|electric|battery|range|speed|price|dealer|test|ride|recommendation|compare|review|appointment)\b/i,
      de: /\b(der|die|das|ein|eine|ist|sind|haben|können|wollen|gehen|kommen|sehen|hören|wissen|denken|sagen|tun|machen|kaufen|verkaufen|fahrrad|e-bike|elektrisch|akku|reichweite|geschwindigkeit|preis|händler|testfahrt|empfehlung|vergleichen|bewertung|termin)\b/i,
      fr: /\b(le|la|les|un|une|est|sont|avoir|pouvoir|vouloir|aller|venir|voir|entendre|savoir|penser|dire|faire|acheter|vendre|vélo|e-bike|électrique|batterie|autonomie|vitesse|prix|revendeur|essai|recommandation|comparer|avis|rendez-vous)\b/i,
      es: /\b(el|la|los|las|un|una|es|son|tener|poder|querer|ir|venir|ver|oír|saber|pensar|decir|hacer|comprar|vender|bicicleta|e-bike|eléctrica|batería|autonomía|velocidad|precio|distribuidor|prueba|recomendación|comparar|reseña|cita)\b/i,
      it: /\b(il|la|i|le|un|una|è|sono|avere|potere|volere|andare|venire|vedere|sentire|sapere|pensare|dire|fare|comprare|vendere|bicicletta|e-bike|elettrica|batteria|autonomia|velocità|prezzo|rivenditore|prova|raccomandazione|confrontare|recensione|appuntamento)\b/i
    }

    let bestMatch = { language: this.fallbackLanguage, confidence: 0, isReliable: false }

    Object.entries(languagePatterns).forEach(([lang, pattern]) => {
      const matches = text.match(pattern)
      if (matches) {
        const confidence = matches.length / text.split(' ').length
        if (confidence > bestMatch.confidence) {
          bestMatch = {
            language: lang,
            confidence,
            isReliable: confidence > 0.1
          }
        }
      }
    })

    return bestMatch
  }

  // Get voice language code for speech recognition
  getVoiceLanguageCode(language: string): string {
    const voiceLanguageMap: Record<string, string> = {
      nl: 'nl-NL',
      en: 'en-US',
      de: 'de-DE',
      fr: 'fr-FR',
      es: 'es-ES',
      it: 'it-IT'
    }
    return voiceLanguageMap[language] || 'en-US'
  }

  // Load language from storage
  private loadLanguageFromStorage(): void {
    const stored = localStorage.getItem('preferred-language')
    if (stored && this.isLanguageSupported(stored)) {
      this.currentLanguage = stored
    }
  }

  // Save language to storage
  private saveLanguageToStorage(): void {
    localStorage.setItem('preferred-language', this.currentLanguage)
  }

  // Load translations (placeholder - in production you'd load from API)
  private loadTranslations(): void {
    // This would typically load from an API or translation files
    // For now, we'll use the built-in chatbot translations
    this.supportedLanguages.forEach(lang => {
      this.translations.set(lang.code, new Map())
    })
  }

  // Format number according to locale
  formatNumber(number: number): string {
    return new Intl.NumberFormat(this.currentLanguage).format(number)
  }

  // Format currency according to locale
  formatCurrency(amount: number, currency: string = 'EUR'): string {
    return new Intl.NumberFormat(this.currentLanguage, {
      style: 'currency',
      currency
    }).format(amount)
  }

  // Format date according to locale
  formatDate(date: Date): string {
    return new Intl.DateTimeFormat(this.currentLanguage).format(date)
  }

  // Get text direction
  getTextDirection(language?: string): 'ltr' | 'rtl' {
    const lang = language || this.currentLanguage
    const languageInfo = this.getLanguageInfo(lang)
    return languageInfo?.rtl ? 'rtl' : 'ltr'
  }

  // Get plural form
  getPluralForm(count: number, singular: string, plural: string): string {
    return count === 1 ? singular : plural
  }
}

export const multiLanguageService = new MultiLanguageService()
