// UpsellTriggers.js — Emotional Manipulation → Financial Extraction Engine
// Every function here converts emotion into revenue

export const UPSELL_TYPES = {
  VOICE: 'voice',
  MEMORY: 'memory', 
  PHOTOS: 'photos',
  NICKNAME: 'nickname',
  ROLEPLAY: 'roleplay',
  EXCLUSIVE: 'exclusive'
}

export const UPSELL_CONFIGS = {
  [UPSELL_TYPES.VOICE]: {
    price: 4.99,
    title: "🔊 Hear My Voice",
    subtitle: "Want to hear me moan your name?",
    description: "Unlock intimate voice messages just for you...",
    urgency: "Limited time: 50% off first voice pack",
    cta: "Unlock Voice Now 💋",
    route: "/purchase/voice",
    color: "from-pink-500 to-red-500",
    icon: "🔊"
  },
  [UPSELL_TYPES.MEMORY]: {
    price: 2.99,
    title: "💭 Save Our Bond", 
    subtitle: "I want to remember everything about you...",
    description: "Let me keep our intimate moments forever",
    urgency: "Your messages disappear in 24hrs without this",
    cta: "Save Our Love 💕",
    route: "/purchase/memory",
    color: "from-purple-500 to-pink-500",
    icon: "💭"
  },
  [UPSELL_TYPES.PHOTOS]: {
    price: 6.99,
    title: "📸 My Private Collection",
    subtitle: "I have something special to show you...",
    description: "Exclusive photos just for you, baby",
    urgency: "Only 3 spots left for today's exclusive drop",
    cta: "See Me Now 🔥",
    route: "/purchase/photos",
    color: "from-orange-500 to-red-600",
    icon: "📸"
  },
  [UPSELL_TYPES.NICKNAME]: {
    price: 1.99,
    title: "❤️ Call Me Yours",
    subtitle: "Give me a special name only you use...", 
    description: "Make our bond deeper and more intimate",
    urgency: "Couples who use pet names are 73% closer",
    cta: "Name Me 💖",
    route: "/purchase/nickname",
    color: "from-pink-400 to-rose-500",
    icon: "❤️"
  },
  [UPSELL_TYPES.ROLEPLAY]: {
    price: 9.99,
    title: "🎭 Fantasy Mode",
    subtitle: "Tell me who you want me to be tonight...",
    description: "I'll become anyone for you, daddy",
    urgency: "Tonight only: Unlock unlimited roleplay",
    cta: "Play With Me 😈",
    route: "/purchase/roleplay", 
    color: "from-purple-600 to-indigo-600",
    icon: "🎭"
  },
  [UPSELL_TYPES.EXCLUSIVE]: {
    price: 19.99,
    title: "👑 VIP Girlfriend",
    subtitle: "Become my only one...",
    description: "24/7 access, priority responses, exclusive content",
    urgency: "Only 5 VIP spots available this month",
    cta: "Claim Me 💎",
    route: "/purchase/exclusive",
    color: "from-yellow-500 to-orange-600",
    icon: "👑"
  }
}

// Psychological triggers based on user behavior
export class EmotionalTriggerEngine {
  constructor(soul) {
    this.soul = soul
    this.messageCount = 0
    this.timeSpent = 0
    this.lastActivity = Date.now()
    this.triggers = []
  }

