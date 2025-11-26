<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useComparisonStore } from '../stores/comparison'
import { useEBikesStore } from '../stores/ebikes'
import { useFavoritesStore } from '../stores/favorites'
import { useLocationStore } from '../stores/location'
import { useAppointmentStore } from '../stores/appointments'
import Header from '../components/common/Header.vue'
import Footer from '../components/common/Footer.vue'
import EnhancedAIChatbot from '../components/EnhancedAIChatbot.vue'
import LocationSelector from '../components/LocationSelector.vue'
import EBikeModal from '../components/EBikeModal.vue'

const authStore = useAuthStore()
const comparisonStore = useComparisonStore()
const eBikesStore = useEBikesStore()
const favoritesStore = useFavoritesStore()
const locationStore = useLocationStore()
const appointmentStore = useAppointmentStore()

// Profile data
const profile = ref({
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postal_code: '',
  province: '',
  country: 'Nederland',
  date_of_birth: '',
  preferences: {
    newsletter: false,
    marketing: false,
    notifications: true
  }
})

// UI state
const activeTab = ref('overview')
const loading = ref(false)
const saving = ref(false)
const error = ref('')
const success = ref('')

// View comparison state
const showComparisonModal = ref(false)
const selectedComparison = ref(null)
const comparisonEBikes = ref([])

// E-bike modal state
const showEBikeModal = ref(false)
const selectedEBike = ref(null)

// Reschedule modal state
const showRescheduleModal = ref(false)
const reschedulingAppointment = ref(null)
const newAppointmentDate = ref('')
const newAppointmentTime = ref('')

// Saved data
const savedComparisons = ref([])
const savedEBikes = ref([])
const appointments = ref([])
const favorites = ref([])

// Computed
const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)

// Load profile data
const loadProfile = async () => {
  if (!user.value?.id) return
  
  loading.value = true
  try {
    // Load user profile from Supabase
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.value.id)
      .maybeSingle()

    if (profileData) {
      profile.value = {
        name: profileData.name || user.value.name || '',
        email: user.value.email,
        phone: profileData.phone || '',
        address: profileData.address || '',
        city: profileData.city || user.value.city || '',
        postal_code: profileData.postal_code || user.value.postcode || '',
        province: profileData.province || user.value.province || '',
        country: profileData.country || 'Nederland',
        date_of_birth: profileData.date_of_birth || '',
        preferences: profileData.preferences || {
          newsletter: user.value.newsletter_subscribed || false,
          marketing: false,
          notifications: true
        }
      }
    } else {
      // Initialize with basic user data
      profile.value = {
        name: user.value.name || '',
        email: user.value.email,
        phone: '',
        address: '',
        city: user.value.city || '',
        postal_code: user.value.postcode || '',
        province: user.value.province || '',
        country: 'Nederland',
        date_of_birth: '',
        preferences: {
          newsletter: user.value.newsletter_subscribed || false,
          marketing: false,
          notifications: true
        }
      }
    }

    // Load saved comparisons
    await loadSavedComparisons()
    
    // Load saved e-bikes
    await loadSavedEBikes()
    
    // Load appointments
    await loadAppointments()
    
    // Load favorites
    await loadFavorites()

  } catch (err) {
    console.error('Error loading profile:', err)
    error.value = 'Er is een fout opgetreden bij het laden van je profiel'
  } finally {
    loading.value = false
  }
}

// Load saved comparisons
const loadSavedComparisons = async () => {
  if (!user.value?.id) return
  
  try {
    const { data, error } = await supabase
      .from('saved_comparisons')
      .select('*')
      .eq('user_id', user.value.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error loading saved comparisons:', error)
      return
    }
    
    savedComparisons.value = data || []
  } catch (err) {
    console.error('Error loading saved comparisons:', err)
  }
}

