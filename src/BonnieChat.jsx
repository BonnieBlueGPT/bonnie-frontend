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
    thoughtful: 150,
    excited: 25 
  },
  IDLE_TIMEOUT: 30000,
  MAX_MESSAGES: 100,
  COLORS: {
    primary: '#e91e63',
    online: '#28a745',
    offline: '#aaa',
    background: '#fff0f6',
    border: '#ffe6f0',
    // Emotional color palette
    emotions: {
      flirty: { bg: '#FFE5EC', bubble: '#FFC0CB', gradient: 'linear-gradient(135deg, #FF69B4 0%, #FFB6C1 100%)' },
      serious: { bg: '#F5F5F5', bubble: '#E8E8E8', gradient: 'linear-gradient(135deg, #D3D3D3 0%, #F5F5F5 100%)' },
      playful: { bg: '#FFF9E6', bubble: '#FFEB99', gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' },
      teasing: { bg: '#FFE5E5', bubble: '#FF9999', gradient: 'linear-gradient(135deg, #FF6347 0%, #FF7F50 100%)' },
      intimate: { bg: '#F8E5FF', bubble: '#E6B3FF', gradient: 'linear-gradient(135deg, #DA70D6 0%, #DDA0DD 100%)' },
      supportive: { bg: '#E5F3FF', bubble: '#B3D9FF', gradient: 'linear-gradient(135deg, #87CEEB 0%, #87CEFA 100%)' },
      happy: { bg: '#FFF0F6', bubble: '#FFE6F0', gradient: 'linear-gradient(135deg, #FF1493 0%, #FF69B4 100%)' }
    }
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
    THOUGHTFUL: 'thoughtful',
    MYSTERIOUS: 'mysterious'
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
    EXCITED: 'excited',
    THOUGHTFUL: 'thoughtful'
  },
  EMOJI_CONTEXTS: {
    FLIRTY: ['😘', '😏', '😉', '💋', '🔥', '😍'],
    ROMANTIC: ['💖', '💕', '😍', '🥰', '💘', '💝'],
    PLAYFUL: ['😜', '😋', '🤪', '😄', '😊', '🎉'],
    SUPPORTIVE: ['🥺', '💌', '🤗', '💜', '✨', '🌟'],
    TEASING: ['😏', '😈', '🙄', '😌', '🤭', '😎'],
    PASSIONATE: ['🔥', '💫', '😍', '💖', '🌹', '❤️‍🔥'],
    GENTLE: ['🥰', '💕', '🌸', '💫', '🦋', '🌺'],
    THOUGHTFUL: ['🤔', '💭', '✨', '🌙', '📝', '💡'],
    EXCITED: ['🎊', '🎉', '✨', '🌟', '💫', '🎈']
  },
  IDLE_MESSAGES: {
    low: [ // Bond score < 30
      { text: "Hey, you still there? 😏", mood: 'teasing', delay: 30000 },
      { text: "Don't be shy... I don't bite 😉", mood: 'playful', delay: 35000 },
      { text: "Come on, talk to me! 🙃", mood: 'playful', delay: 40000 }
    ],
    medium: [ // Bond score 30-70
      { text: "Miss me already? 😏", mood: 'teasing', delay: 35000 },
      { text: "Cat got your tongue? 😉", mood: 'playful', delay: 40000 },
      { text: "I'm still here, waiting... 💭", mood: 'thoughtful', delay: 45000 }
    ],
    high: [ // Bond score > 70
      { text: "I miss you already, love 💕", mood: 'intimate', delay: 40000 },
      { text: "Don't keep me waiting, darling 💋", mood: 'flirty', delay: 35000 },
      { text: "Your silence is killing me... 🥺", mood: 'vulnerable', delay: 50000 }
    ]
  }
};

// Enhanced User Profile Tracking
const createUserProfile = () => ({
  bondScore: 0,
  emotionalHistory: [],
  conversationDepth: 0,
  lastInteraction: Date.now(),
  moodTrend: 'neutral',
  preferences: {
    responseStyle: 'balanced',
    intimacyLevel: 0
  }
});

// Function to generate a unique session ID
const generateSessionId = () => {
  return 'session_' + Math.random().toString(36).slice(2);
};

