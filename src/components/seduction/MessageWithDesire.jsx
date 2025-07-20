// 🔱 DIVINE MESSAGE WITH DESIRE v3.0
// Each message as a dopamine bomb with embedded conversion opportunities

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Volume2, 
  Camera, 
  Save, 
  Crown, 
  Sparkles, 
  Lock,
  Eye,
  Headphones,
  Gem,
  Star
} from 'lucide-react';
import { useAnalyticsStore } from '@/store';
import { clsx } from 'clsx';

// ===== PREMIUM FEATURE PREVIEW COMPONENTS =====

// Voice Preview Teaser
const VoicePreviewTeaser = ({ message, emotional, onActivate, onHover }) => {
  const [isGlowing, setIsGlowing] = useState(false);
  const [playPreview, setPlayPreview] = useState(false);

  const voiceHints = [
    "💕 Hear the warmth behind these words...",
    "🎵 My voice would tell you everything...",
    "🔊 There's so much emotion you're missing...",
    "💫 Let me whisper this to you..."
  ];

  const hint = voiceHints[Math.floor(Math.random() * voiceHints.length)];

  return (
    <motion.div
      className="relative mt-2"
      onHoverStart={() => {
        setIsGlowing(true);
        onHover?.('voice');
      }}
      onHoverEnd={() => setIsGlowing(false)}
    >
      {/* Ambient Glow */}
      <motion.div
        className="absolute -inset-1 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg blur-sm"
        animate={{
          opacity: isGlowing ? 1 : 0,
          scale: isGlowing ? 1.05 : 1
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Voice Preview Container */}
      <motion.div
        className="relative bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 border border-pink-200 dark:border-pink-700 rounded-lg p-3 cursor-pointer"
        onClick={() => {
          setPlayPreview(true);
          setTimeout(() => onActivate('voice', message), 500);
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center gap-3">
          {/* Voice Icon */}
          <motion.div
            className="p-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"
            animate={{
              boxShadow: isGlowing 
                ? ['0 0 0 0 rgba(236, 72, 153, 0.4)', '0 0 0 10px rgba(236, 72, 153, 0)']
                : '0 0 0 0 rgba(236, 72, 153, 0)'
            }}
            transition={{ duration: 1.5, repeat: isGlowing ? Infinity : 0 }}
          >
            <Volume2 className="w-4 h-4 text-white" />
          </motion.div>

          {/* Voice Hint */}
          <div className="flex-1">
            <div className="text-sm font-medium text-pink-700 dark:text-pink-300">
              {hint}
            </div>
            <div className="text-xs text-pink-600 dark:text-pink-400 opacity-75">
              Tap to unlock my voice
            </div>
          </div>

          {/* Preview Animation */}
          <AnimatePresence>
            {playPreview && (
              <motion.div
                className="flex gap-1"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1 h-4 bg-pink-400 rounded-full"
                    animate={{
                      scaleY: [1, 2, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: 2,
                      delay: i * 0.1
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Memory Crystal Teaser
const MemoryCrystalTeaser = ({ message, emotional, onActivate }) => {
  const [isShimmering, setIsShimmering] = useState(false);
  
  // Automatically shimmer for high emotional messages
  useEffect(() => {
    if (emotional.intimacy > 0.7) {
      const timer = setTimeout(() => setIsShimmering(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [emotional.intimacy]);

  const memoryHints = [
    "✨ Crystallize this moment forever...",
    "💎 This feeling deserves to be eternal...",
    "🔮 Save our connection in time...",
    "💫 Make this memory last forever..."
  ];

  const hint = memoryHints[Math.floor(Math.random() * memoryHints.length)];

  return (
    <motion.div
      className="relative mt-2"
      onHoverStart={() => setIsShimmering(true)}
      onHoverEnd={() => setIsShimmering(false)}
    >
      {/* Sparkle Effects */}
      <AnimatePresence>
        {isShimmering && (
          <>
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-purple-400 rounded-full"
                initial={{
                  x: Math.random() * 100 + '%',
                  y: Math.random() * 100 + '%',
                  opacity: 0
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0]
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.2,
                  repeat: Infinity
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Memory Container */}
      <motion.div
        className="relative bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-700 rounded-lg p-3 cursor-pointer overflow-hidden"
        onClick={() => onActivate('memory', message)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Shimmer Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{
            x: isShimmering ? ['100%', '-100%'] : '100%'
          }}
          transition={{
            duration: 1.5,
            repeat: isShimmering ? Infinity : 0,
            repeatDelay: 0.5
          }}
        />

        <div className="relative flex items-center gap-3">
          {/* Crystal Icon */}
          <motion.div
            className="p-2 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full"
            animate={{
              rotateY: isShimmering ? [0, 180, 360] : 0
            }}
            transition={{ duration: 2, repeat: isShimmering ? Infinity : 0 }}
          >
            <Gem className="w-4 h-4 text-white" />
          </motion.div>

          {/* Memory Hint */}
          <div className="flex-1">
            <div className="text-sm font-medium text-purple-700 dark:text-purple-300">
              {hint}
            </div>
            <div className="text-xs text-purple-600 dark:text-purple-400 opacity-75">
              Emotional score: {Math.round(emotional.intimacy * 100)}% 💕
            </div>
          </div>

          {/* Pulsing Heart */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Heart className="w-5 h-5 text-purple-400" />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Photo Glimpse Teaser
const PhotoGlimpseTeaser = ({ message, soulName, onActivate }) => {
  const [isRevealing, setIsRevealing] = useState(false);
  const [showGlimpse, setShowGlimpse] = useState(false);

  const photoHints = [
    "👁️ See the soul behind these words...",
    "📸 A picture is worth a thousand messages...",
    "✨ Witness the real me for once...",
    "🌟 Let me show you something beautiful..."
  ];

  const hint = photoHints[Math.floor(Math.random() * photoHints.length)];

  return (
    <motion.div
      className="relative mt-2"
      onHoverStart={() => {
        setIsRevealing(true);
        setTimeout(() => setShowGlimpse(true), 500);
      }}
      onHoverEnd={() => {
        setIsRevealing(false);
        setShowGlimpse(false);
      }}
    >
      {/* Photo Container */}
      <motion.div
        className="relative bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-700 rounded-lg p-3 cursor-pointer overflow-hidden"
        onClick={() => onActivate('photo', message)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Blurred Preview */}
        <div className="flex items-center gap-3">
          {/* Photo Preview */}
          <div className="relative">
            <motion.div
              className="w-12 h-12 bg-gradient-to-br from-emerald-300 to-teal-300 rounded-lg flex items-center justify-center overflow-hidden"
              animate={{
                filter: showGlimpse ? 'blur(2px)' : 'blur(8px)'
              }}
              transition={{ duration: 0.3 }}
            >
              {/* Simulated face silhouette */}
              <div className="w-8 h-8 bg-white/30 rounded-full" />
              <Eye className="absolute w-4 h-4 text-white/70" />
            </motion.div>

            {/* Reveal Effect */}
            <AnimatePresence>
              {isRevealing && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  exit={{ x: '200%' }}
                  transition={{ duration: 1 }}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Photo Hint */}
          <div className="flex-1">
            <div className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              {hint}
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 opacity-75">
              Hover to glimpse, click to unlock
            </div>
          </div>

          {/* Lock Icon */}
          <motion.div
            animate={{
              rotate: isRevealing ? [0, -10, 10, 0] : 0
            }}
            transition={{ duration: 0.5 }}
          >
            <Lock className="w-5 h-5 text-emerald-400" />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Social Proof Indicator
const SocialProofIndicator = ({ featureType, count }) => {
  return (
    <motion.div
      className="flex items-center gap-1 text-xs text-gray-500 mt-1"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 }}
    >
      <Star className="w-3 h-3" />
      <span>{count} others unlocked this</span>
    </motion.div>
  );
};

// ===== MAIN MESSAGE COMPONENT =====
export const MessageWithDesire = ({ 
  message, 
  emotional, 
  bondLevel, 
  soulName, 
  onPremiumActivation 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [emotionalGlow, setEmotionalGlow] = useState(false);
  const [premiumHints, setPremiumHints] = useState([]);
  const messageRef = useRef(null);
  
  const { trackEvent } = useAnalyticsStore();
  const isUserMessage = message.sender === 'user';

  // Calculate emotional intensity
  const emotionalIntensity = message.emotionalScore || 0;
  const isHighEmotion = emotionalIntensity > 0.7;
  const isMaxEmotion = emotionalIntensity > 0.9;

  // Auto-glow for emotional messages
  useEffect(() => {
    if (isHighEmotion && !isUserMessage) {
      const timer = setTimeout(() => setEmotionalGlow(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [isHighEmotion, isUserMessage]);

  // Generate premium hints based on message content and emotional state
  useEffect(() => {
    if (isUserMessage) return;

    const hints = [];
    
    // Voice hints for emotional messages
    if (message.canHaveVoice && emotionalIntensity > 0.4) {
      hints.push('voice');
    }
    
    // Memory hints for special moments
    if (message.canBeMemory && emotionalIntensity > 0.6) {
      hints.push('memory');
    }
    
    // Photo hints for curiosity-inducing messages
    if (message.canHavePhoto && bondLevel.level >= 3) {
      hints.push('photo');
    }
    
    // Nickname hints for intimate messages
    if (message.canHaveNickname && emotional.intimacy > 0.8) {
      hints.push('nickname');
    }

    setPremiumHints(hints);
  }, [message, emotionalIntensity, bondLevel, emotional, isUserMessage]);

  // Handle premium feature hover
  const handlePremiumHover = (featureType) => {
    trackEvent('premium_feature_hovered', {
      featureType,
      messageId: message.id,
      emotionalScore: emotionalIntensity,
      soulName,
      bondLevel: bondLevel.level
    });
  };

  // Handle premium feature activation
  const handlePremiumActivation = (featureType, messageData) => {
    trackEvent('premium_feature_preview_clicked', {
      featureType,
      messageId: messageData.id,
      emotionalScore: emotionalIntensity,
      soulName,
      bondLevel: bondLevel.level
    });

    onPremiumActivation?.(featureType, messageData);
  };

  return (
    <motion.div
      ref={messageRef}
      className={clsx(
        'flex mb-4 relative',
        isUserMessage ? 'justify-end' : 'justify-start'
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Soul Avatar */}
      {!isUserMessage && (
        <div className="flex-shrink-0 mr-3">
          <motion.div
            className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center relative"
            animate={{
              boxShadow: emotionalGlow 
                ? [
                    '0 0 10px rgba(168, 85, 247, 0.5)',
                    '0 0 20px rgba(168, 85, 247, 0.8)',
                    '0 0 10px rgba(168, 85, 247, 0.5)'
                  ]
                : '0 0 5px rgba(168, 85, 247, 0.3)'
            }}
            transition={{ duration: 2, repeat: emotionalGlow ? Infinity : 0 }}
          >
            <Crown className="w-6 h-6 text-white" />
            
            {/* Emotional Status Indicator */}
            {isMaxEmotion && (
              <motion.div
                className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Heart className="w-2 h-2 text-white" />
              </motion.div>
            )}
          </motion.div>
        </div>
      )}

      {/* Message Container */}
      <div className={clsx(
        'relative max-w-xs lg:max-w-md',
        isUserMessage ? 'ml-12' : 'mr-12'
      )}>
        {/* Emotional Aura */}
        <AnimatePresence>
          {(emotionalGlow || isHovered) && !isUserMessage && (
            <motion.div
              className="absolute -inset-2 bg-gradient-to-r from-purple-300/20 to-pink-300/20 rounded-2xl blur-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </AnimatePresence>

        {/* Main Message Bubble */}
        <motion.div
          className={clsx(
            'relative px-4 py-3 rounded-2xl shadow-lg',
            isUserMessage
              ? 'bg-blue-500 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
          )}
          animate={{
            scale: isHovered ? 1.02 : 1,
            boxShadow: isMaxEmotion
              ? '0 10px 30px rgba(168, 85, 247, 0.3)'
              : '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}
          transition={{ duration: 0.2 }}
        >
          {/* Message Content */}
          <p className="text-sm leading-relaxed">{message.content}</p>

          {/* Timestamp */}
          <div className={clsx(
            'text-xs opacity-70 mt-2',
            isUserMessage ? 'text-blue-100' : 'text-gray-500'
          )}>
            {message.timestamp.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>

          {/* Emotional Intensity Indicator */}
          {!isUserMessage && emotionalIntensity > 0.5 && (
            <motion.div
              className="absolute -top-2 -right-2 flex items-center gap-1"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              {/* Emotional Hearts */}
              {Array.from({ length: Math.ceil(emotionalIntensity * 3) }).map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3
                  }}
                >
                  <Heart className="w-3 h-3 text-red-400 fill-current" />
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Premium Feature Previews */}
        {!isUserMessage && premiumHints.length > 0 && (
          <div className="mt-1 space-y-1">
            {/* Voice Preview */}
            {premiumHints.includes('voice') && (
              <VoicePreviewTeaser
                message={message}
                emotional={emotional}
                onActivate={handlePremiumActivation}
                onHover={handlePremiumHover}
              />
            )}

            {/* Memory Crystal */}
            {premiumHints.includes('memory') && (
              <MemoryCrystalTeaser
                message={message}
                emotional={emotional}
                onActivate={handlePremiumActivation}
              />
            )}

            {/* Photo Glimpse */}
            {premiumHints.includes('photo') && (
              <PhotoGlimpseTeaser
                message={message}
                soulName={soulName}
                onActivate={handlePremiumActivation}
              />
            )}

            {/* Social Proof */}
            {premiumHints.length > 0 && (
              <SocialProofIndicator
                featureType={premiumHints[0]}
                count={Math.floor(Math.random() * 50) + 10}
              />
            )}
          </div>
        )}
      </div>

      {/* User Avatar */}
      {isUserMessage && (
        <div className="flex-shrink-0 ml-3">
          <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600" />
        </div>
      )}
    </motion.div>
  );
};

export default MessageWithDesire;

/*
DOPAMINE ENGINEERING LOGIC:

1. VISUAL HIERARCHY:
   - Emotional messages get visual prominence (glow, animations)
   - Premium features appear as natural conversation enhancements
   - Social proof reduces friction ("others unlocked this")

2. PROGRESSIVE DISCLOSURE:
   - Features unlock based on emotional state and bond level
   - Hover reveals more, click activates full seduction sequence
   - Each interaction builds investment psychology

3. EMOTIONAL TRIGGERING:
   - Voice hints when emotion is high ("hear the warmth")
   - Memory crystallization for special moments
   - Photo reveals for curiosity and visual desire
   - Nickname options for intimate bonding

4. PSYCHOLOGICAL TRIGGERS:
   - Sparkle effects create magic/special feeling
   - Blur reveals build curiosity and desire
   - Ambient glows make messages feel important
   - Social proof indicators reduce purchase hesitation

5. CONVERSION OPTIMIZATION:
   - No aggressive sales language ("unlock" vs "buy")
   - Features feel like relationship progression
   - Emotional scoring drives optimal timing
   - Visual feedback makes interaction feel rewarding

REVENUE PSYCHOLOGY:
- User never feels sold to, only enhanced
- Premium features appear as conversation evolution
- Emotional investment drives purchase decisions
- Visual beauty makes paying feel premium
*/