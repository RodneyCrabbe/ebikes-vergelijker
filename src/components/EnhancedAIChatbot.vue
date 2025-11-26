<template>
  <div class="enhanced-ai-chatbot">
  <!-- Chat Toggle Button -->
  <div v-if="!isOpen" class="fixed bottom-6 right-6 z-50">
    <button
      @click="openChat"
      class="bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 group relative"
        data-testid="ai-chat-button"
    >
      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
      </svg>
      <div class="absolute -top-2 -right-2 bg-accent-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
        AI
      </div>
        
        <!-- Voice indicator -->
        <div v-if="voiceStatus.isSpeaking" class="absolute -top-2 -left-2 bg-green-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
          🔊
      </div>
    </button>
  </div>

    <!-- Chat Window -->
  <div
    v-if="isOpen"
      class="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border z-50 flex flex-col overflow-hidden"
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
        </svg>
      </div>
          <div>
            <h3 class="font-semibold">{{ getChatbotTranslation('welcome').split('!')[0] }}!</h3>
            <p class="text-xs opacity-90">{{ getChatbotTranslation('poweredBy') }}</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <!-- Voice toggle -->
          <button
            @click="toggleVoice"
            :disabled="!voiceCapabilities.speechRecognition && !voiceCapabilities.speechSynthesis"
            :class="[
              'p-2 rounded-full transition-colors',
              voiceEnabled 
                ? 'bg-white/20 hover:bg-white/30' 
                : 'bg-white/10 hover:bg-white/20',
              (!voiceCapabilities.speechRecognition && !voiceCapabilities.speechSynthesis) 
                ? 'opacity-50 cursor-not-allowed' 
                : ''
            ]"
            :title="voiceEnabled ? getChatbotTranslation('voiceEnabled') : getChatbotTranslation('voiceDisabled')"
          >
            <svg v-if="voiceEnabled" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L5.5 14H2a1 1 0 01-1-1V7a1 1 0 011-1h3.5l2.883-2.793a1 1 0 011.617.793zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clip-rule="evenodd" />
            </svg>
            <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L5.5 14H2a1 1 0 01-1-1V7a1 1 0 011-1h3.5l2.883-2.793a1 1 0 011.617.793zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>

          <!-- Language selector -->
          <div class="relative">
            <button
              @click="showLanguageMenu = !showLanguageMenu"
              class="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center gap-1"
              :title="getChatbotTranslation('language')"
            >
              <span class="text-sm">{{ currentLanguageInfo?.flag }}</span>
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>

            <!-- Language menu -->
            <div
              v-if="showLanguageMenu"
              class="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-lg shadow-lg border z-10"
            >
              <div class="p-2">
                <div
                  v-for="lang in supportedLanguages"
                  :key="lang.code"
                  @click="changeLanguage(lang.code)"
                  :class="[
                    'flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors',
                    currentLanguage === lang.code 
                      ? 'bg-primary-100 text-primary-700' 
                      : 'hover:bg-gray-100'
                  ]"
                >
                  <span class="text-lg">{{ lang.flag }}</span>
                  <div>
                    <div class="font-medium">{{ lang.nativeName }}</div>
                    <div class="text-xs text-gray-500">{{ lang.name }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Settings -->
        <button
            @click="showSettings = !showSettings"
            class="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            :title="getChatbotTranslation('settings')"
        >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
            </svg>
        </button>

          <!-- Close -->
        <button
          @click="closeChat"
            class="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
        >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
        </button>
      </div>
    </div>

      <!-- Settings Panel -->
      <div v-if="showSettings" class="p-4 bg-gray-50 border-b">
        <div class="space-y-4">
          <!-- Voice Settings -->
          <div v-if="voiceCapabilities.speechSynthesis">
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ getChatbotTranslation('voice') }}</label>
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-sm">Rate</span>
                <input
                  v-model="voiceSettings.rate"
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  class="w-20"
                />
                <span class="text-xs text-gray-500">{{ voiceSettings.rate }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm">Pitch</span>
                <input
                  v-model="voiceSettings.pitch"
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  class="w-20"
                />
                <span class="text-xs text-gray-500">{{ voiceSettings.pitch }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm">Volume</span>
                <input
                  v-model="voiceSettings.volume"
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  class="w-20"
                />
                <span class="text-xs text-gray-500">{{ voiceSettings.volume }}</span>
              </div>
      </div>
    </div>

          <!-- Memory Settings -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ getChatbotTranslation('memory') }}</label>
            <div class="flex items-center gap-2">
              <input
                v-model="conversationMemory"
                type="checkbox"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span class="text-sm">Enable conversation memory</span>
            </div>
          </div>
        </div>
        </div>

      <!-- Messages -->
      <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-4">
        <!-- Welcome message -->
        <div v-if="messages.length === 0" class="text-center">
          <div class="bg-primary-50 rounded-lg p-4 mb-4">
            <h4 class="font-semibold text-primary-900 mb-2">{{ getChatbotTranslation('welcome') }}</h4>
            <div class="text-sm text-primary-700 space-y-1">
              <div v-for="feature in getChatbotFeatures()" :key="feature" v-html="feature"></div>
        </div>
      </div>
          
          <!-- Quick suggestions -->
          <div class="space-y-2">
            <p class="text-sm text-gray-600">{{ getChatbotTranslation('suggestions').length > 0 ? 'Quick suggestions:' : '' }}</p>
            <div class="flex flex-wrap gap-2">
      <button
                v-for="suggestion in getChatbotSuggestions()"
                :key="suggestion"
                @click="sendMessage(suggestion)"
                class="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
              >
                {{ suggestion }}
      </button>
            </div>
          </div>
    </div>

        <!-- Message list -->
      <div
        v-for="message in messages"
        :key="message.id"
          :class="[
            'flex',
            message.role === 'user' ? 'justify-end' : 'justify-start'
          ]"
      >
        <div
            :class="[
              'max-w-[80%] rounded-lg p-3',
              message.role === 'user'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-900'
            ]"
          >
            <div class="whitespace-pre-wrap">{{ message.content }}</div>
            <div class="text-xs opacity-70 mt-1">
              {{ formatTime(message.timestamp) }}
          </div>
        </div>
      </div>

        <!-- Typing indicator -->
      <div v-if="isTyping" class="flex justify-start">
          <div class="bg-gray-100 rounded-lg p-3">
            <div class="flex items-center gap-1">
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
        </div>
      </div>
    </div>

        <!-- Voice status -->
        <div v-if="voiceStatus.isListening" class="flex justify-center">
          <div class="bg-green-100 text-green-700 rounded-lg px-3 py-2 text-sm flex items-center gap-2">
            <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            {{ getChatbotTranslation('listening') }}
          </div>
      </div>
    </div>

      <!-- Input Area -->
      <div class="p-4 border-t bg-gray-50">
        <div class="flex items-center gap-2">
          <!-- Voice input button -->
          <button
            v-if="voiceCapabilities.speechRecognition"
            @click="toggleVoiceInput"
            :disabled="isLoading"
            :class="[
              'p-2 rounded-full transition-colors',
              voiceStatus.isListening
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300',
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            ]"
            :title="voiceStatus.isListening ? 'Stop listening' : 'Start voice input'"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clip-rule="evenodd" />
            </svg>
          </button>

          <!-- Text input -->
          <div class="flex-1 relative">
        <input
              v-model="newMessage"
              @keydown.enter="handleSendMessage"
              :placeholder="getChatbotTranslation('typeMessage')"
          :disabled="isLoading"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
        />
          </div>

          <!-- Send button -->
        <button
            @click="handleSendMessage"
            :disabled="!newMessage.trim() || isLoading"
            class="bg-primary-500 text-white p-2 rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>

        <!-- Error message -->
        <div v-if="error" class="mt-2 text-sm text-red-600">
          {{ error }}
        </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useAIStore } from '../stores/ai'
