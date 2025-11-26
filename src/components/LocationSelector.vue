<template>
  <div class="location-selector">
    <div class="mb-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Selecteer uw locatie</h3>
      
      <!-- Location Type Selection -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Hoe wilt u uw locatie instellen?
        </label>
        <div class="flex space-x-4">
          <label class="flex items-center">
            <input
              v-model="locationType"
              type="radio"
              value="manual"
              class="mr-2"
            />
            Handmatig selecteren
          </label>
          <label class="flex items-center">
            <input
              v-model="locationType"
              type="radio"
              value="current"
              class="mr-2"
            />
            Huidige locatie gebruiken
          </label>
        </div>
      </div>

      <!-- Manual Location Selection -->
      <div v-if="locationType === 'manual'" class="space-y-4">
        <!-- Province Selection -->
        <div>
          <label for="province" class="block text-sm font-medium text-gray-700 mb-2">
            Provincie
          </label>
          <select
            id="province"
            v-model="selectedProvince"
            @change="onProvinceChange"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Selecteer een provincie</option>
            <option
              v-for="province in allProvinces"
              :key="province.code"
              :value="province.name"
            >
              {{ province.name }}
            </option>
          </select>
        </div>

        <!-- City Selection -->
        <div v-if="selectedProvince">
          <label for="city" class="block text-sm font-medium text-gray-700 mb-2">
            Stad
          </label>
          <select
            id="city"
            v-model="selectedCity"
            @change="onCityChange"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Selecteer een stad</option>
            <option
              v-for="city in availableCities"
              :key="city.name"
              :value="city.name"
            >
              {{ city.name }}
            </option>
          </select>
        </div>

        <!-- Postcode Input -->
        <div>
          <label for="postcode" class="block text-sm font-medium text-gray-700 mb-2">
            Postcode (optioneel)
          </label>
          <input
            id="postcode"
            v-model="postcode"
            type="text"
            placeholder="1234 AB"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <!-- Current Location -->
      <div v-if="locationType === 'current'" class="space-y-4">
        <div v-if="!userLocation" class="text-center py-8">
          <button
            @click="requestLocation"
            :disabled="locationLoading"
            class="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ locationLoading ? 'Locatie ophalen...' : 'Huidige locatie gebruiken' }}
          </button>
          <p class="text-sm text-gray-500 mt-2">
            We gebruiken uw locatie om de dichtstbijzijnde dealers te vinden
          </p>
        </div>
        
        <div v-else class="bg-green-50 border border-green-200 rounded-lg p-4">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span class="text-green-800 font-medium">Locatie gedetecteerd</span>
          </div>
          <p class="text-sm text-green-700 mt-1">
            We hebben {{ nearestDealers.length }} dealer(s) in uw omgeving gevonden
          </p>
        </div>
      </div>

      <!-- Search Filter -->
      <div class="mt-4">
        <label for="search" class="block text-sm font-medium text-gray-700 mb-2">
          Zoek dealers (optioneel)
        </label>
        <input
          id="search"
          v-model="searchQuery"
          type="text"
          placeholder="Zoek op naam, stad of merk..."
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>
    </div>

    <!-- Available Dealers -->
    <div v-if="filteredDealers.length > 0" class="mt-6">
      <h4 class="text-md font-semibold text-gray-900 mb-4">
        Beschikbare dealers ({{ filteredDealers.length }})
      </h4>
      
      <div class="space-y-4 max-h-96 overflow-y-auto">
        <div
          v-for="dealer in filteredDealers"
          :key="dealer.id"
          class="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors cursor-pointer"
          :class="{ 'border-primary-500 bg-primary-50': selectedDealer?.id === dealer.id }"
          @click="selectDealer(dealer)"
        >
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <h5 class="font-medium text-gray-900">{{ dealer.name }}</h5>
              <p class="text-sm text-gray-600">{{ dealer.address }}</p>
              <p class="text-sm text-gray-500">{{ dealer.city }}, {{ dealer.province }}</p>
              
              <div class="mt-2 flex items-center space-x-4">
                <div class="flex items-center">
                  <svg class="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span class="text-sm text-gray-600">{{ dealer.rating }} ({{ dealer.reviewCount }} reviews)</span>
                </div>
                
                <div v-if="dealer.distance" class="text-sm text-gray-500">
                  {{ dealer.distance.toFixed(1) }} km
                </div>
              </div>
              
              <div class="mt-2">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="brand in dealer.brands.slice(0, 3)"
                    :key="brand"
                    class="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                  >
                    {{ brand }}
                  </span>
                  <span v-if="dealer.brands.length > 3" class="text-xs text-gray-500">
                    +{{ dealer.brands.length - 3 }} meer
                  </span>
                </div>
              </div>
            </div>
            
            <div class="ml-4">
              <input
                type="radio"
                :checked="selectedDealer?.id === dealer.id"
                class="w-4 h-4 text-primary-600"
                readonly
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- No Dealers Found -->
    <div v-else-if="selectedProvince || selectedCity || searchQuery" class="mt-6 text-center py-8">
      <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      <h4 class="text-lg font-medium text-gray-900 mb-2">Geen dealers gevonden</h4>
      <p class="text-gray-500">
        Probeer een andere locatie of zoekterm te selecteren.
      </p>
    </div>

    <!-- Actions -->
    <div v-if="selectedDealer" class="mt-6 flex justify-end space-x-4">
      <button
        @click="clearSelection"
        class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
      >
        Wissen
      </button>
      <button
        @click="confirmSelection"
        class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
      >
        Bevestigen
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useLocationStore } from '../stores/location'
import { useAppointmentStore } from '../stores/appointments'
import type { Dealer } from '../data/locations'

// Props
interface Props {
  modelValue?: Dealer | null
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: Dealer | null]
  'dealer-selected': [dealer: Dealer]
}>()

// Stores
const locationStore = useLocationStore()
const appointmentStore = useAppointmentStore()

// State
const locationType = ref<'manual' | 'current'>('manual')
const selectedProvince = ref('')
const selectedCity = ref('')
const postcode = ref('')
const searchQuery = ref('')
const locationLoading = ref(false)

// Computed
const allProvinces = computed(() => locationStore.allProvinces)
const availableCities = computed(() => locationStore.allCities)
const userLocation = computed(() => locationStore.userLocation)
const nearestDealers = computed(() => locationStore.nearestDealers)
const filteredDealers = computed(() => locationStore.filteredDealers)
const selectedDealer = computed(() => appointmentStore.selectedDealer)

// Methods
function onProvinceChange() {
  selectedCity.value = ''
  locationStore.setSelectedProvince(selectedProvince.value)
}

function onCityChange() {
  locationStore.setSelectedCity(selectedCity.value)
}

async function requestLocation() {
  locationLoading.value = true
  try {
    await locationStore.requestUserLocation()
  } catch (error) {
    console.error('Error getting location:', error)
    alert('Kon uw locatie niet ophalen. Probeer handmatig een locatie te selecteren.')
  } finally {
    locationLoading.value = false
  }
}

function selectDealer(dealer: Dealer) {
  appointmentStore.setSelectedDealer(dealer)
  emit('update:modelValue', dealer)
  emit('dealer-selected', dealer)
}

function clearSelection() {
  appointmentStore.setSelectedDealer(null)
  emit('update:modelValue', null)
}

function confirmSelection() {
  if (selectedDealer.value) {
    emit('dealer-selected', selectedDealer.value)
  }
}

// Watchers
watch(searchQuery, (newQuery) => {
  locationStore.setSearchQuery(newQuery)
})

watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    appointmentStore.setSelectedDealer(newValue)
  }
})
</script>
