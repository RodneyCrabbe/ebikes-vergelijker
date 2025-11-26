<template>
  <div class="min-h-screen bg-gray-50">
    <Header />
    
    <!-- Loading State -->
    <div v-if="isLoading" class="container mx-auto px-4 py-8">
      <div class="flex items-center justify-center min-h-96">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p class="text-gray-600">Loading profile...</p>
        </div>
      </div>
    </div>
    
    <!-- Main Content -->
    <div v-else class="container mx-auto px-4 py-12 mt-8">
      <!-- Profile Header -->
      <div class="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div class="flex items-center gap-6">
          <!-- Avatar -->
          <div class="relative">
            <img
              :src="user?.avatar_url || '/default-avatar.png'"
              :alt="user?.name"
              class="w-20 h-20 rounded-full object-cover"
            />
            <button
              @click="showAvatarModal = true"
              class="absolute -bottom-1 -right-1 bg-primary-500 text-white rounded-full p-1 hover:bg-primary-600"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
          
          <!-- User Info -->
          <div class="flex-1">
            <h1 class="text-2xl font-bold text-gray-900">{{ user?.name || 'User' }}</h1>
            <p class="text-gray-600">{{ user?.email }}</p>
            <div class="flex items-center gap-4 mt-2">
              <div class="flex items-center gap-1">
                <svg class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span class="text-sm font-medium">{{ totalPoints }} points</span>
              </div>
              <div class="flex items-center gap-1">
                <svg class="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                </svg>
                <span class="text-sm">{{ user?.experience_level || 'beginner' }}</span>
              </div>
              <div class="flex items-center gap-1">
                <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-sm">{{ achievements.length }} achievements</span>
              </div>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex gap-2">
            <button
              @click="openEditProfileModal"
              class="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
            >
              Profiel Bewerken
            </button>
            <button
              @click="openPreferencesModal"
              class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Voorkeuren
            </button>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="bg-white rounded-lg shadow-sm border mb-6">
        <nav class="flex border-b">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'px-6 py-4 text-sm font-medium border-b-2 transition-colors',
              activeTab === tab.id
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            {{ tab.label }}
            <span v-if="tab.count !== undefined" class="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
              {{ tab.count }}
            </span>
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="space-y-6">
        <!-- Overview Tab -->
        <div v-if="activeTab === 'overview'" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Recent Activity -->
          <div class="lg:col-span-2">
            <div class="bg-white rounded-lg shadow-sm border p-6">
              <h3 class="text-lg font-semibold mb-4">Recente Activiteit</h3>
              <div v-if="recentActivities.length === 0" class="text-center py-8 text-gray-500">
                <p>Geen recente activiteit</p>
                <p class="text-sm">Begin met het verkennen van e-bikes om je activiteit hier te zien!</p>
              </div>
              <div v-else class="space-y-4">
                <div
                  v-for="activity in recentActivities"
                  :key="activity.id"
                  class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div :class="getActivityIconClass(activity.activity_type)">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path :d="getActivityIcon(activity.activity_type)" />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900">{{ getActivityDescription(activity) }}</p>
                    <p class="text-xs text-gray-500">{{ formatDate(activity.created_at) }}</p>
                  </div>
                  <div class="text-sm font-medium text-primary-600">
                    +{{ activity.points_earned }} pts
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Achievements & Stats -->
          <div class="space-y-6">
            <!-- Achievements -->
            <div class="bg-white rounded-lg shadow-sm border p-6">
              <h3 class="text-lg font-semibold mb-4">Prestaties</h3>
              <div v-if="achievements.length === 0" class="text-center py-4 text-gray-500">
                <p class="text-sm">Nog geen prestaties</p>
              </div>
              <div v-else class="space-y-3">
                <div
                  v-for="achievement in achievements.slice(0, 5)"
                  :key="achievement.id"
                  class="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
                >
                  <span class="text-2xl">{{ achievement.icon }}</span>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ achievement.title }}</p>
                    <p class="text-xs text-gray-500">{{ achievement.description }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quick Stats -->
            <div class="bg-white rounded-lg shadow-sm border p-6">
              <h3 class="text-lg font-semibold mb-4">Snelle Statistieken</h3>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">Totaal Punten</span>
                  <span class="text-sm font-medium">{{ totalPoints }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">Favorieten</span>
                  <span class="text-sm font-medium">{{ favoritesStore.favoritesCount }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">Vergelijkingen</span>
                  <span class="text-sm font-medium">{{ comparisonStore.comparisonCount }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-sm text-gray-600">Reviews</span>
                  <span class="text-sm font-medium">{{ userReviews.length }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Preferences Tab -->
        <div v-if="activeTab === 'preferences'" class="bg-white rounded-lg shadow-sm border p-6">
          <h3 class="text-lg font-semibold mb-6">Jouw Voorkeuren</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Riding Style -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Rijstijl</label>
              <select
                v-model="userPreferences.riding_style"
                @change="updatePreferences"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Selecteer je rijstijl</option>
                <option value="city">Stad</option>
                <option value="mountain">Berg</option>
                <option value="commute">Woon-werk</option>
                <option value="touring">Toeren</option>
                <option value="cargo">Vracht</option>
                <option value="folding">Vouwfiets</option>
                <option value="fat_bike">Fat Bike</option>
                <option value="road">Road</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            <!-- Experience Level -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Ervaring</label>
              <select
                v-model="userPreferences.experience_level"
                @change="updatePreferences"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Gemiddeld</option>
                <option value="advanced">Gevorderd</option>
                <option value="expert">Expert</option>
              </select>
            </div>

            <!-- Price Range -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Prijsbereik (€)</label>
              <div class="flex gap-2">
                <input
                  v-model="userPreferences.price_range_min"
                  @change="updatePreferences"
                  type="number"
                  placeholder="Min"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
                <span class="self-center text-gray-500">tot</span>
                <input
                  v-model="userPreferences.price_range_max"
                  @change="updatePreferences"
                  type="number"
                  placeholder="Max"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <!-- Preferred Brands -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Voorkeursmerken</label>
              <div class="flex flex-wrap gap-2">
                <label
                  v-for="brand in availableBrands"
                  :key="brand"
                  class="flex items-center gap-2"
                >
                  <input
                    v-model="userPreferences.preferred_brands"
                    :value="brand"
                    @change="updatePreferences"
                    type="checkbox"
                    class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span class="text-sm">{{ brand }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Bio -->
          <div class="mt-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea
              v-model="userPreferences.bio"
              @change="updatePreferences"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="Vertel ons over jezelf en je e-bike ervaring..."
            ></textarea>
          </div>
        </div>

        <!-- Comparisons Tab -->
        <div v-if="activeTab === 'comparisons'" class="bg-white rounded-lg shadow-sm border p-6">
          <h3 class="text-lg font-semibold mb-6">Opgeslagen Vergelijkingen</h3>

          <div v-if="savedComparisons.length === 0" class="text-center py-8 text-gray-500">
            <p>Geen vergelijkingen opgeslagen</p>
            <p class="text-sm">Vergelijk e-bikes en sla je vergelijkingen op voor later!</p>
            <RouterLink to="/vergelijk" class="inline-block mt-4 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors">
              Naar Vergelijkingen
            </RouterLink>
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="comparison in savedComparisons"
              :key="comparison.id"
              class="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <h4 class="font-medium text-gray-900 mb-2">{{ comparison.name }}</h4>
              <p class="text-sm text-gray-600 mb-2">
                {{ comparison.comparison_data?.ebike_data?.length || comparison.comparison_data?.ebike_ids?.length || comparison.ebike_ids?.length || 0 }} e-bikes vergeleken
              </p>
              <p class="text-xs text-gray-500 mb-4">{{ formatDate(comparison.created_at) }}</p>
              <div class="flex gap-2">
                <button
                  @click="viewComparison(comparison)"
                  class="flex-1 text-center bg-primary-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-primary-600 transition-colors"
                >
                  Bekijk
                </button>
                <button
                  @click="deleteComparison(comparison.id)"
                  class="bg-red-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-600 transition-colors"
                >
                  Verwijder
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Bike History Tab -->
        <div v-if="activeTab === 'bike-history'" class="bg-white rounded-lg shadow-sm border p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold">Mijn Fiets Geschiedenis</h3>
            <button
              @click="showAddBikeModal = true"
              class="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
            >
              Fiets Toevoegen
            </button>
          </div>

          <div v-if="bikeHistory.length === 0" class="text-center py-8 text-gray-500">
            <p>Nog geen fietsen in je geschiedenis</p>
            <p class="text-sm">Voeg fietsen toe die je hebt gehad, getest of gehuurd!</p>
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="bike in bikeHistory"
              :key="bike.id"
              class="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50"
            >
              <img
                :src="bike.ebikes?.image_url || '/placeholder-bike.png'"
                :alt="bike.ebikes?.model_name"
                class="w-16 h-16 rounded-lg object-cover"
              />
              <div class="flex-1">
                <h4 class="font-medium text-gray-900">
                  {{ bike.ebikes?.brand }} {{ bike.ebikes?.model_name }}
                </h4>
                <p class="text-sm text-gray-500">{{ bike.ownership_type }}</p>
                <p v-if="bike.start_date" class="text-sm text-gray-500">
                  {{ formatDate(bike.start_date) }} - {{ bike.end_date ? formatDate(bike.end_date) : 'Present' }}
                </p>
              </div>
              <div class="text-right">
                <div v-if="bike.satisfaction_rating" class="flex items-center gap-1 mb-1">
                  <span
                    v-for="i in 5"
                    :key="i"
                    :class="[
                      'text-sm',
                      i <= bike.satisfaction_rating ? 'text-yellow-500' : 'text-gray-300'
                    ]"
                  >
                    ★
                  </span>
                </div>
                <p v-if="bike.mileage_km" class="text-sm text-gray-500">{{ bike.mileage_km }} km</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Maintenance Tab -->
        <div v-if="activeTab === 'maintenance'" class="bg-white rounded-lg shadow-sm border p-6">
          <h3 class="text-lg font-semibold mb-6">Onderhoud Herinneringen</h3>
          
          <div v-if="upcomingMaintenance.length === 0" class="text-center py-8 text-gray-500">
            <p>Geen onderhoud herinneringen</p>
            <p class="text-sm">Voeg fietsen toe aan je geschiedenis om onderhoud herinneringen te krijgen!</p>
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="reminder in upcomingMaintenance"
              :key="reminder.id"
              :class="[
                'flex items-center justify-between p-4 border rounded-lg',
                reminder.completed ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
              ]"
            >
              <div class="flex items-center gap-3">
                <div :class="[
                  'w-3 h-3 rounded-full',
                  reminder.completed ? 'bg-green-500' : 'bg-yellow-500'
                ]"></div>
                <div>
                  <h4 class="font-medium text-gray-900">{{ reminder.reminder_type }}</h4>
                  <p class="text-sm text-gray-500">
                    Due: {{ formatDate(reminder.due_date) }}
                  </p>
                </div>
              </div>
              <div class="flex gap-2">
                <button
                  v-if="!reminder.completed"
                  @click="markMaintenanceComplete(reminder.id)"
                  class="text-sm text-green-600 hover:text-green-700"
                >
                  Mark Complete
                </button>
                <button
                  @click="deleteReminder(reminder.id)"
                  class="text-sm text-red-600 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Appointments Tab -->
        <div v-if="activeTab === 'appointments'" class="bg-white rounded-lg shadow-sm border p-6">
          <h3 class="text-lg font-semibold mb-6">Mijn Afspraken</h3>
          
          <div v-if="userAppointments.length === 0" class="text-center py-8 text-gray-500">
            <p>Geen afspraken ingepland</p>
            <p class="text-sm">Boek een proefrit om je afspraken hier te zien!</p>
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="appointment in userAppointments"
              :key="appointment.id"
              class="flex items-center justify-between p-4 border rounded-lg"
            >
              <div class="flex items-center gap-4">
                <img
                  :src="appointment.ebike?.image_url || '/placeholder-bike.png'"
                  :alt="appointment.ebike?.model_name"
                  class="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h4 class="font-medium text-gray-900">
                    {{ appointment.ebike?.brand }} {{ appointment.ebike?.model_name }}
                  </h4>
                  <p class="text-sm text-gray-500">
                    {{ formatDate(appointment.date) }} at {{ appointment.time }}
                  </p>
                  <p class="text-sm text-gray-500">{{ appointment.type }}</p>
                </div>
              </div>
              <div class="flex gap-2">
                <span :class="[
                  'px-2 py-1 rounded-full text-xs font-medium',
                  getStatusClass(appointment.status)
                ]">
                  {{ appointment.status }}
                </span>
                <button
                  v-if="appointment.status === 'confirmed'"
                  @click="rescheduleAppointment(appointment)"
                  class="text-sm text-blue-600 hover:text-blue-700"
                >
                  Reschedule
                </button>
                <button
                  v-if="appointment.status === 'confirmed'"
                  @click="cancelAppointment(appointment.id)"
                  class="text-sm text-red-600 hover:text-red-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <Footer />
    <EnhancedAIChatbot />

    <!-- Edit Profile Modal -->
    <div v-if="showEditProfileModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">Profiel Bewerken</h3>
          <button @click="showEditProfileModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="saveProfile" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Naam</label>
            <input
              v-model="editProfileForm.name"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Jouw naam"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input
              v-model="editProfileForm.email"
              type="email"
              disabled
              class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Telefoon</label>
            <input
              v-model="editProfileForm.phone"
              type="tel"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="06-12345678"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Adres</label>
            <input
              v-model="editProfileForm.address"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Straat en huisnummer"
            />
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Postcode</label>
              <input
                v-model="editProfileForm.postcode"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="1234AB"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Stad</label>
              <input
                v-model="editProfileForm.city"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Amsterdam"
              />
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Provincie</label>
            <select
              v-model="editProfileForm.province"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Selecteer provincie</option>
              <option value="Noord-Holland">Noord-Holland</option>
              <option value="Zuid-Holland">Zuid-Holland</option>
              <option value="Utrecht">Utrecht</option>
              <option value="Gelderland">Gelderland</option>
              <option value="Overijssel">Overijssel</option>
              <option value="Flevoland">Flevoland</option>
              <option value="Drenthe">Drenthe</option>
              <option value="Friesland">Friesland</option>
              <option value="Groningen">Groningen</option>
              <option value="Noord-Brabant">Noord-Brabant</option>
              <option value="Limburg">Limburg</option>
              <option value="Zeeland">Zeeland</option>
            </select>
          </div>
          
          <div class="flex justify-end gap-3 pt-4">
            <button
              type="button"
              @click="showEditProfileModal = false"
              class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuleren
            </button>
            <button
              type="submit"
              :disabled="savingProfile"
              class="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
            >
              {{ savingProfile ? 'Opslaan...' : 'Opslaan' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Preferences Modal -->
    <div v-if="showPreferencesModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">Voorkeuren</h3>
          <button @click="showPreferencesModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Rijstijl</label>
            <select
              v-model="preferencesForm.riding_style"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Selecteer je rijstijl</option>
              <option value="city">Stad</option>
              <option value="mountain">Berg</option>
              <option value="commute">Woon-werk</option>
              <option value="touring">Toeren</option>
              <option value="cargo">Vracht</option>
              <option value="folding">Vouwfiets</option>
              <option value="fat_bike">Fat Bike</option>
              <option value="road">Road</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Ervaring</label>
            <select
              v-model="preferencesForm.experience_level"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Gemiddeld</option>
              <option value="advanced">Gevorderd</option>
              <option value="expert">Expert</option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Min. Prijs (€)</label>
              <input
                v-model.number="preferencesForm.price_range_min"
                type="number"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="0"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Max. Prijs (€)</label>
              <input
                v-model.number="preferencesForm.price_range_max"
                type="number"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="10000"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Favoriete Merken</label>
            <div class="space-y-2 max-h-32 overflow-y-auto">
              <label v-for="brand in availableBrands" :key="brand" class="flex items-center">
                <input
                  :value="brand"
                  v-model="preferencesForm.preferred_brands"
                  type="checkbox"
                  class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span class="ml-2 text-sm text-gray-700">{{ brand }}</span>
              </label>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea
              v-model="preferencesForm.bio"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="Vertel ons over jezelf en je e-bike ervaring..."
            ></textarea>
          </div>
          
          <div class="flex justify-end gap-3 pt-4">
            <button
              type="button"
              @click="showPreferencesModal = false"
              class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuleren
            </button>
            <button
              @click="savePreferences"
              :disabled="savingPreferences"
              class="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
            >
              {{ savingPreferences ? 'Opslaan...' : 'Opslaan' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Avatar Upload Modal -->
    <div v-if="showAvatarModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">Profielfoto Uploaden</h3>
          <button @click="showAvatarModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="space-y-4">
          <div class="text-center">
            <div class="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
              <img
                v-if="avatarPreview"
                :src="avatarPreview"
                alt="Preview"
                class="w-full h-full object-cover"
              />
              <svg v-else class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <p class="text-sm text-gray-600">Kies een foto voor je profiel</p>
          </div>
          
          <div>
            <input
              ref="avatarInput"
              type="file"
              accept="image/*"
              @change="handleAvatarSelect"
              class="hidden"
            />
            <button
              @click="$refs.avatarInput.click()"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
            >
              Bestand Kiezen
            </button>
          </div>
          
          <div v-if="avatarError" class="text-red-600 text-sm">
            {{ avatarError }}
          </div>
          
          <div class="flex justify-end gap-3 pt-4">
            <button
              type="button"
              @click="showAvatarModal = false"
              class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuleren
            </button>
            <button
              @click="uploadAvatar"
              :disabled="!selectedAvatarFile || uploadingAvatar"
              class="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
            >
              {{ uploadingAvatar ? 'Uploaden...' : 'Uploaden' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Comparison Modal -->
    <div v-if="showComparisonModal && selectedComparison" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div class="flex justify-between items-center">
            <div>
              <h3 class="text-2xl font-bold">{{ selectedComparison.name }}</h3>
              <p class="text-blue-100 mt-1">{{ selectedComparison.comparison_data?.ebike_data?.length || 0 }} e-bikes vergeleken</p>
            </div>
            <button 
              @click="showComparisonModal = false" 
              class="text-white hover:text-blue-200 transition-colors p-2 rounded-lg hover:bg-blue-600"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Content -->
        <div class="p-6 overflow-y-auto max-h-[calc(95vh-140px)]">
          <div v-if="selectedComparison.comparison_data?.ebike_data?.length > 0" class="space-y-6">
            <!-- E-bike Cards Header -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
              <div 
                v-for="ebike in selectedComparison.comparison_data.ebike_data" 
                :key="ebike.id"
                class="bg-gray-50 rounded-lg p-4 border-2 border-transparent hover:border-blue-200 transition-colors"
              >
                <div class="text-center">
                  <img 
                    :src="ebike.image_url || '/placeholder-bike.png'" 
                    :alt="ebike.model_name"
                    class="w-20 h-20 object-cover rounded-lg mx-auto mb-3 shadow-md"
                  />
                  <h4 class="font-semibold text-gray-900 text-sm">{{ ebike.brand }}</h4>
                  <p class="text-xs text-gray-600 mb-2">{{ ebike.model_name }}</p>
                  <div class="text-lg font-bold text-blue-600">
                    €{{ (ebike.price_eur || ebike.price || 0).toLocaleString('nl-NL') }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Detailed Comparison Table -->
            <div class="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-4 text-left text-sm font-semibold text-gray-900 min-w-[200px]">Specificatie</th>
                      <th 
                        v-for="ebike in selectedComparison.comparison_data.ebike_data" 
                        :key="ebike.id"
                        class="px-4 py-4 text-center text-sm font-medium text-gray-900 min-w-[150px]"
                      >
                        <div class="text-xs text-gray-600">{{ ebike.brand }}</div>
                        <div class="text-xs text-gray-500">{{ ebike.model_name }}</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200">
                    <!-- Basic Information -->
                    <tr class="bg-blue-50">
                      <td colspan="4" class="px-6 py-3 text-sm font-semibold text-blue-800">Basis Informatie</td>
                    </tr>
                    <tr class="hover:bg-gray-50">
                      <td class="px-6 py-4 text-sm font-medium text-gray-700">Prijs</td>
                      <td 
                        v-for="ebike in selectedComparison.comparison_data.ebike_data" 
                        :key="ebike.id"
                        class="px-4 py-4 text-center text-sm"
                      >
                        <span class="font-semibold text-green-600">
                          €{{ (ebike.price_eur || ebike.price || 0).toLocaleString('nl-NL') }}
                        </span>
                      </td>
                    </tr>
                    <tr class="hover:bg-gray-50">
                      <td class="px-6 py-4 text-sm font-medium text-gray-700">Geslacht</td>
                      <td 
                        v-for="ebike in selectedComparison.comparison_data.ebike_data" 
                        :key="ebike.id"
                        class="px-4 py-4 text-center text-sm"
                      >
                        {{ ebike.gender || ebike.gender_type || 'Unisex' }}
                      </td>
                    </tr>
                    <tr class="hover:bg-gray-50">
                      <td class="px-6 py-4 text-sm font-medium text-gray-700">Versie</td>
                      <td 
                        v-for="ebike in selectedComparison.comparison_data.ebike_data" 
                        :key="ebike.id"
                        class="px-4 py-4 text-center text-sm"
                      >
                        {{ ebike.version || 'Standard' }}
                      </td>
                    </tr>

                    <!-- Range & Battery -->
                    <tr class="bg-green-50">
                      <td colspan="4" class="px-6 py-3 text-sm font-semibold text-green-800">Actieradius & Batterij</td>
                    </tr>
                    <tr class="hover:bg-gray-50">
                      <td class="px-6 py-4 text-sm font-medium text-gray-700">Actieradius (km)</td>
                      <td 
                        v-for="ebike in selectedComparison.comparison_data.ebike_data" 
                        :key="ebike.id"
                        class="px-4 py-4 text-center text-sm"
                      >
                        {{ ebike.range_km_claimed || ebike.action_radius_km || ebike.range_km || 'N/A' }}
                      </td>
                    </tr>
                    <tr class="hover:bg-gray-50">
                      <td class="px-6 py-4 text-sm font-medium text-gray-700">Batterij (Wh)</td>
                      <td 
                        v-for="ebike in selectedComparison.comparison_data.ebike_data" 
                        :key="ebike.id"
                        class="px-4 py-4 text-center text-sm"
                      >
                        {{ ebike.battery_wh || ebike.battery_capacity || 'N/A' }}
                      </td>
                    </tr>
                    <tr class="hover:bg-gray-50">
                      <td class="px-6 py-4 text-sm font-medium text-gray-700">Batterij (V)</td>
                      <td 
                        v-for="ebike in selectedComparison.comparison_data.ebike_data" 
                        :key="ebike.id"
                        class="px-4 py-4 text-center text-sm"
                      >
                        {{ ebike.battery_v || 'N/A' }}
                      </td>
                    </tr>
                    <tr class="hover:bg-gray-50">
                      <td class="px-6 py-4 text-sm font-medium text-gray-700">Batterij (Ah)</td>
                      <td 
                        v-for="ebike in selectedComparison.comparison_data.ebike_data" 
                        :key="ebike.id"
                        class="px-4 py-4 text-center text-sm"
                      >
                        {{ ebike.battery_ah || 'N/A' }}
                      </td>
                    </tr>

                    <!-- Motor & Performance -->
                    <tr class="bg-orange-50">
                      <td colspan="4" class="px-6 py-3 text-sm font-semibold text-orange-800">Motor & Prestaties</td>
                    </tr>
                    <tr class="hover:bg-gray-50">
                      <td class="px-6 py-4 text-sm font-medium text-gray-700">Motor (W)</td>
                      <td 
                        v-for="ebike in selectedComparison.comparison_data.ebike_data" 
                        :key="ebike.id"
                        class="px-4 py-4 text-center text-sm"
                      >
                        {{ ebike.motor_power_w_eu || ebike.motor_power_w || 'N/A' }}
                      </td>
                    </tr>
                    <tr class="hover:bg-gray-50">
                      <td class="px-6 py-4 text-sm font-medium text-gray-700">Koppel (Nm)</td>
                      <td 
                        v-for="ebike in selectedComparison.comparison_data.ebike_data" 
                        :key="ebike.id"
                        class="px-4 py-4 text-center text-sm"
                      >
                        {{ ebike.torque_nm || 'N/A' }}
                      </td>
                    </tr>
                    <tr class="hover:bg-gray-50">
                      <td class="px-6 py-4 text-sm font-medium text-gray-700">Topsnelheid (km/h)</td>
                      <td 
                        v-for="ebike in selectedComparison.comparison_data.ebike_data" 
                        :key="ebike.id"
                        class="px-4 py-4 text-center text-sm"
                      >
                        {{ ebike.top_speed_kmh || ebike.top_speed || 'N/A' }}
                      </td>
                    </tr>

                    <!-- Physical Specifications -->
                    <tr class="bg-purple-50">
                      <td colspan="4" class="px-6 py-3 text-sm font-semibold text-purple-800">Fysieke Specificaties</td>
                    </tr>
                    <tr class="hover:bg-gray-50">
                      <td class="px-6 py-4 text-sm font-medium text-gray-700">Wielmaat</td>
                      <td 
                        v-for="ebike in selectedComparison.comparison_data.ebike_data" 
                        :key="ebike.id"
                        class="px-4 py-4 text-center text-sm"
                      >
                        {{ ebike.wheel_size || 'N/A' }}
                      </td>
                    </tr>
                    <tr class="hover:bg-gray-50">
                      <td class="px-6 py-4 text-sm font-medium text-gray-700">Bandmaat</td>
                      <td 
                        v-for="ebike in selectedComparison.comparison_data.ebike_data" 
                        :key="ebike.id"
                        class="px-4 py-4 text-center text-sm"
                      >
                        {{ ebike.tire_size || 'N/A' }}
                      </td>
                    </tr>
                    <tr class="hover:bg-gray-50">
                      <td class="px-6 py-4 text-sm font-medium text-gray-700">Gewicht (kg)</td>
                      <td 
                        v-for="ebike in selectedComparison.comparison_data.ebike_data" 
                        :key="ebike.id"
                        class="px-4 py-4 text-center text-sm"
                      >
                        {{ ebike.weight_kg || ebike.weight || 'N/A' }}
                      </td>
                    </tr>
                    <tr class="hover:bg-gray-50">
                      <td class="px-6 py-4 text-sm font-medium text-gray-700">Laadvermogen (kg)</td>
                      <td 
                        v-for="ebike in selectedComparison.comparison_data.ebike_data" 
                        :key="ebike.id"
                        class="px-4 py-4 text-center text-sm"
                      >
                        {{ ebike.payload_kg || 'N/A' }}
                      </td>
                    </tr>
                    <tr class="hover:bg-gray-50">
                      <td class="px-6 py-4 text-sm font-medium text-gray-700">Frame</td>
                      <td 
                        v-for="ebike in selectedComparison.comparison_data.ebike_data" 
                        :key="ebike.id"
                        class="px-4 py-4 text-center text-sm"
                      >
                        {{ ebike.frame || ebike.frame_material || 'N/A' }}
                      </td>
                    </tr>
                    <tr class="hover:bg-gray-50">
                      <td class="px-6 py-4 text-sm font-medium text-gray-700">Remmen</td>
                      <td 
                        v-for="ebike in selectedComparison.comparison_data.ebike_data" 
                        :key="ebike.id"
                        class="px-4 py-4 text-center text-sm"
                      >
                        {{ ebike.brakes || ebike.brake_type || 'N/A' }}
                      </td>
                    </tr>

                    <!-- Additional Information -->
                    <tr class="bg-gray-50">
                      <td colspan="4" class="px-6 py-3 text-sm font-semibold text-gray-800">Extra Informatie</td>
                    </tr>
                    <tr class="hover:bg-gray-50">
                      <td class="px-6 py-4 text-sm font-medium text-gray-700">Waar te koop</td>
                      <td 
                        v-for="ebike in selectedComparison.comparison_data.ebike_data" 
                        :key="ebike.id"
                        class="px-4 py-4 text-center text-sm"
                      >
                        <a 
                          v-if="ebike.where_to_buy || ebike.affiliate_url" 
                          :href="ebike.where_to_buy || ebike.affiliate_url" 
                          target="_blank"
                          class="text-blue-600 hover:text-blue-800 underline"
                        >
                          Bekijk
                        </a>
                        <span v-else>N/A</span>
                      </td>
                    </tr>
                    <tr class="hover:bg-gray-50">
                      <td class="px-6 py-4 text-sm font-medium text-gray-700">Notities</td>
                      <td 
                        v-for="ebike in selectedComparison.comparison_data.ebike_data" 
                        :key="ebike.id"
                        class="px-4 py-4 text-center text-sm"
                      >
                        {{ ebike.notes || 'Geen' }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-between items-center pt-6 border-t border-gray-200">
              <div class="text-sm text-gray-500">
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Opgeslagen op {{ formatDate(selectedComparison.created_at) }}
              </div>
              <div class="flex gap-3">
                <button
                  @click="showComparisonModal = false"
                  class="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Sluiten
                </button>
                <button
                  @click="deleteComparison(selectedComparison.id); showComparisonModal = false"
                  class="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Verwijderen
                </button>
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-12 text-gray-500">
            <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p class="text-lg font-medium">Geen vergelijkingsdata beschikbaar</p>
            <p class="text-sm">Deze vergelijking bevat geen e-bike gegevens</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useUserProfileStore } from '../stores/userProfile'
import { useComparisonStore } from '../stores/comparison'
import { useFavoritesStore } from '../stores/favorites'
import { useAppointmentStore } from '../stores/appointments'
import { useEBikesStore } from '../stores/ebikes'
import { useReviewsStore } from '../stores/reviews'
import { supabase } from '../lib/supabase'
import Header from '../components/common/Header.vue'
import Footer from '../components/common/Footer.vue'
import EnhancedAIChatbot from '../components/EnhancedAIChatbot.vue'

const authStore = useAuthStore()
const userProfileStore = useUserProfileStore()
const comparisonStore = useComparisonStore()
const favoritesStore = useFavoritesStore()
const appointmentStore = useAppointmentStore()
const ebikeStore = useEBikesStore()
const reviewsStore = useReviewsStore()

// State
const activeTab = ref('overview')
const showEditProfileModal = ref(false)
const showPreferencesModal = ref(false)
const showAddBikeModal = ref(false)
const showAvatarModal = ref(false)
const showComparisonModal = ref(false)
const isLoading = ref(true)
const savedComparisons = ref<any[]>([])
const selectedComparison = ref<any>(null)

// Modal form data
const editProfileForm = ref({
  name: '',
  email: '',
  phone: '',
  address: '',
  postcode: '',
  city: '',
  province: ''
})

const preferencesForm = ref({
  riding_style: '',
  experience_level: 'beginner',
  price_range_min: null as number | null,
  price_range_max: null as number | null,
  preferred_brands: [] as string[],
  bio: ''
})

// Avatar upload state
const selectedAvatarFile = ref<File | null>(null)
const avatarPreview = ref<string | null>(null)
const avatarError = ref<string | null>(null)
const uploadingAvatar = ref(false)
const savingProfile = ref(false)
const savingPreferences = ref(false)

// Computed
const user = computed(() => authStore.user)
const isAuthenticated = computed(() => authStore.isAuthenticated)
const totalPoints = computed(() => userProfileStore.totalPoints || 0)
const recentActivities = computed(() => userProfileStore.recentActivities || [])
const achievements = computed(() => userProfileStore.achievements || [])
const bikeHistory = computed(() => userProfileStore.bikeHistory || [])
const upcomingMaintenance = computed(() => userProfileStore.upcomingMaintenance || [])
const userAppointments = computed(() => appointmentStore.appointments?.filter(apt => apt.user_id === user.value?.id) || [])
const userReviews = computed(() => reviewsStore.reviews?.filter(review => review.user_id === user.value?.id) || [])

const userPreferences = computed(() => ({
  riding_style: user.value?.riding_style || '',
  experience_level: user.value?.experience_level || 'beginner',
  price_range_min: user.value?.price_range_min || null,
  price_range_max: user.value?.price_range_max || null,
  preferred_brands: user.value?.preferred_brands || [],
  bio: user.value?.bio || ''
}))

const availableBrands = computed(() => {
  const brands = new Set(ebikeStore.ebikes.map(ebike => ebike.brand))
  return Array.from(brands).sort()
})

const tabs = computed(() => [
  { id: 'overview', label: 'Overzicht' },
  { id: 'preferences', label: 'Voorkeuren' },
  { id: 'comparisons', label: 'Vergelijkingen', count: savedComparisons.value.length },
  { id: 'bike-history', label: 'Fiets Geschiedenis', count: bikeHistory.value.length },
  { id: 'maintenance', label: 'Onderhoud', count: upcomingMaintenance.value.length },
  { id: 'appointments', label: 'Afspraken', count: userAppointments.value.length }
])

// Methods
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('nl-NL', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getActivityIcon = (activityType: string) => {
  const icons: Record<string, string> = {
    bike_view: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
    bike_compare: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
    review_posted: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
    favorite_added: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
    appointment_booked: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    profile_updated: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    search_performed: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
    achievement_unlocked: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z'
  }
  return icons[activityType] || icons['profile_updated']
}

const getActivityIconClass = (activityType: string) => {
  const classes: Record<string, string> = {
    bike_view: 'w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center',
    bike_compare: 'w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center',
    review_posted: 'w-8 h-8 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center',
    favorite_added: 'w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center',
    appointment_booked: 'w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center',
    profile_updated: 'w-8 h-8 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center',
    search_performed: 'w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center',
    achievement_unlocked: 'w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center'
  }
  return classes[activityType] || classes['profile_updated']
}

const getActivityDescription = (activity: any) => {
  const descriptions: Record<string, string> = {
    bike_view: 'Viewed an e-bike',
    bike_compare: 'Compared e-bikes',
    review_posted: 'Posted a review',
    favorite_added: 'Added to favorites',
    appointment_booked: 'Booked an appointment',
    profile_updated: 'Updated profile',
    search_performed: 'Performed a search',
    achievement_unlocked: 'Unlocked achievement'
  }
  return descriptions[activity.activity_type] || 'Performed an activity'
}

const updatePreferences = async () => {
  try {
    await userProfileStore.updateProfile(userPreferences.value)
  } catch (error) {
    console.error('Error updating preferences:', error)
  }
}

// Modal methods
const openEditProfileModal = () => {
  if (user.value) {
    editProfileForm.value = {
      name: user.value.name || '',
      email: user.value.email || '',
      phone: user.value.phone || '',
      address: user.value.address || '',
      postcode: user.value.postcode || '',
      city: user.value.city || '',
      province: user.value.province || ''
    }
  }
  showEditProfileModal.value = true
}

const openPreferencesModal = () => {
  preferencesForm.value = {
    riding_style: user.value?.riding_style || '',
    experience_level: user.value?.experience_level || 'beginner',
    price_range_min: user.value?.price_range_min || null,
    price_range_max: user.value?.price_range_max || null,
    preferred_brands: user.value?.preferred_brands || [],
    bio: user.value?.bio || ''
  }
  showPreferencesModal.value = true
}

const saveProfile = async () => {
  if (!user.value) return
  
  savingProfile.value = true
  try {
    await authStore.updateProfile(editProfileForm.value)
    showEditProfileModal.value = false
  } catch (error) {
    console.error('Error saving profile:', error)
  } finally {
    savingProfile.value = false
  }
}

const savePreferences = async () => {
  if (!user.value) return
  
  savingPreferences.value = true
  try {
    await authStore.updateProfile(preferencesForm.value)
    showPreferencesModal.value = false
  } catch (error) {
    console.error('Error saving preferences:', error)
  } finally {
    savingPreferences.value = false
  }
}

// Avatar upload methods
const handleAvatarSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      avatarError.value = 'Alleen afbeeldingen zijn toegestaan'
      return
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      avatarError.value = 'Bestand is te groot (max 5MB)'
      return
    }
    
    selectedAvatarFile.value = file
    avatarError.value = null
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      avatarPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const uploadAvatar = async () => {
  if (!selectedAvatarFile.value || !user.value) return
  
  uploadingAvatar.value = true
  avatarError.value = null
  
  try {
    const file = selectedAvatarFile.value
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.value.id}-${Date.now()}.${fileExt}`

    // Upload to Supabase Storage with upsert to replace if exists
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      throw uploadError
    }

    // Get public URL
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName)

    console.log('Public URL:', data.publicUrl)

    // Update profile with new avatar URL
    await authStore.updateProfile({ avatar_url: data.publicUrl })
    
    showAvatarModal.value = false
    selectedAvatarFile.value = null
    avatarPreview.value = null
  } catch (error) {
    console.error('Error uploading avatar:', error)
    avatarError.value = 'Fout bij uploaden van afbeelding'
  } finally {
    uploadingAvatar.value = false
  }
}

const markMaintenanceComplete = async (reminderId: string) => {
  try {
    await userProfileStore.markMaintenanceComplete(reminderId)
  } catch (error) {
    console.error('Error marking maintenance complete:', error)
  }
}

const deleteReminder = async (reminderId: string) => {
  try {
    // Implement delete reminder functionality
    console.log('Delete reminder:', reminderId)
  } catch (error) {
    console.error('Error deleting reminder:', error)
  }
}

const rescheduleAppointment = (appointment: any) => {
  // Implement reschedule functionality
  console.log('Reschedule appointment:', appointment.id)
}

const cancelAppointment = async (appointmentId: string) => {
  try {
    await appointmentStore.cancelAppointment(appointmentId)
  } catch (error) {
    console.error('Error canceling appointment:', error)
  }
}

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
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

// View comparison in modal
const viewComparison = (comparison: any) => {
  selectedComparison.value = comparison
  showComparisonModal.value = true
}

// Lifecycle
onMounted(async () => {
  if (isAuthenticated.value) {
    try {
      await Promise.all([
        userProfileStore.initialize(),
        favoritesStore.fetchFavorites(),
        appointmentStore.fetchAppointments(),
        ebikeStore.fetchEBikes(),
        reviewsStore.fetchReviews(),
        loadSavedComparisons()
      ])
    } catch (error) {
      console.error('Error initializing profile data:', error)
    } finally {
      isLoading.value = false
    }
  } else {
    isLoading.value = false
  }
})
</script>

<style scoped>
/* Custom styles if needed */
</style>
