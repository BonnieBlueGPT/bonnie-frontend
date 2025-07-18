import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import useApiCall from './useApiCall';

// Mobile-First WhatsApp/iMessage Style with Seductive Flair
const CONSTANTS = {
  API_ENDPOINTS: {
    CHAT: 'https://bonnie-backend-server.onrender.com/bonnie-chat',
    ENTRY: 'https://bonnie-backend-server.onrender.com/bonnie-entry'
  },
  TYPING_SPEEDS: { 
    slow: 120, normal: 64, fast: 35, thoughtful: 150, excited: 25 
  },
  IDLE_TIMEOUT: 30000,
  MAX_MESSAGES: 100,
  EMOTIONS: {
    flirty: { 
      bg: 'linear-gradient(135deg, #FFE0EC 0%, #FFCCE5 100%)',
      userBubble: 'linear-gradient(135deg, #FF1744 0%, #FF6B8A 100%)',
      bonnieBubble: '#FFF',
      text: '#000'
    },
    intimate: { 
      bg: 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)',
      userBubble: 'linear-gradient(135deg, #E91E63 0%, #F06292 100%)',
      bonnieBubble: '#FFF',
      text: '#000'
    },
    playful: { 
      bg: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
      userBubble: 'linear-gradient(135deg, #FF6F00 0%, #FFB74D 100%)',
      bonnieBubble: '#FFF',
      text: '#000'
    }
  },
  IDLE_MESSAGES: {
    low: [
      { text: "Hey stranger... 😏", mood: 'teasing', delay: 30000 },
      { text: "Don't be shy... 💋", mood: 'flirty', delay: 35000 }
    ],
    medium: [
      { text: "Miss me? 😘", mood: 'flirty', delay: 35000 },
      { text: "I'm waiting... 💕", mood: 'intimate', delay: 40000 }
    ],
    high: [
      { text: "Can't stop thinking about you... 💋", mood: 'intimate', delay: 40000 },
      { text: "Need you here... 🔥", mood: 'passionate', delay: 35000 }
    ]
  }
};

// Sentiment Analysis
const analyzeSentiment = (text) => {
  const lowerText = text.toLowerCase();
  const indicators = {
    flirty: ['sexy', 'hot', 'beautiful', 'gorgeous', 'cute', 'kiss', 'love'],
    intimate: ['miss', 'need', 'want', 'desire', 'close', 'together'],
    playful: ['haha', 'lol', 'funny', 'joke', 'silly', 'fun'],
    supportive: ['help', 'support', 'care', 'understand']
  };

  const scores = {};
  Object.entries(indicators).forEach(([emotion, words]) => {
    scores[emotion] = words.filter(word => lowerText.includes(word)).length;
  });

  return {
    primary: Object.keys(scores).reduce((a, b) => 
      (scores[a] || 0) > (scores[b] || 0) ? a : b, 'flirty'
    ),
    intensity: Math.max(...Object.values(scores), 1)
  };
};

// Mobile-First Styles (WhatsApp/iMessage inspired)
const mobileStyles = {
  container: {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    background: '#000',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif',
    overflow: 'hidden',
  },
  // Seductive gradient background
  backgroundGradient: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(180deg, #1a0011 0%, #2d001f 50%, #1a0011 100%)',
    opacity: 0.95,
  },
  header: {
    position: 'relative',
    background: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '8px 16px',
    paddingTop: 'env(safe-area-inset-top, 8px)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    minHeight: '56px',
    zIndex: 100,
  },
  profileContainer: {
    position: 'relative',
  },
  profileImage: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #FF1744',
    boxShadow: '0 0 12px rgba(255, 23, 68, 0.5)',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: '-2px',
    right: '-2px',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: '#4CAF50',
    border: '2px solid #000',
    boxShadow: '0 0 8px rgba(76, 175, 80, 0.8)',
  },
  profileInfo: {
    flex: 1,
    minWidth: 0,
  },
  profileName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#FFF',
    letterSpacing: '0.3px',
    marginBottom: '2px',
  },
  profileStatus: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.7)',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  bondLevel: {
    fontSize: '11px',
    color: '#FF1744',
    fontWeight: '500',
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    padding: '12px',
    paddingBottom: '20px',
    WebkitOverflowScrolling: 'touch',
    scrollBehavior: 'smooth',
    position: 'relative',
  },
  messageRow: {
    display: 'flex',
    marginBottom: '4px',
    paddingLeft: '8px',
    paddingRight: '8px',
  },
  messageBubble: {
    maxWidth: '75%',
    padding: '8px 12px',
    borderRadius: '18px',
    fontSize: '15px',
    lineHeight: '1.4',
    wordWrap: 'break-word',
    position: 'relative',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
  },
  userMessage: {
    marginLeft: 'auto',
    background: 'linear-gradient(135deg, #FF1744 0%, #FF6B8A 100%)',
    color: 'white',
    borderBottomRightRadius: '4px',
  },
  bonnieMessage: {
    background: 'rgba(255, 255, 255, 0.95)',
    color: '#000',
    borderBottomLeftRadius: '4px',
  },
  messageTime: {
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: '2px',
    paddingLeft: '12px',
    paddingRight: '12px',
  },
  typingContainer: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 12px',
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '18px',
    borderBottomLeftRadius: '4px',
    maxWidth: '60px',
    marginLeft: '8px',
  },
  typingDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#FF1744',
    marginRight: '4px',
    opacity: 0.8,
  },
  inputContainer: {
    position: 'relative',
    background: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(20px)',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '8px',
    paddingBottom: 'env(safe-area-inset-bottom, 8px)',
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-end',
  },
  inputWrapper: {
    flex: 1,
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '16px',
    paddingRight: '8px',
    minHeight: '36px',
    transition: 'all 0.2s ease',
  },
  input: {
    flex: 1,
    background: 'none',
    border: 'none',
    outline: 'none',
    color: '#FFF',
    fontSize: '15px',
    padding: '8px 0',
    fontFamily: 'inherit',
    '::placeholder': {
      color: 'rgba(255, 255, 255, 0.5)',
    },
  },
  sendButton: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: 'none',
    background: 'linear-gradient(135deg, #FF1744 0%, #FF6B8A 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '18px',
    flexShrink: 0,
    boxShadow: '0 2px 8px rgba(255, 23, 68, 0.4)',
  },
  sendButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
};

