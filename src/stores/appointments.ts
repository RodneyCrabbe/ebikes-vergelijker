import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Appointment, CreateAppointmentData, AvailableDate, TimeSlot } from '../types/appointment'
import { useLocationStore } from './location'
import type { Dealer } from '../data/locations'

// Local storage key
const STORAGE_KEY = 'ebike-appointments'

// Helper functions for localStorage
function getStoredAppointments(): Appointment[] {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

function saveAppointments(appointments: Appointment[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments))
}

export const useAppointmentStore = defineStore('appointments', () => {
  const appointments = ref<Appointment[]>(getStoredAppointments())
  const availableDates = ref<AvailableDate[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const selectedDealer = ref<Dealer | null>(null)

  // Generate available time slots for the next 30 days
  const generateTimeSlots = () => {
    const slots: AvailableDate[] = []
    const today = new Date()

    // Get existing appointments to mark slots as unavailable
    const existingAppointments = getStoredAppointments()

    for (let i = 1; i <= 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)

      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue

      const dateString = date.toISOString().split('T')[0]
      const timeSlots: TimeSlot[] = []
      const startHour = 9
      const endHour = 17

      for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`

          // Check if this slot is already booked
          const isBooked = existingAppointments.some(
            apt => apt.date === dateString && apt.time === timeString
          )

          timeSlots.push({
            time: timeString,
            available: !isBooked
          })
        }
      }

      slots.push({
        date: dateString,
        time_slots: timeSlots
      })
    }

    return slots
  }

  async function fetchAppointments() {
    loading.value = true
    error.value = null

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))

      // Get current user
      const currentUser = localStorage.getItem('ebike-current-user')
      const user = currentUser ? JSON.parse(currentUser) : null

      if (!user) {
        appointments.value = []
        return
      }

      // Get appointments for current user
      const allAppointments = getStoredAppointments()
      appointments.value = allAppointments.filter(apt => apt.user_id === user.id)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch appointments'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function createAppointment(data: CreateAppointmentData) {
    loading.value = true
    error.value = null

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))

      // Get current user
      const currentUser = localStorage.getItem('ebike-current-user')
      const user = currentUser ? JSON.parse(currentUser) : null

      if (!user) {
        throw new Error('Must be logged in to create an appointment')
      }

      const newAppointment: Appointment = {
        id: crypto.randomUUID(),
        user_id: user.id,
        user_name: user.name || 'User',
        user_email: user.email,
        user_phone: data.phone || '',
        ebike_id: data.ebike_id,
        ebike_brand: '',
        ebike_model: '',
        dealer_id: data.dealer_id || '',
        dealer_name: data.dealer_name || '',
        dealer_address: data.dealer_address || '',
        date: data.date,
        time: data.time,
        service_type: data.service_type || 'Test Ride',
        notes: data.notes || '',
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      // Add to appointments
      const allAppointments = getStoredAppointments()
      allAppointments.push(newAppointment)
      saveAppointments(allAppointments)

      // Update local state
      appointments.value.push(newAppointment)

      console.log('[Appointment] Created successfully:', newAppointment.id)

      return newAppointment
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to create appointment'
      console.error('[Appointment] Creation failed:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateAppointment(id: string, updates: Partial<Appointment>) {
    loading.value = true
    error.value = null

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))

      const allAppointments = getStoredAppointments()
      const index = allAppointments.findIndex(apt => apt.id === id)

      if (index === -1) {
        throw new Error('Appointment not found')
      }

      // Update the appointment
      allAppointments[index] = {
        ...allAppointments[index],
        ...updates,
        updated_at: new Date().toISOString()
      }

      saveAppointments(allAppointments)

      // Update local state
      const localIndex = appointments.value.findIndex(apt => apt.id === id)
      if (localIndex !== -1) {
        appointments.value[localIndex] = { ...appointments.value[localIndex], ...allAppointments[index] }
      }

      return allAppointments[index]
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to update appointment'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function cancelAppointment(id: string) {
    return updateAppointment(id, { status: 'cancelled' })
  }

  async function deleteAppointment(id: string) {
    loading.value = true
    error.value = null

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200))

      const allAppointments = getStoredAppointments()
      const filteredAppointments = allAppointments.filter(apt => apt.id !== id)
      saveAppointments(filteredAppointments)

      // Remove from local state
      appointments.value = appointments.value.filter(apt => apt.id !== id)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to delete appointment'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchAvailableSlots(dealerId?: string) {
    loading.value = true
    error.value = null

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200))

      availableDates.value = generateTimeSlots()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch available slots'
      throw e
    } finally {
      loading.value = false
    }
  }

  function setSelectedDealer(dealer: Dealer | null) {
    selectedDealer.value = dealer
  }

  return {
    appointments,
    availableDates,
    loading,
    error,
    selectedDealer,
    fetchAppointments,
    createAppointment,
    updateAppointment,
    cancelAppointment,
    deleteAppointment,
    fetchAvailableSlots,
    setSelectedDealer,
    generateTimeSlots
  }
})
