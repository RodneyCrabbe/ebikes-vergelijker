<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useAppointmentStore } from '../stores/appointments'
import { useLocationStore } from '../stores/location'
import { useEBikesStore } from '../stores/ebikes'
import type { CreateAppointmentData, CustomerInfo, AppointmentLocation } from '../types/appointment'
import AppointmentCalendar from '../components/AppointmentCalendar.vue'
import TimePicker from '../components/TimePicker.vue'
import LocationSelector from '../components/LocationSelector.vue'
import Header from '../components/common/Header.vue'
import Footer from '../components/common/Footer.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const appointmentStore = useAppointmentStore()
const locationStore = useLocationStore()
const ebikeStore = useEBikesStore()

// Form data
const selectedEBike = ref<any>(null)
const appointmentType = ref<'test_drive' | 'purchase_consultation' | 'repair_service'>('test_drive')
const selectedLocation = ref<AppointmentLocation | null>(null)
const selectedDealer = ref<any>(null)
const selectedDate = ref('')
const selectedTime = ref('')
const duration = ref(60)
const notes = ref('')

// Customer info
const customerInfo = ref<CustomerInfo>({
  first_name: '',
  last_name: '',
  email: '',
  phone: ''
})

// Form state
const currentStep = ref(1)
const isSubmitting = ref(false)
const showSuccess = ref(false)

// Load data
onMounted(async () => {
  // If coming from an e-bike page, pre-select that e-bike
  const ebikeId = route.query.ebike as string
  
  if (ebikeId) {
    try {
      const ebike = await ebikeStore.fetchEBikeById(ebikeId)
      if (ebike) {
        selectedEBike.value = ebike
      }
    } catch (error) {
      console.error('Error loading e-bike:', error)
    }
  }
  
  // Load locations and e-bikes
  await Promise.all([
    locationStore.fetchLocations(),
    ebikeStore.fetchEBikes()
  ])
})

// Computed properties
const isFormValid = computed(() => {
  switch (currentStep.value) {
    case 1:
      return selectedEBike.value && appointmentType.value && selectedLocation.value
    case 2:
      return selectedDate.value && selectedTime.value
    case 3:
      return customerInfo.value.first_name && 
             customerInfo.value.last_name && 
             customerInfo.value.email && 
             customerInfo.value.phone
    case 4:
      return true
    default:
      return false
  }
})

const availableTimes = computed(() => {
  if (!selectedDate.value) return []
  
  const times = []
  const startHour = 9
  const endHour = 17
  
  for (let hour = startHour; hour < endHour; hour++) {
    times.push(`${hour.toString().padStart(2, '0')}:00`)
    times.push(`${hour.toString().padStart(2, '0')}:30`)
  }
  
  return times
})

