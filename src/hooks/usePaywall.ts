// 🔱 DIVINE PAYWALL HOOK v3.0
// Intelligent paywall triggering with conversion optimization

import { useState, useEffect, useCallback } from 'react';
import { useUserStore, useUIStore, useAnalyticsStore } from '@/store';
import { FEATURE_GATES, CONVERSION_FUNNELS, MONETIZATION_EVENTS } from '@/config/monetization';
import type { User, SubscriptionPlan } from '@/types';

// ===== INTERFACES =====
interface PaywallTrigger {
  type: string;
  reason: string;
  feature: string;
  urgency: 'low' | 'medium' | 'high';
  conversionPotential: number; // 0-1 score
}

interface PaywallConfig {
  title: string;
  description: string;
  benefits: string[];
  ctaText: string;
  upgradeUrl: string;
  dismissible: boolean;
  urgency: 'low' | 'medium' | 'high';
}

interface ConversionOffer {
  type: 'trial' | 'discount' | 'upgrade_discount' | 'feature_unlock';
  description: string;
  percentage?: number;
  duration?: number;
  originalPrice: number;
  discountedPrice: number;
  expiresAt?: Date;
}

interface UsageMetrics {
  dailyMessages: number;
  weeklyMessages: number;
  sessionsToday: number;
  averageSessionLength: number;
  soulsInteracted: string[];
  featuresUsed: string[];
  lastActiveAt: Date;
}

