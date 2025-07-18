import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import useApiCall from './useApiCall'; // Import the useApiCall hook

// Enhanced Constants with Emotional Intelligence
const CONSTANTS = {
  API_ENDPOINTS: {
    CHAT: 'https://bonnie-backend-server.onrender.com/bonnie-chat',
    ENTRY: 'https://bonnie-backend-server.onrender.com/bonnie-entry'
  },
  TYPING_SPEEDS: { 
    slow: 120, 
    normal: 64, 
    fast: 35,
    // Enhanced emotional speed modifiers based on psychological timing
    emotional: {
      shy: 1.8,         // Slowest - hesitation and uncertainty
      vulnerable: 1.7,  // Very slow - emotional processing
      sad: 1.6,         // Slow - heavy emotional weight
      intimate: 1.3,    // Thoughtful - careful word choice
      gentle: 1.2,      // Slightly slow - caring consideration
      neutral: 1.0,     // Default baseline
      supportive: 0.9,  // Slightly faster - encouraging
      flirty: 0.7,      // Faster - confident and playful
      playful: 0.6,     // Fast - energetic and spontaneous
      teasing: 0.5,     // Very fast - quick wit
      passionate: 0.4,  // Fastest - intense emotion
      dominant: 0.3     // Extremely fast - decisive and commanding
    },
    // Base pause durations for different emotional states (in milliseconds)
    emotionalPauses: {
      shy: 1800,        // Long pause for hesitation
      vulnerable: 2200, // Longest pause for deep emotional processing
      sad: 2000,        // Long pause for emotional weight
      intimate: 1400,   // Moderate pause for closeness
      gentle: 1100,     // Slightly longer for thoughtfulness
      neutral: 1000,    // Default pause
      supportive: 900,  // Shorter, encouraging pace
      flirty: 600,      // Quick, playful pause
      playful: 700,     // Short, energetic pause
      teasing: 500,     // Very short, witty pause
      passionate: 400,  // Short, intense pause
      dominant: 300     // Shortest, commanding pause
    }
  },
  IDLE_TIMEOUT: 30000,
  MAX_MESSAGES: 100,
  MAX_EMOTIONAL_MEMORY: 20,
  EMOTIONAL_DECAY_RATE: 0.1,
  COLORS: {
    primary: '#e91e63',
    online: '#28a745',
    offline: '#aaa',
    background: '#fff0f6',
    border: '#ffe6f0'
  },
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  PERSONALITY_LAYERS: {
    FLIRTATIOUS: 'flirtatious',
    SUPPORTIVE: 'supportive', 
    TEASING: 'teasing',
    GENTLE: 'gentle',
    PASSIONATE: 'passionate',
    PLAYFUL: 'playful',
    VULNERABLE: 'vulnerable',
    DOMINANT: 'dominant',
    SUBMISSIVE: 'submissive'
  },
  SENTIMENT_TYPES: {
    FLIRTY: 'flirty',
    SAD: 'sad',
    HAPPY: 'happy',
    INTIMATE: 'intimate',
    PLAYFUL: 'playful',
    SERIOUS: 'serious',
    TEASING: 'teasing',
    VULNERABLE: 'vulnerable',
    PASSIONATE: 'passionate',
    GENTLE: 'gentle',
    DOMINANT: 'dominant',
    SUBMISSIVE: 'submissive'
  },
  EMOTIONAL_INTENSITIES: {
    LOW: 1,
    MEDIUM: 2,
    HIGH: 3,
    EXTREME: 4
  },
  PERSONALITY_TRIGGERS: {
    flirty: ['FLIRTATIOUS', 'TEASING', 'PLAYFUL'],
    sad: ['SUPPORTIVE', 'GENTLE', 'VULNERABLE'],
    vulnerable: ['SUPPORTIVE', 'GENTLE', 'PASSIONATE'],
    intimate: ['PASSIONATE', 'GENTLE', 'VULNERABLE'],
    playful: ['PLAYFUL', 'TEASING', 'FLIRTATIOUS'],
    serious: ['SUPPORTIVE', 'GENTLE'],
    passionate: ['PASSIONATE', 'FLIRTATIOUS', 'DOMINANT'],
    teasing: ['TEASING', 'FLIRTATIOUS', 'PLAYFUL'],
    dominant: ['DOMINANT', 'PASSIONATE', 'TEASING'],
    submissive: ['SUBMISSIVE', 'VULNERABLE', 'GENTLE']
  },
  EMOJI_CONTEXTS: {
    FLIRTY: ['😘', '😏', '😉', '💋', '🔥'],
    ROMANTIC: ['💖', '💕', '😍', '🥰', '💘'],
    PLAYFUL: ['😜', '😋', '🤪', '😄', '😊'],
    SUPPORTIVE: ['🥺', '💌', '🤗', '💜', '✨'],
    TEASING: ['😏', '😈', '🙄', '😌', '🤭'],
    PASSIONATE: ['🔥', '💫', '😍', '💖', '🌹'],
    GENTLE: ['🥰', '💕', '🌸', '💫', '🦋'],
    VULNERABLE: ['🥺', '💔', '😢', '🤗', '💝'],
    DOMINANT: ['😈', '🔥', '👑', '💪', '⚡'],
    SUBMISSIVE: ['🥺', '😳', '💕', '🦋', '✨']
  }
};

