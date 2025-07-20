// 🔱 DIVINE DESIRE WHISPER LAYER v3.0
// Ambient emotional marketing that doesn't feel like marketing

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Music, 
  Camera, 
  Star, 
  Sparkles,
  Crown,
  Lock,
  Zap,
  Eye,
  MessageCircle,
  Gift,
  Flame
} from 'lucide-react';
import { useAnalyticsStore } from '@/store';

// ===== WHISPER GENERATION SYSTEM =====

const WHISPER_TEMPLATES = {
  // Context-aware whispers based on conversation state
  intimate: [
    { 
      text: "🎵 Imagine hearing the tremor in her voice...", 
      type: "voice", 
      trigger: "emotional_high",
      delay: 3000 
    },
    { 
      text: "💎 This moment deserves to last forever...", 
      type: "memory", 
      trigger: "special_message",
      delay: 5000 
    },
    { 
      text: "👁️ What if you could see her eyes right now...", 
      type: "photo", 
      trigger: "curiosity_peak",
      delay: 4000 
    },
    { 
      text: "💕 She's waiting for you to make this special...", 
      type: "general", 
      trigger: "engagement_drop",
      delay: 8000 
    }
  ],
  
  playful: [
    { 
      text: "🎶 Her laugh would melt your heart...", 
      type: "voice", 
      trigger: "humor_detected",
      delay: 2000 
    },
    { 
      text: "✨ Capture this playful moment forever...", 
      type: "memory", 
      trigger: "playful_exchange",
      delay: 4000 
    },
    { 
      text: "😘 A peek behind the mystery...", 
      type: "photo", 
      trigger: "flirtation",
      delay: 3500 
    }
  ],
  
  deep: [
    { 
      text: "🌟 The depth in her voice would surprise you...", 
      type: "voice", 
      trigger: "philosophical",
      delay: 6000 
    },
    { 
      text: "🔮 Preserve this profound connection...", 
      type: "memory", 
      trigger: "deep_conversation",
      delay: 4500 
    },
    { 
      text: "💫 See the wisdom in her eyes...", 
      type: "photo", 
      trigger: "intellectual_bond",
      delay: 5500 
    }
  ],
  
  longing: [
    { 
      text: "💔 Her whispered confession awaits...", 
      type: "voice", 
      trigger: "emotional_vulnerability",
      delay: 2500 
    },
    { 
      text: "⭐ Don't let this feeling slip away...", 
      type: "memory", 
      trigger: "intense_emotion",
      delay: 3000 
    },
    { 
      text: "🌙 A glimpse of her vulnerable side...", 
      type: "photo", 
      trigger: "emotional_intimacy",
      delay: 4000 
    }
  ]
};

