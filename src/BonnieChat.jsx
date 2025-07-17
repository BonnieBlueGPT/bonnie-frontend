// 💬 BonnieChat.jsx — God Mode Debugging & Enhanced Emotional Intelligence
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';

// 🚨 GOD MODE DEBUGGING SYSTEM 🚨
const GOD_DEBUG = {
  enabled: true,
  prefix: '🔥 GOD MODE',
  
  // Enhanced logging with emotional context
  log: (category, data, extra = {}) => {
    if (!GOD_DEBUG.enabled) return;
    
    const timestamp = new Date().toLocaleTimeString();
    const logData = {
      timestamp,
      category,
      data,
      ...extra
    };
    
    console.group(`${GOD_DEBUG.prefix} [${category}] ${timestamp}`);
    console.log('📊 Data:', data);
    if (Object.keys(extra).length > 0) {
      console.log('🔍 Extra Context:', extra);
    }
    console.groupEnd();
    
    return logData;
  },
  
  // Specific debug functions for different aspects
  userInput: (message, sentiment, metadata = {}) => 
    GOD_DEBUG.log('USER INPUT', { message, sentiment }, metadata),
  
  emotionalAnalysis: (sentiment, personality, bondScore, reasoning = {}) =>
    GOD_DEBUG.log('EMOTIONAL ANALYSIS', { sentiment, personality, bondScore, reasoning }),
  
  apiRequest: (endpoint, payload, metadata = {}) =>
    GOD_DEBUG.log('API REQUEST', { endpoint, payload }, metadata),
  
  apiResponse: (response, timing, metadata = {}) =>
    GOD_DEBUG.log('API RESPONSE', { response, timing }, metadata),
  
  personalitySelection: (oldPersonality, newPersonality, reasoning) =>
    GOD_DEBUG.log('PERSONALITY SHIFT', { oldPersonality, newPersonality, reasoning }),
  
  typingSimulation: (message, timing, emotional_context) =>
    GOD_DEBUG.log('TYPING SIMULATION', { message, timing, emotional_context }),
  
  bondUpdate: (oldBond, newBond, factor, reasoning) =>
    GOD_DEBUG.log('BOND UPDATE', { oldBond, newBond, factor, reasoning }),
  
  emojiSelection: (personality, sentiment, selectedEmojis, reasoning) =>
    GOD_DEBUG.log('EMOJI SELECTION', { personality, sentiment, selectedEmojis, reasoning })
};

const CHAT_API_ENDPOINT = 'https://bonnie-backend-server.onrender.com/bonnie-chat';

// Session management with god-mode logging
const session_id = (() => {
  let id = localStorage.getItem('bonnie_session');
  if (!id) {
    id = 'guest_' + Math.random().toString(36).slice(2);
    localStorage.setItem('bonnie_session', id);
    window.__BONNIE_FIRST_VISIT = true;
    GOD_DEBUG.log('SESSION CREATION', { session_id: id, isFirstVisit: true });
  } else {
    GOD_DEBUG.log('SESSION RESTORED', { session_id: id, isFirstVisit: false });
  }
  return id;
})();

