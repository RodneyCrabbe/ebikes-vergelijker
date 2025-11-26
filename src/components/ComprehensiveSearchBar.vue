<template>
  <div class="w-full mb-6">
    <!-- Search Bar and Quick Filters Row -->
    <div class="flex items-center gap-4">
      <!-- Search Bar (Centered and Smaller) -->
      <div class="flex-1 max-w-2xl mx-auto">
        <div class="relative">
          <div class="flex items-center bg-white border-2 border-gray-200 rounded-xl shadow-sm hover:border-blue-300 focus-within:border-blue-500 transition-colors">
            <!-- Search Icon -->
            <div class="pl-3 pr-2">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            
            <!-- Search Input -->
            <input
              v-model="searchQuery"
              @input="handleSearch"
              @focus="showSuggestions = true"
              @blur="hideSuggestions"
              type="text"
              placeholder="Zoek op merk, model, type e-bike..."
              class="flex-1 px-2 py-3 text-gray-700 placeholder-gray-400 bg-transparent border-0 outline-none text-base"
            />
            
            <!-- AI Help Button -->
            <button
              @click="toggleAIModal"
              class="flex items-center gap-1 px-3 py-2 mx-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-sm"
              title="AI Hulp van Claude 4.5"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
              <span class="hidden sm:inline text-xs font-medium">AI</span>
            </button>
            
            <!-- Clear Search Button -->
            <button
              v-if="searchQuery"
              @click="clearSearch"
              class="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              title="Zoekopdracht wissen"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Quick Filters on the Right -->
      <div class="flex items-center gap-3">
        <!-- Price Filter -->
        <div class="flex items-center gap-2">
          <label class="text-sm font-medium text-gray-700 whitespace-nowrap">Prijs:</label>
          <select 
            v-model="quickFilters.price" 
            @change="handleQuickFilterChange"
            class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Alle</option>
            <option value="low">Laag → Hoog</option>
            <option value="high">Hoog → Laag</option>
          </select>
        </div>
        
        <!-- Build Year/Alphabetical Filter -->
        <div class="flex items-center gap-2">
          <label class="text-sm font-medium text-gray-700 whitespace-nowrap">Sorteer:</label>
          <select 
            v-model="quickFilters.sort" 
            @change="handleQuickFilterChange"
            class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Standaard</option>
            <option value="alphabetical">Alfabetisch</option>
            <option value="year">Bouwjaar</option>
          </select>
        </div>
        
        <!-- Top Speed Filter -->
        <div class="flex items-center gap-2">
          <label class="text-sm font-medium text-gray-700 whitespace-nowrap">Snelheid:</label>
          <select 
            v-model="quickFilters.speed" 
            @change="handleQuickFilterChange"
            class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Alle</option>
            <option value="25">25 km/h</option>
            <option value="32">32 km/h</option>
            <option value="45">45 km/h</option>
          </select>
        </div>
      </div>
    </div>
    
    <!-- Search Suggestions Dropdown -->
    <div
      v-if="showSuggestions && (suggestions.length > 0 || searchHistory.length > 0)"
      class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto"
    >
      <!-- Search History -->
      <div v-if="searchHistory.length > 0 && !searchQuery" class="p-3 border-b border-gray-100">
        <div class="flex items-center justify-between mb-2">
          <h4 class="text-sm font-medium text-gray-700">Recente zoekopdrachten</h4>
          <button
            @click="clearHistory"
            class="text-xs text-gray-400 hover:text-gray-600"
          >
            Wissen
          </button>
        </div>
        <div class="space-y-1">
          <button
            v-for="(item, index) in searchHistory.slice(0, 5)"
            :key="index"
            @click="selectSearchHistory(item)"
            class="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg flex items-center gap-2"
          >
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            {{ item }}
          </button>
        </div>
      </div>
      
      <!-- Search Suggestions -->
      <div v-if="suggestions.length > 0" class="p-3">
        <h4 class="text-sm font-medium text-gray-700 mb-2">Suggesties</h4>
        <div class="space-y-1">
          <button
            v-for="(suggestion, index) in suggestions"
            :key="index"
            @click="selectSuggestion(suggestion)"
            class="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg flex items-center gap-2"
          >
            <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <span v-html="highlightMatch(suggestion.text, searchQuery)"></span>
            <span class="text-xs text-gray-400 ml-auto">{{ suggestion.type }}</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Active Search Filters -->
    <div v-if="activeFilters.length > 0" class="mt-3 flex flex-wrap gap-2">
      <span class="text-sm text-gray-600">Actieve filters:</span>
      <span
        v-for="(filter, index) in activeFilters"
        :key="index"
        class="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
      >
        {{ filter }}
        <button
          @click="removeFilter(index)"
          class="ml-1 text-blue-600 hover:text-blue-800"
        >
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </span>
    </div>
    
    <!-- AI Help Modal -->
    <div
      v-if="showAIModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click="closeAIModal"
    >
      <div
        class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
        @click.stop
      >
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">AI Hulp van Claude 4.5</h3>
              <p class="text-sm text-gray-500">Vind de perfecte e-bike met AI-ondersteuning</p>
            </div>
          </div>
          <button
            @click="closeAIModal"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <!-- Modal Content -->
        <div class="p-6">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Vertel ons wat je zoekt in een e-bike:
              </label>
              <textarea
                v-model="aiQuery"
                placeholder="Bijvoorbeeld: 'Ik zoek een e-bike voor woon-werkverkeer van 15km, budget tot €3000, met goede accu en comfortabel zadel'"
                class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows="4"
              ></textarea>
            </div>
            
            <div class="flex flex-wrap gap-2">
              <button
                v-for="example in aiExamples"
                :key="example"
                @click="aiQuery = example"
                class="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                {{ example }}
              </button>
            </div>
          </div>
        </div>
        
        <!-- Modal Footer -->
        <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            @click="closeAIModal"
            class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Annuleren
          </button>
          <button
            @click="processAIQuery"
            :disabled="!aiQuery.trim()"
            class="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <span v-if="aiProcessing" class="flex items-center gap-2">
              <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Verwerken...
            </span>
            <span v-else>Zoek met AI</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useEBikesStore } from '../stores/ebikes'

