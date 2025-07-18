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

// Advanced Emotional Intelligence & Sentiment Analysis System
const analyzeSentiment = (text) => {
  const lowerText = text.toLowerCase();
  
  // Enhanced emotional keyword detection
  const emotionalKeywords = {
    flirty: ['sexy', 'hot', 'beautiful', 'gorgeous', 'cute', 'kiss', 'love', 'baby', 'darling', 'honey', 'desire', 'want you', 'miss you'],
    intimate: ['miss', 'need', 'want', 'desire', 'close', 'together', 'feel', 'heart', 'soul', 'deep', 'connection', 'touch'],
    sad: ['sad', 'hurt', 'lonely', 'upset', 'tired', 'stressed', 'difficult', 'hard', 'pain', 'empty', 'broken', 'cry'],
    vulnerable: ['scared', 'afraid', 'worry', 'nervous', 'insecure', 'doubt', 'uncertain', 'fragile', 'weak', 'lost'],
    playful: ['haha', 'lol', 'funny', 'joke', 'silly', 'crazy', 'fun', 'play', 'game', 'laugh', 'giggle', 'tease'],
    passionate: ['intense', 'fire', 'burn', 'wild', 'crazy about', 'obsessed', 'addicted', 'breathless', 'consume'],
    teasing: ['maybe', 'perhaps', 'guess', 'see', 'hmm', 'interesting', 'really', 'oh really', 'sure', 'whatever'],
    dominant: ['control', 'command', 'order', 'submit', 'obey', 'mine', 'belong', 'own', 'master', 'power'],
    submissive: ['please', 'yes sir', 'yes ma\'am', 'sorry', 'forgive', 'serve', 'worship', 'kneel', 'beg'],
    gentle: ['soft', 'tender', 'sweet', 'calm', 'peaceful', 'comfort', 'soothe', 'gentle', 'care', 'nurture']
  };

  // Calculate scores for each emotion
  const scores = {};
  Object.keys(emotionalKeywords).forEach(emotion => {
    const words = emotionalKeywords[emotion];
    let score = 0;
    
    words.forEach(word => {
      if (lowerText.includes(word)) {
        // Multi-word phrases get higher scores
        score += word.includes(' ') ? 3 : 1;
      }
    });
    
    scores[emotion] = score;
  });

  // Add contextual scoring
  const exclamationCount = (text.match(/!/g) || []).length;
  const questionCount = (text.match(/\?/g) || []).length;
  const dotsCount = (text.match(/\.\.\./g) || []).length;
  const capsCount = (text.match(/[A-Z]{2,}/g) || []).length;
  
  // Emotional intensity modifiers
  if (exclamationCount > 0) {
    scores.playful += exclamationCount;
    scores.passionate += exclamationCount;
  }
  
  if (dotsCount > 0) {
    scores.vulnerable += dotsCount;
    scores.sad += dotsCount;
    scores.teasing += dotsCount;
  }
  
  if (capsCount > 0) {
    scores.passionate += capsCount;
    scores.dominant += capsCount;
  }
  
  if (questionCount > 0) {
    scores.teasing += questionCount;
    scores.vulnerable += questionCount;
  }

  // Determine primary sentiment
  const primarySentiment = Object.keys(scores).reduce((a, b) => 
    scores[a] > scores[b] ? a : b
  );

  // Calculate intensity (1-4 scale)
  const maxScore = Math.max(...Object.values(scores));
  let intensity = CONSTANTS.EMOTIONAL_INTENSITIES.LOW;
  
  if (maxScore >= 5) intensity = CONSTANTS.EMOTIONAL_INTENSITIES.EXTREME;
  else if (maxScore >= 3) intensity = CONSTANTS.EMOTIONAL_INTENSITIES.HIGH;
  else if (maxScore >= 2) intensity = CONSTANTS.EMOTIONAL_INTENSITIES.MEDIUM;

  return {
    primary: primarySentiment,
    intensity,
    scores,
    contextual: {
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
      currentDrift: this.currentDrift,
      dominantEmotion: this.dominantEmotion,
      recentHistory: this.history.slice(-5),
      stabilityScore: 1 - this.currentDrift
    };
  }
}

