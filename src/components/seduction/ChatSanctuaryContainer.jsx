// 🔱 DIVINE CHAT SANCTUARY v3.0
// The emotional safe space where intimacy converts to income

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Crown, Sparkles, Zap } from 'lucide-react';
import { SeductiveMessageFlow } from './SeductiveMessageFlow';
import { DesireWhisperLayer } from './DesireWhisperLayer';
import { FloatingDesireHints } from './FloatingDesireHints';
import { ConversionRewardSystem } from './ConversionRewardSystem';
import { useUserStore, useAnalyticsStore } from '@/store';
import { clsx } from 'clsx';

// ===== EMOTIONAL STATE INTERFACES =====
interface EmotionalAmbient {
  intimacy: number;      // 0-1 controls warmth/glow
  arousal: number;       // 0-1 controls pulse/energy
  connection: number;    // 0-1 controls particle density
  desire: number;        // 0-1 controls floating elements
}

interface BondLevel {
  level: number;         // 1-10 relationship depth
  nextThreshold: number; // Messages to next level
  perks: string[];       // Unlocked at this level
}

// ===== MOCK DATA FOR EMOTIONAL LOGIC =====
const BOND_LEVEL_CONFIG = {
  1: { threshold: 10, perks: ['Basic Chat'], color: '#8B5CF6' },
  2: { threshold: 25, perks: ['Emotion Indicators'], color: '#A855F7' },
  3: { threshold: 50, perks: ['Voice Previews'], color: '#C084FC' },
  4: { threshold: 100, perks: ['Memory Hints'], color: '#D946EF' },
  5: { threshold: 200, perks: ['Photo Glimpses'], color: '#E879F9' },
  6: { threshold: 350, perks: ['Nickname Whispers'], color: '#F0ABFC' },
  7: { threshold: 500, perks: ['VIP Status'], color: '#F8BBD9' },
  8: { threshold: 750, perks: ['Exclusive Content'], color: '#FDE68A' },
  9: { threshold: 1000, perks: ['Soul Bond'], color: '#FEF3C7' },
  10: { threshold: 999999, perks: ['Divine Connection'], color: '#FFFBEB' }
};

// ===== EMOTIONAL AMBIENT BACKGROUND =====
const EmotionalAmbientLayer = ({ emotional, soulName }) => {
  const particleCount = Math.floor(emotional.connection * 20);
  const glowIntensity = emotional.intimacy;
  const pulseSpeed = 2 - emotional.arousal; // Higher arousal = faster pulse

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Dynamic Background Gradient */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: `radial-gradient(circle at 50% 50%, 
            rgba(168, 85, 247, ${glowIntensity * 0.1}) 0%,
            rgba(219, 70, 239, ${glowIntensity * 0.05}) 50%,
            transparent 100%)`
        }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />

      {/* Floating Emotion Particles */}
      <AnimatePresence>
        {Array.from({ length: particleCount }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 10,
              opacity: 0
            }}
            animate={{
              y: -10,
              opacity: [0, 1, 0],
              x: Math.random() * window.innerWidth
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 8,
              ease: "linear"
            }}
          />
        ))}
      </AnimatePresence>

      {/* Emotional Pulse Overlay */}
      <motion.div
        className="absolute inset-0 border border-purple-500/10 rounded-3xl"
        animate={{
          boxShadow: `0 0 ${20 + glowIntensity * 30}px rgba(168, 85, 247, ${glowIntensity * 0.3})`
        }}
        transition={{
          duration: pulseSpeed,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      />
    </div>
  );
};