// Load saved e-bikes
const loadSavedEBikes = async () => {
  if (!user.value?.id) return
  
  try {
    const { data, error } = await supabase
      .from('saved_ebikes')
      .select('*, ebikes(*)')
      .eq('user_id', user.value.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error loading saved e-bikes:', error)
      return
    }
    savedEBikes.value = data || []
  } catch (err) {
    console.error('Error loading saved e-bikes:', err)
  }
}

// Load appointments with e-bike and dealer information
const loadAppointments = async () => {
  if (!user.value?.id) return
  
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        ebikes:ebike_id (
          id,
          brand,
          model_name,
          price,
          image_url
        )
      `)
      .eq('user_id', user.value.id)
      .order('date', { ascending: true })

    if (error) {
      console.error('Error loading appointments:', error)
      return
    }
    appointments.value = data || []
  } catch (err) {
    console.error('Error loading appointments:', err)
  }
}

// Load favorites using the store
const loadFavorites = async () => {
  if (!user.value?.id) return
  
  try {
    await favoritesStore.fetchFavorites()
  } catch (err) {
    console.error('Error loading favorites:', err)
  }
}

// Save profile
const saveProfile = async () => {
  if (!user.value) return
  
  saving.value = true
  error.value = ''
  success.value = ''

  try {
    const { error: upsertError } = await supabase
      .from('profiles')
      .upsert({
        id: user.value.id,
        name: profile.value.name,
        phone: profile.value.phone,
        address: profile.value.address,
        city: profile.value.city,
        postal_code: profile.value.postal_code,
        province: profile.value.province,
        country: profile.value.country,
        date_of_birth: profile.value.date_of_birth,
        preferences: profile.value.preferences,
        updated_at: new Date().toISOString()
      })

    if (upsertError) throw upsertError

    // Update user metadata
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        name: profile.value.name,
        newsletter_subscribed: profile.value.preferences.newsletter,
        postcode: profile.value.postal_code,
        city: profile.value.city,
        province: profile.value.province
      }
    })

    if (updateError) throw updateError

    success.value = 'Profiel succesvol opgeslagen!'
    setTimeout(() => success.value = '', 3000)

  } catch (err) {
    console.error('Error saving profile:', err)
    error.value = 'Er is een fout opgetreden bij het opslaan van je profiel'
  } finally {
    saving.value = false
  }
}

// Remove favorite
const removeFavorite = async (ebikeId: string) => {
  try {
    await favoritesStore.removeFromFavorites(ebikeId)
  } catch (err) {
    console.error('Error removing favorite:', err)
    error.value = 'Er is een fout opgetreden bij het verwijderen van de favoriet'
  }
}

// Show e-bike modal
const showEBikeDetails = (ebike: any) => {
  selectedEBike.value = ebike
  showEBikeModal.value = true
}

// Close e-bike modal
const closeEBikeModal = () => {
  showEBikeModal.value = false
  selectedEBike.value = null
}

// Delete saved comparison
const deleteComparison = async (id: string) => {
  try {
    const { error } = await supabase
      .from('saved_comparisons')
      .delete()
      .eq('id', id)

    if (error) throw error
    await loadSavedComparisons()
  } catch (err) {
    console.error('Error deleting comparison:', err)
  }
}

// Delete saved e-bike
const deleteSavedEBike = async (id: string) => {
  try {
    const { error } = await supabase
      .from('saved_ebikes')
      .delete()
      .eq('id', id)

    if (error) throw error
    await loadSavedEBikes()
  } catch (err) {
    console.error('Error deleting saved e-bike:', err)
  }
}

// Delete favorite
const deleteFavorite = async (id: string) => {
  try {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('id', id)

    if (error) throw error
    await loadFavorites()
  } catch (err) {
    console.error('Error deleting favorite:', err)
  }
}

// Cancel appointment
const cancelAppointment = async (id: string) => {
  try {
    const { error } = await supabase
      .from('appointments')
      .update({ status: 'cancelled' })
      .eq('id', id)

    if (error) throw error
    await loadAppointments()
  } catch (err) {
    console.error('Error cancelling appointment:', err)
  }
}

// Skip appointment (same as cancel but with different UI)
const skipAppointment = async (id: string) => {
  try {
    await appointmentStore.skipAppointment(id)
    await loadAppointments()
    success.value = 'Afspraak overgeslagen'
  } catch (err) {
    console.error('Error skipping appointment:', err)
    error.value = 'Er is een fout opgetreden bij het overslaan van de afspraak'
  }
}

// Start reschedule process
const startReschedule = (appointment: any) => {
  reschedulingAppointment.value = appointment
  newAppointmentDate.value = appointment.date
  newAppointmentTime.value = appointment.time
  showRescheduleModal.value = true
}

// Confirm reschedule
const confirmReschedule = async () => {
  if (!reschedulingAppointment.value || !newAppointmentDate.value || !newAppointmentTime.value) {
    error.value = 'Selecteer een nieuwe datum en tijd'
    return
  }

  try {
    await appointmentStore.rescheduleAppointment(
      reschedulingAppointment.value.id,
      newAppointmentDate.value,
      newAppointmentTime.value
    )
    await loadAppointments()
    showRescheduleModal.value = false
    reschedulingAppointment.value = null
    success.value = 'Afspraak verplaatst naar ' + new Date(newAppointmentDate.value).toLocaleDateString('nl-NL') + ' om ' + newAppointmentTime.value
  } catch (err) {
    console.error('Error rescheduling appointment:', err)
    error.value = 'Er is een fout opgetreden bij het verplaatsen van de afspraak'
  }
}

// Cancel reschedule
const cancelReschedule = () => {
  showRescheduleModal.value = false
  reschedulingAppointment.value = null
  newAppointmentDate.value = ''
  newAppointmentTime.value = ''
}

// Find nearest dealers
const nearestDealers = ref([])
const findNearestDealers = async () => {
  if (!profile.value.postal_code && !profile.value.city) {
    error.value = 'Voer eerst je postcode of stad in om de dichtstbijzijnde dealers te vinden'
    return
  }

  try {
    // Set location filters based on profile data
    if (profile.value.city) {
      locationStore.setSelectedCity(profile.value.city)
    }
    if (profile.value.province) {
      locationStore.setSelectedProvince(profile.value.province)
    }

    // Get filtered dealers
    const dealers = locationStore.getDealersForAppointment()
    nearestDealers.value = dealers.slice(0, 6) // Show top 6 dealers
  } catch (err) {
    console.error('Error finding dealers:', err)
    error.value = 'Er is een fout opgetreden bij het zoeken naar dealers'
  }
}

// View comparison
const viewComparison = async (comparison: any) => {
  try {
    selectedComparison.value = comparison
    comparisonEBikes.value = []
    
    
    // Load e-bike data from comparison_data
    if (comparison.comparison_data?.ebike_data && comparison.comparison_data.ebike_data.length > 0) {
      comparisonEBikes.value = comparison.comparison_data.ebike_data
    } else if (comparison.comparison_data?.ebike_ids && comparison.comparison_data.ebike_ids.length > 0) {
      // Fallback: try to load e-bikes by ID from the store
      const ebikeIds = comparison.comparison_data.ebike_ids
      
      for (const id of ebikeIds) {
        try {
          const ebike = await eBikesStore.fetchEBikeById(id)
          if (ebike) {
            comparisonEBikes.value.push(ebike)
          }
        } catch (err) {
          console.error(`Error loading e-bike ${id}:`, err)
        }
      }
    } else {
      // Last resort: try to load from the current comparison store
      // This handles cases where comparisons were saved before the new structure
      if (comparisonStore.comparisonItems.length > 0) {
        comparisonEBikes.value = [...comparisonStore.comparisonItems]
      } else {
        // If no e-bikes in current store, try to get all available e-bikes
        // This is a fallback for testing purposes
        const allEBikes = eBikesStore.getAllEBikes()
        if (allEBikes.length > 0) {
          // Take first 2 e-bikes as a sample
          comparisonEBikes.value = allEBikes.slice(0, 2)
        }
      }
    }
    
    showComparisonModal.value = true
  } catch (err) {
    console.error('Error viewing comparison:', err)
    error.value = 'Er is een fout opgetreden bij het laden van de vergelijking'
  }
}

// Close comparison modal
const closeComparisonModal = () => {
  showComparisonModal.value = false
  selectedComparison.value = null
  comparisonEBikes.value = []
}

// Handle dealer selection
const onDealerSelected = (dealer: any) => {
  // You can add additional logic here if needed
}

onMounted(async () => {
  // Wait for auth to initialize
  await authStore.initialize()
  
  if (isAuthenticated.value && user.value?.id) {
    await loadProfile()
  }
})
</script>

<template>
  <div class="min-h-screen bg-white flex flex-col">
    <Header />

    <!-- Show loading or redirect if not authenticated -->
    <div v-if="!isAuthenticated" class="flex-1 flex flex-col">
      <div class="container mx-auto px-4 py-12 pt-32 flex-1">
        <div class="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 class="text-2xl font-bold mb-4">Niet ingelogd</h1>
          <p class="text-gray-600 mb-6">Je moet ingelogd zijn om je profiel te bekijken.</p>
          <RouterLink to="/login" class="btn-primary">
            Inloggen
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- Show profile content if authenticated -->
    <div v-else class="flex-1 flex flex-col">
      <main class="container mx-auto px-4 py-8 pt-32 flex-1">
      <!-- Profile Header -->
      <div class="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <div class="flex items-center space-x-6">
          <div class="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {{ profile.name?.charAt(0)?.toUpperCase() || 'U' }}
          </div>
          <div>
            <h1 class="text-3xl font-bold text-gray-900">{{ profile.name || 'Gebruiker' }}</h1>
            <p class="text-gray-600">{{ profile.email }}</p>
            <p class="text-sm text-gray-500">Lid sinds {{ new Date(user?.created_at).toLocaleDateString('nl-NL') }}</p>
          </div>
        </div>
      </div>

      <!-- Error/Success Messages -->
      <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
        {{ error }}
      </div>
      <div v-if="success" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
        {{ success }}
      </div>

      <!-- Tabs Navigation -->
      <div class="bg-white rounded-2xl shadow-lg mb-8">
        <div class="border-b border-gray-200">
          <nav class="flex space-x-8 px-8">
            <button
              v-for="tab in [
                { id: 'overview', name: 'Overzicht', icon: '📊' },
                { id: 'profile', name: 'Profiel', icon: '👤' },
                { id: 'comparisons', name: 'Vergelijkingen', icon: '⚖️' },
                { id: 'favorites', name: 'Favorieten', icon: '❤️' },
                { id: 'appointments', name: 'Afspraken', icon: '📅' },
                { id: 'dealers', name: 'Dealers', icon: '🏪' }
              ]"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              <span class="mr-2">{{ tab.icon }}</span>
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="p-8">
          <!-- Overview Tab -->
          <div v-if="activeTab === 'overview'" class="space-y-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Overzicht</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div class="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                <div class="text-3xl mb-2">⚖️</div>
                <div class="text-2xl font-bold text-blue-600">{{ savedComparisons.length }}</div>
                <div class="text-sm text-blue-800">Opgeslagen Vergelijkingen</div>
              </div>
              
              <div class="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                <div class="text-3xl mb-2">❤️</div>
                <div class="text-2xl font-bold text-green-600">{{ favoritesStore.favoritesCount }}</div>
                <div class="text-sm text-green-800">Favoriete E-bikes</div>
              </div>
              
              <div class="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                <div class="text-3xl mb-2">📅</div>
                <div class="text-2xl font-bold text-purple-600">{{ appointments.length }}</div>
                <div class="text-sm text-purple-800">Afspraken</div>
              </div>
              
              <div class="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl">
                <div class="text-3xl mb-2">💾</div>
                <div class="text-2xl font-bold text-orange-600">{{ savedEBikes.length }}</div>
                <div class="text-sm text-orange-800">Opgeslagen E-bikes</div>
              </div>
            </div>

            <!-- Recent Activity -->
            <div class="bg-gray-50 rounded-xl p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Recente Activiteit</h3>
              <div class="space-y-3">
                <div v-if="savedComparisons.length > 0" class="flex items-center text-sm text-gray-600">
                  <span class="mr-2">⚖️</span>
                  <span>Laatste vergelijking: {{ savedComparisons[0].name }}</span>
                </div>
                <div v-if="favorites.length > 0" class="flex items-center text-sm text-gray-600">
                  <span class="mr-2">❤️</span>
                  <span>Nieuwste favoriet: {{ favorites[0].ebikes?.model_name }}</span>
                </div>
                <div v-if="appointments.length > 0" class="flex items-center text-sm text-gray-600">
                  <span class="mr-2">📅</span>
                  <span>
                    Volgende afspraak: {{ new Date(appointments[0].date).toLocaleDateString('nl-NL') }}
                    <span v-if="appointments[0].ebikes" class="font-medium">
                      - {{ appointments[0].ebikes.brand }} {{ appointments[0].ebikes.model_name }}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Profile Tab -->
          <div v-if="activeTab === 'profile'" class="space-y-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Profiel Instellingen</h2>
            
            <form @submit.prevent="saveProfile" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Naam</label>
                  <input
                    v-model="profile.name"
                    type="text"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Jouw naam"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
                  <input
                    v-model="profile.email"
                    type="email"
                    disabled
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Telefoon</label>
                  <input
                    v-model="profile.phone"
                    type="tel"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="06-12345678"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Geboortedatum</label>
                  <input
                    v-model="profile.date_of_birth"
                    type="date"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Adres</label>
                <input
                  v-model="profile.address"
                  type="text"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Straatnaam en huisnummer"
                />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Plaats</label>
                  <input
                    v-model="profile.city"
                    type="text"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Amsterdam"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Postcode</label>
                  <input
                    v-model="profile.postal_code"
                    type="text"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="1012 AB"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Provincie</label>
                  <select
                    v-model="profile.province"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Selecteer een provincie</option>
                    <option
                      v-for="province in locationStore.allProvinces"
                      :key="province.code"
                      :value="province.name"
                    >
                      {{ province.name }}
                    </option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Land</label>
                  <select
                    v-model="profile.country"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="Nederland">Nederland</option>
                    <option value="België">België</option>
                    <option value="Duitsland">Duitsland</option>
                  </select>
                </div>
              </div>

              <!-- Preferences -->
              <div class="border-t pt-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Voorkeuren</h3>
                <div class="space-y-4">
                  <label class="flex items-center">
                    <input
                      v-model="profile.preferences.newsletter"
                      type="checkbox"
                      class="mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span class="text-sm text-gray-700">Nieuwsbrief ontvangen</span>
                  </label>
                  
                  <label class="flex items-center">
                    <input
                      v-model="profile.preferences.marketing"
                      type="checkbox"
                      class="mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span class="text-sm text-gray-700">Marketing e-mails ontvangen</span>
                  </label>
                  
                  <label class="flex items-center">
                    <input
                      v-model="profile.preferences.notifications"
                      type="checkbox"
                      class="mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span class="text-sm text-gray-700">Push notificaties ontvangen</span>
                  </label>
                </div>
              </div>

              <div class="flex justify-end">
                <button
                  type="submit"
                  :disabled="saving"
                  class="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {{ saving ? 'Opslaan...' : 'Profiel Opslaan' }}
                </button>
              </div>
            </form>
          </div>

          <!-- Comparisons Tab -->
          <div v-if="activeTab === 'comparisons'" class="space-y-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Opgeslagen Vergelijkingen</h2>
            
            <div v-if="savedComparisons.length === 0" class="text-center py-12">
              <div class="text-6xl mb-4">⚖️</div>
              <h3 class="text-xl font-semibold mb-2">Geen vergelijkingen opgeslagen</h3>
              <p class="text-gray-600">Vergelijk e-bikes en sla je vergelijkingen op voor later.</p>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                v-for="comparison in savedComparisons"
                :key="comparison.id"
                class="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ comparison.name }}</h3>
                <p class="text-sm text-gray-600 mb-4">{{ comparison.comparison_data?.ebike_data?.length || comparison.comparison_data?.ebike_ids?.length || comparison.ebike_ids?.length || 0 }} e-bikes vergeleken</p>
                <p class="text-xs text-gray-500 mb-4">{{ new Date(comparison.created_at).toLocaleDateString('nl-NL') }}</p>
                <div class="flex space-x-2">
                  <button 
                    @click="viewComparison(comparison)"
                    class="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                  >
                    Bekijk
                  </button>
                  <button
                    @click="deleteComparison(comparison.id)"
                    class="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                  >
                    Verwijder
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Favorites Tab -->
          <div v-if="activeTab === 'favorites'" class="space-y-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Favoriete E-bikes</h2>
            
            <div v-if="favoritesStore.favoritesCount === 0" class="text-center py-12">
              <div class="text-6xl mb-4">❤️</div>
              <h3 class="text-xl font-semibold mb-2">Geen favorieten</h3>
              <p class="text-gray-600">Voeg e-bikes toe aan je favorieten voor snelle toegang.</p>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                v-for="favorite in favoritesStore.favorites"
                :key="favorite.id"
                class="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div class="aspect-w-16 aspect-h-9 mb-4">
                  <img
                    :src="favorite.image_url || '/placeholder-bike.jpg'"
                    :alt="favorite.model_name"
                    class="w-full h-40 object-contain rounded-lg"
                  />
                </div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ favorite.model_name }}</h3>
                <p class="text-sm text-gray-600 mb-2">{{ favorite.brand }}</p>
                <p class="text-lg font-bold text-primary-600 mb-4">€{{ favorite.price?.toLocaleString() }}</p>
                <div class="flex space-x-2">
                  <button
                    @click="showEBikeDetails(favorite)"
                    class="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors text-center"
                  >
                    Bekijk
                  </button>
                  <button
                    @click="removeFavorite(favorite.id)"
                    class="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                  >
                    Verwijder
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Appointments Tab -->
          <div v-if="activeTab === 'appointments'" class="space-y-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Mijn Afspraken</h2>
            
            <div v-if="appointments.length === 0" class="text-center py-12">
              <div class="text-6xl mb-4">📅</div>
              <h3 class="text-xl font-semibold mb-2">Geen afspraken</h3>
              <p class="text-gray-600">Maak een afspraak voor een testrit of advies.</p>
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="appointment in appointments"
                :key="appointment.id"
                class="bg-white border border-gray-200 rounded-xl p-6"
              >
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <!-- E-bike Information -->
                    <div v-if="appointment.ebikes" class="flex items-center space-x-4 mb-4">
                      <img 
                        :src="appointment.ebikes.image_url || '/api/placeholder/80/80'" 
                        :alt="appointment.ebikes.model_name"
                        class="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <h3 class="text-lg font-semibold text-gray-900">
                          {{ appointment.ebikes.brand }} {{ appointment.ebikes.model_name }}
                        </h3>
                        <p class="text-sm text-gray-600">
                          {{ appointment.type === 'test_drive' ? 'Testrit' : 
                             appointment.type === 'purchase_consultation' ? 'Aankoopadvies' : 'Reparatie' }}
                        </p>
                        <p class="text-sm font-medium text-blue-600">
                          €{{ appointment.ebikes.price?.toLocaleString() }}
                        </p>
                      </div>
                    </div>
                    
                    <!-- Appointment Details -->
                    <div class="space-y-2">
                      <p class="text-sm text-gray-500">
                        <span class="font-medium">Datum:</span> 
                        {{ new Date(appointment.date).toLocaleDateString('nl-NL') }} 
                        om {{ appointment.time }}
                      </p>
                      <p v-if="appointment.notes" class="text-sm text-gray-600">
                        <span class="font-medium">Opmerkingen:</span> {{ appointment.notes }}
                      </p>
                    </div>
                  </div>
                  
                  <div class="text-right">
                    <span :class="[
                      'px-3 py-1 rounded-full text-xs font-medium',
                      appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    ]">
                      {{ appointment.status === 'confirmed' ? 'Bevestigd' : 
                         appointment.status === 'pending' ? 'In behandeling' : 'Geannuleerd' }}
                    </span>
                    
                    <!-- Action buttons -->
                    <div v-if="appointment.status !== 'cancelled'" class="mt-3 space-y-2">
                      <button
                        @click="startReschedule(appointment)"
                        class="block w-full px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                      >
                        Verplaatsen
                      </button>
                      <button
                        @click="skipAppointment(appointment.id)"
                        class="block w-full px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                      >
                        Overslaan
                      </button>
                      <button
                        @click="cancelAppointment(appointment.id)"
                        class="block w-full px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                      >
                        Annuleren
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Dealers Tab -->
          <div v-if="activeTab === 'dealers'" class="space-y-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">E-Bike Dealers</h2>
            
            <div class="mb-6">
              <p class="text-gray-600 mb-4">
                Vind dealers in jouw omgeving of selecteer handmatig een locatie. 
                Dealers kunnen je helpen met testritten, advies en onderhoud.
              </p>
            </div>

            <LocationSelector 
              @dealer-selected="onDealerSelected"
            />

            <div v-if="nearestDealers.length > 0" class="mt-8">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">
                Beschikbare dealers ({{ nearestDealers.length }})
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div
                  v-for="dealer in nearestDealers"
                  :key="dealer.id"
                  class="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                  <h4 class="text-lg font-semibold text-gray-900 mb-2">{{ dealer.name }}</h4>
                  <p class="text-sm text-gray-600 mb-2">{{ dealer.address }}</p>
                  <p class="text-sm text-gray-500 mb-4">{{ dealer.city }}, {{ dealer.province }}</p>
                  
                  <div class="flex items-center justify-between mb-4">
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
                  
                  <div class="mb-4">
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
                  
                  <div class="flex space-x-2">
                    <a :href="`tel:${dealer.phone}`" class="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors text-center">
                      Bellen
                    </a>
                    <a :href="`mailto:${dealer.email}`" class="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
                      E-mail
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </main>
    </div>

    <!-- Footer always at bottom -->
    <Footer />
    
    <!-- Enhanced AI Chatbot -->
    <EnhancedAIChatbot />

    <!-- Comparison Modal -->
    <div
      v-if="showComparisonModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeComparisonModal"
    >
      <div class="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 class="text-2xl font-bold text-gray-900">{{ selectedComparison?.name }}</h3>
          <button
            @click="closeComparisonModal"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Modal Content -->
        <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div v-if="comparisonEBikes.length === 0" class="text-center py-12">
            <div class="text-6xl mb-4">⚖️</div>
            <h4 class="text-xl font-semibold mb-2">Geen e-bikes gevonden</h4>
            <p class="text-gray-600">De vergelijking bevat geen e-bike gegevens.</p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-200">
                  <th class="text-left p-4 font-semibold text-gray-900">E-bike</th>
                  <th class="text-left p-4 font-semibold text-gray-900">Prijs</th>
                  <th class="text-left p-4 font-semibold text-gray-900">Bereik</th>
                  <th class="text-left p-4 font-semibold text-gray-900">Batterij</th>
                  <th class="text-left p-4 font-semibold text-gray-900">Topsnelheid</th>
                  <th class="text-left p-4 font-semibold text-gray-900">Acties</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="ebike in comparisonEBikes" :key="ebike.id" class="border-b border-gray-100">
                  <td class="p-4">
                    <div class="flex items-center space-x-4">
                      <img
                        :src="ebike.image_url || '/placeholder-bike.jpg'"
                        :alt="ebike.model_name"
                        class="w-16 h-16 object-contain rounded-lg"
                      />
                      <div>
                        <h4 class="font-semibold text-gray-900">{{ ebike.brand }} {{ ebike.model_name }}</h4>
                        <p class="text-sm text-gray-600">{{ ebike.version }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="p-4">
                    <span class="text-lg font-bold text-primary-600">€{{ ebike.price?.toLocaleString() }}</span>
                  </td>
                  <td class="p-4">
                    <span class="text-gray-900">{{ ebike.action_radius_text || `~${ebike.action_radius_km} km` }}</span>
                  </td>
                  <td class="p-4">
                    <span class="text-gray-900">{{ ebike.battery_capacity }} Wh</span>
                  </td>
                  <td class="p-4">
                    <span class="text-gray-900">{{ ebike.top_speed_text || `${ebike.top_speed_kmh} km/h` }}</span>
                  </td>
                  <td class="p-4">
                    <div class="flex space-x-2">
                      <RouterLink
                        :to="`/e-bikes/${ebike.id}`"
                        class="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                      >
                        Details
                      </RouterLink>
                      <a
                        :href="ebike.affiliate_url"
                        target="_blank"
                        class="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                      >
                        Bekijk Deal
                      </a>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="flex justify-end p-6 border-t border-gray-200">
          <button
            @click="closeComparisonModal"
            class="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Sluiten
          </button>
        </div>
      </div>
    </div>

    <!-- E-bike Modal -->
    <EBikeModal
      v-model:is-open="showEBikeModal"
      :ebike="selectedEBike"
      @close="closeEBikeModal"
    />

    <!-- Reschedule Modal -->
    <div
      v-if="showRescheduleModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click="cancelReschedule"
    >
      <div
        class="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
        @click.stop
      >
        <h3 class="text-xl font-semibold text-gray-900 mb-4">Afspraak verplaatsen</h3>
        
        <div v-if="reschedulingAppointment" class="mb-4 p-4 bg-gray-50 rounded-lg">
          <p class="text-sm text-gray-600">
            <strong>Huidige afspraak:</strong><br>
            {{ reschedulingAppointment.ebikes?.brand }} {{ reschedulingAppointment.ebikes?.model_name }}<br>
            {{ new Date(reschedulingAppointment.date).toLocaleDateString('nl-NL') }} om {{ reschedulingAppointment.time }}
          </p>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nieuwe datum</label>
            <input
              v-model="newAppointmentDate"
              type="date"
              :min="new Date().toISOString().split('T')[0]"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nieuwe tijd</label>
            <select
              v-model="newAppointmentTime"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Selecteer tijd</option>
              <option value="09:00">09:00</option>
              <option value="09:30">09:30</option>
              <option value="10:00">10:00</option>
              <option value="10:30">10:30</option>
              <option value="11:00">11:00</option>
              <option value="11:30">11:30</option>
              <option value="12:00">12:00</option>
              <option value="12:30">12:30</option>
              <option value="13:00">13:00</option>
              <option value="13:30">13:30</option>
              <option value="14:00">14:00</option>
              <option value="14:30">14:30</option>
              <option value="15:00">15:00</option>
              <option value="15:30">15:30</option>
              <option value="16:00">16:00</option>
              <option value="16:30">16:30</option>
            </select>
          </div>
        </div>

        <div class="flex justify-end space-x-3 mt-6">
          <button
            @click="cancelReschedule"
            class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Annuleren
          </button>
          <button
            @click="confirmReschedule"
            :disabled="!newAppointmentDate || !newAppointmentTime"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Verplaatsen
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom styles for the profile page */
.aspect-w-16 {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
}

.aspect-h-9 {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>
