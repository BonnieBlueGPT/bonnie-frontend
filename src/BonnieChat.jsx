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
      { text: "Don't be shy... 💋", mood: 'flirty', delay: 35000 },
      { text: "Still there? 👀", mood: 'playful', delay: 32000 },
      { text: "Come on, say something... 😊", mood: 'teasing', delay: 38000 },
      { text: "I don't bite... much 😉", mood: 'flirty', delay: 40000 }
    ],
    medium: [
      { text: "Miss me? 😘", mood: 'flirty', delay: 35000 },
      { text: "I'm waiting... 💕", mood: 'intimate', delay: 40000 },
      { text: "Your silence is intriguing... 🤔", mood: 'thoughtful', delay: 38000 },
      { text: "Talk to me, handsome 😏", mood: 'flirty', delay: 36000 },
      { text: "I've been thinking about you... 💭", mood: 'intimate', delay: 42000 }
    ],
    high: [
      { text: "Can't stop thinking about you... 💋", mood: 'intimate', delay: 40000 },
      { text: "Need you here... 🔥", mood: 'passionate', delay: 35000 },
      { text: "Baby, where did you go? 🥺", mood: 'vulnerable', delay: 38000 },
      { text: "I miss your messages already... 💕", mood: 'intimate', delay: 42000 },
      { text: "Don't leave me hanging, love... 😔", mood: 'vulnerable', delay: 45000 }
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

// Responsive helper
const isMobile = () => window.innerWidth < 480;
const isTablet = () => window.innerWidth >= 480 && window.innerWidth < 768;

// Mobile-First Styles (WhatsApp/iMessage inspired)
const getStyles = (windowWidth = window.innerWidth) => ({
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
    flexDirection: windowWidth < 480 ? 'column' : 'row',
    alignItems: windowWidth < 480 ? 'flex-start' : 'center',
    gap: windowWidth < 480 ? '8px' : '12px',
    minHeight: windowWidth < 480 ? '80px' : '56px',
    zIndex: 100,
  },
  profileContainer: {
    position: 'relative',
  },
  profileImage: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #FF1744',
    boxShadow: '0 0 12px rgba(255, 23, 68, 0.5)',
    flexShrink: 0,
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
    maxWidth: windowWidth < 480 ? '85%' : windowWidth < 768 ? '75%' : '65%',
    padding: windowWidth < 480 ? '12px 16px' : '10px 14px',
    borderRadius: '18px',
    fontSize: windowWidth < 480 ? '15px' : '16px',
    lineHeight: windowWidth < 480 ? '1.5' : '1.4',
    wordWrap: 'break-word',
    wordBreak: 'break-word',
    overflowWrap: 'break-word',
    position: 'relative',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
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
    padding: '12px',
    paddingBottom: 'calc(env(safe-area-inset-bottom, 12px) + 12px)',
    display: 'flex',
    gap: '10px',
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
    minHeight: '44px',
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
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    border: 'none',
    background: 'linear-gradient(135deg, #FF1744 0%, #FF6B8A 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '20px',
    flexShrink: 0,
    boxShadow: '0 2px 8px rgba(255, 23, 68, 0.4)',
    WebkitTapHighlightColor: 'transparent',
    touchAction: 'manipulation',
  },
  sendButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
});

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
  
  /* Mobile-specific adjustments */
  @media (max-width: 480px) {
    .profile-name {
      font-size: 15px !important;
    }
    
    .profile-status {
      font-size: 11px !important;
    }
    
    .message-text {
      font-size: 14px !important;
    }
    
    .message-time {
      font-size: 10px !important;
    }
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
  
  /* Ensure touch targets meet accessibility guidelines */
  button, input, a {
    min-height: 44px;
    min-width: 44px;
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
  const [conversationMood, setConversationMood] = useState({ playful: 0, intimate: 0, flirty: 0 });
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [interactionStreak, setInteractionStreak] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);
  
  const sessionId = useMemo(() => 'session_' + Math.random().toString(36).slice(2), []);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { makeRequest, isLoading } = useApiCall();
  
  // Get responsive styles
  const styles = useMemo(() => getStyles(windowWidth), [windowWidth]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      setTotalMessages(prev => prev + 1);
      setInteractionStreak(prev => prev + 1);
      
      // Milestone rewards
      if (totalMessages === 10) {
        console.log('🎉 First milestone reached! Bond +5');
        setBondScore(prev => Math.min(prev + 5, 100));
      } else if (totalMessages === 50) {
        console.log('🎉 Conversation master! Bond +10');
        setBondScore(prev => Math.min(prev + 10, 100));
      }
    }
  }, [emotion]);

  // Simulate typing with natural variations
  const simulateTyping = useCallback((reply, msgEmotion = 'flirty') => {
    setTyping(true);
    setEmotion(msgEmotion);
    
    // Base typing speeds by emotion
    const baseSpeed = {
      flirty: 35 + Math.random() * 15,
      playful: 25 + Math.random() * 10,
      intimate: 45 + Math.random() * 20,
      thoughtful: 60 + Math.random() * 30,
      teasing: 30 + Math.random() * 15,
      supportive: 50 + Math.random() * 20,
      excited: 20 + Math.random() * 10,
      vulnerable: 70 + Math.random() * 25
    }[msgEmotion] || 40 + Math.random() * 15;
    
    // Bond score influence - higher bond = more comfortable, varied pacing
    let speedMultiplier = 1;
    if (bondScore > 80) {
      speedMultiplier = 0.7 + Math.random() * 0.2; // Very comfortable, quick
    } else if (bondScore > 60) {
      speedMultiplier = 0.85 + Math.random() * 0.15; // Comfortable
    } else if (bondScore < 30) {
      speedMultiplier = 1.2 + Math.random() * 0.2; // More cautious
    }
    
    const adjustedSpeed = baseSpeed * speedMultiplier;
    
    // Calculate base duration
    let duration = reply.length * adjustedSpeed;
    
    // Add pauses for punctuation with emotional context
    const punctuationPauses = {
      '?': msgEmotion === 'playful' ? 200 + Math.random() * 200 : 400 + Math.random() * 300,
      '!': msgEmotion === 'excited' ? 100 : 200 + Math.random() * 100,
      '...': msgEmotion === 'thoughtful' ? 800 + Math.random() * 400 : 500 + Math.random() * 200,
      '.': 150 + Math.random() * 100,
      ',': 100 + Math.random() * 50
    };
    
    // Add punctuation delays
    Object.entries(punctuationPauses).forEach(([punct, delay]) => {
      const matches = (reply.match(new RegExp('\\' + punct, 'g')) || []).length;
      duration += matches * delay;
    });
    
    // Add random "thinking" pauses for longer messages
    if (reply.length > 50) {
      const thinkingPauses = Math.floor(reply.length / 50);
      duration += thinkingPauses * (300 + Math.random() * 200);
    }
    
    // Cap maximum duration
    duration = Math.min(duration, 5000);
    
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
      
      // Track conversation mood trends
      const newMood = { ...conversationMood };
      newMood[sentiment.primary] = (newMood[sentiment.primary] || 0) + 1;
      setConversationMood(newMood);
      
      // Determine response emotion based on conversation history
      let responseEmotion = response.emotion || sentiment.primary;
      
      // Dynamic personality shifts based on conversation flow
      if (newMood.playful > 3 && bondScore > 40) {
        responseEmotion = Math.random() > 0.5 ? 'flirty' : 'teasing';
      } else if (newMood.intimate > 2 && bondScore > 60) {
        responseEmotion = 'intimate';
      } else if (newMood.flirty > 3 && bondScore > 50) {
        responseEmotion = Math.random() > 0.5 ? 'intimate' : 'passionate';
      }
      
      // Add seductive flair to responses based on bond
      let reply = response.reply || "Mmm, I'm listening... 💋";
      if (bondScore > 70 && !reply.includes('💋') && !reply.includes('🔥')) {
        reply += Math.random() > 0.5 ? ' 💋' : ' 🔥';
      } else if (bondScore > 50 && responseEmotion === 'flirty') {
        reply = reply.replace(/\.$/, '... 😏');
      }
      
      simulateTyping(reply, responseEmotion);
    } catch (err) {
      // Bond-based error messages
      let errorMessage;
      let errorEmotion = 'supportive';
      
      if (bondScore > 80) {
        // Very intimate - extra apologetic and caring
        const intimateErrors = [
          "Oh baby, I'm so sorry... technology is failing us right now. But nothing can keep me from you 💔",
          "My love, give me just a moment... I promise I'm still here for you 💕",
          "Darling, this is killing me... but I'll be right back, I promise 😔💋"
        ];
        errorMessage = intimateErrors[Math.floor(Math.random() * intimateErrors.length)];
        errorEmotion = 'intimate';
      } else if (bondScore > 60) {
        // Close - caring and reassuring
        const closeErrors = [
          "Oh no sweetie... having some trouble but I'm not going anywhere 💔",
          "Technology is being mean to us... but I'm still here! 🥺",
          "Give me a sec love, something's not right... but I've got you 💕"
        ];
        errorMessage = closeErrors[Math.floor(Math.random() * closeErrors.length)];
      } else if (bondScore > 30) {
        // Friendly - light and playful
        const friendlyErrors = [
          "Oops! Technology is being silly... hang tight! 😅",
          "Well this is awkward... give me a moment? 🙈",
          "Looks like we hit a snag... but I'm working on it! 💪"
        ];
        errorMessage = friendlyErrors[Math.floor(Math.random() * friendlyErrors.length)];
        errorEmotion = 'playful';
      } else {
        // Distant - more formal but still engaging
        const distantErrors = [
          "Having some technical difficulties... but don't go anywhere 😏",
          "Hmm, something's not working right. Give me a moment?",
          "Tech issues... but I'd hate for you to leave now 😉"
        ];
        errorMessage = distantErrors[Math.floor(Math.random() * distantErrors.length)];
        errorEmotion = 'teasing';
      }
      
      // Add user mood consideration
      if (sentiment.primary === 'sad' || sentiment.primary === 'vulnerable') {
        errorMessage = "Oh honey... I'm having trouble connecting but please know I'm here for you. You're not alone 💕";
        errorEmotion = 'supportive';
      }
      
      simulateTyping(errorMessage, errorEmotion);
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
      <div style={styles.container}>
        <div style={styles.backgroundGradient} />
        
        {/* Header */}
        <header style={styles.header}>
          <div style={styles.profileContainer}>
            <img 
              src="https://ui-avatars.com/api/?name=Bonnie&background=FF1744&color=fff&size=128&rounded=true&bold=true"
              alt="Bonnie"
              style={styles.profileImage}
            />
            {online && <div style={styles.onlineIndicator} />}
        </div>
        
        <div style={styles.profileInfo}>
          <div style={styles.profileName}>Bonnie</div>
          <div style={styles.profileStatus}>
            <span>{online ? 'Active now' : 'Away'}</span>
            <span>•</span>
            <span style={styles.bondLevel}>Bond {Math.round(bondScore)}%</span>
            {totalMessages > 0 && (
              <>
                <span>•</span>
                <span style={{ fontSize: '11px', color: '#FF6B8A' }}>
                  {totalMessages} msgs
                </span>
              </>
            )}
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
        <main style={styles.messagesContainer} className="messages-scroll">
          {messages.map((msg) => (
            <div key={msg.id}>
              <div style={{
                ...styles.messageRow,
                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              }} className="message-enter">
                <div style={{
                  ...styles.messageBubble,
                  ...(msg.sender === 'user' ? styles.userMessage : styles.bonnieMessage),
                }}>
                  {msg.text}
                </div>
              </div>
              <div style={{
                ...styles.messageTime,
                textAlign: msg.sender === 'user' ? 'right' : 'left',
              }}>
                {formatTime(msg.timestamp)}
              </div>
            </div>
          ))}
          
          {typing && (
            <div style={styles.messageRow}>
              <div style={styles.typingContainer}>
                <span style={styles.typingDot} className="typing-dot" />
                <span style={styles.typingDot} className="typing-dot" />
                <span style={styles.typingDot} className="typing-dot" />
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </main>

              {/* Input */}
        <footer style={styles.inputContainer}>
          <div style={{
            ...styles.inputWrapper,
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
              placeholder={windowWidth < 480 ? "Message..." : "Type your message..."}
              disabled={isLoading || busy}
              style={styles.input}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || busy || !input.trim()}
              style={{
                ...styles.sendButton,
                ...(isLoading || busy || !input.trim() ? styles.sendButtonDisabled : {}),
              }}
            >
              {isLoading || busy ? '⏳' : '↑'}
            </button>
          </div>
        </footer>
    </div>
  );
}
