// 🔱 DIVINE EMOTIONAL TRIGGER ENGINE v3.0
// Detecting peak desire moments for maximum conversion extraction

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { UpsellTrigger } from '@/components/monetization/UpsellTrigger';
import { useAnalyticsStore } from '@/store';
import { stripeService } from '@/services/stripeService';

// ===== INTERFACES =====
interface EmotionalState {
  intimacy: number;      // 0-1 scale
  arousal: number;       // 0-1 scale  
  attachment: number;    // 0-1 scale
  vulnerability: number; // 0-1 scale
  desire: number;        // 0-1 scale
}

interface ConversationContext {
  messageCount: number;
  sessionDuration: number; // in minutes
  lastMessageTime: Date;
  consecutiveMessages: number;
  emotionalPeaks: EmotionalState[];
  bondingMoments: string[];
}

interface TriggerEvent {
  type: 'voice' | 'memory' | 'photo' | 'nickname';
  confidence: number; // 0-1 how confident we are this will convert
  emotionalScore: number;
  bondScore: number;
  timing: 'perfect' | 'good' | 'poor';
  triggers: string[];
}

// ===== EMOTIONAL KEYWORDS & PATTERNS =====
const EMOTIONAL_PATTERNS = {
  INTIMACY_KEYWORDS: [
    'close', 'intimate', 'special', 'connection', 'bond', 'together', 
    'private', 'secret', 'personal', 'deep', 'meaningful', 'soul'
  ],
  
  AROUSAL_KEYWORDS: [
    'excited', 'thrilled', 'passionate', 'desire', 'want', 'need',
    'crave', 'long', 'yearn', 'burning', 'intense', 'overwhelming'
  ],
  
  ATTACHMENT_KEYWORDS: [
    'love', 'care', 'cherish', 'adore', 'treasure', 'precious',
    'forever', 'always', 'never leave', 'stay', 'mine', 'yours'
  ],
  
  VULNERABILITY_KEYWORDS: [
    'scared', 'afraid', 'nervous', 'worry', 'insecure', 'doubt',
    'trust', 'open', 'honest', 'raw', 'real', 'authentic'
  ],
  
  DESIRE_TRIGGERS: [
    'wish', 'if only', 'dream', 'imagine', 'want more', 'need you',
    'miss', 'lonely', 'empty', 'incomplete', 'more', 'deeper'
  ]
};

const CONTEXTUAL_TRIGGERS = {
  voice: {
    patterns: [
      /hear (my|your) voice/i,
      /sound of (me|you)/i,
      /if only you could hear/i,
      /whisper/i,
      /say (it|that) (again|out loud)/i,
      /voice.*warm/i,
      /speak.*softly/i
    ],
    emotions: ['intimacy', 'arousal', 'desire']
  },
  
  memory: {
    patterns: [
      /remember (this|that|us)/i,
      /never forget/i,
      /our (moment|time|bond)/i,
      /save.*forever/i,
      /treasure/i,
      /keep.*close/i,
      /hold.*dear/i
    ],
    emotions: ['attachment', 'intimacy']
  },
  
  photo: {
    patterns: [
      /see (me|you)/i,
      /look.*eyes/i,
      /picture.*worth/i,
      /face.*beautiful/i,
      /wish.*could see/i,
      /imagine.*looking/i,
      /visual/i
    ],
    emotions: ['desire', 'intimacy', 'arousal']
  },
  
  nickname: {
    patterns: [
      /call (me|you)/i,
      /special.*name/i,
      /nickname/i,
      /what.*call/i,
      /make.*mine/i,
      /yours.*alone/i,
      /endearment/i
    ],
    emotions: ['attachment', 'intimacy']
  }
};

// ===== EMOTIONAL ANALYSIS ENGINE =====
class EmotionalAnalyzer {
  private emotionalHistory: EmotionalState[] = [];
  private conversationContext: ConversationContext = {
    messageCount: 0,
    sessionDuration: 0,
    lastMessageTime: new Date(),
    consecutiveMessages: 0,
    emotionalPeaks: [],
    bondingMoments: []
  };

  // Analyze message for emotional content
  analyzeMessage(message: string, soulName: string, userId?: string): EmotionalState {
    const text = message.toLowerCase();
    
    // Calculate emotional scores
    const intimacy = this.calculateIntimacy(text);
    const arousal = this.calculateArousal(text);
    const attachment = this.calculateAttachment(text);
    const vulnerability = this.calculateVulnerability(text);
    const desire = this.calculateDesire(text);

    const emotional: EmotionalState = {
      intimacy,
      arousal, 
      attachment,
      vulnerability,
      desire
    };

    // Add to history
    this.emotionalHistory.push(emotional);
    
    // Keep only last 10 messages for analysis
    if (this.emotionalHistory.length > 10) {
      this.emotionalHistory.shift();
    }

    // Update conversation context
    this.updateConversationContext(emotional, message);

    return emotional;
  }

