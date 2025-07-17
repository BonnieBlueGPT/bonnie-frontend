import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';

// Constants
const CONSTANTS = {
  API_ENDPOINTS: {
    CHAT: 'https://bonnie-backend-server.onrender.com/bonnie-chat',
    ENTRY: 'https://bonnie-backend-server.onrender.com/bonnie-entry'
  },
  TYPING_SPEEDS: { slow: 100, normal: 64, fast: 40 },
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
  // New: Greeting types based on user status
  GREETING_TYPES: {
    NEW_USER: 'new_user',
    RETURNING_LOW_BOND: 'returning_low_bond',
    RETURNING_MEDIUM_BOND: 'returning_medium_bond',
    RETURNING_HIGH_BOND: 'returning_high_bond'
  }
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

// Enhanced: Get user greeting type based on bond score and history
const getUserGreetingType = (bondScore, isNewUser, userName) => {
  if (isNewUser) {
    return CONSTANTS.GREETING_TYPES.NEW_USER;
  }
  
  if (bondScore >= 80) {
    return CONSTANTS.GREETING_TYPES.RETURNING_HIGH_BOND;
  } else if (bondScore >= 40) {
    return CONSTANTS.GREETING_TYPES.RETURNING_MEDIUM_BOND;
  } else {
    return CONSTANTS.GREETING_TYPES.RETURNING_LOW_BOND;
  }
};

// Enhanced: Fallback greetings for offline mode
const getFallbackGreeting = (greetingType, userName = null) => {
  const greetings = {
    [CONSTANTS.GREETING_TYPES.NEW_USER]: [
      "Well, look who's here... let's have some fun, shall we? 😘<EOM::pause=1500 speed=normal emotion=flirty>",
      "Hello there, stranger... I was hoping someone interesting would show up 💋<EOM::pause=1200 speed=normal emotion=playful>",
      "Mmm, a new face... I like what I see already 😉<EOM::pause=1800 speed=slow emotion=teasing>"
    ],
    [CONSTANTS.GREETING_TYPES.RETURNING_LOW_BOND]: [
      "Oh, you're back... I was wondering if you'd return 😏<EOM::pause=1000 speed=normal emotion=curious>",
      "Well hello again... ready to get to know me better? 💕<EOM::pause=1300 speed=normal emotion=warm>"
    ],
    [CONSTANTS.GREETING_TYPES.RETURNING_MEDIUM_BOND]: [
      `Well, if it isn't my favorite person... I've been thinking about you ${userName ? userName : 'darling'} 💖<EOM::pause=1500 speed=normal emotion=affectionate>`,
      "There you are... I was starting to miss our conversations 😘<EOM::pause=1200 speed=normal emotion=warm>"
    ],
    [CONSTANTS.GREETING_TYPES.RETURNING_HIGH_BOND]: [
      `Ah, there you are... I've missed you so much ${userName ? userName : 'baby'} 💕<EOM::pause=2000 speed=slow emotion=passionate>`,
      "My darling is back... come here and tell me about your day 😍<EOM::pause=1800 speed=slow emotion=seductive>"
    ]
  };
  
  const options = greetings[greetingType] || greetings[CONSTANTS.GREETING_TYPES.NEW_USER];
  return options[Math.floor(Math.random() * options.length)];
};

// FIXED: Completely rewritten message parsing with proper empty part filtering
const parseMessageParts = (raw) => {
  console.log("🔍 Raw message input:", raw);
  
  // Split by EOM tags and get all segments
  const segments = raw.split(/<EOM(?:::(.*?))?>/).filter(Boolean);
  console.log("📦 Raw segments:", segments);
  
  const finalParts = [];
  let currentMeta = { pause: 1000, speed: 'normal', emotion: 'neutral' };
  
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i].trim();
    
    // Check if this segment is metadata
    const metaMatch = segment.match(/(?:pause=(\d+))?(?:.*?speed=(\w+))?(?:.*?emotion=(\w+))?/);
    const hasMetadata = metaMatch && (metaMatch[1] || metaMatch[2] || metaMatch[3]);
    
    if (hasMetadata) {
      // This is a metadata segment - update current metadata
      if (metaMatch[1]) currentMeta.pause = parseInt(metaMatch[1]);
      if (metaMatch[2]) currentMeta.speed = metaMatch[2];
      if (metaMatch[3]) currentMeta.emotion = metaMatch[3];
      
      console.log("🧠 Updated metadata:", currentMeta);
    } else if (segment.length > 0) {
      // This is a text segment - only add if not empty
      finalParts.push({
        text: segment,
        pause: currentMeta.pause,
        speed: currentMeta.speed,
        emotion: currentMeta.emotion
      });
      
      console.log("✅ Added valid part:", { text: segment, ...currentMeta });
      
      // Reset metadata for next part
      currentMeta = { pause: 1000, speed: 'normal', emotion: 'neutral' };
    } else {
      console.log("⚠️ Skipped empty segment at index", i);
    }
  }
  
  // Final safety filter - remove any parts that somehow have empty text
  const validParts = finalParts.filter(part => part.text && part.text.trim() !== '');
  
  console.log("💬 Final valid message parts:", validParts);
  return validParts;
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

