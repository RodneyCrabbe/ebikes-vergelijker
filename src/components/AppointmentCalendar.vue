<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Props {
  selectedDate: string
  selectedLocation?: string
  appointmentType?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:selectedDate': [date: string]
}>()

const currentYear = ref(new Date().getFullYear())
const currentMonth = ref(new Date().getMonth())
const selectedDate = ref(props.selectedDate)

const monthNames = [
  'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni',
  'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'
]

const dayNames = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo']

const calendarDays = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - (firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1))
  
  const days = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    
    const isCurrentMonth = date.getMonth() === month
    const isToday = date.getTime() === today.getTime()
    const isPast = date < today
    const isSelected = selectedDate.value === date.toISOString().split('T')[0]
    
    days.push({
      date: new Date(date),
      dateString: date.toISOString().split('T')[0],
      isCurrentMonth,
      isToday,
      isPast,
      isSelected
    })
  }
  
  return days
})

const currentMonthName = computed(() => {
  return `${monthNames[currentMonth.value]} ${currentYear.value}`
})

const canGoPrevious = computed(() => {
  const today = new Date()
  return currentYear.value > today.getFullYear() || 
         (currentYear.value === today.getFullYear() && currentMonth.value > today.getMonth())
})

const canGoNext = computed(() => {
  const today = new Date()
  const maxDate = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate())
  return new Date(currentYear.value, currentMonth.value) < maxDate
})

const selectDate = (date: string) => {
  selectedDate.value = date
  emit('update:selectedDate', date)
}

const goToPreviousMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

const goToNextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

const goToToday = () => {
  const today = new Date()
  currentYear.value = today.getFullYear()
  currentMonth.value = today.getMonth()
  selectDate(today.toISOString().split('T')[0])
}

const goToYear = (year: number) => {
  currentYear.value = year
}

// Watch for external changes to selectedDate
watch(() => props.selectedDate, (newDate) => {
  if (newDate && newDate !== selectedDate.value) {
    selectedDate.value = newDate
    const date = new Date(newDate)
    currentYear.value = date.getFullYear()
    currentMonth.value = date.getMonth()
  }
})

// Generate year options (current year + 1 year ahead)
const yearOptions = computed(() => {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let i = 0; i <= 1; i++) {
    years.push(currentYear + i)
  }
  return years
})
</script>

<template>
  <div class="bg-white rounded-2xl shadow-lg p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-xl font-bold">Kies een datum</h3>
      <div class="flex items-center space-x-2">
        <select 
          v-model="currentYear" 
          @change="goToYear(currentYear)"
          class="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-accent focus:border-accent"
        >
          <option v-for="year in yearOptions" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
        <button
          @click="goToToday"
          class="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
        >
          Vandaag
        </button>
      </div>
    </div>

    <!-- Month Navigation -->
    <div class="flex items-center justify-between mb-4">
      <button
        @click="goToPreviousMonth"
        :disabled="!canGoPrevious"
        :class="['p-2 rounded-lg transition-colors', 
          canGoPrevious 
            ? 'hover:bg-gray-100 text-gray-700' 
            : 'text-gray-300 cursor-not-allowed']"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>
      
      <h4 class="text-lg font-semibold">{{ currentMonthName }}</h4>
      
      <button
        @click="goToNextMonth"
        :disabled="!canGoNext"
        :class="['p-2 rounded-lg transition-colors', 
          canGoNext 
            ? 'hover:bg-gray-100 text-gray-700' 
            : 'text-gray-300 cursor-not-allowed']"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
    </div>

    <!-- Calendar Grid -->
    <div class="grid grid-cols-7 gap-1 mb-2">
      <div 
        v-for="day in dayNames" 
        :key="day"
        class="text-center text-sm font-semibold text-gray-500 py-2"
      >
        {{ day }}
      </div>
    </div>

    <div class="grid grid-cols-7 gap-1">
      <button
        v-for="day in calendarDays"
        :key="day.dateString"
        @click="!day.isPast && selectDate(day.dateString)"
        :disabled="day.isPast"
        :class="[
          'h-10 w-10 rounded-lg text-sm font-medium transition-all flex items-center justify-center border-2',
          day.isPast 
            ? 'text-gray-300 cursor-not-allowed border-transparent' 
            : day.isSelected
              ? 'bg-blue-600 text-white border-blue-700 font-semibold'
              : day.isToday
                ? 'bg-blue-100 text-blue-700 font-semibold border-blue-300'
                : day.isCurrentMonth
                  ? 'text-gray-700 hover:bg-blue-100 border-transparent hover:border-blue-200'
                  : 'text-gray-300 hover:bg-gray-50 border-transparent'
        ]"
      >
        {{ day.date.getDate() }}
      </button>
    </div>

    <!-- Legend -->
    <div class="mt-4 flex items-center justify-center space-x-4 text-xs text-gray-500">
      <div class="flex items-center space-x-1">
        <div class="w-3 h-3 bg-blue-600 rounded"></div>
        <span>Geselecteerd</span>
      </div>
      <div class="flex items-center space-x-1">
        <div class="w-3 h-3 bg-blue-100 rounded"></div>
        <span>Vandaag</span>
      </div>
      <div class="flex items-center space-x-1">
        <div class="w-3 h-3 bg-gray-100 rounded"></div>
        <span>Beschikbaar</span>
      </div>
    </div>
  </div>
</template>