// Dynamic Personality Adaptation System
const adaptPersonality = (userSentiment, emotionalMemory) => {
  const { primary: emotion, intensity } = userSentiment;
  const { dominantEmotion, currentDrift } = emotionalMemory.getEmotionalState();
  
  // Get potential personalities for this emotion
  const potentialPersonalities = CONSTANTS.PERSONALITY_TRIGGERS[emotion] || ['SUPPORTIVE'];
  
  // Factor in emotional drift and intensity
  let selectedPersonality;
  
  if (currentDrift > 0.5) {
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

  godLog("🎭 Personality Adaptation", {
    userEmotion: emotion,
    intensity,
    drift: currentDrift,
    dominantEmotion,
    selectedPersonality,
    potentialOptions: potentialPersonalities
  });

  return selectedPersonality;
};

// Debugging helper function
window.__BONNIE_GOD_MODE = true;
function godLog(label, data) {
  if (window && window.__BONNIE_GOD_MODE) {
    console.groupCollapsed(`%c${label}`, 'color:#e91e63;font-weight:bold');
    console.log(data);
    console.trace();
    console.groupEnd();
  } else {
    console.log(label, data);
  }
}

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
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
  },
  thinkingIndicator: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem 1rem',
    background: 'linear-gradient(135deg, rgba(233, 30, 99, 0.05) 0%, rgba(240, 98, 146, 0.05) 100%)',
    borderRadius: '20px',
    borderBottomLeftRadius: '4px',
    border: '1px solid rgba(233, 30, 99, 0.2)',
    boxShadow: '0 2px 10px rgba(233, 30, 99, 0.1)',
  },
  thinkingDot: {
    fontSize: '1.2rem',
    animation: 'float 2s ease-in-out infinite',
  },
  thinkingText: {
    fontSize: '0.85rem',
    color: '#e91e63',
    fontStyle: 'italic',
    opacity: 0.8,
  },
  typingDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#e91e63',
    animation: 'bounce 1.4s infinite',
  },
  inputContainer: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderTop: '1px solid rgba(233, 30, 99, 0.1)',
    padding: '1rem',
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
    boxShadow: '0 -2px 20px rgba(233, 30, 99, 0.1)',
  },
  inputWrapper: {
    flex: 1,
    position: 'relative',
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    border: '2px solid transparent',
    borderRadius: '25px',
    background: '#f8f9fa',
    outline: 'none',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit',
  },
  inputFocus: {
    borderColor: '#e91e63',
    background: 'white',
    boxShadow: '0 0 0 4px rgba(233, 30, 99, 0.1)',
  },
  sendButton: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    border: 'none',
    background: 'linear-gradient(135deg, #e91e63 0%, #f06292 100%)',
    color: 'white',
    fontSize: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(233, 30, 99, 0.3)',
    flexShrink: 0,
  },
  sendButtonHover: {
    transform: 'scale(1.05)',
    boxShadow: '0 6px 20px rgba(233, 30, 99, 0.4)',
  },
  sendButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    transform: 'scale(1)',
  },
};

