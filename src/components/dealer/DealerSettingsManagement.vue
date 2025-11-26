<!-- Dealer Settings Management Component -->
<!-- Comprehensive dealer settings and profile management -->

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Settings</h2>
        <p class="text-gray-600">Manage your dealer profile and preferences</p>
      </div>
      <div class="flex gap-2">
        <button
          @click="saveSettings"
          :disabled="!isDirty || loading"
          class="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          Save Changes
        </button>
      </div>
    </div>

    <!-- Settings Tabs -->
    <div class="bg-white rounded-lg shadow-sm border">
      <nav class="flex border-b">
        <button
          v-for="tab in settingsTabs"
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
        </button>
      </nav>

      <div class="p-6">
        <!-- Business Information Tab -->
        <div v-if="activeTab === 'business'" class="space-y-6">
          <h3 class="text-lg font-semibold">Business Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Business Name *</label>
              <input
                v-model="settingsForm.business_name"
                type="text"
                required
                @input="markDirty"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Your Business Name"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
              <select
                v-model="settingsForm.business_type"
                @change="markDirty"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="retail">Retail</option>
                <option value="wholesale">Wholesale</option>
                <option value="service">Service</option>
                <option value="franchise">Franchise</option>
                <option value="online">Online</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tax ID</label>
              <input
                v-model="settingsForm.tax_id"
                type="text"
                @input="markDirty"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Tax Identification Number"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Business License</label>
              <input
                v-model="settingsForm.business_license"
                type="text"
                @input="markDirty"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Business License Number"
              />
            </div>
          </div>
        </div>

        <!-- Contact Information Tab -->
        <div v-if="activeTab === 'contact'" class="space-y-6">
          <h3 class="text-lg font-semibold">Contact Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Primary Contact Name *</label>
              <input
                v-model="settingsForm.primary_contact_name"
                type="text"
                required
                @input="markDirty"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Contact Person Name"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Primary Contact Email *</label>
              <input
                v-model="settingsForm.primary_contact_email"
                type="email"
                required
                @input="markDirty"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="contact@yourbusiness.com"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Primary Contact Phone *</label>
              <input
                v-model="settingsForm.primary_contact_phone"
                type="tel"
                required
                @input="markDirty"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="+31 6 12345678"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
              <input
                v-model="settingsForm.website_url"
                type="url"
                @input="markDirty"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>

          <!-- Social Media -->
          <div>
            <h4 class="text-md font-semibold mb-4">Social Media</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                <input
                  v-model="settingsForm.social_media.facebook"
                  type="url"
                  @input="markDirty"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="https://facebook.com/yourpage"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                <input
                  v-model="settingsForm.social_media.instagram"
                  type="url"
                  @input="markDirty"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="https://instagram.com/yourpage"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                <input
                  v-model="settingsForm.social_media.linkedin"
                  type="url"
                  @input="markDirty"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="https://linkedin.com/company/yourcompany"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                <input
                  v-model="settingsForm.social_media.twitter"
                  type="url"
                  @input="markDirty"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="https://twitter.com/yourhandle"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Working Hours Tab -->
        <div v-if="activeTab === 'hours'" class="space-y-6">
          <h3 class="text-lg font-semibold">Working Hours</h3>
          <div class="space-y-4">
            <div
              v-for="(day, dayName) in settingsForm.working_hours"
              :key="dayName"
              class="flex items-center justify-between p-4 border rounded-lg"
            >
              <div class="flex items-center">
                <input
                  :id="`${dayName}-enabled`"
                  v-model="day.enabled"
                  type="checkbox"
                  @change="markDirty"
                  class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label :for="`${dayName}-enabled`" class="ml-3 text-sm font-medium text-gray-700 capitalize">
                  {{ dayName }}
                </label>
              </div>
              <div v-if="day.enabled" class="flex items-center gap-2">
                <input
                  v-model="day.start"
                  type="time"
                  @change="markDirty"
                  class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
                <span class="text-gray-500">to</span>
                <input
                  v-model="day.end"
                  type="time"
                  @change="markDirty"
                  class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Service Areas Tab -->
        <div v-if="activeTab === 'service'" class="space-y-6">
          <h3 class="text-lg font-semibold">Service Areas</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Service Areas</label>
              <textarea
                v-model="serviceAreasText"
                @input="updateServiceAreas"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Enter service areas, one per line"
              ></textarea>
              <p class="text-sm text-gray-500 mt-1">Enter one area per line</p>
            </div>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Delivery Radius (km)</label>
                <input
                  v-model.number="settingsForm.delivery_radius_km"
                  type="number"
                  @input="markDirty"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="50"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Delivery Fee (€)</label>
                <input
                  v-model.number="settingsForm.delivery_fee"
                  type="number"
                  step="0.01"
                  @input="markDirty"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Commission Settings Tab -->
        <div v-if="activeTab === 'commission'" class="space-y-6">
          <h3 class="text-lg font-semibold">Commission Settings</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Default Commission Rate (%)</label>
              <input
                v-model.number="settingsForm.default_commission_rate"
                type="number"
                step="0.01"
                min="0"
                max="100"
                @input="markDirty"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="5.0"
              />
              <p class="text-sm text-gray-500 mt-1">Enter as percentage (e.g., 5.0 for 5%)</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Commission Tiers (JSON)</label>
              <textarea
                v-model="commissionTiersText"
                @input="updateCommissionTiers"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                placeholder='{"tier1": {"min": 0, "max": 1000, "rate": 0.05}, "tier2": {"min": 1000, "max": 5000, "rate": 0.07}}'
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Notifications Tab -->
        <div v-if="activeTab === 'notifications'" class="space-y-6">
          <h3 class="text-lg font-semibold">Notification Preferences</h3>
          <div class="space-y-4">
            <div
              v-for="(enabled, key) in settingsForm.notification_preferences"
              :key="key"
              class="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <label :for="`notification-${key}`" class="text-sm font-medium text-gray-700">
                  {{ getNotificationLabel(key) }}
                </label>
                <p class="text-sm text-gray-500">{{ getNotificationDescription(key) }}</p>
              </div>
              <input
                :id="`notification-${key}`"
                v-model="settingsForm.notification_preferences[key]"
                type="checkbox"
                @change="markDirty"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        <!-- Marketing Tab -->
        <div v-if="activeTab === 'marketing'" class="space-y-6">
          <h3 class="text-lg font-semibold">Marketing Settings</h3>
          <div class="space-y-6">
            <div class="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <label for="auto-respond" class="text-sm font-medium text-gray-700">Auto Respond to Leads</label>
                <p class="text-sm text-gray-500">Automatically send a response when a new lead is received</p>
              </div>
              <input
                id="auto-respond"
                v-model="settingsForm.marketing_settings.auto_respond"
                type="checkbox"
                @change="markDirty"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Response Template</label>
              <textarea
                v-model="settingsForm.marketing_settings.response_template"
                @input="markDirty"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Thank you for your interest in our e-bikes! We will contact you within 24 hours."
              ></textarea>
            </div>

            <div class="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <label for="follow-up" class="text-sm font-medium text-gray-700">Follow-up Sequence</label>
                <p class="text-sm text-gray-500">Automatically send follow-up messages to leads</p>
              </div>
              <input
                id="follow-up"
                v-model="settingsForm.marketing_settings.follow_up_sequence"
                type="checkbox"
                @change="markDirty"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email Signature</label>
              <textarea
                v-model="settingsForm.marketing_settings.email_signature"
                @input="markDirty"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Best regards,&#10;Your Name&#10;Your Business"
              ></textarea>
            </div>

            <div class="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <label for="social-sharing" class="text-sm font-medium text-gray-700">Social Sharing</label>
                <p class="text-sm text-gray-500">Allow customers to share your e-bikes on social media</p>
              </div>
              <input
                id="social-sharing"
                v-model="settingsForm.marketing_settings.social_sharing"
                type="checkbox"
                @change="markDirty"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        <!-- Inventory Tab -->
        <div v-if="activeTab === 'inventory'" class="space-y-6">
          <h3 class="text-lg font-semibold">Inventory Settings</h3>
          <div class="space-y-6">
            <div class="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <label for="auto-approve" class="text-sm font-medium text-gray-700">Auto Approve Inventory</label>
                <p class="text-sm text-gray-500">Automatically approve new inventory items</p>
              </div>
              <input
                id="auto-approve"
                v-model="settingsForm.inventory_settings.auto_approve"
                type="checkbox"
                @change="markDirty"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Low Stock Threshold</label>
                <input
                  v-model.number="settingsForm.inventory_settings.low_stock_threshold"
                  type="number"
                  @input="markDirty"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="5"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Featured Rotation (days)</label>
                <input
                  v-model.number="settingsForm.inventory_settings.featured_rotation_days"
                  type="number"
                  @input="markDirty"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="7"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Price Update Frequency</label>
              <select
                v-model="settingsForm.inventory_settings.price_update_frequency"
                @change="markDirty"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="manual">Manual</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useDealerSettingsStore } from '../../stores/dealerSettings'