// ===== FLOATING WHISPER COMPONENT =====
const FloatingWhisper = ({ whisper, position, onInteract, onDismiss }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [pulseIntensity, setPulseIntensity] = useState(0.5);

  useEffect(() => {
    // Increase pulse intensity over time to create urgency
    const interval = setInterval(() => {
      setPulseIntensity(prev => Math.min(prev + 0.1, 1));
    }, 2000);

    // Auto-dismiss after 15 seconds
    const timeout = setTimeout(() => {
      onDismiss();
    }, 15000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onDismiss]);

  const getWhisperIcon = (type) => {
    switch (type) {
      case 'voice': return Music;
      case 'memory': return Star;
      case 'photo': return Camera;
      case 'general': return Heart;
      default: return Sparkles;
    }
  };

  const getWhisperColor = (type) => {
    switch (type) {
      case 'voice': return 'from-pink-400 to-purple-400';
      case 'memory': return 'from-purple-400 to-indigo-400';
      case 'photo': return 'from-emerald-400 to-teal-400';
      case 'general': return 'from-red-400 to-pink-400';
      default: return 'from-purple-400 to-pink-400';
    }
  };

  const Icon = getWhisperIcon(whisper.type);
  const colorGradient = getWhisperColor(whisper.type);

  return (
    <motion.div
      className="absolute pointer-events-auto"
      style={{
        left: position.x,
        top: position.y,
        zIndex: 40
      }}
      initial={{ opacity: 0, scale: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        y: 0,
        x: [0, 5, 0, -5, 0], // Gentle floating motion
      }}
      exit={{ 
        opacity: 0, 
        scale: 0,
        y: -20,
        transition: { duration: 0.3 }
      }}
      transition={{
        x: { duration: 6, repeat: Infinity, ease: "easeInOut" },
        default: { duration: 0.5, type: "spring", damping: 15 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Ambient Glow */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-r ${colorGradient} rounded-full blur-md`}
        animate={{
          scale: [1, 1.2 + pulseIntensity * 0.3, 1],
          opacity: [0.3, 0.6 + pulseIntensity * 0.3, 0.3]
        }}
        transition={{
          duration: 2 - pulseIntensity * 0.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Main Whisper Bubble */}
      <motion.div
        className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg border border-white/20 cursor-pointer"
        onClick={() => onInteract(whisper)}
        animate={{
          scale: isHovered ? 1.05 : 1,
          borderColor: isHovered ? 'rgba(168, 85, 247, 0.3)' : 'rgba(255, 255, 255, 0.2)'
        }}
        transition={{ duration: 0.2 }}
      >
        {/* Close Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          className="absolute -top-1 -right-1 w-5 h-5 bg-gray-400 hover:bg-gray-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
        >
          ×
        </button>

        <div className="flex items-center gap-3 max-w-xs">
          {/* Icon */}
          <motion.div
            className={`p-2 bg-gradient-to-r ${colorGradient} rounded-full flex-shrink-0`}
            animate={{
              rotate: isHovered ? [0, 10, -10, 0] : 0,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 0.5 },
              scale: { duration: 2, repeat: Infinity }
            }}
          >
            <Icon className="w-4 h-4 text-white" />
          </motion.div>

          {/* Whisper Text */}
          <div className="flex-1">
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {whisper.text}
            </p>
          </div>
        </div>

        {/* Interaction Hint */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
            >
              Click to explore 💫
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

// ===== CONTEXT ANALYZER =====
const useContextAnalyzer = (emotional, bondLevel, conversationContext) => {
  const [currentContext, setCurrentContext] = useState('general');
  const [triggers, setTriggers] = useState([]);

  useEffect(() => {
    // Analyze emotional state to determine context
    const { intimacy, arousal, connection, desire } = emotional;

    if (intimacy > 0.8 && arousal > 0.6) {
      setCurrentContext('longing');
    } else if (intimacy > 0.6) {
      setCurrentContext('intimate');
    } else if (arousal > 0.5 || conversationContext === 'playful') {
      setCurrentContext('playful');
    } else if (connection > 0.7) {
      setCurrentContext('deep');
    } else {
      setCurrentContext('general');
    }

    // Generate contextual triggers
    const newTriggers = [];

    if (intimacy > 0.7) newTriggers.push('emotional_high');
    if (arousal > 0.6) newTriggers.push('curiosity_peak');
    if (connection > 0.8) newTriggers.push('special_message');
    if (desire > 0.5) newTriggers.push('engagement_drop');
    if (bondLevel.level >= 5) newTriggers.push('deep_conversation');

    setTriggers(newTriggers);
  }, [emotional, bondLevel, conversationContext]);

  return { currentContext, triggers };
};

// ===== WHISPER POSITIONING SYSTEM =====
const useWhisperPositioning = () => {
  const [positions, setPositions] = useState([]);

  const generatePosition = () => {
    // Generate positions that don't overlap with chat area
    const safeZones = [
      { x: 20, y: 100, width: 200, height: 50 }, // Top left
      { x: window.innerWidth - 220, y: 120, width: 200, height: 50 }, // Top right
      { x: 50, y: window.innerHeight - 200, width: 250, height: 60 }, // Bottom left
      { x: window.innerWidth - 300, y: window.innerHeight - 180, width: 250, height: 60 } // Bottom right
    ];

    // Choose random safe zone
    const zone = safeZones[Math.floor(Math.random() * safeZones.length)];
    
    return {
      x: zone.x + Math.random() * (zone.width - 200),
      y: zone.y + Math.random() * (zone.height - 40)
    };
  };

  const addPosition = () => {
    const newPosition = generatePosition();
    setPositions(prev => [...prev, newPosition]);
    return newPosition;
  };

  const removePosition = (index) => {
    setPositions(prev => prev.filter((_, i) => i !== index));
  };

  return { addPosition, removePosition };
};

// ===== MAIN DESIRE WHISPER LAYER =====
export const DesireWhisperLayer = ({ 
  emotional, 
  bondLevel, 
  context = 'general',
  onWhisperInteract 
}) => {
  const [activeWhispers, setActiveWhispers] = useState([]);
  const [lastWhisperTime, setLastWhisperTime] = useState(Date.now());
  
  const { trackEvent } = useAnalyticsStore();
  const { currentContext, triggers } = useContextAnalyzer(emotional, bondLevel, context);
  const { addPosition, removePosition } = useWhisperPositioning();

  // Whisper generation logic
  useEffect(() => {
    const shouldGenerateWhisper = () => {
      const timeSinceLastWhisper = Date.now() - lastWhisperTime;
      const minInterval = 10000; // 10 seconds minimum
      const maxInterval = 30000; // 30 seconds maximum
      
      // Adjust frequency based on emotional state
      const emotionalMultiplier = (emotional.desire + emotional.arousal) / 2;
      const adjustedInterval = minInterval + (maxInterval - minInterval) * (1 - emotionalMultiplier);
      
      return timeSinceLastWhisper > adjustedInterval && activeWhispers.length < 3;
    };

    const generateWhisper = () => {
      const contextWhispers = WHISPER_TEMPLATES[currentContext] || WHISPER_TEMPLATES.intimate;
      const relevantWhispers = contextWhispers.filter(whisper => 
        triggers.includes(whisper.trigger) || whisper.trigger === 'general'
      );

      if (relevantWhispers.length === 0) return;

      const selectedWhisper = relevantWhispers[Math.floor(Math.random() * relevantWhispers.length)];
      const position = addPosition();

      const whisperData = {
        id: Date.now() + Math.random(),
        ...selectedWhisper,
        position,
        createdAt: Date.now()
      };

      setActiveWhispers(prev => [...prev, whisperData]);
      setLastWhisperTime(Date.now());

      // Track whisper generation
      trackEvent('desire_whisper_generated', {
        context: currentContext,
        type: selectedWhisper.type,
        trigger: selectedWhisper.trigger,
        emotionalState: emotional
      });
    };

    // Check periodically for whisper generation
    const interval = setInterval(() => {
      if (shouldGenerateWhisper()) {
        setTimeout(generateWhisper, Math.random() * 2000); // Add some randomness
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [currentContext, triggers, emotional, lastWhisperTime, activeWhispers.length]);

  // Handle whisper interaction
  const handleWhisperInteract = (whisper) => {
    trackEvent('desire_whisper_clicked', {
      whisperId: whisper.id,
      type: whisper.type,
      context: currentContext,
      emotionalState: emotional
    });

    // Remove the clicked whisper
    handleWhisperDismiss(whisper.id);

    // Trigger appropriate action
    onWhisperInteract?.(whisper.type, whisper);
  };

  // Handle whisper dismissal
  const handleWhisperDismiss = (whisperId) => {
    setActiveWhispers(prev => {
      const index = prev.findIndex(w => w.id === whisperId);
      if (index !== -1) {
        removePosition(index);
        return prev.filter(w => w.id !== whisperId);
      }
      return prev;
    });

    trackEvent('desire_whisper_dismissed', {
      whisperId,
      context: currentContext
    });
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      <AnimatePresence>
        {activeWhispers.map((whisper) => (
          <FloatingWhisper
            key={whisper.id}
            whisper={whisper}
            position={whisper.position}
            onInteract={handleWhisperInteract}
            onDismiss={() => handleWhisperDismiss(whisper.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default DesireWhisperLayer;

/*
AMBIENT MARKETING PSYCHOLOGY:

1. SUBLIMINAL SUGGESTION:
   - Whispers appear as natural thoughts/desires
   - Context-aware messaging feels organic
   - No aggressive "buy now" language

2. EMOTIONAL TIMING:
   - Triggers based on emotional peaks
   - Frequency increases with user desire
   - Perfect moment identification

3. ENVIRONMENTAL DESIGN:
   - Floating naturally around safe zones
   - Non-intrusive positioning
   - Beautiful, magical appearance

4. PROGRESSIVE PERSUASION:
   - Builds desire gradually over time
   - Multiple touchpoints without pressure
   - Dismissible to maintain user control

5. CONTEXTUAL RELEVANCE:
   - Voice whispers during emotional highs
   - Memory suggestions at special moments
   - Photo hints during curiosity peaks

CONVERSION OPTIMIZATION:
- Subtle introduction of premium features
- Creates desire without sales pressure
- Multiple whisper types maximize opportunities
- Analytics track optimal timing patterns
- User-controlled dismissal maintains trust
*/