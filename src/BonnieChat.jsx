import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import useApiCall from './useApiCall';

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
    primaryLight: '#f8bbd9',
    secondary: '#ff6ec7',
    gradient: 'linear-gradient(135deg, #e91e63 0%, #ff6ec7 100%)',
    online: '#28a745',
    offline: '#aaa',
    background: '#fff0f6',
    surface: '#ffffff',
    border: '#ffe6f0',
    text: '#2d2d2d',
    textLight: '#666',
    shadow: 'rgba(233, 30, 99, 0.15)'
  },
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
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

// Seductive CSS-in-JS Styles
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100vw',
    background: `linear-gradient(135deg, #fff0f6 0%, #fce4ec 50%, #fff0f6 100%)`,
    fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`,
    overflow: 'hidden',
    position: 'relative'
  },
  
  header: {
    background: CONSTANTS.COLORS.gradient,
    padding: '1rem',
    color: 'white',
    textAlign: 'center',
    boxShadow: `0 4px 20px ${CONSTANTS.COLORS.shadow}`,
    position: 'relative',
    zIndex: 10
  },
  
  headerTitle: {
    fontSize: 'clamp(1.2rem, 4vw, 1.5rem)',
    fontWeight: '600',
    margin: 0,
    textShadow: '0 2px 4px rgba(0,0,0,0.2)'
  },
  
  chatContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    position: 'relative'
  },
  
  messagesArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    scrollBehavior: 'smooth',
    WebkitOverflowScrolling: 'touch'
  },
  
  message: {
    maxWidth: '85%',
    padding: '0.75rem 1rem',
    borderRadius: '1.5rem',
    position: 'relative',
    wordBreak: 'break-word',
    animation: 'slideIn 0.3s ease-out',
    fontSize: 'clamp(0.9rem, 3.5vw, 1rem)',
    lineHeight: '1.4'
  },
  
  userMessage: {
    alignSelf: 'flex-end',
    background: CONSTANTS.COLORS.gradient,
    color: 'white',
    borderBottomRightRadius: '0.5rem',
    boxShadow: `0 2px 8px ${CONSTANTS.COLORS.shadow}`
  },
  
  bonnieMessage: {
    alignSelf: 'flex-start',
    background: CONSTANTS.COLORS.surface,
    color: CONSTANTS.COLORS.text,
    borderBottomLeftRadius: '0.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    border: `1px solid ${CONSTANTS.COLORS.border}`
  },
  
  typingIndicator: {
    display: 'flex',
    alignItems: 'center',
    alignSelf: 'flex-start',
    background: CONSTANTS.COLORS.surface,
    padding: '0.75rem 1rem',
    borderRadius: '1.5rem',
    borderBottomLeftRadius: '0.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    border: `1px solid ${CONSTANTS.COLORS.border}`,
    animation: 'slideIn 0.3s ease-out'
  },
  
  typingDots: {
    display: 'flex',
    gap: '0.25rem',
    alignItems: 'center'
  },
  
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: CONSTANTS.COLORS.primary,
    animation: 'bounce 1.4s infinite'
  },
  
  inputContainer: {
    padding: '1rem',
    background: CONSTANTS.COLORS.surface,
    borderTop: `1px solid ${CONSTANTS.COLORS.border}`,
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
    boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
  },
  
  input: {
    flex: 1,
    padding: '0.75rem 1rem',
    border: `2px solid ${CONSTANTS.COLORS.border}`,
    borderRadius: '1.5rem',
    fontSize: 'clamp(1rem, 4vw, 1.1rem)',
    outline: 'none',
    transition: 'all 0.3s ease',
    background: 'white',
    color: CONSTANTS.COLORS.text
  },
  
  inputFocused: {
    borderColor: CONSTANTS.COLORS.primary,
    boxShadow: `0 0 0 3px ${CONSTANTS.COLORS.shadow}`,
    transform: 'scale(1.02)'
  },
  
  sendButton: {
    background: CONSTANTS.COLORS.gradient,
    border: 'none',
    borderRadius: '50%',
    width: '48px',
    height: '48px',
    color: 'white',
    fontSize: '1.2rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: `0 2px 8px ${CONSTANTS.COLORS.shadow}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  
  sendButtonHover: {
    transform: 'scale(1.1)',
    boxShadow: `0 4px 16px ${CONSTANTS.COLORS.shadow}`
  },
  
  sendButtonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
    transform: 'none'
  }
};