import { useAuthStore } from '../../stores/auth'

const settingsStore = useDealerSettingsStore()
const authStore = useAuthStore()

// State
const activeTab = ref('business')
const serviceAreasText = ref('')
const commissionTiersText = ref('{}')

// Settings tabs
const settingsTabs = [
  { id: 'business', label: 'Business Info' },
  { id: 'contact', label: 'Contact Info' },
  { id: 'hours', label: 'Working Hours' },
  { id: 'service', label: 'Service Areas' },
  { id: 'commission', label: 'Commission' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'inventory', label: 'Inventory' }
]

// Form data
const settingsForm = ref({
  business_name: '',
  business_type: 'retail' as const,
  tax_id: '',
  business_license: '',
  primary_contact_name: '',
  primary_contact_email: '',
  primary_contact_phone: '',
  website_url: '',
  social_media: {
    facebook: '',
    instagram: '',
    linkedin: '',
    twitter: ''
  },
  working_hours: {
    monday: { start: '09:00', end: '17:00', enabled: true },
    tuesday: { start: '09:00', end: '17:00', enabled: true },
    wednesday: { start: '09:00', end: '17:00', enabled: true },
    thursday: { start: '09:00', end: '17:00', enabled: true },
    friday: { start: '09:00', end: '17:00', enabled: true },
    saturday: { start: '10:00', end: '16:00', enabled: true },
    sunday: { start: '10:00', end: '16:00', enabled: false }
  },
  service_areas: [] as string[],
  delivery_radius_km: 50,
  delivery_fee: 0,
  default_commission_rate: 0.05,
  commission_tiers: {} as Record<string, any>,
  notification_preferences: {
    email: true,
    sms: false,
    push: true,
    lead_notifications: true,
    commission_notifications: true,
    inventory_alerts: true,
    performance_reports: true
  },
  marketing_settings: {
    auto_respond: true,
    response_template: 'Thank you for your interest in our e-bikes! We will contact you within 24 hours.',
    follow_up_sequence: true,
    email_signature: '',
    social_sharing: true
  },
  inventory_settings: {
    auto_approve: false,
    low_stock_threshold: 5,
    featured_rotation_days: 7,
    price_update_frequency: 'weekly'
  }
})