import { conversationMemoryService } from '../services/conversationMemoryService'
import { voiceService } from '../services/voiceService'
import { multiLanguageService } from '../services/multiLanguageService'
import type { ChatMessage, ChatSession } from '../services/conversationMemoryService'

const authStore = useAuthStore()
const aiStore = useAIStore()

// State
const isOpen = ref(false)
const messages = ref<ChatMessage[]>([])
const newMessage = ref('')
const isLoading = ref(false)
const isTyping = ref(false)
const error = ref<string | null>(null)
const showLanguageMenu = ref(false)
const showSettings = ref(false)
const conversationMemory = ref(true)
const currentSession = ref<ChatSession | null>(null)

// Voice state
const voiceEnabled = ref(false)
const voiceCapabilities = ref(voiceService.getCapabilities())
const voiceSettings = ref(voiceService.getCurrentVoiceSettings())
const voiceStatus = ref(voiceService.getSpeechStatus())

// Language state
const currentLanguage = ref(multiLanguageService.getCurrentLanguage())
const supportedLanguages = ref(multiLanguageService.getSupportedLanguages())
const currentLanguageInfo = computed(() => 
  multiLanguageService.getLanguageInfo(currentLanguage.value)
)

// Refs
const messagesContainer = ref<HTMLElement | null>(null)

