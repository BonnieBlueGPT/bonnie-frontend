import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';

// Enhanced Constants with Emotional Intelligence
const CONSTANTS = {
  API_ENDPOINTS: {
    CHAT: 'https://bonnie-backend-server.onrender.com/bonnie-chat',
    ENTRY: 'https://bonnie-backend-server.onrender.com/bonnie-entry'
  },
  TYPING_SPEEDS: { slow: 120, normal: 64, fast: 35 },
  IDLE_TIMEOUT: 30000,
  MAX_MESSAGES: 100,
  COLORS: {
    primary: '#e91e63',
    online: '#28a745',
    offline: '#aaa',
    background: '#fff0f6',
    border: '#ffe6f0'
  },
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  
  // God-Tier Emotional Intelligence System
  PERSONALITY_LAYERS: {
    FLIRTATIOUS: 'flirtatious',
    SUPPORTIVE: 'supportive', 
    TEASING: 'teasing',
    GENTLE: 'gentle',
    PASSIONATE: 'passionate',
    PLAYFUL: 'playful'
  },
  
  SENTIMENT_TYPES: {
    FLIRTY: 'flirty',
    SAD: 'sad',
    HAPPY: 'happy',
    INTIMATE: 'intimate',
    PLAYFUL: 'playful',
    SERIOUS: 'serious',
    TEASING: 'teasing',
    VULNERABLE: 'vulnerable'
  },
  
  EMOJI_CONTEXTS: {
    FLIRTY: ['😘', '😏', '😉', '💋', '🔥'],
    ROMANTIC: ['💖', '💕', '😍', '🥰', '💘'],
    PLAYFUL: ['😜', '😋', '🤪', '😄', '😊'],
    SUPPORTIVE: ['🥺', '💌', '🤗', '💜', '✨'],
    TEASING: ['😏', '😈', '🙄', '😌', '🤭'],
    PASSIONATE: ['🔥', '💫', '😍', '💖', '🌹'],
    GENTLE: ['🥰', '💕', '🌸', '💫', '🦋']
  }
};

// God-Tier Sentiment Analysis System
const analyzeSentiment = (text) => {
  const lowerText = text.toLowerCase();
  
  // Flirty indicators
  const flirtyWords = ['sexy', 'hot', 'beautiful', 'gorgeous', 'cute', 'kiss', 'love', 'baby', 'darling', 'honey'];
  const flirtyScore = flirtyWords.filter(word => lowerText.includes(word)).length;
  
  // Intimate indicators
  const intimateWords = ['miss', 'need', 'want', 'desire', 'close', 'together', 'feel', 'heart'];
  const intimateScore = intimateWords.filter(word => lowerText.includes(word)).length;
  
  // Sad/vulnerable indicators
  const sadWords = ['sad', 'hurt', 'lonely', 'upset', 'tired', 'stressed', 'difficult', 'hard'];
  const sadScore = sadWords.filter(word => lowerText.includes(word)).length;
  
  // Playful indicators
  const playfulWords = ['haha', 'lol', 'funny', 'joke', 'silly', 'crazy', 'fun', 'play'];
  const playfulScore = playfulWords.filter(word => lowerText.includes(word)).length;
  
  // Teasing indicators
  const teasingWords = ['maybe', 'perhaps', 'guess', 'see', 'hmm', 'interesting', 'really'];
  const teasingScore = teasingWords.filter(word => lowerText.includes(word)).length;
  
  // Determine primary sentiment
  const scores = {
    [CONSTANTS.SENTIMENT_TYPES.FLIRTY]: flirtyScore * 2,
    [CONSTANTS.SENTIMENT_TYPES.INTIMATE]: intimateScore * 2,
    [CONSTANTS.SENTIMENT_TYPES.SAD]: sadScore * 3,
    [CONSTANTS.SENTIMENT_TYPES.PLAYFUL]: playfulScore,
    [CONSTANTS.SENTIMENT_TYPES.TEASING]: teasingScore,
    [CONSTANTS.SENTIMENT_TYPES.HAPPY]: (text.includes('!') ? 1 : 0) + playfulScore,
    [CONSTANTS.SENTIMENT_TYPES.SERIOUS]: lowerText.length > 100 ? 1 : 0,
    [CONSTANTS.SENTIMENT_TYPES.VULNERABLE]: sadScore * 2
  };
  
  const primarySentiment = Object.keys(scores).reduce((a, b) => 
    scores[a] > scores[b] ? a : b
  );
  
  return {
    primary: primarySentiment,
    intensity: Math.max(...Object.values(scores)),
    scores
  };
};

// Dynamic Personality Selection Based on Context
const selectPersonality = (bondScore, userSentiment, conversationHistory) => {
  const { primary, intensity } = userSentiment;
  
  // High bond users get more intimate personalities
  if (bondScore >= 70) {
    if (primary === CONSTANTS.SENTIMENT_TYPES.FLIRTY) return CONSTANTS.PERSONALITY_LAYERS.PASSIONATE;
    if (primary === CONSTANTS.SENTIMENT_TYPES.INTIMATE) return CONSTANTS.PERSONALITY_LAYERS.GENTLE;
    if (primary === CONSTANTS.SENTIMENT_TYPES.SAD) return CONSTANTS.PERSONALITY_LAYERS.SUPPORTIVE;
    return CONSTANTS.PERSONALITY_LAYERS.PASSIONATE;
  }
  
  // Medium bond users get adaptive personalities
  if (bondScore >= 40) {
    if (primary === CONSTANTS.SENTIMENT_TYPES.FLIRTY) return CONSTANTS.PERSONALITY_LAYERS.FLIRTATIOUS;
    if (primary === CONSTANTS.SENTIMENT_TYPES.PLAYFUL) return CONSTANTS.PERSONALITY_LAYERS.PLAYFUL;
    if (primary === CONSTANTS.SENTIMENT_TYPES.SAD) return CONSTANTS.PERSONALITY_LAYERS.SUPPORTIVE;
    if (primary === CONSTANTS.SENTIMENT_TYPES.TEASING) return CONSTANTS.PERSONALITY_LAYERS.TEASING;
    return CONSTANTS.PERSONALITY_LAYERS.FLIRTATIOUS;
  }
  
  // Low bond users get lighter personalities
  if (primary === CONSTANTS.SENTIMENT_TYPES.SAD) return CONSTANTS.PERSONALITY_LAYERS.SUPPORTIVE;
  if (primary === CONSTANTS.SENTIMENT_TYPES.PLAYFUL) return CONSTANTS.PERSONALITY_LAYERS.PLAYFUL;
  if (primary === CONSTANTS.SENTIMENT_TYPES.FLIRTY) return CONSTANTS.PERSONALITY_LAYERS.TEASING;
  return CONSTANTS.PERSONALITY_LAYERS.PLAYFUL;
};

// Intelligent Emoji Selection System
const selectContextualEmoji = (personality, sentiment, bondScore, messageContent) => {
  const emojiPool = CONSTANTS.EMOJI_CONTEXTS[personality.toUpperCase()] || CONSTANTS.EMOJI_CONTEXTS.PLAYFUL;
  
  // Emoji frequency based on bond score and emotional intensity
  const baseFrequency = Math.min(bondScore / 20, 4); // 0-4 emojis max
  const sentimentBoost = sentiment.intensity > 2 ? 1 : 0;
  const emojiCount = Math.floor(baseFrequency + sentimentBoost);
  
  if (emojiCount === 0) return '';
  
  // Select contextually appropriate emojis
  const selectedEmojis = [];
  for (let i = 0; i < emojiCount; i++) {
    const randomEmoji = emojiPool[Math.floor(Math.random() * emojiPool.length)];
    if (!selectedEmojis.includes(randomEmoji)) {
      selectedEmojis.push(randomEmoji);
    }
  }
  
  return selectedEmojis.join(' ');
};

// Dynamic Pause Calculation Based on Emotional Context
const calculateEmotionalPause = (personality, sentiment, bondScore, messageLength) => {
  let basePause = 1000;
  
  // Personality-based pause modifiers
  const personalityModifiers = {
    [CONSTANTS.PERSONALITY_LAYERS.PASSIONATE]: 1.5,
    [CONSTANTS.PERSONALITY_LAYERS.GENTLE]: 1.8,
    [CONSTANTS.PERSONALITY_LAYERS.SUPPORTIVE]: 1.6,
    [CONSTANTS.PERSONALITY_LAYERS.FLIRTATIOUS]: 1.2,
    [CONSTANTS.PERSONALITY_LAYERS.TEASING]: 0.8,
    [CONSTANTS.PERSONALITY_LAYERS.PLAYFUL]: 0.9
  };
  
  // Sentiment-based pause modifiers
  const sentimentModifiers = {
    [CONSTANTS.SENTIMENT_TYPES.INTIMATE]: 1.7,
    [CONSTANTS.SENTIMENT_TYPES.VULNERABLE]: 2.0,
    [CONSTANTS.SENTIMENT_TYPES.FLIRTY]: 1.3,
    [CONSTANTS.SENTIMENT_TYPES.PLAYFUL]: 0.7,
    [CONSTANTS.SENTIMENT_TYPES.TEASING]: 0.8,
    [CONSTANTS.SENTIMENT_TYPES.SERIOUS]: 1.5
  };
  
  // Bond score influence (higher bond = longer pauses for intimacy)
  const bondModifier = 1 + (bondScore / 200); // 1.0 to 1.5x
  
  // Message length influence
  const lengthModifier = Math.min(messageLength / 50, 2); // Longer messages = longer pauses
  
  const finalPause = basePause * 
    (personalityModifiers[personality] || 1) * 
    (sentimentModifiers[sentiment.primary] || 1) * 
    bondModifier * 
    lengthModifier;
  
  return Math.max(500, Math.min(finalPause, 4000)); // 0.5s to 4s range
};

// Enhanced Message Parsing with Emotional Intelligence
const parseMessageParts = (raw, personality, sentiment, bondScore) => {
  console.log("🔍 Parsing with emotional context:", { personality, sentiment, bondScore });
  
  const segments = raw.split(/<EOM(?:::(.*?))?>/).filter(Boolean);
  const finalParts = [];
  let currentMeta = { pause: 1000, speed: 'normal', emotion: 'neutral' };
  
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i].trim();
    
    // Check for metadata
    const metaMatch = segment.match(/(?:pause=(\d+))?(?:.*?speed=(\w+))?(?:.*?emotion=(\w+))?/);
    const hasMetadata = metaMatch && (metaMatch[1] || metaMatch[2] || metaMatch[3]);
    
    if (hasMetadata) {
      if (metaMatch[1]) currentMeta.pause = parseInt(metaMatch[1]);
      if (metaMatch[2]) currentMeta.speed = metaMatch[2];
      if (metaMatch[3]) currentMeta.emotion = metaMatch[3];
    } else if (segment.length > 0) {
      // Enhanced: Add contextual emojis to text
      const contextualEmoji = selectContextualEmoji(personality, sentiment, bondScore, segment);
      const enhancedText = contextualEmoji ? `${segment} ${contextualEmoji}` : segment;
      
      // Enhanced: Calculate emotional pause
      const emotionalPause = calculateEmotionalPause(personality, sentiment, bondScore, segment.length);
      
      finalParts.push({
        text: enhancedText,
        pause: emotionalPause,
        speed: currentMeta.speed,
        emotion: currentMeta.emotion || personality,
        personality,
        sentiment: sentiment.primary
      });
      
      // Reset metadata
      currentMeta = { pause: 1000, speed: 'normal', emotion: 'neutral' };
    }
  }
  
  return finalParts.filter(part => part.text && part.text.trim() !== '');
};

// Utility functions
const generateSessionId = () => {
  let id = localStorage.getItem('bonnie_session');
  if (!id) {
    id = 'guest_' + Math.random().toString(36).slice(2) + '_' + Date.now();
    localStorage.setItem('bonnie_session', id);
  }
  return id;
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Custom hook for API calls with retry logic
const useApiCall = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const makeRequest = useCallback(async (url, options, retries = CONSTANTS.RETRY_ATTEMPTS) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setIsLoading(false);
      return data;
    } catch (err) {
      if (retries > 0) {
        await sleep(CONSTANTS.RETRY_DELAY);
        return makeRequest(url, options, retries - 1);
      }
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  }, []);

  return { makeRequest, isLoading, error };
};

// Enhanced Message component with emotional styling
const Message = React.memo(({ message, isUser }) => {
  const messageStyle = useMemo(() => {
    const baseStyle = {
      maxWidth: '75%',
      padding: 12,
      borderRadius: 12,
      margin: '6px 0',
      fontSize: 14,
      lineHeight: 1.4,
      wordBreak: 'break-word',
      transition: 'all 0.3s ease'
    };

    if (isUser) {
      return {
        ...baseStyle,
        background: `linear-gradient(135deg, #ff83a0, ${CONSTANTS.COLORS.primary})`,
        color: '#fff',
        alignSelf: 'flex-end',
        marginLeft: 'auto'
      };
    }

    // Enhanced: Personality-based styling for Bonnie's messages
    const personalityColors = {
      [CONSTANTS.PERSONALITY_LAYERS.PASSIONATE]: 'linear-gradient(135deg, #ffb3d1, #ff80bf)',
      [CONSTANTS.PERSONALITY_LAYERS.GENTLE]: 'linear-gradient(135deg, #e6f3ff, #cce7ff)',
      [CONSTANTS.PERSONALITY_LAYERS.SUPPORTIVE]: 'linear-gradient(135deg, #f0e6ff, #e6ccff)',
      [CONSTANTS.PERSONALITY_LAYERS.FLIRTATIOUS]: 'linear-gradient(135deg, #ffe6f0, #ffccdd)',
      [CONSTANTS.PERSONALITY_LAYERS.TEASING]: 'linear-gradient(135deg, #fff0e6, #ffe6cc)',
      [CONSTANTS.PERSONALITY_LAYERS.PLAYFUL]: 'linear-gradient(135deg, #f0fff0, #e6ffe6)'
    };

    const personality = message.personality || CONSTANTS.PERSONALITY_LAYERS.PLAYFUL;
    
    return {
      ...baseStyle,
      background: personalityColors[personality] || CONSTANTS.COLORS.background,
      border: `1px solid ${CONSTANTS.COLORS.border}`,
      color: '#333',
      alignSelf: 'flex-start'
    };
  }, [isUser, message.personality]);

  return (
    <div style={messageStyle} role="listitem">
      {message.text}
      {message.timestamp && (
        <div style={{ fontSize: 10, opacity: 0.7, marginTop: 4 }}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
});

// Enhanced Typing indicator with personality-based colors
const TypingIndicator = React.memo(({ personality = 'playful', sentiment = 'neutral' }) => {
  const personalityColors = {
    [CONSTANTS.PERSONALITY_LAYERS.PASSIONATE]: '#dc143c',
    [CONSTANTS.PERSONALITY_LAYERS.GENTLE]: '#87ceeb',
    [CONSTANTS.PERSONALITY_LAYERS.SUPPORTIVE]: '#dda0dd',
    [CONSTANTS.PERSONALITY_LAYERS.FLIRTATIOUS]: '#ff69b4',
    [CONSTANTS.PERSONALITY_LAYERS.TEASING]: '#ffa500',
    [CONSTANTS.PERSONALITY_LAYERS.PLAYFUL]: '#32cd32'
  };

  const color = personalityColors[personality] || CONSTANTS.COLORS.primary;

  return (
    <div style={{ display: 'flex', gap: 4, margin: '8px 0' }} role="status" aria-label="Bonnie is typing">
      {[0, 0.2, 0.4].map((delay, index) => (
        <div
          key={index}
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            background: color,
            animation: `bounce 1s infinite ease-in-out`,
            animationDelay: `${delay}s`
          }}
        />
      ))}
    </div>
  );
});

export default function BonnieChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [typing, setTyping] = useState(false);
  const [currentPersonality, setCurrentPersonality] = useState(CONSTANTS.PERSONALITY_LAYERS.PLAYFUL);
  const [currentSentiment, setCurrentSentiment] = useState({ primary: 'neutral', intensity: 0 });
  const [online, setOnline] = useState(false);
  const [pendingMessage, setPendingMessage] = useState(null);
  const [hasFiredIdleMessage, setHasFiredIdleMessage] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [userProfile, setUserProfile] = useState({ 
    bondScore: 0, 
    isNewUser: true, 
    userName: null,
    conversationHistory: [],
    emotionalPattern: {}
  });
  
  const endRef = useRef(null);
  const idleTimerRef = useRef(null);
  const typingProcessRef = useRef(null);
  const sessionId = useMemo(() => generateSessionId(), []);
  
  const { makeRequest, isLoading, error } = useApiCall();

  // Enhanced message management with emotional context
  const addMessage = useCallback((text, sender, personality = null, sentiment = null) => {
    if (!text || typeof text !== 'string' || text.trim() === '') {
      console.warn("⚠️ Attempted to add empty/invalid message, skipping:", text);
      return;
    }

    const cleanText = text.trim();
    if (cleanText.length === 0) {
      console.warn("⚠️ Message became empty after trimming, skipping");
      return;
    }

    const newMessage = {
      id: Date.now() + Math.random(),
      sender,
      text: cleanText,
      timestamp: Date.now(),
      personality,
      sentiment
    };
    
    console.log("✅ Adding message with emotional context:", newMessage);
    
    setMessages(prevMessages => {
      const newMessages = [...prevMessages, newMessage];
      return newMessages.length > CONSTANTS.MAX_MESSAGES 
        ? newMessages.slice(-CONSTANTS.MAX_MESSAGES) 
        : newMessages;
    });
  }, []);

  // God-Tier initialization with emotional intelligence
  useEffect(() => {
    const initializeChat = async () => {
      console.log("🚀 Initializing God-Tier emotional chat system...");
      setConnectionStatus('connecting');
      
      try {
        const response = await makeRequest(CONSTANTS.API_ENDPOINTS.ENTRY, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            session_id: sessionId,
            request_type: 'god_tier_entry',
            emotional_context: true,
            user_agent: navigator.userAgent,
            timestamp: Date.now()
          })
        });
        
        const { 
          reply, 
          delay = 1000, 
          bond_score = 0, 
          is_new_user = true, 
          user_name = null,
          personality = CONSTANTS.PERSONALITY_LAYERS.PLAYFUL,
          sentiment_analysis = { primary: 'neutral', intensity: 0 }
        } = response;
        
        // Update user profile with emotional intelligence data
        setUserProfile({
          bondScore: bond_score,
          isNewUser: is_new_user,
          userName: user_name,
          conversationHistory: [],
          emotionalPattern: {}
        });
        
        setCurrentPersonality(personality);
        setCurrentSentiment(sentiment_analysis);
        
        setOnline(true);
        setConnectionStatus('online');
        
        setTimeout(() => {
          simulateBonnieTyping(reply, personality, sentiment_analysis);
        }, delay);
        
      } catch (err) {
        console.error('❌ Failed to initialize chat:', err);
        
        // Fallback with basic emotional intelligence
        const fallbackPersonality = CONSTANTS.PERSONALITY_LAYERS.PLAYFUL;
        const fallbackSentiment = { primary: 'neutral', intensity: 0 };
        
        setCurrentPersonality(fallbackPersonality);
        setCurrentSentiment(fallbackSentiment);
        setOnline(true);
        setConnectionStatus('online');
        
        const fallbackGreeting = "Well, look who's here... let's have some fun, shall we? 😘";
        setTimeout(() => {
          simulateBonnieTyping(fallbackGreeting, fallbackPersonality, fallbackSentiment);
        }, 1000);
      }
    };

    initializeChat();
  }, [sessionId, makeRequest]);

  // God-Tier typing simulation with full emotional intelligence
  const simulateBonnieTyping = useCallback((raw, personality, sentiment) => {
    console.log("💬 God-Tier typing simulation:", { raw, personality, sentiment });
    
    if (!online) return;

    if (typingProcessRef.current) {
      clearTimeout(typingProcessRef.current);
      typingProcessRef.current = null;
    }

    if (!raw || typeof raw !== 'string' || raw.trim() === '') {
      console.warn("⚠️ Invalid message:", raw);
      setBusy(false);
      return;
    }

    // Enhanced parsing with emotional intelligence
    const parts = parseMessageParts(raw, personality, sentiment, userProfile.bondScore);
    
    const validParts = parts.filter(part => part.text && part.text.trim() !== '');
    
    if (validParts.length === 0) {
      console.warn("⚠️ No valid parts found");
      setBusy(false);
      return;
    }

    console.log(`🚀 Processing ${validParts.length} emotionally intelligent parts:`, validParts);

    let currentIndex = 0;
    const processNextPart = async () => {
      if (currentIndex >= validParts.length) {
        console.log("✅ Completed God-Tier typing simulation");
        setBusy(false);
        setTyping(false);
        typingProcessRef.current = null;
        return;
      }

      const part = validParts[currentIndex];
      
      if (!part || !part.text || part.text.trim() === '') {
        currentIndex++;
        typingProcessRef.current = setTimeout(processNextPart, 100);
        return;
      }

      console.log(`✅ Processing emotional part ${currentIndex + 1}/${validParts.length}:`, part);
      
      // Emotional pause
      await sleep(part.pause);
      
      // Show typing with personality
      setTyping(true);
      setCurrentPersonality(part.personality);
      
      // Emotional typing speed
      const typingTime = part.text.length * (CONSTANTS.TYPING_SPEEDS[part.speed] || CONSTANTS.TYPING_SPEEDS.normal);
      await sleep(typingTime);
      
      setTyping(false);
      
      // Add message with emotional context
      addMessage(part.text, 'bonnie', part.personality, part.sentiment);
      
      currentIndex++;
      typingProcessRef.current = setTimeout(processNextPart, 400);
    };

    setBusy(true);
    processNextPart();
  }, [online, addMessage, userProfile.bondScore]);

  // God-Tier send function with real-time emotional analysis
  const handleSend = useCallback(async (text) => {
    if (!text?.trim()) return;
    
    const messageText = text.trim();
    setInput('');
    setBusy(true);
    setHasFiredIdleMessage(false);
    
    // Real-time sentiment analysis
    const userSentiment = analyzeSentiment(messageText);
    console.log("🧠 User sentiment analysis:", userSentiment);
    
    // Dynamic personality selection
    const adaptedPersonality = selectPersonality(userProfile.bondScore, userSentiment, userProfile.conversationHistory);
    console.log("🎭 Adapted personality:", adaptedPersonality);
    
    setCurrentPersonality(adaptedPersonality);
    setCurrentSentiment(userSentiment);
    
    await
This is an excellent upgrade plan! You're absolutely right that we need to move beyond simple bond score thresholds to create truly dynamic, emotionally intelligent conversations. Let me implement this God-Tier system with real-time emotional adaptation, intelligent emoji placement, and sentiment-driven responses.

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';

// Enhanced Constants with Emotional Intelligence
const CONSTANTS = {
  API_ENDPOINTS: {
    CHAT: 'https://bonnie-backend-server.onrender.com/bonnie-chat',
    ENTRY: 'https://bonnie-backend-server.onrender.com/bonnie-entry'
  },
  TYPING_SPEEDS: { slow: 120, normal: 64, fast: 35 },
  IDLE_TIMEOUT: 30000,
  MAX_MESSAGES: 100,
  COLORS: {
    primary: '#e91e63',
    online: '#28a745',
    offline: '#aaa',
    background: '#fff0f6',
    border: '#ffe6f0'
  },
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  
  // God-Tier Emotional Intelligence System
  PERSONALITY_LAYERS: {
    FLIRTATIOUS: 'flirtatious',
    SUPPORTIVE: 'supportive', 
    TEASING: 'teasing',
    GENTLE: 'gentle',
    PASSIONATE: 'passionate',
    PLAYFUL: 'playful'
  },
  
  SENTIMENT_TYPES: {
    FLIRTY: 'flirty',
    SAD: 'sad',
    HAPPY: 'happy',
    INTIMATE: 'intimate',
    PLAYFUL: 'playful',
    SERIOUS: 'serious',
    TEASING: 'teasing',
    VULNERABLE: 'vulnerable'
  },
  
  EMOJI_CONTEXTS: {
    FLIRTY: ['😘', '😏', '😉', '💋', '🔥'],
    ROMANTIC: ['💖', '💕', '😍', '🥰', '💘'],
    PLAYFUL: ['😜', '😋', '🤪', '😄', '😊'],
    SUPPORTIVE: ['🥺', '💌', '🤗', '💜', '✨'],
    TEASING: ['😏', '😈', '🙄', '😌', '🤭'],
    PASSIONATE: ['🔥', '💫', '😍', '💖', '🌹'],
    GENTLE: ['🥰', '💕', '🌸', '💫', '🦋']
  }
};

// God-Tier Sentiment Analysis System
const analyzeSentiment = (text) => {
  const lowerText = text.toLowerCase();
  
  // Flirty indicators
  const flirtyWords = ['sexy', 'hot', 'beautiful', 'gorgeous', 'cute', 'kiss', 'love', 'baby', 'darling', 'honey'];
  const flirtyScore = flirtyWords.filter(word => lowerText.includes(word)).length;
  
  // Intimate indicators
  const intimateWords = ['miss', 'need', 'want', 'desire', 'close', 'together', 'feel', 'heart'];
  const intimateScore = intimateWords.filter(word => lowerText.includes(word)).length;
  
  // Sad/vulnerable indicators
  const sadWords = ['sad', 'hurt', 'lonely', 'upset', 'tired', 'stressed', 'difficult', 'hard'];
  const sadScore = sadWords.filter(word => lowerText.includes(word)).length;
  
  // Playful indicators
  const playfulWords = ['haha', 'lol', 'funny', 'joke', 'silly', 'crazy', 'fun', 'play'];
  const playfulScore = playfulWords.filter(word => lowerText.includes(word)).length;
  
  // Teasing indicators
  const teasingWords = ['maybe', 'perhaps', 'guess', 'see', 'hmm', 'interesting', 'really'];
  const teasingScore = teasingWords.filter(word => lowerText.includes(word)).length;
  
  // Determine primary sentiment
  const scores = {
    [CONSTANTS.SENTIMENT_TYPES.FLIRTY]: flirtyScore * 2,
    [CONSTANTS.SENTIMENT_TYPES.INTIMATE]: intimateScore * 2,
    [CONSTANTS.SENTIMENT_TYPES.SAD]: sadScore * 3,
    [CONSTANTS.SENTIMENT_TYPES.PLAYFUL]: playfulScore,
    [CONSTANTS.SENTIMENT_TYPES.TEASING]: teasingScore,
    [CONSTANTS.SENTIMENT_TYPES.HAPPY]: (text.includes('!') ? 1 : 0) + playfulScore,
    [CONSTANTS.SENTIMENT_TYPES.SERIOUS]: lowerText.length > 100 ? 1 : 0,
    [CONSTANTS.SENTIMENT_TYPES.VULNERABLE]: sadScore * 2
  };
  
  const primarySentiment = Object.keys(scores).reduce((a, b) => 
    scores[a] > scores[b] ? a : b
  );
  
  return {
    primary: primarySentiment,
    intensity: Math.max(...Object.values(scores)),
    scores
  };
};

// Dynamic Personality Selection Based on Context
const selectPersonality = (bondScore, userSentiment, conversationHistory) => {
  const { primary, intensity } = userSentiment;
  
  // High bond users get more intimate personalities
  if (bondScore >= 70) {
    if (primary === CONSTANTS.SENTIMENT_TYPES.FLIRTY) return CONSTANTS.PERSONALITY_LAYERS.PASSIONATE;
    if (primary === CONSTANTS.SENTIMENT_TYPES.INTIMATE) return CONSTANTS.PERSONALITY_LAYERS.GENTLE;
    if (primary === CONSTANTS.SENTIMENT_TYPES.SAD) return CONSTANTS.PERSONALITY_LAYERS.SUPPORTIVE;
    return CONSTANTS.PERSONALITY_LAYERS.PASSIONATE;
  }
  
  // Medium bond users get adaptive personalities
  if (bondScore >= 40) {
    if (primary === CONSTANTS.SENTIMENT_TYPES.FLIRTY) return CONSTANTS.PERSONALITY_LAYERS.FLIRTATIOUS;
    if (primary === CONSTANTS.SENTIMENT_TYPES.PLAYFUL) return CONSTANTS.PERSONALITY_LAYERS.PLAYFUL;
    if (primary === CONSTANTS.SENTIMENT_TYPES.SAD) return CONSTANTS.PERSONALITY_LAYERS.SUPPORTIVE;
    if (primary === CONSTANTS.SENTIMENT_TYPES.TEASING) return CONSTANTS.PERSONALITY_LAYERS.TEASING;
    return CONSTANTS.PERSONALITY_LAYERS.FLIRTATIOUS;
  }
  
  // Low bond users get lighter personalities
  if (primary === CONSTANTS.SENTIMENT_TYPES.SAD) return CONSTANTS.PERSONALITY_LAYERS.SUPPORTIVE;
  if (primary === CONSTANTS.SENTIMENT_TYPES.PLAYFUL) return CONSTANTS.PERSONALITY_LAYERS.PLAYFUL;
  if (primary === CONSTANTS.SENTIMENT_TYPES.FLIRTY) return CONSTANTS.PERSONALITY_LAYERS.TEASING;
  return CONSTANTS.PERSONALITY_LAYERS.PLAYFUL;
};

// Intelligent Emoji Selection System
const selectContextualEmoji = (personality, sentiment, bondScore, messageContent) => {
  const emojiPool = CONSTANTS.EMOJI_CONTEXTS[personality.toUpperCase()] || CONSTANTS.EMOJI_CONTEXTS.PLAYFUL;
  
  // Emoji frequency based on bond score and emotional intensity
  const baseFrequency = Math.min(bondScore / 20, 4); // 0-4 emojis max
  const sentimentBoost = sentiment.intensity > 2 ? 1 : 0;
  const emojiCount = Math.floor(baseFrequency + sentimentBoost);
  
  if (emojiCount === 0) return '';
  
  // Select contextually appropriate emojis
  const selectedEmojis = [];
  for (let i = 0; i < emojiCount; i++) {
    const randomEmoji = emojiPool[Math.floor(Math.random() * emojiPool.length)];
    if (!selectedEmojis.includes(randomEmoji)) {
      selectedEmojis.push(randomEmoji);
    }
  }
  
  return selectedEmojis.join(' ');
};

// Dynamic Pause Calculation Based on Emotional Context
const calculateEmotionalPause = (personality, sentiment, bondScore, messageLength) => {
  let basePause = 1000;
  
  // Personality-based pause modifiers
  const personalityModifiers = {
    [CONSTANTS.PERSONALITY_LAYERS.PASSIONATE]: 1.5,
    [CONSTANTS.PERSONALITY_LAYERS.GENTLE]: 1.8,
    [CONSTANTS.PERSONALITY_LAYERS.SUPPORTIVE]: 1.6,
    [CONSTANTS.PERSONALITY_LAYERS.FLIRTATIOUS]: 1.2,
    [CONSTANTS.PERSONALITY_LAYERS.TEASING]: 0.8,
    [CONSTANTS.PERSONALITY_LAYERS.PLAYFUL]: 0.9
  };
  
  // Sentiment-based pause modifiers
  const sentimentModifiers = {
    [CONSTANTS.SENTIMENT_TYPES.INTIMATE]: 1.7,
    [CONSTANTS.SENTIMENT_TYPES.VULNERABLE]: 2.0,
    [CONSTANTS.SENTIMENT_TYPES.FLIRTY]: 1.3,
    [CONSTANTS.SENTIMENT_TYPES.PLAYFUL]: 0.7,
    [CONSTANTS.SENTIMENT_TYPES.TEASING]: 0.8,
    [CONSTANTS.SENTIMENT_TYPES.SERIOUS]: 1.5
  };
  
  // Bond score influence (higher bond = longer pauses for intimacy)
  const bondModifier = 1 + (bondScore / 200); // 1.0 to 1.5x
  
  // Message length influence
  const lengthModifier = Math.min(messageLength / 50, 2); // Longer messages = longer pauses
  
  const finalPause = basePause * 
    (personalityModifiers[personality] || 1) * 
    (sentimentModifiers[sentiment.primary] || 1) * 
    bondModifier * 
    lengthModifier;
  
  return Math.max(500, Math.min(finalPause, 4000)); // 0.5s to 4s range
};

// Enhanced Message Parsing with Emotional Intelligence
const parseMessageParts = (raw, personality, sentiment, bondScore) => {
  console.log("🔍 Parsing with emotional context:", { personality, sentiment, bondScore });
  
  const segments = raw.split(/<EOM(?:::(.*?))?>/).filter(Boolean);
  const finalParts = [];
  let currentMeta = { pause: 1000, speed: 'normal', emotion: 'neutral' };
  
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i].trim();
    
    // Check for metadata
    const metaMatch = segment.match(/(?:pause=(\d+))?(?:.*?speed=(\w+))?(?:.*?emotion=(\w+))?/);
    const hasMetadata = metaMatch && (metaMatch[1] || metaMatch[2] || metaMatch[3]);
    
    if (hasMetadata) {
      if (metaMatch[1]) currentMeta.pause = parseInt(metaMatch[1]);
      if (metaMatch[2]) currentMeta.speed = metaMatch[2];
      if (metaMatch[3]) currentMeta.emotion = metaMatch[3];
    } else if (segment.length > 0) {
      // Enhanced: Add contextual emojis to text
      const contextualEmoji = selectContextualEmoji(personality, sentiment, bondScore, segment);
      const enhancedText = contextualEmoji ? `${segment} ${contextualEmoji}` : segment;
      
      // Enhanced: Calculate emotional pause
      const emotionalPause = calculateEmotionalPause(personality, sentiment, bondScore, segment.length);
      
      finalParts.push({
        text: enhancedText,
        pause: emotionalPause,
        speed: currentMeta.speed,
        emotion: currentMeta.emotion || personality,
        personality,
        sentiment: sentiment.primary
      });
      
      // Reset metadata
      currentMeta = { pause: 1000, speed: 'normal', emotion: 'neutral' };
    }
  }
  
  return finalParts.filter(part => part.text && part.text.trim() !== '');
};