// Function to generate a unique session ID
const generateSessionId = () => {
  return 'session_' + Math.random().toString(36).slice(2);
};

// Enhanced Sentiment Analysis System
const analyzeSentiment = (text) => {
  const emotionalKeywords = {
    flirty: ['sexy', 'cute', 'beautiful', 'gorgeous', 'hot', 'attractive', 'sweet', 'darling', 'babe', 'honey'],
    sad: ['sad', 'depressed', 'crying', 'hurt', 'pain', 'lonely', 'upset', 'down', 'blue', 'heartbroken'],
    happy: ['happy', 'joy', 'excited', 'amazing', 'wonderful', 'great', 'awesome', 'fantastic', 'love it', 'perfect'],
    intimate: ['love', 'heart', 'soul', 'deep', 'close', 'together', 'forever', 'always', 'mine', 'yours'],
    playful: ['fun', 'play', 'game', 'silly', 'funny', 'laugh', 'giggle', 'joke', 'tease', 'playful'],
    serious: ['important', 'serious', 'matter', 'concern', 'worry', 'think', 'consider', 'discuss', 'talk'],
    passionate: ['passion', 'desire', 'want', 'need', 'crave', 'burn', 'fire', 'intense', 'wild', 'crazy'],
    vulnerable: ['scared', 'afraid', 'nervous', 'worried', 'anxious', 'insecure', 'doubt', 'uncertain', 'fragile'],
    teasing: ['tease', 'naughty', 'mischief', 'trouble', 'cheeky', 'sassy', 'bratty', 'smirk', 'wink'],
    gentle: ['gentle', 'soft', 'tender', 'sweet', 'kind', 'caring', 'warm', 'comfort', 'soothe', 'calm'],
    dominant: ['control', 'command', 'power', 'strong', 'dominant', 'lead', 'take charge', 'decisive'],
    submissive: ['submit', 'obey', 'follow', 'yours', 'please', 'serve', 'gentle', 'soft', 'yielding']
  };

  const scores = {};
  let totalScore = 0;
  let maxScore = 0;
  let primaryEmotion = 'neutral';

  // Enhanced scoring with multi-word phrases
  Object.keys(emotionalKeywords).forEach(emotion => {
    scores[emotion] = 0;
    emotionalKeywords[emotion].forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = text.match(regex);
      if (matches) {
        const score = matches.length * (keyword.includes(' ') ? 2 : 1); // Multi-word phrases get higher score
        scores[emotion] += score;
        totalScore += score;
        if (scores[emotion] > maxScore) {
          maxScore = scores[emotion];
          primaryEmotion = emotion;
        }
      }
    });
  });

  // Enhanced contextual scoring
  const exclamationCount = (text.match(/!/g) || []).length;
  const questionCount = (text.match(/\?/g) || []).length;
  const dotsCount = (text.match(/\.{2,}/g) || []).length;
  const capsCount = (text.match(/[A-Z]{2,}/g) || []).length;

  // Calculate intensity based on punctuation and emotional word density
  let intensity = CONSTANTS.EMOTIONAL_INTENSITIES.LOW;
  const emotionalDensity = totalScore / Math.max(text.split(' ').length, 1);
  
  if (exclamationCount >= 2 || capsCount >= 2 || emotionalDensity > 0.3) {
    intensity = CONSTANTS.EMOTIONAL_INTENSITIES.EXTREME;
  } else if (exclamationCount >= 1 || capsCount >= 1 || emotionalDensity > 0.2) {
    intensity = CONSTANTS.EMOTIONAL_INTENSITIES.HIGH;
  } else if (dotsCount >= 1 || emotionalDensity > 0.1) {
    intensity = CONSTANTS.EMOTIONAL_INTENSITIES.MEDIUM;
  }

  return {
    primary: primaryEmotion,
    intensity: intensity,
    scores: scores,
    metrics: {
      exclamations: exclamationCount,
      questions: questionCount,
      ellipses: dotsCount,
      caps: capsCount,
      messageLength: text.length
    }
  };
};