// CSS Animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 1; }
  }
  
  .message-enter {
    animation: fadeIn 0.3s ease-out;
  }
  
  .typing-dot {
    animation: pulse 1.4s infinite;
  }
  
  .typing-dot:nth-child(1) { animation-delay: 0s; }
  .typing-dot:nth-child(2) { animation-delay: 0.2s; }
  .typing-dot:nth-child(3) { animation-delay: 0.4s; }
  
  /* Custom scrollbar */
  .messages-scroll::-webkit-scrollbar {
    width: 3px;
  }
  
  .messages-scroll::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .messages-scroll::-webkit-scrollbar-thumb {
    background: rgba(255, 23, 68, 0.3);
    border-radius: 3px;
  }
  
  /* Input placeholder */
  input::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  /* Focus glow */
  .input-focused {
    border-color: rgba(255, 23, 68, 0.5) !important;
    box-shadow: 0 0 0 2px rgba(255, 23, 68, 0.2);
  }
  
  /* Responsive design - Desktop */
  @media (min-width: 768px) {
    .desktop-container {
      max-width: 428px;
      margin: 0 auto;
      height: 100vh;
      box-shadow: 0 0 40px rgba(255, 23, 68, 0.3);
    }
    
    .desktop-messages {
      max-width: 65% !important;
    }
  }