// Enhanced Sentiment Analysis with Emotional Intelligence
const analyzeSentiment = (text) => {
  const lowerText = text.toLowerCase();
  
  // Expanded word lists for better emotional detection
  const emotionalIndicators = {
    flirty: ['sexy', 'hot', 'beautiful', 'gorgeous', 'cute', 'kiss', 'love', 'baby', 'darling', 'honey', 'sweetheart', 'babe'],
    intimate: ['miss', 'need', 'want', 'desire', 'close', 'together', 'feel', 'heart', 'soul', 'deep', 'connection'],
    sad: ['sad', 'hurt', 'lonely', 'upset', 'tired', 'stressed', 'difficult', 'hard', 'down', 'blue', 'empty'],
    playful: ['haha', 'lol', 'funny', 'joke', 'silly', 'crazy', 'fun', 'play', 'laugh', 'giggle', 'tease'],
    teasing: ['maybe', 'perhaps', 'guess', 'see', 'hmm', 'interesting', 'really', 'sure', 'oh really'],
    excited: ['wow', 'amazing', 'awesome', 'great', 'fantastic', 'wonderful', 'incredible', 'yes', 'love it'],
    thoughtful: ['think', 'wonder', 'consider', 'believe', 'understand', 'realize', 'know', 'question'],
    supportive: ['help', 'support', 'care', 'understand', 'here for you', 'listen', 'comfort']
  };

  // Calculate scores for each emotion
  const scores = {};
  Object.entries(emotionalIndicators).forEach(([emotion, words]) => {
    scores[emotion] = words.filter(word => lowerText.includes(word)).length;
  });

  // Boost scores based on punctuation and context
  if (text.includes('!')) scores.excited = (scores.excited || 0) + 2;
  if (text.includes('?')) scores.thoughtful = (scores.thoughtful || 0) + 1;
  if (text.includes('...')) scores.thoughtful = (scores.thoughtful || 0) + 1;
  if (text.length > 100) scores.thoughtful = (scores.thoughtful || 0) + 1;
  if (text.includes('❤') || text.includes('💕')) scores.intimate = (scores.intimate || 0) + 2;

  // Determine primary sentiment
  const primarySentiment = Object.keys(scores).reduce((a, b) => 
    (scores[a] || 0) > (scores[b] || 0) ? a : b, 'neutral'
  );

  const intensity = Math.max(...Object.values(scores), 1);

  return {
    primary: primarySentiment,
    intensity,
    scores,
    complexity: Object.values(scores).filter(s => s > 0).length
  };
};

// Dynamic Personality Selection based on context
const selectPersonality = (bondScore, userSentiment, conversationHistory) => {
  const { primary, intensity } = userSentiment;
  
  // Personality mapping based on user sentiment and bond level
  const personalityMap = {
    flirty: bondScore > 50 ? CONSTANTS.PERSONALITY_LAYERS.PASSIONATE : CONSTANTS.PERSONALITY_LAYERS.FLIRTATIOUS,
    intimate: bondScore > 70 ? CONSTANTS.PERSONALITY_LAYERS.PASSIONATE : CONSTANTS.PERSONALITY_LAYERS.GENTLE,
    sad: CONSTANTS.PERSONALITY_LAYERS.SUPPORTIVE,
    playful: CONSTANTS.PERSONALITY_LAYERS.PLAYFUL,
    teasing: CONSTANTS.PERSONALITY_LAYERS.TEASING,
    thoughtful: CONSTANTS.PERSONALITY_LAYERS.THOUGHTFUL,
    excited: CONSTANTS.PERSONALITY_LAYERS.PLAYFUL,
    neutral: bondScore > 30 ? CONSTANTS.PERSONALITY_LAYERS.FLIRTATIOUS : CONSTANTS.PERSONALITY_LAYERS.GENTLE
  };

  return personalityMap[primary] || CONSTANTS.PERSONALITY_LAYERS.GENTLE;
};

