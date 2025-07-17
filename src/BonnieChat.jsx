import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';

// Constants with Emotional Intelligence
const CONSTANTS = {
  API_ENDPOINTS: {
    CHAT: 'https://bonnie-backend-server.onrender.com/bonnie-chat',
  },
  COLORS: {
    primary: '#e91e63',
    gradient: 'linear-gradient(135deg, #e91e63 0%, #ff6ec7 100%)',
    online: '#28a745',
    offline: '#aaa',
    surface: '#ffffff',
    border: '#ffe6f0',
    text: '#333',
    textLight: '#666',
    shadow: 'rgba(233, 30, 99, 0.15)',
  },
};

// Seductive CSS-in-JS Styles
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100vw',
    background: `linear-gradient(135deg, #fff0f6 0%, #fce4ec 50%, #fff0f6 100%)`,
    fontFamily: `'Segoe UI', sans-serif`,
    overflow: 'hidden',
    position: 'relative',
  },

  header: {
    background: CONSTANTS.COLORS.gradient,
    padding: '1rem',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    boxShadow: `0 4px 20px ${CONSTANTS.COLORS.shadow}`,
    position: 'relative',
    zIndex: 10,
    borderBottom: '2px solid #d81b60',
  },

  profileImage: {
    width: 'clamp(48px, 12vw, 56px)',
    height: 'clamp(48px, 12vw, 56px)',
    borderRadius: '50%',
    marginRight: '0.75rem',
    border: '2px solid white',
    flexShrink: 0,
  },

  profileInfo: {
    flex: 1,
    minWidth: 0,
  },

  profileName: {
    fontSize: 'clamp(1.1rem, 4vw, 1.25rem)',
    fontWeight: '600',
    margin: 0,
    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
  },

  profileLink: {
    fontSize: 'clamp(0.7rem, 2.5vw, 0.75rem)',
    color: '#fff0f6',
    textDecoration: 'none',
    opacity: 0.8,
    transition: 'opacity 0.3s ease',
  },

  statusIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    fontWeight: '500',
    fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
    flexShrink: 0,
  },

  chatContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    position: 'relative',
  },

  messagesArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    scrollBehavior: 'smooth',
    WebkitOverflowScrolling: 'touch',
  },

  message: {
    maxWidth: '85%',
    padding: '0.75rem 1rem',
    borderRadius: '1.5rem',
    position: 'relative',
    wordBreak: 'break-word',
    animation: 'slideIn 0.3s ease-out',
    fontSize: 'clamp(0.9rem, 3.5vw, 1rem)',
    lineHeight: '1.4',
  },

  userMessage: {
    alignSelf: 'flex-end',
    background: CONSTANTS.COLORS.gradient,
    color: 'white',
    borderBottomRightRadius: '0.5rem',
    boxShadow: `0 2px 8px ${CONSTANTS.COLORS.shadow}`,
    marginLeft: 'auto',
  },

  bonnieMessage: {
    alignSelf: 'flex-start',
    background: CONSTANTS.COLORS.surface,
    color: CONSTANTS.COLORS.text,
    borderBottomLeftRadius: '0.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    border: `1px solid ${CONSTANTS.COLORS.border}`,
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
    animation: 'slideIn 0.3s ease-out',
    gap: '0.5rem',
  },

  typingDots: {
    display: 'flex',
    gap: '0.25rem',
    alignItems: 'center',
  },

  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: CONSTANTS.COLORS.primary,
    animation: 'bounce 1.4s infinite',
  },

  inputContainer: {
    padding: '1rem',
    background: CONSTANTS.COLORS.surface,
    borderTop: `1px solid ${CONSTANTS.COLORS.border}`,
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
    boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
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
    color: CONSTANTS.COLORS.text,
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
    justifyContent: 'center',
  },
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

    @keyframes pulseHeart {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.15); opacity: 0.8; }
      100% { transform: scale(1); opacity: 1; }
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

// Session ID with localStorage persistence
const generateSessionId = () => {
  let id = localStorage.getItem('bonnie_session');
  if (!id) {
    id = 'guest_' + Math.random().toString(36).slice(2);
    localStorage.setItem('bonnie_session', id);
  }
  return id;
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
    [CONSTANTS.SENTIMENT_TYPES.VULNERABLE]: sadScore * 2,
  };

  const primarySentiment = Object.keys(scores).reduce((a, b) =>
    scores[a] > scores[b] ? a : b
  );

  return {
    primary: primarySentiment,
    intensity: Math.max(...Object.values(scores)),
    scores,
  };
};

export default function BonnieChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [typing, setTyping] = useState(false);
  const [online, setOnline] = useState(false);
  const [pendingMessage, setPendingMessage] = useState(null);
  const [currentPersonality, setCurrentPersonality] = useState(CONSTANTS.PERSONALITY_LAYERS.PLAYFUL);
  const endRef = useRef(null);

  const randomFlirtyOpeners = useMemo(() => [
    "Be honest… are you here to flirt with me? 😘",
    "I bet you’re the type who likes a little trouble. Am I right? 💋",
    "Mmm… what would you *do* to me if I were there right now?",
    "Should I call you *daddy*, or do you want to earn it first? 😈",
    "One question… how bad do you want me right now?"
  ], []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOnline(true);
      if (messages.length === 0) {
        const opener = randomFlirtyOpeners[Math.floor(Math.random() * randomFlirtyOpeners.length)];
        simulateBonnieTyping(opener);
      }
    }, Math.random() * 15000 + 5000);
    return () => clearTimeout(timer);
  }, [messages.length, randomFlirtyOpeners]);

  const simulateBonnieTyping = (reply) => {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((prevMessages) => [...prevMessages, { sender: 'bonnie', text: reply }]);
    }, 2000);
  };

  const handleSend = async () => {
    if (!input || busy) return;
    setInput('');
    setBusy(true);
    await setMessages((prevMessages) => [...prevMessages, { sender: 'user', text: input }]);
    try {
      const response = await fetch(CONSTANTS.API_ENDPOINTS.CHAT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: generateSessionId(), message: input })
      });
      const { reply } = await response.json();
      simulateBonnieTyping(reply);
    } catch (error) {
      console.error("Error sending message", error);
    }
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <img src="https://static.wixstatic.com/media/6f5121_df2de6be1e444b0cb2df5d4bd9d49b21~mv2.png" alt="Bonnie" style={styles.profileImage} />
        <div style={styles.profileInfo}>
          <div style={styles.profileName}>Bonnie Blue</div>
          <div style={styles.profileTagline}>Flirty. Fun. Dangerously charming.</div>
          <a href="https://x.com/trainmybonnie" target="_blank" rel="noopener noreferrer" style={styles.profileLink}>💋 Follow me on X</a>
        </div>
        <div style={styles.statusIndicator}>
          {online ? <><span style={{ animation: 'pulseHeart 1.2s infinite' }}>💚</span>Online</> : '💤 Offline'}
        </div>
      </header>

      <div style={styles.chatContainer}>
        <div style={styles.messagesArea}>
          {messages.map((message, idx) => (
            <div key={idx} style={{...styles.message, ...(message.sender === 'user' ? styles.userMessage : styles.bonnieMessage)}}>
              {message.text}
            </div>
          ))}
          {typing && <div style={styles.typingIndicator}><div style={styles.typingDots}><div style={styles.dot}></div><div style={styles.dot}></div><div style={styles.dot}></div></div></div>}
          <div ref={endRef} />
        </div>

        <div style={styles.inputContainer}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            style={styles.input}
          />
          <button onClick={handleSend} style={styles.sendButton}>💕</button>
        </div>
      </div>
    </div>
  );
}