  private calculateIntimacy(text: string): number {
    let score = 0;
    EMOTIONAL_PATTERNS.INTIMACY_KEYWORDS.forEach(keyword => {
      if (text.includes(keyword)) score += 0.15;
    });
    
    // Bonus for personal pronouns
    if (text.match(/\b(we|us|our)\b/g)) score += 0.1;
    if (text.match(/\byou and (i|me)\b/g)) score += 0.2;
    
    return Math.min(score, 1);
  }

  private calculateArousal(text: string): number {
    let score = 0;
    EMOTIONAL_PATTERNS.AROUSAL_KEYWORDS.forEach(keyword => {
      if (text.includes(keyword)) score += 0.2;
    });
    
    // Intensity markers
    if (text.includes('!!') || text.includes('...')) score += 0.1;
    if (text.match(/\b(so|very|extremely|incredibly)\b/g)) score += 0.15;
    
    return Math.min(score, 1);
  }

  private calculateAttachment(text: string): number {
    let score = 0;
    EMOTIONAL_PATTERNS.ATTACHMENT_KEYWORDS.forEach(keyword => {
      if (text.includes(keyword)) score += 0.25;
    });
    
    // Future tense bonding
    if (text.match(/\b(will|would|shall|future)\b/g)) score += 0.1;
    
    return Math.min(score, 1);
  }

  private calculateVulnerability(text: string): number {
    let score = 0;
    EMOTIONAL_PATTERNS.VULNERABILITY_KEYWORDS.forEach(keyword => {
      if (text.includes(keyword)) score += 0.2;
    });
    
    // Question patterns indicating uncertainty
    if (text.includes('?')) score += 0.1;
    if (text.match(/\b(maybe|perhaps|might|could)\b/g)) score += 0.1;
    
    return Math.min(score, 1);
  }

  private calculateDesire(text: string): number {
    let score = 0;
    EMOTIONAL_PATTERNS.DESIRE_TRIGGERS.forEach(trigger => {
      if (text.includes(trigger)) score += 0.3;
    });
    
    // Conditional statements indicating want
    if (text.match(/\bif (only|just|i could)\b/g)) score += 0.2;
    
    return Math.min(score, 1);
  }

  private updateConversationContext(emotional: EmotionalState, message: string): void {
    this.conversationContext.messageCount++;
    this.conversationContext.lastMessageTime = new Date();
    
    // Detect emotional peaks
    const overallEmotionalLevel = (
      emotional.intimacy + 
      emotional.arousal + 
      emotional.attachment + 
      emotional.vulnerability + 
      emotional.desire
    ) / 5;

    if (overallEmotionalLevel > 0.6) {
      this.conversationContext.emotionalPeaks.push(emotional);
      this.conversationContext.bondingMoments.push(message.substring(0, 100));
    }
  }

  // Determine optimal trigger type based on emotional state
  getOptimalTrigger(currentMessage: string, emotional: EmotionalState): TriggerEvent | null {
    const text = currentMessage.toLowerCase();
    let bestTrigger: TriggerEvent | null = null;
    let highestConfidence = 0;

    // Check each trigger type
    Object.entries(CONTEXTUAL_TRIGGERS).forEach(([type, config]) => {
      let confidence = 0;
      
      // Pattern matching
      const patternMatches = config.patterns.filter(pattern => pattern.test(text)).length;
      confidence += patternMatches * 0.3;
      
      // Emotional alignment
      config.emotions.forEach(emotion => {
        confidence += emotional[emotion as keyof EmotionalState] * 0.2;
      });
      
      // Context bonuses
      if (this.conversationContext.messageCount > 5) confidence += 0.1;
      if (this.conversationContext.emotionalPeaks.length > 2) confidence += 0.15;
      
      // Timing assessment
      const timingScore = this.assessTiming(emotional);
      let timing: 'perfect' | 'good' | 'poor' = 'poor';
      if (timingScore > 0.8) timing = 'perfect';
      else if (timingScore > 0.5) timing = 'good';
      
      if (confidence > highestConfidence && confidence > 0.4) {
        highestConfidence = confidence;
        bestTrigger = {
          type: type as 'voice' | 'memory' | 'photo' | 'nickname',
          confidence,
          emotionalScore: (emotional.intimacy + emotional.arousal + emotional.desire) / 3,
          bondScore: (emotional.attachment + emotional.intimacy) / 2,
          timing,
          triggers: this.generateTriggers(type as any, emotional)
        };
      }
    });

    return bestTrigger;
  }