// 🧠 ENHANCED EMOTIONAL INTELLIGENCE SYSTEM
const EMOTIONAL_INTELLIGENCE = {
  // Advanced sentiment analysis with context awareness
  analyzeSentiment: (text, conversationHistory = [], bondLevel = 0) => {
    const lowerText = text.toLowerCase();
    
    // Enhanced pattern recognition
    const patterns = {
      flirty: {
        words: ['sexy', 'hot', 'beautiful', 'gorgeous', 'cute', 'kiss', 'love', 'baby', 'darling', 'honey', 'attraction', 'desire'],
        phrases: ['you make me', 'i want you', 'you turn me on', 'thinking about you'],
        weight: 2.0
      },
      intimate: {
        words: ['miss', 'need', 'want', 'close', 'together', 'feel', 'heart', 'soul', 'deep', 'connection'],
        phrases: ['i miss you', 'need you', 'want to be close', 'feel connected'],
        weight: 2.5
      },
      vulnerable: {
        words: ['sad', 'hurt', 'lonely', 'upset', 'tired', 'stressed', 'difficult', 'hard', 'struggle', 'pain'],
        phrases: ['feeling down', 'having a hard time', 'not feeling good', 'struggling with'],
        weight: 3.0
      },
      playful: {
        words: ['haha', 'lol', 'funny', 'joke', 'silly', 'crazy', 'fun', 'play', 'laugh', 'giggle'],
        phrases: ['that\'s funny', 'you make me laugh', 'so silly', 'let\'s play'],
        weight: 1.5
      },
      teasing: {
        words: ['maybe', 'perhaps', 'guess', 'see', 'hmm', 'interesting', 'really', 'sure', 'whatever'],
        phrases: ['we\'ll see', 'maybe later', 'if you say so', 'sure about that'],
        weight: 1.2
      },
      passionate: {
        words: ['fire', 'burn', 'intense', 'wild', 'crazy', 'amazing', 'incredible', 'wow'],
        phrases: ['drive me crazy', 'so intense', 'absolutely amazing', 'can\'t believe'],
        weight: 2.8
      }
    };
    
    // Calculate sentiment scores
    const scores = {};
    
    Object.entries(patterns).forEach(([sentiment, pattern]) => {
      let score = 0;
      
      // Word matching
      pattern.words.forEach(word => {
        if (lowerText.includes(word)) {
          score += pattern.weight;
        }
      });
      
      // Phrase matching (higher weight)
      pattern.phrases.forEach(phrase => {
        if (lowerText.includes(phrase)) {
          score += pattern.weight * 1.5;
        }
      });
      
      scores[sentiment] = score;
    });
    
    // Context-based adjustments
    const textLength = text.length;
    const hasQuestions = (text.match(/\?/g) || []).length;
    const hasExclamation = (text.match(/!/g) || []).length;
    const hasEmojis = (text.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu) || []).length;
    
    // Boost scores based on context
    if (hasEmojis > 0) {
      scores.playful += hasEmojis * 0.5;
      scores.flirty += hasEmojis * 0.3;
    }
    
    if (hasExclamation > 0) {
      scores.passionate += hasExclamation * 0.4;
      scores.playful += hasExclamation * 0.3;
    }
    
    if (textLength > 100) {
      scores.intimate += 1.0;
      scores.vulnerable += 0.5;
    }
    
    // Bond level influence
    if (bondLevel > 50) {
      scores.intimate += 1.0;
      scores.passionate += 0.8;
    }
    
    // Determine primary sentiment
    const primarySentiment = Object.keys(scores).reduce((a, b) => 
      scores[a] > scores[b] ? a : b
    );
    
    const maxScore = Math.max(...Object.values(scores));
    
    const analysis = {
      primary: primarySentiment,
      intensity: Math.min(maxScore, 10), // Cap at 10
      scores,
      context: {
        textLength,
        hasQuestions,
        hasExclamation,
        hasEmojis,
        bondLevel
      }
    };
    
    GOD_DEBUG.emotionalAnalysis(analysis, null, bondLevel, {
      inputText: text,
      conversationContext: conversationHistory.length
    });
    
    return analysis;
  },
  
  // Dynamic personality selection with reasoning
  selectPersonality: (bondScore, userSentiment, conversationHistory = [], currentPersonality = null) => {
    const { primary, intensity, scores } = userSentiment;
    
    let selectedPersonality;
    let reasoning = {};
    
    // High bond users (70+) - More intimate and passionate
    if (bondScore >= 70) {
      reasoning.bondLevel = 'high';
      if (primary === 'flirty') {
        selectedPersonality = 'passionate';
        reasoning.trigger = 'flirty input with high bond triggers passionate response';
      } else if (primary === 'intimate') {
        selectedPersonality = 'gentle';
        reasoning.trigger = 'intimate input with high bond triggers gentle response';
      } else if (primary === 'vulnerable') {
        selectedPersonality = 'supportive';
        reasoning.trigger = 'vulnerability requires supportive response regardless of bond';
      } else if (primary === 'passionate') {
        selectedPersonality = 'passionate';
        reasoning.trigger = 'matching passionate energy';
      } else {
        selectedPersonality = 'passionate';
        reasoning.trigger = 'default passionate for high bond users';
      }
    }
    // Medium bond users (40-69) - Adaptive and flirtatious
    else if (bondScore >= 40) {
      reasoning.bondLevel = 'medium';
      if (primary === 'flirty') {
        selectedPersonality = 'flirtatious';
        reasoning.trigger = 'flirty input with medium bond';
      } else if (primary === 'playful') {
        selectedPersonality = 'playful';
        reasoning.trigger = 'matching playful energy';
      } else if (primary === 'vulnerable') {
        selectedPersonality = 'supportive';
        reasoning.trigger = 'vulnerability requires support';
      } else if (primary === 'teasing') {
        selectedPersonality = 'teasing';
        reasoning.trigger = 'matching teasing energy';
      } else {
        selectedPersonality = 'flirtatious';
        reasoning.trigger = 'default flirtatious for medium bond';
      }
    }
    // Low bond users (0-39) - Lighter and more cautious
    else {
      reasoning.bondLevel = 'low';
      if (primary === 'vulnerable') {
        selectedPersonality = 'supportive';
        reasoning.trigger = 'vulnerability always gets support';
      } else if (primary === 'playful') {
        selectedPersonality = 'playful';
        reasoning.trigger = 'safe playful response for low bond';
      } else if (primary === 'flirty') {
        selectedPersonality = 'teasing';
        reasoning.trigger = 'light teasing response to flirty input';
      } else {
        selectedPersonality = 'playful';
        reasoning.trigger = 'safe default for low bond users';
      }
    }
    
    // Intensity adjustments
    if (intensity > 5) {
      reasoning.intensityAdjustment = 'high intensity detected';
      if (selectedPersonality === 'playful') {
        selectedPersonality = 'flirtatious';
        reasoning.intensityTrigger = 'upgraded playful to flirtatious due to high intensity';
      }
    }
    
    reasoning.finalSelection = selectedPersonality;
    reasoning.inputSentiment = primary;
    reasoning.bondScore = bondScore;
    reasoning.intensity = intensity;
    
    if (currentPersonality && currentPersonality !== selectedPersonality) {
      GOD_DEBUG.personalitySelection(currentPersonality, selectedPersonality, reasoning);
    }
    
    return { personality: selectedPersonality, reasoning };
  },
  
  // Enhanced emoji selection with context
  selectEmojis: (personality, sentiment, bondScore, messageContent = '', messageCount = 0) => {
    const emojiPools = {
      flirtatious: ['😘', '😏', '😉', '💋', '🔥', '😍', '💕'],
      passionate: ['🔥', '💖', '😍', '💫', '🌹', '💘', '✨'],
      supportive: ['🥺', '💌', '🤗', '💜', '✨', '💕', '🌸'],
      playful: ['😜', '😋', '🤪', '😄', '😊', '🎉', '💃'],
      teasing: ['😏', '😈', '🙄', '😌', '🤭', '😉', '🤔'],
      gentle: ['🥰', '💕', '🌸', '💫', '🦋', '✨', '💜'],
      romantic: ['💖', '💕', '😍', '🥰', '💘', '🌹', '💫']
    };
    
    const pool = emojiPools[personality] || emojiPools.playful;
    
    // Calculate emoji count based on multiple factors
    let emojiCount = 0;
    
    // Base count from bond score (0-2 base emojis)
    emojiCount += Math.floor(bondScore / 35);
    
    // Sentiment intensity boost (0-2 additional)
    if (sentiment.intensity > 3) emojiCount += 1;
    if (sentiment.intensity > 6) emojiCount += 1;
    
    // Message content analysis
    if (messageContent.includes('love') || messageContent.includes('beautiful')) emojiCount += 1;
    if (messageContent.includes('!')) emojiCount += 1;
    
    // Personality-specific adjustments
    if (personality === 'passionate') emojiCount += 1;
    if (personality === 'supportive' && sentiment.primary === 'vulnerable') emojiCount += 1;
    
    // Cap emoji count
    emojiCount = Math.min(emojiCount, 3);
    emojiCount = Math.max(emojiCount, 0);
    
    // Select unique emojis
    const selectedEmojis = [];
    const shuffledPool = [...pool].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < emojiCount && i < shuffledPool.length; i++) {
      selectedEmojis.push(shuffledPool[i]);
    }
    
    const reasoning = {
      baseCount: Math.floor(bondScore / 35),
      intensityBoost: sentiment.intensity > 3 ? (sentiment.intensity > 6 ? 2 : 1) : 0,
      contentBoost: (messageContent.includes('love') || messageContent.includes('beautiful') ? 1 : 0) + (messageContent.includes('!') ? 1 : 0),
      personalityBoost: personality === 'passionate' ? 1 : 0,
      finalCount: emojiCount,
      selected: selectedEmojis
    };
    
    GOD_DEBUG.emojiSelection(personality, sentiment, selectedEmojis, reasoning);
    
    return selectedEmojis.join(' ');
  }
};