// Computed
const isAuthenticated = computed(() => authStore.isAuthenticated)

// Methods
const openChat = async () => {
  console.log('🔓 Opening enhanced AI chat...', { 
    isAuthenticated: isAuthenticated.value,
    currentLanguage: currentLanguage.value,
    voiceEnabled: voiceEnabled.value
  })
  
  isOpen.value = true
  
  // Initialize services
  multiLanguageService.initialize()
  
  // Create new session if authenticated
  if (isAuthenticated.value && !currentSession.value) {
    try {
      currentSession.value = await conversationMemoryService.createSession(
        authStore.user!.id,
        'New Chat',
        currentLanguage.value,
        voiceEnabled.value
      )
      
      // Load previous messages
      const previousMessages = await conversationMemoryService.getSessionMessages(currentSession.value.id)
      messages.value = previousMessages
    } catch (error) {
      console.error('Error creating chat session:', error)
    }
  }
  
  // Add welcome message if no messages
  if (messages.value.length === 0) {
    addMessage('assistant', getChatbotTranslation('welcome'), {
      language: currentLanguage.value,
      voice_enabled: voiceEnabled.value
    })
  }
  
  await nextTick()
  scrollToBottom()
}

const closeChat = () => {
  isOpen.value = false
  showLanguageMenu.value = false
  showSettings.value = false
  
  // Stop voice if active
  if (voiceStatus.value.isListening) {
    voiceService.stopListening()
  }
  if (voiceStatus.value.isSpeaking) {
    voiceService.stopSpeaking()
  }
}

const sendMessage = async (messageText?: string) => {
  const message = messageText || newMessage.value.trim()
  if (!message || isLoading.value) return

  // Add user message
  addMessage('user', message, {
    language: currentLanguage.value,
    voice_enabled: voiceEnabled.value
  })

  newMessage.value = ''
  isLoading.value = true
  isTyping.value = true
  error.value = null

  try {
    // Get conversation context if memory is enabled
    let context: ChatMessage[] = []
    if (conversationMemory.value && currentSession.value) {
      context = await conversationMemoryService.getConversationContext(currentSession.value.id, 10)
    }

    // Generate AI response using the AI store
    const response = await generateAIResponse(message, context)
    
    // Add assistant message
    addMessage('assistant', response, {
      language: currentLanguage.value,
      voice_enabled: voiceEnabled.value
    })

    // Speak response if voice is enabled
    if (voiceEnabled.value && voiceCapabilities.value.speechSynthesis) {
      await voiceService.speak(response, {
        language: multiLanguageService.getVoiceLanguageCode(currentLanguage.value),
        ...voiceSettings.value
      })
    }

  } catch (err) {
    console.error('Error generating response:', err)
    error.value = getChatbotTranslation('error')
  } finally {
    isLoading.value = false
    isTyping.value = false
    await nextTick()
    scrollToBottom()
  }
}