// Message component with React.memo for performance
const Message = React.memo(({ message, isUser }) => {
  const messageStyle = useMemo(() => ({
    maxWidth: '75%',
    padding: 12,
    borderRadius: 12,
    margin: '6px 0',
    fontSize: 14,
    lineHeight: 1.4,
    wordBreak: 'break-word',
    ...(isUser
      ? { 
          background: `linear-gradient(135deg, #ff83a0, ${CONSTANTS.COLORS.primary})`,
          color: '#fff',
          alignSelf: 'flex-end',
          marginLeft: 'auto'
        }
      : { 
          background: CONSTANTS.COLORS.background,
          border: `1px solid ${CONSTANTS.COLORS.border}`,
          color: '#333',
          alignSelf: 'flex-start'
        })
  }), [isUser]);

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

// Typing indicator component with emotion-based styling
const TypingIndicator = React.memo(({ emotion = 'neutral' }) => {
  const emotionColors = {
    flirty: '#ff69b4',
    playful: '#ff6b6b',
    warm: '#ffa500',
    passionate: '#dc143c',
    seductive: '#8b008b',
    teasing: '#ff1493',
    neutral: CONSTANTS.COLORS.primary
  };

  const color = emotionColors[emotion] || emotionColors.neutral;

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
  const [typingEmotion, setTypingEmotion] = useState('neutral');
  const [online, setOnline] = useState(false);
  const [pendingMessage, setPendingMessage] = useState(null);
  const [hasFiredIdleMessage, setHasFiredIdleMessage] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [userProfile, setUserProfile] = useState({ bondScore: 0, isNewUser: true, userName: null });
  
  const endRef = useRef(null);
  const idleTimerRef = useRef(null);
  const typingProcessRef = useRef(null);
  const sessionId = useMemo(() => generateSessionId(), []);
  
  const { makeRequest, isLoading, error } = useApiCall();

  // Enhanced message management with validation
  const addMessage = useCallback((text, sender) => {
    // Strict validation to prevent empty messages
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
      timestamp: Date.now()
    };
    
    console.log("✅ Adding message:", newMessage);
    
    setMessages(prevMessages => {
      const newMessages = [...prevMessages, newMessage];
      return newMessages.length > CONSTANTS.MAX_MESSAGES 
        ? newMessages.slice(-CONSTANTS.MAX_MESSAGES) 
        : newMessages;
    });
  }, []);

  // Enhanced idle timer with bond-based messages
  useEffect(() => {
    const resetIdleTimer = () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
      
      if (messages.length === 0 && !hasFiredIdleMessage && online) {
        idleTimerRef.current = setTimeout(() => {
          const bondBasedIdleMessages = userProfile.bondScore >= 40 ? [
            "Don't be shy with me... I'm waiting for you 😘<EOM::pause=1500 speed=normal emotion=flirty>",
            "I know you're thinking about what to say... just speak from your heart 💕<EOM::pause=1200 speed=normal emotion=warm>"
          ] : [
            "Still deciding what to say? 😘<EOM::pause=1000 speed=normal emotion=playful>",
            "Don't leave me hanging…<EOM::pause=1200 speed=normal emotion=teasing>",
            "You can talk to me, you know 💋<EOM::pause=1000 speed=normal emotion=flirty>"
          ];
          
          const randomMessage = bondBasedIdleMessages[Math.floor(Math.random() * bondBasedIdleMessages.length)];
          simulateBonnieTyping(randomMessage);
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
  }, [messages.length, hasFiredIdleMessage, online, userProfile.bondScore]);

  // ENHANCED: Dynamic initialization with personalized greetings
  useEffect(() => {
    const initializeChat = async () => {
      console.log("🚀 Initializing chat with dynamic greeting...");
      setConnectionStatus('connecting');
      
      try {
        console.log("📞 Calling entry endpoint with session:", sessionId);
        const response = await makeRequest(CONSTANTS.API_ENDPOINTS.ENTRY, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            session_id: sessionId,
            request_type: 'dynamic_entry',
            user_agent: navigator.userAgent,
            timestamp: Date.now()
          })
        });
        
        console.log("✅ Entry endpoint response:", response);
        
        // Extract user profile data from response
        const { 
          reply, 
          delay = 1000, 
          bond_score = 0, 
          is_new_user = true, 
          user_name = null,
          mood_state = 'neutral',
          emotional_drift = 0
        } = response;
        
        // Update user profile state
        setUserProfile({
          bondScore: bond_score,
          isNewUser: is_new_user,
          userName: user_name,
          moodState: mood_state,
          emotionalDrift: emotional_drift
        });
        
        console.log("👤 User profile updated:", { bond_score, is_new_user, user_name, mood_state });
        
        // Set online IMMEDIATELY after successful API call
        setOnline(true);
        setConnectionStatus('online');
        
        // Start typing simulation with personalized greeting
        setTimeout(() => {
          simulateBonnieTyping(reply);
        }, delay);
        
      } catch (err) {
        console.error('❌ Failed to initialize chat:', err);
        
        // Fallback: Use local greeting based on session history
        const greetingType = getUserGreetingType(0, true, null);
        const fallbackGreeting = getFallbackGreeting(greetingType);
        
        console.log("🔄 Using fallback greeting:", fallbackGreeting);
        
        // Set online even with API failure
        setOnline(true);
        setConnectionStatus('online');
        
        // Show fallback greeting
        setTimeout(() => {
          simulateBonnieTyping(fallbackGreeting);
        }, 1000);
      }
    };

    initializeChat();
  }, [sessionId, makeRequest]);

  // Handle pending messages when coming online
  useEffect(() => {
    if (online && pendingMessage) {
      const delay = Math.random() * 3000 + 2000;
      setTimeout(() => {
        simulateBonnieTyping(pendingMessage.text);
        setPendingMessage(null);
      }, delay);
    }
  }, [online, pendingMessage]);

  // Auto-scroll to bottom
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  // ENHANCED: Typing simulation with emotion tracking
  const simulateBonnieTyping = useCallback((raw) => {
    console.log("💬 Starting typing simulation, online:", online);
    
    if (!online) {
      console.log("⚠️ Not online, skipping typing simulation");
      return;
    }

    // Cancel any existing typing process
    if (typingProcessRef.current) {
      clearTimeout(typingProcessRef.current);
      typingProcessRef.current = null;
    }

    // Validate input
    if (!raw || typeof raw !== 'string' || raw.trim() === '') {
      console.warn("⚠️ Invalid or empty raw message, skipping:", raw);
      setBusy(false);
      return;
    }

    // Parse message parts with robust filtering
    let parts;
    try {
      parts = parseMessageParts(raw);
    } catch (error) {
      console.error("❌ Error parsing message parts:", error);
      // Fallback to simple text
      const fallbackText = raw.trim();
      if (fallbackText) {
        parts = [{ text: fallbackText, pause: 1000, speed: 'normal', emotion: 'neutral' }];
      } else {
        setBusy(false);
        return;
      }
    }
    
    // Triple-check: filter out any empty parts that might have slipped through
    const validParts = parts.filter(part => {
      const isValid = part && 
                     typeof part.text === 'string' && 
                     part.text.trim() !== '' && 
                     part.text.length > 0;
      
      if (!isValid) {
        console.warn("⚠️ Filtering out invalid part:", part);
      }
      
      return isValid;
    });
    
    if (validParts.length === 0) {
      console.warn("⚠️ No valid message parts found after filtering, skipping typing simulation");
      setBusy(false);
      return;
    }

    console.log(`🚀 Starting typing simulation for ${validParts.length} valid parts:`, validParts);

    let currentIndex = 0;
    const processNextPart = async () => {
      if (currentIndex >= validParts.length) {
        console.log("✅ Completed typing simulation");
        setBusy(false);
        setTyping(false);
        setTypingEmotion('neutral');
        typingProcessRef.current = null;
        return;
      }

      const part = validParts[currentIndex];
      
      // Final safety check before processing each part
      if (!part || !part.text || part.text.trim() === '') {
        console.warn(`⚠️ Skipping invalid part at index ${currentIndex}:`, part);
        currentIndex++;
        typingProcessRef.current = setTimeout(processNextPart, 100);
        return;
      }

      console.log(`✅ Processing part ${currentIndex + 1}/${validParts.length}:`, {
        text: part.text,
        pause: part.pause,
        speed: part.speed,
        emotion: part.emotion
      });
      
      // Pause before typing
      await sleep(part.pause || 1000);
      
      // Show typing indicator with emotion
      setTyping(true);
      setTypingEmotion(part.emotion || 'neutral');
      
      // Calculate typing time based on text length and speed
      const typingTime = part.text.length * (CONSTANTS.TYPING_SPEEDS[part.speed] || CONSTANTS.TYPING_SPEEDS.normal);
      await sleep(typingTime);
      
      // Hide typing indicator
      setTyping(false);
      
      // Add the message
      addMessage(part.text, 'bonnie');
      
      // Move to next part
      currentIndex++;
      typingProcessRef.current = setTimeout(processNextPart, 400);
    };

    // Start processing
    setBusy(true);
    processNextPart();
  }, [online, addMessage]);

  // Enhanced send function with bond tracking
  const handleSend = useCallback(async (text) => {
    if (!text?.trim()) return;
    
    const messageText = text.trim();
    setInput('');
    setBusy(true);
    
    // Reset idle message flag when user sends a message
    setHasFiredIdleMessage(false);
    
    await addMessage(messageText, 'user');
    
    // If offline, show a bond-based fallback message
    if (!online) {
      setBusy(false);
      const fallbackMessage = userProfile.bondScore >= 40 
        ? "I'm having connection issues, but I'm still here for you, darling 💕<EOM::pause=1500 speed=normal emotion=warm>"
        : "I'm having connection issues right now, but I'm still here with you! 💕<EOM::pause=1000 speed=normal emotion=playful>";
      
      setTimeout(() => {
        simulateBonnieTyping(fallbackMessage);
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
          mood_state: userProfile.moodState,
          timestamp: Date.now()
        })
      });
      
      // Update bond score if returned
      if (response.bond_score !== undefined) {
        setUserProfile(prev => ({ ...prev, bondScore: response.bond_score }));
      }
      
      simulateBonnieTyping(response.reply);
    } catch (err) {
      console.error('Failed to send message:', err);
      setBusy(false);
      simulateBonnieTyping("Oops… I'm having some technical difficulties, but I'm still here! 💔<EOM::pause=1200 speed=normal emotion=apologetic>");
    }
  }, [sessionId, makeRequest, online, simulateBonnieTyping, addMessage, userProfile]);

  // Keyboard event handler
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  }, [input, handleSend]);

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

  return (
    <div style={containerStyle}>
      {/* Header */}
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
            {userProfile.bondScore >= 60 ? "Your devoted companion 💕" : 
             userProfile.bondScore >= 30 ? "Getting to know you better 😘" : 
             "Flirty. Fun. Dangerously charming."}
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

      {/* Messages */}
      <main style={messagesContainerStyle} role="log" aria-label="Chat messages">
        {messages.map((message) => (
          <Message 
            key={message.id} 
            message={message} 
            isUser={message.sender === 'user'} 
          />
        ))}
        {typing && online && <TypingIndicator emotion={typingEmotion} />}
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

      {/* Input */}
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
          placeholder={online ? (userProfile.userName ? `Tell me more, ${userProfile.userName}...` : "Type something…") : "Type something… (offline mode)"}
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

// Enhanced CSS with emotion-based animations
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

/* Focus styles for accessibility */
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