// Computed
const settings = computed(() => settingsStore.settings)
const loading = computed(() => settingsStore.loading)
const isDirty = computed(() => settingsStore.isDirty)

// Methods
const markDirty = () => {
  settingsStore.markDirty()
}

const updateServiceAreas = () => {
  settingsForm.value.service_areas = serviceAreasText.value
    .split('\n')
    .map(area => area.trim())
    .filter(area => area.length > 0)
  markDirty()
}

const updateCommissionTiers = () => {
  try {
    settingsForm.value.commission_tiers = JSON.parse(commissionTiersText.value)
    markDirty()
  } catch (error) {
    console.error('Invalid JSON for commission tiers:', error)
  }
}

const saveSettings = async () => {
  if (!authStore.user?.id) return

  try {
    await settingsStore.updateSettings(settingsForm.value)
    settingsStore.markClean()
  } catch (error) {
    console.error('Error saving settings:', error)
  }
}

const getNotificationLabel = (key: string): string => {
  const labels: Record<string, string> = {
    email: 'Email Notifications',
    sms: 'SMS Notifications',
    push: 'Push Notifications',
    lead_notifications: 'Lead Notifications',
    commission_notifications: 'Commission Notifications',
    inventory_alerts: 'Inventory Alerts',
    performance_reports: 'Performance Reports'
  }
  return labels[key] || key
}

const getNotificationDescription = (key: string): string => {
  const descriptions: Record<string, string> = {
    email: 'Receive notifications via email',
    sms: 'Receive notifications via SMS',
    push: 'Receive push notifications in browser',
    lead_notifications: 'Get notified about new leads',
    commission_notifications: 'Get notified about commission updates',
    inventory_alerts: 'Get notified about low stock and inventory issues',
    performance_reports: 'Receive periodic performance reports'
  }
  return descriptions[key] || ''
}

const loadSettings = () => {
  if (settings.value) {
    settingsForm.value = { ...settings.value }
    serviceAreasText.value = settings.value.service_areas.join('\n')
    commissionTiersText.value = JSON.stringify(settings.value.commission_tiers, null, 2)
  }
}

// Lifecycle
onMounted(async () => {
  if (authStore.user?.id) {
    await settingsStore.fetchSettings(authStore.user.id)
    loadSettings()
  }
})

// Watch for settings changes
watch(settings, () => {
  loadSettings()
}, { deep: true })
</script>