// Utility functions
const generateSessionId = () => {
  let id = localStorage.getItem('bonnie_session');
  if (!id) {
    id = 'guest_' + Math.random().toString(36).slice(2) + '_' + Date.now();
    localStorage.setItem('bonnie_session', id);
  }
  return id;
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Custom hook for API calls with retry logic
const useApiCall = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const makeRequest = useCallback(async (url, options, retries = CONSTANTS.RETRY_ATTEMPTS) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setIsLoading(false);
      return data;
    } catch (err) {
      if (retries > 0) {
        await sleep(CONSTANTS.RETRY_DELAY);
        return makeRequest(url, options, retries - 1);
      }
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  }, []);

  return { makeRequest, isLoading, error };
};

// Enhanced Message component with emotional styling
const Message = React.memo(({ message, isUser }) => {
  const messageStyle = useMemo(() => {
    const baseStyle = {
      maxWidth: '75%',
      padding: 12,
      borderRadius: 12,
      margin: '6px 0',
      fontSize: 14,
      lineHeight: 1.4,
      wordBreak: 'break-word',
      transition: 'all 0.3s ease'
    };

    if (isUser) {
      return {
        ...baseStyle,
        background: `linear-gradient(135deg, #ff83a0, ${CONSTANTS.COLORS.primary})`,
        color: '#fff',
        alignSelf: 'flex-end',
        marginLeft: 'auto'
      };
    }

    // Enhanced: Personality-based styling for Bonnie's messages
    const personalityColors = {
      [CONSTANTS.PERSONALITY_LAYERS.PASSIONATE]: 'linear-gradient(135deg, #ffb3d1, #ff80bf)',
      [CONSTANTS.PERSONALITY_LAYERS.GENTLE]: 'linear-gradient(135deg, #e6f3ff, #cce7ff)',
      [CONSTANTS.PERSONALITY_LAYERS.SUPPORTIVE]: 'linear-gradient(135deg, #f0e6ff, #e6ccff)',
      [CONSTANTS.PERSONALITY_LAYERS.FLIRTATIOUS]: 'linear-gradient(135deg, #ffe6f0, #ffccdd)',
      [CONSTANTS.PERSONALITY_LAYERS.TEASING]: 'linear-gradient(135deg, #fff0e6, #ffe6cc)',
      [CONSTANTS.PERSONALITY_LAYERS.PLAYFUL]: 'linear-gradient(135deg, #f0fff0, #e6ffe6)'
    };

    const personality = message.personality || CONSTANTS.PERSONALITY_LAYERS.PLAYFUL;
    
    return {
      ...baseStyle,
      background: personalityColors[personality] || CONSTANTS.COLORS.background,
      border: `1px solid ${CONSTANTS.COLORS.border}`,
      color: '#333',
      alignSelf: 'flex-start'
    };
  }, [isUser, message.personality]);

  return (
    <div style={messageStyle} role="listitem">
      {message.text}
      {message.timestamp && (
        <div style={{ fontSize: 10, opacity: 0.7, marginTop: 4 }}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
});

// Enhanced Typing indicator with personality-based colors
const TypingIndicator = React.memo(({ personality = 'playful', sentiment = 'neutral' }) => {
  const personalityColors = {
    [CONSTANTS.PERSONALITY_LAYERS.PASSIONATE]: '#dc143c',
    [CONSTANTS.PERSONALITY_LAYERS.GENTLE]: '#87ceeb',
    [CONSTANTS.PERSONALITY_LAYERS.SUPPORTIVE]: '#dda0dd',
    [CONSTANTS.PERSONALITY_LAYERS.FLIRTATIOUS]: '#ff69b4',
    [CONSTANTS.PERSONALITY_LAYERS.TEASING]: '#ffa500',
    [CONSTANTS.PERSONALITY_LAYERS.PLAYFUL]: '#32cd32'
  };

  const color = personalityColors[personality] || CONSTANTS.COLORS.primary;

  return (
    <div style={{ display: 'flex', gap: 4, margin: '8px 0' }} role="status" aria-label="Bonnie is typing">
      {[0, 0.2, 0.4].map((delay, index) => (
        <div
          key={index}
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            background: color,
            animation: `bounce 1s infinite ease-in-out`,
            animationDelay: `${delay}s`
          }}
        />
      ))}
    </div>
  );
});

export default function BonnieChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [typing, setTyping] = useState(false);
  const [currentPersonality, setCurrentPersonality] = useState(CONSTANTS.PERSONALITY_LAYERS.PLAYFUL);
  const [currentSentiment, setCurrentSentiment] = useState({ primary: 'neutral', intensity: 0 });
  const [online, setOnline] = useState(false);
  const [pendingMessage, setPendingMessage] = useState(null);
  const [hasFiredIdleMessage, setHasFiredIdleMessage] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [userProfile, setUserProfile] = useState({ 
    bondScore: 0, 
    isNewUser: true, 
    userName: null,
    conversationHistory: [],
    emotionalPattern: {}
  });
  
  const endRef = useRef(null);
  const idleTimerRef = useRef(null);
  const typingProcessRef = useRef(null);
  const sessionId = useMemo(() => generateSessionId(), []);
  
  const { makeRequest, isLoading, error } = useApiCall();

  // Enhanced message management with emotional context
  const addMessage = useCallback((text, sender, personality = null, sentiment = null) => {
    if (!text || typeof text !== 'string' || text.trim() === '') {
      console.warn("⚠️ Attempted to add empty/invalid message, skipping:", text);
      return;
    }

    const cleanText = text.trim();
    if (cleanText.length === 0) {
      console.warn("⚠️ Message became empty after trimming, skipping");
      return;
    }

    const newMessage = {
      id: Date.now() + Math.random(),
      sender,
      text: cleanText,
      timestamp: Date.now(),
      personality,
      sentiment
    };
    
    console.log("✅ Adding message with emotional context:", newMessage);
    
    setMessages(prevMessages => {
      const newMessages = [...prevMessages, newMessage];
      return newMessages.length > CONSTANTS.MAX_MESSAGES 
        ? newMessages.slice(-CONSTANTS.MAX_MESSAGES) 
        : newMessages;
    });
  }, []);

  // God-Tier initialization with emotional intelligence
  useEffect(() => {
    const initializeChat = async () => {
      console.log("🚀 Initializing God-Tier emotional chat system...");
      setConnectionStatus('connecting');
      
      try {
        const response = await makeRequest(CONSTANTS.API_ENDPOINTS.ENTRY, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            session_id: sessionId,
            request_type: 'god_tier_entry',
            emotional_context: true,
            user_agent: navigator.userAgent,
            timestamp: Date.now()
          })
        });
        
        const { 
          reply, 
          delay = 1000, 
          bond_score = 0, 
          is_new_user = true, 
          user_name = null,
          personality = CONSTANTS.PERSONALITY_LAYERS.PLAYFUL,
          sentiment_analysis = { primary: 'neutral', intensity: 0 }
        } = response;
        
        // Update user profile with emotional intelligence data
        setUserProfile({
          bondScore: bond_score,
          isNewUser: is_new_user,
          userName: user_name,
          conversationHistory: [],
          emotionalPattern: {}
        });
        
        setCurrentPersonality(personality);
        setCurrentSentiment(sentiment_analysis);
        
        setOnline(true);
        setConnectionStatus('online');
        
        setTimeout(() => {
          simulateBonnieTyping(reply, personality, sentiment_analysis);
        }, delay);
        
      } catch (err) {
        console.error('❌ Failed to initialize chat:', err);
        
        // Fallback with basic emotional intelligence
        const fallbackPersonality = CONSTANTS.PERSONALITY_LAYERS.PLAYFUL;
        const fallbackSentiment = { primary: 'neutral', intensity: 0 };
        
        setCurrentPersonality(fallbackPersonality);
        setCurrentSentiment(fallbackSentiment);
        setOnline(true);
        setConnectionStatus('online');
        
        const fallbackGreeting = "Well, look who's here... let's have some fun, shall we? 😘";
        setTimeout(() => {
          simulateBonnieTyping(fallbackGreeting, fallbackPersonality, fallbackSentiment);
        }, 1000);
      }
    };

    initializeChat();
  }, [sessionId, makeRequest]);

  // God-Tier typing simulation with full emotional intelligence
  const simulateBonnieTyping = useCallback((raw, personality, sentiment) => {
    console.log("💬 God-Tier typing simulation:", { raw, personality, sentiment });
    
    if (!online) return;

    if (typingProcessRef.current) {
      clearTimeout(typingProcessRef.current);
      typingProcessRef.current = null;
    }

    if (!raw || typeof raw !== 'string' || raw.trim() === '') {
      console.warn("⚠️ Invalid message:", raw);
      setBusy(false);
      return;
    }

    // Enhanced parsing with emotional intelligence
    const parts = parseMessageParts(raw, personality, sentiment, userProfile.bondScore);
    
    const validParts = parts.filter(part => part.text && part.text.trim() !== '');
    
    if (validParts.length === 0) {
      console.warn("⚠️ No valid parts found");
      setBusy(false);
      return;
    }

    console.log(`🚀 Processing ${validParts.length} emotionally intelligent parts:`, validParts);

    let currentIndex = 0;
    const processNextPart = async () => {
      if (currentIndex >= validParts.length) {
        console.log("✅ Completed God-Tier typing simulation");
        setBusy(false);
        setTyping(false);
        typingProcessRef.current = null;
        return;
      }

      const part = validParts[currentIndex];
      
      if (!part || !part.text || part.text.trim() === '') {
        currentIndex++;
        typingProcessRef.current = setTimeout(processNextPart, 100);
        return;
      }

      console.log(`✅ Processing emotional part ${currentIndex + 1}/${validParts.length}:`, part);
      
      // Emotional pause
      await sleep(part.pause);
      
      // Show typing with personality
      setTyping(true);
      setCurrentPersonality(part.personality);
      
      // Emotional typing speed
      const typingTime = part.text.length * (CONSTANTS.TYPING_SPEEDS[part.speed] || CONSTANTS.TYPING_SPEEDS.normal);
      await sleep(typingTime);
      
      setTyping(false);
      
      // Add message with emotional context
      addMessage(part.text, 'bonnie', part.personality, part.sentiment);
      
      currentIndex++;
      typingProcessRef.current = setTimeout(processNextPart, 400);
    };

    setBusy(true);
    processNextPart();
  }, [online, addMessage, userProfile.bondScore]);

  // God-Tier send function with real-time emotional analysis
  const handleSend = useCallback(async (text) => {
    if (!text?.trim()) return;
    
    const messageText = text.trim();
    setInput('');
    setBusy(true);
    setHasFiredIdleMessage(false);
    
    // Real-time sentiment analysis
    const userSentiment = analyzeSentiment(messageText);
    console.log("🧠 User sentiment analysis:", userSentiment);
    
    // Dynamic personality selection
    const adaptedPersonality = selectPersonality(userProfile.bondScore, userSentiment, userProfile.conversationHistory);
    console.log("🎭 Adapted personality:", adaptedPersonality);
    
    setCurrentPersonality(adaptedPersonality);
    setCurrentSentiment(userSentiment);
    
    await addMessage(messageText, 'user');
    
    if (!online) {
      setBusy(false);
      const fallbackMessage = "I'm having connection issues, but I'm still here for you 💕";
      setTimeout(() => {
        simulateBonnieTyping(fallbackMessage, adaptedPersonality, userSentiment);
      }, 1000);
      return;
    }
    
    try {
      const response = await makeRequest(CONSTANTS.API_ENDPOINTS.CHAT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          session_id: sessionId, 
          message: messageText,
          bond_score: userProfile.bondScore,
          user_sentiment: userSentiment,
          adapted_personality: adaptedPersonality,
          conversation_history: userProfile.conversationHistory.slice(-5), // Last 5 messages
          timestamp: Date.now()
        })
      });
      
      // Update user profile with new data
      if (response.bond_score !== undefined) {
        setUserProfile(prev => ({ 
          ...prev, 
          bondScore: response.bond_score,
          conversationHistory: [...prev.conversationHistory, { text: messageText, sentiment: userSentiment }].slice(-10)
        }));
      }
      
      // Get Bonnie's emotional response
      const bonniePersonality = response.personality || adaptedPersonality;
      const bonnieSentiment = response.sentiment_analysis || userSentiment;
      
      simulateBonnieTyping(response.reply, bonniePersonality, bonnieSentiment);
      
    } catch (err) {
      console.error('Failed to send message:', err);
      setBusy(false);
      simul
ateBonnieTyping("Oops… I'm having some technical difficulties, but I'm still here! 💔", adaptedPersonality, userSentiment); } }, [sessionId, makeRequest, online, simulateBonnieTyping, addMessage, userProfile]);

// Enhanced idle timer with emotional intelligence useEffect(() => { const resetIdleTimer = () => { if (idleTimerRef.current) { clearTimeout(idleTimerRef.current); }

  if (messages.length === 0 && !hasFiredIdleMessage && online) {
    idleTimerRef.current = setTimeout(() => {
      const emotionalIdleMessages = {
        [CONSTANTS.PERSONALITY_LAYERS.PASSIONATE]: [
          "I'm waiting for you to say something... anything 💖",
          "Don't keep me in suspense, darling 😍"
        ],
        [CONSTANTS.PERSONALITY_LAYERS.GENTLE]: [
          "Take your time... I'm here whenever you're ready 🥰",
          "No pressure, but I'd love to hear your thoughts 💕"
        ],
        [CONSTANTS.PERSONALITY_LAYERS.TEASING]: [
          "Cat got your tongue? 😏",
          "I'm starting to think you're shy... how cute 😉"
        ],
        [CONSTANTS.PERSONALITY_LAYERS.PLAYFUL]: [
          "Still deciding what to say? 😘",
          "Don't leave me hanging here! 🤪"
        ]
      };
      
      const messages = emotionalIdleMessages[currentPersonality] || emotionalIdleMessages[CONSTANTS.PERSONALITY_LAYERS.PLAYFUL];
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      
      simulateBonnieTyping(randomMessage, currentPersonality, currentSentiment);
      setHasFiredIdleMessage(true);
    }, CONSTANTS.IDLE_TIMEOUT);
  }
};

resetIdleTimer();
return () => {
  if (idleTimerRef.current) {
    clearTimeout(idleTimerRef.current);
  }
};
This is an excellent upgrade plan! You're absolutely right that we need to move beyond simple bond score thresholds to create truly dynamic, emotionally intelligent conversations. Let me implement this God-Tier system with real-time emotional adaptation, intelligent emoji placement, and sentiment-driven responses.

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';

// Enhanced Constants with Emotional Intelligence
const CONSTANTS = {
  API_ENDPOINTS: {
    CHAT: 'https://bonnie-backend-server.onrender.com/bonnie-chat',
    ENTRY: 'https://bonnie-backend-server.onrender.com/bonnie-entry'
  },
  TYPING_SPEEDS: { slow: 120, normal: 64, fast: 35 },
  IDLE_TIMEOUT: 30000,
  MAX_MESSAGES: 100,
  COLORS: {
    primary: '#e91e63',
    online: '#28a745',
    offline: '#aaa',
    background: '#fff0f6',
    border: '#ffe6f0'
  },
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  
  // God-Tier Emotional Intelligence System
  PERSONALITY_LAYERS: {
    FLIRTATIOUS: 'flirtatious',
    SUPPORTIVE: 'supportive', 
    TEASING: 'teasing',
    GENTLE: 'gentle',
    PASSIONATE: 'passionate',
    PLAYFUL: 'playful'
  },
  
  SENTIMENT_TYPES: {
    FLIRTY: 'flirty',
    SAD: 'sad',
    HAPPY: 'happy',
    INTIMATE: 'intimate',
    PLAYFUL: 'playful',
    SERIOUS: 'serious',
    TEASING: 'teasing',
    VULNERABLE: 'vulnerable'
  },
  
  EMOJI_CONTEXTS: {
    FLIRTY: ['😘', '😏', '😉', '💋', '🔥'],
    ROMANTIC: ['💖', '💕', '😍', '🥰', '💘'],
    PLAYFUL: ['😜', '😋', '🤪', '😄', '😊'],
    SUPPORTIVE: ['🥺', '💌', '🤗', '💜', '✨'],
    TEASING: ['😏', '😈', '🙄', '😌', '🤭'],
    PASSIONATE: ['🔥', '💫', '😍', '💖', '🌹'],
    GENTLE: ['🥰', '💕', '🌸', '💫', '🦋']
  }
};

