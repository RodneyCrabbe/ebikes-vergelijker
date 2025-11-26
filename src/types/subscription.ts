export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number
  currency: string
  interval: 'monthly' | 'yearly'
  features: string[]
  limits: {
    saved_bikes: number
    comparisons: number
    price_alerts: number
    ai_chat_messages: number
    export_reports: boolean
    priority_support: boolean
    ad_free: boolean
  }
  popular?: boolean
}

export interface UserSubscription {
  id: string
  user_id: string
  plan_id: string
  status: 'active' | 'cancelled' | 'past_due' | 'unpaid'
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
  created_at: string
  updated_at: string
}

export interface SubscriptionFeature {
  id: string
  name: string
  description: string
  icon: string
  category: 'core' | 'premium' | 'advanced'
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Gratis',
    description: 'Perfect voor het verkennen van e-bikes',
    price: 0,
    currency: 'EUR',
    interval: 'monthly',
    features: [
      'Basis e-bike vergelijking',
      '3 opgeslagen e-bikes',
      'Standaard AI chat',
      'Basis zoekfilters',
      'E-bike reviews bekijken'
    ],
    limits: {
      saved_bikes: 3,
      comparisons: 5,
      price_alerts: 0,
      ai_chat_messages: 10,
      export_reports: false,
      priority_support: false,
      ad_free: false
    }
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Voor serieuze e-bike kopers',
    price: 9.99,
    currency: 'EUR',
    interval: 'monthly',
    features: [
      'Onbeperkt opgeslagen e-bikes',
      'Onbeperkte vergelijkingen',
      'Prijsalerts voor 20+ e-bikes',
      'Uitgebreide AI chat met context',
      'Geavanceerde zoekfilters',
      'Export vergelijkingen naar PDF',
      'Ad-vrije ervaring',
      'Prioriteit support',
      'Vroege toegang tot nieuwe e-bikes'
    ],
    limits: {
      saved_bikes: -1, // unlimited
      comparisons: -1, // unlimited
      price_alerts: 20,
      ai_chat_messages: -1, // unlimited
      export_reports: true,
      priority_support: true,
      ad_free: true
    },
    popular: true
  },
  {
    id: 'premium_yearly',
    name: 'Premium (Jaarlijks)',
    description: 'Bespaar 20% met jaarlijkse betaling',
    price: 95.99,
    currency: 'EUR',
    interval: 'yearly',
    features: [
      'Onbeperkt opgeslagen e-bikes',
      'Onbeperkte vergelijkingen',
      'Prijsalerts voor 20+ e-bikes',
      'Uitgebreide AI chat met context',
      'Geavanceerde zoekfilters',
      'Export vergelijkingen naar PDF',
      'Ad-vrije ervaring',
      'Prioriteit support',
      'Vroege toegang tot nieuwe e-bikes',
      '20% korting op jaarlijkse betaling'
    ],
    limits: {
      saved_bikes: -1, // unlimited
      comparisons: -1, // unlimited
      price_alerts: 20,
      ai_chat_messages: -1, // unlimited
      export_reports: true,
      priority_support: true,
      ad_free: true
    }
  }
]

export const SUBSCRIPTION_FEATURES: SubscriptionFeature[] = [
  {
    id: 'saved_bikes',
    name: 'Opgeslagen E-bikes',
    description: 'Bewaar je favoriete e-bikes voor later',
    icon: '💾',
    category: 'core'
  },
  {
    id: 'comparisons',
    name: 'Vergelijkingen',
    description: 'Vergelijk e-bikes side-by-side',
    icon: '⚖️',
    category: 'core'
  },
  {
    id: 'price_alerts',
    name: 'Prijsalerts',
    description: 'Krijg notificaties bij prijsdalingen',
    icon: '🔔',
    category: 'premium'
  },
  {
    id: 'ai_chat',
    name: 'AI Chat',
    description: 'Persoonlijke e-bike assistent',
    icon: '🤖',
    category: 'core'
  },
  {
    id: 'export_reports',
    name: 'Export Rapporten',
    description: 'Export vergelijkingen naar PDF',
    icon: '📄',
    category: 'premium'
  },
  {
    id: 'priority_support',
    name: 'Prioriteit Support',
    description: 'Snellere reactietijden op vragen',
    icon: '⚡',
    category: 'premium'
  },
  {
    id: 'ad_free',
    name: 'Ad-vrij',
    description: 'Bekijk e-bikes zonder advertenties',
    icon: '🚫',
    category: 'premium'
  },
  {
    id: 'advanced_filters',
    name: 'Geavanceerde Filters',
    description: 'Meer zoekopties en filters',
    icon: '🔍',
    category: 'premium'
  },
  {
    id: 'early_access',
    name: 'Vroege Toegang',
    description: 'Eerste toegang tot nieuwe e-bikes',
    icon: '⭐',
    category: 'advanced'
  }
]
