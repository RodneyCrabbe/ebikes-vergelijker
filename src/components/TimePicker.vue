<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Props {
  selectedTime: string
  selectedDate?: string
  selectedLocation?: string
  appointmentType?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:selectedTime': [time: string]
}>()

const selectedTime = ref(props.selectedTime)

const timeSlots = computed(() => {
  const slots = []
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      slots.push({
        time: timeString,
        display: timeString,
        available: true // In a real app, this would check against existing appointments and location hours
      })
    }
  }
  return slots
})

const selectTime = (time: string) => {
  selectedTime.value = time
  emit('update:selectedTime', time)
}

// Watch for external changes to selectedTime
watch(() => props.selectedTime, (newTime) => {
  if (newTime && newTime !== selectedTime.value) {
    selectedTime.value = newTime
  }
})

const formatTimeDisplay = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
}

const isTimeInRange = (time: string, startTime: string, endTime: string) => {
  const timeMinutes = time.split(':').map(Number).reduce((acc, val, i) => acc + val * (i === 0 ? 60 : 1), 0)
  const startMinutes = startTime.split(':').map(Number).reduce((acc, val, i) => acc + val * (i === 0 ? 60 : 1), 0)
  const endMinutes = endTime.split(':').map(Number).reduce((acc, val, i) => acc + val * (i === 0 ? 60 : 1), 0)
  
  return timeMinutes >= startMinutes && timeMinutes < endMinutes
}

const getTimePeriods = () => {
  return [
    { name: 'Nacht', start: '00:00', end: '06:00', color: 'bg-gray-100' },
    { name: 'Ochtend', start: '06:00', end: '12:00', color: 'bg-yellow-100' },
    { name: 'Middag', start: '12:00', end: '18:00', color: 'bg-orange-100' },
    { name: 'Avond', start: '18:00', end: '24:00', color: 'bg-blue-100' }
  ]
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow-lg p-6">
    <h3 class="text-xl font-bold mb-4">Kies een tijd</h3>
    
    <!-- Time Periods -->
    <div class="mb-6">
      <div class="grid grid-cols-4 gap-2 mb-4">
        <div 
          v-for="period in getTimePeriods()" 
          :key="period.name"
          :class="['p-2 rounded-lg text-center text-sm font-medium', period.color]"
        >
          {{ period.name }}
        </div>
      </div>
    </div>

    <!-- Time Slots Grid -->
    <div class="max-h-96 overflow-y-auto">
      <div class="grid grid-cols-6 gap-2">
        <button
          v-for="slot in timeSlots"
          :key="slot.time"
          @click="selectTime(slot.time)"
          :disabled="!slot.available"
          :class="[
            'p-3 rounded-lg text-sm font-medium transition-all text-center border-2',
            slot.available
              ? selectedTime === slot.time
                ? 'bg-blue-600 text-white border-blue-700 font-semibold'
                : 'bg-gray-200 text-gray-800 hover:bg-blue-100 border-gray-300 hover:border-blue-300'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
          ]"
        >
          <div class="text-xs">{{ slot.display }}</div>
          <div class="text-xs opacity-75">{{ formatTimeDisplay(slot.time) }}</div>
        </button>
      </div>
    </div>

    <!-- Selected Time Display -->
    <div v-if="selectedTime" class="mt-4 p-3 bg-blue-100 rounded-lg border-2 border-blue-300">
      <div class="text-center">
        <div class="text-sm text-gray-600">Geselecteerde tijd:</div>
        <div class="text-lg font-semibold text-blue-700">
          {{ selectedTime }} ({{ formatTimeDisplay(selectedTime) }})
        </div>
      </div>
    </div>

    <!-- Quick Time Buttons -->
    <div class="mt-4">
      <div class="text-sm font-semibold text-gray-700 mb-2">Snelle selectie:</div>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="quickTime in ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']"
          :key="quickTime"
          @click="selectTime(quickTime)"
          :class="[
            'px-3 py-1 rounded-lg text-sm font-medium transition-all border-2',
            selectedTime === quickTime
              ? 'bg-blue-600 text-white border-blue-700 font-semibold'
              : 'bg-gray-200 text-gray-800 hover:bg-blue-100 border-gray-300 hover:border-blue-300'
          ]"
        >
          {{ quickTime }}
        </button>
      </div>
    </div>
  </div>
</template>
