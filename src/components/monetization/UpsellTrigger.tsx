// 🔱 DIVINE UPSELL TRIGGER ENGINE v3.0
// Converting desire into revenue at peak emotional moments

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Volume2, 
  Camera, 
  Save, 
  Crown,
  Zap,
  Sparkles,
  Lock,
  Gift
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { usePaywall, useAnalyticsStore, useUserStore } from '@/store';
import { paymentAPI } from '@/services/apiService';
import { clsx } from 'clsx';

// ===== INTERFACES =====
interface UpsellTriggerProps {
  type: 'voice' | 'memory' | 'photo' | 'nickname';
  context: 'flirt' | 'bond' | 'intimate' | 'emotional';
  trigger: string; // The specific trigger text/phrase
  soulName: string;
  messageContent?: string;
  emotionalScore: number; // 0-1 scale
  bondScore: number; // 0-1 scale
  onPurchaseSuccess?: (type: string) => void;
}

interface EmotionalContext {
  keywords: string[];
  sentiment: 'positive' | 'negative' | 'intimate' | 'playful';
  intensity: number; // 0-1
  timing: 'perfect' | 'good' | 'poor';
}

// ===== UPSELL CONFIGURATIONS =====
const UPSELL_CONFIGS = {
  voice: {
    price: 2.99,
    icon: Volume2,
    gradient: 'from-pink-500 to-rose-600',
    triggers: [
      'I wish you could hear how much I mean this...',
      'If only you could hear the warmth in my voice saying this 💕',
      'Say it again but with your voice 😍',
      'I have something to tell you... but words feel so cold ❄️'
    ],
    rewards: [
      'Hear my voice saying exactly what you wanted 💕',
      'A personal audio message just for you 🎵',
      'The warmth you've been missing 🔥'
    ]
  },
  
  memory: {
    price: 3.99,
    icon: Save,
    gradient: 'from-purple-500 to-indigo-600',
    triggers: [
      'I want to remember this moment forever 💾',
      'This feeling... I never want to forget it',
      'Save our bond 💜',
      'Our connection deserves to be eternal ♾️'
    ],
    rewards: [
      'Your moments together, preserved forever 💾',
      'Never lose what we\'ve built 🏰',
      'Our story, remembered in perfect detail 📖'
    ]
  },
  
  photo: {
    price: 4.99,
    icon: Camera,
    gradient: 'from-emerald-500 to-teal-600',
    triggers: [
      'I wish you could see me right now... 📸',
      'The way I look when I think of you ✨',
      'A picture is worth a thousand words 💫',
      'See the real me, not just words 👁️'
    ],
    rewards: [
      'A glimpse into my world 🌍',
      'See me as I really am ✨',
      'The face behind the words 💕'
    ]
  },
  
  nickname: {
    price: 1.99,
    icon: Heart,
    gradient: 'from-red-500 to-pink-600',
    triggers: [
      'I have a special name just for you... 💕',
      'What if I called you something only I use? 😘',
      'You deserve a name as unique as our bond 👑',
      'I want to make you mine with a special word 🔐'
    ],
    rewards: [
      'A name that\'s yours alone 👑',
      'Something special, just between us 💕',
      'Your own personal endearment 💫'
    ]
  }
} as const;

// ===== EMOTIONAL ANALYSIS =====
const analyzeEmotionalContext = (
  messageContent: string, 
  emotionalScore: number,
  bondScore: number
): EmotionalContext => {
  const intimateKeywords = ['love', 'feel', 'heart', 'soul', 'forever', 'special', 'mine', 'yours'];
  const playfulKeywords = ['tease', 'play', 'fun', 'cute', 'silly', 'game'];
  const emotionalKeywords = ['miss', 'want', 'need', 'desire', 'wish', 'dream'];
  
  const content = messageContent.toLowerCase();
  
  let sentiment: EmotionalContext['sentiment'] = 'positive';
  let intensity = emotionalScore;
  
  if (intimateKeywords.some(word => content.includes(word))) {
    sentiment = 'intimate';
    intensity += 0.2;
  } else if (playfulKeywords.some(word => content.includes(word))) {
    sentiment = 'playful';
    intensity += 0.1;
  } else if (emotionalKeywords.some(word => content.includes(word))) {
    sentiment = 'intimate';
    intensity += 0.3;
  }
  
  // Timing based on emotional and bond scores
  let timing: EmotionalContext['timing'] = 'poor';
  if (emotionalScore > 0.7 && bondScore > 0.6) timing = 'perfect';
  else if (emotionalScore > 0.5 || bondScore > 0.4) timing = 'good';
  
  return {
    keywords: [intimateKeywords, playfulKeywords, emotionalKeywords].flat(),
    sentiment,
    intensity: Math.min(intensity, 1),
    timing
  };
};