interface Suggestion {
  text: string
  type: string
  value: string
}

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'search': [query: string, filters: any]
}>()

const ebikeStore = useEBikesStore()

// Reactive data
const searchQuery = ref(props.modelValue)
const showSuggestions = ref(false)
const showAIModal = ref(false)
const aiQuery = ref('')
const aiProcessing = ref(false)
const searchHistory = ref<string[]>([])
const activeFilters = ref<string[]>([])

// Quick filters
const quickFilters = ref({
  price: '',
  sort: '',
  speed: ''
})

// AI examples
const aiExamples = ref([
  'Woon-werkverkeer 20km, budget €2500',
  'Stadsfiets met goede accu, comfortabel',
  'Sportieve e-bike voor recreatie',
  'Opvouwbare fiets voor kleine ruimte',
  'Fatbike voor off-road avonturen'
])

// Computed suggestions based on e-bikes data
const suggestions = computed(() => {
  if (!searchQuery.value || searchQuery.value.length < 2) return []
  
  const query = searchQuery.value.toLowerCase()
  const results: Suggestion[] = []
  
  // Search in brands
  const brands = [...new Set(ebikeStore.ebikes.map(bike => bike.brand))]
  brands.forEach(brand => {
    if (brand.toLowerCase().includes(query)) {
      results.push({
        text: brand,
        type: 'Merk',
        value: brand
      })
    }
  })
  
  // Search in model names
  ebikeStore.ebikes.forEach(bike => {
    if (bike.model_name.toLowerCase().includes(query)) {
      results.push({
        text: `${bike.brand} ${bike.model_name}`,
        type: 'Model',
        value: bike.model_name
      })
    }
  })
  
  // Search in bike types/versions
  const types = [...new Set(ebikeStore.ebikes.map(bike => bike.version).filter(Boolean))]
  types.forEach(type => {
    if (type.toLowerCase().includes(query)) {
      results.push({
        text: type,
        type: 'Type',
        value: type
      })
    }
  })
  
  return results.slice(0, 8) // Limit to 8 suggestions
})

// Methods
const handleSearch = () => {
  emit('update:modelValue', searchQuery.value)
  addToHistory(searchQuery.value)
  showSuggestions.value = false
}

const handleQuickFilterChange = () => {
  emit('search', searchQuery.value, quickFilters.value)
}

const selectSuggestion = (suggestion: Suggestion) => {
  searchQuery.value = suggestion.text
  handleSearch()
}

const selectSearchHistory = (item: string) => {
  searchQuery.value = item
  handleSearch()
}

const clearSearch = () => {
  searchQuery.value = ''
  emit('update:modelValue', '')
  showSuggestions.value = false
}

const clearHistory = () => {
  searchHistory.value = []
  localStorage.removeItem('ebike-search-history')
}

const addToHistory = (query: string) => {
  if (!query.trim()) return
  
  const history = searchHistory.value.filter(item => item !== query)
  history.unshift(query)
  searchHistory.value = history.slice(0, 10) // Keep only last 10 searches
  localStorage.setItem('ebike-search-history', JSON.stringify(searchHistory.value))
}

const highlightMatch = (text: string, query: string) => {
  if (!query) return text
  const regex = new RegExp(`(${query})`, 'gi')
  return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>')
}

const hideSuggestions = () => {
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}

const toggleAIModal = () => {
  showAIModal.value = !showAIModal.value
  if (showAIModal.value) {
    aiQuery.value = ''
  }
}

const closeAIModal = () => {
  showAIModal.value = false
  aiQuery.value = ''
}

const processAIQuery = async () => {
  if (!aiQuery.value.trim()) return
  
  aiProcessing.value = true
  
  try {
    // Simulate AI processing (in real implementation, this would call Claude 4.5 API)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // For now, extract keywords and set search query
    const keywords = aiQuery.value.toLowerCase()
    let searchTerms = []
    
    // Extract brand names
    const brands = ['knaap', 'super73', 'engwe', 'fiido', 'phatfour', 'urban', 'canyon', 'cube', 'gazelle', 'giant', 'cannondale', 'orbea', 'koga', 'trek', 'riese', 'muller']
    const foundBrands = brands.filter(brand => keywords.includes(brand))
    if (foundBrands.length > 0) {
      searchTerms.push(foundBrands[0])
    }
    
    // Extract bike types
    const types = ['stads', 'fatbike', 'vouw', 'sport', 'recreatie', 'woon-werk']
    const foundTypes = types.filter(type => keywords.includes(type))
    if (foundTypes.length > 0) {
      searchTerms.push(foundTypes[0])
    }
    
    // Set search query
    searchQuery.value = searchTerms.join(' ')
    handleSearch()
    
    // Close modal
    closeAIModal()
    
  } catch (error) {
    console.error('AI query processing failed:', error)
  } finally {
    aiProcessing.value = false
  }
}

const removeFilter = (index: number) => {
  activeFilters.value.splice(index, 1)
}

// Load search history from localStorage
onMounted(() => {
  const saved = localStorage.getItem('ebike-search-history')
  if (saved) {
    try {
      searchHistory.value = JSON.parse(saved)
    } catch (error) {
      console.error('Failed to load search history:', error)
    }
  }
})

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  searchQuery.value = newValue
})
</script>

<style scoped>
/* Custom scrollbar for suggestions */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
