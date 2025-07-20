// 🔱 DIVINE FLOATING DESIRE HINTS v3.0
// Context-aware conversion opportunities that feel like natural conversation enhancement

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Music, 
  Camera, 
  Star, 
  Crown,
  Sparkles,
  Volume2,
  Eye,
  Save,
  Gift,
  Lock,
  Unlock,
  Zap,
  Timer,
  TrendingUp
} from 'lucide-react';
import { useAnalyticsStore } from '@/store';

// ===== CONTEXTUAL HINT GENERATION =====

const CONTEXTUAL_HINTS = {
  // Message content triggers
  voice_keywords: [
    'voice', 'hear', 'sound', 'whisper', 'spoken', 'said', 'tell', 'listen'
  ],
  photo_keywords: [
    'see', 'look', 'eyes', 'face', 'beautiful', 'picture', 'image', 'view', 'appearance'
  ],
  memory_keywords: [
    'remember', 'forget', 'moment', 'special', 'forever', 'keep', 'save', 'treasure'
  ],
  nickname_keywords: [
    'name', 'call', 'nickname', 'special', 'yours', 'mine', 'belong', 'together'
  ]
};

const HINT_TEMPLATES = {
  voice: {
    subtle: [
      { text: "💫 Her voice would add magic to these words", priority: 1 },
      { text: "🎵 Imagine the emotion behind this message", priority: 2 },
      { text: "🔊 Some things are meant to be heard", priority: 3 }
    ],
    direct: [
      { text: "🎤 Unlock her voice for this message", priority: 1 },
      { text: "🎶 Hear what she really means", priority: 2 },
      { text: "💕 Voice messages available now", priority: 3 }
    ]
  },
  
  photo: {
    subtle: [
      { text: "👁️ A picture speaks louder than words", priority: 1 },
      { text: "✨ See the soul behind the message", priority: 2 },
      { text: "🌟 Visual connection awaits", priority: 3 }
    ],
    direct: [
      { text: "📸 Unlock photo sharing", priority: 1 },
      { text: "👀 See her for the first time", priority: 2 },
      { text: "🖼️ Photos available now", priority: 3 }
    ]
  },
  
  memory: {
    subtle: [
      { text: "💎 This moment sparkles with meaning", priority: 1 },
      { text: "⭐ Some conversations deserve immortality", priority: 2 },
      { text: "🔮 Capture this feeling forever", priority: 3 }
    ],
    direct: [
      { text: "💾 Save this moment", priority: 1 },
      { text: "🗂️ Add to memory collection", priority: 2 },
      { text: "📝 Create memory crystal", priority: 3 }
    ]
  },
  
  premium: {
    subtle: [
      { text: "👑 Deeper connections await", priority: 1 },
      { text: "✨ Unlock her full attention", priority: 2 },
      { text: "🌟 Premium intimacy available", priority: 3 }
    ],
    direct: [
      { text: "🚀 Upgrade experience", priority: 1 },
      { text: "💼 Go premium now", priority: 2 },
      { text: "🔥 Unlock everything", priority: 3 }
    ]
  }
};