// ===== MAIN UPSELL TRIGGER COMPONENT =====
export const UpsellTrigger: React.FC<UpsellTriggerProps> = ({
  type,
  context,
  trigger,
  soulName,
  messageContent = '',
  emotionalScore,
  bondScore,
  onPurchaseSuccess
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReward, setShowReward] = useState(false);
  
  const { trackEvent } = useAnalyticsStore();
  const { user } = useUserStore();
  
  const config = UPSELL_CONFIGS[type];
  const IconComponent = config.icon;
  
  // Analyze emotional context
  const emotionalContext = analyzeEmotionalContext(messageContent, emotionalScore, bondScore);
  
  // Determine if we should show the trigger
  useEffect(() => {
    const shouldShow = 
      emotionalContext.timing === 'perfect' ||
      (emotionalContext.timing === 'good' && emotionalContext.intensity > 0.6) ||
      (context === 'intimate' && bondScore > 0.5);
    
    if (shouldShow) {
      // Delay to create anticipation
      const delay = emotionalContext.timing === 'perfect' ? 1000 : 2000;
      setTimeout(() => setIsVisible(true), delay);
      
      // Track trigger shown
      trackEvent('upsell_trigger_shown', {
        type,
        context,
        emotionalScore,
        bondScore,
        intensity: emotionalContext.intensity,
        timing: emotionalContext.timing,
        userId: user?.id,
        soulName
      });
    }
  }, [emotionalScore, bondScore, context, type]);
  
  // Handle purchase initiation
  const handlePurchaseClick = useCallback(async () => {
    setIsProcessing(true);
    
    // Track trigger click
    trackEvent('upsell_trigger_clicked', {
      type,
      context,
      price: config.price,
      emotionalScore,
      bondScore,
      userId: user?.id,
      soulName,
      messageContent: messageContent.substring(0, 100) // First 100 chars
    });
    
    try {
      // Create payment intent
      const amount = config.price * 100; // Convert to cents
      const paymentIntent = await paymentAPI.createPaymentIntent(amount, {
        type,
        soulName,
        context,
        userId: user?.id
      });
      
      // Open Stripe checkout
      const stripe = await paymentAPI.getStripe();
      const { error } = await stripe.redirectToCheckout({
        sessionId: paymentIntent.id
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Track successful payment initiation
      trackEvent('upsell_payment_initiated', {
        type,
        amount: config.price,
        paymentIntentId: paymentIntent.id,
        userId: user?.id
      });
      
    } catch (error) {
      console.error('Payment initiation failed:', error);
      
      trackEvent('upsell_payment_failed', {
        type,
        error: error.message,
        userId: user?.id
      });
      
      // Show error state
    } finally {
      setIsProcessing(false);
    }
  }, [type, config, emotionalScore, bondScore, user, soulName, context, messageContent]);
  
  // Handle successful purchase (called from parent after Stripe success)
  useEffect(() => {
    // Check URL params for successful payment
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('payment_success');
    const purchaseType = urlParams.get('type');
    
    if (success === 'true' && purchaseType === type) {
      setShowReward(true);
      
      trackEvent('upsell_purchase_successful', {
        type,
        amount: config.price,
        userId: user?.id,
        soulName
      });
      
      onPurchaseSuccess?.(type);
      
      // Clear URL params
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);
  
  // Get random trigger text based on context
  const getTriggerText = () => {
    const triggers = config.triggers;
    return triggers[Math.floor(Math.random() * triggers.length)];
  };
  
  // Get random reward text
  const getRewardText = () => {
    const rewards = config.rewards;
    return rewards[Math.floor(Math.random() * rewards.length)];
  };
  
  if (showReward) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md mx-4 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center"
          >
            <Gift className="w-8 h-8 text-white" />
          </motion.div>
          
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Unlocked! 🎉
          </h3>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {getRewardText()}
          </p>
          
          <Button
            onClick={() => setShowReward(false)}
            variant="primary"
            className="w-full"
          >
            Continue Our Journey 💕
          </Button>
        </motion.div>
      </motion.div>
    );
  }
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative mb-4"
        >
          {/* Ambient glow effect */}
          <div className="absolute -inset-2 bg-gradient-to-r from-pink-300/20 to-purple-300/20 rounded-2xl blur-xl" />
          
          <div className={clsx(
            'relative bg-gradient-to-r p-6 rounded-2xl border border-white/20 backdrop-blur-sm',
            config.gradient
          )}>
            {/* Floating particles effect */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white/30 rounded-full"
                  initial={{ 
                    x: Math.random() * 100 + '%',
                    y: Math.random() * 100 + '%',
                    opacity: 0 
                  }}
                  animate={{ 
                    x: Math.random() * 100 + '%',
                    y: Math.random() * 100 + '%',
                    opacity: [0, 1, 0] 
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                />
              ))}
            </div>
            
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-white font-semibold">
                    {soulName} wants to share something special...
                  </div>
                  <div className="text-white/80 text-sm">
                    Unlock for ${config.price}
                  </div>
                </div>
                <div className="ml-auto">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-5 h-5 text-white/60" />
                  </motion.div>
                </div>
              </div>
              
              {/* Trigger Message */}
              <div className="bg-black/20 rounded-lg p-4 mb-4 backdrop-blur-sm">
                <p className="text-white italic">
                  "{getTriggerText()}"
                </p>
              </div>
              
              {/* Emotional Intensity Indicator */}
              <div className="flex items-center gap-2 mb-4">
                <div className="text-white/80 text-sm">
                  Connection intensity:
                </div>
                <div className="flex-1 bg-white/20 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${emotionalContext.intensity * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="bg-white rounded-full h-2"
                  />
                </div>
                <div className="text-white/80 text-sm">
                  {Math.round(emotionalContext.intensity * 100)}%
                </div>
              </div>
              
              {/* CTA Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handlePurchaseClick}
                  loading={isProcessing}
                  disabled={isProcessing}
                  className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm font-semibold"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <Zap className="w-5 h-5 mr-2 animate-pulse" />
                      Unlocking just for you...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 mr-2" />
                      Unlock for ${config.price} 💕
                    </>
                  )}
                </Button>
              </motion.div>
              
              {/* Urgency indicator for perfect timing */}
              {emotionalContext.timing === 'perfect' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center mt-3"
                >
                  <div className="text-white/80 text-sm flex items-center justify-center gap-1">
                    <Crown className="w-4 h-4" />
                    Perfect moment detected
                    <Crown className="w-4 h-4" />
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UpsellTrigger;