<!-- Dealer Inventory Management Component -->
<!-- Comprehensive e-bike inventory management with detailed specifications -->

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Inventory Management</h2>
        <p class="text-gray-600">Manage your e-bike inventory with detailed specifications</p>
      </div>
      <button
        @click="showAddModal = true"
        class="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add E-bike
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-sm border p-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Brand</label>
          <select
            v-model="filters.brand"
            @change="applyFilters"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Brands</option>
            <option v-for="brand in brands" :key="brand" :value="brand">{{ brand }}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            v-model="filters.status"
            @change="applyFilters"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="discontinued">Discontinued</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
          <div class="flex gap-2">
            <input
              v-model.number="filters.price_min"
              type="number"
              placeholder="Min"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            <input
              v-model.number="filters.price_max"
              type="number"
              placeholder="Max"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div class="flex items-end">
          <button
            @click="clearFilters"
            class="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Inventory Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Items</p>
            <p class="text-2xl font-bold text-gray-900">{{ inventory.length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Active Items</p>
            <p class="text-2xl font-bold text-gray-900">{{ inventory.filter(item => item.status === 'active').length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center">
          <div class="p-2 bg-yellow-100 rounded-lg">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Low Stock</p>
            <p class="text-2xl font-bold text-gray-900">{{ lowStockItems.length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-lg">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Value</p>
            <p class="text-2xl font-bold text-gray-900">€{{ totalValue.toLocaleString() }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Inventory Table -->
    <div class="bg-white rounded-lg shadow-sm border">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-bike</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specifications</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in filteredInventory" :key="item.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <img
                    :src="item.thumbnail_url || item.image_urls[0] || '/placeholder-bike.png'"
                    :alt="item.model"
                    class="w-16 h-16 rounded-lg object-cover"
                  />
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ item.brand }} {{ item.model }}</div>
                    <div class="text-sm text-gray-500">{{ item.version || 'Standard' }}</div>
                    <div v-if="item.is_featured" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Featured
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">
                  <div v-if="item.motor_power_w_eu">{{ item.motor_power_w_eu }}W Motor</div>
                  <div v-if="item.battery_wh">{{ item.battery_wh }}Wh Battery</div>
                  <div v-if="item.range_km_claimed">{{ item.range_km_claimed }}km Range</div>
                  <div v-if="item.weight_kg">{{ item.weight_kg }}kg</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">€{{ item.price_eur.toLocaleString() }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <span :class="[
                    'text-sm font-medium',
                    item.stock_quantity <= item.min_stock_level ? 'text-red-600' : 'text-gray-900'
                  ]">
                    {{ item.stock_quantity }}
                  </span>
                  <span class="text-sm text-gray-500 ml-1">/ {{ item.min_stock_level }} min</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  item.status === 'active' ? 'bg-green-100 text-green-800' :
                  item.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                  item.status === 'discontinued' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                ]">
                  {{ item.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center gap-2">
                  <button
                    @click="editItem(item)"
                    class="text-primary-600 hover:text-primary-900"
                  >
                    Edit
                  </button>
                  <button
                    @click="toggleFeatured(item.id)"
                    :class="[
                      'px-2 py-1 rounded text-xs',
                      item.is_featured ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                    ]"
                  >
                    {{ item.is_featured ? 'Unfeature' : 'Feature' }}
                  </button>
                  <button
                    @click="deleteItem(item.id)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal || showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-semibold">{{ showAddModal ? 'Add New E-bike' : 'Edit E-bike' }}</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveItem" class="space-y-6">
          <!-- Basic Information -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Brand *</label>
              <input
                v-model="form.brand"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., Gazelle"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Model *</label>
              <input
                v-model="form.model"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., Ultimate C8+ HMB"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Version</label>
              <input
                v-model="form.version"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., 2024"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Price (EUR) *</label>
              <input
                v-model.number="form.price_eur"
                type="number"
                required
                step="0.01"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="2999.00"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <select
                v-model="form.gender"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="unisex">Unisex</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="kids">Kids</option>
              </select>
            </div>
          </div>

          <!-- Range & Battery -->
          <div class="border-t pt-6">
            <h4 class="text-md font-semibold mb-4">Range & Battery</h4>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Range (claimed km)</label>
                <input
                  v-model.number="form.range_km_claimed"
                  type="number"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="80"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Range (verified km)</label>
                <input
                  v-model.number="form.range_km_verified"
                  type="number"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="75"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Battery (V)</label>
                <input
                  v-model.number="form.battery_v"
                  type="number"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="36"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Battery (Ah)</label>
                <input
                  v-model.number="form.battery_ah"
                  type="number"
                  step="0.1"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="14.5"
                />
              </div>
            </div>
            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Battery (Wh)</label>
              <input
                v-model.number="form.battery_wh"
                type="number"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="522"
              />
            </div>
          </div>

          <!-- Motor & Performance -->
          <div class="border-t pt-6">
            <h4 class="text-md font-semibold mb-4">Motor & Performance</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Motor Power (W EU)</label>
                <input
                  v-model.number="form.motor_power_w_eu"
                  type="number"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="250"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Torque (Nm)</label>
                <input
                  v-model.number="form.torque_nm"
                  type="number"
                  step="0.1"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="50"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Top Speed (km/h)</label>
                <input
                  v-model.number="form.top_speed_kmh"
                  type="number"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="25"
                />
              </div>
            </div>
          </div>

          <!-- Physical Specifications -->
          <div class="border-t pt-6">
            <h4 class="text-md font-semibold mb-4">Physical Specifications</h4>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Wheel Size</label>
                <input
                  v-model="form.wheel_size"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="28 inch"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Tire Size</label>
                <input
                  v-model="form.tire_size"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="28x2.0"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                <input
                  v-model.number="form.weight_kg"
                  type="number"
                  step="0.1"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="25.5"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Payload (kg)</label>
                <input
                  v-model.number="form.payload_kg"
                  type="number"
                  step="0.1"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="120"
                />
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Frame</label>
                <input
                  v-model="form.frame"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Aluminum"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Brakes</label>
                <input
                  v-model="form.brakes"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Hydraulic Disc"
                />
              </div>
            </div>
          </div>

          <!-- Inventory Management -->
          <div class="border-t pt-6">
            <h4 class="text-md font-semibold mb-4">Inventory Management</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Stock Quantity *</label>
                <input
                  v-model.number="form.stock_quantity"
                  type="number"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="5"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Min Stock Level *</label>
                <input
                  v-model.number="form.min_stock_level"
                  type="number"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="1"
                />
              </div>
              <div class="flex items-center">
                <label class="flex items-center">
                  <input
                    v-model="form.is_available"
                    type="checkbox"
                    class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span class="ml-2 text-sm text-gray-700">Available for sale</span>
                </label>
              </div>
            </div>
            <div class="mt-4 flex items-center">
              <label class="flex items-center">
                <input
                  v-model="form.is_featured"
                  type="checkbox"
                  class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span class="ml-2 text-sm text-gray-700">Featured item</span>
              </label>
            </div>
          </div>

          <!-- Additional Information -->
          <div class="border-t pt-6">
            <h4 class="text-md font-semibold mb-4">Additional Information</h4>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  v-model="form.notes"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Additional notes about this e-bike..."
                ></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Where to Buy</label>
                <textarea
                  v-model="form.where_to_buy"
                  rows="2"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Information about where customers can buy this e-bike..."
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end gap-3 pt-6 border-t">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
            >
              {{ loading ? 'Saving...' : (showAddModal ? 'Add E-bike' : 'Update E-bike') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useDealerInventoryStore } from '../../stores/dealerInventory'
import { useAuthStore } from '../../stores/auth'
import type { DealerInventoryForm } from '../../types/dealerEnhanced'

const inventoryStore = useDealerInventoryStore()
const authStore = useAuthStore()

// State
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingItem = ref<DealerInventoryForm | null>(null)

// Form data
const form = ref<DealerInventoryForm>({
  brand: '',
  model: '',
  version: '',
  price_eur: 0,
  gender: 'unisex',
  range_km_claimed: undefined,
  range_km_verified: undefined,
  battery_v: undefined,
  battery_ah: undefined,
  battery_wh: undefined,
  motor_power_w_eu: undefined,
  torque_nm: undefined,
  top_speed_kmh: undefined,
  wheel_size: '',
  tire_size: '',
  weight_kg: undefined,
  payload_kg: undefined,
  frame: '',
  brakes: '',
  notes: '',
  where_to_buy: '',
  stock_quantity: 1,
  min_stock_level: 1,
  is_available: true,
  is_featured: false,
  meta_title: '',
  meta_description: '',
  keywords: []
})

// Computed
const inventory = computed(() => inventoryStore.inventory)
const filteredInventory = computed(() => inventoryStore.filteredInventory)
const lowStockItems = computed(() => inventoryStore.lowStockItems)
const totalValue = computed(() => inventoryStore.totalValue)
const brands = computed(() => inventoryStore.brands)
const loading = computed(() => inventoryStore.loading)
const filters = computed(() => inventoryStore.filters)

// Methods
const applyFilters = () => {
  inventoryStore.setFilters(filters.value)
}

const clearFilters = () => {
  inventoryStore.clearFilters()
}

const editItem = (item: any) => {
  editingItem.value = item
  form.value = { ...item }
  showEditModal.value = true
}

const deleteItem = async (id: string) => {
  if (confirm('Are you sure you want to delete this e-bike?')) {
    try {
      await inventoryStore.deleteInventoryItem(id)
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }
}

const toggleFeatured = async (id: string) => {
  try {
    await inventoryStore.toggleFeatured(id)
  } catch (error) {
    console.error('Error toggling featured status:', error)
  }
}

const saveItem = async () => {
  if (!authStore.user?.id) return

  try {
    if (showAddModal.value) {
      await inventoryStore.createInventoryItem(authStore.user.id, form.value)
    } else if (editingItem.value) {
      await inventoryStore.updateInventoryItem(editingItem.value.id!, form.value)
    }
    closeModal()
  } catch (error) {
    console.error('Error saving item:', error)
  }
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingItem.value = null
  resetForm()
}

const resetForm = () => {
  form.value = {
    brand: '',
    model: '',
    version: '',
    price_eur: 0,
    gender: 'unisex',
    range_km_claimed: undefined,
    range_km_verified: undefined,
    battery_v: undefined,
    battery_ah: undefined,
    battery_wh: undefined,
    motor_power_w_eu: undefined,
    torque_nm: undefined,
    top_speed_kmh: undefined,
    wheel_size: '',
    tire_size: '',
    weight_kg: undefined,
    payload_kg: undefined,
    frame: '',
    brakes: '',
    notes: '',
    where_to_buy: '',
    stock_quantity: 1,
    min_stock_level: 1,
    is_available: true,
    is_featured: false,
    meta_title: '',
    meta_description: '',
    keywords: []
  }
}

// Lifecycle
onMounted(async () => {
  if (authStore.user?.id) {
    await inventoryStore.fetchInventory(authStore.user.id)
  }
})
</script>