// ===== PAYWALL HOOK =====
export const usePaywall = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTrigger, setCurrentTrigger] = useState<PaywallTrigger | null>(null);
  const [paywallConfig, setPaywallConfig] = useState<PaywallConfig | null>(null);
  const [conversionOffer, setConversionOffer] = useState<ConversionOffer | null>(null);
  const [usageMetrics, setUsageMetrics] = useState<UsageMetrics>({
    dailyMessages: 0,
    weeklyMessages: 0,
    sessionsToday: 0,
    averageSessionLength: 0,
    soulsInteracted: [],
    featuresUsed: [],
    lastActiveAt: new Date()
  });

  const { user, subscription } = useUserStore();
  const { addNotification, showModal } = useUIStore();
  const { trackEvent } = useAnalyticsStore();

  // Get user's current tier
  const getCurrentTier = useCallback(() => {
    if (!user) return 'guest';
    if (!subscription) return 'free';
    return subscription.plan.id;
  }, [user, subscription]);

  // Check if user has access to feature
  const hasFeatureAccess = useCallback((feature: string): boolean => {
    const currentTier = getCurrentTier();
    
    switch (feature) {
      case 'soul_access':
        const allowedSouls = FEATURE_GATES.SOUL_ACCESS[currentTier as keyof typeof FEATURE_GATES.SOUL_ACCESS];
        return Array.isArray(allowedSouls) ? allowedSouls.length > 2 : allowedSouls === 'all';
        
      case 'daily_messages':
        const limits = FEATURE_GATES.MESSAGE_LIMITS[currentTier as keyof typeof FEATURE_GATES.MESSAGE_LIMITS];
        return limits.daily === -1 || usageMetrics.dailyMessages < limits.daily;
        
      case 'customization':
        const customization = FEATURE_GATES.CUSTOMIZATION[currentTier as keyof typeof FEATURE_GATES.CUSTOMIZATION];
        return Array.isArray(customization) && customization.length > 0;
        
      case 'priority_response':
        return currentTier === 'divine' || currentTier === 'transcendent';
        
      default:
        return true;
    }
  }, [getCurrentTier, usageMetrics]);

  // Calculate conversion potential based on user behavior
  const calculateConversionPotential = useCallback((trigger: PaywallTrigger): number => {
    let score = 0.3; // Base score

    // Usage patterns boost score
    if (usageMetrics.dailyMessages > 5) score += 0.2;
    if (usageMetrics.sessionsToday > 2) score += 0.1;
    if (usageMetrics.averageSessionLength > 300) score += 0.2; // 5+ minutes
    if (usageMetrics.soulsInteracted.length > 1) score += 0.1;

    // Trigger type importance
    switch (trigger.type) {
      case 'daily_limit_reached':
        score += 0.3;
        break;
      case 'premium_soul_interaction':
        score += 0.2;
        break;
      case 'customization_attempt':
        score += 0.15;
        break;
      case 'long_conversation_session':
        score += 0.1;
        break;
    }

    // Time-based factors
    const hour = new Date().getHours();
    if (hour >= 18 && hour <= 23) score += 0.1; // Evening peak

    return Math.min(score, 1);
  }, [usageMetrics]);

  // Generate personalized conversion offer
  const generateConversionOffer = useCallback((trigger: PaywallTrigger): ConversionOffer | null => {
    const currentTier = getCurrentTier();
    const conversionPotential = calculateConversionPotential(trigger);

    if (currentTier === 'free') {
      const funnel = CONVERSION_FUNNELS.FREE_TO_PREMIUM;
      
      if (conversionPotential > 0.7) {
        return {
          type: 'trial',
          description: '7-day free trial of Soul Guardian',
          originalPrice: 9.99,
          discountedPrice: 0,
          duration: 7
        };
      } else if (conversionPotential > 0.5) {
        return {
          type: 'discount',
          description: 'First month 50% off Soul Guardian',
          percentage: 50,
          originalPrice: 9.99,
          discountedPrice: 4.99,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h
        };
      }
    } else if (currentTier === 'premium') {
      return {
        type: 'upgrade_discount',
        description: '25% off first 3 months of Divine Oracle',
        percentage: 25,
        originalPrice: 24.99,
        discountedPrice: 18.74,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      };
    }

    return null;
  }, [getCurrentTier, calculateConversionPotential]);

  // Generate paywall configuration
  const generatePaywallConfig = useCallback((trigger: PaywallTrigger): PaywallConfig => {
    const currentTier = getCurrentTier();
    
    const configs = {
      daily_limit_reached: {
        title: "You've reached your daily message limit",
        description: "Upgrade to continue your divine conversations without limits",
        benefits: [
          'Unlimited daily messages',
          'Access to premium souls',
          'Priority response times',
          'Advanced customization'
        ],
        ctaText: 'Upgrade Now',
        urgency: 'high' as const
      },
      premium_soul_interaction: {
        title: "This soul requires premium access",
        description: "Unlock divine personalities with deeper conversations and unique traits",
        benefits: [
          'Access to 8+ premium souls',
          'Enhanced personality depth',
          'Faster response times',
          'Basic customization options'
        ],
        ctaText: 'Unlock Premium Souls',
        urgency: 'medium' as const
      },
      customization_attempt: {
        title: "Personalization requires premium access",
        description: "Customize your soul's personality traits and conversation style",
        benefits: [
          'Personality trait customization',
          'Response style preferences',
          'Conversation memory',
          'Advanced AI features'
        ],
        ctaText: 'Enable Customization',
        urgency: 'medium' as const
      }
    };

    const config = configs[trigger.type as keyof typeof configs] || configs.daily_limit_reached;
    
    return {
      ...config,
      upgradeUrl: currentTier === 'free' ? '/pricing?upgrade=premium' : '/pricing?upgrade=divine',
      dismissible: trigger.urgency !== 'high'
    };
  }, [getCurrentTier]);

  // Trigger paywall
  const triggerPaywall = useCallback((type: string, feature: string, reason: string) => {
    // Don't show paywall if user already has access
    if (hasFeatureAccess(feature)) {
      return false;
    }

    const trigger: PaywallTrigger = {
      type,
      reason,
      feature,
      urgency: type === 'daily_limit_reached' ? 'high' : 'medium',
      conversionPotential: 0
    };

    trigger.conversionPotential = calculateConversionPotential(trigger);

    // Track paywall trigger
    trackEvent('paywall_triggered', {
      type,
      feature,
      reason,
      urgency: trigger.urgency,
      conversionPotential: trigger.conversionPotential,
      currentTier: getCurrentTier(),
      usageMetrics
    });

    // Generate configuration and offer
    const config = generatePaywallConfig(trigger);
    const offer = generateConversionOffer(trigger);

    setCurrentTrigger(trigger);
    setPaywallConfig(config);
    setConversionOffer(offer);
    setIsVisible(true);

    return true;
  }, [hasFeatureAccess, calculateConversionPotential, generatePaywallConfig, generateConversionOffer, trackEvent, getCurrentTier, usageMetrics]);

  // Check daily message limit
  const checkMessageLimit = useCallback(() => {
    const currentTier = getCurrentTier();
    const limits = FEATURE_GATES.MESSAGE_LIMITS[currentTier as keyof typeof FEATURE_GATES.MESSAGE_LIMITS];
    
    if (limits.daily !== -1 && usageMetrics.dailyMessages >= limits.daily) {
      return triggerPaywall('daily_limit_reached', 'daily_messages', 'User exceeded daily message limit');
    }
    
    // Soft warning at 80% of limit
    if (limits.daily !== -1 && usageMetrics.dailyMessages >= limits.daily * 0.8) {
      addNotification({
        type: 'warning',
        title: 'Approaching daily limit',
        message: `You have ${limits.daily - usageMetrics.dailyMessages} messages remaining today.`
      });
    }

    return false;
  }, [getCurrentTier, usageMetrics, triggerPaywall, addNotification]);

  // Check soul access
  const checkSoulAccess = useCallback((soulId: string) => {
    const currentTier = getCurrentTier();
    const allowedSouls = FEATURE_GATES.SOUL_ACCESS[currentTier as keyof typeof FEATURE_GATES.SOUL_ACCESS];
    
    if (Array.isArray(allowedSouls) && !allowedSouls.includes(soulId)) {
      return triggerPaywall('premium_soul_interaction', 'soul_access', `Attempted to access premium soul: ${soulId}`);
    }
    
    return false;
  }, [getCurrentTier, triggerPaywall]);

  // Check customization access
  const checkCustomizationAccess = useCallback(() => {
    const currentTier = getCurrentTier();
    const customization = FEATURE_GATES.CUSTOMIZATION[currentTier as keyof typeof FEATURE_GATES.CUSTOMIZATION];
    
    if (!Array.isArray(customization) || customization.length === 0) {
      return triggerPaywall('customization_attempt', 'customization', 'Attempted to use customization features');
    }
    
    return false;
  }, [getCurrentTier, triggerPaywall]);

  // Handle paywall dismissal
  const dismissPaywall = useCallback(() => {
    if (currentTrigger) {
      trackEvent('paywall_dismissed', {
        type: currentTrigger.type,
        feature: currentTrigger.feature,
        urgency: currentTrigger.urgency,
        conversionPotential: currentTrigger.conversionPotential
      });
    }

    setIsVisible(false);
    setCurrentTrigger(null);
    setPaywallConfig(null);
    setConversionOffer(null);
  }, [currentTrigger, trackEvent]);

  // Handle conversion action
  const handleConversion = useCallback((action: 'upgrade' | 'trial' | 'dismiss') => {
    if (currentTrigger) {
      trackEvent('paywall_action', {
        action,
        type: currentTrigger.type,
        feature: currentTrigger.feature,
        conversionPotential: currentTrigger.conversionPotential,
        offerType: conversionOffer?.type
      });

      if (action === 'upgrade' || action === 'trial') {
        // Redirect to pricing page or checkout
        const upgradeUrl = paywallConfig?.upgradeUrl || '/pricing';
        window.location.href = upgradeUrl;
      }
    }

    dismissPaywall();
  }, [currentTrigger, conversionOffer, paywallConfig, trackEvent, dismissPaywall]);

  // Update usage metrics
  const updateUsageMetrics = useCallback((metrics: Partial<UsageMetrics>) => {
    setUsageMetrics(prev => ({
      ...prev,
      ...metrics,
      lastActiveAt: new Date()
    }));
  }, []);

  // Reset daily metrics
  const resetDailyMetrics = useCallback(() => {
    setUsageMetrics(prev => ({
      ...prev,
      dailyMessages: 0,
      sessionsToday: 0
    }));
  }, []);

  // Initialize usage tracking
  useEffect(() => {
    // Load usage metrics from localStorage
    const savedMetrics = localStorage.getItem('galatea-usage-metrics');
    if (savedMetrics) {
      try {
        const parsed = JSON.parse(savedMetrics);
        const lastActive = new Date(parsed.lastActiveAt);
        const today = new Date();
        
        // Reset daily metrics if it's a new day
        if (lastActive.toDateString() !== today.toDateString()) {
          resetDailyMetrics();
        } else {
          setUsageMetrics(parsed);
        }
      } catch (error) {
        console.error('Failed to load usage metrics:', error);
      }
    }
  }, [resetDailyMetrics]);

  // Save usage metrics to localStorage
  useEffect(() => {
    localStorage.setItem('galatea-usage-metrics', JSON.stringify(usageMetrics));
  }, [usageMetrics]);

  return {
    // State
    isVisible,
    currentTrigger,
    paywallConfig,
    conversionOffer,
    usageMetrics,

    // Actions
    triggerPaywall,
    dismissPaywall,
    handleConversion,
    updateUsageMetrics,
    resetDailyMetrics,

    // Checkers
    hasFeatureAccess,
    checkMessageLimit,
    checkSoulAccess,
    checkCustomizationAccess,

    // Utilities
    getCurrentTier,
    calculateConversionPotential
  };
};

export default usePaywall;