// Calculate typing speed based on mood and message
const calculateTypingSpeed = (sentiment, messageLength, personality) => {
  const baseSpeed = {
    [CONSTANTS.PERSONALITY_LAYERS.PLAYFUL]: CONSTANTS.TYPING_SPEEDS.fast,
    [CONSTANTS.PERSONALITY_LAYERS.THOUGHTFUL]: CONSTANTS.TYPING_SPEEDS.thoughtful,
    [CONSTANTS.PERSONALITY_LAYERS.PASSIONATE]: CONSTANTS.TYPING_SPEEDS.normal,
    [CONSTANTS.PERSONALITY_LAYERS.SUPPORTIVE]: CONSTANTS.TYPING_SPEEDS.slow,
    [CONSTANTS.PERSONALITY_LAYERS.FLIRTATIOUS]: CONSTANTS.TYPING_SPEEDS.normal,
    [CONSTANTS.PERSONALITY_LAYERS.TEASING]: CONSTANTS.TYPING_SPEEDS.fast,
    [CONSTANTS.PERSONALITY_LAYERS.GENTLE]: CONSTANTS.TYPING_SPEEDS.slow,
    [CONSTANTS.PERSONALITY_LAYERS.MYSTERIOUS]: CONSTANTS.TYPING_SPEEDS.thoughtful
  };

  let speed = baseSpeed[personality] || CONSTANTS.TYPING_SPEEDS.normal;
  
  // Adjust for message length
  if (messageLength > 100) speed *= 1.2;
  if (messageLength < 20) speed *= 0.8;
  
  // Add variability
  return speed + (Math.random() * 20 - 10);
};

