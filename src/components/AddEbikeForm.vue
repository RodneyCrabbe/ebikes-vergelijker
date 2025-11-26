<script setup lang="ts">
import { ref, computed } from 'vue'
import { WordPressService } from '../services/wordpress'
import type { CreateEBikeInput, Currency, GenderType, BikeType, Color, MotorLocation } from '../types/ebike'
import { logger } from '../utils/logger'

const emit = defineEmits(['success', 'cancel'])

const loading = ref(false)
const error = ref<string | null>(null)
const success = ref(false)

const formData = ref<CreateEBikeInput>({
  brand: '',
  model_name: '',
  version: '',
  price: 0,
  currency: 'EUR',
  build_date: undefined,
  gender_type: 'unisex',
  action_radius_km: 0,
  battery_capacity: 0,
  top_speed_kmh: 25,
  image_url: '',
  affiliate_url: '',
  cpl_rate: 0,
  description: '',
  bike_type: 'stadsfiets',
  color: 'zwart',
  motor_location: 'midden',
  removable_battery: true,
  on_sale: false
})

// Options
const currencies: Currency[] = ['EUR', 'USD', 'GBP', 'CHF']
const genderTypes: GenderType[] = ['man', 'vrouw', 'unisex']
const bikeTypes: BikeType[] = ['stadsfiets', 'transport', 'vouwfiets', 'mountainbike', 'trekking', 'premium', 'bakfiets', 'racefiets']
const colors: Color[] = ['zwart', 'wit', 'grijs', 'blauw', 'rood', 'groen', 'geel', 'oranje']
const motorLocations: MotorLocation[] = ['midden', 'achterwiel', 'voorwiel', 'midden-achterwiel']

const isValid = computed(() => {
    return formData.value.brand && 
           formData.value.model_name && 
           formData.value.price > 0 && 
           formData.value.affiliate_url
})

async function handleSubmit() {
    if (!isValid.value) return

    loading.value = true
    error.value = null
    success.value = false

    try {
        logger.log('Submitting new e-bike...')
        await WordPressService.createEBike(formData.value)
        success.value = true
        logger.log('E-bike created successfully')
        
        // Reset form or just emit success
        emit('success')
    } catch (e) {
        error.value = e instanceof Error ? e.message : 'Failed to create e-bike'
        logger.error('Create e-bike error:', e)
    } finally {
        loading.value = false
    }
}
</script>

<template>
  <div class="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">Nieuwe E-Bike Toevoegen</h2>

    <div v-if="error" class="bg-red-100 text-red-700 p-4 rounded mb-4">
      {{ error }}
    </div>

    <div v-if="success" class="bg-green-100 text-green-700 p-4 rounded mb-4">
      E-bike succesvol aangemaakt!
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Basic Info -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Merk *</label>
          <input 
            v-model="formData.brand" 
            type="text" 
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Model *</label>
          <input 
            v-model="formData.model_name" 
            type="text" 
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <!-- Price & Type -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Prijs *</label>
          <input 
            v-model.number="formData.price" 
            type="number" 
            min="0"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Valuta</label>
            <select v-model="formData.currency" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option v-for="opt in currencies" :key="opt" :value="opt">{{ opt }}</option>
            </select>
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Type Fiets</label>
            <select v-model="formData.bike_type" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option v-for="opt in bikeTypes" :key="opt" :value="opt">{{ opt }}</option>
            </select>
        </div>
      </div>

      <!-- Technical Specs -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Actieradius (km)</label>
            <input v-model.number="formData.action_radius_km" type="number" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Accu (Wh)</label>
            <input v-model.number="formData.battery_capacity" type="number" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Snelheid (km/u)</label>
            <input v-model.number="formData.top_speed_kmh" type="number" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
          </div>
      </div>

      <!-- External Links -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Affiliate URL *</label>
        <input 
          v-model="formData.affiliate_url" 
          type="url" 
          class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
          placeholder="https://..."
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Afbeelding URL</label>
        <input 
          v-model="formData.image_url" 
          type="url" 
          class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="https://..."
        />
      </div>

      <!-- Description -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Beschrijving</label>
        <textarea 
          v-model="formData.description" 
          rows="4" 
          class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        ></textarea>
      </div>

      <!-- Actions -->
      <div class="flex justify-end space-x-3 pt-4">
        <button 
          type="button" 
          @click="$emit('cancel')"
          class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Annuleren
        </button>
        <button 
          type="submit" 
          :disabled="loading || !isValid"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <span v-if="loading">Verwerken...</span>
          <span v-else>Toevoegen</span>
        </button>
      </div>
    </form>
  </div>
</template>