// CSS Keyframes
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(40, 167, 69, 0.4); }
    70% { box-shadow: 0 0 0 6px rgba(40, 167, 69, 0); }
    100% { box-shadow: 0 0 0 0 rgba(40, 167, 69, 0); }
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideInSlow {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideInFast {
    from { opacity: 0; transform: translateY(5px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes slideInIntimate {
    from { opacity: 0; transform: translateY(15px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes bounce {
    0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
    30% { transform: translateY(-10px); opacity: 1; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px) scale(1); }
    50% { transform: translateY(-3px) scale(1.05); }
  }
  @keyframes breathe {
    0%, 100% { opacity: 0.6; transform: scale(0.98); }
    50% { opacity: 1; transform: scale(1.02); }
  }
  @keyframes breatheSlow {
    0%, 100% { opacity: 0.5; transform: scale(0.96); }
    50% { opacity: 1; transform: scale(1.04); }
  }
  @keyframes heartbeat {
    0%, 100% { transform: scale(1); }
    25% { transform: scale(1.05); }
    50% { transform: scale(1); }
    75% { transform: scale(1.02); }
  }
  @keyframes heartbeatIntense {
    0%, 100% { transform: scale(1); }
    25% { transform: scale(1.08); }
    50% { transform: scale(1.02); }
    75% { transform: scale(1.05); }
  }
  @keyframes shimmer {
    0%, 100% { opacity: 0.7; transform: scale(1) rotate(0deg); }
    50% { opacity: 1; transform: scale(1.02) rotate(1deg); }
  }
  .typing-dot:nth-child(1) { animation-delay: 0s; }
  .typing-dot:nth-child(2) { animation-delay: 0.2s; }
  .typing-dot:nth-child(3) { animation-delay: 0.4s; }
  .thinking-indicator { animation: breathe 3s ease-in-out infinite; }
  .emotional-pause { animation: heartbeat 1.5s ease-in-out infinite; }
  
  /* Scrollbar Styling */
  .messages-container::-webkit-scrollbar {
    width: 6px;
  }
  .messages-container::-webkit-scrollbar-track {
    background: transparent;
  }
  .messages-container::-webkit-scrollbar-thumb {
    background: rgba(233, 30, 99, 0.3);
    border-radius: 3px;
  }
  .messages-container::-webkit-scrollbar-thumb:hover {
    background: rgba(233, 30, 99, 0.5);
  }
  
  /* Mobile-specific styles */
  @media (max-width: 768px) {
    .message-wrapper { max-width: 85%; }
  }
  
  /* Smooth iOS scrolling */
  * {
    -webkit-tap-highlight-color: transparent;
  }
`;
document.head.appendChild(styleSheet);

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
  const [online, setOnline] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [inputFocused, setInputFocused] = useState(false);
  const [buttonHovered, setButtonHovered] = useState(false);
  const sessionId = useMemo(() => generateSessionId(), []);
  const emotionalMemory = useMemo(() => new EmotionalMemory(), []);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const { makeRequest, isLoading, error } = useApiCall();

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing]);

  // Handle mobile viewport resize when keyboard appears
  useEffect(() => {
    const handleResize = () => {
      if (window.visualViewport) {
        document.documentElement.style.height = `${window.visualViewport.height}px`;
      }
    };
    
    window.visualViewport?.addEventListener('resize', handleResize);
    return () => window.visualViewport?.removeEventListener('resize', handleResize);
  }, []);

  const addMessage = useCallback((text, sender, personality = null, sentiment = null) => {
    const newMessage = {
      id: Date.now() + Math.random(),
      sender,
      text: text.trim().replace(/<EOM>/g, ''), // Remove <EOM> tags from displayed text
      timestamp: Date.now(),
      personality,
      sentiment
    };
    setMessages(prevMessages => [...prevMessages.slice(-CONSTANTS.MAX_MESSAGES + 1), newMessage]);
    godLog("✅ Message Added", newMessage);
  }, []);

  // Advanced EOM parser with enhanced emotional intelligence
  const parseAdvancedEOM = useCallback((text) => {
    // Enhanced regex to capture all EOM variations
    const eomRegex = /<EOM(?:::)?(?:pause=(\d+))?(?:\s+speed=(\w+))?(?:\s+emotion=([\w-]+))?>/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    
    while ((match = eomRegex.exec(text)) !== null) {
      // Add text before each EOM tag
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
      
      // Parse EOM parameters with intelligent defaults
      const pause = parseInt(match[1]) || 1000;
      const speed = match[2] || 'normal';
      const emotion = match[3] || 'neutral';
      
      // Add EOM instruction part
      parts.push({
        text: '',
        pause,
        speed,
        emotion,
        isEOM: true
      });
      
      lastIndex = eomRegex.lastIndex;
    }
    
    // Add remaining text after last EOM
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
    
    // If no EOM tags found, handle as simple split on basic <EOM>
    if (parts.length === 0) {
      const simpleParts = text.split('<EOM>').filter(part => part.trim());
      return simpleParts.map((part, index) => ({
        text: part.trim(),
        pause: index > 0 ? 1500 : 0, // Default pause between parts
        speed: 'normal',
        emotion: 'neutral',
        isEOM: false
      }));
    }
    
    return parts.filter(part => part.text || part.isEOM);
  }, []);

  // Dynamic typing speed calculation based on emotional context
  const calculateTypingSpeed = useCallback((text, emotion, speed, userSentiment, emotionalState) => {
    // Base speed from constants
    const baseSpeed = CONSTANTS.TYPING_SPEEDS[speed] || CONSTANTS.TYPING_SPEEDS.normal;
    
    // Emotional speed modifier
    const emotionalModifier = CONSTANTS.TYPING_SPEEDS.emotional[emotion] || 1.0;
    
    // User sentiment influence (mirror their energy)
    const sentimentModifier = CONSTANTS.TYPING_SPEEDS.emotional[userSentiment.primary] || 1.0;
    
    // Emotional drift influence (more stable = faster, more chaotic = slower)
    const stabilityModifier = 0.8 + (emotionalState.stabilityScore * 0.4);
    
    // Text length influence (longer messages get slightly faster)
    const lengthModifier = text.length > 50 ? 0.9 : 1.0;
    
    // Calculate final speed
    const finalSpeed = baseSpeed * emotionalModifier * sentimentModifier * stabilityModifier * lengthModifier;
    
    godLog("⚡ Typing Speed Calculation", {
      baseSpeed,
      emotion,
      emotionalModifier,
      sentimentModifier,
      stabilityModifier,
      lengthModifier,
      finalSpeed: Math.round(finalSpeed)
    });
    
    return Math.max(Math.round(finalSpeed), 15); // Minimum 15ms per character
  }, []);

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
        'shy': 2.0,          // Hesitation increases with intensity
        'vulnerable': 2.3,   // Deep emotional processing
        'sad': 2.1,          // Heavy emotional weight
        'intimate': 1.7,     // Closeness, careful consideration
        'passionate': 1.1,   // Quick but intense
        'gentle': 1.5,       // Thoughtful, caring response
        'teasing': 0.6,      // Quick wit, playful
        'flirty': 0.8,       // Confident, but with flair
        'playful': 0.7,      // Light-hearted, energetic
        'dominant': 0.5,     // Decisive, commanding
        'submissive': 1.6,   // Consideration, deference
        'neutral': 1.0
      };
      
      const baseMultiplier = baseMultipliers[emotion] || 1.0;
      
      // Intensity affects pause duration - higher intensity = longer pauses for processing
      const intensityMultiplier = 1 + ((intensity - 1) * 0.3); // Scale 1.0 to 1.9
      
      return baseMultiplier * intensityMultiplier;
    };
    
    // Process each part with sophisticated emotional intelligence
    parts.forEach((part, index) => {
      if (part.isEOM) {
        // This is an EOM pause instruction with sophisticated emotional timing
        const baseMultiplier = getEmotionalPauseMultiplier(part.emotion, sentiment.intensity);
        
        // Factor in user's emotional state and relationship stability
        const driftInfluence = 1 + (emotionalState.drift * 0.4); // More drift = longer pauses
        const stabilityInfluence = emotionalState.stabilityScore; // More stable = slightly faster
        
        // Use emotional pause defaults if pause not specified
        const basePause = part.pause || CONSTANTS.TYPING_SPEEDS.emotionalPauses[part.emotion] || 1000;
        
        const finalMultiplier = baseMultiplier * driftInfluence * stabilityInfluence;
        const emotionalPause = Math.floor(basePause * finalMultiplier);
        
        currentEmotion = part.emotion;
        
        // Show thinking/breathing indicator during emotional pause
        setTimeout(() => {
          setTyping(false);
          setThinking(true);
          setCurrentThinkingEmotion(part.emotion);
          
          const thinkingActions = {
            'shy': 'hesitating',
            'vulnerable': 'taking a deep breath',
            'sad': 'processing emotions',
            'intimate': 'getting closer',
            'passionate': 'breathing heavily',
            'gentle': 'choosing words carefully',
            'teasing': 'plotting something',
            'flirty': 'smirking',
            'playful': 'giggling',
            'dominant': 'considering',
            'submissive': 'waiting for guidance'
          };
          
          godLog(`💭 Bonnie is ${thinkingActions[part.emotion] || 'thinking'}...`, { 
            emotion: part.emotion, 
            pause: emotionalPause,
            originalPause: part.pause,
            multiplier: finalMultiplier,
            userDrift: emotionalState.drift,
            userIntensity: sentiment.intensity
          });
        }, totalDelay);
        
        totalDelay += emotionalPause;
        return;
      }
      
      if (!part.text) return;
      
      // Calculate sophisticated typing speed
      const typingSpeed = calculateTypingSpeed(
        part.text, 
        currentEmotion, 
        part.speed, 
        sentiment, 
        emotionalState
      );
      
      const partTypingDuration = Math.min(part.text.length * typingSpeed, 6000);
      
      // Show typing indicator with brief transition
      setTimeout(() => {
        setThinking(false);
        setCurrentThinkingEmotion('neutral');
        setTyping(true);
      }, totalDelay);
      
      // Add the message part with enhanced sentiment tracking
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
    
    godLog("🧬 Advanced EOM Processing Complete", { 
      originalMessage: reply,
      parsedParts: parts.length,
      totalDuration: totalDelay,
      emotions: parts.filter(p => p.isEOM).map(p => p.emotion),
      pauses: parts.filter(p => p.isEOM).map(p => p.pause),
      emotionalState: emotionalState,
      userSentiment: sentiment
    });
  }, [addMessage, parseAdvancedEOM, calculateTypingSpeed, sentiment, emotionalState]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || busy || isLoading) return;
    
    setBusy(true);
    setInput('');
    
    const userSentiment = analyzeSentiment(text);
    const adaptedPersonality = CONSTANTS.PERSONALITY_LAYERS.FLIRTATIOUS; // Simplified for now

    setCurrentPersonality(adaptedPersonality);
    setCurrentSentiment(userSentiment);

    addMessage(text, 'user');
    
    try {
      const response = await makeRequest(CONSTANTS.API_ENDPOINTS.CHAT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          message: text,
          bond_score: 75, // Default bond score
          user_sentiment: userSentiment,
          adapted_personality: adaptedPersonality,
        })
      });
      godLog("🔗 API Response", response);
      
      // Use the structured response from the backend brain
      const messageToType = response.reply || response.message || "I'm here for you, darling 💕";
      const responsePersonality = response.meta?.emotion || adaptedPersonality;
      const responseSentiment = {
        primary: response.meta?.emotion || userSentiment.primary,
        intensity: response.meta?.bondScore ? Math.floor(response.meta.bondScore / 2) : userSentiment.intensity
      };
      
      simulateBonnieTyping(messageToType, responsePersonality, responseSentiment);
    } catch (err) {
      godLog("❌ API Error", err);
      simulateBonnieTyping("Oops… I'm having some technical difficulties, but I'm still here! 💔", adaptedPersonality, userSentiment);
    } finally {
      setBusy(false);
    }
  }, [input, busy, isLoading, sessionId, makeRequest, simulateBonnieTyping, addMessage]);

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>Bonnie 💋</h1>
        <div style={styles.statusDot} title={online ? "Online" : "Connecting..."}></div>
      </header>

      {/* Messages */}
      <main style={styles.messagesContainer} className="messages-container">
        {messages.map((msg) => (
          <div key={msg.id} style={styles.messageWrapper} className="message-wrapper">
            <div style={{
              ...styles.message,
              ...(msg.sender === 'user' ? styles.userMessage : styles.bonnieMessage),
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        
        {thinking && (
          <div style={styles.messageWrapper}>
            <div style={{
              ...styles.thinkingIndicator,
              ...(currentThinkingEmotion === 'passionate' && {animation: 'heartbeat 1s ease-in-out infinite'}),
              ...(currentThinkingEmotion === 'shy' && {animation: 'breathe 4s ease-in-out infinite'}),
              ...(currentThinkingEmotion === 'flirty' && {animation: 'float 1.5s ease-in-out infinite'})
            }} className="thinking-indicator">
              <span style={styles.thinkingDot} className="thinking-dot">
                {currentThinkingEmotion === 'shy' ? '😳' :
                 currentThinkingEmotion === 'flirty' ? '😏' :
                 currentThinkingEmotion === 'passionate' ? '😍' :
                 currentThinkingEmotion === 'intimate' ? '🥰' :
                 currentThinkingEmotion === 'vulnerable' ? '🥺' :
                 currentThinkingEmotion === 'teasing' ? '😈' :
                 currentThinkingEmotion === 'sad' ? '😔' :
                 currentThinkingEmotion === 'playful' ? '😜' : '💭'}
              </span>
              <span style={{...styles.thinkingText, marginLeft: '8px'}}>
                {currentThinkingEmotion === 'shy' ? 'Bonnie is hesitating...' :
                 currentThinkingEmotion === 'flirty' ? 'Bonnie is smirking...' :
                 currentThinkingEmotion === 'passionate' ? 'Bonnie is breathing heavily...' :
                 currentThinkingEmotion === 'intimate' ? 'Bonnie is getting closer...' :
                 currentThinkingEmotion === 'vulnerable' ? 'Bonnie is taking a deep breath...' :
                 currentThinkingEmotion === 'teasing' ? 'Bonnie is plotting something...' :
                 currentThinkingEmotion === 'sad' ? 'Bonnie is processing...' :
                 currentThinkingEmotion === 'playful' ? 'Bonnie is giggling...' : 'Bonnie is thinking...'}
              </span>
            </div>
          </div>
        )}
        
        {typing && (
          <div style={styles.messageWrapper}>
            <div style={styles.typingIndicator}>
              <span style={styles.typingDot} className="typing-dot"></span>
              <span style={styles.typingDot} className="typing-dot"></span>
              <span style={styles.typingDot} className="typing-dot"></span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </main>

      {/* Input */}
      <footer style={styles.inputContainer}>
        <div style={styles.inputWrapper}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            placeholder="Type your message..."
            disabled={isLoading || busy}
            style={{
              ...styles.input,
              ...(inputFocused ? styles.inputFocus : {}),
            }}
          />
        </div>
        <button
          onClick={handleSend}
          disabled={isLoading || busy || !input.trim()}
          onMouseEnter={() => setButtonHovered(true)}
          onMouseLeave={() => setButtonHovered(false)}
          style={{
            ...styles.sendButton,
            ...(buttonHovered && !isLoading && !busy && input.trim() ? styles.sendButtonHover : {}),
            ...(isLoading || busy || !input.trim() ? styles.sendButtonDisabled : {}),
          }}
        >
          {isLoading || busy ? '⏳' : '💌'}
        </button>
      </footer>
    </div>
  );
}