// Methods
const nextStep = () => {
  if (currentStep.value < 4 && isFormValid.value) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const submitAppointment = async () => {
  if (!isFormValid.value) return
  
  isSubmitting.value = true
  
  try {
    const appointmentData: CreateAppointmentData = {
      ebike_id: selectedEBike.value?.id,
      appointment_type: appointmentType.value,
      location_id: selectedLocation.value?.id,
      dealer_id: selectedDealer.value?.id,
      appointment_date: selectedDate.value,
      appointment_time: selectedTime.value,
      duration: duration.value,
      notes: notes.value,
      customer_info: customerInfo.value
    }
    
    await appointmentStore.createAppointment(appointmentData)
    
    // Show success message
    showSuccess.value = true
    
    // Redirect to homepage after 3 seconds
    setTimeout(() => {
      router.push('/')
    }, 3000)
    
  } catch (error) {
    console.error('Error creating appointment:', error)
    alert('Er is een fout opgetreden bij het maken van de afspraak. Probeer het opnieuw.')
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  currentStep.value = 1
  selectedEBike.value = null
  appointmentType.value = 'test_drive'
  selectedLocation.value = null
  selectedDealer.value = null
  selectedDate.value = ''
  selectedTime.value = ''
  duration.value = 60
  notes.value = ''
  customerInfo.value = {
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  }
  isSubmitting.value = false
  showSuccess.value = false
}
</script>

<template>
  <div class="min-h-screen bg-white flex flex-col">
    <Header />
    
    <main class="container mx-auto px-4 py-12 pt-24 flex-1">
      <!-- Success Message -->
      <div v-if="showSuccess" class="max-w-2xl mx-auto text-center mb-8">
        <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
          <h2 class="text-2xl font-bold mb-2">✅ Afspraak Bevestigd!</h2>
          <p class="mb-4">Je afspraak is succesvol ingepland. Je ontvangt een bevestigingsmail.</p>
          <p class="text-sm">Je wordt automatisch doorgestuurd naar de homepage...</p>
        </div>
      </div>

      <!-- Main Form -->
      <div v-else class="max-w-7xl mx-auto">
        <div class="text-center mb-12">
          <h1 class="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Maak een Afspraak
          </h1>
          <p class="text-gray-600 text-xl">Volg de eenvoudige stappen om jouw afspraak in te plannen</p>
          <div class="mt-6 inline-flex items-center bg-blue-50 border border-blue-200 rounded-lg px-6 py-3">
            <svg class="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="text-blue-800 font-medium">Gemiddelde tijd: 3-5 minuten</span>
          </div>
        </div>

        <!-- Progress Indicator -->
        <div class="mb-12">
          <div class="flex items-center justify-center space-x-4">
            <div v-for="step in 4" :key="step" class="flex items-center">
              <div 
                :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold',
                  currentStep >= step 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                ]"
              >
                {{ step }}
              </div>
              <div 
                v-if="step < 4"
                :class="[
                  'w-16 h-1 mx-2',
                  currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                ]"
              ></div>
            </div>
          </div>
          <div class="mt-4 text-center">
            <p class="text-sm text-gray-600">
              Stap {{ currentStep }} van 4: 
              <span v-if="currentStep === 1">E-bike en locatie selecteren</span>
              <span v-else-if="currentStep === 2">Datum en tijd kiezen</span>
              <span v-else-if="currentStep === 3">Persoonlijke gegevens</span>
              <span v-else-if="currentStep === 4">Bevestigen</span>
            </p>
          </div>
        </div>

        <!-- Step 1: E-bike and Location Selection -->
        <div v-if="currentStep === 1" class="bg-white rounded-2xl shadow-lg p-8">
          <h2 class="text-2xl font-bold mb-6 text-gray-900">Selecteer je E-bike en Locatie</h2>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- E-bike Selection -->
            <div>
              <h3 class="text-lg font-semibold mb-4 text-gray-800">E-bike</h3>
              <div class="space-y-4">
                <div v-if="selectedEBike" class="border-2 border-blue-500 rounded-lg p-4 bg-blue-50">
                  <div class="flex items-center space-x-4">
                    <div class="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span class="text-gray-500 text-sm">Afbeelding</span>
                    </div>
                    <div>
                      <h4 class="font-semibold text-gray-900">{{ selectedEBike.brand }} {{ selectedEBike.model_name }}</h4>
                      <p class="text-sm text-gray-600">{{ selectedEBike.price ? `€${selectedEBike.price.toLocaleString()}` : 'Prijs op aanvraag' }}</p>
                    </div>
                  </div>
                </div>
                <div v-else class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <p class="text-gray-500 mb-4">Geen e-bike geselecteerd</p>
                  <button 
                    @click="router.push('/e-bikes')"
                    class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    E-bikes bekijken
                  </button>
                </div>
              </div>
            </div>

            <!-- Location Selection -->
            <div>
              <h3 class="text-lg font-semibold mb-4 text-gray-800">Locatie</h3>
              <LocationSelector 
                v-model="selectedLocation"
                :locations="locationStore.locations"
                @update:dealer="selectedDealer = $event"
              />
            </div>
          </div>

          <!-- Appointment Type -->
          <div class="mt-8">
            <h3 class="text-lg font-semibold mb-4 text-gray-800">Type afspraak</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label 
                v-for="type in [
                  { value: 'test_drive', label: 'Proefrit', description: 'Test de e-bike uit' },
                  { value: 'purchase_consultation', label: 'Aankoopadvies', description: 'Persoonlijk advies' },
                  { value: 'repair_service', label: 'Onderhoud', description: 'Service en reparatie' }
                ]" 
                :key="type.value"
                class="relative"
              >
                <input 
                  type="radio" 
                  :value="type.value"
                  v-model="appointmentType"
                  class="sr-only"
                />
                <div 
                  :class="[
                    'border-2 rounded-lg p-4 cursor-pointer transition-all',
                    appointmentType === type.value 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  ]"
                >
                  <h4 class="font-semibold text-gray-900">{{ type.label }}</h4>
                  <p class="text-sm text-gray-600">{{ type.description }}</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- Step 2: Date and Time Selection -->
        <div v-if="currentStep === 2" class="bg-white rounded-2xl shadow-lg p-8">
          <h2 class="text-2xl font-bold mb-6 text-gray-900">Kies Datum en Tijd</h2>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Date Selection -->
            <div>
              <h3 class="text-lg font-semibold mb-4 text-gray-800">Datum</h3>
              <AppointmentCalendar v-model="selectedDate" />
            </div>

            <!-- Time Selection -->
            <div>
              <h3 class="text-lg font-semibold mb-4 text-gray-800">Tijd</h3>
              <TimePicker 
                v-model="selectedTime"
                :available-times="availableTimes"
                :selected-date="selectedDate"
              />
            </div>
          </div>

          <!-- Duration -->
          <div class="mt-8">
            <h3 class="text-lg font-semibold mb-4 text-gray-800">Duur</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label 
                v-for="dur in [30, 60, 90]" 
                :key="dur"
                class="relative"
              >
                <input 
                  type="radio" 
                  :value="dur"
                  v-model="duration"
                  class="sr-only"
                />
                <div 
                  :class="[
                    'border-2 rounded-lg p-4 cursor-pointer transition-all text-center',
                    duration === dur 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  ]"
                >
                  <span class="font-semibold text-gray-900">{{ dur }} minuten</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- Step 3: Customer Information -->
        <div v-if="currentStep === 3" class="bg-white rounded-2xl shadow-lg p-8">
          <h2 class="text-2xl font-bold mb-6 text-gray-900">Persoonlijke Gegevens</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Voornaam *</label>
              <input 
                type="text" 
                v-model="customerInfo.first_name"
                class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Je voornaam"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Achternaam *</label>
              <input 
                type="text" 
                v-model="customerInfo.last_name"
                class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Je achternaam"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">E-mailadres *</label>
              <input 
                type="email" 
                v-model="customerInfo.email"
                class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="je@email.com"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Telefoonnummer *</label>
              <input 
                type="tel" 
                v-model="customerInfo.phone"
                class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="06-12345678"
                required
              />
            </div>
          </div>

          <!-- Notes -->
          <div class="mt-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">Opmerkingen (optioneel)</label>
            <textarea 
              v-model="notes"
              rows="4"
              class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Vertel ons meer over je wensen of vragen..."
            ></textarea>
          </div>
        </div>

        <!-- Step 4: Confirmation -->
        <div v-if="currentStep === 4" class="bg-white rounded-2xl shadow-lg p-8">
          <h2 class="text-2xl font-bold mb-6 text-gray-900">Bevestig je Afspraak</h2>
          
          <div class="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 class="text-lg font-semibold mb-4 text-gray-800">Afspraak Details</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span class="font-medium text-gray-600">E-bike:</span>
                <span class="ml-2 text-gray-900">{{ selectedEBike?.brand }} {{ selectedEBike?.model_name }}</span>
              </div>
              <div>
                <span class="font-medium text-gray-600">Type:</span>
                <span class="ml-2 text-gray-900">
                  {{ appointmentType === 'test_drive' ? 'Proefrit' : 
                     appointmentType === 'purchase_consultation' ? 'Aankoopadvies' : 'Onderhoud' }}
                </span>
              </div>
              <div>
                <span class="font-medium text-gray-600">Locatie:</span>
                <span class="ml-2 text-gray-900">{{ selectedLocation?.name }}</span>
              </div>
              <div>
                <span class="font-medium text-gray-600">Datum:</span>
                <span class="ml-2 text-gray-900">{{ selectedDate }}</span>
              </div>
              <div>
                <span class="font-medium text-gray-600">Tijd:</span>
                <span class="ml-2 text-gray-900">{{ selectedTime }}</span>
              </div>
              <div>
                <span class="font-medium text-gray-600">Duur:</span>
                <span class="ml-2 text-gray-900">{{ duration }} minuten</span>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 rounded-lg p-6">
            <h3 class="text-lg font-semibold mb-4 text-gray-800">Contactgegevens</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span class="font-medium text-gray-600">Naam:</span>
                <span class="ml-2 text-gray-900">{{ customerInfo.first_name }} {{ customerInfo.last_name }}</span>
              </div>
              <div>
                <span class="font-medium text-gray-600">E-mail:</span>
                <span class="ml-2 text-gray-900">{{ customerInfo.email }}</span>
              </div>
              <div>
                <span class="font-medium text-gray-600">Telefoon:</span>
                <span class="ml-2 text-gray-900">{{ customerInfo.phone }}</span>
              </div>
            </div>
            <div v-if="notes" class="mt-4">
              <span class="font-medium text-gray-600">Opmerkingen:</span>
              <p class="mt-1 text-gray-900">{{ notes }}</p>
            </div>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="flex justify-between items-center mt-8">
          <button
            v-if="currentStep > 1"
            @click="prevStep"
            class="px-8 py-3 border-2 border-gray-400 bg-gray-100 text-gray-800 rounded-lg font-semibold hover:bg-gray-200 transition-all"
          >
            ← Terug
          </button>
          
          <div v-else></div>
          
          <button
            v-if="currentStep < 4"
            @click="nextStep"
            :disabled="!isFormValid"
            :class="['px-8 py-3 rounded-lg font-semibold transition-all', 
              isFormValid 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-400 text-gray-600 cursor-not-allowed']"
          >
            Volgende →
          </button>
          
          <button
            v-if="currentStep === 4"
            @click="submitAppointment"
            :disabled="isSubmitting"
            :class="['px-8 py-3 rounded-lg font-semibold transition-all', 
              isSubmitting 
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                : 'bg-green-600 text-white hover:bg-green-700']"
          >
            {{ isSubmitting ? 'Bezig met boeken...' : 'Afspraak Bevestigen' }}
          </button>
        </div>
      </div>
    </main>
    
    <Footer />
  </div>
</template>