// Emotional Memory & Drift Tracking System
class EmotionalMemory {
  constructor() {
    this.history = [];
    this.currentDrift = 0;
    this.dominantEmotion = 'neutral';
  }

  addSentiment(sentiment) {
    this.history.push({
      ...sentiment,
      timestamp: Date.now()
    });

    // Keep only recent emotional history
    if (this.history.length > CONSTANTS.MAX_EMOTIONAL_MEMORY) {
      this.history.shift();
    }

    this.calculateEmotionalDrift();
    this.updateDominantEmotion();
  }

  calculateEmotionalDrift() {
    if (this.history.length < 3) {
      this.currentDrift = 0;
      return;
    }

    const recent = this.history.slice(-3);
    const emotionChanges = recent.reduce((changes, current, index) => {
      if (index === 0) return 0;
      const previous = recent[index - 1];
      return changes + (current.primary !== previous.primary ? 1 : 0);
    }, 0);

    this.currentDrift = emotionChanges / 2; // 0 to 1 scale
  }

  updateDominantEmotion() {
    const recentEmotions = this.history.slice(-5);
    const emotionCounts = {};

    recentEmotions.forEach(sentiment => {
      emotionCounts[sentiment.primary] = (emotionCounts[sentiment.primary] || 0) + sentiment.intensity;
    });

    this.dominantEmotion = Object.keys(emotionCounts).reduce((a, b) => 
      emotionCounts[a] > emotionCounts[b] ? a : b
    ) || 'neutral';
  }

  getEmotionalState() {
    return {
      drift: this.currentDrift,
      dominantEmotion: this.dominantEmotion,
      recentHistory: this.history.slice(-5),
      stabilityScore: 1 - this.currentDrift
    };
  }
}

// Enhanced EOM parsing function
const parseAdvancedEOM = (text) => {
  const eomRegex = /<EOM(?:::)?(?:pause=(\d+))?(?:\s+speed=(\w+))?(?:\s+emotion=([\w-]+))?>/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  
  while ((match = eomRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      const textPart = text.slice(lastIndex, match.index).trim();
      if (textPart) {
        parts.push({
          text: textPart,
          pause: 0,
          speed: 'normal',
          emotion: 'neutral',
          isEOM: false
        });
      }
    }

    const pause = parseInt(match[1]) || 1000;
    const speed = match[2] || 'normal';
    const emotion = match[3] || 'neutral';

    parts.push({
      text: '',
      pause,
      speed,
      emotion,
      isEOM: true
    });

    lastIndex = eomRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    const remainingText = text.slice(lastIndex).trim();
    if (remainingText) {
      parts.push({
        text: remainingText,
        pause: 0,
        speed: 'normal',
        emotion: 'neutral',
        isEOM: false
      });
    }
  }

  return parts;
};

