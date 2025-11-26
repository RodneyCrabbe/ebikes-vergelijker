<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <Header />
    
    <main class="flex-1 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">
            Maak een Afspraak
          </h1>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Plan een afspraak in bij een van onze gecertificeerde dealers voor een proefrit, 
            advies of onderhoud van je e-bike.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Appointment Form -->
          <div class="bg-white rounded-lg shadow-lg p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Afspraak Aanvragen</h2>
            
            <form @submit.prevent="handleSubmitAppointment" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">
                    Voornaam *
                  </label>
                  <input
                    id="firstName"
                    v-model="form.firstName"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Voornaam"
                  />
                </div>
                
                <div>
                  <label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">
                    Achternaam *
                  </label>
                  <input
                    id="lastName"
                    v-model="form.lastName"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Achternaam"
                  />
                </div>
              </div>

              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                  E-mailadres *
                </label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="E-mailadres"
                />
              </div>

              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
                  Telefoonnummer *
                </label>
                <input
                  id="phone"
                  v-model="form.phone"
                  type="tel"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Telefoonnummer"
                />
              </div>

              <div>
                <label for="appointmentType" class="block text-sm font-medium text-gray-700 mb-2">
                  Type Afspraak *
                </label>
                <select
                  id="appointmentType"
                  v-model="form.appointmentType"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecteer type afspraak</option>
                  <option value="test-ride">Proefrit</option>
                  <option value="consultation">Adviesgesprek</option>
                  <option value="maintenance">Onderhoud</option>
                  <option value="repair">Reparatie</option>
                  <option value="other">Anders</option>
                </select>
              </div>

              <div>
                <label for="preferredDate" class="block text-sm font-medium text-gray-700 mb-2">
                  Gewenste Datum *
                </label>
                <input
                  id="preferredDate"
                  v-model="form.preferredDate"
                  type="date"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label for="preferredTime" class="block text-sm font-medium text-gray-700 mb-2">
                  Gewenste Tijd *
                </label>
                <select
                  id="preferredTime"
                  v-model="form.preferredTime"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecteer tijd</option>
                  <option value="09:00">09:00</option>
                  <option value="10:00">10:00</option>
                  <option value="11:00">11:00</option>
                  <option value="12:00">12:00</option>
                  <option value="13:00">13:00</option>
                  <option value="14:00">14:00</option>
                  <option value="15:00">15:00</option>
                  <option value="16:00">16:00</option>
                  <option value="17:00">17:00</option>
                </select>
              </div>

              <div>
                <label for="message" class="block text-sm font-medium text-gray-700 mb-2">
                  Bericht (optioneel)
                </label>
                <textarea
                  id="message"
                  v-model="form.message"
                  rows="4"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Vertel ons meer over je wensen..."
                ></textarea>
              </div>

              <button
                type="submit"
                :disabled="loading"
                class="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {{ loading ? 'Afspraak aanvragen...' : 'Afspraak Aanvragen' }}
              </button>
            </form>

            <div v-if="error" class="mt-4 rounded-md bg-red-50 p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-red-800">
                    Fout bij aanvragen afspraak
                  </h3>
                  <div class="mt-2 text-sm text-red-700">
                    {{ error }}
                  </div>
                </div>
              </div>
            </div>

            <div v-if="success" class="mt-4 rounded-md bg-green-50 p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-green-800">
                    Afspraak succesvol aangevraagd!
                  </h3>
                  <div class="mt-2 text-sm text-green-700">
                    We nemen zo snel mogelijk contact met je op om de afspraak te bevestigen.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Information -->
          <div class="space-y-8">
            <div class="bg-white rounded-lg shadow-lg p-8">
              <h3 class="text-xl font-bold text-gray-900 mb-4">Contact Informatie</h3>
              <div class="space-y-4">
                <div class="flex items-center">
                  <svg class="h-5 w-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  <span class="text-gray-700">+31 20 123 4567</span>
                </div>
                <div class="flex items-center">
                  <svg class="h-5 w-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <span class="text-gray-700">info@ebikevergelijker.nl</span>
                </div>
                <div class="flex items-start">
                  <svg class="h-5 w-5 text-blue-600 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <div class="text-gray-700">
                    <div>E-Bike Vergelijker</div>
                    <div>Hoofdstraat 123</div>
                    <div>1234 AB Amsterdam</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-lg shadow-lg p-8">
              <h3 class="text-xl font-bold text-gray-900 mb-4">Openingstijden</h3>
              <div class="space-y-2 text-gray-700">
                <div class="flex justify-between">
                  <span>Maandag - Vrijdag</span>
                  <span>09:00 - 18:00</span>
                </div>
                <div class="flex justify-between">
                  <span>Zaterdag</span>
                  <span>09:00 - 17:00</span>
                </div>
                <div class="flex justify-between">
                  <span>Zondag</span>
                  <span>Gesloten</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import Header from '../components/common/Header.vue'
import Footer from '../components/common/Footer.vue'

const loading = ref(false)
const error = ref('')
const success = ref(false)

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  appointmentType: '',
  preferredDate: '',
  preferredTime: '',
  message: ''
})

const handleSubmitAppointment = async () => {
  loading.value = true
  error.value = ''
  success.value = false

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // In a real app, this would save to a database
    console.log('Appointment submitted:', form)
    
    success.value = true
    
    // Reset form
    Object.assign(form, {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      appointmentType: '',
      preferredDate: '',
      preferredTime: '',
      message: ''
    })
  } catch (err) {
    error.value = 'Er is een fout opgetreden bij het aanvragen van de afspraak. Probeer het opnieuw.'
  } finally {
    loading.value = false
  }
}
</script>