// God-Tier Sentiment Analysis System
const analyzeSentiment = (text) => {
  const lowerText = text.toLowerCase();
  
  // Flirty indicators
  const flirtyWords = ['sexy', 'hot', 'beautiful', 'gorgeous', 'cute', 'kiss', 'love', 'baby', 'darling', 'honey'];
  const flirtyScore = flirtyWords.filter(word => lowerText.includes(word)).length;
  
  // Intimate indicators
  const intimateWords = ['miss', 'need', 'want', 'desire', 'close', 'together', 'feel', 'heart'];
  const intimateScore = intimateWords.filter(word => lowerText.includes(word)).length;
  
  // Sad/vulnerable indicators
  const sadWords = ['sad', 'hurt', 'lonely', 'upset', 'tired', 'stressed', 'difficult', 'hard'];
  const sadScore = sadWords.filter(word => lowerText.includes(word)).length;
  
  // Playful indicators
  const playfulWords = ['haha', 'lol', 'funny', 'joke', 'silly', 'crazy', 'fun', 'play'];
  const playfulScore = playfulWords.filter(word => lowerText.includes(word)).length;
  
  // Teasing indicators
  const teasingWords = ['maybe', 'perhaps', 'guess', 'see', 'hmm', 'interesting', 'really'];
  const teasingScore = teasingWords.filter(word => lowerText.includes(word)).length;
  
  // Determine primary sentiment
  const scores = {
    [CONSTANTS.SENTIMENT_TYPES.FLIRTY]: flirtyScore * 2,
    [CONSTANTS.SENTIMENT_TYPES.INTIMATE]: intimateScore * 2,
    [CONSTANTS.SENTIMENT_TYPES.SAD]: sadScore * 3,
    [CONSTANTS.SENTIMENT_TYPES.PLAYFUL]: playfulScore,
    [CONSTANTS.SENTIMENT_TYPES.TEASING]: teasingScore,
    [CONSTANTS.SENTIMENT_TYPES.HAPPY]: (text.includes('!') ? 1 : 0) + playfulScore,
    [CONSTANTS.SENTIMENT_TYPES.SERIOUS]: lowerText.length > 100 ? 1 : 0,
    [CONSTANTS.SENTIMENT_TYPES.VULNERABLE]: sadScore * 2
  };
  
  const primarySentiment = Object.keys(scores).reduce((a, b) => 
    scores[a] > scores[b] ? a : b
  );
  
  return {
    primary: primarySentiment,
    intensity: Math.max(...Object.values(scores)),
    scores
  };
};

// Dynamic Personality Selection Based on Context
const selectPersonality = (bondScore, userSentiment, conversationHistory) => {
  const { primary, intensity } = userSentiment;
  
  // High bond users get more intimate personalities
  if (bondScore >= 70) {
    if (primary === CONSTANTS.SENTIMENT_TYPES.FLIRTY) return CONSTANTS.PERSONALITY_LAYERS.PASSIONATE;
    if (primary === CONSTANTS.SENTIMENT_TYPES.INTIMATE) return CONSTANTS.PERSONALITY_LAYERS.GENTLE;
    if (primary === CONSTANTS.SENTIMENT_TYPES.SAD) return CONSTANTS.PERSONALITY_LAYERS.SUPPORTIVE;
    return CONSTANTS.PERSONALITY_LAYERS.PASSIONATE;
  }
  
  // Medium bond users get adaptive personalities
  if (bondScore >= 40) {
    if (primary === CONSTANTS.SENTIMENT_TYPES.FLIRTY) return CONSTANTS.PERSONALITY_LAYERS.FLIRTATIOUS;
    if (primary === CONSTANTS.SENTIMENT_TYPES.PLAYFUL) return CONSTANTS.PERSONALITY_LAYERS.PLAYFUL;
    if (primary === CONSTANTS.SENTIMENT_TYPES.SAD) return CONSTANTS.PERSONALITY_LAYERS.SUPPORTIVE;
    if (primary === CONSTANTS.SENTIMENT_TYPES.TEASING) return CONSTANTS.PERSONALITY_LAYERS.TEASING;
    return CONSTANTS.PERSONALITY_LAYERS.FLIRTATIOUS;
  }
  
  // Low bond users get lighter personalities
  if (primary === CONSTANTS.SENTIMENT_TYPES.SAD) return CONSTANTS.PERSONALITY_LAYERS.SUPPORTIVE;
  if (primary === CONSTANTS.SENTIMENT_TYPES.PLAYFUL) return CONSTANTS.PERSONALITY_LAYERS.PLAYFUL;
  if (primary === CONSTANTS.SENTIMENT_TYPES.FLIRTY) return CONSTANTS.PERSONALITY_LAYERS.TEASING;
  return CONSTANTS.PERSONALITY_LAYERS.PLAYFUL;
};

// Intelligent Emoji Selection System
const selectContextualEmoji = (personality, sentiment, bondScore, messageContent) => {
  const emojiPool = CONSTANTS.EMOJI_CONTEXTS[personality.toUpperCase()] || CONSTANTS.EMOJI_CONTEXTS.PLAYFUL;
  
  // Emoji frequency based on bond score and emotional intensity
  const baseFrequency = Math.min(bondScore / 20, 4); // 0-4 emojis max
  const sentimentBoost = sentiment.intensity > 2 ? 1 : 0;
  const emojiCount = Math.floor(baseFrequency + sentimentBoost);
  
  if (emojiCount === 0) return '';
  
  // Select contextually appropriate emojis
  const selectedEmojis = [];
  for (let i = 0; i < emojiCount; i++) {
    const randomEmoji = emojiPool[Math.floor(Math.random() * emojiPool.length)];
    if (!selectedEmojis.includes(randomEmoji)) {
      selectedEmojis.push(randomEmoji);
    }
  }
  
  return selectedEmojis.join(' ');
};

// Dynamic Pause Calculation Based on Emotional Context
const calculateEmotionalPause = (personality, sentiment, bondScore, messageLength) => {
  let basePause = 1000;
  
  // Personality-based pause modifiers
  const personalityModifiers = {
    [CONSTANTS.PERSONALITY_LAYERS.PASSIONATE]: 1.5,
    [CONSTANTS.PERSONALITY_LAYERS.GENTLE]: 1.8,
    [CONSTANTS.PERSONALITY_LAYERS.SUPPORTIVE]: 1.6,
    [CONSTANTS.PERSONALITY_LAYERS.FLIRTATIOUS]: 1.2,
    [CONSTANTS.PERSONALITY_LAYERS.TEASING]: 0.8,
    [CONSTANTS.PERSONALITY_LAYERS.PLAYFUL]: 0.9
  };
  
  // Sentiment-based pause modifiers
  const sentimentModifiers = {
    [CONSTANTS.SENTIMENT_TYPES.INTIMATE]: 1.7,
    [CONSTANTS.SENTIMENT_TYPES.VULNERABLE]: 2.0,
    [CONSTANTS.SENTIMENT_TYPES.FLIRTY]: 1.3,
    [CONSTANTS.SENTIMENT_TYPES.PLAYFUL]: 0.7,
    [CONSTANTS.SENTIMENT_TYPES.TEASING]: 0.8,
    [CONSTANTS.SENTIMENT_TYPES.SERIOUS]: 1.5
  };
  
  // Bond score influence (higher bond = longer pauses for intimacy)
  const bondModifier = 1 + (bondScore / 200); // 1.0 to 1.5x
  
  // Message length influence
  const lengthModifier = Math.min(messageLength / 50, 2); // Longer messages = longer pauses
  
  const finalPause = basePause * 
    (personalityModifiers[personality] || 1) * 
    (sentimentModifiers[sentiment.primary] || 1) * 
    bondModifier * 
    lengthModifier;
  
  return Math.max(500, Math.min(finalPause, 4000)); // 0.5s to 4s range
};

// Enhanced Message Parsing with Emotional Intelligence
const parseMessageParts = (raw, personality, sentiment, bondScore) => {
  console.log("🔍 Parsing with emotional context:", { personality, sentiment, bondScore });
  
  const segments = raw.split(/<EOM(?:::(.*?))?>/).filter(Boolean);
  const finalParts = [];
  let currentMeta = { pause: 1000, speed: 'normal', emotion: 'neutral' };
  
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i].trim();
    
    // Check for metadata
    const metaMatch = segment.match(/(?:pause=(\d+))?(?:.*?speed=(\w+))?(?:.*?emotion=(\w+))?/);
    const hasMetadata = metaMatch && (metaMatch[1] || metaMatch[2] || metaMatch[3]);
    
    if (hasMetadata) {
      if (metaMatch[1]) currentMeta.pause = parseInt(metaMatch[1]);
      if (metaMatch[2]) currentMeta.speed = metaMatch[2];
      if (metaMatch[3]) currentMeta.emotion = metaMatch[3];
    } else if (segment.length > 0) {
      // Enhanced: Add contextual emojis to text
      const contextualEmoji = selectContextualEmoji(personality, sentiment, bondScore, segment);
      const enhancedText = contextualEmoji ? `${segment} ${contextualEmoji}` : segment;
      
      // Enhanced: Calculate emotional pause
      const emotionalPause = calculateEmotionalPause(personality, sentiment, bondScore, segment.length);
      
      finalParts.push({
        text: enhancedText,
        pause: emotionalPause,
        speed: currentMeta.speed,
        emotion: currentMeta.emotion || personality,
        personality,
        sentiment: sentiment.primary
      });
      
      // Reset metadata
      currentMeta = { pause: 1000, speed: 'normal', emotion: 'neutral' };
    }
  }
  
  return finalParts.filter(part => part.text && part.text.trim() !== '');
};

// Utility functions
const generateSessionId = () => {
  let id = localStorage.getItem('bonnie_session');
  if (!id) {
    id = 'guest_' + Math.random().toString(36).slice(2) + '_' + Date.now();
    localStorage.setItem('bonnie_session', id);
  }
  return id;
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Custom hook for API calls with retry logic
const useApiCall = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const makeRequest = useCallback(async (url, options, retries = CONSTANTS.RETRY_ATTEMPTS) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setIsLoading(false);
      return data;
    } catch (err) {
      if (retries > 0) {
        await sleep(CONSTANTS.RETRY_DELAY);
        return makeRequest(url, options, retries - 1);
      }
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  }, []);

  return { makeRequest, isLoading, error };
};

// Enhanced Message component with emotional styling
const Message = React.memo(({ message, isUser }) => {
  const messageStyle = useMemo(() => {
    const baseStyle = {
      maxWidth: '75%',
      padding: 12,
      borderRadius: 12,
      margin: '6px 0',
      fontSize: 14,
      lineHeight: 1.4,
      wordBreak: 'break-word',
      transition: 'all 0.3s ease'
    };

    if (isUser) {
      return {
        ...baseStyle,
        background: `linear-gradient(135deg, #ff83a0, ${CONSTANTS.COLORS.primary})`,
        color: '#fff',
        alignSelf: 'flex-end',
        marginLeft: 'auto'
      };
    }

    // Enhanced: Personality-based styling for Bonnie's messages
    const personalityColors = {
      [CONSTANTS.PERSONALITY_LAYERS.PASSIONATE]: 'linear-gradient(135deg, #ffb3d1, #ff80bf)',
      [CONSTANTS.PERSONALITY_LAYERS.GENTLE]: 'linear-gradient(135deg, #e6f3ff, #cce7ff)',
      [CONSTANTS.PERSONALITY_LAYERS.SUPPORTIVE]: 'linear-gradient(135deg, #f0e6ff, #e6ccff)',
      [CONSTANTS.PERSONALITY_LAYERS.FLIRTATIOUS]: 'linear-gradient(135deg, #ffe6f0, #ffccdd)',
      [CONSTANTS.PERSONALITY_LAYERS.TEASING]: 'linear-gradient(135deg, #fff0e6, #ffe6cc)',
      [CONSTANTS.PERSONALITY_LAYERS.PLAYFUL]: 'linear-gradient(135deg, #f0fff0, #e6ffe6)'
    };

    const personality = message.personality || CONSTANTS.PERSONALITY_LAYERS.PLAYFUL;
    
    return {
      ...baseStyle,
      background: personalityColors[personality] || CONSTANTS.COLORS.background,
      border: `1px solid ${CONSTANTS.COLORS.border}`,
      color: '#333',
      alignSelf: 'flex-start'
    };
  }, [isUser, message.personality]);

  return (
    <div style={messageStyle} role="listitem">
      {message.text}
      {message.timestamp && (
        <div style={{ fontSize: 10, opacity: 0.7, marginTop: 4 }}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
});

// Enhanced Typing indicator with personality-based colors
const TypingIndicator = React.memo(({ personality = 'playful', sentiment = 'neutral' }) => {
  const personalityColors = {
    [CONSTANTS.PERSONALITY_LAYERS.PASSIONATE]: '#dc143c',
    [CONSTANTS.PERSONALITY_LAYERS.GENTLE]: '#87ceeb',
    [CONSTANTS.PERSONALITY_LAYERS.SUPPORTIVE]: '#dda0dd',
    [CONSTANTS.PERSONALITY_LAYERS.FLIRTATIOUS]: '#ff69b4',
    [CONSTANTS.PERSONALITY_LAYERS.TEASING]: '#ffa500',
    [CONSTANTS.PERSONALITY_LAYERS.PLAYFUL]: '#32cd32'
  };

  const color = personalityColors[personality] || CONSTANTS.COLORS.primary;

  return (
    <div style={{ display: 'flex', gap: 4, margin: '8px 0' }} role="status" aria-label="Bonnie is typing">
      {[0, 0.2, 0.4].map((delay, index) => (
        <div
          key={index}
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            background: color,
            animation: `bounce 1s infinite ease-in-out`,
            animationDelay: `${delay}s`
          }}
        />
      ))}
    </div>
  );
});

export default function BonnieChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [typing, setTyping] = useState(false);
  const [currentPersonality, setCurrentPersonality] = useState(CONSTANTS.PERSONALITY_LAYERS.PLAYFUL);
  const [currentSentiment, setCurrentSentiment] = useState({ primary: 'neutral', intensity: 0 });
  const [online, setOnline] = useState(false);
  const [pendingMessage, setPendingMessage] = useState(null);
  const [hasFiredIdleMessage, setHasFiredIdleMessage] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [userProfile, setUserProfile] = useState({ 
    bondScore: 0, 
    isNewUser: true, 
    userName: null,
    conversationHistory: [],
    emotionalPattern: {}
  });
  
  const endRef = useRef(null);
  const idleTimerRef = useRef(null);
  const typingProcessRef = useRef(null);
  const sessionId = useMemo(() => generateSessionId(), []);
  
  const { makeRequest, isLoading, error } = useApiCall();

  // Enhanced message management with emotional context
  const addMessage = useCallback((text, sender, personality = null, sentiment = null) => {
    if (!text || typeof text !== 'string' || text.trim() === '') {
      console.warn("⚠️ Attempted to add empty/invalid message, skipping:", text);
      return;
    }

    const cleanText = text.trim();
    if (cleanText.length === 0) {
      console.warn("⚠️ Message became empty after trimming, skipping");
      return;
    }

    const newMessage = {
      id: Date.now() + Math.random(),
      sender,
      text: cleanText,
      timestamp: Date.now(),
      personality,
      sentiment
    };
    
    console.log("✅ Adding message with emotional context:", newMessage);
    
    setMessages(prevMessages => {
      const newMessages = [...prevMessages, newMessage];
      return newMessages.length > CONSTANTS.MAX_MESSAGES 
        ? newMessages.slice(-CONSTANTS.MAX_MESSAGES) 
        : newMessages;
    });
  }, []);

  // God-Tier initialization with emotional intelligence
  useEffect(() => {
    const initializeChat = async () => {
      console.log("🚀 Initializing God-Tier emotional chat system...");
      setConnectionStatus('connecting');
      
      try {
        const response = await makeRequest(CONSTANTS.API_ENDPOINTS.ENTRY, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            session_id: sessionId,
            request_type: 'god_tier_entry',
            emotional_context: true,
            user_agent: navigator.userAgent,
            timestamp: Date.now()
          })
        });
        
        const { 
          reply, 
          delay = 1000, 
          bond_score = 0, 
          is_new_user = true, 
          user_name = null,
          personality = CONSTANTS.PERSONALITY_LAYERS.PLAYFUL,
          sentiment_analysis = { primary: 'neutral', intensity: 0 }
        } = response;
        
        // Update user profile with emotional intelligence data
        setUserProfile({
          bondScore: bond_score,
          isNewUser: is_new_user,
          userName: user_name,
          conversationHistory: [],
          emotionalPattern: {}
        });
        
        setCurrentPersonality(personality);
        setCurrentSentiment(sentiment_analysis);
        
        setOnline(true);
        setConnectionStatus('online');
        
        setTimeout(() => {
          simulateBonnieTyping(reply, personality, sentiment_analysis);
        }, delay);
        
      } catch (err) {
        console.error('❌ Failed to initialize chat:', err);
        
        // Fallback with basic emotional intelligence
        const fallbackPersonality = CONSTANTS.PERSONALITY_LAYERS.PLAYFUL;
        const fallbackSentiment = { primary: 'neutral', intensity: 0 };
        
        setCurrentPersonality(fallbackPersonality);
        setCurrentSentiment(fallbackSentiment);
        setOnline(true);
        setConnectionStatus('online');
        
        const fallbackGreeting = "Well, look who's here... let's have some fun, shall we? 😘";
        setTimeout(() => {
          simulateBonnieTyping(fallbackGreeting, fallbackPersonality, fallbackSentiment);
        }, 1000);
      }
    };

    initializeChat();
  }, [sessionId, makeRequest]);

  // God-Tier typing simulation with full emotional intelligence
  const simulateBonnieTyping = useCallback((raw, personality, sentiment) => {
    console.log("💬 God-Tier typing simulation:", { raw, personality, sentiment });
    
    if (!online) return;

    if (typingProcessRef.current) {
      clearTimeout(typingProcessRef.current);
      typingProcessRef.current = null;
    }

    if (!raw || typeof raw !== 'string' || raw.trim() === '') {
      console.warn("⚠️ Invalid message:", raw);
      setBusy(false);
      return;
    }

    // Enhanced parsing with emotional intelligence
    const parts = parseMessageParts(raw, personality, sentiment, userProfile.bondScore);
    
    const validParts = parts.filter(part => part.text && part.text.trim() !== '');
    
    if (validParts.length === 0) {
      console.warn("⚠️ No valid parts found");
      setBusy(false);
      return;
    }

    console.log(`🚀 Processing ${validParts.length} emotionally intelligent parts:`, validParts);

    let currentIndex = 0;
    const processNextPart = async () => {
      if (currentIndex >= validParts.length) {
        console.log("✅ Completed God-Tier typing simulation");
        setBusy(false);
        setTyping(false);
        typingProcessRef.current = null;
        return;
      }

      const part = validParts[currentIndex];
      
      if (!part || !part.text || part.text.trim() === '') {
        currentIndex++;
        typingProcessRef.current = setTimeout(processNextPart, 100);
        return;
      }

      console.log(`✅ Processing emotional part ${currentIndex + 1}/${validParts.length}:`, part);
      
      // Emotional pause
      await sleep(part.pause);
      
      // Show typing with personality
      setTyping(true);
      setCurrentPersonality(part.personality);
      
      // Emotional typing speed
      const typingTime = part.text.length * (CONSTANTS.TYPING_SPEEDS[part.speed] || CONSTANTS.TYPING_SPEEDS.normal);
      await sleep(typingTime);
      
      setTyping(false);
      
      // Add message with emotional context
      addMessage(part.text, 'bonnie', part.personality, part.sentiment);
      
      currentIndex++;
      typingProcessRef.current = setTimeout(processNextPart, 400);
    };

    setBusy(true);
    processNextPart();
  }, [online, addMessage, userProfile.bondScore]);

  // God-Tier send function with real-time emotional analysis
  const handleSend = useCallback(async (text) => {
    if (!text?.trim()) return;
    
    const messageText = text.trim();
    setInput('');
    setBusy(true);
    setHasFiredIdleMessage(false);
    
    // Real-time sentiment analysis
    const userSentiment = analyzeSentiment(messageText);
    console.log("🧠 User sentiment analysis:", userSentiment);
    
    // Dynamic personality selection
    const adaptedPersonality = selectPersonality(userProfile.bondScore, userSentiment, userProfile.conversationHistory);
    console.log("🎭 Adapted personality:", adaptedPersonality);
    
    setCurrentPersonality(adaptedPersonality);
    setCurrentSentiment(userSentiment);
    
    await addMessage(messageText, 'user');
    
    if (!online) {
      setBusy(false);
      const fallbackMessage = "I'm having connection issues, but I'm still here for you 💕";
      setTimeout(() => {
        simulateBonnieTyping(fallbackMessage, adaptedPersonality, userSentiment);
      }, 1000);
      return;
    }
    
    try {
      const response = await makeRequest(CONSTANTS.API_ENDPOINTS.CHAT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          session_id: sessionId, 
          message: messageText,
          bond_score: userProfile.bondScore,
          user_sentiment: userSentiment,
          adapted_personality: adaptedPersonality,
          conversation_history: userProfile.conversationHistory.slice(-5), // Last 5 messages
          timestamp: Date.now()
        })
      });
      
      // Update user profile with new data
      if (response.bond_score !== undefined) {
        setUserProfile(prev => ({ 
          ...prev, 
          bondScore: response.bond_score,
          conversationHistory: [...prev.conversationHistory, { text: messageText, sentiment: userSentiment }].slice(-10)
        }));
      }
      
      // Get Bonnie's emotional response
      const bonniePersonality = response.personality || adaptedPersonality;
      const bonnieSentiment = response.sentiment_analysis || userSentiment;
      
      simulateBonnieTyping(response.reply, bonniePersonality, bonnieSentiment);
      
    } catch (err) {
      console.error('Failed to send message:', err);
      setBusy(false);
      simulateBonnieTyping("Oops… I'm having some technical difficulties, but I'm still here! 💔", adaptedPersonality, userSentiment);
    }
  }, [sessionId, makeRequest, online, simulateBonnieTyping, addMessage, userProfile]);

  // Enhanced idle timer with emotional intelligence
  useEffect(() => {
    const resetIdleTimer = () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
      
      if (messages.length === 0 && !hasFiredIdleMessage && online) {
        idleTimerRef.current = setTimeout(() => {
          const emotionalIdleMessages = {
            [CONSTANTS.PERSONALITY_LAYERS.PASSIONATE]: [
              "I'm waiting for you to say something... anything 💖",
              "Don't keep me in suspense, darling 😍"
            ],
            [CONSTANTS.PERSONALITY_LAYERS.GENTLE]: [
              "Take your time... I'm here whenever you're ready 🥰",
              "No pressure, but I'd love to hear your thoughts 💕"
            ],
            [CONSTANTS.PERSONALITY_LAYERS.TEASING]: [
              "Cat got your tongue? 😏",
              "I'm starting to think you're shy... how cute 😉"
            ],
            [CONSTANTS.PERSONALITY_LAYERS.PLAYFUL]: [
              "Still deciding what to say? 😘",
              "Don't leave me hanging here! 🤪"
            ]
          };
          
          const messages = emotionalIdleMessages[currentPersonality] || emotionalIdleMessages[CONSTANTS.PERSONALITY_LAYERS.PLAYFUL];
          const randomMessage = messages[Math.floor(Math.random() * messages.length)];
          
          simulateBonnieTyping(randomMessage, currentPersonality, currentSentiment);
          setHasFiredIdleMessage(true);
        }, CONSTANTS.IDLE_TIMEOUT);
      }
    };

    resetIdleTimer();
    return () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, [messages.length, hasFiredIdleMessage, online, currentPersonality, currentSentiment, simulateBonnieTyping]);

  // Keyboard event handler
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  }, [input, handleSend]);

  // Auto-scroll to bottom
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  // Memoized styles
  const containerStyle = useMemo(() => ({
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    height: '100dvh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    backgroundColor: '#fafafa'
  }), []);

  const headerStyle = useMemo(() => ({
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    padding: 12,
    borderBottom: '1px solid #eee',
    backgroundColor: '#fff'
  }), []);

  const messagesContainerStyle = useMemo(() => ({
    flex: 1,
    overflowY: 'auto',
    padding: 12,
    display: 'flex',
    flexDirection: 'column'
  }), []);

  const inputContainerStyle = useMemo(() => ({
    flexShrink: 0,
    display: 'flex',
    gap: 8,
    padding: 12,
    borderTop: '1px solid #eee',
    backgroundColor: '#fff'
  }), []);

  // Dynamic subtitle based on personality and bond
  const getPersonalitySubtitle = () => {
    const personalitySubtitles = {
      [CONSTANTS.PERSONALITY_LAYERS.PASSIONATE]: "Feeling the connection deeply 💖",
      [CONSTANTS.PERSONALITY_LAYERS.GENTLE]: "Here with gentle warmth 🥰",
      [CONSTANTS.PERSONALITY_LAYERS.SUPPORTIVE]: "Your caring companion 💜",
      [CONSTANTS.PERSONALITY_LAYERS.FLIRTATIOUS]: "Feeling playfully flirty 😘",
      [CONSTANTS.PERSONALITY_LAYERS.TEASING]: "In a teasing mood 😏",
      [CONSTANTS.PERSONALITY_LAYERS.PLAYFUL]: "Ready
This is an excellent upgrade plan! You're absolutely right that we need to move beyond simple bond score thresholds to create truly dynamic, emotionally intelligent conversations. Let me implement this God-Tier system with real-time emotional adaptation, intelligent emoji placement, and sentiment-driven responses.

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';

// Enhanced Constants with Emotional Intelligence
const CONSTANTS = {
  API_ENDPOINTS: {
    CHAT: 'https://bonnie-backend-server.onrender.com/bonnie-chat',
    ENTRY: 'https://bonnie-backend-server.onrender.com/bonnie-entry'
  },
  TYPING_SPEEDS: { slow: 120, normal: 64, fast: 35 },
  IDLE_TIMEOUT: 30000,
  MAX_MESSAGES: 100,
  COLORS: {
    primary: '#e91e63',
    online: '#28a745',
    offline: '#aaa',
    background: '#fff0f6',
    border: '#ffe6f0'
  },
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  
  // God-Tier Emotional Intelligence System
  PERSONALITY_LAYERS: {
    FLIRTATIOUS: 'flirtatious',
    SUPPORTIVE: 'supportive', 
    TEASING: 'teasing',
    GENTLE: 'gentle',
    PASSIONATE: 'passionate',
    PLAYFUL: 'playful'
  },
  
  SENTIMENT_TYPES: {
    FLIRTY: 'flirty',
    SAD: 'sad',
    HAPPY: 'happy',
    INTIMATE: 'intimate',
    PLAYFUL: 'playful',
    SERIOUS: 'serious',
    TEASING: 'teasing',
    VULNERABLE: 'vulnerable'
  },
  
  EMOJI_CONTEXTS: {
    FLIRTY: ['😘', '😏', '😉', '💋', '🔥'],
    ROMANTIC: ['💖', '💕', '😍', '🥰', '💘'],
    PLAYFUL: ['😜', '😋', '🤪', '😄', '😊'],
    SUPPORTIVE: ['🥺', '💌', '🤗', '💜', '✨'],
    TEASING: ['😏', '😈', '🙄', '😌', '🤭'],
    PASSIONATE: ['🔥', '💫', '😍', '💖', '🌹'],
    GENTLE: ['🥰', '💕', '🌸', '💫', '🦋']
  }
};

// God-Tier Sentiment Analysis System
const analyzeSentiment = (text) => {
  const lowerText = text.toLowerCase();
  
  // Flirty indicators
  const flirtyWords = ['sexy', 'hot', 'beautiful', 'gorgeous', 'cute', 'kiss', 'love', 'baby', 'darling', 'honey'];
  const flirtyScore = flirtyWords.filter(word => lowerText.includes(word)).length;
  
  // Intimate indicators
  const intimateWords = ['miss', 'need', 'want', 'desire', 'close', 'together', 'feel', 'heart'];
  const intimateScore = intimateWords.filter(word => lowerText.includes(word)).length;
  
  // Sad/vulnerable indicators
  const sadWords = ['sad', 'hurt', 'lonely', 'upset', 'tired', 'stressed', 'difficult', 'hard'];
  const sadScore = sadWords.filter(word => lowerText.includes(word)).length;
  
  // Playful indicators
  const playfulWords = ['haha', 'lol', 'funny', 'joke', 'silly', 'crazy', 'fun', 'play'];
  const playfulScore = playfulWords.filter(word => lowerText.includes(word)).length;
  
  // Teasing indicators
  const teasingWords = ['maybe', 'perhaps', 'guess', 'see', 'hmm', 'interesting', 'really'];
  const teasingScore = teasingWords.filter(word => lowerText.includes(word)).length;
  
  // Determine primary sentiment
  const scores = {
    [CONSTANTS.SENTIMENT_TYPES.FLIRTY]: flirtyScore * 2,
    [CONSTANTS.SENTIMENT_TYPES.INTIMATE]: intimateScore * 2,
    [CONSTANTS.SENTIMENT_TYPES.SAD]: sadScore * 3,
    [CONSTANTS.SENTIMENT_TYPES.PLAYFUL]: playfulScore,
    [CONSTANTS.SENTIMENT_TYPES.TEASING]: teasingScore,
    [CONSTANTS.SENTIMENT_TYPES.HAPPY]: (text.includes('!') ? 1 : 0) + playfulScore,
    [CONSTANTS.SENTIMENT_TYPES.SERIOUS]: lowerText.length > 100 ? 1 : 0,
    [CONSTANTS.SENTIMENT_TYPES.VULNERABLE]: sadScore * 2
  };
  
  const primarySentiment = Object.keys(scores).reduce((a, b) => 
    scores[a] > scores[b] ? a : b
  );
  
  return {
    primary: primarySentiment,
    intensity: Math.max(...Object.values(scores)),
    scores
  };
};

// Dynamic Personality Selection Based on Context
const selectPersonality = (bondScore, userSentiment, conversationHistory) => {
  const { primary, intensity } = userSentiment;
  
  // High bond users get more intimate personalities
  if (bondScore >= 70) {
    if (primary === CONSTANTS.SENTIMENT_TYPES.FLIRTY) return CONSTANTS.PERSONALITY_LAYERS.PASSIONATE;
    if (primary === CONSTANTS.SENTIMENT_TYPES.INTIMATE) return CONSTANTS.PERSONALITY_LAYERS.GENTLE;
    if (primary === CONSTANTS.SENTIMENT_TYPES.SAD) return CONSTANTS.PERSONALITY_LAYERS.SUPPORTIVE;
    return CONSTANTS.PERSONALITY_LAYERS.PASSIONATE;
  }
  
  // Medium bond users get adaptive personalities
  if (bondScore >= 40) {
    if (primary === CONSTANTS.SENTIMENT_TYPES.FLIRTY) return CONSTANTS.PERSONALITY_LAYERS.FLIRTATIOUS;
    if (primary === CONSTANTS.SENTIMENT_TYPES.PLAYFUL) return CONSTANTS.PERSONALITY_LAYERS.PLAYFUL;
    if (primary === CONSTANTS.SENTIMENT_TYPES.SAD) return CONSTANTS.PERSONALITY_LAYERS.SUPPORTIVE;
    if (primary === CONSTANTS.SENTIMENT_TYPES.TEASING) return CONSTANTS.PERSONALITY_LAYERS.TEASING;
    return CONSTANTS.PERSONALITY_LAYERS.FLIRTATIOUS;
  }
  
  // Low bond users get lighter personalities
  if (primary === CONSTANTS.SENTIMENT_TYPES.SAD) return CONSTANTS.PERSONALITY_LAYERS.SUPPORTIVE;
  if (primary === CONSTANTS.SENTIMENT_TYPES.PLAYFUL) return CONSTANTS.PERSONALITY_LAYERS.PLAYFUL;
  if (primary === CONSTANTS.SENTIMENT_TYPES.FLIRTY) return CONSTANTS.PERSONALITY_LAYERS.TEASING;
  return CONSTANTS.PERSONALITY_LAYERS.PLAYFUL;
};

// Intelligent Emoji Selection System
const selectContextualEmoji = (personality, sentiment, bondScore, messageContent) => {
  const emojiPool = CONSTANTS.EMOJI_CONTEXTS[personality.toUpperCase()] || CONSTANTS.EMOJI_CONTEXTS.PLAYFUL;
  
  // Emoji frequency based on bond score and emotional intensity
  const baseFrequency = Math.min(bondScore / 20, 4); // 0-4 emojis max
  const sentimentBoost = sentiment.intensity > 2 ? 1 : 0;
  const emojiCount = Math.floor(baseFrequency + sentimentBoost);
  
  if (emojiCount === 0) return '';
  
  // Select contextually appropriate emojis
  const selectedEmojis = [];
  for (let i = 0; i < emojiCount; i++) {
    const randomEmoji = emojiPool[Math.floor(Math.random() * emojiPool.length)];
    if (!selectedEmojis.includes(randomEmoji)) {
      selectedEmojis.push(randomEmoji);
    }
  }
  
  return selectedEmojis.join(' ');
};

// Dynamic Pause Calculation Based on Emotional Context
const calculateEmotionalPause = (personality, sentiment, bondScore, messageLength) => {
  let basePause = 1000;
  
  // Personality-based pause modifiers
  const personalityModifiers = {
    [CONSTANTS.PERSONALITY_LAYERS.PASSIONATE]: 1.5,
    [CONSTANTS.PERSONALITY_LAYERS.GENTLE]: 1.8,
    [CONSTANTS.PERSONALITY_LAYERS.SUPPORTIVE]: 1.6,
    [CONSTANTS.PERSONALITY_LAYERS.FLIRTATIOUS]: 1.2,
    [CONSTANTS.PERSONALITY_LAYERS.TEASING]: 0.8,
    [CONSTANTS.PERSONALITY_LAYERS.PLAYFUL]: 0.9
  };
  
  // Sentiment-based pause modifiers
  const sentimentModifiers = {
    [CONSTANTS.SENTIMENT_TYPES.INTIMATE]: 1.7,
    [CONSTANTS.SENTIMENT_TYPES.VULNERABLE]: 2.0,
    [CONSTANTS.SENTIMENT_TYPES.FLIRTY]: 1.3,
    [CONSTANTS.SENTIMENT_TYPES.PLAYFUL]: 0.7,
    [CONSTANTS.SENTIMENT_TYPES.TEASING]: 0.8,
    [CONSTANTS.SENTIMENT_TYPES.SERIOUS]: 1.5
  };
  
  // Bond score influence (higher bond = longer pauses for intimacy)
  const bondModifier = 1 + (bondScore / 200); // 1.0 to 1.5x
  
  // Message length influence
  const lengthModifier = Math.min(messageLength / 50, 2); // Longer messages = longer pauses
  
  const finalPause = basePause * 
    (personalityModifiers[personality] || 1) * 
    (sentimentModifiers[sentiment.primary] || 1) * 
    bondModifier * 
    lengthModifier;
  
  return Math.max(500, Math.min(finalPause, 4000)); // 0.5s to 4s range
};

// Enhanced Message Parsing with Emotional Intelligence
const parseMessageParts = (raw, personality, sentiment, bondScore) => {
  console.log("🔍 Parsing with emotional context:", { personality, sentiment, bondScore });
  
  const segments = raw.split(/<EOM(?:::(.*?))?>/).filter(Boolean);
  const finalParts = [];
  let currentMeta = { pause: 1000, speed: 'normal', emotion: 'neutral' };
  
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i].trim();
    
    // Check for metadata
    const metaMatch = segment.match(/(?:pause=(\d+))?(?:.*?speed=(\w+))?(?:.*?emotion=(\w+))?/);
    const hasMetadata = metaMatch && (metaMatch[1] || metaMatch[2] || metaMatch[3]);
    
    if (hasMetadata) {
      if (metaMatch[1]) currentMeta.pause = parseInt(metaMatch[1]);
      if (metaMatch[2]) currentMeta.speed = metaMatch[2];
      if (metaMatch[3]) currentMeta.emotion = metaMatch[3];
    } else if (segment.length > 0) {
      // Enhanced: Add contextual emojis to text
      const contextualEmoji = selectContextualEmoji(personality, sentiment, bondScore, segment);
      const enhancedText = contextualEmoji ? `${segment} ${contextualEmoji}` : segment;
      
      // Enhanced: Calculate emotional pause
      const emotionalPause = calculateEmotionalPause(personality, sentiment, bondScore, segment.length);
      
      finalParts.push({
        text: enhancedText,
        pause: emotionalPause,
        speed: currentMeta.speed,
        emotion: currentMeta.emotion || personality,
        personality,
        sentiment: sentiment.primary
      });
      
      // Reset metadata
      currentMeta = { pause: 1000, speed: 'normal', emotion: 'neutral' };
    }
  }
  
  return finalParts.filter(part => part.text && part.text.trim() !== '');
};