export default function BonnieChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [typing, setTyping] = useState(false);
  const [online, setOnline] = useState(false);
  const [pendingMessage, setPendingMessage] = useState(null);
  const [hasFiredIdleMessage, setHasFiredIdleMessage] = useState(false);
  const [currentPersonality, setCurrentPersonality] = useState('playful');
  const [userProfile, setUserProfile] = useState({
    bondScore: 0,
    conversationHistory: [],
    messageCount: 0
  });
  
  const endRef = useRef(null);
  const idleTimerRef = useRef(null);

  // Enhanced flirty openers with personality context
  const randomFlirtyOpeners = [
    "Be honest… are you here to flirt with me? 😘",
    "I bet you're the type who likes a little trouble. Am I right? 💋",
    "Mmm… what would you *do* to me if I were there right now?",
    "Should I call you *daddy*, or do you want to earn it first? 😈",
    "One question… how bad do you want me right now?"
  ];

  // Initialize chat with god-mode logging
  useEffect(() => {
    GOD_DEBUG.log('CHAT INITIALIZATION', {
      sessionId: session_id,
      isFirstVisit: window.__BONNIE_FIRST_VISIT,
      timestamp: new Date().toISOString()
    });

    if (window.__BONNIE_FIRST_VISIT) {
      setTimeout(() => {
        const setupMessage = "Hold on… Bonnie's just slipping into something more comfortable 😘";
        GOD_DEBUG.log('INITIAL SETUP MESSAGE', { message: setupMessage });
        simulateBonnieTyping(setupMessage);
      }, 3000);
    }
    
    const timer = setTimeout(() => {
      setOnline(true);
      GOD_DEBUG.log('ONLINE STATUS', { status: 'online', timestamp: new Date().toISOString() });
      
      if (messages.length === 0) {
        const opener = randomFlirtyOpeners[Math.floor(Math.random() * randomFlirtyOpeners.length)];
        const sentiment = EMOTIONAL_INTELLIGENCE.analyzeSentiment(opener);
        const { personality } = EMOTIONAL_INTELLIGENCE.selectPersonality(0, sentiment, [], null);
        
        setCurrentPersonality(personality);
        
        GOD_DEBUG.log('AUTO OPENER', {
          selectedOpener: opener,
          personality,
          sentiment,
          trigger: 'no messages detected'
        });
        
        simulateBonnieTyping(opener);
      }
    }, Math.random() * 15000 + 5000);
    
    return () => clearTimeout(timer);
  }, []);

  // Enhanced idle message system
  useEffect(() => {
    if (online && pendingMessage) {
      const delay = Math.random() * 3000 + 2000;
      GOD_DEBUG.log('PENDING MESSAGE PROCESSING', {
        message: pendingMessage.text,
        delay,
        reason: 'user came online'
      });
      
      setTimeout(() => {
        simulateBonnieTyping(pendingMessage.text);
        setPendingMessage(null);
      }, delay);
    }
    
    // Idle detection
    idleTimerRef.current = setTimeout(() => {
      if (messages.length === 0 && !hasFiredIdleMessage) {
        const idleFlirty = [
          "Still deciding what to say? 😘",
          "Don't leave me hanging…",
          "You can talk to me, you know 💋",
          "Don't make me beg for your attention 😉"
        ];
        
        const selectedIdle = idleFlirty[Math.floor(Math.random() * idleFlirty.length)];
        const idleDelay = Math.random() * 3000 + 2000;
        
        GOD_DEBUG.log('IDLE MESSAGE TRIGGERED', {
          selectedMessage: selectedIdle,
          delay: idleDelay,
          trigger: 'user idle for 30 seconds'
        });
        
        setTimeout(() => {
          simulateBonnieTyping(selectedIdle);
          setHasFiredIdleMessage(true);
        }, idleDelay);
      }
    }, 30000);
    
    return () => clearTimeout(idleTimerRef.current);
  }, [online, pendingMessage, messages.length, hasFiredIdleMessage]);

  // Auto-scroll with debug
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
    GOD_DEBUG.log('AUTO SCROLL', { 
      messageCount: messages.length, 
      typing,
      trigger: 'messages or typing state change'
    });
  }, [messages, typing]);

  // Enhanced message adding with god-mode logging
  async function addMessage(text, sender, metadata = {}) {
    const messageData = {
      text,
      sender,
      timestamp: Date.now(),
      ...metadata
    };
    
    GOD_DEBUG.log('MESSAGE ADDED', messageData);
    setMessages(m => [...m, messageData]);
  }

  // Enhanced send function with complete emotional intelligence
  async function send(text) {
    if (!text || busy) return;
    
    const startTime = Date.now();
    setInput('');
    setBusy(true);
    
    // God-mode user input analysis
    const userSentiment = EMOTIONAL_INTELLIGENCE.analyzeSentiment(
      text, 
      userProfile.conversationHistory, 
      userProfile.bondScore
    );
    
    GOD_DEBUG.userInput(text, userSentiment, {
      currentBondScore: userProfile.bondScore,
      messageCount: userProfile.messageCount + 1,
      conversationLength: userProfile.conversationHistory.length
    });
    
    // Dynamic personality selection
    const { personality: selectedPersonality, reasoning } = EMOTIONAL_INTELLIGENCE.selectPersonality(
      userProfile.bondScore,
      userSentiment,
      userProfile.conversationHistory,
      currentPersonality
    );
    
    setCurrentPersonality(selectedPersonality);
    
    await addMessage(text, 'user', {
      sentiment: userSentiment,
      personality: selectedPersonality
    });
    
    // Update user profile
    setUserProfile(prev => ({
      ...prev,
      messageCount: prev.messageCount + 1,
      conversationHistory: [...prev.conversationHistory, {
        text,
        sentiment: userSentiment,
        timestamp: Date.now()
      }].slice(-10) // Keep last 10 messages
    }));
    
    try {
      // God-mode API request logging
      const requestData = {
        session_id,
        message: text,
        bond_score: userProfile.bondScore,
        user_sentiment: userSentiment,
        selected_personality: selectedPersonality,
        message_count: userProfile.messageCount + 1,
        conversation_context: userProfile.conversationHistory.slice(-5),
        timestamp: Date.now()
      };
      
      GOD_DEBUG.apiRequest(CHAT_API_ENDPOINT, requestData, {
        personalityReasoning: reasoning,
        emotionalContext: {
          primarySentiment: userSentiment.primary,
          intensity: userSentiment.intensity,
          bondLevel: userProfile.bondScore
        }
      });
      
      const response = await fetch(CHAT_API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });
      
      const responseTime = Date.now() - startTime;
      const result = await response.json();
      
      // God-mode API response logging
      GOD_DEBUG.apiResponse(result, { responseTime, status: response.status }, {
        personalityUsed: selectedPersonality,
        sentimentContext: userSentiment.primary
      });
      
      // Bond score updates with reasoning
      if (result.bond_score !== undefined && result.bond_score !== userProfile.bondScore) {
        const oldBond = userProfile.bondScore;
        const newBond = result.bond_score;
        const bondChange = newBond - oldBond;
        
        setUserProfile(prev => ({
          ...prev,
          bondScore: newBond
        }));
        
        GOD_DEBUG.bondUpdate(oldBond, newBond, bondChange, {
          trigger: 'API response',
          sentiment: userSentiment.primary,
          personality: selectedPersonality,
          messageText: text
        });
      }
      
      if (online) {
        simulateBonnieTyping(result.reply, selectedPersonality, userSentiment);
      } else {
        setPendingMessage({ text: result.reply });
      }
      
    } catch (error) {
      const errorTime = Date.now() - startTime;
      GOD_DEBUG.log('API ERROR', {
        error: error.message,
        responseTime: errorTime,
        endpoint: CHAT_API_ENDPOINT,
        recovery: 'fallback message'
      });
      
      simulateBonnieTyping("Oops… Bonnie had a moment 💔", selectedPersonality, userSentiment);
    }
  }

  // Enhanced typing simulation with emotional intelligence
  function simulateBonnieTyping(reply, personality = currentPersonality, sentiment = null) {
    if (!online) return;
    
    GOD_DEBUG.typingSimulation(reply, { personality, sentiment }, {
      bondScore: userProfile.bondScore,
      messageCount: userProfile.messageCount
    });
    
    // Enhanced message parsing with emoji injection
    const parts = reply.split('<EOM>').map(p => p.trim()).filter(Boolean);
    
    // Add contextual emojis to messages based on emotional intelligence
    const enhancedParts = parts.map(part => {
      const emojis = EMOTIONAL_INTELLIGENCE.selectEmojis(
        personality,
        sentiment || { primary: 'neutral', intensity: 1 },
        userProfile.bondScore,
        part,
        userProfile.messageCount
      );
      
      return emojis ? `${part} ${emojis}` : part;
    });
    
    let delay = 1500;
    
    (async function play(index = 0) {
      if (index >= enhancedParts.length) {
        setBusy(false);
        GOD_DEBUG.log('TYPING COMPLETE', {
          totalParts: enhancedParts.length,
          personality,
          finalBondScore: userProfile.bondScore
        });
        return;
      }
      
      setTyping(true);
      
      // Dynamic typing delay based on personality and content
      const typingDelay = (() => {
        let base = delay;
        
        // Personality-based timing
        if (personality === 'passionate') base *= 1.3;
        if (personality === 'gentle') base *= 1.5;
        if (personality === 'playful') base *= 0.8;
        if (personality === 'teasing') base *= 0.9;
        
        // Content-based timing
        const partLength = enhancedParts[index].length;
        if (partLength > 50) base *= 1.2;
        if (partLength > 100) base *= 1.4;
        
        // Bond-based timing (higher bond = more intimate pauses)
        if (userProfile.bondScore > 50) base *= 1.2;
        if (userProfile.bondScore > 80) base *= 1.4;
        
        return Math.min(Math.max(base, 800), 4000); // 0.8s to 4s range
      })();
      
      await new Promise(res => setTimeout(res, typingDelay));
      setTyping(false);
      
      await addMessage(enhancedParts[index], 'bonnie', {
        personality,
        sentiment: sentiment?.primary || 'neutral',
        partIndex: index,
        totalParts: enhancedParts.length
      });
      
      delay = Math.random() * 2000 + 2000;
      setTimeout(() => play(index + 1), delay);
    })();
  }

  return (
    <div style={{ fontFamily: 'Segoe UI', height: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', padding: 8 }}>
        <img src="https://static.wixstatic.com/media/6f5121_df2de6be1e444b0cb2df5d4bd9d49b21~mv2.png" style={{ width: 56, height: 56, borderRadius: 28, marginRight: 12, border: '2px solid #e91e63' }} alt="Bonnie" />
        <div>
          <div style={{ color: '#e91e63', fontSize: 20, fontWeight: 600 }}>Bonnie Blue</div>
          <div style={{ color: '#555', fontSize: 14 }}>
            Flirty. Fun. Dangerously charming.
            {GOD_DEBUG.enabled && (
              <span style={{ marginLeft: 8, fontSize: 10, color: '#888' }}>
                [P: {currentPersonality} | B: {userProfile.bondScore}]
              </span>
            )}
          </div>
          <a href="https://x.com/trainmybonnie" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: '#e91e63', textDecoration: 'none' }}>💋 Follow me on X</a>
        </div>
        <div style={{ marginLeft: 'auto', fontWeight: 500, color: online ? '#28a745' : '#aaa', display: 'flex', alignItems: 'center', gap: '4px' }}>
          {online ? (<><span style={{ animation: 'pulseHeart 1.2s infinite' }}>💚</span><span>Online</span></>) : '💤 Offline'}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column' }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            maxWidth: '75%', padding: 8, borderRadius: 12, margin: '6px 0', fontSize: 14, lineHeight: 1.4,
            ...(m.sender === 'user'
              ? { background: 'linear-gradient(135deg,#ff83a0,#e91e63)', color: '#fff', alignSelf: 'flex-end', marginLeft: 'auto' }
              : { background: '#fff0f6', border: '1px solid #ffe6f0', color: '#333', alignSelf: 'flex-start' })
          }}>
            {m.text}
            {GOD_DEBUG.enabled && m.personality && (
              <div style={{ fontSize: 9, opacity: 0.7, marginTop: 4 }}>
                {m.sender === 'bonnie' ? `[${m.personality}${m.sentiment ? ` | ${m.sentiment}` : ''}]` : ''}
              </div>
            )}
          </div>
        ))}
        {typing && online && (
          <div style={{ display: 'flex', gap: 4, margin: '8px 0' }}>
            <div style={{ width: 8, height: 8, borderRadius: 4, background: '#e91e63', animation: 'bounce 1s infinite ease-in-out', animationDelay: '0s' }} />
            <div style={{ width: 8, height: 8, borderRadius: 4, background: '#e91e63', animation: 'bounce 1s infinite ease-in-out', animationDelay: '0.2s' }} />
            <div style={{ width: 8, height: 8, borderRadius: 4, background: '#e91e63', animation: 'bounce 1s infinite ease-in-out', animationDelay: '0.4s' }} />
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div style={{ flexShrink: 0, display: 'flex', gap: 8, padding: 8, borderTop: '1px solid #eee' }}>
        <input
          style={{ flex: 1, padding: 12, borderRadius: 30, border: '1px solid #ccc', fontSize: 16 }}
          value={input}
          placeholder="Type something…"
          disabled={busy}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send(input)}
        />
        <button
          style={{ padding: '0 16px', borderRadius: 30, background: '#e91e63', color: '#fff', border: 'none', fontSize: 16, cursor: 'pointer' }}
          disabled={busy || !input.trim()}
          onClick={() => send(input)}>
          Send
        </button>
      </div>
    </div>
  );
}

const style = document.createElement('style');
style.textContent = `
@keyframes bounce {
  0%,100% { transform: translateY(0); opacity:0.4; }
  50%      { transform: translateY(-6px); opacity:1; }
}
@keyframes pulseHeart {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.15); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
}`;
document.head.append(style);