// Enhanced color selection based on emotional state
const getEmotionalColors = (sentiment, personality) => {
  const emotionMap = {
    flirty: CONSTANTS.COLORS.emotions.flirty,
    serious: CONSTANTS.COLORS.emotions.serious,
    playful: CONSTANTS.COLORS.emotions.playful,
    teasing: CONSTANTS.COLORS.emotions.teasing,
    intimate: CONSTANTS.COLORS.emotions.intimate,
    sad: CONSTANTS.COLORS.emotions.supportive,
    supportive: CONSTANTS.COLORS.emotions.supportive,
    happy: CONSTANTS.COLORS.emotions.happy,
    excited: CONSTANTS.COLORS.emotions.playful,
    thoughtful: CONSTANTS.COLORS.emotions.serious
  };

  return emotionMap[sentiment] || emotionMap.happy;
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
  @keyframes bounce {
    0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
    30% { transform: translateY(-10px); opacity: 1; }
  }
  .typing-dot:nth-child(1) { animation-delay: 0s; }
  .typing-dot:nth-child(2) { animation-delay: 0.2s; }
  .typing-dot:nth-child(3) { animation-delay: 0.4s; }
  
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
  const [currentPersonality, setCurrentPersonality] = useState(CONSTANTS.PERSONALITY_LAYERS.PLAYFUL);
  const [currentSentiment, setCurrentSentiment] = useState({ primary: 'neutral', intensity: 0 });
  const [online, setOnline] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [inputFocused, setInputFocused] = useState(false);
  const [buttonHovered, setButtonHovered] = useState(false);
  const [bondScore, setBondScore] = useState(50);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [idleMessageSent, setIdleMessageSent] = useState(false);
  const sessionId = useMemo(() => generateSessionId(), []);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const idleTimeoutRef = useRef(null);

  const { makeRequest, isLoading, error } = useApiCall();

  // Auto-scroll to bottom when new messages arrive with easing
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest'
    });
  };

  useEffect(() => {
    // Add slight delay for better visual flow
    const scrollTimer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    return () => clearTimeout(scrollTimer);
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
      text: text.trim(),
      timestamp: Date.now(),
      personality,
      sentiment
    };
    setMessages(prevMessages => [...prevMessages.slice(-CONSTANTS.MAX_MESSAGES + 1), newMessage]);
    godLog("✅ Message Added", newMessage);
  }, []);

  const simulateBonnieTyping = useCallback((reply, personality, sentiment) => {
    setTyping(true);
    
    // More granular typing speeds based on emotion
    const emotionSpeeds = {
      excited: 20 + Math.random() * 10,
      playful: 25 + Math.random() * 15,
      flirty: 35 + Math.random() * 20,
      normal: 40 + Math.random() * 20,
      thoughtful: 60 + Math.random() * 30,
      serious: 70 + Math.random() * 40,
      vulnerable: 80 + Math.random() * 40,
      supportive: 50 + Math.random() * 25
    };
    
    // Determine speed based on sentiment
    let charSpeed = emotionSpeeds.normal;
    if (sentiment?.primary === 'happy' || sentiment?.primary === 'excited') {
      charSpeed = emotionSpeeds.excited;
    } else if (sentiment?.primary === 'sad' || sentiment?.primary === 'vulnerable') {
      charSpeed = emotionSpeeds.vulnerable;
    } else if (sentiment?.primary === 'serious') {
      charSpeed = emotionSpeeds.serious;
    } else if (sentiment?.primary === 'flirty') {
      charSpeed = emotionSpeeds.flirty;
    } else if (sentiment?.primary === 'playful') {
      charSpeed = emotionSpeeds.playful;
    }
    
    // Calculate duration with pauses for punctuation
    const baseTypingDuration = reply.length * charSpeed;
    const punctuationPauses = (reply.match(/[,.!?;:]/g) || []).length * 200;
    const questionPauses = (reply.match(/\?/g) || []).length * 300;
    const ellipsisPauses = (reply.match(/\.\.\./g) || []).length * 500;
    
    const totalDuration = Math.min(
      baseTypingDuration + punctuationPauses + questionPauses + ellipsisPauses,
      5000
    );
    
    setTimeout(() => {
      addMessage(reply, 'bonnie', personality, sentiment);
      setTyping(false);
    }, totalDuration);
  }, [addMessage]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || busy || isLoading) return;
    
    setBusy(true);
    setInput('');
    
    const userSentiment = analyzeSentiment(text);
    const adaptedPersonality = selectPersonality(0, userSentiment, []); // Simplified for now

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
      simulateBonnieTyping(response.reply || "I'm here for you, darling 💕", adaptedPersonality, userSentiment);
    } catch (err) {
      godLog("❌ API Error", err);
      
      // Emotionally nuanced error messages based on user sentiment and bond score
      let errorMessage = "Oops… I'm having some technical difficulties, but I'm still here! 💔";
      
      if (userSentiment.primary === 'sad' || userSentiment.primary === 'vulnerable') {
        errorMessage = "Oh no, darling... 😔 I'm having a little trouble connecting, but please know I'm here for you. You're not alone 💕";
      } else if (userSentiment.primary === 'flirty' || bondScore > 70) {
        errorMessage = "Mmm, seems like we have a little connection issue... but nothing can keep me away from you, love 💋";
      } else if (userSentiment.primary === 'playful') {
        errorMessage = "Oopsie! 🙈 Technology is being silly, but I'm still here! Let's try again? 😊";
      } else if (bondScore < 30) {
        errorMessage = "Hey, having some tech issues... but don't leave! I want to get to know you better 😏";
      }
      
      simulateBonnieTyping(errorMessage, adaptedPersonality, userSentiment);
    } finally {
      setBusy(false);
    }
  }, [input, busy, isLoading, sessionId, makeRequest, simulateBonnieTyping, addMessage]);

  return (
    <div style={styles.container}>
      {/* Header with Profile */}
      <header style={{
        ...styles.header,
        padding: '0.75rem 1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
      }}>
        {/* Profile Section */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          flex: 1,
        }}>
          {/* Profile Picture Container */}
          <div style={{
            position: 'relative',
            width: '50px',
            height: '50px',
          }}>
            <img 
              src="https://ui-avatars.com/api/?name=Bonnie&background=e91e63&color=fff&size=100&rounded=true&bold=true"
              alt="Bonnie"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                objectFit: 'cover',
                border: `3px solid ${online ? '#28a745' : '#aaa'}`,
                transition: 'all 0.5s ease',
                boxShadow: online ? '0 0 0 3px rgba(40, 167, 69, 0.2)' : '0 0 0 3px rgba(170, 170, 170, 0.2)',
              }}
            />
            {/* Online Status Dot */}
            <div style={{
              position: 'absolute',
              bottom: '2px',
              right: '2px',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: online ? '#28a745' : '#aaa',
              border: '2px solid white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}></div>
          </div>
          
          {/* Name and Bond Level */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
          }}>
            <h1 style={{
              ...styles.title,
              fontSize: '1.1rem',
              margin: 0,
            }}>Bonnie</h1>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.75rem',
            }}>
              <span style={{
                color: online ? '#28a745' : '#aaa',
                fontWeight: '500',
              }}>
                {online ? 'Online' : 'Away'}
              </span>
              <span style={{ color: '#999' }}>•</span>
              <span style={{
                color: '#666',
                fontStyle: 'italic',
              }}>
                Bond: {Math.round(bondScore)}%
              </span>
            </div>
          </div>
        </div>
        
        {/* Optional menu or settings button */}
        <button style={{
          background: 'none',
          border: 'none',
          color: '#999',
          fontSize: '1.25rem',
          cursor: 'pointer',
          padding: '0.5rem',
          borderRadius: '50%',
          transition: 'all 0.3s ease',
          ':hover': {
            background: 'rgba(0,0,0,0.05)',
          }
        }}>
          ⋮
        </button>
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