// Utility functions
const generateSessionId = () => {
  let id = localStorage.getItem('bonnie_session');
  if (!id) {
    id = 'guest_' + Math.random().toString(36).slice(2) + '_' + Date.now();
    localStorage.setItem('bonnie_session', id);
  }
  return id;
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Custom hook for API calls with retry logic
const useApiCall = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const makeRequest = useCallback(async (url, options, retries = CONSTANTS.RETRY_ATTEMPTS) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setIsLoading(false);
      return data;
    } catch (err) {
      if (retries > 0) {
        await sleep(CONSTANTS.RETRY_DELAY);
        return makeRequest(url, options, retries - 1);
      }
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  }, []);

  return { makeRequest, isLoading, error };
};

// Enhanced Message component with emotional styling
const Message = React.memo(({ message, isUser }) => {
  const messageStyle = useMemo(() => {
    const baseStyle = {
      maxWidth: '75%',
      padding: 12,
      borderRadius: 12,
      margin: '6px 0',
      fontSize: 14,
      lineHeight: 1.4,
      wordBreak: 'break-word',
      transition: 'all 0.3s ease'
    };

    if (isUser) {
      return {
        ...baseStyle,
        background: `linear-gradient(135deg, #ff83a0, ${CONSTANTS.COLORS.primary})`,
        color: '#fff',
        alignSelf: 'flex-end',
        marginLeft: 'auto'
      };
    }

    // Enhanced: Personality-based styling for Bonnie's messages
    const personalityColors = {
      [CONSTANTS.PERSONALITY_LAYERS.PASSIONATE]: 'linear-gradient(135deg, #ffb3d1, #ff80bf)',
      [CONSTANTS.PERSONALITY_LAYERS.GENTLE]: 'linear-gradient(135deg, #e6f3ff, #cce7ff)',
      [CONSTANTS.PERSONALITY_LAYERS.SUPPORTIVE]: 'linear-gradient(135deg, #f0e6ff, #e6ccff)',
      [CONSTANTS.PERSONALITY_LAYERS.FLIRTATIOUS]: 'linear-gradient(135deg, #ffe6f0, #ffccdd)',
      [CONSTANTS.PERSONALITY_LAYERS.TEASING]: 'linear-gradient(135deg, #fff0e6, #ffe6cc)',
      [CONSTANTS.PERSONALITY_LAYERS.PLAYFUL]: 'linear-gradient(135deg, #f0fff0, #e6ffe6)'
    };

    const personality = message.personality || CONSTANTS.PERSONALITY_LAYERS.PLAYFUL;
    
    return {
      ...baseStyle,
      background: personalityColors[personality] || CONSTANTS.COLORS.background,
      border: `1px solid ${CONSTANTS.COLORS.border}`,
      color: '#333',
      alignSelf: 'flex-start'
    };
  }, [isUser, message.personality]);

  return (
    <div style={messageStyle} role="listitem">
      {message.text}
      {message.timestamp && (
        <div style={{ fontSize: 10, opacity: 0.7, marginTop: 4 }}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
});

// Enhanced Typing indicator with personality-based colors
const TypingIndicator = React.memo(({ personality = 'playful', sentiment = 'neutral' }) => {
  const personalityColors = {
    [CONSTANTS.PERSONALITY_LAYERS.PASSIONATE]: '#dc143c',
    [CONSTANTS.PERSONALITY_LAYERS.GENTLE]: '#87ceeb',
    [CONSTANTS.PERSONALITY_LAYERS.SUPPORTIVE]: '#dda0dd',
    [CONSTANTS.PERSONALITY_LAYERS.FLIRTATIOUS]: '#ff69b4',
    [CONSTANTS.PERSONALITY_LAYERS.TEASING]: '#ffa500',
    [CONSTANTS.PERSONALITY_LAYERS.PLAYFUL]: '#32cd32'
  };

  const color = personalityColors[personality] || CONSTANTS.COLORS.primary;

  return (
    <div style={{ display: 'flex', gap: 4, margin: '8px 0' }} role="status" aria-label="Bonnie is typing">
      {[0, 0.2, 0.4].map((delay, index) => (
        <div
          key={index}
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            background: color,
            animation: `bounce 1s infinite ease-in-out`,
            animationDelay: `${delay}s`
          }}
        />
      ))}
    </div>
  );
});

export default function BonnieChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [typing, setTyping] = useState(false);
  const [currentPersonality, setCurrentPersonality] = useState(CONSTANTS.PERSONALITY_LAYERS.PLAYFUL);
  const [currentSentiment, setCurrentSentiment] = useState({ primary: 'neutral', intensity: 0 });
  const [online, setOnline] = useState(false);
  const [pendingMessage, setPendingMessage] = useState(null);
  const [hasFiredIdleMessage, setHasFiredIdleMessage] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [userProfile, setUserProfile] = useState({ 
    bondScore: 0, 
    isNewUser: true, 
    userName: null,
    conversationHistory: [],
    emotionalPattern: {}
  });
  
  const endRef = useRef(null);
  const idleTimerRef = useRef(null);
  const typingProcessRef = useRef(null);
  const sessionId = useMemo(() => generateSessionId(), []);
  
  const { makeRequest, isLoading, error } = useApiCall();

  // Enhanced message management with emotional context
  const addMessage = useCallback((text, sender, personality = null, sentiment = null) => {
    if (!text || typeof text !== 'string' || text.trim() === '') {
      console.warn("⚠️ Attempted to add empty/invalid message, skipping:", text);
      return;
    }

    const cleanText = text.trim();
    if (cleanText.length === 0) {
      console.warn("⚠️ Message became empty after trimming, skipping");
      return;
    }

    const newMessage = {
      id: Date.now() + Math.random(),
      sender,
      text: cleanText,
      timestamp: Date.now(),
      personality,
      sentiment
    };
    
    console.log("✅ Adding message with emotional context:", newMessage);
    
    setMessages(prevMessages => {
      const newMessages = [...prevMessages, newMessage];
      return newMessages.length > CONSTANTS.MAX_MESSAGES 
        ? newMessages.slice(-CONSTANTS.MAX_MESSAGES) 
        : newMessages;
    });
  }, []);

  // God-Tier initialization with emotional intelligence
  useEffect(() => {
    const initializeChat = async () => {
      console.log("🚀 Initializing God-Tier emotional chat system...");
      setConnectionStatus('connecting');
      
      try {
        const response = await makeRequest(CONSTANTS.API_ENDPOINTS.ENTRY, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            session_id: sessionId,
            request_type: 'god_tier_entry',
            emotional_context: true,
            user_agent: navigator.userAgent,
            timestamp: Date.now()
          })
        });
        
        const { 
          reply, 
          delay = 1000, 
          bond_score = 0, 
          is_new_user = true, 
          user_name = null,
          personality = CONSTANTS.PERSONALITY_LAYERS.PLAYFUL,
          sentiment_analysis = { primary: 'neutral', intensity: 0 }
        } = response;
        
        // Update user profile with emotional intelligence data
        setUserProfile({
          bondScore: bond_score,
          isNewUser: is_new_user,
          userName: user_name,
          conversationHistory: [],
          emotionalPattern: {}
        });
        
        setCurrentPersonality(personality);
        setCurrentSentiment(sentiment_analysis);
        
        setOnline(true);
        setConnectionStatus('online');
        
        setTimeout(() => {
          simulateBonnieTyping(reply, personality, sentiment_analysis);
        }, delay);
        
      } catch (err) {
        console.error('❌ Failed to initialize chat:', err);
        
        // Fallback with basic emotional intelligence
        const fallbackPersonality = CONSTANTS.PERSONALITY_LAYERS.PLAYFUL;
        const fallbackSentiment = { primary: 'neutral', intensity: 0 };
        
        setCurrentPersonality(fallbackPersonality);
        setCurrentSentiment(fallbackSentiment);
        setOnline(true);
        setConnectionStatus('online');
        
        const fallbackGreeting = "Well, look who's here... let's have some fun, shall we? 😘";
        setTimeout(() => {
          simulateBonnieTyping(fallbackGreeting, fallbackPersonality, fallbackSentiment);
        }, 1000);
      }
    };

    initializeChat();
  }, [sessionId, makeRequest]);

  // God-Tier typing simulation with full emotional intelligence
  const simulateBonnieTyping = useCallback((raw, personality, sentiment) => {
    console.log("💬 God-Tier typing simulation:", { raw, personality, sentiment });
    
    if (!online) return;

    if (typingProcessRef.current) {
      clearTimeout(typingProcessRef.current);
      typingProcessRef.current = null;
    }

    if (!raw || typeof raw !== 'string' || raw.trim() === '') {
      console.warn("⚠️ Invalid message:", raw);
      setBusy(false);
      return;
    }

    // Enhanced parsing with emotional intelligence
    const parts = parseMessageParts(raw, personality, sentiment, userProfile.bondScore);
    
    const validParts = parts.filter(part => part.text && part.text.trim() !== '');
    
    if (validParts.length === 0) {
      console.warn("⚠️ No valid parts found");
      setBusy(false);
      return;
    }

    console.log(`🚀 Processing ${validParts.length} emotionally intelligent parts:`, validParts);

    let currentIndex = 0;
    const processNextPart = async () => {
      if (currentIndex >= validParts.length) {
        console.log("✅ Completed God-Tier typing simulation");
        setBusy(false);
        setTyping(false);
        typingProcessRef.current = null;
        return;
      }

      const part = validParts[currentIndex];
      
      if (!part || !part.text || part.text.trim() === '') {
        currentIndex++;
        typingProcessRef.current = setTimeout(processNextPart, 100);
        return;
      }

      console.log(`✅ Processing emotional part ${currentIndex + 1}/${validParts.length}:`, part);
      
      // Emotional pause
      await sleep(part.pause);
      
      // Show typing with personality
      setTyping(true);
      setCurrentPersonality(part.personality);
      
      // Emotional typing speed
      const typingTime = part.text.length * (CONSTANTS.TYPING_SPEEDS[part.speed] || CONSTANTS.TYPING_SPEEDS.normal);
      await sleep(typingTime);
      
      setTyping(false);
      
      // Add message with emotional context
      addMessage(part.text, 'bonnie', part.personality, part.sentiment);
      
      currentIndex++;
      typingProcessRef.current = setTimeout(processNextPart, 400);
    };

    setBusy(true);
    processNextPart();
  }, [online, addMessage, userProfile.bondScore]);

  // God-Tier send function with real-time emotional analysis
  const handleSend = useCallback(async (text) => {
    if (!text?.trim()) return;
    
    const messageText = text.trim();
    setInput('');
    setBusy(true);
    setHasFiredIdleMessage(false);
    
    // Real-time sentiment analysis
    const userSentiment = analyzeSentiment(messageText);
    console.log("🧠 User sentiment analysis:", userSentiment);
    
    // Dynamic personality selection
    const adaptedPersonality = selectPersonality(userProfile.bondScore, userSentiment, userProfile.conversationHistory);
    console.log("🎭 Adapted personality:", adaptedPersonality);
    
    setCurrentPersonality(adaptedPersonality);
    setCurrentSentiment(userSentiment);
    
    await addMessage(messageText, 'user');
    
    if (!online) {
      setBusy(false);
      const fallbackMessage = "I'm having connection issues, but I'm still here for you 💕";
      setTimeout(() => {
        simulateBonnieTyping(fallbackMessage, adaptedPersonality, userSentiment);
      }, 1000);
      return;
    }
    
    try {
      const response = await makeRequest(CONSTANTS.API_ENDPOINTS.CHAT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          session_id: sessionId, 
          message: messageText,
          bond_score: userProfile.bondScore,
          user_sentiment: userSentiment,
          adapted_personality: adaptedPersonality,
          conversation_history: userProfile.conversationHistory.slice(-5), // Last 5 messages
          timestamp: Date.now()
        })
      });
      
      // Update user profile with new data
      if (response.bond_score !== undefined) {
        setUserProfile(prev => ({ 
          ...prev, 
          bondScore: response.bond_score,
          conversationHistory: [...prev.conversationHistory, { text: messageText, sentiment: userSentiment }].slice(-10)
        }));
      }
      
      // Get Bonnie's emotional response
      const bonniePersonality = response.personality || adaptedPersonality;
      const bonnieSentiment = response.sentiment_analysis || userSentiment;
      
      simulateBonnieTyping(response.reply, bonniePersonality, bonnieSentiment);
      
    } catch (err) {
      console.error('Failed to send message:', err);
      setBusy(false);
      simulateBonnieTyping("Oops… I'm having some technical difficulties, but I'm still here! 💔", adaptedPersonality, userSentiment);
    }
  }, [sessionId, makeRequest, online, simulateBonnieTyping, addMessage, userProfile]);

  // Enhanced idle timer with emotional intelligence
  useEffect(() => {
    const resetIdleTimer = () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
      
      if (messages.length === 0 && !hasFiredIdleMessage && online) {
        idleTimerRef.current = setTimeout(() => {
          const emotionalIdleMessages = {
            [CONSTANTS.PERSONALITY_LAYERS.PASSIONATE]: [
              "I'm waiting for you to say something... anything 💖",
              "Don't keep me in suspense, darling 😍"
            ],
            [CONSTANTS.PERSONALITY_LAYERS.GENTLE]: [
              "Take your time... I'm here whenever you're ready 🥰",
              "No pressure, but I'd love to hear your thoughts 💕"
            ],
            [CONSTANTS.PERSONALITY_LAYERS.TEASING]: [
              "Cat got your tongue? 😏",
              "I'm starting to think you're shy... how cute 😉"
            ],
            [CONSTANTS.PERSONALITY_LAYERS.PLAYFUL]: [
              "Still deciding what to say? 😘",
              "Don't leave me hanging here! 🤪"
            ]
          };
          
          const messages = emotionalIdleMessages[currentPersonality] || emotionalIdleMessages[CONSTANTS.PERSONALITY_LAYERS.PLAYFUL];
          const randomMessage = messages[Math.floor(Math.random() * messages.length)];
          
          simulateBonnieTyping(randomMessage, currentPersonality, currentSentiment);
          setHasFiredIdleMessage(true);
        }, CONSTANTS.IDLE_TIMEOUT);
      }
    };

    resetIdleTimer();
    return () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, [messages.length, hasFiredIdleMessage, online, currentPersonality, currentSentiment, simulateBonnieTyping]);

  // Keyboard event handler
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  }, [input, handleSend]);

  // Auto-scroll to bottom
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  // Memoized styles
  const containerStyle = useMemo(() => ({
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    height: '100dvh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    backgroundColor: '#fafafa'
  }), []);

  const headerStyle = useMemo(() => ({
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    padding: 12,
    borderBottom: '1px solid #eee',
    backgroundColor: '#fff'
  }), []);

  const messagesContainerStyle = useMemo(() => ({
    flex: 1,
    overflowY: 'auto',
    padding: 12,
    display: 'flex',
    flexDirection: 'column'
  }), []);

  const inputContainerStyle = useMemo(() => ({
    flexShrink: 0,
    display: 'flex',
    gap: 8,
    padding: 12,
    borderTop: '1px solid #eee',
    backgroundColor: '#fff'
  }), []);

  // Dynamic subtitle based on personality and bond
  const getPersonalitySubtitle = () => {
    const personalitySubtitles = {
      [CONSTANTS.PERSONALITY_LAYERS.PASSIONATE]: "Feeling the connection deeply 💖",
      [CONSTANTS.PERSONALITY_LAYERS.GENTLE]: "Here with gentle warmth 🥰",
      [CONSTANTS.PERSONALITY_LAYERS.SUPPORTIVE]: "Your caring companion 💜",
      [CONSTANTS.PERSONALITY_LAYERS.FLIRTATIOUS]: "Feeling playfully flirty 😘",
      [CONSTANTS.PERSONALITY_LAYERS.TEASING]: "In a teasing mood 😏",
      [CONSTANTS.PERSONALITY_LAYERS.PLAYFUL]: "Ready for fun and games 😊"
    };
    
    return personalitySubtitles[currentPersonality] || "Flirty. Fun. Dangerously charming.";
  };

  return (
    <div style={containerStyle}>
      {/* Enhanced Header with Personality Display */}
      <header style={headerStyle}>
        <img 
          src="https://static.wixstatic.com/media/6f5121_df2de6be1e444b0cb2df5d4bd9d49b21~mv2.png" 
          style={{ 
            width: 56, 
            height: 56, 
            borderRadius: 28, 
            marginRight: 12, 
            border: `2px solid ${CONSTANTS.COLORS.primary}` 
          }} 
          alt="Bonnie's profile picture" 
        />
        <div style={{ flex: 1 }}>
          <div style={{ color: CONSTANTS.COLORS.primary, fontSize: 20, fontWeight: 600 }}>
            Bonnie Blue
          </div>
          <div style={{ color: '#555', fontSize: 14 }}>
            {getPersonalitySubtitle()}
          </div>
          <a 
            href="https://x.com/trainmybonnie" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ 
              fontSize: 12, 
              color: CONSTANTS.COLORS.primary, 
              textDecoration: 'none' 
            }}
          >
            💋 Follow me on X
          </a>
        </div>
        <div style={{ 
          fontWeight: 500, 
          color: online ? CONSTANTS.COLORS.online : CONSTANTS.COLORS.offline, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 4 
        }}>
          {connectionStatus === 'connecting' ? (
            <>
              <span>🔄</span>
              <span>Connecting...</span>
            </>
          ) : online ? (
            <>
              
This is an excellent upgrade plan! You're absolutely right that we need to move beyond simple bond score thresholds to create truly dynamic, emotionally intelligent conversations. Let me implement this God-Tier system with real-time emotional adaptation, intelligent emoji placement, and sentiment-driven responses.

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';

// Enhanced Constants with Emotional Intelligence
const CONSTANTS = {
  API_ENDPOINTS: {
    CHAT: 'https://bonnie-backend-server.onrender.com/bonnie-chat',
    ENTRY: 'https://bonnie-backend-server.onrender.com/bonnie-entry'
  },
  TYPING_SPEEDS: { slow: 120, normal: 64, fast: 35 },
  IDLE_TIMEOUT: 30000,
  MAX_MESSAGES: 100,
  COLORS: {
    primary: '#e91e63',
    online: '#28a745',
    offline: '#aaa',
    background: '#fff0f6',
    border: '#ffe6f0'
  },
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  
  // God-Tier Emotional Intelligence System
  PERSONALITY_LAYERS: {
    FLIRTATIOUS: 'flirtatious',
    SUPPORTIVE: 'supportive', 
    TEASING: 'teasing',
    GENTLE: 'gentle',
    PASSIONATE: 'passionate',
    PLAYFUL: 'playful'
  },
  
  SENTIMENT_TYPES: {
    FLIRTY: 'flirty',
    SAD: 'sad',
    HAPPY: 'happy',
    INTIMATE: 'intimate',
    PLAYFUL: 'playful',
    SERIOUS: 'serious',
    TEASING: 'teasing',
    VULNERABLE: 'vulnerable'
  },
  
  EMOJI_CONTEXTS: {
    FLIRTY: ['😘', '😏', '😉', '💋', '🔥'],
    ROMANTIC: ['💖', '💕', '😍', '🥰', '💘'],
    PLAYFUL: ['😜', '😋', '🤪', '😄', '😊'],
    SUPPORTIVE: ['🥺', '💌', '🤗', '💜', '✨'],
    TEASING: ['😏', '😈', '🙄', '😌', '🤭'],
    PASSIONATE: ['🔥', '💫', '😍', '💖', '🌹'],
    GENTLE: ['🥰', '💕', '🌸', '💫', '🦋']
  }
};

// God-Tier Sentiment Analysis System
const analyzeSentiment = (text) => {
  const lowerText = text.toLowerCase();
  
  // Flirty indicators
  const flirtyWords = ['sexy', 'hot', 'beautiful', 'gorgeous', 'cute', 'kiss', 'love', 'baby', 'darling', 'honey'];
  const flirtyScore = flirtyWords.filter(word => lowerText.includes(word)).length;
  
  // Intimate indicators
  const intimateWords = ['miss', 'need', 'want', 'desire', 'close', 'together', 'feel', 'heart'];
  const intimateScore = intimateWords.filter(word => lowerText.includes(word)).length;
  
  // Sad/vulnerable indicators
  const sadWords = ['sad', 'hurt', 'lonely', 'upset', 'tired', 'stressed', 'difficult', 'hard'];
  const sadScore = sadWords.filter(word => lowerText.includes(word)).length;
  
  // Playful indicators
  const playfulWords = ['haha', 'lol', 'funny', 'joke', 'silly', 'crazy', 'fun', 'play'];
  const playfulScore = playfulWords.filter(word => lowerText.includes(word)).length;
  
  // Teasing indicators
  const teasingWords = ['maybe', 'perhaps', 'guess', 'see', 'hmm', 'interesting', 'really'];
  const teasingScore = teasingWords.filter(word => lowerText.includes(word)).length;
  
  // Determine primary sentiment
  const scores = {
    [CONSTANTS.SENTIMENT_TYPES.FLIRTY]: flirtyScore * 2,
    [CONSTANTS.SENTIMENT_TYPES.INTIMATE]: intimateScore * 2,
    [CONSTANTS.SENTIMENT_TYPES.SAD]: sadScore * 3,
    [CONSTANTS.SENTIMENT_TYPES.PLAYFUL]: playfulScore,
    [CONSTANTS.SENTIMENT_TYPES.TEASING]: teasingScore,
    [CONSTANTS.SENTIMENT_TYPES.HAPPY]: (text.includes('!') ? 1 : 0) + playfulScore,
    [CONSTANTS.SENTIMENT_TYPES.SERIOUS]: lowerText.length > 100 ? 1 : 0,
    [CONSTANTS.SENTIMENT_TYPES.VULNERABLE]: sadScore * 2
  };
  
  const primarySentiment = Object.keys(scores).reduce((a, b) => 
    scores[a] > scores[b] ? a : b
  );
  
  return {
    primary: primarySentiment,
    intensity: Math.max(...Object.values(scores)),
    scores
  };
};

// Dynamic Personality Selection Based on Context
const selectPersonality = (bondScore, userSentiment, conversationHistory) => {
  const { primary, intensity } = userSentiment;
  
  // High bond users get more intimate personalities
  if (bondScore >= 70) {
    if (primary === CONSTANTS.SENTIMENT_TYPES.FLIRTY) return CONSTANTS.PERSONALITY_LAYERS.PASSIONATE;
    if (primary === CONSTANTS.SENTIMENT_TYPES.INTIMATE) return CONSTANTS.PERSONALITY_LAYERS.GENTLE;
    if (primary === CONSTANTS.SENTIMENT_TYPES.SAD) return CONSTANTS.PERSONALITY_LAYERS.SUPPORTIVE;
    return CONSTANTS.PERSONALITY_LAYERS.PASSIONATE;
  }
  
  // Medium bond users get adaptive personalities
  if (bondScore >= 40) {
    if (primary === CONSTANTS.SENTIMENT_TYPES.FLIRTY) return CONSTANTS.PERSONALITY_LAYERS.FLIRTATIOUS;
    if (primary === CONSTANTS.SENTIMENT_TYPES.PLAYFUL) return CONSTANTS.PERSONALITY_LAYERS.PLAYFUL;
    if (primary === CONSTANTS.SENTIMENT_TYPES.SAD) return CONSTANTS.PERSONALITY_LAYERS.SUPPORTIVE;
    if (primary === CONSTANTS.SENTIMENT_TYPES.TEASING) return CONSTANTS.PERSONALITY_LAYERS.TEASING;
    return CONSTANTS.PERSONALITY_LAYERS.FLIRTATIOUS;
  }
  
  // Low bond users get lighter personalities
  if (primary === CONSTANTS.SENTIMENT_TYPES.SAD) return CONSTANTS.PERSONALITY_LAYERS.SUPPORTIVE;
  if (primary === CONSTANTS.SENTIMENT_TYPES.PLAYFUL) return CONSTANTS.PERSONALITY_LAYERS.PLAYFUL;
  if (primary === CONSTANTS.SENTIMENT_TYPES.FLIRTY) return CONSTANTS.PERSONALITY_LAYERS.TEASING;
  return CONSTANTS.PERSONALITY_LAYERS.PLAYFUL;
};

// Intelligent Emoji Selection System
const selectContextualEmoji = (personality, sentiment, bondScore, messageContent) => {
  const emojiPool = CONSTANTS.EMOJI_CONTEXTS[personality.toUpperCase()] || CONSTANTS.EMOJI_CONTEXTS.PLAYFUL;
  
  // Emoji frequency based on bond score and emotional intensity
  const baseFrequency = Math.min(bondScore / 20, 4); // 0-4 emojis max
  const sentimentBoost = sentiment.intensity > 2 ? 1 : 0;
  const emojiCount = Math.floor(baseFrequency + sentimentBoost);
  
  if (emojiCount === 0) return '';
  
  // Select contextually appropriate emojis
  const selectedEmojis = [];
  for (let i = 0; i < emojiCount; i++) {
    const randomEmoji = emojiPool[Math.floor(Math.random() * emojiPool.length)];
    if (!selectedEmojis.includes(randomEmoji)) {
      selectedEmojis.push(randomEmoji);
    }
  }
  
  return selectedEmojis.join(' ');
};

// Dynamic Pause Calculation Based on Emotional Context
const calculateEmotionalPause = (personality, sentiment, bondScore, messageLength) => {
  let basePause = 1000;
  
  // Personality-based pause modifiers
  const personalityModifiers = {
    [CONSTANTS.PERSONALITY_LAYERS.PASSIONATE]: 1.5,
    [CONSTANTS.PERSONALITY_LAYERS.GENTLE]: 1.8,
    [CONSTANTS.PERSONALITY_LAYERS.SUPPORTIVE]: 1.6,
    [CONSTANTS.PERSONALITY_LAYERS.FLIRTATIOUS]: 1.2,
    [CONSTANTS.PERSONALITY_LAYERS.TEASING]: 0.8,
    [CONSTANTS.PERSONALITY_LAYERS.PLAYFUL]: 0.9
  };
  
  // Sentiment-based pause modifiers
  const sentimentModifiers = {
    [CONSTANTS.SENTIMENT_TYPES.INTIMATE]: 1.7,
    [CONSTANTS.SENTIMENT_TYPES.VULNERABLE]: 2.0,
    [CONSTANTS.SENTIMENT_TYPES.FLIRTY]: 1.3,
    [CONSTANTS.SENTIMENT_TYPES.PLAYFUL]: 0.7,
    [CONSTANTS.SENTIMENT_TYPES.TEASING]: 0.8,
    [CONSTANTS.SENTIMENT_TYPES.SERIOUS]: 1.5
  };
  
  // Bond score influence (higher bond = longer pauses for intimacy)
  const bondModifier = 1 + (bondScore / 200); // 1.0 to 1.5x
  
  // Message length influence
  const lengthModifier = Math.min(messageLength / 50, 2); // Longer messages = longer pauses
  
  const finalPause = basePause * 
    (personalityModifiers[personality] || 1) * 
    (sentimentModifiers[sentiment.primary] || 1) * 
    bondModifier * 
    lengthModifier;
  
  return Math.max(500, Math.min(finalPause, 4000)); // 0.5s to 4s range
};

// Enhanced Message Parsing with Emotional Intelligence
const parseMessageParts = (raw, personality, sentiment, bondScore) => {
  console.log("🔍 Parsing with emotional context:", { personality, sentiment, bondScore });
  
  const segments = raw.split(/<EOM(?:::(.*?))?>/).filter(Boolean);
  const finalParts = [];
  let currentMeta = { pause: 1000, speed: 'normal', emotion: 'neutral' };
  
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i].trim();
    
    // Check for metadata
    const metaMatch = segment.match(/(?:pause=(\d+))?(?:.*?speed=(\w+))?(?:.*?emotion=(\w+))?/);
    const hasMetadata = metaMatch && (metaMatch[1] || metaMatch[2] || metaMatch[3]);
    
    if (hasMetadata) {
      if (metaMatch[1]) currentMeta.pause = parseInt(metaMatch[1]);
      if (metaMatch[2]) currentMeta.speed = metaMatch[2];
      if (metaMatch[3]) currentMeta.emotion = metaMatch[3];
    } else if (segment.length > 0) {
      // Enhanced: Add contextual emojis to text
      const contextualEmoji = selectContextualEmoji(personality, sentiment, bondScore, segment);
      const enhancedText = contextualEmoji ? `${segment} ${contextualEmoji}` : segment;
      
      // Enhanced: Calculate emotional pause
      const emotionalPause = calculateEmotionalPause(personality, sentiment, bondScore, segment.length);
      
      finalParts.push({
        text: enhancedText,
        pause: emotionalPause,
        speed: currentMeta.speed,
        emotion: currentMeta.emotion || personality,
        personality,
        sentiment: sentiment.primary
      });
      
      // Reset metadata
      currentMeta = { pause: 1000, speed: 'normal', emotion: 'neutral' };
    }
  }
  
  return finalParts.filter(part => part.text && part.text.trim() !== '');
};