const generateAIResponse = async (message: string, context: ChatMessage[]): Promise<string> => {
  // This would integrate with your AI service
  // For now, return a simple response
  const responses = {
    nl: [
      'Dat is een interessante vraag! Laat me je helpen met informatie over e-bikes.',
      'Ik begrijp je vraag. Hier is wat ik voor je kan vinden over e-bikes.',
      'Goede vraag! E-bikes zijn een geweldige manier van vervoer. Laat me je wat details geven.',
      'Ik kan je zeker helpen met e-bike informatie. Wat specifiek wil je weten?'
    ],
    en: [
      'That\'s an interesting question! Let me help you with e-bike information.',
      'I understand your question. Here\'s what I can find about e-bikes for you.',
      'Great question! E-bikes are a wonderful way to get around. Let me give you some details.',
      'I can definitely help you with e-bike information. What specifically would you like to know?'
    ],
    de: [
      'Das ist eine interessante Frage! Lassen Sie mich Ihnen bei E-Bike-Informationen helfen.',
      'Ich verstehe Ihre Frage. Hier ist, was ich über E-Bikes für Sie finden kann.',
      'Großartige Frage! E-Bikes sind eine wunderbare Art, sich fortzubewegen. Lassen Sie mich Ihnen einige Details geben.',
      'Ich kann Ihnen definitiv bei E-Bike-Informationen helfen. Was möchten Sie speziell wissen?'
    ]
  }

  const langResponses = responses[currentLanguage.value as keyof typeof responses] || responses.en
  return langResponses[Math.floor(Math.random() * langResponses.length)]
}

const addMessage = async (role: 'user' | 'assistant', content: string, metadata?: any) => {
  const message: Omit<ChatMessage, 'id' | 'timestamp'> = {
    user_id: authStore.user?.id || '',
    session_id: currentSession.value?.id || '',
    role,
    content,
    metadata: metadata || {}
  }

  if (currentSession.value && conversationMemory.value) {
    try {
      const savedMessage = await conversationMemoryService.addMessage(message)
      messages.value.push(savedMessage)
    } catch (error) {
      console.error('Error saving message:', error)
      // Add to local messages anyway
      messages.value.push({
        id: Date.now().toString(),
        ...message,
        timestamp: new Date().toISOString()
      })
    }
  } else {
    // Add to local messages only
    messages.value.push({
      id: Date.now().toString(),
      ...message,
      timestamp: new Date().toISOString()
    })
  }
}

const handleSendMessage = () => {
  if (newMessage.value.trim()) {
    sendMessage()
  }
}

const toggleVoice = () => {
  voiceEnabled.value = !voiceEnabled.value
  if (voiceEnabled.value) {
    voiceService.setVoiceSettings({
      language: multiLanguageService.getVoiceLanguageCode(currentLanguage.value),
      ...voiceSettings.value
    })
  }
}

const toggleVoiceInput = async () => {
  if (voiceStatus.value.isListening) {
    voiceService.stopListening()
  } else {
    try {
      await voiceService.startListening(
        (result) => {
          if (result.isFinal) {
            newMessage.value = result.transcript
            sendMessage(result.transcript)
          }
        },
        (error) => {
          console.error('Voice recognition error:', error)
        },
        () => {
          // onEnd
        }
      )
    } catch (error) {
      console.error('Error starting voice input:', error)
    }
  }
}

const changeLanguage = (language: string) => {
  currentLanguage.value = language
  multiLanguageService.setCurrentLanguage(language)
  showLanguageMenu.value = false
  
  // Update voice settings
  if (voiceEnabled.value) {
    voiceService.setVoiceSettings({
      language: multiLanguageService.getVoiceLanguageCode(language),
      ...voiceSettings.value
    })
  }
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const formatTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleTimeString('nl-NL', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Translation helpers
const getChatbotTranslation = (key: string) => {
  return multiLanguageService.getChatbotTranslation(key)
}

const getChatbotFeatures = () => {
  return multiLanguageService.getChatbotFeatures()
}

const getChatbotSuggestions = () => {
  return multiLanguageService.getChatbotSuggestions()
}

// Watch voice status
watch(voiceStatus, (newStatus) => {
  voiceStatus.value = newStatus
}, { deep: true })

// Watch voice settings
watch(voiceSettings, (newSettings) => {
  voiceService.setVoiceSettings(newSettings)
}, { deep: true })

// Lifecycle
onMounted(() => {
  multiLanguageService.initialize()
  
  // Update voice status periodically
  const statusInterval = setInterval(() => {
    voiceStatus.value = voiceService.getSpeechStatus()
  }, 1000)

  onUnmounted(() => {
    clearInterval(statusInterval)
  })
})
</script>

<style scoped>
.enhanced-ai-chatbot {
  font-family: 'Inter', system-ui, sans-serif;
}

/* Custom scrollbar */
.messages-container::-webkit-scrollbar {
  width: 4px;
}

.messages-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.messages-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
