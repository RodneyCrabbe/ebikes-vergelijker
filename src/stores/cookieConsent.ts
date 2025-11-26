import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface CookieCategory {
  key: string
  label: string
  required: boolean
  enabled: boolean
  description: string
  cookies: Array<{
    name: string
    provider: string
    retention: string
    purpose: string
  }>
}

export interface CookieConsent {
  necessary: boolean
  preferences: boolean
  analytics: boolean
  marketing: boolean
  support: boolean
  timestamp: number
  version: string
}

export const useCookieConsentStore = defineStore('cookieConsent', () => {
  const consent = ref<CookieConsent | null>(null)
  const showBanner = ref(false)
  const showSettings = ref(false)

  const cookieCategories: CookieCategory[] = [
    {
      key: 'necessary',
      label: 'Noodzakelijk',
      required: true,
      enabled: true,
      description: 'Zorgt dat de site werkt en veilig is (sessies, beveiliging, load-balancing, cookie-keuzes). Geen toestemming vereist; we informeren je wel.',
      cookies: [
        { name: 'session_id', provider: 'first-party', retention: 'Sessie', purpose: 'Sessiebeheer' },
        { name: 'csrf_token', provider: 'first-party', retention: 'Sessie', purpose: 'Beveiliging (CSRF)' },
        { name: 'consent_choice', provider: 'first-party', retention: '6–12 maanden', purpose: 'Onthoudt cookievoorkeur' },
        { name: 'favorites_id', provider: 'first-party', retention: '12 maanden', purpose: 'Favoriete e-bikes opslaan' }
      ]
    },
    {
      key: 'preferences',
      label: 'Voorkeuren / Functional',
      required: false,
      enabled: false,
      description: 'Onthoudt taal, regio en weergave-instellingen.',
      cookies: [
        { name: 'locale', provider: 'first-party', retention: '12 maanden', purpose: 'Taal/land' },
        { name: 'view_mode', provider: 'first-party', retention: '12 maanden', purpose: 'Weergave (grid/lijst)' }
      ]
    },
    {
      key: 'analytics',
      label: 'Analytics',
      required: false,
      enabled: false,
      description: 'Helpt ons de site te verbeteren met geaggregeerde statistiek.',
      cookies: [
        { name: '_ga', provider: 'Google Analytics 4 (optioneel)', retention: '2 jaar', purpose: 'Bezoekersstatistiek' },
        { name: '_ga_*', provider: 'Google Analytics 4 (optioneel)', retention: '2 jaar', purpose: 'Sessies meten' }
      ]
    },
    {
      key: 'marketing',
      label: 'Marketing / Advertenties',
      required: false,
      enabled: false,
      description: 'Advertentiemeting, remarketing en affiliate-tracking (alleen met toestemming).',
      cookies: [
        { name: '_gcl_au', provider: 'Google Ads (optioneel)', retention: '3 maanden', purpose: 'Advertentiemeting' },
        { name: '_fbp', provider: 'Meta (optioneel)', retention: '3 maanden', purpose: 'Remarketing' },
        { name: 'aw*_', provider: 'Affiliate netwerk (optioneel)', retention: '30–60 dagen', purpose: 'Affiliate-attributie' }
      ]
    },
    {
      key: 'support',
      label: 'Support / Chat / UX',
      required: false,
      enabled: false,
      description: 'Klantenchat, feedback en UX-metingen.',
      cookies: [
        { name: 'intercom-id-*', provider: 'Intercom (optioneel)', retention: '9 maanden', purpose: 'Klantenchat' }
      ]
    }
  ]

  const hasConsent = computed(() => consent.value !== null)
  const isConsentGiven = computed(() => (category: string) => {
    if (!consent.value) return false
    return consent.value[category as keyof CookieConsent] === true
  })

  function initialize() {
    const storedConsent = localStorage.getItem('cookie-consent')
    if (storedConsent) {
      try {
        consent.value = JSON.parse(storedConsent)
        showBanner.value = false
        loadScripts()
      } catch (error) {
        console.error('Error parsing stored consent:', error)
        showBanner.value = true
      }
    } else {
      showBanner.value = true
    }
  }

  function acceptAll() {
    const newConsent: CookieConsent = {
      necessary: true,
      preferences: true,
      analytics: true,
      marketing: true,
      support: true,
      timestamp: Date.now(),
      version: '1.0'
    }
    saveConsent(newConsent)
  }

  function rejectAll() {
    const newConsent: CookieConsent = {
      necessary: true, // Always true as it's required
      preferences: false,
      analytics: false,
      marketing: false,
      support: false,
      timestamp: Date.now(),
      version: '1.0'
    }
    saveConsent(newConsent)
  }

  function saveCustomConsent(customConsent: Partial<CookieConsent>) {
    const newConsent: CookieConsent = {
      necessary: true, // Always true
      preferences: customConsent.preferences || false,
      analytics: customConsent.analytics || false,
      marketing: customConsent.marketing || false,
      support: customConsent.support || false,
      timestamp: Date.now(),
      version: '1.0'
    }
    saveConsent(newConsent)
  }

  function saveConsent(newConsent: CookieConsent) {
    consent.value = newConsent
    localStorage.setItem('cookie-consent', JSON.stringify(newConsent))
    showBanner.value = false
    showSettings.value = false
    loadScripts()
  }

  function loadScripts() {
    if (!consent.value) return

    // Import and use script blocker
    import('../utils/scriptBlocker').then(({ loadConsentedScripts }) => {
      loadConsentedScripts()
    })
  }

  function openSettings() {
    showSettings.value = true
  }

  function closeSettings() {
    showSettings.value = false
  }

  function withdrawConsent() {
    localStorage.removeItem('cookie-consent')
    consent.value = null
    showBanner.value = true
    showSettings.value = false
  }

  return {
    consent,
    showBanner,
    showSettings,
    cookieCategories,
    hasConsent,
    isConsentGiven,
    initialize,
    acceptAll,
    rejectAll,
    saveCustomConsent,
    openSettings,
    closeSettings,
    withdrawConsent
  }
})
