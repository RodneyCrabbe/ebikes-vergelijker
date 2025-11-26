export interface VoiceSettings {
  language: string
  voice: string
  rate: number
  pitch: number
  volume: number
}

export interface SpeechRecognitionResult {
  transcript: string
  confidence: number
  isFinal: boolean
}

export interface VoiceCapabilities {
  speechRecognition: boolean
  speechSynthesis: boolean
  availableVoices: SpeechSynthesisVoice[]
  supportedLanguages: string[]
}

class VoiceService {
  private recognition: SpeechRecognition | null = null
  private synthesis: SpeechSynthesis | null = null
  private isListening = false
  private currentLanguage = 'nl-NL'
  private voiceSettings: VoiceSettings = {
    language: 'nl-NL',
    voice: '',
    rate: 1,
    pitch: 1,
    volume: 1
  }

  constructor() {
    this.initializeVoiceServices()
  }

  // Initialize voice services
  private initializeVoiceServices() {
    // Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      this.recognition = new SpeechRecognition()
      this.recognition.continuous = true
      this.recognition.interimResults = true
      this.recognition.lang = this.currentLanguage
    }

    // Speech Synthesis
    if ('speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis
    }
  }

  // Get voice capabilities
  getCapabilities(): VoiceCapabilities {
    return {
      speechRecognition: !!this.recognition,
      speechSynthesis: !!this.synthesis,
      availableVoices: this.synthesis?.getVoices() || [],
      supportedLanguages: this.getSupportedLanguages()
    }
  }

  // Get supported languages
  private getSupportedLanguages(): string[] {
    return [
      'nl-NL', // Dutch
      'en-US', // English
      'de-DE', // German
      'fr-FR', // French
      'es-ES', // Spanish
      'it-IT'  // Italian
    ]
  }

  // Set voice settings
  setVoiceSettings(settings: Partial<VoiceSettings>) {
    this.voiceSettings = { ...this.voiceSettings, ...settings }
    this.currentLanguage = settings.language || this.currentLanguage
    
    if (this.recognition) {
      this.recognition.lang = this.currentLanguage
    }
  }

  // Start speech recognition
  startListening(
    onResult: (result: SpeechRecognitionResult) => void,
    onError?: (error: string) => void,
    onEnd?: () => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech recognition not supported'))
        return
      }

      if (this.isListening) {
        reject(new Error('Already listening'))
        return
      }

      this.recognition.onresult = (event) => {
        const result = event.results[event.results.length - 1]
        const transcript = result[0].transcript
        const confidence = result[0].confidence

        onResult({
          transcript,
          confidence,
          isFinal: result.isFinal
        })
      }

      this.recognition.onerror = (event) => {
        const error = event.error
        this.isListening = false
        onError?.(error)
        reject(new Error(error))
      }

      this.recognition.onend = () => {
        this.isListening = false
        onEnd?.()
      }

      this.recognition.start()
      this.isListening = true
      resolve()
    })
  }

  // Stop speech recognition
  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
      this.isListening = false
    }
  }

  // Check if currently listening
  isCurrentlyListening(): boolean {
    return this.isListening
  }

  // Speak text
  speak(text: string, settings?: Partial<VoiceSettings>): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error('Speech synthesis not supported'))
        return
      }

      // Cancel any ongoing speech
      this.synthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      const voiceSettings = { ...this.voiceSettings, ...settings }

      // Set voice
      if (voiceSettings.voice) {
        const voices = this.synthesis.getVoices()
        const selectedVoice = voices.find(voice => voice.name === voiceSettings.voice)
        if (selectedVoice) {
          utterance.voice = selectedVoice
        }
      } else {
        // Auto-select voice based on language
        const voices = this.synthesis.getVoices()
        const languageVoices = voices.filter(voice => 
          voice.lang.startsWith(voiceSettings.language.split('-')[0])
        )
        if (languageVoices.length > 0) {
          utterance.voice = languageVoices[0]
        }
      }

      // Set speech parameters
      utterance.lang = voiceSettings.language
      utterance.rate = voiceSettings.rate
      utterance.pitch = voiceSettings.pitch
      utterance.volume = voiceSettings.volume

      utterance.onend = () => resolve()
      utterance.onerror = (event) => reject(new Error(event.error))

      this.synthesis.speak(utterance)
    })
  }

  // Stop speaking
  stopSpeaking(): void {
    if (this.synthesis) {
      this.synthesis.cancel()
    }
  }

  // Check if currently speaking
  isCurrentlySpeaking(): boolean {
    return this.synthesis ? this.synthesis.speaking : false
  }

  // Get available voices for a language
  getVoicesForLanguage(language: string): SpeechSynthesisVoice[] {
    if (!this.synthesis) return []
    
    const voices = this.synthesis.getVoices()
    const languageCode = language.split('-')[0]
    
    return voices.filter(voice => 
      voice.lang.startsWith(languageCode)
    )
  }

  // Get default voice for language
  getDefaultVoiceForLanguage(language: string): SpeechSynthesisVoice | null {
    const voices = this.getVoicesForLanguage(language)
    
    // Prefer local voices over remote ones
    const localVoices = voices.filter(voice => !voice.localService)
    if (localVoices.length > 0) {
      return localVoices[0]
    }
    
    return voices[0] || null
  }

  // Convert text to speech and return audio blob
  async textToSpeechBlob(text: string, settings?: Partial<VoiceSettings>): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error('Speech synthesis not supported'))
        return
      }

      // This is a simplified implementation
      // In a real implementation, you'd use Web Audio API or a service
      // to generate audio blobs
      const utterance = new SpeechSynthesisUtterance(text)
      const voiceSettings = { ...this.voiceSettings, ...settings }
      
      utterance.lang = voiceSettings.language
      utterance.rate = voiceSettings.rate
      utterance.pitch = voiceSettings.pitch
      utterance.volume = voiceSettings.volume

      // For now, we'll just speak and resolve with a placeholder
      // In production, you'd capture the audio output
      utterance.onend = () => {
        // Create a placeholder audio blob
        const audioContext = new AudioContext()
        const buffer = audioContext.createBuffer(1, 1, 44100)
        const blob = new Blob([buffer], { type: 'audio/wav' })
        resolve(blob)
      }

      utterance.onerror = (event) => reject(new Error(event.error))

      this.synthesis.speak(utterance)
    })
  }

  // Check if voice services are available
  isVoiceAvailable(): boolean {
    return !!(this.recognition || this.synthesis)
  }

  // Get current language
  getCurrentLanguage(): string {
    return this.currentLanguage
  }

  // Get current voice settings
  getCurrentVoiceSettings(): VoiceSettings {
    return { ...this.voiceSettings }
  }

  // Pause speech
  pauseSpeaking(): void {
    if (this.synthesis) {
      this.synthesis.pause()
    }
  }

  // Resume speech
  resumeSpeaking(): void {
    if (this.synthesis) {
      this.synthesis.resume()
    }
  }

  // Get speech status
  getSpeechStatus(): {
    isListening: boolean
    isSpeaking: boolean
    isPaused: boolean
  } {
    return {
      isListening: this.isListening,
      isSpeaking: this.isCurrentlySpeaking(),
      isPaused: this.synthesis ? this.synthesis.paused : false
    }
  }
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }
}

export const voiceService = new VoiceService()