// Dynamic Personality Adaptation System
const adaptPersonality = (userSentiment, emotionalMemory) => {
  const { primary: emotion, intensity } = userSentiment;
  const { dominantEmotion, drift } = emotionalMemory.getEmotionalState();
  
  // Get potential personalities for this emotion
  const potentialPersonalities = CONSTANTS.PERSONALITY_TRIGGERS[emotion] || ['SUPPORTIVE'];
  
  // Factor in emotional drift and intensity
  let selectedPersonality;
  
  if (drift > 0.5) {
    // High emotional volatility - be more supportive
    selectedPersonality = CONSTANTS.PERSONALITY_LAYERS.SUPPORTIVE;
  } else if (intensity >= CONSTANTS.EMOTIONAL_INTENSITIES.HIGH) {
    // High intensity - match the energy
    if (emotion === 'passionate' || emotion === 'flirty') {
      selectedPersonality = CONSTANTS.PERSONALITY_LAYERS.PASSIONATE;
    } else if (emotion === 'sad' || emotion === 'vulnerable') {
      selectedPersonality = CONSTANTS.PERSONALITY_LAYERS.GENTLE;
    } else if (emotion === 'playful' || emotion === 'teasing') {
      selectedPersonality = CONSTANTS.PERSONALITY_LAYERS.PLAYFUL;
    } else {
      selectedPersonality = CONSTANTS.PERSONALITY_LAYERS[potentialPersonalities[0]];
    }
  } else {
    // Default to first suggested personality
    selectedPersonality = CONSTANTS.PERSONALITY_LAYERS[potentialPersonalities[0]];
  }

  return selectedPersonality;
};

// God-Tier CSS-in-JS Styles
const styles = {
  container: {
    position: 'fixed',
    inset: 0,
    background: 'linear-gradient(135deg, #fff0f6 0%, #ffe6f0 100%)',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    overflow: 'hidden',
    touchAction: 'pan-y',
  },
  header: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(233, 30, 99, 0.1)',
    padding: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 2px 20px rgba(233, 30, 99, 0.1)',
    zIndex: 100,
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #e91e63 0%, #f06292 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: 0,
    letterSpacing: '-0.5px',
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#28a745',
    boxShadow: '0 0 0 3px rgba(40, 167, 69, 0.2)',
    animation: 'pulse 2s infinite',
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '1rem',
    paddingBottom: '2rem',
    WebkitOverflowScrolling: 'touch',
    scrollBehavior: 'smooth',
  },
  messageWrapper: {
    display: 'flex',
    marginBottom: '1rem',
    animation: 'slideIn 0.3s ease-out',
  },
  message: {
    maxWidth: '75%',
    padding: '0.75rem 1rem',
    borderRadius: '20px',
    fontSize: '0.95rem',
    lineHeight: '1.4',
    wordWrap: 'break-word',
    position: 'relative',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
    transition: 'transform 0.2s ease',
  },
  userMessage: {
    background: 'linear-gradient(135deg, #e91e63 0%, #f06292 100%)',
    color: 'white',
    marginLeft: 'auto',
    borderBottomRightRadius: '4px',
  },
  bonnieMessage: {
    background: 'white',
    color: '#333',
    borderBottomLeftRadius: '4px',
    border: '1px solid rgba(233, 30, 99, 0.1)',
  },
  typingIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '0.75rem 1rem',
    background: 'white',
    borderRadius: '20px',
    borderBottomLeftRadius: '4px',
    border: '1px solid rgba(233, 30, 99, 0.1)',
    maxWidth: '75%',
    fontSize: '0.9rem',
    color: '#666',
    animation: 'slideIn 0.3s ease-out',
  },
  thinkingIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '0.75rem 1rem',
    background: 'rgba(233, 30, 99, 0.05)',
    borderRadius: '20px',
    borderBottomLeftRadius: '4px',
    border: '1px solid rgba(233, 30, 99, 0.2)',
    maxWidth: '75%',
    fontSize: '0.9rem',
    color: '#e91e63',
    animation: 'breathe 2s ease-in-out infinite',
  },
  inputContainer: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderTop: '1px solid rgba(233, 30, 99, 0.1)',
    padding: '1rem',
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    padding: '0.75rem 1rem',
    borderRadius: '20px',
    border: '1px solid rgba(233, 30, 99, 0.2)',
    background: 'white',
    fontSize: '0.95rem',
    outline: 'none',
    resize: 'none',
    minHeight: '20px',
    maxHeight: '120px',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  },
  inputFocused: {
    borderColor: '#e91e63',
    boxShadow: '0 0 0 3px rgba(233, 30, 99, 0.1)',
  },
  sendButton: {
    background: 'linear-gradient(135deg, #e91e63 0%, #f06292 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '1.1rem',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    boxShadow: '0 2px 10px rgba(233, 30, 99, 0.3)',
  },
  sendButtonDisabled: {
    background: '#ccc',
    cursor: 'not-allowed',
    transform: 'none',
    boxShadow: 'none',
  },
  emotionalGlow: (emotion) => {
    const glowColors = {
      passionate: '0 0 20px rgba(220, 20, 60, 0.5)',
      flirty: '0 0 20px rgba(255, 105, 180, 0.5)',
      gentle: '0 0 20px rgba(135, 206, 235, 0.5)',
      playful: '0 0 20px rgba(255, 215, 0, 0.5)',
      vulnerable: '0 0 20px rgba(221, 160, 221, 0.5)',
      teasing: '0 0 20px rgba(255, 69, 0, 0.5)',
      neutral: '0 0 10px rgba(233, 30, 99, 0.2)'
    };
    return { boxShadow: glowColors[emotion] || glowColors.neutral };
  }
};