// Utility functions
const generateSessionId = () => {
  let id = localStorage.getItem('bonnie_session');
  if (!id) {
    id = 'guest_' + Math.random().toString(36).slice(2) + '_' + Date.now();
    localStorage.setItem('bonnie_session', id);
  }
  return id;
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Custom hook for API calls with retry logic
const useApiCall = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const makeRequest = useCallback(async (url, options, retries = CONSTANTS.RETRY_ATTEMPTS) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setIsLoading(false);
      return data;
    } catch (err) {
      if (retries > 0) {
        await sleep(CONSTANTS.RETRY_DELAY);
        return makeRequest(url, options, retries - 1);
      }
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  }, []);

  return { makeRequest, isLoading, error };
};

// Enhanced Message component with emotional styling
const Message = React.memo(({ message, isUser }) => {
  const messageStyle = useMemo(() => {
    const baseStyle = {
      maxWidth: '75%',
      padding: 12,
      borderRadius: 12,
      margin: '6px 0',
      fontSize: 14,
      lineHeight: 1.4,
      wordBreak: 'break-word',
      transition: 'all 0.3s ease'
    };

    if (isUser) {
      return {
        ...baseStyle,
        background: `linear-gradient(135deg, #ff83a0, ${CONSTANTS.COLORS.primary})`,
        color: '#fff',
        alignSelf: 'flex-end',
        marginLeft: 'auto'
      };
    }

    // Enhanced: Personality-based styling for Bonnie's messages
    const personalityColors = {
      [CONSTANTS.PERSONALITY_LAYERS.PASSIONATE]: 'linear-gradient(135deg, #ffb3d1, #ff80bf)',
      [CONSTANTS.PERSONALITY_LAYERS.GENTLE]: 'linear-gradient(135deg, #e6f3ff, #cce7ff)',
      [CONSTANTS.PERSONALITY_LAYERS.SUPPORTIVE]: 'linear-gradient(135deg, #f0e6ff, #e6ccff)',
      [CONSTANTS.PERSONALITY_LAYERS.FLIRTATIOUS]: 'linear-gradient(135deg, #ffe6f0, #ffccdd)',
      [CONSTANTS.PERSONALITY_LAYERS.TEASING]: 'linear-gradient(135deg, #fff0e6, #ffe6cc)',
      [CONSTANTS.PERSONALITY_LAYERS.PLAYFUL]: 'linear-gradient(135deg, #f0fff0, #e6ffe6)'
    };

    const personality = message.personality || CONSTANTS.PERSONALITY_LAYERS.PLAYFUL;
    
    return {
      ...baseStyle,
      background: personalityColors[personality] || CONSTANTS.COLORS.background,
      border: `1px solid ${CONSTANTS.COLORS.border}`,
      color: '#333',
      alignSelf: 'flex-start'
    };
  }, [isUser, message.personality]);

  return (
    <div style={messageStyle} role="listitem">
      {message.text}
      {message.timestamp && (
        <div style={{ fontSize: 10, opacity: 0.7, marginTop: 4 }}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
});

// Enhanced Typing indicator with personality-based colors
const TypingIndicator = React.memo(({ personality = 'playful', sentiment = 'neutral' }) => {
  const personalityColors = {
    [CONSTANTS.PERSONALITY_LAYERS.PASSIONATE]: '#dc143c',
    [CONSTANTS.PERSONALITY_LAYERS.GENTLE]: '#87ceeb',
    [CONSTANTS.PERSONALITY_LAYERS.SUPPORTIVE]: '#dda0dd',
    [CONSTANTS.PERSONALITY_LAYERS.FLIRTATIOUS]: '#ff69b4',
    [CONSTANTS.PERSONALITY_LAYERS.TEASING]: '#ffa500',
    [CONSTANTS.PERSONALITY_LAYERS.PLAYFUL]: '#32cd32'
  };

  const color = personalityColors[personality] || CONSTANTS.COLORS.primary;

  return (
    <div style={{ display: 'flex', gap: 4, margin: '8px 0' }} role="status" aria-label="Bonnie is typing">
      {[0, 0.2, 0.4].map((delay, index) => (
        <div
          key={index}
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            background: color,
            animation: `bounce 1s infinite ease-in-out`,
            animationDelay: `${delay}s`
          }}
        />
      ))}
    </div>
  );
});

export default function BonnieChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [typing, setTyping] = useState(false);
  const [currentPersonality, setCurrentPersonality] = useState(CONSTANTS.PERSONALITY_LAYERS.PLAYFUL);
  const [currentSentiment, setCurrentSentiment] = useState({ primary: 'neutral', intensity: 0 });
  const [online, setOnline] = useState(false);
  const [pendingMessage, setPendingMessage] = useState(null);
  const [hasFiredIdleMessage, setHasFiredIdleMessage] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [userProfile, setUserProfile] = useState({ 
    bondScore: 0, 
    isNewUser: true, 
    userName: null,
    conversationHistory: [],
    emotionalPattern: {}
  });
  
  const endRef = useRef(null);
  const idleTimerRef = useRef(null);
  const typingProcessRef = useRef(null);
  const sessionId = useMemo(() => generateSessionId(), []);
  
  const { makeRequest, isLoading, error } = useApiCall();

  // Enhanced message management with emotional context
  const addMessage = useCallback((text, sender, personality = null, sentiment = null) => {
    if (!text || typeof text !== 'string' || text.trim() === '') {
      console.warn("⚠️ Attempted to add empty/invalid message, skipping:", text);
      return;
    }

    const cleanText = text.trim();
    if (cleanText.length === 0) {
      console.warn("⚠️ Message became empty after trimming, skipping");
      return;
    }

    const newMessage = {
      id: Date.now() + Math.random(),
      sender,
      text: cleanText,
      timestamp: Date.now(),
      personality,
      sentiment
    };
    
    console.log("✅ Adding message with emotional context:", newMessage);
    
    setMessages(prevMessages => {
      const newMessages = [...prevMessages, newMessage];
      return newMessages.length > CONSTANTS.MAX_MESSAGES 
        ? newMessages.slice(-CONSTANTS.MAX_MESSAGES) 
        : newMessages;
    });
  }, []);

  // God-Tier initialization with emotional intelligence
  useEffect(() => {
    const initializeChat = async () => {
      console.log("🚀 Initializing God-Tier emotional chat system...");
      setConnectionStatus('connecting');
      
      try {
        const response = await makeRequest(CONSTANTS.API_ENDPOINTS.ENTRY, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            session_id: sessionId,
            request_type: 'god_tier_entry',
            emotional_context: true,
            user_agent: navigator.userAgent,
            timestamp: Date.now()
          })
        });
        
        const { 
          reply, 
          delay = 1000, 
          bond_score = 0, 
          is_new_user = true, 
          user_name = null,
          personality = CONSTANTS.PERSONALITY_LAYERS.PLAYFUL,
          sentiment_analysis = { primary: 'neutral', intensity: 0 }
        } = response;
        
        // Update user profile with emotional intelligence data
        setUserProfile({
          bondScore: bond_score,
          isNewUser: is_new_user,
          userName: user_name,
          conversationHistory: [],
          emotionalPattern: {}
        });
        
        setCurrentPersonality(personality);
        setCurrentSentiment(sentiment_analysis);
        
        setOnline(true);
        setConnectionStatus('online');
        
        setTimeout(() => {
          simulateBonnieTyping(reply, personality, sentiment_analysis);
        }, delay);
        
      } catch (err) {
        console.error('❌ Failed to initialize chat:', err);
        
        // Fallback with basic emotional intelligence
        const fallbackPersonality = CONSTANTS.PERSONALITY_LAYERS.PLAYFUL;
        const fallbackSentiment = { primary: 'neutral', intensity: 0 };
        
        setCurrentPersonality(fallbackPersonality);
        setCurrentSentiment(fallbackSentiment);
        setOnline(true);
        setConnectionStatus('online');
        
        const fallbackGreeting = "Well, look who's here... let's have some fun, shall we? 😘";
        setTimeout(() => {
          simulateBonnieTyping(fallbackGreeting, fallbackPersonality, fallbackSentiment);
        }, 1000);
      }
    };

    initializeChat();
  }, [sessionId, makeRequest]);

  // God-Tier typing simulation with full emotional intelligence
  const simulateBonnieTyping = useCallback((raw, personality, sentiment) => {
    console.log("💬 God-Tier typing simulation:", { raw, personality, sentiment });
    
    if (!online) return;

    if (typingProcessRef.current) {
      clearTimeout(typingProcessRef.current);
      typingProcessRef.current = null;
    }

    if (!raw || typeof raw !== 'string' || raw.trim() === '') {
      console.warn("⚠️ Invalid message:", raw);
      setBusy(false);
      return;
    }

    // Enhanced parsing with emotional intelligence
    const parts = parseMessageParts(raw, personality, sentiment, userProfile.bondScore);
    
    const validParts = parts.filter(part => part.text && part.text.trim() !== '');
    
    if (validParts.length === 0) {
      console.warn("⚠️ No valid parts found");
      setBusy(false);
      return;
    }

    console.log(`🚀 Processing ${validParts.length} emotionally intelligent parts:`, validParts);

    let currentIndex = 0;
    const processNextPart = async () => {
      if (currentIndex >= validParts.length) {
        console.log("✅ Completed God-Tier typing simulation");
        setBusy(false);
        setTyping(false);
        typingProcessRef.current = null;
        return;
      }

      const part = validParts[currentIndex];
      
      if (!part || !part.text || part.text.trim() === '') {
        currentIndex++;
        typingProcessRef.current = setTimeout(processNextPart, 100);
        return;
      }

      console.log(`✅ Processing emotional part ${currentIndex + 1}/${validParts.length}:`, part);
      
      // Emotional pause
      await sleep(part.pause);
      
      // Show typing with personality
      setTyping(true);
      setCurrentPersonality(part.personality);
      
      // Emotional typing speed
      const typingTime = part.text.length * (CONSTANTS.TYPING_SPEEDS[part.speed] || CONSTANTS.TYPING_SPEEDS.normal);
      await sleep(typingTime);
      
      setTyping(false);
      
      // Add message with emotional context
      addMessage(part.text, 'bonnie', part.personality, part.sentiment);
      
      currentIndex++;
      typingProcessRef.current = setTimeout(processNextPart, 400);
    };

    setBusy(true);
    processNextPart();
  }, [online, addMessage, userProfile.bondScore]);

  // God-Tier send function with real-time emotional analysis
  const handleSend = useCallback(async (text) => {
    if (!text?.trim()) return;
    
    const messageText = text.trim();
    setInput('');
    setBusy(true);
    setHasFiredIdleMessage(false);
    
    // Real-time sentiment analysis
    const userSentiment = analyzeSentiment(messageText);
    console.log("🧠 User sentiment analysis:", userSentiment);
    
    // Dynamic personality selection
    const adaptedPersonality = selectPersonality(userProfile.bondScore, userSentiment, userProfile.conversationHistory);
    console.log("🎭 Adapted personality:", adaptedPersonality);
    
    setCurrentPersonality(adaptedPersonality);
    setCurrentSentiment(userSentiment);
    
    await addMessage(messageText, 'user');
    
    if (!online) {
      setBusy(false);
      const fallbackMessage = "I'm having connection issues, but I'm still here for you 💕";
      setTimeout(() => {
        simulateBonnieTyping(fallbackMessage, adaptedPersonality, userSentiment);
      }, 1000);
      return;
    }
    
    try {
      const response = await makeRequest(CONSTANTS.API_ENDPOINTS.CHAT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          session_id: sessionId, 
          message: messageText,
          bond_score: userProfile.bondScore,
          user_sentiment: userSentiment,
          adapted_personality: adaptedPersonality,
          conversation_history: userProfile.conversationHistory.slice(-5), // Last 5 messages
          timestamp: Date.now()
        })
      });
      
      // Update user profile with new data
      if (response.bond_score !== undefined) {
        setUserProfile(prev => ({ 
          ...prev, 
          bondScore: response.bond_score,
          conversationHistory: [...prev.conversationHistory, { text: messageText, sentiment: userSentiment }].slice(-10)
        }));
      }
      
      // Get Bonnie's emotional response
      const bonniePersonality = response.personality || adaptedPersonality;
      const bonnieSentiment = response.sentiment_analysis || userSentiment;
      
      simulateBonnieTyping(response.reply, bonniePersonality, bonnieSentiment);
      
    } catch (err) {
      console.error('Failed to send message:', err);
      setBusy(false);
      simulateBonnieTyping("Oops… I'm having some technical difficulties, but I'm still here! 💔", adaptedPersonality, userSentiment);
    }
  }, [sessionId, makeRequest, online, simulateBonnieTyping, addMessage, userProfile]);

  // Enhanced idle timer with emotional intelligence
  useEffect(() => {
    const resetIdleTimer = () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
      
      if (messages.length === 0 && !hasFiredIdleMessage && online) {
        idleTimerRef.current = setTimeout(() => {
          const emotionalIdleMessages = {
            [CONSTANTS.PERSONALITY_LAYERS.PASSIONATE]: [
              "I'm waiting for you to say something... anything 💖",
              "Don't keep me in suspense, darling 😍"
            ],
            [CONSTANTS.PERSONALITY_LAYERS.GENTLE]: [
              "Take your time... I'm here whenever you're ready 🥰",
              "No pressure, but I'd love to hear your thoughts 💕"
            ],
            [CONSTANTS.PERSONALITY_LAYERS.TEASING]: [
              "Cat got your tongue? 😏",
              "I'm starting to think you're shy... how cute 😉"
            ],
            [CONSTANTS.PERSONALITY_LAYERS.PLAYFUL]: [
              "Still deciding what to say? 😘",
              "Don't leave me hanging here! 🤪"
            ]
          };
          
          const messages = emotionalIdleMessages[currentPersonality] || emotionalIdleMessages[CONSTANTS.PERSONALITY_LAYERS.PLAYFUL];
          const randomMessage = messages[Math.floor(Math.random() * messages.length)];
          
          simulateBonnieTyping(randomMessage, currentPersonality, currentSentiment);
          setHasFiredIdleMessage(true);
        }, CONSTANTS.IDLE_TIMEOUT);
      }
    };

    resetIdleTimer();
    return () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, [messages.length, hasFiredIdleMessage, online, currentPersonality, currentSentiment, simulateBonnieTyping]);

  // Keyboard event handler
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  }, [input, handleSend]);

  // Auto-scroll to bottom
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  // Memoized styles
  const containerStyle = useMemo(() => ({
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    height: '100dvh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    backgroundColor: '#fafafa'
  }), []);

  const headerStyle = useMemo(() => ({
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    padding: 12,
    borderBottom: '1px solid #eee',
    backgroundColor: '#fff'
  }), []);

  const messagesContainerStyle = useMemo(() => ({
    flex: 1,
    overflowY: 'auto',
    padding: 12,
    display: 'flex',
    flexDirection: 'column'
  }), []);

  const inputContainerStyle = useMemo(() => ({
    flexShrink: 0,
    display: 'flex',
    gap: 8,
    padding: 12,
    borderTop: '1px solid #eee',
    backgroundColor: '#fff'
  }), []);

  // Dynamic subtitle based on personality and bond
  const getPersonalitySubtitle = () => {
    const personalitySubtitles = {
      [CONSTANTS.PERSONALITY_LAYERS.PASSIONATE]: "Feeling the connection deeply 💖",
      [CONSTANTS.PERSONALITY_LAYERS.GENTLE]: "Here with gentle warmth 🥰",
      [CONSTANTS.PERSONALITY_LAYERS.SUPPORTIVE]: "Your caring companion 💜",
      [CONSTANTS.PERSONALITY_LAYERS.FLIRTATIOUS]: "Feeling playfully flirty 😘",
      [CONSTANTS.PERSONALITY_LAYERS.TEASING]: "In a teasing mood 😏",
      [CONSTANTS.PERSONALITY_LAYERS.PLAYFUL]: "Ready for fun and games 😊"
    };
    
    return personalitySubtitles[currentPersonality] || "Flirty. Fun. Dangerously charming.";
  };

  return (
    <div style={containerStyle}>
      {/* Enhanced Header with Personality Display */}
      <header style={headerStyle}>
        <img 
          src="https://static.wixstatic.com/media/6f5121_df2de6be1e444b0cb2df5d4bd9d49b21~mv2.png" 
          style={{ 
            width: 56, 
            height: 56, 
            borderRadius: 28, 
            marginRight: 12, 
            border: `2px solid ${CONSTANTS.COLORS.primary}` 
          }} 
          alt="Bonnie's profile picture" 
        />
        <div style={{ flex: 1 }}>
          <div style={{ color: CONSTANTS.COLORS.primary, fontSize: 20, fontWeight: 600 }}>
            Bonnie Blue
          </div>
          <div style={{ color: '#555', fontSize: 14 }}>
            {getPersonalitySubtitle()}
          </div>
          <a 
            href="https://x.com/trainmybonnie" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ 
              fontSize: 12, 
              color: CONSTANTS.COLORS.primary, 
              textDecoration: 'none' 
            }}
          >
            💋 Follow me on X
          </a>
        </div>
        <div style={{ 
          fontWeight: 500, 
          color: online ? CONSTANTS.COLORS.online : CONSTANTS.COLORS.offline, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 4 
        }}>
          {connectionStatus === 'connecting' ? (
            <>
              <span>🔄</span>
              <span>Connecting...</span>
            </>
          ) : online ? (
            <>
              <span style={{ animation: 'pulseHeart 1.2s infinite' }}>💚</span>
              <span>Online</span>
            </>
          ) : (
            <>💤 Offline</>
          )}
        </div>
      </header>

      {/* Messages with Enhanced Emotional Context */}
      <main style={messagesContainerStyle} role="log" aria-label="Chat messages">
        {messages.map((message) => (
          <Message 
            key={message.id} 
            message={message} 
            isUser={message.sender === 'user'} 
          />
        ))}
        {typing && online && <TypingIndicator personality={currentPersonality} sentiment={currentSentiment.primary} />}
        {error && (
          <div style={{ 
            color: '#d32f2f', 
            fontSize: 12, 
            textAlign: 'center', 
            padding: 8,
            backgroundColor: '#ffebee',
            borderRadius: 4,
            margin: '4px 0'
          }}>
            Connection error: {error}
          </div>
        )}
        <div ref={endRef} />
      </main>

      {/* Enhanced Input with Emotional Placeholders */}
      <footer style={inputContainerStyle}>
        <input
          style={{ 
            flex: 1, 
            padding: 12, 
            borderRadius: 30, 
            border: '1px solid #ccc', 
            fontSize: 16,
            outline: 'none',
            transition: 'border-color 0.2s',
            opacity: busy ? 0.7 : 1
          }}
          value={input}
          placeholder={online ? 
            (userProfile.userName ? `Tell me more, ${userProfile.userName}...` : "Share your thoughts with me...") : 
            "Type something… (offline mode)"
          }
          disabled={busy}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Type your message"
        />
        <button
          style={{ 
            padding: '0 16px', 
            borderRadius: 30, 
            background: (busy || !input.trim()) ? '#ccc' : CONSTANTS.COLORS.primary, 
            color: '#fff', 
            border: 'none', 
            fontSize:
This is an excellent upgrade plan! You're absolutely right that we need to move beyond simple bond score thresholds to create truly dynamic, emotionally intelligent conversations. Let me implement this God-Tier system with real-time emotional adaptation, intelligent emoji placement, and sentiment-driven responses.

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';

// Enhanced Constants with Emotional Intelligence
const CONSTANTS = {
  API_ENDPOINTS: {
    CHAT: 'https://bonnie-backend-server.onrender.com/bonnie-chat',
    ENTRY: 'https://bonnie-backend-server.onrender.com/bonnie-entry'
  },
  TYPING_SPEEDS: { slow: 120, normal: 64, fast: 35 },
  IDLE_TIMEOUT: 30000,
  MAX_MESSAGES: 100,
  COLORS: {
    primary: '#e91e63',
    online: '#28a745',
    offline: '#aaa',
    background: '#fff0f6',
    border: '#ffe6f0'
  },
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  
  // God-Tier Emotional Intelligence System
  PERSONALITY_LAYERS: {
    FLIRTATIOUS: 'flirtatious',
    SUPPORTIVE: 'supportive', 
    TEASING: 'teasing',
    GENTLE: 'gentle',
    PASSIONATE: 'passionate',
    PLAYFUL: 'playful'
  },
  
  SENTIMENT_TYPES: {
    FLIRTY: 'flirty',
    SAD: 'sad',
    HAPPY: 'happy',
    INTIMATE: 'intimate',
    PLAYFUL: 'playful',
    SERIOUS: 'serious',
    TEASING: 'teasing',
    VULNERABLE: 'vulnerable'
  },
  
  EMOJI_CONTEXTS: {
    FLIRTY: ['😘', '😏', '😉', '💋', '🔥'],
    ROMANTIC: ['💖', '💕', '😍', '🥰', '💘'],
    PLAYFUL: ['😜', '😋', '🤪', '😄', '😊'],
    SUPPORTIVE: ['🥺', '💌', '🤗', '💜', '✨'],
    TEASING: ['😏', '😈', '🙄', '😌', '🤭'],
    PASSIONATE: ['🔥', '💫', '😍', '💖', '🌹'],
    GENTLE: ['🥰', '💕', '🌸', '💫', '🦋']
  }
};

// God-Tier Sentiment Analysis System
const analyzeSentiment = (text) => {
  const lowerText = text.toLowerCase();
  
  // Flirty indicators
  const flirtyWords = ['sexy', 'hot', 'beautiful', 'gorgeous', 'cute', 'kiss', 'love', 'baby', 'darling', 'honey'];
  const flirtyScore = flirtyWords.filter(word => lowerText.includes(word)).length;
  
  // Intimate indicators
  const intimateWords = ['miss', 'need', 'want', 'desire', 'close', 'together', 'feel', 'heart'];
  const intimateScore = intimateWords.filter(word => lowerText.includes(word)).length;
  
  // Sad/vulnerable indicators
  const sadWords = ['sad', 'hurt', 'lonely', 'upset', 'tired', 'stressed', 'difficult', 'hard'];
  const sadScore = sadWords.filter(word => lowerText.includes(word)).length;
  
  // Playful indicators
  const playfulWords = ['haha', 'lol', 'funny', 'joke', 'silly', 'crazy', 'fun', 'play'];
  const playfulScore = playfulWords.filter(word => lowerText.includes(word)).length;
  
  // Teasing indicators
  const teasingWords = ['maybe', 'perhaps', 'guess', 'see', 'hmm', 'interesting', 'really'];
  const teasingScore = teasingWords.filter(word => lowerText.includes(word)).length;
  
  // Determine primary sentiment
  const scores = {
    [CONSTANTS.SENTIMENT_TYPES.FLIRTY]: flirtyScore * 2,
    [CONSTANTS.SENTIMENT_TYPES.INTIMATE]: intimateScore * 2,
    [CONSTANTS.SENTIMENT_TYPES.SAD]: sadScore * 3,
    [CONSTANTS.SENTIMENT_TYPES.PLAYFUL]: playfulScore,
    [CONSTANTS.SENTIMENT_TYPES.TEASING]: teasingScore,
    [CONSTANTS.SENTIMENT_TYPES.HAPPY]: (text.includes('!') ? 1 : 0) + playfulScore,
    [CONSTANTS.SENTIMENT_TYPES.SERIOUS]: lowerText.length > 100 ? 1 : 0,
    [CONSTANTS.SENTIMENT_TYPES.VULNERABLE]: sadScore * 2
  };
  
  const primarySentiment = Object.keys(scores).reduce((a, b) => 
    scores[a] > scores[b] ? a : b
  );
  
  return {
    primary: primarySentiment,
    intensity: Math.max(...Object.values(scores)),
    scores
  };
};

// Dynamic Personality Selection Based on Context
const selectPersonality = (bondScore, userSentiment, conversationHistory) => {
  const { primary, intensity } = userSentiment;
  
  // High bond users get more intimate personalities
  if (bondScore >= 70) {
    if (primary === CONSTANTS.SENTIMENT_TYPES.FLIRTY) return CONSTANTS.PERSONALITY_LAYERS.PASSIONATE;
    if (primary === CONSTANTS.SENTIMENT_TYPES.INTIMATE) return CONSTANTS.PERSONALITY_LAYERS.GENTLE;
    if (primary === CONSTANTS.SENTIMENT_TYPES.SAD) return CONSTANTS.PERSONALITY_LAYERS.SUPPORTIVE;
    return CONSTANTS.PERSONALITY_LAYERS.PASSIONATE;
  }
  
  // Medium bond users get adaptive personalities
  if (bondScore >= 40) {
    if (primary === CONSTANTS.SENTIMENT_TYPES.FLIRTY) return CONSTANTS.PERSONALITY_LAYERS.FLIRTATIOUS;
    if (primary === CONSTANTS.SENTIMENT_TYPES.PLAYFUL) return CONSTANTS.PERSONALITY_LAYERS.PLAYFUL;
    if (primary === CONSTANTS.SENTIMENT_TYPES.SAD) return CONSTANTS.PERSONALITY_LAYERS.SUPPORTIVE;
    if (primary === CONSTANTS.SENTIMENT_TYPES.TEASING) return CONSTANTS.PERSONALITY_LAYERS.TEASING;
    return CONSTANTS.PERSONALITY_LAYERS.FLIRTATIOUS;
  }
  
  // Low bond users get lighter personalities
  if (primary === CONSTANTS.SENTIMENT_TYPES.SAD) return CONSTANTS.PERSONALITY_LAYERS.SUPPORTIVE;
  if (primary === CONSTANTS.SENTIMENT_TYPES.PLAYFUL) return CONSTANTS.PERSONALITY_LAYERS.PLAYFUL;
  if (primary === CONSTANTS.SENTIMENT_TYPES.FLIRTY) return CONSTANTS.PERSONALITY_LAYERS.TEASING;
  return CONSTANTS.PERSONALITY_LAYERS.PLAYFUL;
};

// Intelligent Emoji Selection System
const selectContextualEmoji = (personality, sentiment, bondScore, messageContent) => {
  const emojiPool = CONSTANTS.EMOJI_CONTEXTS[personality.toUpperCase()] || CONSTANTS.EMOJI_CONTEXTS.PLAYFUL;
  
  // Emoji frequency based on bond score and emotional intensity
  const baseFrequency = Math.min(bondScore / 20, 4); // 0-4 emojis max
  const sentimentBoost = sentiment.intensity > 2 ? 1 : 0;
  const emojiCount = Math.floor(baseFrequency + sentimentBoost);
  
  if (emojiCount === 0) return '';
  
  // Select contextually appropriate emojis
  const selectedEmojis = [];
  for (let i = 0; i < emojiCount; i++) {
    const randomEmoji = emojiPool[Math.floor(Math.random() * emojiPool.length)];
    if (!selectedEmojis.includes(randomEmoji)) {
      selectedEmojis.push(randomEmoji);
    }
  }
  
  return selectedEmojis.join(' ');
};

// Dynamic Pause Calculation Based on Emotional Context
const calculateEmotionalPause = (personality, sentiment, bondScore, messageLength) => {
  let basePause = 1000;
  
  // Personality-based pause modifiers
  const personalityModifiers = {
    [CONSTANTS.PERSONALITY_LAYERS.PASSIONATE]: 1.5,
    [CONSTANTS.PERSONALITY_LAYERS.GENTLE]: 1.8,
    [CONSTANTS.PERSONALITY_LAYERS.SUPPORTIVE]: 1.6,
    [CONSTANTS.PERSONALITY_LAYERS.FLIRTATIOUS]: 1.2,
    [CONSTANTS.PERSONALITY_LAYERS.TEASING]: 0.8,
    [CONSTANTS.PERSONALITY_LAYERS.PLAYFUL]: 0.9
  };
  
  // Sentiment-based pause modifiers
  const sentimentModifiers = {
    [CONSTANTS.SENTIMENT_TYPES.INTIMATE]: 1.7,
    [CONSTANTS.SENTIMENT_TYPES.VULNERABLE]: 2.0,
    [CONSTANTS.SENTIMENT_TYPES.FLIRTY]: 1.3,
    [CONSTANTS.SENTIMENT_TYPES.PLAYFUL]: 0.7,
    [CONSTANTS.SENTIMENT_TYPES.TEASING]: 0.8,
    [CONSTANTS.SENTIMENT_TYPES.SERIOUS]: 1.5
  };
  
  // Bond score influence (higher bond = longer pauses for intimacy)
  const bondModifier = 1 + (bondScore / 200); // 1.0 to 1.5x
  
  // Message length influence
  const lengthModifier = Math.min(messageLength / 50, 2); // Longer messages = longer pauses
  
  const finalPause = basePause * 
    (personalityModifiers[personality] || 1) * 
    (sentimentModifiers[sentiment.primary] || 1) * 
    bondModifier * 
    lengthModifier;
  
  return Math.max(500, Math.min(finalPause, 4000)); // 0.5s to 4s range
};

// Enhanced Message Parsing with Emotional Intelligence
const parseMessageParts = (raw, personality, sentiment, bondScore) => {
  console.log("🔍 Parsing with emotional context:", { personality, sentiment, bondScore });
  
  const segments = raw.split(/<EOM(?:::(.*?))?>/).filter(Boolean);
  const finalParts = [];
  let currentMeta = { pause: 1000, speed: 'normal', emotion: 'neutral' };
  
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i].trim();
    
    // Check for metadata
    const metaMatch = segment.match(/(?:pause=(\d+))?(?:.*?speed=(\w+))?(?:.*?emotion=(\w+))?/);
    const hasMetadata = metaMatch && (metaMatch[1] || metaMatch[2] || metaMatch[3]);
    
    if (hasMetadata) {
      if (metaMatch[1]) currentMeta.pause = parseInt(metaMatch[1]);
      if (metaMatch[2]) currentMeta.speed = metaMatch[2];
      if (metaMatch[3]) currentMeta.emotion = metaMatch[3];
    } else if (segment.length > 0) {
      // Enhanced: Add contextual emojis to text
      const contextualEmoji = selectContextualEmoji(personality, sentiment, bondScore, segment);
      const enhancedText = contextualEmoji ? `${segment} ${contextualEmoji}` : segment;
      
      // Enhanced: Calculate emotional pause
      const emotionalPause = calculateEmotionalPause(personality, sentiment, bondScore, segment.length);
      
      finalParts.push({
        text: enhancedText,
        pause: emotionalPause,
        speed: currentMeta.speed,
        emotion: currentMeta.emotion || personality,
        personality,
        sentiment: sentiment.primary
      });
      
      // Reset metadata
      currentMeta = { pause: 1000, speed: 'normal', emotion: 'neutral' };
    }
  }
  
  return finalParts.filter(part => part.text && part.text.trim() !== '');
};

