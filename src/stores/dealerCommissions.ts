// Enhanced Dealer Commissions Store
// Commission tracking and payment management for dealers

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'
import type { DealerCommission } from '../types/dealerEnhanced'

export const useDealerCommissionsStore = defineStore('dealerCommissions', () => {
  // State
  const commissions = ref<DealerCommission[]>([])
  const currentCommission = ref<DealerCommission | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filters = ref({
    status: '',
    commission_type: '',
    date_from: '',
    date_to: ''
  })

  // Computed
  const filteredCommissions = computed(() => {
    let filtered = commissions.value

    if (filters.value.status) {
      filtered = filtered.filter(commission => commission.status === filters.value.status)
    }

    if (filters.value.commission_type) {
      filtered = filtered.filter(commission => commission.commission_type === filters.value.commission_type)
    }

    if (filters.value.date_from) {
      filtered = filtered.filter(commission => 
        new Date(commission.created_at) >= new Date(filters.value.date_from)
      )
    }

    if (filters.value.date_to) {
      filtered = filtered.filter(commission => 
        new Date(commission.created_at) <= new Date(filters.value.date_to)
      )
    }

    return filtered
  })

  const commissionsByStatus = computed(() => {
    const statusCounts: Record<string, number> = {}
    commissions.value.forEach(commission => {
      statusCounts[commission.status] = (statusCounts[commission.status] || 0) + 1
    })
    return statusCounts
  })

  const commissionsByType = computed(() => {
    const typeCounts: Record<string, number> = {}
    commissions.value.forEach(commission => {
      typeCounts[commission.commission_type] = (typeCounts[commission.commission_type] || 0) + 1
    })
    return typeCounts
  })

  const totalEarned = computed(() => 
    commissions.value
      .filter(commission => commission.status === 'paid')
      .reduce((sum, commission) => sum + commission.total_amount, 0)
  )

  const totalPending = computed(() => 
    commissions.value
      .filter(commission => commission.status === 'pending')
      .reduce((sum, commission) => sum + commission.total_amount, 0)
  )

  const totalApproved = computed(() => 
    commissions.value
      .filter(commission => commission.status === 'approved')
      .reduce((sum, commission) => sum + commission.total_amount, 0)
  )

  const monthlyEarnings = computed(() => {
    const monthly: Record<string, number> = {}
    commissions.value
      .filter(commission => commission.status === 'paid')
      .forEach(commission => {
        const month = new Date(commission.paid_at || commission.created_at).toISOString().substring(0, 7)
        monthly[month] = (monthly[month] || 0) + commission.total_amount
      })
    return monthly
  })

  const averageCommission = computed(() => {
    const paidCommissions = commissions.value.filter(commission => commission.status === 'paid')
    if (paidCommissions.length === 0) return 0
    const total = paidCommissions.reduce((sum, commission) => sum + commission.total_amount, 0)
    return total / paidCommissions.length
  })

  // Actions
  async function fetchCommissions(dealerId: string) {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('dealer_commissions')
        .select('*')
        .eq('dealer_id', dealerId)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      commissions.value = data || []
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch commissions'
      console.error('Error fetching commissions:', e)
    } finally {
      loading.value = false
    }
  }

  async function fetchCommission(id: string) {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('dealer_commissions')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError) throw fetchError

      currentCommission.value = data
      return data
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch commission'
      console.error('Error fetching commission:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function createCommission(
    dealerId: string,
    leadId: string,
    inventoryId: string,
    commissionData: {
      commission_type: DealerCommission['commission_type']
      base_amount: number
      commission_rate: number
      bonus_amount?: number
      notes?: string
    }
  ) {
    loading.value = true
    error.value = null

    try {
      const calculatedAmount = commissionData.base_amount * commissionData.commission_rate
      const totalAmount = calculatedAmount + (commissionData.bonus_amount || 0)

      const newCommission = {
        dealer_id: dealerId,
        lead_id: leadId,
        inventory_id: inventoryId,
        commission_type: commissionData.commission_type,
        base_amount: commissionData.base_amount,
        commission_rate: commissionData.commission_rate,
        calculated_amount: calculatedAmount,
        bonus_amount: commissionData.bonus_amount || 0,
        total_amount: totalAmount,
        status: 'pending',
        notes: commissionData.notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data, error: insertError } = await supabase
        .from('dealer_commissions')
        .insert(newCommission)
        .select()
        .single()

      if (insertError) throw insertError

      commissions.value.unshift(data)
      return data
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to create commission'
      console.error('Error creating commission:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateCommission(id: string, updates: Partial<DealerCommission>) {
    loading.value = true
    error.value = null

    try {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString()
      }

      const { data, error: updateError } = await supabase
        .from('dealer_commissions')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (updateError) throw updateError

      const index = commissions.value.findIndex(commission => commission.id === id)
      if (index !== -1) {
        commissions.value[index] = data
      }

      if (currentCommission.value?.id === id) {
        currentCommission.value = data
      }

      return data
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to update commission'
      console.error('Error updating commission:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function approveCommission(id: string) {
    return updateCommission(id, { status: 'approved' })
  }

  async function payCommission(
    id: string, 
    paymentMethod: string, 
    paymentReference: string
  ) {
    return updateCommission(id, {
      status: 'paid',
      payment_method: paymentMethod,
      payment_reference: paymentReference,
      paid_at: new Date().toISOString()
    })
  }

  async function cancelCommission(id: string, reason?: string) {
    return updateCommission(id, {
      status: 'cancelled',
      notes: reason ? `${currentCommission.value?.notes || ''}\nCancelled: ${reason}`.trim() : currentCommission.value?.notes
    })
  }

  async function disputeCommission(id: string, reason: string) {
    return updateCommission(id, {
      status: 'disputed',
      notes: `${currentCommission.value?.notes || ''}\nDisputed: ${reason}`.trim()
    })
  }

  async function calculateCommission(
    baseAmount: number,
    commissionRate: number,
    bonusAmount: number = 0
  ): Promise<{ calculated: number; total: number }> {
    const calculated = baseAmount * commissionRate
    const total = calculated + bonusAmount
    return { calculated, total }
  }

  function setFilters(newFilters: Partial<typeof filters.value>) {
    filters.value = { ...filters.value, ...newFilters }
  }

  function clearFilters() {
    filters.value = {
      status: '',
      commission_type: '',
      date_from: '',
      date_to: ''
    }
  }

  function setCurrentCommission(commission: DealerCommission | null) {
    currentCommission.value = commission
  }

  // Commission calculation helpers
  function getCommissionRate(commissionType: DealerCommission['commission_type']): number {
    const rates: Record<DealerCommission['commission_type'], number> = {
      lead: 0.02, // 2% for leads
      conversion: 0.05, // 5% for conversions
      sale: 0.10, // 10% for sales
      referral: 0.03, // 3% for referrals
      bonus: 0.00 // Bonuses are fixed amounts
    }
    return rates[commissionType] || 0.05
  }

  function calculateTieredCommission(
    baseAmount: number,
    tiers: Array<{ min: number; max: number; rate: number }>
  ): number {
    let totalCommission = 0
    let remainingAmount = baseAmount

    for (const tier of tiers.sort((a, b) => a.min - b.min)) {
      if (remainingAmount <= 0) break

      const tierAmount = Math.min(remainingAmount, tier.max - tier.min)
      if (tierAmount > 0) {
        totalCommission += tierAmount * tier.rate
        remainingAmount -= tierAmount
      }
    }

    return totalCommission
  }

  // Export functions
  async function exportCommissions(format: 'csv' | 'excel' = 'csv') {
    try {
      const data = filteredCommissions.value.map(commission => ({
        'Commission ID': commission.id,
        'Type': commission.commission_type,
        'Base Amount': commission.base_amount,
        'Rate': `${(commission.commission_rate * 100).toFixed(2)}%`,
        'Calculated Amount': commission.calculated_amount,
        'Bonus Amount': commission.bonus_amount,
        'Total Amount': commission.total_amount,
        'Status': commission.status,
        'Payment Method': commission.payment_method || 'N/A',
        'Payment Reference': commission.payment_reference || 'N/A',
        'Paid At': commission.paid_at || 'N/A',
        'Created At': commission.created_at,
        'Notes': commission.notes || 'N/A'
      }))

      if (format === 'csv') {
        const csvContent = [
          Object.keys(data[0]).join(','),
          ...data.map(row => Object.values(row).map(value => `"${value}"`).join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `commissions-${new Date().toISOString().split('T')[0]}.csv`
        link.click()
        window.URL.revokeObjectURL(url)
      }

      return data
    } catch (e) {
      console.error('Error exporting commissions:', e)
      throw e
    }
  }

  return {
    // State
    commissions,
    currentCommission,
    loading,
    error,
    filters,

    // Computed
    filteredCommissions,
    commissionsByStatus,
    commissionsByType,
    totalEarned,
    totalPending,
    totalApproved,
    monthlyEarnings,
    averageCommission,

    // Actions
    fetchCommissions,
    fetchCommission,
    createCommission,
    updateCommission,
    approveCommission,
    payCommission,
    cancelCommission,
    disputeCommission,
    calculateCommission,
    setFilters,
    clearFilters,
    setCurrentCommission,
    getCommissionRate,
    calculateTieredCommission,
    exportCommissions
  }
})