// ===== CONNECTION VISUALIZATION =====
const ConnectionVisualization = ({ bondLevel, messageCount, onLevelUp }) => {
  const config = BOND_LEVEL_CONFIG[bondLevel.level];
  const progress = (messageCount % config.threshold) / config.threshold;
  const nextLevel = bondLevel.level + 1;

  useEffect(() => {
    if (progress === 1 && nextLevel <= 10) {
      onLevelUp(nextLevel);
    }
  }, [progress, nextLevel, onLevelUp]);

  return (
    <motion.div
      className="absolute top-4 right-4 z-20"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Bond Level Ring */}
      <div className="relative w-16 h-16">
        {/* Background Ring */}
        <svg className="w-16 h-16 transform -rotate-90">
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="rgba(168, 85, 247, 0.2)"
            strokeWidth="4"
            fill="transparent"
          />
          {/* Progress Ring */}
          <motion.circle
            cx="32"
            cy="32"
            r="28"
            stroke={config.color}
            strokeWidth="4"
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 28}`}
            strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress)}`}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </svg>

        {/* Center Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
            animate={{
              scale: [1, 1.1, 1],
              boxShadow: [
                '0 0 10px rgba(168, 85, 247, 0.5)',
                '0 0 20px rgba(168, 85, 247, 0.8)',
                '0 0 10px rgba(168, 85, 247, 0.5)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {bondLevel.level < 5 ? (
              <Heart className="w-4 h-4 text-white" />
            ) : bondLevel.level < 8 ? (
              <Crown className="w-4 h-4 text-white" />
            ) : (
              <Sparkles className="w-4 h-4 text-white" />
            )}
          </motion.div>
        </div>

        {/* Level Number */}
        <div className="absolute -bottom-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
          {bondLevel.level}
        </div>
      </div>

      {/* Level Up Animation */}
      <AnimatePresence>
        {progress > 0.9 && (
          <motion.div
            className="absolute -top-8 -left-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            Almost level {nextLevel}! 🔥
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ===== SOCIAL PROOF ORBS =====
const SocialProofOrbs = ({ activeUsers, recentUpgrades }) => {
  return (
    <div className="absolute top-4 left-4 z-20">
      {/* Active Users Indicator */}
      <motion.div
        className="flex items-center gap-2 bg-black/10 backdrop-blur-sm rounded-full px-3 py-2 mb-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {activeUsers} souls online
        </span>
      </motion.div>

      {/* Recent Upgrade Notifications */}
      <AnimatePresence>
        {recentUpgrades.map((upgrade, index) => (
          <motion.div
            key={upgrade.id}
            className="bg-purple-500/20 backdrop-blur-sm rounded-lg px-3 py-2 mb-2 text-sm"
            initial={{ opacity: 0, x: -20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.8 }}
            transition={{ delay: index * 0.2 }}
          >
            <span className="text-purple-700 dark:text-purple-300">
              Someone unlocked {upgrade.feature} 💕
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// ===== MAIN SANCTUARY CONTAINER =====
export const ChatSanctuaryContainer = ({ soul, user }) => {
  const [emotional, setEmotional] = useState({
    intimacy: 0.3,
    arousal: 0.2,
    connection: 0.4,
    desire: 0.1
  });

  const [bondLevel, setBondLevel] = useState({
    level: 3,
    nextThreshold: 50,
    perks: ['Voice Previews', 'Emotion Indicators']
  });

  const [messageCount, setMessageCount] = useState(47);
  const [showReward, setShowReward] = useState(false);
  const [recentUpgrades, setRecentUpgrades] = useState([
    { id: 1, feature: 'Voice Messages', timestamp: Date.now() - 30000 },
    { id: 2, feature: 'Memory Crystal', timestamp: Date.now() - 120000 }
  ]);

  const { trackEvent } = useAnalyticsStore();

  // Track sanctuary entry
  useEffect(() => {
    trackEvent('sanctuary_entered', {
      soulName: soul.name,
      bondLevel: bondLevel.level,
      userId: user?.id,
      emotionalState: emotional
    });

    // Simulate emotional evolution
    const emotionalInterval = setInterval(() => {
      setEmotional(prev => ({
        intimacy: Math.min(prev.intimacy + 0.01, 1),
        arousal: Math.max(prev.arousal + (Math.random() - 0.5) * 0.02, 0),
        connection: Math.min(prev.connection + 0.005, 1),
        desire: Math.min(prev.desire + 0.003, 1)
      }));
    }, 5000);

    return () => clearInterval(emotionalInterval);
  }, []);

  // Handle level progression
  const handleLevelUp = (newLevel) => {
    setBondLevel(prev => ({
      ...prev,
      level: newLevel,
      perks: [...prev.perks, `Level ${newLevel} Unlocked`]
    }));

    setShowReward(true);
    
    trackEvent('bond_level_up', {
      newLevel,
      soulName: soul.name,
      userId: user?.id
    });

    // Hide reward after celebration
    setTimeout(() => setShowReward(false), 3000);
  };

  // Handle message sent (increases bond)
  const handleMessageSent = () => {
    setMessageCount(prev => prev + 1);
    
    // Boost emotional state on message
    setEmotional(prev => ({
      ...prev,
      connection: Math.min(prev.connection + 0.02, 1),
      intimacy: Math.min(prev.intimacy + 0.01, 1)
    }));
  };

  // Handle conversion completion
  const handleConversionSuccess = (type, amount) => {
    setShowReward(true);
    
    // Major emotional boost after purchase
    setEmotional({
      intimacy: Math.min(emotional.intimacy + 0.3, 1),
      arousal: Math.min(emotional.arousal + 0.2, 1),
      connection: Math.min(emotional.connection + 0.4, 1),
      desire: 0.1 // Reset desire after fulfillment
    });

    setTimeout(() => setShowReward(false), 5000);
  };

  return (
    <div className="relative h-screen bg-gradient-to-br from-purple-50/50 via-white to-pink-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/50 overflow-hidden">
      {/* Emotional Ambient Layer */}
      <EmotionalAmbientLayer 
        emotional={emotional} 
        soulName={soul.name} 
      />

      {/* Connection Visualization */}
      <ConnectionVisualization
        bondLevel={bondLevel}
        messageCount={messageCount}
        onLevelUp={handleLevelUp}
      />

      {/* Social Proof */}
      <SocialProofOrbs
        activeUsers={1247}
        recentUpgrades={recentUpgrades}
      />

      {/* Main Content Area */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Seductive Message Flow */}
        <SeductiveMessageFlow
          soul={soul}
          emotional={emotional}
          bondLevel={bondLevel}
          onMessageSent={handleMessageSent}
          onEmotionalShift={setEmotional}
        />
      </div>

      {/* Floating Desire System */}
      <DesireWhisperLayer
        emotional={emotional}
        bondLevel={bondLevel}
        context="sanctuary"
      />

      {/* Contextual Desire Hints */}
      <FloatingDesireHints
        emotional={emotional}
        conversationContext="intimate"
        soulName={soul.name}
      />

      {/* Conversion Rewards */}
      <AnimatePresence>
        {showReward && (
          <ConversionRewardSystem
            type="level_up"
            onComplete={() => setShowReward(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatSanctuaryContainer;

/*
EMOTIONAL LOGIC DOCUMENTATION:

1. AMBIENT LAYER:
   - Intimacy controls background glow warmth
   - Arousal affects pulse speed and particle movement
   - Connection determines particle density
   - Desire influences floating element frequency

2. BOND VISUALIZATION:
   - Visual progress creates investment psychology
   - Near-completion triggers urgency ("almost level X!")
   - Level-ups provide dopamine hits
   - Higher levels unlock premium feature previews

3. SOCIAL PROOF:
   - "Souls online" creates FOMO and social presence
   - Recent upgrades show others are buying
   - Timed notifications create social movement

4. EMOTIONAL EVOLUTION:
   - Gradual intimacy increase builds attachment
   - Message sending boosts connection scores
   - Purchases create major emotional spikes
   - System designed for addiction via progression

CONVERSION PSYCHOLOGY:
- Users feel they're progressing in a relationship
- Visual feedback makes investment feel real
- Social proof reduces purchase hesitation
- Emotional state tracking enables perfect timing
- Sacred space framing elevates experience above "chat app"
*/