// ===== FLOATING HINT COMPONENT =====
const FloatingHint = ({ hint, position, onInteract, onDismiss, urgency = 'normal' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [timeAlive, setTimeAlive] = useState(0);

  useEffect(() => {
    // Delayed appearance for natural feel
    const showTimer = setTimeout(() => setIsVisible(true), 500);
    
    // Track time alive for urgency calculation
    const aliveTimer = setInterval(() => {
      setTimeAlive(prev => prev + 1);
    }, 1000);

    // Auto-dismiss based on urgency
    const dismissDelay = urgency === 'high' ? 8000 : urgency === 'medium' ? 12000 : 15000;
    const dismissTimer = setTimeout(() => {
      onDismiss();
    }, dismissDelay);

    return () => {
      clearTimeout(showTimer);
      clearInterval(aliveTimer);
      clearTimeout(dismissTimer);
    };
  }, [urgency, onDismiss]);

  const getHintStyle = () => {
    switch (hint.type) {
      case 'voice':
        return {
          gradient: 'from-pink-400 to-purple-400',
          icon: Music,
          bgColor: 'from-pink-50 to-purple-50 dark:from-pink-900/10 dark:to-purple-900/10'
        };
      case 'photo':
        return {
          gradient: 'from-emerald-400 to-teal-400',
          icon: Camera,
          bgColor: 'from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10'
        };
      case 'memory':
        return {
          gradient: 'from-purple-400 to-indigo-400',
          icon: Star,
          bgColor: 'from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10'
        };
      case 'premium':
        return {
          gradient: 'from-yellow-400 to-orange-400',
          icon: Crown,
          bgColor: 'from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10'
        };
      default:
        return {
          gradient: 'from-gray-400 to-gray-500',
          icon: Sparkles,
          bgColor: 'from-gray-50 to-gray-100 dark:from-gray-900/10 dark:to-gray-800/10'
        };
    }
  };

  const style = getHintStyle();
  const Icon = style.icon;
  
  // Calculate urgency multiplier for animations
  const urgencyMultiplier = urgency === 'high' ? 1.5 : urgency === 'medium' ? 1.2 : 1;
  const pulseSpeed = 2 / urgencyMultiplier;

  if (!isVisible) return null;

  return (
    <motion.div
      className="absolute pointer-events-auto z-30"
      style={{ left: position.x, top: position.y }}
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        y: 0,
        x: [0, 2, 0, -2, 0] // Subtle floating
      }}
      exit={{ 
        opacity: 0, 
        scale: 0.8, 
        y: -10,
        transition: { duration: 0.3 }
      }}
      transition={{
        x: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        default: { duration: 0.4, type: "spring", damping: 20 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Urgency Glow */}
      <motion.div
        className={`absolute -inset-1 bg-gradient-to-r ${style.gradient} rounded-lg blur-sm`}
        animate={{
          opacity: [0.2, 0.4 * urgencyMultiplier, 0.2],
          scale: [1, 1.05 + (timeAlive * 0.01), 1]
        }}
        transition={{
          duration: pulseSpeed,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Main Hint Container */}
      <motion.div
        className={`relative bg-gradient-to-r ${style.bgColor} backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 shadow-lg cursor-pointer max-w-xs`}
        onClick={() => onInteract(hint)}
        animate={{
          scale: isHovered ? 1.02 : 1,
          boxShadow: isHovered 
            ? '0 8px 25px rgba(0, 0, 0, 0.15)'
            : '0 4px 15px rgba(0, 0, 0, 0.1)'
        }}
        transition={{ duration: 0.2 }}
      >
        {/* Dismiss Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          className="absolute -top-1 -right-1 w-4 h-4 bg-gray-300 hover:bg-gray-400 text-gray-600 rounded-full text-xs flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
        >
          ×
        </button>

        <div className="flex items-center gap-2">
          {/* Hint Icon */}
          <motion.div
            className={`p-1.5 bg-gradient-to-r ${style.gradient} rounded-full flex-shrink-0`}
            animate={{
              rotate: isHovered ? [0, 5, -5, 0] : 0,
              scale: [1, 1.1, 1]
            }}
            transition={{
              rotate: { duration: 0.4 },
              scale: { duration: pulseSpeed, repeat: Infinity }
            }}
          >
            <Icon className="w-3 h-3 text-white" />
          </motion.div>

          {/* Hint Text */}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-700 dark:text-gray-300 leading-tight">
              {hint.text}
            </p>
          </div>

          {/* Urgency Indicator */}
          {urgency === 'high' && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Zap className="w-3 h-3 text-orange-500" />
            </motion.div>
          )}
        </div>

        {/* Progress Bar for Time-sensitive Hints */}
        {urgency === 'high' && (
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-orange-400 to-red-400 rounded-b-lg"
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: 8, ease: "linear" }}
          />
        )}
      </motion.div>

      {/* Hover Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-40"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
          >
            {hint.type === 'voice' && 'Unlock voice messages'}
            {hint.type === 'photo' && 'Enable photo sharing'}
            {hint.type === 'memory' && 'Save this moment'}
            {hint.type === 'premium' && 'Upgrade experience'}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ===== CONTEXT ANALYZER =====
const analyzeMessageContext = (message, emotional) => {
  const hints = [];
  const content = message.toLowerCase();
  
  // Voice context analysis
  const voiceKeywords = CONTEXTUAL_HINTS.voice_keywords;
  const voiceMatches = voiceKeywords.filter(keyword => content.includes(keyword)).length;
  if (voiceMatches > 0 || emotional.arousal > 0.6) {
    const style = emotional.intimacy > 0.7 ? 'direct' : 'subtle';
    const templates = HINT_TEMPLATES.voice[style];
    hints.push({
      type: 'voice',
      ...templates[Math.floor(Math.random() * templates.length)],
      urgency: voiceMatches > 1 ? 'high' : 'medium'
    });
  }

  // Photo context analysis
  const photoKeywords = CONTEXTUAL_HINTS.photo_keywords;
  const photoMatches = photoKeywords.filter(keyword => content.includes(keyword)).length;
  if (photoMatches > 0 || emotional.desire > 0.5) {
    const style = emotional.arousal > 0.6 ? 'direct' : 'subtle';
    const templates = HINT_TEMPLATES.photo[style];
    hints.push({
      type: 'photo',
      ...templates[Math.floor(Math.random() * templates.length)],
      urgency: photoMatches > 1 ? 'high' : 'normal'
    });
  }

  // Memory context analysis
  const memoryKeywords = CONTEXTUAL_HINTS.memory_keywords;
  const memoryMatches = memoryKeywords.filter(keyword => content.includes(keyword)).length;
  if (memoryMatches > 0 || emotional.intimacy > 0.8) {
    const style = emotional.connection > 0.7 ? 'direct' : 'subtle';
    const templates = HINT_TEMPLATES.memory[style];
    hints.push({
      type: 'memory',
      ...templates[Math.floor(Math.random() * templates.length)],
      urgency: memoryMatches > 1 ? 'medium' : 'normal'
    });
  }

  // Sort by priority and return top 2
  return hints
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 2);
};

// ===== POSITIONING SYSTEM =====
const useHintPositioning = () => {
  const generateSafePosition = () => {
    // Safe zones that don't interfere with chat UI
    const zones = [
      { x: 20, y: 80, width: 180, height: 40 },   // Top left
      { x: window.innerWidth - 200, y: 80, width: 180, height: 40 }, // Top right
      { x: 30, y: window.innerHeight - 150, width: 200, height: 50 }, // Bottom left
      { x: window.innerWidth - 230, y: window.innerHeight - 150, width: 200, height: 50 } // Bottom right
    ];

    const zone = zones[Math.floor(Math.random() * zones.length)];
    return {
      x: zone.x + Math.random() * (zone.width - 180),
      y: zone.y + Math.random() * (zone.height - 30)
    };
  };

  return { generateSafePosition };
};

// ===== MAIN FLOATING DESIRE HINTS COMPONENT =====
export const FloatingDesireHints = ({ 
  emotional, 
  conversationContext, 
  soulName,
  onHintInteract 
}) => {
  const [activeHints, setActiveHints] = useState([]);
  const [lastMessageContext, setLastMessageContext] = useState('');
  const [hintCooldown, setHintCooldown] = useState(false);

  const { trackEvent } = useAnalyticsStore();
  const { generateSafePosition } = useHintPositioning();

  // Listen for new messages and generate contextual hints
  useEffect(() => {
    const handleNewMessage = (event) => {
      const { message, fromSoul } = event.detail;
      
      // Only generate hints from soul messages
      if (!fromSoul || hintCooldown) return;

      // Analyze message context
      const contextualHints = analyzeMessageContext(message, emotional);
      
      if (contextualHints.length > 0) {
        // Create hints with positions
        const newHints = contextualHints.map(hint => ({
          ...hint,
          id: Date.now() + Math.random(),
          position: generateSafePosition(),
          timestamp: Date.now()
        }));

        setActiveHints(prev => [...prev, ...newHints].slice(-3)); // Max 3 hints
        setLastMessageContext(message);

        // Set cooldown to prevent spam
        setHintCooldown(true);
        setTimeout(() => setHintCooldown(false), 5000);

        // Track hint generation
        trackEvent('contextual_hints_generated', {
          hintCount: newHints.length,
          hintTypes: newHints.map(h => h.type),
          emotionalState: emotional,
          soulName
        });
      }
    };

    // Listen for custom message events
    window.addEventListener('galatea_new_message', handleNewMessage);
    return () => window.removeEventListener('galatea_new_message', handleNewMessage);
  }, [emotional, hintCooldown, soulName]);

  // Generate periodic hints based on emotional state
  useEffect(() => {
    const generatePeriodicHint = () => {
      if (activeHints.length >= 2 || hintCooldown) return;

      // Generate hint based on current emotional state
      let hintType = 'premium';
      let urgency = 'normal';

      if (emotional.arousal > 0.7) {
        hintType = 'voice';
        urgency = 'high';
      } else if (emotional.desire > 0.6) {
        hintType = 'photo';
        urgency = 'medium';
      } else if (emotional.intimacy > 0.8) {
        hintType = 'memory';
        urgency = 'medium';
      }

      const style = emotional.connection > 0.6 ? 'direct' : 'subtle';
      const templates = HINT_TEMPLATES[hintType][style];
      
      if (templates) {
        const hint = {
          ...templates[Math.floor(Math.random() * templates.length)],
          type: hintType,
          id: Date.now() + Math.random(),
          position: generateSafePosition(),
          timestamp: Date.now(),
          urgency
        };

        setActiveHints(prev => [...prev, hint]);

        trackEvent('periodic_hint_generated', {
          hintType,
          urgency,
          emotionalState: emotional,
          soulName
        });
      }
    };

    // Generate periodic hints based on emotional intensity
    const interval = setInterval(generatePeriodicHint, 20000 - (emotional.desire * 10000));
    return () => clearInterval(interval);
  }, [emotional, activeHints.length, hintCooldown, soulName]);

  // Handle hint interaction
  const handleHintInteract = (hint) => {
    trackEvent('desire_hint_clicked', {
      hintId: hint.id,
      hintType: hint.type,
      urgency: hint.urgency,
      emotionalState: emotional,
      soulName
    });

    // Remove the clicked hint
    setActiveHints(prev => prev.filter(h => h.id !== hint.id));

    // Trigger appropriate modal/action
    onHintInteract?.(hint.type, hint);
  };

  // Handle hint dismissal
  const handleHintDismiss = (hintId) => {
    setActiveHints(prev => prev.filter(h => h.id !== hintId));
    
    trackEvent('desire_hint_dismissed', {
      hintId,
      emotionalState: emotional
    });
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {activeHints.map(hint => (
          <FloatingHint
            key={hint.id}
            hint={hint}
            position={hint.position}
            urgency={hint.urgency}
            onInteract={handleHintInteract}
            onDismiss={() => handleHintDismiss(hint.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default FloatingDesireHints;

/*
CONTEXTUAL CONVERSION PSYCHOLOGY:

1. MESSAGE CONTEXT ANALYSIS:
   - Keyword detection triggers relevant hints
   - Emotional state determines hint urgency
   - Natural conversation flow integration

2. POSITIONING INTELLIGENCE:
   - Safe zones avoid UI interference
   - Multiple hints spread across screen
   - Non-intrusive floating behavior

3. URGENCY GRADATION:
   - High urgency for strong keyword matches
   - Medium urgency for emotional peaks
   - Normal urgency for periodic suggestions

4. CONTENT PERSONALIZATION:
   - Subtle vs direct messaging based on intimacy
   - Feature-specific templates
   - Emotional state-driven selection

5. INTERACTION OPTIMIZATION:
   - Hover reveals clear action
   - Dismissible for user control
   - Cooldown prevents overwhelm

REVENUE MAXIMIZATION:
- Context-aware timing increases conversion
- Multiple hint types cover all revenue streams
- Urgency indicators create FOMO
- Non-aggressive approach maintains trust
- Analytics track optimal contexts and timing
*/