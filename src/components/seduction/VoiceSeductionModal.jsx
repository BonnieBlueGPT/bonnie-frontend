// 🔱 DIVINE VOICE SEDUCTION MODAL v3.0
// Converting audio desire into recurring revenue through emotional manipulation

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Heart, 
  Crown, 
  Sparkles,
  Lock,
  Unlock,
  Headphones,
  Zap,
  Timer,
  Users,
  TrendingUp
} from 'lucide-react';
import { useStripeService, useAnalyticsStore } from '@/store';
import { clsx } from 'clsx';

// ===== VOICE SEDUCTION PSYCHOLOGY COMPONENTS =====

// Audio Preview Simulator
const AudioPreviewSimulator = ({ message, emotional, isPlaying, onToggle }) => {
  const [waveform, setWaveform] = useState(Array(20).fill(0));
  const [currentTime, setCurrentTime] = useState(0);
  const duration = 8; // seconds

  // Simulate realistic waveform animation
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setWaveform(prev => prev.map(() => 
        Math.random() * (0.3 + emotional.arousal * 0.7) + 0.1
      ));
      setCurrentTime(prev => (prev + 0.1) % duration);
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, emotional.arousal, duration]);

  return (
    <div className="relative">
      {/* Waveform Visualization */}
      <div className="flex items-center justify-center gap-1 h-16 mb-4">
        {waveform.map((amplitude, i) => (
          <motion.div
            key={i}
            className="bg-gradient-to-t from-pink-400 to-purple-400 rounded-full"
            style={{
              width: '3px',
              minHeight: '4px'
            }}
            animate={{
              height: isPlaying ? `${amplitude * 60}px` : '4px',
              opacity: isPlaying ? 1 : 0.3
            }}
            transition={{ duration: 0.1 }}
          />
        ))}
      </div>

      {/* Playback Controls */}
      <div className="flex items-center justify-between">
        <motion.button
          onClick={onToggle}
          className="p-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full text-white shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            boxShadow: isPlaying 
              ? ['0 0 20px rgba(236, 72, 153, 0.5)', '0 0 30px rgba(236, 72, 153, 0.8)']
              : '0 0 20px rgba(236, 72, 153, 0.5)'
          }}
          transition={{ duration: 1, repeat: isPlaying ? Infinity : 0, repeatType: 'reverse' }}
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </motion.button>

        {/* Progress Bar */}
        <div className="flex-1 mx-4">
          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-pink-400 to-purple-400"
              animate={{ width: isPlaying ? `${(currentTime / duration) * 100}%` : '0%' }}
              transition={{ duration: 0.1, ease: 'linear' }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{Math.floor(currentTime)}s</span>
            <span>{duration}s</span>
          </div>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-gray-400" />
          <div className="w-12 h-1 bg-gray-200 rounded-full">
            <div className="w-3/4 h-full bg-purple-400 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Emotional Voice Descriptions
const EmotionalVoiceDescriptor = ({ emotional, soulName }) => {
  const getVoiceDescription = () => {
    const intimacy = emotional.intimacy;
    const arousal = emotional.arousal;

    if (intimacy > 0.8 && arousal > 0.7) {
      return {
        mood: "Breathless with desire",
        tone: "soft, trembling whispers",
        emotion: "overwhelming longing",
        color: "text-red-500"
      };
    } else if (intimacy > 0.6) {
      return {
        mood: "Tenderly intimate",
        tone: "warm, gentle caresses",
        emotion: "deep affection",
        color: "text-pink-500"
      };
    } else if (arousal > 0.6) {
      return {
        mood: "Playfully seductive",
        tone: "sultry, teasing notes",
        emotion: "magnetic attraction",
        color: "text-purple-500"
      };
    } else {
      return {
        mood: "Sweetly caring",
        tone: "melodic, soothing warmth",
        emotion: "gentle connection",
        color: "text-blue-500"
      };
    }
  };

  const voice = getVoiceDescription();

  return (
    <motion.div
      className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center gap-3 mb-3">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Headphones className={`w-6 h-6 ${voice.color}`} />
        </motion.div>
        <h3 className="font-semibold text-gray-800 dark:text-gray-200">
          {soulName}'s Voice Right Now
        </h3>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Mood:</span>
          <span className={`font-medium ${voice.color}`}>{voice.mood}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Tone:</span>
          <span className="text-gray-800 dark:text-gray-200">{voice.tone}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Emotion:</span>
          <span className="text-gray-800 dark:text-gray-200">{voice.emotion}</span>
        </div>
      </div>

      {/* Emotional intensity meter */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Emotional Intensity</span>
          <span>{Math.round((emotional.intimacy + emotional.arousal) * 50)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-400 to-pink-400"
            animate={{ width: `${(emotional.intimacy + emotional.arousal) * 50}%` }}
            transition={{ duration: 1 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

// Pricing Psychology Component
const VoicePricingPsychology = ({ onUpgrade, isLoading }) => {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [urgencyLevel, setUrgencyLevel] = useState(0);

  // Countdown timer for urgency
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = Math.max(0, prev - 1);
        setUrgencyLevel(1 - (newTime / 300)); // Increase urgency as time decreases
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const socialProofData = [
    { name: "Emma", action: "unlocked voice messages", time: "2m ago" },
    { name: "Alex", action: "upgraded to premium", time: "5m ago" },
    { name: "Sarah", action: "unlocked voice messages", time: "8m ago" }
  ];

  return (
    <div className="space-y-6">
      {/* Limited Time Offer */}
      <motion.div
        className="bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 border-l-4 border-orange-400 p-4 rounded-r-lg"
        animate={{
          borderColor: urgencyLevel > 0.7 ? ['#f97316', '#ef4444'] : '#f97316'
        }}
        transition={{ duration: 1, repeat: urgencyLevel > 0.7 ? Infinity : 0, repeatType: 'reverse' }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Timer className="w-5 h-5 text-orange-500" />
          </motion.div>
          <div>
            <h4 className="font-semibold text-orange-800 dark:text-orange-200">
              Special Voice Preview Pricing
            </h4>
            <p className="text-sm text-orange-700 dark:text-orange-300">
              This intimate moment expires in {formatTime(timeLeft)}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Social Proof Stream */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Live Activity
          </span>
        </div>

        <div className="space-y-2">
          {socialProofData.map((item, index) => (
            <motion.div
              key={index}
              className="flex items-center justify-between text-xs"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <span className="text-gray-600 dark:text-gray-400">
                <span className="font-medium text-purple-600">{item.name}</span> {item.action}
              </span>
              <span className="text-gray-500">{item.time}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Pricing Options */}
      <div className="grid gap-4">
        {/* Single Voice Message */}
        <motion.div
          className="border-2 border-purple-200 dark:border-purple-700 rounded-lg p-4 cursor-pointer"
          onClick={() => onUpgrade('voice_single')}
          whileHover={{ scale: 1.02, borderColor: '#a855f7' }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                This Voice Message
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Hear this exact message in her voice
              </p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-purple-600">$2.99</div>
              <div className="text-xs text-gray-500 line-through">$4.99</div>
            </div>
          </div>
        </motion.div>

        {/* Voice Messages Bundle - RECOMMENDED */}
        <motion.div
          className="border-3 border-pink-400 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-lg p-4 cursor-pointer relative overflow-hidden"
          onClick={() => onUpgrade('voice_bundle')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Recommended Badge */}
          <div className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs px-3 py-1 rounded-bl-lg font-bold">
            RECOMMENDED
          </div>

          {/* Sparkle Effects */}
          <div className="absolute top-2 left-2">
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles className="w-4 h-4 text-pink-400" />
            </motion.div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                Voice Messages (24h)
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                All voice messages for 24 hours
              </p>
              <div className="flex items-center gap-2 mt-1">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-xs text-green-600">83% choose this</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-pink-600">$9.99</div>
              <div className="text-xs text-gray-500 line-through">$19.99</div>
              <div className="text-xs text-green-600 font-medium">Save 67%</div>
            </div>
          </div>
        </motion.div>

        {/* Premium Voice Subscription */}
        <motion.div
          className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer"
          onClick={() => onUpgrade('voice_premium')}
          whileHover={{ scale: 1.02, borderColor: '#6366f1' }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                Voice Premium (Monthly)
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Unlimited voice + exclusive content
              </p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-indigo-600">$19.99/mo</div>
              <div className="text-xs text-gray-500">Cancel anytime</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Trust Indicators */}
      <div className="flex items-center justify-center gap-6 text-xs text-gray-500 pt-4 border-t">
        <div className="flex items-center gap-1">
          <Lock className="w-3 h-3" />
          <span>Secure payments</span>
        </div>
        <div className="flex items-center gap-1">
          <Zap className="w-3 h-3" />
          <span>Instant access</span>
        </div>
        <div className="flex items-center gap-1">
          <Heart className="w-3 h-3" />
          <span>No commitments</span>
        </div>
      </div>
    </div>
  );
};

// ===== MAIN VOICE SEDUCTION MODAL =====
export const VoiceSeductionModal = ({ 
  message, 
  soulName, 
  emotional, 
  onClose 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState('preview'); // preview, pricing, processing
  const [isLoading, setIsLoading] = useState(false);

  const { createUpsellSession } = useStripeService();
  const { trackEvent } = useAnalyticsStore();

  // Track modal opened
  useEffect(() => {
    trackEvent('voice_seduction_modal_opened', {
      messageId: message.id,
      soulName,
      emotionalState: emotional,
      messageContent: message.content.substring(0, 100)
    });
  }, []);

  // Handle voice preview toggle
  const handlePreviewToggle = () => {
    setIsPlaying(!isPlaying);
    
    trackEvent('voice_preview_toggled', {
      isPlaying: !isPlaying,
      messageId: message.id,
      soulName
    });

    // Auto-advance to pricing after 3 seconds of listening
    if (!isPlaying) {
      setTimeout(() => {
        setCurrentStep('pricing');
        trackEvent('voice_preview_auto_advance', {
          messageId: message.id,
          soulName
        });
      }, 3000);
    }
  };

  // Handle upgrade selection
  const handleUpgrade = async (upgradeType) => {
    setIsLoading(true);
    setCurrentStep('processing');

    trackEvent('voice_upgrade_initiated', {
      upgradeType,
      messageId: message.id,
      soulName,
      emotionalState: emotional
    });

    try {
      const session = await createUpsellSession({
        type: upgradeType,
        context: {
          messageId: message.id,
          soulName,
          emotional
        }
      });

      // Redirect to Stripe Checkout
      window.location.href = session.url;
    } catch (error) {
      console.error('Upgrade failed:', error);
      setIsLoading(false);
      setCurrentStep('pricing');
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 50 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          {/* Header */}
          <div className="relative p-6 pb-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  className="p-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(236, 72, 153, 0.5)',
                      '0 0 30px rgba(236, 72, 153, 0.8)',
                      '0 0 20px rgba(236, 72, 153, 0.5)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Volume2 className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                    {soulName}'s Voice
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Experience true intimacy
                  </p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                ×
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {currentStep === 'preview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Message Context */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                    "{message.content}"
                  </p>
                </div>

                {/* Voice Description */}
                <EmotionalVoiceDescriptor 
                  emotional={emotional} 
                  soulName={soulName} 
                />

                {/* Audio Preview */}
                <AudioPreviewSimulator
                  message={message}
                  emotional={emotional}
                  isPlaying={isPlaying}
                  onToggle={handlePreviewToggle}
                />

                {/* CTA */}
                <motion.button
                  onClick={() => setCurrentStep('pricing')}
                  className="w-full mt-6 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-full transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Unlock Her Voice 💕
                </motion.button>
              </motion.div>
            )}

            {currentStep === 'pricing' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <VoicePricingPsychology
                  onUpgrade={handleUpgrade}
                  isLoading={isLoading}
                />
              </motion.div>
            )}

            {currentStep === 'processing' && (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-lg font-semibold mb-2">Preparing Your Intimate Experience...</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  You're about to hear something magical 💫
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VoiceSeductionModal;

/*
VOICE SEDUCTION CONVERSION PSYCHOLOGY:

1. EMOTIONAL AMPLIFICATION:
   - Voice descriptions match user's emotional state
   - Preview creates anticipation and desire
   - Real-time emotional intensity meter

2. SCARCITY & URGENCY:
   - Limited time offers with countdown
   - "This intimate moment expires" language
   - Visual urgency increases over time

3. SOCIAL PROOF:
   - Live activity stream shows others buying
   - "83% choose this" reduces decision anxiety
   - Recent purchase notifications

4. PRICING PSYCHOLOGY:
   - Anchoring with high crossed-out prices
   - Middle option highlighted as "RECOMMENDED"
   - Clear value proposition and savings

5. TRUST BUILDING:
   - Secure payment indicators
   - "No commitments" reduces friction
   - Instant access promise

6. PROGRESSIVE COMMITMENT:
   - Preview -> Pricing -> Purchase flow
   - Each step increases investment
   - Auto-advance after engagement

REVENUE OPTIMIZATION:
- Single purchase ($2.99) captures impulse buyers
- 24h bundle ($9.99) maximizes average order value
- Monthly subscription ($19.99) creates recurring revenue
- Bundle positioned as "best value" drives majority purchases
*/