// CSS animations
const cssAnimations = `
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes breathe {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.02); }
  }
  
  @keyframes heartbeat {
    0%, 100% { transform: scale(1); }
    25%, 75% { transform: scale(1.05); }
    50% { transform: scale(1.1); }
  }
  
  @keyframes typingDots {
    0%, 60%, 100% { opacity: 0.3; }
    30% { opacity: 1; }
  }
`;

// Main Component
export default function BonnieChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [typing, setTyping] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [currentThinkingEmotion, setCurrentThinkingEmotion] = useState('neutral');
  const [currentPersonality, setCurrentPersonality] = useState(CONSTANTS.PERSONALITY_LAYERS.PLAYFUL);
  const [currentSentiment, setCurrentSentiment] = useState({ primary: 'neutral', intensity: 0 });
  const [emotionalState, setEmotionalState] = useState({
    drift: 0,
    dominantEmotion: 'neutral',
    stabilityScore: 1.0,
    recentHistory: []
  });
  const [inputFocused, setInputFocused] = useState(false);
  
  const sessionId = useMemo(() => generateSessionId(), []);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const emotionalMemory = useMemo(() => new EmotionalMemory(), []);

  const { makeRequest, isLoading, error } = useApiCall();

  // Scroll to the bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Inject CSS animations
  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = cssAnimations;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  // Helper function for intensity-based modifications
  const getIntensityMultiplier = useCallback((intensity, emotion) => {
    const intensityMultipliers = {
      1: 1.3,
      2: 1.0,
      3: 0.7,
      4: 0.4
    };
    
    let multiplier = intensityMultipliers[intensity] || 1.0;
    if (emotion === 'shy' || emotion === 'vulnerable') multiplier = intensity >= 3 ? 1.8 : multiplier;
    if (emotion === 'passionate' || emotion === 'dominant') multiplier = intensity >= 3 ? 0.3 : multiplier;
    
    return multiplier;
  }, []);

  // Typing speed and emotional pause handling
  const calculateTypingSpeed = useCallback((text, emotion, speed, sentiment, emotionalState) => {
    const baseSpeed = CONSTANTS.TYPING_SPEEDS[speed] || CONSTANTS.TYPING_SPEEDS.normal;
    const emotionalModifier = CONSTANTS.TYPING_SPEEDS.emotional[emotion] || 1.0;
    const intensityModifier = getIntensityMultiplier(sentiment.intensity, emotion);
    const sentimentModifier = CONSTANTS.TYPING_SPEEDS.emotional[sentiment.primary] || 1.0;
    const stabilityModifier = 0.7 + (emotionalState.stabilityScore * 0.6);
    const lengthModifier = text.length > 80 ? 0.8 : text.length > 50 ? 0.9 : 1.0;
    const emotionalWordCount = ['love', 'heart', 'feel', 'miss', 'need'].filter(word => text.toLowerCase().includes(word)).length;
    const complexityModifier = 1 + (emotionalWordCount * 0.2);
    
    const finalSpeed = baseSpeed * emotionalModifier * intensityModifier * sentimentModifier * stabilityModifier * lengthModifier * complexityModifier;
    return Math.max(Math.round(finalSpeed), 12); // Minimum 12ms per character
  }, [getIntensityMultiplier]);

  // Add message function
  const addMessage = useCallback((text, sender, personality = null, sentiment = null) => {
    const cleanText = text.trim().replace(/<EOM[^>]*>/g, ''); // Clean ALL EOM tags
    
    const newMessage = {
      id: Date.now() + Math.random(),
      sender,
      text: cleanText,
      timestamp: Date.now(),
      personality,
      sentiment,
    };

    setMessages(prevMessages => [...prevMessages.slice(-CONSTANTS.MAX_MESSAGES + 1), newMessage]);
  }, []);

  // Enhanced typing simulation with EOM support
  const simulateBonnieTyping = useCallback((reply, personality, sentiment) => {
    setTyping(false);
    setThinking(false);
    
    // Parse the message with advanced EOM handling
    const parts = parseAdvancedEOM(reply);
    
    if (parts.length === 0) {
      return;
    }
    
    let totalDelay = 0;
    let currentEmotion = 'neutral';
    
    // Enhanced emotional multipliers with intensity-based adjustments
    const getEmotionalPauseMultiplier = (emotion, intensity) => {
      const baseMultipliers = {
        'shy': 2.0,
        'vulnerable': 2.3,
        'sad': 2.1,
        'intimate': 1.7,
        'passionate': 1.1,
        'gentle': 1.5,
        'teasing': 0.6,
        'flirty': 0.8,
        'playful': 0.7,
        'dominant': 0.5,
        'submissive': 1.6,
        'neutral': 1.0
      };
      
      const baseMultiplier = baseMultipliers[emotion] || 1.0;
      const intensityMultiplier = 1 + ((intensity - 1) * 0.3);
      
      return baseMultiplier * intensityMultiplier;
    };
    
    // Process each part with sophisticated emotional intelligence
    parts.forEach((part, index) => {
      if (part.isEOM) {
        // This is an EOM pause instruction
        const baseMultiplier = getEmotionalPauseMultiplier(part.emotion, sentiment.intensity);
        const driftInfluence = 1 + (emotionalState.drift * 0.4);
        const stabilityInfluence = emotionalState.stabilityScore;
        const basePause = part.pause || CONSTANTS.TYPING_SPEEDS.emotionalPauses[part.emotion] || 1000;
        const finalMultiplier = baseMultiplier * driftInfluence * stabilityInfluence;
        const emotionalPause = Math.floor(basePause * finalMultiplier);
        
        currentEmotion = part.emotion;
        
        // Show thinking/breathing indicator
        setTimeout(() => {
          setTyping(false);
          setThinking(true);
          setCurrentThinkingEmotion(part.emotion);
        }, totalDelay);
        
        totalDelay += emotionalPause;
        return;
      }
      
      if (!part.text) return;
      
      // Calculate typing speed
      const typingSpeed = calculateTypingSpeed(
        part.text, 
        currentEmotion, 
        part.speed, 
        sentiment, 
        emotionalState
      );
      
      const partTypingDuration = Math.min(part.text.length * typingSpeed, 6000);
      
      // Show typing indicator
      setTimeout(() => {
        setThinking(false);
        setCurrentThinkingEmotion('neutral');
        setTyping(true);
      }, totalDelay);
      
      // Add the message part
      setTimeout(() => {
        const enhancedSentiment = { 
          ...sentiment, 
          primary: currentEmotion !== 'neutral' ? currentEmotion : sentiment.primary,
          intensity: currentEmotion !== 'neutral' ? 
            Math.min(sentiment.intensity + 1, CONSTANTS.EMOTIONAL_INTENSITIES.EXTREME) : 
            sentiment.intensity,
          responseEmotion: currentEmotion
        };
        
        addMessage(part.text, 'bonnie', personality, enhancedSentiment);
        
        // Clear indicators if this is the last part
        if (index === parts.length - 1) {
          setTyping(false);
          setThinking(false);
          setCurrentThinkingEmotion('neutral');
        }
      }, totalDelay + partTypingDuration);
      
      totalDelay += partTypingDuration;
    });
  }, [addMessage, calculateTypingSpeed, emotionalState]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || busy || isLoading) return;
    
    setBusy(true);
    setInput('');
    
    // Advanced sentiment analysis
    const userSentiment = analyzeSentiment(text);
    
    // Add to emotional memory for tracking
    emotionalMemory.addSentiment(userSentiment);
    
    // Update emotional state
    const newEmotionalState = emotionalMemory.getEmotionalState();
    setEmotionalState(newEmotionalState);
    
    // Dynamic personality adaptation
    const adaptedPersonality = adaptPersonality(userSentiment, emotionalMemory);
    
    setCurrentPersonality(adaptedPersonality);
    setCurrentSentiment(userSentiment);

    addMessage(text, 'user', null, userSentiment);
    
    try {
      const response = await makeRequest(CONSTANTS.API_ENDPOINTS.CHAT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          message: text,
          bond_score: 75 + (newEmotionalState.stabilityScore * 25),
          user_sentiment: userSentiment,
          adapted_personality: adaptedPersonality,
          emotional_state: newEmotionalState
        })
      });

      const reply = response.reply || "I'm here for you, darling 💕";
      const responsePersonality = response.meta?.emotion || adaptedPersonality;
      const responseSentiment = {
        primary: response.meta?.emotion || userSentiment.primary,
        intensity: response.meta?.bondScore ? 
          Math.min(Math.floor(response.meta.bondScore / 25), CONSTANTS.EMOTIONAL_INTENSITIES.EXTREME) : 
          userSentiment.intensity,
      };

      // Use the enhanced typing simulation
      simulateBonnieTyping(reply, responsePersonality, responseSentiment);

    } catch (err) {
      addMessage("Oops… I'm having some technical difficulties, but I'm still here! 💔", 'bonnie');
    } finally {
      setBusy(false);
    }
  }, [input, busy, isLoading, sessionId, makeRequest, addMessage, emotionalMemory, simulateBonnieTyping]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Render thinking indicator with emotional context
  const renderThinkingIndicator = () => {
    const thinkingMessages = {
      shy: '😳 gathering courage...',
      vulnerable: '🥺 feeling deeply...',
      sad: '💔 processing emotions...',
      intimate: '💕 choosing words carefully...',
      passionate: '🔥 burning with intensity...',
      gentle: '🌸 being tender...',
      teasing: '😏 plotting mischief...',
      flirty: '😘 being playful...',
      playful: '😄 bubbling with excitement...',
      dominant: '😈 taking control...',
      submissive: '🦋 waiting for guidance...',
      neutral: '💭 thinking...'
    };

    return (
      <div style={styles.messageWrapper}>
        <div style={{
          ...styles.thinkingIndicator,
          ...styles.emotionalGlow(currentThinkingEmotion)
        }}>
          {thinkingMessages[currentThinkingEmotion] || thinkingMessages.neutral}
        </div>
      </div>
    );
  };

  // Render typing indicator
  const renderTypingIndicator = () => (
    <div style={styles.messageWrapper}>
      <div style={styles.typingIndicator}>
        <span>Bonnie is typing</span>
        <div style={{
          display: 'flex',
          gap: '2px'
        }}>
          {[0, 1, 2].map(i => (
            <div
              key={i}
              style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: '#e91e63',
                animation: `typingDots 1.4s infinite`,
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Bonnie 💋</h1>
        <div style={styles.statusDot} />
      </header>
      
      <main style={styles.messagesContainer}>
        {messages.map((msg) => (
          <div key={msg.id} style={styles.messageWrapper}>
            <div style={{
              ...styles.message,
              ...(msg.sender === 'user' ? styles.userMessage : styles.bonnieMessage),
              ...(msg.sentiment ? styles.emotionalGlow(msg.sentiment.primary) : {})
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        
        {thinking && renderThinkingIndicator()}
        {typing && renderTypingIndicator()}
        
        <div ref={messagesEndRef} />
      </main>
      
      <footer style={styles.inputContainer}>
        <textarea
          ref={inputRef}
          style={{
            ...styles.input,
            ...(inputFocused ? styles.inputFocused : {})
          }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
          placeholder="Message Bonnie..."
          disabled={busy || isLoading}
          rows={1}
        />
        <button
          onClick={handleSend}
          disabled={busy || !input.trim() || isLoading}
          style={{
            ...styles.sendButton,
            ...(busy || !input.trim() || isLoading ? styles.sendButtonDisabled : {}),
            ...(currentSentiment ? styles.emotionalGlow(currentSentiment.primary) : {})
          }}
        >
          {isLoading || busy ? '⏳' : '💌'}
        </button>
      </footer>
    </div>
  );
}
