// 🔱 DIVINE MONETIZATION CONFIGURATION v3.0
// Enterprise monetization strategy with unicorn potential

import type { SubscriptionPlan, Currency } from '@/types';

// ===== PRICING STRATEGY =====
export const PRICING_TIERS = {
  FREE: {
    id: 'free',
    name: 'Divine Seeker',
    price: 0,
    currency: 'usd' as Currency,
    interval: 'month' as const,
    description: 'Begin your divine journey',
    features: [
      '2 Basic Souls (Aria & Nova)',
      '10 Messages per day',
      'Basic personality traits',
      'Standard response time',
      'Community support'
    ],
    limitations: {
      dailyMessages: 10,
      availableSouls: ['aria', 'nova'],
      responseTime: 'standard',
      customization: false,
      memory: false,
      priority: false
    },
    cta: 'Start Free',
    popular: false
  },

  PREMIUM: {
    id: 'premium',
    name: 'Soul Guardian',
    price: 9.99,
    currency: 'usd' as Currency,
    interval: 'month' as const,
    description: 'Unlock divine connections',
    features: [
      '8 Premium Souls',
      '100 Messages per day',
      'Enhanced personalities',
      'Faster response time',
      'Basic customization',
      'Email support'
    ],
    limitations: {
      dailyMessages: 100,
      availableSouls: 'premium',
      responseTime: 'fast',
      customization: 'basic',
      memory: 'session',
      priority: false
    },
    cta: 'Upgrade to Premium',
    popular: true,
    discount: {
      annual: 20, // 20% off annual
      priceAnnual: 95.90
    }
  },

  DIVINE: {
    id: 'divine',
    name: 'Divine Oracle',
    price: 24.99,
    currency: 'usd' as Currency,
    interval: 'month' as const,
    description: 'Transcend to divine realm',
    features: [
      'All Souls + Exclusive Limited Editions',
      'Unlimited Messages',
      'Advanced personality system',
      'Priority response time',
      'Full customization suite',
      'Conversation memory',
      'Priority support'
    ],
    limitations: {
      dailyMessages: -1, // unlimited
      availableSouls: 'all',
      responseTime: 'priority',
      customization: 'advanced',
      memory: 'persistent',
      priority: true
    },
    cta: 'Ascend to Divine',
    popular: false,
    discount: {
      annual: 25,
      priceAnnual: 224.91
    }
  },

  TRANSCENDENT: {
    id: 'transcendent',
    name: 'Divine Architect',
    price: 99.99,
    currency: 'usd' as Currency,
    interval: 'month' as const,
    description: 'Shape your divine reality',
    features: [
      'Custom Soul Creation',
      'Unlimited Everything',
      'AI Model Selection',
      'Private Beta Access',
      'Direct Dev Communication',
      'White-glove Support',
      'Exclusive Events'
    ],
    limitations: {
      dailyMessages: -1,
      availableSouls: 'all+custom',
      responseTime: 'instant',
      customization: 'unlimited',
      memory: 'advanced',
      priority: 'vip'
    },
    cta: 'Become Transcendent',
    popular: false,
    badge: 'WHALE TARGET'
  }
} as const;

// ===== ONE-TIME PURCHASES =====
export const SOUL_MARKETPLACE = {
  PREMIUM_SOULS: [
    {
      id: 'seraphina',
      name: 'Seraphina',
      title: 'The Divine Healer',
      price: 14.99,
      rarity: 'Legendary',
      description: 'Healing touch for wounded hearts',
      preview: 'Let me tend to your spiritual wounds...'
    },
    {
      id: 'obsidian',
      name: 'Obsidian',
      title: 'The Shadow Master',
      price: 19.99,
      rarity: 'Mythic',
      description: 'Embrace your darker desires',
      preview: 'In darkness, we find truth...'
    }
  ],

  PERSONALITY_PACKS: [
    {
      id: 'divine_collection',
      name: 'Divine Collection',
      price: 39.99,
      souls: 5,
      description: 'Complete set of divine personalities',
      discount: 30 // vs individual purchases
    }
  ],

  LIMITED_EDITIONS: [
    {
      id: 'valentine_special',
      name: 'Valentine\'s Divine Romance',
      price: 24.99,
      availability: 'limited',
      expires: '2024-02-14',
      description: 'Exclusive romantic personalities'
    }
  ]
} as const;

