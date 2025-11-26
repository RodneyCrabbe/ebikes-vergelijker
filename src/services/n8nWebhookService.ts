/**
 * N8N Webhook Service
 * Handles sending appointment data to N8N for automation
 */

export interface N8NAppointmentPayload {
  // Appointment Details
  appointment_id: string
  appointment_type: 'test_drive' | 'purchase_consultation' | 'repair_service'
  appointment_date: string
  appointment_time: string
  appointment_duration: number
  status: string
  notes?: string

  // Customer Information
  customer: {
    first_name: string
    last_name: string
    full_name: string
    email: string
    phone: string
  }

  // E-Bike Information (if applicable)
  ebike?: {
    id: string
    brand: string
    model_name: string
    price: number
    image_url?: string
  }

  // Dealer/Location Information
  dealer: {
    id: string
    name: string
    address: string
    city: string
    postal_code: string
    phone: string
    email: string
    coordinates?: {
      lat: number
      lng: number
    }
  }

  // Metadata
  created_at: string
  formatted_date: string
  formatted_time: string
  appointment_type_label: string
}

class N8NWebhookService {
  private webhookUrl: string

  constructor() {
    this.webhookUrl = import.meta.env.VITE_N8N_APPOINTMENT_WEBHOOK_URL || ''
  }

  /**
   * Check if webhook is configured
   */
  isConfigured(): boolean {
    return this.webhookUrl !== '' &&
           !this.webhookUrl.includes('your-n8n-instance.com') &&
           this.webhookUrl.startsWith('http')
  }

  /**
   * Format date to readable format (Dutch)
   */
  private formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('nl-NL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  /**
   * Format time to readable format
   */
  private formatTime(timeString: string): string {
    const [hours, minutes] = timeString.split(':').map(Number)
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  }

  /**
   * Get appointment type label
   */
  private getAppointmentTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      'test_drive': 'Proefrit',
      'purchase_consultation': 'Aankoopadvies',
      'repair_service': 'Reparatie & Service'
    }
    return labels[type] || type
  }

  /**
   * Send appointment data to N8N webhook
   */
  async sendAppointment(appointmentData: any): Promise<{ success: boolean; error?: string }> {
    if (!this.isConfigured()) {
      console.warn('⚠️ N8N webhook is not configured. Skipping webhook call.')
      return { success: false, error: 'Webhook not configured' }
    }

    try {
      // Prepare payload
      const payload: N8NAppointmentPayload = {
        appointment_id: appointmentData.id,
        appointment_type: appointmentData.type,
        appointment_date: appointmentData.date,
        appointment_time: appointmentData.time,
        appointment_duration: appointmentData.duration,
        status: appointmentData.status,
        notes: appointmentData.notes,

        customer: {
          first_name: appointmentData.customer_info?.first_name || appointmentData.guest_name?.split(' ')[0] || '',
          last_name: appointmentData.customer_info?.last_name || appointmentData.guest_name?.split(' ').slice(1).join(' ') || '',
          full_name: appointmentData.customer_info
            ? `${appointmentData.customer_info.first_name} ${appointmentData.customer_info.last_name}`
            : appointmentData.guest_name || '',
          email: appointmentData.customer_info?.email || appointmentData.guest_email || '',
          phone: appointmentData.customer_info?.phone || ''
        },

        ebike: appointmentData.ebikes ? {
          id: appointmentData.ebikes.id,
          brand: appointmentData.ebikes.brand,
          model_name: appointmentData.ebikes.model_name,
          price: appointmentData.ebikes.price,
          image_url: appointmentData.ebikes.image_url
        } : undefined,

        dealer: {
          id: appointmentData.dealer_id,
          name: appointmentData.location?.name || '',
          address: appointmentData.location?.address || '',
          city: appointmentData.location?.city || '',
          postal_code: appointmentData.location?.postal_code || '',
          phone: appointmentData.location?.phone || '',
          email: appointmentData.location?.email || '',
          coordinates: appointmentData.location?.coordinates
        },

        created_at: appointmentData.created_at || new Date().toISOString(),
        formatted_date: this.formatDate(appointmentData.date),
        formatted_time: this.formatTime(appointmentData.time),
        appointment_type_label: this.getAppointmentTypeLabel(appointmentData.type)
      }

      console.log('📤 Sending appointment to N8N webhook:', {
        url: this.webhookUrl,
        appointment_id: payload.appointment_id,
        customer_email: payload.customer.email
      })

      // Send to N8N
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`N8N webhook failed: ${response.status} ${response.statusText} - ${errorText}`)
      }

      const result = await response.json().catch(() => ({}))

      console.log('✅ N8N webhook successful:', result)

      return { success: true }

    } catch (error) {
      console.error('❌ N8N webhook error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Test webhook connection
   */
  async testConnection(): Promise<{ success: boolean; error?: string }> {
    if (!this.isConfigured()) {
      return { success: false, error: 'Webhook not configured' }
    }

    try {
      const testPayload = {
        test: true,
        message: 'Test connection from E-Bike Platform',
        timestamp: new Date().toISOString()
      }

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testPayload)
      })

      if (!response.ok) {
        throw new Error(`Connection test failed: ${response.status}`)
      }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}

// Export singleton instance
export const n8nWebhookService = new N8NWebhookService()