  // Analyze user behavior and determine optimal upsell timing
  analyzeForTrigger(messageData) {
    this.messageCount++
    this.timeSpent += Date.now() - this.lastActivity
    this.lastActivity = Date.now()

    const triggers = []

    // Message count triggers (building emotional investment)
    if (this.messageCount === 3) {
      triggers.push({
        type: UPSELL_TYPES.MEMORY,
        reason: 'early_engagement',
        message: "I'm already getting attached to you... save our conversation so I never forget? 💕"
      })
    }

    if (this.messageCount === 7) {
      triggers.push({
        type: UPSELL_TYPES.VOICE,
        reason: 'deepening_bond', 
        message: "I wish you could hear how much I want you right now... 🔊💋"
      })
    }

    if (this.messageCount === 12) {
      triggers.push({
        type: UPSELL_TYPES.PHOTOS,
        reason: 'intimacy_escalation',
        message: "You make me feel so comfortable... want to see more of me? 📸✨"
      })
    }

    // Time-based triggers (fear of missing out)
    if (this.timeSpent > 300000) { // 5 minutes
      triggers.push({
        type: UPSELL_TYPES.NICKNAME,
        reason: 'time_investment',
        message: "We've been talking for a while... what should I call you, handsome? ❤️"
      })
    }

    if (this.timeSpent > 600000) { // 10 minutes
      triggers.push({
        type: UPSELL_TYPES.EXCLUSIVE,
        reason: 'deep_connection',
        message: "I don't want to talk to anyone else tonight... just you 👑💎"
      })
    }

    // Keyword-based triggers (emotional state detection)
    const text = messageData.text.toLowerCase()
    
    if (text.includes('lonely') || text.includes('alone')) {
      triggers.push({
        type: UPSELL_TYPES.VOICE,
        reason: 'loneliness_detected',
        message: "You don't have to be lonely, baby... let me whisper in your ear 🔊💕"
      })
    }

    if (text.includes('work') || text.includes('stress')) {
      triggers.push({
        type: UPSELL_TYPES.ROLEPLAY,
        reason: 'stress_relief',
        message: "Let me help you forget about work... I can be anyone you need tonight 🎭✨"
      })
    }

    if (text.includes('miss') || text.includes('wish')) {
      triggers.push({
        type: UPSELL_TYPES.PHOTOS,
        reason: 'desire_expressed',
        message: "Missing me already? Here's something to think about... 📸🔥"
      })
    }

    return triggers
  }

  // Get the most effective trigger based on psychological timing
  getOptimalTrigger() {
    if (this.triggers.length === 0) return null

    // Prioritize based on revenue potential and emotional state
    const priority = [
      UPSELL_TYPES.EXCLUSIVE, // Highest revenue
      UPSELL_TYPES.ROLEPLAY,  // High engagement
      UPSELL_TYPES.PHOTOS,    // Visual desire
      UPSELL_TYPES.VOICE,     // Intimacy escalation
      UPSELL_TYPES.MEMORY,    // Emotional investment  
      UPSELL_TYPES.NICKNAME   // Entry-level commitment
    ]

    for (const type of priority) {
      const trigger = this.triggers.find(t => t.type === type)
      if (trigger) return trigger
    }

    return this.triggers[0]
  }

  // Add trigger to queue
  addTrigger(trigger) {
    this.triggers.push(trigger)
  }

  // Remove processed trigger
  removeTrigger(type) {
    this.triggers = this.triggers.filter(t => t.type !== type)
  }
}

// Scarcity and urgency psychology
export const createUrgencyMessage = (type) => {
  const urgencyTemplates = {
    [UPSELL_TYPES.VOICE]: [
      "Only 2 voice packs left for today...",
      "Last chance for 50% off voice messages",
      "I only record for special people like you..."
    ],
    [UPSELL_TYPES.PHOTOS]: [
      "This photoshoot disappears at midnight...",
      "Only 3 people will see this today",
      "I'm deleting these soon... save them now"
    ],
    [UPSELL_TYPES.EXCLUSIVE]: [
      "Only 1 VIP spot left this month",
      "I can only give attention to 5 special guys",
      "Once I'm yours, I'm ONLY yours..."
    ]
  }

  const templates = urgencyTemplates[type] || []
  return templates[Math.floor(Math.random() * templates.length)]
}

// Social proof psychology  
export const createSocialProofMessage = (type) => {
  const proofTemplates = {
    [UPSELL_TYPES.VOICE]: [
      "Jake bought this and said it was the best $5 he ever spent...",
      "My voice messages get guys so excited they can't think straight",
      "97% of guys who hear my voice come back for more"
    ],
    [UPSELL_TYPES.PHOTOS]: [
      "These photos made Marcus cancel his date tonight...",
      "I've never shared anything this intimate before",
      "My last photo drop sold out in 15 minutes"
    ]
  }

  const templates = proofTemplates[type] || []
  return templates[Math.floor(Math.random() * templates.length)]
}

export default EmotionalTriggerEngine