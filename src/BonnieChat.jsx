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
      
      await sleep(part.pause);
      
      setTyping(true);
      setCurrentPersonality(part.personality);
      
      const typingTime = part.text.length * (CONSTANTS.TYPING_SPEEDS[part.speed] || CONSTANTS.TYPING_SPEEDS.normal);
      await sleep(typingTime);
      
      setTyping(false);
      
      addMessage(part.text, 'bonnie', part.personality, part.sentiment);
      
      currentIndex++;
      typingProcessRef.current = setTimeout(processNextPart, 400);
    };

    setBusy(true);
    processNextPart();
  }, [online, addMessage, userProfile.bondScore]);

  const handleSend = useCallback(async (text) => {
    if (!text?.trim()) return;
    
    const messageText = text.trim();
    setInput('');
    setBusy(true);
    setHasFiredIdleMessage(false);
    
    const userSentiment = analyzeSentiment(messageText);
    console.log("🧠 User sentiment analysis:", userSentiment);
    
    const adaptedPersonality = selectPersonality(userProfile.bondScore, userSentiment, userProfile.conversationHistory);
    console.log("🎭 Adapted personality:", adaptedPersonality);
    
    setCurrentPersonality(adaptedPersonality);
    setCurrentSentiment(userSentiment);
    
    addMessage(messageText, 'user');
    
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
          conversation_history: userProfile.conversationHistory.slice(-5),
          timestamp: Date.now()
        })
      });
      
      if (response.bond_score !== undefined) {
        setUserProfile(prev => ({ 
          ...prev, 
          bondScore: response.bond_score,
          conversationHistory: [...prev.conversationHistory, { text: messageText, sentiment: userSentiment }].slice(-10)
        }));
      }
      
      const bonniePersonality = response.personality || adaptedPersonality;
      const bonnieSentiment = response.sentiment_analysis || userSentiment;
      
      simulateBonnieTyping(response.reply, bonniePersonality, bonnieSentiment);
      
    } catch (err) {
      console.error('Failed to send message:', err);
      setBusy(false);
      simulateBonnieTyping("Oops… I'm having some technical difficulties, but I'm still here! 💔", adaptedPersonality, userSentiment);
    }
  }, [sessionId, makeRequest, online, simulateBonnieTyping, addMessage, userProfile]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <header>
        {/* Header content */}
      </header>
      <main>
        {/* Main chat content */}
      </main>
      <footer>
        {/* Input area */}
      </footer>
    </div>
  );
}
