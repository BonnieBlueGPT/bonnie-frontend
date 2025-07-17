import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import useApiCall from './useApiCall'; // Import the useApiCall hook

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

// Function to generate a unique session ID
const generateSessionId = () => {
  return 'session_' + Math.random().toString(36).slice(2);
};

// God-Tier Sentiment Analysis System
const analyzeSentiment = (text) => {
  const lowerText = text.toLowerCase();
  // Flirty indicators, Intimate, Sad/vulnerable, Playful, and Teasing words
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
  const sessionId = useMemo(() => generateSessionId(), []);
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
    const typingDuration = Math.min(reply.length * 30, 3000); // Dynamic typing duration
    setTimeout(() => {
      addMessage(reply, 'bonnie', personality, sentiment);
      setTyping(false);
    }, typingDuration);
  }, [addMessage]);

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
      simulateBonnieTyping(response.reply || "I'm here for you, darling 💕", adaptedPersonality, userSentiment);
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
