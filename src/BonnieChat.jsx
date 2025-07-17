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

export default function BonnieChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [typing, setTyping] = useState(false);
  const [currentPersonality, setCurrentPersonality] = useState(CONSTANTS.PERSONALITY_LAYERS.PLAYFUL);
  const [currentSentiment, setCurrentSentiment] = useState({ primary: 'neutral', intensity: 0 });
  const [online, setOnline] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const sessionId = useMemo(() => generateSessionId(), []);

  const { makeRequest, isLoading, error } = useApiCall();

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
    setTimeout(() => {
      addMessage(reply, 'bonnie', personality, sentiment);
      setTyping(false);
    }, 1000);
  }, [addMessage]);

  const handleSend = useCallback(async (text) => {
    if (!text?.trim()) return;
    const userSentiment = analyzeSentiment(text);
    const adaptedPersonality = selectPersonality(userProfile.bondScore, userSentiment, userProfile.conversationHistory);

    setCurrentPersonality(adaptedPersonality);
    setCurrentSentiment(userSentiment);

    addMessage(text.trim(), 'user');
    
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
  }, [sessionId, makeRequest, online, simulateBonnieTyping, addMessage]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <header>
        <h1>Bonnie Chat</h1>
      </header>
      <main>
        <div>
          {messages.map((m, i) => (
            <div key={i} style={{ backgroundColor: m.sender === 'user' ? '#e91e63' : '#ffe6f0' }}>
              {m.text}
            </div>
          ))}
        </div>
      </main>
      <footer>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend(input)}
          disabled={isLoading || busy}
        />
        <button onClick={() => handleSend(input)} disabled={isLoading || busy}>
          Send
        </button>
      </footer>
    </div>
  );
}