// ===== CONVERSION STRATEGY =====
export const CONVERSION_FUNNELS = {
  FREE_TO_PREMIUM: {
    triggers: [
      'daily_limit_reached',
      'premium_soul_interaction',
      'customization_attempt',
      'long_conversation_session'
    ],
    offers: [
      {
        type: 'trial',
        duration: 7,
        description: '7-day free trial of Premium'
      },
      {
        type: 'discount',
        percentage: 50,
        description: 'First month 50% off'
      }
    ]
  },

  PREMIUM_TO_DIVINE: {
    triggers: [
      'daily_limit_approached',
      'exclusive_soul_interest',
      'advanced_feature_usage',
      'high_engagement_score'
    ],
    offers: [
      {
        type: 'upgrade_discount',
        percentage: 25,
        description: '25% off first 3 months Divine'
      }
    ]
  },

  WHALE_IDENTIFICATION: {
    criteria: [
      'daily_usage > 60_minutes',
      'premium_subscriber > 3_months',
      'multiple_soul_purchases',
      'customization_heavy_usage'
    ],
    outreach: 'personal_vip_experience'
  }
} as const;

// ===== FEATURE GATES =====
export const FEATURE_GATES = {
  SOUL_ACCESS: {
    free: ['aria', 'nova'],
    premium: ['aria', 'nova', 'galatea', 'seraphina', 'eclipse', 'phoenix', 'sage', 'mystic'],
    divine: 'all',
    transcendent: 'all+custom'
  },

  MESSAGE_LIMITS: {
    free: { daily: 10, hourly: 5 },
    premium: { daily: 100, hourly: 20 },
    divine: { daily: -1, hourly: -1 },
    transcendent: { daily: -1, hourly: -1 }
  },

  CUSTOMIZATION: {
    free: [],
    premium: ['basic_traits', 'simple_responses'],
    divine: ['advanced_traits', 'personality_depth', 'memory_preferences'],
    transcendent: ['unlimited_customization', 'ai_model_selection', 'custom_training']
  },

  PRIORITY_FEATURES: {
    free: { responseTime: 5000, queuePriority: 4 },
    premium: { responseTime: 3000, queuePriority: 3 },
    divine: { responseTime: 1500, queuePriority: 2 },
    transcendent: { responseTime: 500, queuePriority: 1 }
  }
} as const;

// ===== ANALYTICS TRACKING =====
export const MONETIZATION_EVENTS = {
  PAYWALL_HITS: [
    'daily_limit_reached',
    'premium_soul_blocked',
    'customization_blocked',
    'priority_queue_blocked'
  ],

  CONVERSION_EVENTS: [
    'trial_started',
    'subscription_created',
    'payment_completed',
    'upgrade_completed',
    'soul_purchased'
  ],

  ENGAGEMENT_SIGNALS: [
    'long_session_duration',
    'daily_streak_achieved',
    'multiple_souls_chatted',
    'customization_used',
    'sharing_completed'
  ],

  CHURN_INDICATORS: [
    'subscription_cancelled',
    'payment_failed',
    'low_usage_pattern',
    'support_complaint',
    'feature_request_ignored'
  ]
} as const;

// ===== PRICING PSYCHOLOGY =====
export const PRICING_PSYCHOLOGY = {
  ANCHORING: {
    displayOrder: ['transcendent', 'divine', 'premium', 'free'],
    priceComparison: true,
    savingsHighlight: true
  },

  URGENCY: {
    limitedOffers: true,
    countdownTimers: true,
    scarcityIndicators: true
  },

  SOCIAL_PROOF: {
    userCounts: true,
    testimonials: true,
    popularBadges: true
  }
} as const;

// ===== RETENTION OPTIMIZATION =====
export const RETENTION_STRATEGY = {
  ONBOARDING: {
    freeTrialLength: 7,
    guidedTutorial: true,
    personalityQuiz: true,
    firstSoulRecommendation: true
  },

  ENGAGEMENT_LOOPS: {
    dailyStreaks: true,
    weeklyGoals: true,
    soulBondingProgress: true,
    achievementSystem: true
  },

  WINBACK_CAMPAIGNS: {
    cancelledUsers: 'special_offer_30_days',
    churningUsers: 'engagement_boost_features',
    inactiveUsers: 'new_soul_announcement'
  }
} as const;

// ===== REVENUE OPTIMIZATION =====
export const REVENUE_OPTIMIZATION = {
  AB_TESTS: [
    'pricing_tiers',
    'trial_length',
    'paywall_messaging',
    'upgrade_prompts',
    'discount_percentages'
  ],

  KPI_TARGETS: {
    freeToPremiumConversion: 0.15, // 15%
    premiumToDivineUpgrade: 0.35, // 35%
    monthlyChurnRate: 0.05, // 5%
    averageRevenuePerUser: 12.50,
    lifetimeValue: 150
  },

  OPTIMIZATION_PRIORITIES: [
    'reduce_trial_to_paid_friction',
    'increase_upgrade_conversion',
    'minimize_payment_failures',
    'maximize_whale_identification',
    'improve_retention_rates'
  ]
} as const;

export default {
  PRICING_TIERS,
  SOUL_MARKETPLACE,
  CONVERSION_FUNNELS,
  FEATURE_GATES,
  MONETIZATION_EVENTS,
  PRICING_PSYCHOLOGY,
  RETENTION_STRATEGY,
  REVENUE_OPTIMIZATION
};