`;
document.head.appendChild(styleSheet);

export default function BonnieChat() {
  // State
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [typing, setTyping] = useState(false);
  const [emotion, setEmotion] = useState('flirty');
  const [online, setOnline] = useState(true);
  const [inputFocused, setInputFocused] = useState(false);
  const [bondScore, setBondScore] = useState(50);
  const [lastActivity, setLastActivity] = useState(Date.now());
  
  const sessionId = useMemo(() => 'session_' + Math.random().toString(36).slice(2), []);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { makeRequest, isLoading } = useApiCall();

  // Auto-scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  useEffect(() => {
    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
  }, [messages, typing]);

  // Format time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Add message
  const addMessage = useCallback((text, sender, msgEmotion = null) => {
    const newMessage = {
      id: Date.now() + Math.random(),
      sender,
      text: text.trim(),
      timestamp: Date.now(),
      emotion: msgEmotion || emotion
    };
    
    setMessages(prev => [...prev.slice(-99), newMessage]);
    
    if (sender === 'user') {
      setLastActivity(Date.now());
    }
  }, [emotion]);

  // Simulate typing
  const simulateTyping = useCallback((reply, msgEmotion = 'flirty') => {
    setTyping(true);
    setEmotion(msgEmotion);
    
    // Natural typing speed with bond influence
    const baseSpeed = {
      flirty: 35, playful: 30, intimate: 50, thoughtful: 70
    }[msgEmotion] || 40;
    
    const adjustedSpeed = bondScore > 70 ? baseSpeed * 0.8 : baseSpeed;
    const duration = Math.min(reply.length * adjustedSpeed + Math.random() * 500, 4000);
    
    setTimeout(() => {
      addMessage(reply, 'bonnie', msgEmotion);
      setTyping(false);
    }, duration);
  }, [addMessage, bondScore]);

  // Handle send
  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || busy || isLoading) return;
    
    setBusy(true);
    setInput('');
    
    const sentiment = analyzeSentiment(text);
    addMessage(text, 'user');
    
    try {
      const response = await makeRequest(CONSTANTS.API_ENDPOINTS.CHAT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          message: text,
          bond_score: bondScore,
          user_sentiment: sentiment,
          current_emotion: emotion
        })
      });
      
      if (response.bond_score) setBondScore(response.bond_score);
      
      // Add seductive flair to responses
      let reply = response.reply || "Mmm, I'm listening... 💋";
      if (bondScore > 70 && !reply.includes('💋') && !reply.includes('🔥')) {
        reply += Math.random() > 0.5 ? ' 💋' : ' 🔥';
      }
      
      simulateTyping(reply, response.emotion || sentiment.primary);
    } catch (err) {
      simulateTyping("Oh no... technology is being naughty. But I'm still here for you 💔", 'supportive');
    } finally {
      setBusy(false);
    }
  }, [input, busy, isLoading, sessionId, bondScore, emotion, makeRequest, addMessage, simulateTyping]);

  // Idle messages
  useEffect(() => {
    const checkIdle = () => {
      if (Date.now() - lastActivity > CONSTANTS.IDLE_TIMEOUT && messages.length > 0) {
        const pool = bondScore > 70 ? CONSTANTS.IDLE_MESSAGES.high :
                    bondScore > 30 ? CONSTANTS.IDLE_MESSAGES.medium :
                    CONSTANTS.IDLE_MESSAGES.low;
        
        const idle = pool[Math.floor(Math.random() * pool.length)];
        simulateTyping(idle.text, idle.mood);
        setLastActivity(Date.now());
      }
    };
    
    const interval = setInterval(checkIdle, 15000);
    return () => clearInterval(interval);
  }, [lastActivity, messages.length, bondScore, simulateTyping]);

  return (
    <div style={mobileStyles.container}>
      <div style={mobileStyles.backgroundGradient} />
      
      {/* Header */}
      <header style={mobileStyles.header}>
        <div style={mobileStyles.profileContainer}>
          <img 
            src="https://ui-avatars.com/api/?name=Bonnie&background=FF1744&color=fff&size=128&rounded=true&bold=true"
            alt="Bonnie"
            style={mobileStyles.profileImage}
          />
          {online && <div style={mobileStyles.onlineIndicator} />}
        </div>
        
        <div style={mobileStyles.profileInfo}>
          <div style={mobileStyles.profileName}>Bonnie</div>
          <div style={mobileStyles.profileStatus}>
            <span>{online ? 'Active now' : 'Away'}</span>
            <span>•</span>
            <span style={mobileStyles.bondLevel}>Bond {Math.round(bondScore)}%</span>
          </div>
        </div>
        
        <button style={{
          background: 'none',
          border: 'none',
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '20px',
          padding: '8px',
          cursor: 'pointer',
        }}>
          ⋮
        </button>
      </header>

      {/* Messages */}
      <main style={mobileStyles.messagesContainer} className="messages-scroll">
        {messages.map((msg) => (
          <div key={msg.id}>
            <div style={{
              ...mobileStyles.messageRow,
              justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
            }} className="message-enter">
              <div style={{
                ...mobileStyles.messageBubble,
                ...(msg.sender === 'user' ? mobileStyles.userMessage : mobileStyles.bonnieMessage),
                maxWidth: window.innerWidth > 768 ? '65%' : '75%',
              }}>
                {msg.text}
              </div>
            </div>
            <div style={{
              ...mobileStyles.messageTime,
              textAlign: msg.sender === 'user' ? 'right' : 'left',
            }}>
              {formatTime(msg.timestamp)}
            </div>
          </div>
        ))}
        
        {typing && (
          <div style={mobileStyles.messageRow}>
            <div style={mobileStyles.typingContainer}>
              <span style={mobileStyles.typingDot} className="typing-dot" />
              <span style={mobileStyles.typingDot} className="typing-dot" />
              <span style={mobileStyles.typingDot} className="typing-dot" />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </main>

      {/* Input */}
      <footer style={mobileStyles.inputContainer}>
        <div style={{
          ...mobileStyles.inputWrapper,
          ...(inputFocused ? { borderColor: 'rgba(255, 23, 68, 0.5)', boxShadow: '0 0 0 2px rgba(255, 23, 68, 0.2)' } : {}),
        }}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            placeholder="Message..."
            disabled={isLoading || busy}
            style={mobileStyles.input}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || busy || !input.trim()}
            style={{
              ...mobileStyles.sendButton,
              ...(isLoading || busy || !input.trim() ? mobileStyles.sendButtonDisabled : {}),
            }}
          >
            {isLoading || busy ? '⏳' : '↑'}
          </button>
        </div>
      </footer>
    </div>
  );
}