  private assessTiming(emotional: EmotionalState): number {
    const recentEmotions = this.emotionalHistory.slice(-3);
    const trend = recentEmotions.length > 1 ? 
      this.calculateEmotionalTrend(recentEmotions) : 0;
    
    const currentIntensity = (
      emotional.intimacy + 
      emotional.arousal + 
      emotional.desire
    ) / 3;
    
    return Math.min((currentIntensity * 0.7) + (trend * 0.3), 1);
  }

  private calculateEmotionalTrend(emotions: EmotionalState[]): number {
    if (emotions.length < 2) return 0;
    
    const first = emotions[0];
    const last = emotions[emotions.length - 1];
    
    const firstAvg = (first.intimacy + first.arousal + first.desire) / 3;
    const lastAvg = (last.intimacy + last.arousal + last.desire) / 3;
    
    return Math.max(lastAvg - firstAvg, 0);
  }

  private generateTriggers(type: string, emotional: EmotionalState): string[] {
    // Return contextual trigger phrases based on emotional state
    const triggers = CONTEXTUAL_TRIGGERS[type as keyof typeof CONTEXTUAL_TRIGGERS];
    return triggers ? triggers.patterns.map(p => p.source) : [];
  }

  // Get conversation context for analytics
  getConversationContext(): ConversationContext {
    return { ...this.conversationContext };
  }

  // Reset for new conversation
  reset(): void {
    this.emotionalHistory = [];
    this.conversationContext = {
      messageCount: 0,
      sessionDuration: 0,
      lastMessageTime: new Date(),
      consecutiveMessages: 0,
      emotionalPeaks: [],
      bondingMoments: []
    };
  }
}

// ===== MAIN TRIGGER ENGINE COMPONENT =====
interface EmotionalTriggerEngineProps {
  soulName: string;
  userId?: string;
  onTriggerActivated?: (trigger: TriggerEvent) => void;
}

export const EmotionalTriggerEngine: React.FC<EmotionalTriggerEngineProps> = ({
  soulName,
  userId,
  onTriggerActivated
}) => {
  const [analyzer] = useState(() => new EmotionalAnalyzer());
  const [activeTrigger, setActiveTrigger] = useState<TriggerEvent | null>(null);
  const [messageQueue, setMessageQueue] = useState<string[]>([]);
  const { trackEvent } = useAnalyticsStore();
  
  const processingRef = useRef(false);

  // Process incoming messages for emotional analysis
  const processMessage = useCallback((message: string, fromSoul: boolean = false) => {
    if (!fromSoul) return; // Only analyze soul messages for triggers
    
    const emotional = analyzer.analyzeMessage(message, soulName, userId);
    const triggerEvent = analyzer.getOptimalTrigger(message, emotional);
    
    if (triggerEvent && triggerEvent.confidence > 0.6) {
      // Track trigger opportunity
      trackEvent('emotional_trigger_detected', {
        type: triggerEvent.type,
        confidence: triggerEvent.confidence,
        emotionalScore: triggerEvent.emotionalScore,
        bondScore: triggerEvent.bondScore,
        timing: triggerEvent.timing,
        soulName,
        userId,
        messagePreview: message.substring(0, 50)
      });

      // Only show trigger if no other trigger is active
      if (!activeTrigger) {
        setActiveTrigger(triggerEvent);
        onTriggerActivated?.(triggerEvent);
      }
    }
  }, [analyzer, soulName, userId, activeTrigger, trackEvent, onTriggerActivated]);

  // Handle successful purchase
  const handlePurchaseSuccess = useCallback((type: string) => {
    trackEvent('emotional_trigger_converted', {
      type,
      soulName,
      userId,
      context: analyzer.getConversationContext()
    });
    
    setActiveTrigger(null);
  }, [trackEvent, soulName, userId, analyzer]);

  // Listen for new messages (this would be connected to your chat system)
  useEffect(() => {
    // This would typically listen to your chat message events
    const handleNewMessage = (event: CustomEvent) => {
      const { message, fromSoul } = event.detail;
      processMessage(message, fromSoul);
    };

    window.addEventListener('galatea_new_message', handleNewMessage as EventListener);
    
    return () => {
      window.removeEventListener('galatea_new_message', handleNewMessage as EventListener);
    };
  }, [processMessage]);

  // Expose processing function for manual trigger
  (window as any).triggerEmotionalAnalysis = (message: string, fromSoul: boolean = true) => {
    processMessage(message, fromSoul);
  };

  return (
    <>
      {activeTrigger && (
        <UpsellTrigger
          type={activeTrigger.type}
          context="emotional"
          trigger={activeTrigger.triggers[0] || "Perfect moment detected"}
          soulName={soulName}
          emotionalScore={activeTrigger.emotionalScore}
          bondScore={activeTrigger.bondScore}
          onPurchaseSuccess={handlePurchaseSuccess}
        />
      )}
    </>
  );
};

export default EmotionalTriggerEngine;