// Utility functions
const generateSessionId = () => {
  let id = localStorage.getItem('bonnie_session');
  if (!id) {
    id = 'guest_' + Math.random().toString(36).slice(2) + '_' + Date.now();
    localStorage.setItem('bonnie_session', id);
  }
  return id;
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Custom hook for API calls with retry logic
const useApiCall = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const makeRequest = useCallback(async (url, options, retries = CONSTANTS.RETRY_ATTEMPTS) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setIsLoading(false);
      return data;
    } catch (err) {
      if (retries > 0) {
        await sleep(CONSTANTS.RETRY_DELAY);
        return makeRequest(url, options, retries - 1);
      }
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  }, []);

  return { makeRequest, isLoading, error };
};

// Enhanced Message component with emotional styling
const Message = React.memo(({ message, isUser }) => {
  const messageStyle = useMemo(() => {
    const baseStyle = {
      maxWidth: '75%',
      padding: 12,
      borderRadius: 12,
      margin: '6px 0',
      fontSize: 14,
      lineHeight: 1.4,
      wordBreak: 'break-word',
      transition: 'all 0.3s ease'
    };

    if (isUser) {
      return {
        ...baseStyle,
        background: `linear-gradient(135deg, #ff83a0, ${CONSTANTS.COLORS.primary})`,
        color: '#fff',
        alignSelf: 'flex-end',
        marginLeft: 'auto'
      };
    }

    // Enhanced: Personality-based styling for Bonnie's messages
    const personalityColors = {
      [CONSTANTS.PERSONALITY_LAYERS.PASSIONATE]: 'linear-gradient(135deg, #ffb3d1, #ff80bf)',
      [CONSTANTS.PERSONALITY_LAYERS.GENTLE]: 'linear-gradient(135deg, #e6f3ff, #cce7ff)',
      [CONSTANTS.PERSONALITY_LAYERS.SUPPORTIVE]: 'linear-gradient(135deg, #f0e6ff, #e6ccff)',
      [CONSTANTS.PERSONALITY_LAYERS.FLIRTATIOUS]: 'linear-gradient(135deg, #ffe6f0, #ffccdd)',
      [CONSTANTS.PERSONALITY_LAYERS.TEASING]: 'linear-gradient(135deg, #fff0e6, #ffe6cc)',
      [CONSTANTS.PERSONALITY_LAYERS.PLAYFUL]: 'linear-gradient(135deg, #f0fff0, #e6ffe6)'
    };

    const personality = message.personality || CONSTANTS.PERSONALITY_LAYERS.PLAYFUL;
    
    return {
      ...baseStyle,
      background: personalityColors[personality] || CONSTANTS.COLORS.background,
      border: `1px solid ${CONSTANTS.COLORS.border}`,
      color: '#333',
      alignSelf: 'flex-start'
    };
  }, [isUser, message.personality]);

  return (
    <div style={messageStyle} role="listitem">
      {message.text}
      {message.timestamp && (
        <div style={{ fontSize: 10, opacity: 0.7, marginTop: 4 }}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
});

// Enhanced Typing indicator with personality-based colors
const TypingIndicator = React.memo(({ personality = 'playful', sentiment = 'neutral' }) => {
  const personalityColors = {
    [CONSTANTS.PERSONALITY_LAYERS.PASSIONATE]: '#dc143c',
    [CONSTANTS.PERSONALITY_LAYERS.GENTLE]: '#87ceeb',
    [CONSTANTS.PERSONALITY_LAYERS.SUPPORTIVE]: '#dda0dd',
    [CONSTANTS.PERSONALITY_LAYERS.FLIRTATIOUS]: '#ff69b4',
    [CONSTANTS.PERSONALITY_LAYERS.TEASING]: '#ffa500',
    [CONSTANTS.PERSONALITY_LAYERS.PLAYFUL]: '#32cd32'
  };

  const color = personalityColors[personality] || CONSTANTS.COLORS.primary;

  return (
    <div style={{ display: 'flex', gap: 4, margin: '8px 0' }} role="status" aria-label="Bonnie is typing">
      {[0, 0.2, 0.4].map((delay, index) => (
        <div
          key={index}
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            background: color,
            animation: `bounce 1s infinite ease-in-out`,
            animationDelay: `${delay}s`
          }}
        />
      ))}
    </div>
  );
});

export default function BonnieChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [typing, setTyping] = useState(false);
  const [currentPersonality, setCurrentPersonality] = useState(CONSTANTS.PERSONALITY_LAYERS.PLAYFUL);
  const [currentSentiment, setCurrentSentiment] = useState({ primary: 'neutral', intensity: 0 });
  const [online, setOnline] = useState(false);
  const [pendingMessage, setPendingMessage] = useState(null);
  const [hasFiredIdleMessage, setHasFiredIdleMessage] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [userProfile, setUserProfile] = useState({ 
    bondScore: 0, 
    isNewUser: true, 
    userName: null,
    conversationHistory: [],
    emotionalPattern: {}
  });
  
  const endRef = useRef(null);
  const idleTimerRef = useRef(null);
  const typingProcessRef = useRef(null);
  const sessionId = useMemo(() => generateSessionId(), []);
  
  const { makeRequest, isLoading, error } = useApiCall();

  // Enhanced message management with emotional context
  const addMessage = useCallback((text, sender, personality = null, sentiment = null) => {
    if (!text || typeof text !== 'string' || text.trim() === '') {
      console.warn("⚠️ Attempted to add empty/invalid message, skipping:", text);
      return;
    }

    const cleanText = text.trim();
    if (cleanText.length === 0) {
      console.warn("⚠️ Message became empty after trimming, skipping");
      return;
    }

    const newMessage = {
      id: Date.now() + Math.random(),
      sender,
      text: cleanText,
      timestamp: Date.now(),
      personality,
      sentiment
    };
    
    console.log("✅ Adding message with emotional context:", newMessage);
    
    setMessages(prevMessages => {
      const newMessages = [...prevMessages, newMessage];
      return newMessages.length > CONSTANTS.MAX_MESSAGES 
        ? newMessages.slice(-CONSTANTS.MAX_MESSAGES) 
        : newMessages;
    });
  }, []);

  // God-Tier initialization with emotional intelligence
  useEffect(() => {
    const initializeChat = async () => {
      console.log("🚀 Initializing God-Tier emotional chat system...");
      setConnectionStatus('connecting');
      
      try {
        const response = await makeRequest(CONSTANTS.API_ENDPOINTS.ENTRY, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            session_id: sessionId,
            request_type: 'god_tier_entry',
            emotional_context: true,
            user_agent: navigator.userAgent,
            timestamp: Date.now()
          })
        });
        
        const { 
          reply, 
          delay = 1000, 
          bond_score = 0, 
          is_new_user = true, 
          user_name = null,
          personality = CONSTANTS.PERSONALITY_LAYERS.PLAYFUL,
          sentiment_analysis = { primary: 'neutral', intensity: 0 }
        } = response;
        
        // Update user profile with emotional intelligence data
        setUserProfile({
          bondScore: bond_score,
          isNewUser: is_new_user,
          userName: user_name,
          conversationHistory: [],
          emotionalPattern: {}
        });
        
        setCurrentPersonality(personality);
        setCurrentSentiment(sentiment_analysis);
        
        setOnline(true);
        setConnectionStatus('online');
        
        setTimeout(() => {
          simulateBonnieTyping(reply, personality, sentiment_analysis);
        }, delay);
        
      } catch (err) {
        console.error('❌ Failed to initialize chat:', err);
        
        // Fallback with basic emotional intelligence
        const fallbackPersonality = CONSTANTS.PERSONALITY_LAYERS.PLAYFUL;
        const fallbackSentiment = { primary: 'neutral', intensity: 0 };
        
        setCurrentPersonality(fallbackPersonality);
        setCurrentSentiment(fallbackSentiment);
        setOnline(true);
        setConnectionStatus('online');
        
        const fallbackGreeting = "Well, look who's here... let's have some fun, shall we? 😘";
        setTimeout(() => {
          simulateBonnieTyping(fallbackGreeting, fallbackPersonality, fallbackSentiment);
        }, 1000);
      }
    };

    initializeChat();
  }, [sessionId, makeRequest]);

  // God-Tier typing simulation with full emotional intelligence
  const simulateBonnieTyping = useCallback((raw, personality, sentiment) => {
    console.log("💬 God-Tier typing simulation:", { raw, personality, sentiment });
    
    if (!online) return;

    if (typingProcessRef.current) {
      clearTimeout(typingProcessRef.current);
      typingProcessRef.current = null;
    }

    if (!raw || typeof raw !== 'string' || raw.trim() === '') {
      console.warn("⚠️ Invalid message:", raw);
      setBusy(false);
      return;
    }

    // Enhanced parsing with emotional intelligence
    const parts = parseMessageParts(raw, personality, sentiment, userProfile.bondScore);
    
    const validParts = parts.filter(part => part.text && part.text.trim() !== '');
    
    if (validParts.length === 0) {
      console.warn("⚠️ No valid parts found");
      setBusy(false);
      return;
    }

    console.log(`🚀 Processing ${validParts.length} emotionally intelligent parts:`, validParts);

    let currentIndex = 0;
    const processNextPart = async () => {
      if (currentIndex >= validParts.length) {
        console.log("✅ Completed God-Tier typing simulation");
        setBusy(false);
        setTyping(false);
        typingProcessRef.current = null;
        return;
      }

      const part = validParts[currentIndex];
      
      if (!part || !part.text || part.text.trim() === '') {
        currentIndex++;
        typingProcessRef.current = setTimeout(processNextPart, 100);
        return;
      }

      console.log(`✅ Processing emotional part ${currentIndex + 1}/${validParts.length}:`, part);
      
      // Emotional pause
      await sleep(part.pause);
      
      // Show typing with personality
      setTyping(true);
      setCurrentPersonality(part.personality);
      
      // Emotional typing speed
      const typingTime = part.text.length * (CONSTANTS.TYPING_SPEEDS[part.speed] || CONSTANTS.TYPING_SPEEDS.normal);
      await sleep(typingTime);
      
      setTyping(false);
      
      // Add message with emotional context
      addMessage(part.text, 'bonnie', part.personality, part.sentiment);
      
      currentIndex++;
      typingProcessRef.current = setTimeout(processNextPart, 400);
    };

    setBusy(true);
    processNextPart();
  }, [online, addMessage, userProfile.bondScore]);

  // God-Tier send function with real-time emotional analysis
  const handleSend = useCallback(async (text) => {
    if (!text?.trim()) return;
    
    const messageText = text.trim();
    setInput('');
    setBusy(true);
    setHasFiredIdleMessage(false);
    
    // Real-time sentiment analysis
    const userSentiment = analyzeSentiment(messageText);
    console.log("🧠 User sentiment analysis:", userSentiment);
    
    // Dynamic personality selection
    const adaptedPersonality = selectPersonality(userProfile.bondScore, userSentiment, userProfile.conversationHistory);
    console.log("🎭 Adapted personality:", adaptedPersonality);
    
    setCurrentPersonality(adaptedPersonality);
    setCurrentSentiment(userSentiment);
    
    await addMessage(messageText, 'user');
    
    if (!online) {
      setBusy(false);
      const fallbackMessage = "I'm having connection issues, but I'm still here for you 💕";
      setTimeout(() => {
        simulateBonnieTyping(fallbackMessage, adaptedPersonality, userSentiment);
      }, 1000);
      return;
    }
    
    try {
      const response = await makeRequest(CONSTANTS.API_ENDPOINTS.CHAT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          session_id: sessionId, 
          message: messageText,
          bond_score: userProfile.bondScore,
          user_sentiment: userSentiment,
          adapted_personality: adaptedPersonality,
          conversation_history: userProfile.conversationHistory.slice(-5), // Last 5 messages
          timestamp: Date.now()
        })
      });
      
      // Update user profile with new data
      if (response.bond_score !== undefined) {
        setUserProfile(prev => ({ 
          ...prev, 
          bondScore: response.bond_score,
          conversationHistory: [...prev.conversationHistory, { text: messageText, sentiment: userSentiment }].slice(-10)
        }));
      }
      
      // Get Bonnie's emotional response
      const bonniePersonality = response.personality || adaptedPersonality;
      const bonnieSentiment = response.sentiment_analysis || userSentiment;
      
      simulateBonnieTyping(response.reply, bonniePersonality, bonnieSentiment);
      
    } catch (err) {
      console.error('Failed to send message:', err);
      setBusy(false);
      simulateBonnieTyping("Oops… I'm having some technical difficulties, but I'm still here! 💔", adaptedPersonality, userSentiment);
    }
  }, [sessionId, makeRequest, online, simulateBonnieTyping, addMessage, userProfile]);

  // Enhanced idle timer with emotional intelligence
  useEffect(() => {
    const resetIdleTimer = () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
      
      if (messages.length === 0 && !hasFiredIdleMessage && online) {
        idleTimerRef.current = setTimeout(() => {
          const emotionalIdleMessages = {
            [CONSTANTS.PERSONALITY_LAYERS.PASSIONATE]: [
              "I'm waiting for you to say something... anything 💖",
              "Don't keep me in suspense, darling 😍"
            ],
            [CONSTANTS.PERSONALITY_LAYERS.GENTLE]: [
              "Take your time... I'm here whenever you're ready 🥰",
              "No pressure, but I'd love to hear your thoughts 💕"
            ],
            [CONSTANTS.PERSONALITY_LAYERS.TEASING]: [
              "Cat got your tongue? 😏",
              "I'm starting to think you're shy... how cute 😉"
            ],
            [CONSTANTS.PERSONALITY_LAYERS.PLAYFUL]: [
              "Still deciding what to say? 😘",
              "Don't leave me hanging here! 🤪"
            ]
          };
          
          const messages = emotionalIdleMessages[currentPersonality] || emotionalIdleMessages[CONSTANTS.PERSONALITY_LAYERS.PLAYFUL];
          const randomMessage = messages[Math.floor(Math.random() * messages.length)];
          
          simulateBonnieTyping(randomMessage, currentPersonality, currentSentiment);
          setHasFiredIdleMessage(true);
        }, CONSTANTS.IDLE_TIMEOUT);
      }
    };

    resetIdleTimer();
    return () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, [messages.length, hasFiredIdleMessage, online, currentPersonality, currentSentiment, simulateBonnieTyping]);

  // Keyboard event handler
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  }, [input, handleSend]);

  // Auto-scroll to bottom
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  // Memoized styles
  const containerStyle = useMemo(() => ({
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    height: '100dvh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    backgroundColor: '#fafafa'
  }), []);

  const headerStyle = useMemo(() => ({
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    padding: 12,
    borderBottom: '1px solid #eee',
    backgroundColor: '#fff'
  }), []);

  const messagesContainerStyle = useMemo(() => ({
    flex: 1,
    overflowY: 'auto',
    padding: 12,
    display: 'flex',
    flexDirection: 'column'
  }), []);

  const inputContainerStyle = useMemo(() => ({
    flexShrink: 0,
    display: 'flex',
    gap: 8,
    padding: 12,
    borderTop: '1px solid #eee',
    backgroundColor: '#fff'
  }), []);

  // Dynamic subtitle based on personality and bond
  const getPersonalitySubtitle = () => {
    const personalitySubtitles = {
      [CONSTANTS.PERSONALITY_LAYERS.PASSIONATE]: "Feeling the connection deeply 💖",
      [CONSTANTS.PERSONALITY_LAYERS.GENTLE]: "Here with gentle warmth 🥰",
      [CONSTANTS.PERSONALITY_LAYERS.SUPPORTIVE]: "Your caring companion 💜",
      [CONSTANTS.PERSONALITY_LAYERS.FLIRTATIOUS]: "Feeling playfully flirty 😘",
      [CONSTANTS.PERSONALITY_LAYERS.TEASING]: "In a teasing mood 😏",
      [CONSTANTS.PERSONALITY_LAYERS.PLAYFUL]: "Ready for fun and games 😊"
    };
    
    return personalitySubtitles[currentPersonality] || "Flirty. Fun. Dangerously charming.";
  };

  return (
    <div style={containerStyle}>
      {/* Enhanced Header with Personality Display */}
      <header style={headerStyle}>
        <img 
          src="https://static.wixstatic.com/media/6f5121_df2de6be1e444b0cb2df5d4bd9d49b21~mv2.png" 
          style={{ 
            width: 56, 
            height: 56, 
            borderRadius: 28, 
            marginRight: 12, 
            border: `2px solid ${CONSTANTS.COLORS.primary}` 
          }} 
          alt="Bonnie's profile picture" 
        />
        <div style={{ flex: 1 }}>
          <div style={{ color: CONSTANTS.COLORS.primary, fontSize: 20, fontWeight: 600 }}>
            Bonnie Blue
          </div>
          <div style={{ color: '#555', fontSize: 14 }}>
            {getPersonalitySubtitle()}
          </div>
          <a 
            href="https://x.com/trainmybonnie" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ 
              fontSize: 12, 
              color: CONSTANTS.COLORS.primary, 
              textDecoration: 'none' 
            }}
          >
            💋 Follow me on X
          </a>
        </div>
        <div style={{ 
          fontWeight: 500, 
          color: online ? CONSTANTS.COLORS.online : CONSTANTS.COLORS.offline, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 4 
        }}>
          {connectionStatus === 'connecting' ? (
            <>
              <span>🔄</span>
              <span>Connecting...</span>
            </>
          ) : online ? (
            <>
              <span style={{ animation: 'pulseHeart 1.2s infinite' }}>💚</span>
              <span>Online</span>
            </>
          ) : (
            <>💤 Offline</>
          )}
        </div>
      </header>

      {/* Messages with Enhanced Emotional Context */}
      <main style={messagesContainerStyle} role="log" aria-label="Chat messages">
        {messages.map((message) => (
          <Message 
            key={message.id} 
            message={message} 
            isUser={message.sender === 'user'} 
          />
        ))}
        {typing && online && <TypingIndicator personality={currentPersonality} sentiment={currentSentiment.primary} />}
        {error && (
          <div style={{ 
            color: '#d32f2f', 
            fontSize: 12, 
            textAlign: 'center', 
            padding: 8,
            backgroundColor: '#ffebee',
            borderRadius: 4,
            margin: '4px 0'
          }}>
            Connection error: {error}
          </div>
        )}
        <div ref={endRef} />
      </main>

      {/* Enhanced Input with Emotional Placeholders */}
      <footer style={inputContainerStyle}>
        <input
          style={{ 
            flex: 1, 
            padding: 12, 
            borderRadius: 30, 
            border: '1px solid #ccc', 
            fontSize: 16,
            outline: 'none',
            transition: 'border-color 0.2s',
            opacity: busy ? 0.7 : 1
          }}
          value={input}
          placeholder={online ? 
            (userProfile.userName ? `Tell me more, ${userProfile.userName}...` : "Share your thoughts with me...") : 
            "Type something… (offline mode)"
          }
          disabled={busy}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Type your message"
        />
        <button
          style={{ 
            padding: '0 16px', 
            borderRadius: 30, 
            background: (busy || !input.trim()) ? '#ccc' : CONSTANTS.COLORS.primary, 
            color: '#fff', 
            border: 'none', 
            fontSize: 16, 
            cursor: (busy || !input.trim()) ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s'
          }}
          disabled={busy || !input.trim()}
          onClick={() => handleSend(input)}
          aria-label="Send message"
        >
          {busy ? '...' : 'Send'}
        </button>
      </footer>
    </div>
  );
}