// CSS Animations (injected once)
const injectStyles = () => {
  if (document.getElementById('bonnie-styles')) return;
  
  const styleSheet = document.createElement('style');
  styleSheet.id = 'bonnie-styles';
  styleSheet.textContent = `
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes bounce {
      0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
      40% { transform: scale(1.2); opacity: 1; }
    }
    
    .typing-dot:nth-child(1) { animation-delay: 0s; }
    .typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .typing-dot:nth-child(3) { animation-delay: 0.4s; }
    
    @media (max-width: 480px) {
      .message { max-width: 90%; }
    }
    
    /* Custom scrollbar */
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { 
      background: ${CONSTANTS.COLORS.primaryLight}; 
      border-radius: 2px; 
    }
    ::-webkit-scrollbar-thumb:hover { 
      background: ${CONSTANTS.COLORS.primary}; 
    }
  `;
  document.head.appendChild(styleSheet);
};

// Function to generate a unique session ID
const generateSessionId = () => {
  return 'session_' + Math.random().toString(36).slice(2);
};

// God-Tier Sentiment Analysis System
const analyzeSentiment = (text) => {
  const lowerText = text.toLowerCase();
  const flirtyWords = ['sexy', 'hot', 'beautiful', 'gorgeous', 'cute', 'kiss', 'love', 'baby', 'darling', 'honey'];
  const flirtyScore = flirtyWords.filter(word => lowerText.includes(word)).length;
  
  const intimateWords = ['miss', 'need', 'want', 'desire', 'close', 'together', 'feel', 'heart'];
  const intimateScore = intimateWords.filter(word => lowerText.includes(word)).length;
  
  const sadWords = ['sad', 'hurt', 'lonely', 'upset', 'tired', 'stressed', 'difficult', 'hard'];
  const sadScore = sadWords.filter(word => lowerText.includes(word)).length;
  
  const playfulWords = ['haha', 'lol', 'funny', 'joke', 'silly', 'crazy', 'fun', 'play'];
  const playfulScore = playfulWords.filter(word => lowerText.includes(word)).length;
  
  const teasingWords = ['maybe', 'perhaps', 'guess', 'see', 'hmm', 'interesting', 'really'];
  const teasingScore = teasingWords.filter(word => lowerText.includes(word)).length;

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

// Enhanced personality selection
const selectPersonality = (bondScore = 0, sentiment = {}, history = []) => {
  const { primary, intensity } = sentiment;
  
  if (primary === CONSTANTS.SENTIMENT_TYPES.SAD || primary === CONSTANTS.SENTIMENT_TYPES.VULNERABLE) {
    return CONSTANTS.PERSONALITY_LAYERS.SUPPORTIVE;
  }
  if (primary === CONSTANTS.SENTIMENT_TYPES.FLIRTY && intensity > 1) {
    return CONSTANTS.PERSONALITY_LAYERS.FLIRTATIOUS;
  }
  if (primary === CONSTANTS.SENTIMENT_TYPES.PLAYFUL) {
    return CONSTANTS.PERSONALITY_LAYERS.PLAYFUL;
  }
  
  return bondScore > 50 ? CONSTANTS.PERSONALITY_LAYERS.PASSIONATE : CONSTANTS.PERSONALITY_LAYERS.GENTLE;
};

// User profile with enhanced tracking
const userProfile = {
  bondScore: 45,
  conversationHistory: [],
  preferences: {},
  emotionalState: 'neutral'
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

export default function BonnieChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [typing, setTyping] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [currentPersonality, setCurrentPersonality] = useState(CONSTANTS.PERSONALITY_LAYERS.PLAYFUL);
  const [currentSentiment, setCurrentSentiment] = useState({ primary: 'neutral', intensity: 0 });
  const [online, setOnline] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('online');
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const sessionId = useMemo(() => generateSessionId(), []);
  const { makeRequest, isLoading, error } = useApiCall();

  // Inject styles on mount
  useEffect(() => {
    injectStyles();
  }, []);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing, scrollToBottom]);

  const addMessage = useCallback((text, sender, personality = null, sentiment = null) => {
    const newMessage = {
      id: Date.now() + Math.random(),
      sender,
      text: text.trim(),
      timestamp: Date.now(),
      personality,
      sentiment
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    godLog("✅ Message Added", newMessage);
  }, []);

  const simulateBonnieTyping = useCallback((reply, personality, sentiment) => {
    setTyping(true);
    setBusy(true);
    
    // Simulate natural typing delay
    const typingDelay = Math.min(reply.length * 50, 3000);
    
    setTimeout(() => {
      addMessage(reply, 'bonnie', personality, sentiment);
      setTyping(false);
      setBusy(false);
    }, typingDelay);
  }, [addMessage]);

  const handleSend = useCallback(async (text) => {
    if (!text?.trim() || busy) return;
    
    const userSentiment = analyzeSentiment(text);
    const adaptedPersonality = selectPersonality(userProfile.bondScore, userSentiment, userProfile.conversationHistory);

    setCurrentPersonality(adaptedPersonality);
    setCurrentSentiment(userSentiment);
    setBusy(true);

    addMessage(text.trim(), 'user');
    setInput('');
    
    try {
      const response = await makeRequest(CONSTANTS.API_ENDPOINTS.CHAT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          message: text,
          bond_score: userProfile.bondScore,
          user_sentiment: userSentiment,
          adapted_personality: adaptedPersonality,
        })
      });
      
      godLog("🔗 API Response", response);
      simulateBonnieTyping(response.reply, adaptedPersonality, userSentiment);
    } catch (err) {
      godLog("❌ API Error", err);
      setBusy(false);
      simulateBonnieTyping("Oops… I'm having some technical difficulties, but I'm still here! 💔", adaptedPersonality, userSentiment);
    }
  }, [sessionId, makeRequest, simulateBonnieTyping, addMessage, busy]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  }, [input, handleSend]);

  const TypingIndicator = () => (
    <div style={styles.typingIndicator}>
      <div style={styles.typingDots}>
        <div style={{...styles.dot}} className="typing-dot"></div>
        <div style={{...styles.dot}} className="typing-dot"></div>
        <div style={{...styles.dot}} className="typing-dot"></div>
      </div>
      <span style={{ marginLeft: '0.5rem', color: CONSTANTS.COLORS.textLight, fontSize: '0.9rem' }}>
        Bonnie is typing...
      </span>
    </div>
  );

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>💋 Bonnie Chat</h1>
      </header>
      
      <div style={styles.chatContainer}>
        <div style={styles.messagesArea}>
          {messages.map((message) => (
            <div 
              key={message.id}
              style={{
                ...styles.message,
                ...(message.sender === 'user' ? styles.userMessage : styles.bonnieMessage)
              }}
            >
              {message.text}
            </div>
          ))}
          
          {typing && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
        
        <div style={styles.inputContainer}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            disabled={isLoading || busy}
            placeholder="Type your message..."
            style={{
              ...styles.input,
              ...(inputFocused ? styles.inputFocused : {})
            }}
          />
          
          <button
            onClick={() => handleSend(input)}
            disabled={isLoading || busy || !input.trim()}
            style={{
              ...styles.sendButton,
              ...(isLoading || busy || !input.trim() ? styles.sendButtonDisabled : {})
            }}
            onMouseEnter={(e) => {
              if (!e.target.disabled) {
                Object.assign(e.target.style, styles.sendButtonHover);
              }
            }}
            onMouseLeave={(e) => {
              Object.assign(e.target.style, styles.sendButton);
            }}
          >
            {isLoading || busy ? '⏳' : '💕'}
          </button>
        </div>
      </div>
    </div>
  );
}