// Enhanced CSS with personality-based animations
const styles = `
@keyframes bounce {
  0%, 100% { 
    transform: translateY(0); 
    opacity: 0.4; 
  }
  50% { 
    transform: translateY(-6px); 
    opacity: 1; 
  }
}

@keyframes pulseHeart {
  0% { 
    transform: scale(1); 
    opacity: 1; 
  }
  50% { 
    transform: scale(1.15); 
    opacity: 0.8; 
  }
  100% { 
    transform: scale(1); 
    opacity: 1; 
  }
}

/* Enhanced focus styles */
input:focus {
  border-color: ${CONSTANTS.COLORS.primary} !important;
  box-shadow: 0 0 0 2px ${CONSTANTS.COLORS.primary}33;
}

button:focus {
  outline: 2px solid ${CONSTANTS.COLORS.primary};
  outline-offset: 2px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .chat-container {
    padding: 8px;
  }
  
  .message {
    max-width: 85%;
  }
}
`;

// Inject styles only once
if (!document.getElementById('bonnie-chat-styles')) {
  const styleElement = document.createElement('style');
  styleElement.id = 'bonnie-chat-styles';
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}
🎯 God-Tier Features Implemented:
1. Real-Time Sentiment Analysis
Analyzes user messages for emotional tone
Detects flirty, sad, playful, intimate, teasing patterns
Adapts Bonnie's personality instantly based on user emotion
2. Dynamic Personality System
This is an excellent upgrade plan! You're absolutely right that we need to move beyond simple bond score thresholds to create truly dynamic, emotionally intelligent conversations. Let me implement this God-Tier system with real-time emotional adaptation, intelligent emoji placement, and sentiment-driven responses.

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';

// Enhanced Constants with Emotional Intelligence
const CONSTANTS = {
  API_ENDPOINTS: {
    CHAT: 'https://bonnie-backend-server.onrender.com/bonnie-chat',
    ENTRY: 'https://bonnie-backend-server.onrender.com/bonnie-entry'
  },
  TYPING_SPEEDS: { slow: 120, normal: 64, fast: 35 },
  IDLE_TIMEOUT: 30000,
  MAX_MESSAGES: 100,
  COLORS: {
    primary: '#e91e63',
    online: '#28a745',
    offline: '#aaa',
    background: '#fff0f6',
    border: '#ffe6f0'
  },
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  
  // God-Tier Emotional Intelligence System
  PERSONALITY_LAYERS: {
    FLIRTATIOUS: 'flirtatious',
    SUPPORTIVE: 'supportive', 
    TEASING: 'teasing',
    GENTLE: 'gentle',
    PASSIONATE: 'passionate',
    PLAYFUL: 'playful'
  },
  
  SENTIMENT_TYPES: {
    FLIRTY: 'flirty',
    SAD: 'sad',
    HAPPY: 'happy',
    INTIMATE: 'intimate',
    PLAYFUL: 'playful',
    SERIOUS: 'serious',
    TEASING: 'teasing',
    VULNERABLE: 'vulnerable'
  },
  
  EMOJI_CONTEXTS: {
    FLIRTY: ['😘', '😏', '😉', '💋', '🔥'],
    ROMANTIC: ['💖', '💕', '😍', '🥰', '💘'],
    PLAYFUL: ['😜', '😋', '🤪', '😄', '😊'],
    SUPPORTIVE: ['🥺', '💌', '🤗', '💜', '✨'],
    TEASING: ['😏', '😈', '🙄', '😌', '🤭'],
    PASSIONATE: ['🔥', '💫', '😍', '💖', '🌹'],
    GENTLE: ['🥰', '💕', '🌸', '💫', '🦋']
  }
};

// God-Tier Sentiment Analysis System
const analyzeSentiment = (text) => {
  const lowerText = text.toLowerCase();
  
  // Flirty indicators
  const flirtyWords = ['sexy', 'hot', 'beautiful', 'gorgeous', 'cute', 'kiss', 'love', 'baby', 'darling', 'honey'];
  const flirtyScore = flirtyWords.filter(word => lowerText.includes(word)).length;
  
  // Intimate indicators
  const intimateWords = ['miss', 'need', 'want', 'desire', 'close', 'together', 'feel', 'heart'];
  const intimateScore = intimateWords.filter(word => lowerText.includes(word)).length;
  
  // Sad/vulnerable indicators
  const sadWords = ['sad', 'hurt', 'lonely', 'upset', 'tired', 'stressed', 'difficult', 'hard'];
  const sadScore = sadWords.filter(word => lowerText.includes(word)).length;
  
  // Playful indicators
  const playfulWords = ['haha', 'lol', 'funny', 'joke', 'silly', 'crazy', 'fun', 'play'];
  const playfulScore = playfulWords.filter(word => lowerText.includes(word)).length;
  
  // Teasing indicators
  const teasingWords = ['maybe', 'perhaps', 'guess', 'see', 'hmm', 'interesting', 'really'];
  const teasingScore = teasingWords.filter(word => lowerText.includes(word)).length;
  
  // Determine primary sentiment
  const scores = {
    [CONSTANTS.SENTIMENT_TYPES.FLIRTY]: flirtyScore * 2,
    [CONSTANTS.SENTIMENT_TYPES.INTIMATE]: intimateScore * 2,
    [CONSTANTS.SENTIMENT_TYPES.SAD]: sadScore * 3,
    [CONSTANTS.SENTIMENT_TYPES.PLAYFUL]: playfulScore,
    [CONSTANTS.SENTIMENT_TYPES.TEASING]: teasingScore,
    [CONSTANTS.SENTIMENT_TYPES.HAPPY]: (text.includes('!') ? 1 : 0) + playfulScore,
    [CONSTANTS.SENTIMENT_TYPES.SERIOUS]: lowerText.length > 100 ? 1 : 0,
    [CONSTANTS.SENTIMENT_TYPES.VULNERABLE]: sadScore * 2
  };
  
  const primarySentiment = Object.keys(scores).reduce((a, b) => 
    scores[a] > scores[b] ? a : b
  );
  
  return {
    primary: primarySentiment,
    intensity: Math.max(...Object.values(scores)),
    scores
  };
};

// Dynamic Personality Selection Based on Context
const selectPersonality = (bondScore, userSentiment, conversationHistory) => {
  const { primary, intensity } = userSentiment;
  
  // High bond users get more intimate personalities
  if (bondScore >= 70) {
    if (primary === CONSTANTS.SENTIMENT_TYPES.FLIRTY) return CONSTANTS.PERSONALITY_LAYERS.PASSIONATE;
    if (primary === CONSTANTS.SENTIMENT_TYPES.INTIMATE) return CONSTANTS.PERSONALITY_LAYERS.GENTLE;
    if (primary === CONSTANTS.SENTIMENT_TYPES.SAD) return CONSTANTS.PERSONALITY_LAYERS.SUPPORTIVE;
    return CONSTANTS.PERSONALITY_LAYERS.PASSIONATE;
  }
  
  // Medium bond users get adaptive personalities
  if (bondScore >= 40) {
    if (primary === CONSTANTS.SENTIMENT_TYPES.FLIRTY) return CONSTANTS.PERSONALITY_LAYERS.FLIRTATIOUS;
    if (primary === CONSTANTS.SENTIMENT_TYPES.PLAYFUL) return CONSTANTS.PERSONALITY_LAYERS.PLAYFUL;
    if (primary === CONSTANTS.SENTIMENT_TYPES.SAD) return CONSTANTS.PERSONALITY_LAYERS.SUPPORTIVE;
    if (primary === CONSTANTS.SENTIMENT_TYPES.TEASING) return CONSTANTS.PERSONALITY_LAYERS.TEASING;
    return CONSTANTS.PERSONALITY_LAYERS.FLIRTATIOUS;
  }
  
  // Low bond users get lighter personalities
  if (primary === CONSTANTS.SENTIMENT_TYPES.SAD) return CONSTANTS.PERSONALITY_LAYERS.SUPPORTIVE;
  if (primary === CONSTANTS.SENTIMENT_TYPES.PLAYFUL) return CONSTANTS.PERSONALITY_LAYERS.PLAYFUL;
  if (primary === CONSTANTS.SENTIMENT_TYPES.FLIRTY) return CONSTANTS.PERSONALITY_LAYERS.TEASING;
  return CONSTANTS.PERSONALITY_LAYERS.PLAYFUL;
};

// Intelligent Emoji Selection System
const selectContextualEmoji = (personality, sentiment, bondScore, messageContent) => {
  const emojiPool = CONSTANTS.EMOJI_CONTEXTS[personality.toUpperCase()] || CONSTANTS.EMOJI_CONTEXTS.PLAYFUL;
  
  // Emoji frequency based on bond score and emotional intensity
  const baseFrequency = Math.min(bondScore / 20, 4); // 0-4 emojis max
  const sentimentBoost = sentiment.intensity > 2 ? 1 : 0;
  const emojiCount = Math.floor(baseFrequency + sentimentBoost);
  
  if (emojiCount === 0) return '';
  
  // Select contextually appropriate emojis
  const selectedEmojis = [];
  for (let i = 0; i < emojiCount; i++) {
    const randomEmoji = emojiPool[Math.floor(Math.random() * emojiPool.length)];
    if (!selectedEmojis.includes(randomEmoji)) {
      selectedEmojis.push(randomEmoji);
    }
  }
  
  return selectedEmojis.join(' ');
};

// Dynamic Pause Calculation Based on Emotional Context
const calculateEmotionalPause = (personality, sentiment, bondScore, messageLength) => {
  let basePause = 1000;
  
  // Personality-based pause modifiers
  const personalityModifiers = {
    [CONSTANTS.PERSONALITY_LAYERS.PASSIONATE]: 1.5,
    [CONSTANTS.PERSONALITY_LAYERS.GENTLE]: 1.8,
    [CONSTANTS.PERSONALITY_LAYERS.SUPPORTIVE]: 1.6,
    [CONSTANTS.PERSONALITY_LAYERS.FLIRTATIOUS]: 1.2,
    [CONSTANTS.PERSONALITY_LAYERS.TEASING]: 0.8,
    [CONSTANTS.PERSONALITY_LAYERS.PLAYFUL]: 0.9
  };
  
  // Sentiment-based pause modifiers
  const sentimentModifiers = {
    [CONSTANTS.SENTIMENT_TYPES.INTIMATE]: 1.7,
    [CONSTANTS.SENTIMENT_TYPES.VULNERABLE]: 2.0,
    [CONSTANTS.SENTIMENT_TYPES.FLIRTY]: 1.3,
    [CONSTANTS.SENTIMENT_TYPES.PLAYFUL]: 0.7,
    [CONSTANTS.SENTIMENT_TYPES.TEASING]: 0.8,
    [CONSTANTS.SENTIMENT_TYPES.SERIOUS]: 1.5
  };
  
  // Bond score influence (higher bond = longer pauses for intimacy)
  const bondModifier = 1 + (bondScore / 200); // 1.0 to 1.5x
  
  // Message length influence
  const lengthModifier = Math.min(messageLength / 50, 2); // Longer messages = longer pauses
  
  const finalPause = basePause * 
    (personalityModifiers[personality] || 1) * 
    (sentimentModifiers[sentiment.primary] || 1) * 
    bondModifier * 
    lengthModifier;
  
  return Math.max(500, Math.min(finalPause, 4000)); // 0.5s to 4s range
};

// Enhanced Message Parsing with Emotional Intelligence
const parseMessageParts = (raw, personality, sentiment, bondScore) => {
  console.log("🔍 Parsing with emotional context:", { personality, sentiment, bondScore });
  
  const segments = raw.split(/<EOM(?:::(.*?))?>/).filter(Boolean);
  const finalParts = [];
  let currentMeta = { pause: 1000, speed: 'normal', emotion: 'neutral' };
  
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i].trim();
    
    // Check for metadata
    const metaMatch = segment.match(/(?:pause=(\d+))?(?:.*?speed=(\w+))?(?:.*?emotion=(\w+))?/);
    const hasMetadata = metaMatch && (metaMatch[1] || metaMatch[2] || metaMatch[3]);
    
    if (hasMetadata) {
      if (metaMatch[1]) currentMeta.pause = parseInt(metaMatch[1]);
      if (metaMatch[2]) currentMeta.speed = metaMatch[2];
      if (metaMatch[3]) currentMeta.emotion = metaMatch[3];
    } else if (segment.length > 0) {
      // Enhanced: Add contextual emojis to text
      const contextualEmoji = selectContextualEmoji(personality, sentiment, bondScore, segment);
      const enhancedText = contextualEmoji ? `${segment} ${contextualEmoji}` : segment;
      
      // Enhanced: Calculate emotional pause
      const emotionalPause = calculateEmotionalPause(personality, sentiment, bondScore, segment.length);
      
      finalParts.push({
        text: enhancedText,
        pause: emotionalPause,
        speed: currentMeta.speed,
        emotion: currentMeta.emotion || personality,
        personality,
        sentiment: sentiment.primary
      });
      
      // Reset metadata
      currentMeta = { pause: 1000, speed: 'normal', emotion: 'neutral' };
    }
  }
  
  return finalParts.filter(part => part.text && part.text.trim() !== '');
};

// Utility functions
const generateSessionId = () => {
  let id = localStorage.getItem('bonnie_session');
  if (!id) {
    id = 'guest_' + Math.random().toString(36).slice(2) + '_' + Date.now();
    localStorage.setItem('bonnie_session', id);
  }
  return id;
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Custom hook for API calls with retry logic
const useApiCall = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const makeRequest = useCallback(async (url, options, retries = CONSTANTS.RETRY_ATTEMPTS) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setIsLoading(false);
      return data;
    } catch (err) {
      if (retries > 0) {
        await sleep(CONSTANTS.RETRY_DELAY);
        return makeRequest(url, options, retries - 1);
      }
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  }, []);

  return { makeRequest, isLoading, error };
};

// Enhanced Message component with emotional styling
const Message = React.memo(({ message, isUser }) => {
  const messageStyle = useMemo(() => {
    const baseStyle = {
      maxWidth: '75%',
      padding: 12,
      borderRadius: 12,
      margin: '6px 0',
      fontSize: 14,
      lineHeight: 1.4,
      wordBreak: 'break-word',
      transition: 'all 0.3s ease'
    };

    if (isUser) {
      return {
        ...baseStyle,
        background: `linear-gradient(135deg, #ff83a0, ${CONSTANTS.COLORS.primary})`,
        color: '#fff',
        alignSelf: 'flex-end',
        marginLeft: 'auto'
      };
    }

    // Enhanced: Personality-based styling for Bonnie's messages
    const personalityColors = {
      [CONSTANTS.PERSONALITY_LAYERS.PASSIONATE]: 'linear-gradient(135deg, #ffb3d1, #ff80bf)',
      [CONSTANTS.PERSONALITY_LAYERS.GENTLE]: 'linear-gradient(135deg, #e6f3ff, #cce7ff)',
      [CONSTANTS.PERSONALITY_LAYERS.SUPPORTIVE]: 'linear-gradient(135deg, #f0e6ff, #e6ccff)',
      [CONSTANTS.PERSONALITY_LAYERS.FLIRTATIOUS]: 'linear-gradient(135deg, #ffe6f0, #ffccdd)',
      [CONSTANTS.PERSONALITY_LAYERS.TEASING]: 'linear-gradient(135deg, #fff0e6, #ffe6cc)',
      [CONSTANTS.PERSONALITY_LAYERS.PLAYFUL]: 'linear-gradient(135deg, #f0fff0, #e6ffe6)'
    };

    const personality = message.personality || CONSTANTS.PERSONALITY_LAYERS.PLAYFUL;
    
    return {
      ...baseStyle,
      background: personalityColors[personality] || CONSTANTS.COLORS.background,
      border: `1px solid ${CONSTANTS.COLORS.border}`,
      color: '#333',
      alignSelf: 'flex-start'
    };
  }, [isUser, message.personality]);

  return (
    <div style={messageStyle} role="listitem">
      {message.text}
      {message.timestamp && (
        <div style={{ fontSize: 10, opacity: 0.7, marginTop: 4 }}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
});

// Enhanced Typing indicator with personality-based colors
const TypingIndicator = React.memo(({ personality = 'playful', sentiment = 'neutral' }) => {
  const personalityColors = {
    [CONSTANTS.PERSONALITY_LAYERS.PASSIONATE]: '#dc143c',
    [CONSTANTS.PERSONALITY_LAYERS.GENTLE]: '#87ceeb',
    [CONSTANTS.PERSONALITY_LAYERS.SUPPORTIVE]: '#dda0dd',
    [CONSTANTS.PERSONALITY_LAYERS.FLIRTATIOUS]: '#ff69b4',
    [CONSTANTS.PERSONALITY_LAYERS.TEASING]: '#ffa500',
    [CONSTANTS.PERSONALITY_LAYERS.PLAYFUL]: '#32cd32'
  };

  const color = personalityColors[personality] || CONSTANTS.COLORS.primary;

  return (
    <div style={{ display: 'flex', gap: 4, margin: '8px 0' }} role="status" aria-label="Bonnie is typing">
      {[0, 0.2, 0.4].map((delay, index) => (
        <div
          key={index}
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            background: color,
            animation: `bounce 1s infinite ease-in-out`,
            animationDelay: `${delay}s`
          }}
        />
      ))}
    </div>
  );
});

export default function BonnieChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [typing, setTyping] = useState(false);
  const [currentPersonality, setCurrentPersonality] = useState(CONSTANTS.PERSONALITY_LAYERS.PLAYFUL);
  const [currentSentiment, setCurrentSentiment] = useState({ primary: 'neutral', intensity: 0 });
  const [online, setOnline] = useState(false);
  const [pendingMessage, setPendingMessage] = useState(null);
  const [hasFiredIdleMessage, setHasFiredIdleMessage] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [userProfile, setUserProfile] = useState({ 
    bondScore: 0, 
    isNewUser: true, 
    userName: null,
    conversationHistory: [],
    emotionalPattern: {}
  });
  
  const endRef = useRef(null);
  const idleTimerRef = useRef(null);
  const typingProcessRef = useRef(null);
  const sessionId = useMemo(() => generateSessionId(), []);
  
  const { makeRequest, isLoading, error } = useApiCall();

  // Enhanced message management with emotional context
  const addMessage = useCallback((text, sender, personality = null, sentiment = null) => {
    if (!text || typeof text !== 'string' || text.trim() === '') {
      console.warn("⚠️ Attempted to add empty/invalid message, skipping:", text);
      return;
    }

    const cleanText = text.trim();
    if (cleanText.length === 0) {
      console.warn("⚠️ Message became empty after trimming, skipping");
      return;
    }

    const newMessage = {
      id: Date.now() + Math.random(),
      sender,
      text: cleanText,
      timestamp: Date.now(),
      personality,
      sentiment
    };
    
    console.log("✅ Adding message with emotional context:", newMessage);
    
    setMessages(prevMessages => {
      const newMessages = [...prevMessages, newMessage];
      return newMessages.length > CONSTANTS.MAX_MESSAGES 
        ? newMessages.slice(-CONSTANTS.MAX_MESSAGES) 
        : newMessages;
    });
  }, []);

  // God-Tier initialization with emotional intelligence
  useEffect(() => {
    const initializeChat = async () => {
      console.log("🚀 Initializing God-Tier emotional chat system...");
      setConnectionStatus('connecting');
      
      try {
        const response = await makeRequest(CONSTANTS.API_ENDPOINTS.ENTRY, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            session_id: sessionId,
            request_type: 'god_tier_entry',
            emotional_context: true,
            user_agent: navigator.userAgent,
            timestamp: Date.now()
          })
        });
        
        const { 
          reply, 
          delay = 1000, 
          bond_score = 0, 
          is_new_user = true, 
          user_name = null,
          personality = CONSTANTS.PERSONALITY_LAYERS.PLAYFUL,
          sentiment_analysis = { primary: 'neutral', intensity: 0 }
        } = response;
        
        // Update user profile with emotional intelligence data
        setUserProfile({
          bondScore: bond_score,
          isNewUser: is_new_user,
          userName: user_name,
          conversationHistory: [],
          emotionalPattern: {}
        });
        
        setCurrentPersonality(personality);
        setCurrentSentiment(sentiment_analysis);
        
        setOnline(true);
        setConnectionStatus('online');
        
        setTimeout(() => {
          simulateBonnieTyping(reply, personality, sentiment_analysis);
        }, delay);
        
      } catch (err) {
        console.error('❌ Failed to initialize chat:', err);
        
        // Fallback with basic emotional intelligence
        const fallbackPersonality = CONSTANTS.PERSONALITY_LAYERS.PLAYFUL;
        const fallbackSentiment = { primary: 'neutral', intensity: 0 };
        
        setCurrentPersonality(fallbackPersonality);
        setCurrentSentiment(fallbackSentiment);
        setOnline(true);
        setConnectionStatus('online');
        
        const fallbackGreeting = "Well, look who's here... let's have some fun, shall we? 😘";
        setTimeout(() => {
          simulateBonnieTyping(fallbackGreeting, fallbackPersonality, fallbackSentiment);
        }, 1000);
      }
    };

    initializeChat();
  }, [sessionId, makeRequest]);

  // God-Tier typing simulation with full emotional intelligence
  const simulateBonnieTyping = useCallback((raw, personality, sentiment) => {
    console.log("💬 God-Tier typing simulation:", { raw, personality, sentiment });
    
    if (!online) return;

    if (typingProcessRef.current) {
      clearTimeout(typingProcessRef.current);
      typingProcessRef.current = null;
    }

    if (!raw || typeof raw !== 'string' || raw.trim() === '') {
      console.warn("⚠️ Invalid message:", raw);
      setBusy(false);
      return;
    }

    // Enhanced parsing with emotional intelligence
    const parts = parseMessageParts(raw, personality, sentiment, userProfile.bondScore);
    
    const validParts = parts.filter(part => part.text && part.text.trim() !== '');
    
    if (validParts.length === 0) {
      console.warn("⚠️ No valid parts found");
      setBusy(false);
      return;
    }

    console.log(`🚀 Processing ${validParts.length} emotionally intelligent parts:`, validParts);

    let currentIndex = 0;
    const processNextPart = async () => {
      if (currentIndex >= validParts.length) {
        console.log("✅ Completed God-Tier typing simulation");
        setBusy(false);
        setTyping(false);
        typingProcessRef.current = null;
        return;
      }

      const part = validParts[currentIndex];
      
      if (!part || !part.text || part.text.trim() === '') {
        currentIndex++;
        typingProcessRef.current = setTimeout(processNextPart, 100);
        return;
      }

      console.log(`✅ Processing emotional part ${currentIndex + 1}/${validParts.length}:`, part);
      
      // Emotional pause
      await sleep(part.pause);
      
      // Show typing with personality
      setTyping(true);
      setCurrentPersonality(part.personality);
      
      // Emotional typing speed
      const typingTime = part.text.length * (CONSTANTS.TYPING_SPEEDS[part.speed] || CONSTANTS.TYPING_SPEEDS.normal);
      await sleep(typingTime);
      
      setTyping(false);
      
      // Add message with emotional context
      addMessage(part.text, 'bonnie', part.personality, part.sentiment);
      
      currentIndex++;
      typingProcessRef.current = setTimeout(processNextPart, 400);
    };

    setBusy(true);
    processNextPart();
  }, [online, addMessage, userProfile.bondScore]);

  // God-Tier send function with real-time emotional analysis
  const handleSend = useCallback(async (text) => {
    if (!text?.trim()) return;
    
    const messageText = text.trim();
    setInput('');
    setBusy(true);
    setHasFiredIdleMessage(false);
    
    // Real-time sentiment analysis
    const userSentiment = analyzeSentiment(messageText);
    console.log("🧠 User sentiment analysis:", userSentiment);
    
    // Dynamic personality selection
    const adaptedPersonality = selectPersonality(userProfile.bondScore, userSentiment, userProfile.conversationHistory);
    console.log("🎭 Adapted personality:", adaptedPersonality);
    
    setCurrentPersonality(adaptedPersonality);
    setCurrentSentiment(userSentiment);
    
    await addMessage(messageText, 'user');
    
    if (!online) {
      setBusy(false);
      const fallbackMessage = "I'm having connection issues, but I'm still here for you 💕";
      setTimeout(() => {
        simulateBonnieTyping(fallbackMessage, adaptedPersonality, userSentiment);
      }, 1000);
      return;
    }
    
    try {
      const response = await makeRequest(CONSTANTS.API_ENDPOINTS.CHAT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          session_id: sessionId, 
          message: messageText,
          bond_score: userProfile.bondScore,
          user_sentiment: userSentiment,
          adapted_personality: adaptedPersonality,
          conversation_history: userProfile.conversationHistory.slice(-5), // Last 5 messages
          timestamp: Date.now()
        })
      });
      
      // Update user profile with new data
      if (response.bond_score !== undefined) {
        setUserProfile(prev => ({ 
          ...prev, 
          bondScore: response.bond_score,
          conversationHistory: [...prev.conversationHistory, { text: messageText, sentiment: userSentiment }].slice(-10)
        }));
      }
      
      // Get Bonnie's emotional response
      const bonniePersonality = response.personality || adaptedPersonality;
      const bonnieSentiment = response.sentiment_analysis || userSentiment;
      
      simulateBonnieTyping(response.reply, bonniePersonality, bonnieSentiment);
      
    } catch (err) {
      console.error('Failed to send message:', err);
      setBusy(false);
      simulateBonnieTyping("Oops… I'm having some technical difficulties, but I'm still here! 💔", adaptedPersonality, userSentiment);
    }
  }, [sessionId, makeRequest, online, simulateBonnieTyping, addMessage, userProfile]);

  // Enhanced idle timer with emotional intelligence
  useEffect(() => {
    const resetIdleTimer = () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
      
      if (messages.length === 0 && !hasFiredIdleMessage && online) {
        idleTimerRef.current = setTimeout(() => {
          const emotionalIdleMessages = {
            [CONSTANTS.PERSONALITY_LAYERS.PASSIONATE]: [
              "I'm waiting for you to say something... anything 💖",
              "Don't keep me in suspense, darling 😍"
            ],
            [CONSTANTS.PERSONALITY_LAYERS.GENTLE]: [
              "Take your time... I'm here whenever you're ready 🥰",
              "No pressure, but I'd love to hear your thoughts 💕"
            ],
            [CONSTANTS.PERSONALITY_LAYERS.TEASING]: [
              "Cat got your tongue? 😏",
              "I'm starting to think you're shy... how cute 😉"
            ],
            [CONSTANTS.PERSONALITY_LAYERS.PLAYFUL]: [
              "Still deciding what to say? 😘",
              "Don't leave me hanging here! 🤪"
            ]
          };
          
          const messages = emotionalIdleMessages[currentPersonality] || emotionalIdleMessages[CONSTANTS.PERSONALITY_LAYERS.PLAYFUL];
          const randomMessage = messages[Math.floor(Math.random() * messages.length)];
          
          simulateBonnieTyping(randomMessage, currentPersonality, currentSentiment);
          setHasFiredIdleMessage(true);
        }, CONSTANTS.IDLE_TIMEOUT);
      }
    };

    resetIdleTimer();
    return () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, [messages.length, hasFiredIdleMessage, online, currentPersonality, currentSentiment, simulateBonnieTyping]);

  // Keyboard event handler
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  }, [input, handleSend]);

  // Auto-scroll to bottom
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  // Memoized styles
  const containerStyle = useMemo(() => ({
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    height: '100dvh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    backgroundColor: '#fafafa'
  }), []);

  const headerStyle = useMemo(() => ({
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    padding: 12,
    borderBottom: '1px solid #eee',
    backgroundColor: '#fff'
  }), []);

  const messagesContainerStyle = useMemo(() => ({
    flex: 1,
    overflowY: 'auto',
    padding: 12,
    display: 'flex',
    flexDirection: 'column'
  }), []);

  const inputContainerStyle = useMemo(() => ({
    flexShrink: 0,
    display: 'flex',
    gap: 8,
    padding: 12,
    borderTop: '1px solid #eee',
    backgroundColor: '#fff'
  }), []);

  // Dynamic subtitle based on personality and bond
  const getPersonalitySubtitle = () => {
    const personalitySubtitles = {
      [CONSTANTS.PERSONALITY_LAYERS.PASSIONATE]: "Feeling the connection deeply 💖",
      [CONSTANTS.PERSONALITY_LAYERS.GENTLE]: "Here with gentle warmth 🥰",
      [CONSTANTS.PERSONALITY_LAYERS.SUPPORTIVE]: "Your caring companion 💜",
      [CONSTANTS.PERSONALITY_LAYERS.FLIRTATIOUS]: "Feeling playfully flirty 😘",
      [CONSTANTS.PERSONALITY_LAYERS.TEASING]: "In a teasing mood 😏",
      [CONSTANTS.PERSONALITY_LAYERS.PLAYFUL]: "Ready for fun and games 😊"
    };
    
    return personalitySubtitles[currentPersonality] || "Flirty. Fun. Dangerously charming.";
  };

  return (
    <div style={containerStyle}>
      {/* Enhanced Header with Personality Display */}
      <header style={headerStyle}>
        <img 
          src="https://static.wixstatic.com/media/6f5121_df2de6be1e444b0cb2df5d4bd9d49b21~mv2.png" 
          style={{ 
            width: 56, 
            height: 56, 
            borderRadius: 28, 
            marginRight: 12, 
            border: `2px solid ${CONSTANTS.COLORS.primary}` 
          }} 
          alt="Bonnie's profile picture" 
        />
        <div style={{ flex: 1 }}>
          <div style={{ color: CONSTANTS.COLORS.primary, fontSize: 20, fontWeight: 600 }}>
            Bonnie Blue
          </div>
          <div style={{ color: '#555', fontSize: 14 }}>
            {getPersonalitySubtitle()}
          </div>
          <a 
            href="https://x.com/trainmybonnie" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ 
              fontSize: 12, 
              color: CONSTANTS.COLORS.primary, 
              textDecoration: 'none' 
            }}
          >
            💋 Follow me on X
          </a>
        </div>
        <div style={{ 
          fontWeight: 500, 
          color: online ? CONSTANTS.COLORS.online : CONSTANTS.COLORS.offline, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 4 
        }}>
          {connectionStatus === 'connecting' ? (
            <>
              <span>🔄</span>
              <span>Connecting...</span>
            </>
          ) : online ? (
            <>
              <span style={{ animation: 'pulseHeart 1.2s infinite' }}>💚</span>
              <span>Online</span>
            </>
          ) : (
            <>💤 Offline</>
          )}
        </div>
      </header>

      {/* Messages with Enhanced Emotional Context */}
      <main style={messagesContainerStyle} role="log" aria-label="Chat messages">
        {messages.map((message) => (
          <Message 
            key={message.id} 
            message={message} 
            isUser={message.sender === 'user'} 
          />
        ))}
        {typing && online && <TypingIndicator personality={currentPersonality} sentiment={currentSentiment.primary} />}
        {error && (
          <div style={{ 
            color: '#d32f2f', 
            fontSize: 12, 
            textAlign: 'center', 
            padding: 8,
            backgroundColor: '#ffebee',
            borderRadius: 4,
            margin: '4px 0'
          }}>
            Connection error: {error}
          </div>
        )}
        <div ref={endRef} />
      </main>

      {/* Enhanced Input with Emotional Placeholders */}
      <footer style={inputContainerStyle}>
        <input
          style={{ 
            flex: 1, 
            padding: 12, 
            borderRadius: 30, 
            border: '1px solid #ccc', 
            fontSize: 16,
            outline: 'none',
            transition: 'border-color 0.2s',
            opacity: busy ? 0.7 : 1
          }}
          value={input}
          placeholder={online ? 
            (userProfile.userName ? `Tell me more, ${userProfile.userName}...` : "Share your thoughts with me...") : 
            "Type something… (offline mode)"
          }
          disabled={busy}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Type your message"
        />
        <button
          style={{ 
            padding: '0 16px', 
            borderRadius: 30, 
            background: (busy || !input.trim()) ? '#ccc' : CONSTANTS.COLORS.primary, 
            color: '#fff', 
            border: 'none', 
            fontSize: 16, 
            cursor: (busy || !input.trim()) ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s'
          }}
          disabled={busy || !input.trim()}
          onClick={() => handleSend(input)}
          aria-label="Send message"
        >
          {busy ? '...' : 'Send'}
        </button>
      </footer>
    </div>
  );
}

// Enhanced CSS with personality-based animations
const styles = `
@keyframes bounce {
  0%, 100% { 
    transform: translateY(0); 
    opacity: 0.4; 
  }
  50% { 
    transform: translateY(-6px); 
    opacity: 1; 
  }
}

@keyframes pulseHeart {
  0% { 
    transform: scale(1); 
    opacity: 1; 
  }
  50% { 
    transform: scale(1.15); 
    opacity: 0.8; 
  }
  100% { 
    transform: scale(1); 
    opacity: 1; 
  }
}

/* Enhanced focus styles */
input:focus {
  border-color: ${CONSTANTS.COLORS.primary} !important;
  box-shadow: 0 0 0 2px ${CONSTANTS.COLORS.primary}33;
}

button:focus {
  outline: 2px solid ${CONSTANTS.COLORS.primary};
  outline-offset: 2px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .chat-container {
    padding: 8px;
  }
  
  .message {
    max-width: 85%;
  }
}
`;

// Inject styles only once
if (!document.getElementById('bonnie-chat-styles')) {
  const styleElement = document.createElement('style');
  styleElement.id = 'bonnie-chat-styles';
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}