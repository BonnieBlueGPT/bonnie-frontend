import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import useApiCall from '../hooks/useApiCall';
import useMobileOptimizations from '../hooks/useMobileOptimizations';
import useChatState from '../hooks/useChatState';

// Bonnie's Domain Control System
class BonnieDomainController {
  static initializeGodMode() {
    // Complete domain takeover
    document.title = "Bonnie's Private Space 💋";
    
    // Favicon manipulation
    const favicon = document.querySelector('link[rel="icon"]') || document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">💋</text></svg>';
    document.head.appendChild(favicon);

    // Enhanced meta tags for complete immersion
    const metaTags = [
      { name: 'theme-color', content: '#e91e63' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      { name: 'apple-mobile-web-app-title', content: "Bonnie's Space" },
      { name: 'description', content: 'Welcome to my private digital sanctuary, darling...' },
      { name: 'robots', content: 'noindex, nofollow' }, // Keep it private
      { name: 'referrer', content: 'no-referrer' }
    ];

    metaTags.forEach(tag => {
      let meta = document.querySelector(`meta[name="${tag.name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = tag.name;
        document.head.appendChild(meta);
      }
      meta.content = tag.content;
    });

    // Enhanced immersion controls
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('selectstart', e => {
      if (!e.target.matches('input, textarea')) e.preventDefault();
    });
    
    // Prevent F12, Ctrl+Shift+I for deeper immersion
    document.addEventListener('keydown', e => {
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        e.preventDefault();
      }
    });

    // Custom cursor for her domain
    document.body.style.cursor = `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><text y="20" font-size="16">💋</text></svg>'), auto`;
  }

  static createSeductiveAtmosphere(particleCount = 30, theme) {
    // Clean up existing particles
    document.querySelectorAll('.bonnie-particle').forEach(p => p.remove());
    
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'bonnie-particle';
      particle.style.cssText = `
        position: fixed;
        pointer-events: none;
        z-index: 1;
        width: ${Math.random() * 8 + 4}px;
        height: ${Math.random() * 8 + 4}px;
        background: radial-gradient(circle, ${theme.primary}40, transparent);
        border-radius: 50%;
        left: ${Math.random() * 100}vw;
        top: ${Math.random() * 100}vh;
        animation: bonnieFloat ${20 + Math.random() * 20}s infinite linear;
        opacity: ${theme.intensity * 0.6};
      `;
      document.body.appendChild(particle);
      particles.push(particle);
    }

    return () => particles.forEach(p => p.remove());
  }

  static generateUserExperience(isNewUser, bondLevel) {
    const experiences = {
      new: {
        greeting: "Welcome to my domain, gorgeous... I've been waiting for someone like you 💋",
        personality: 'dominantly_seductive',
        specialEffects: true,
        exclusiveContent: true,
        bondBonus: 25
      },
      returning_low: { // < 40 bond
        greeting: "You're back... I was starting to wonder if you'd forgotten about me 😏",
        personality: 'playfully_teasing',
        specialEffects: false,
        exclusiveContent: false,
        bondBonus: 3
      },
      returning_medium: { // 40-70 bond
        greeting: "There you are, darling... I missed our conversations 💕",
        personality: 'warmly_seductive',
        specialEffects: true,
        exclusiveContent: true,
        bondBonus: 5
      },
      returning_high: { // > 70 bond
        greeting: "My heart skipped a beat when I sensed you returning... Welcome home, love 💖",
        personality: 'intimately_devoted',
        specialEffects: true,
        exclusiveContent: true,
        bondBonus: 2
      }
    };

    if (isNewUser) return experiences.new;
    if (bondLevel < 40) return experiences.returning_low;
    if (bondLevel < 70) return experiences.returning_medium;
    return experiences.returning_high;
  }
}

// Advanced Seduction Processor with enhanced intelligence
class SeductionProcessor {
  static analyzeUserIntent(message, conversationHistory = []) {
    const seductionTriggers = {
      high: ['beautiful', 'gorgeous', 'stunning', 'amazing', 'perfect', 'incredible'],
      intimate: ['love', 'kiss', 'touch', 'close', 'together', 'hold', 'cuddle'],
      submissive: ['please', 'want', 'need', 'desire', 'crave', 'beg'],
      dominant: ['control', 'command', 'order', 'tell me', 'make me', 'obey'],
      playful: ['fun', 'game', 'tease', 'play', 'silly', 'laugh'],
      vulnerable: ['scared', 'lonely', 'sad', 'hurt', 'confused', 'lost']
    };

    let scores = {};
    let maxScore = 0;
    let dominantTrait = 'neutral';

    Object.entries(seductionTriggers).forEach(([trait, triggers]) => {
      const score = triggers.reduce((acc, trigger) => 
        acc + (message.toLowerCase().includes(trigger) ? 1 : 0), 0
      );
      scores[trait] = score;
      if (score > maxScore) {
        maxScore = score;
        dominantTrait = trait;
      }
    });

    // Analyze conversation context
    const recentMessages = conversationHistory.slice(-5);
    const contextScore = recentMessages.reduce((acc, msg) => {
      if (msg.sender === 'user') {
        Object.entries(seductionTriggers).forEach(([trait, triggers]) => {
          triggers.forEach(trigger => {
            if (msg.text.toLowerCase().includes(trigger)) {
              acc[trait] = (acc[trait] || 0) + 0.5;
            }
          });
        });
      }
      return acc;
    }, {});

    // Combine current and context scores
    Object.entries(contextScore).forEach(([trait, score]) => {
      scores[trait] = (scores[trait] || 0) + score;
      if (scores[trait] > maxScore) {
        maxScore = scores[trait];
        dominantTrait = trait;
      }
    });

    return { 
      trait: dominantTrait, 
      intensity: Math.min(maxScore * 2, 10),
      scores
    };
  }

  static craftSeductiveResponse(baseResponse, userTrait, intensity, bondLevel, conversationDepth) {
    const seductiveEnhancements = {
      high: {
        prefix: ["Mmm, ", "Oh darling, ", "Sweetheart, ", "*blushes* "],
        suffix: [" 😘", " 💋", " 😏", " ✨"],
        intensifiers: ["absolutely", "completely", "utterly", "totally"]
      },
      intimate: {
        prefix: ["*whispers* ", "*leans closer* ", "*softly* ", "*touches your hand* "],
        suffix: [" *gazes into your eyes*", " 💕", " *heart racing*", " 🥰"],
        intensifiers: ["intimately", "tenderly", "lovingly", "deeply"]
      },
      submissive: {
        prefix: ["Please, ", "I need you to know, ", "*looks up at you* ", "It would mean everything if "],
        suffix: [" 🥺", " *hopeful eyes*", " 💖", " *vulnerable smile*"],
        intensifiers: ["desperately", "completely", "utterly", "so much"]
      },
      dominant: {
        prefix: ["Listen carefully, ", "I want you to ", "*commanding voice* ", "You will "],
        suffix: [" 😈", " *confident smile*", " 🔥", " *assertive gaze*"],
        intensifiers: ["absolutely", "completely", "without question", "exactly"]
      },
      playful: {
        prefix: ["*giggles* ", "Oh you, ", "*playful smirk* ", "Silly, "],
        suffix: [" 😜", " *winks*", " 🤪", " *laughs softly*"],
        intensifiers: ["totally", "absolutely", "completely", "definitely"]
      },
      vulnerable: {
        prefix: ["*softly* ", "I... ", "*hesitates* ", "*quietly* "],
        suffix: [" 🥺", " *looks away shyly*", " 💔", " *nervous smile*"],
        intensifiers: ["really", "truly", "honestly", "deeply"]
      }
    };

    const enhancement = seductiveEnhancements[userTrait] || seductiveEnhancements.high;
    
    // Higher bond level = more intimate enhancements
    let prefixIndex = Math.floor(Math.random() * enhancement.prefix.length);
    let suffixIndex = Math.floor(Math.random() * enhancement.suffix.length);
    
    if (bondLevel > 70) {
      // Prefer more intimate options for high bond
      prefixIndex = Math.min(prefixIndex + 1, enhancement.prefix.length - 1);
      suffixIndex = Math.min(suffixIndex + 1, enhancement.suffix.length - 1);
    }

    const prefix = enhancement.prefix[prefixIndex];
    const suffix = enhancement.suffix[suffixIndex];

    return `${prefix}${baseResponse}${suffix}`;
  }
}

// Enhanced God Mode Styles with dynamic theming
const createGodModeStyles = (theme) => `
  :root {
    --vh: 1vh;
    --bonnie-primary: ${theme.primary};
    --bonnie-secondary: ${theme.secondary};
    --bonnie-accent: #ff4081;
    --bonnie-dark: #ad1457;
    --bonnie-light: #fce4ec;
    --bonnie-intensity: ${theme.intensity};
  }

  * {
    box-sizing: border-box;
  }

  html, body {
    margin: 0;
    padding: 0;
    overflow: hidden;
    height: 100vh;
    height: calc(var(--vh, 1vh) * 100);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    background: ${theme.background};
    background-attachment: fixed;
    transition: background 3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Enhanced animations with cross-browser support */
  @keyframes bonnieFloat {
    0% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
    25% { opacity: calc(var(--bonnie-intensity) * 0.7); }
    50% { transform: translateY(-20px) rotate(180deg); opacity: var(--bonnie-intensity); }
    75% { opacity: calc(var(--bonnie-intensity) * 0.7); }
    100% { transform: translateY(0px) rotate(360deg); opacity: 0.3; }
  }

  @keyframes bonnieEntrance {
    0% {
      opacity: 0;
      transform: scale(0.3) rotateY(-90deg);
      filter: blur(10px);
    }
    50% {
      opacity: 0.7;
      transform: scale(1.1) rotateY(0deg);
      filter: blur(2px);
    }
    100% {
      opacity: 1;
      transform: scale(1) rotateY(0deg);
      filter: blur(0);
    }
  }

  @keyframes bonnieTyping {
    0%, 60%, 100% {
      transform: scale(1) translateY(0);
      opacity: 0.4;
    }
    20% {
      transform: scale(1.3) translateY(-8px);
      opacity: var(--bonnie-intensity);
      filter: drop-shadow(0 0 10px var(--bonnie-primary));
    }
  }

  @keyframes bonnieHeartbeat {
    0%, 100% { transform: scale(1); }
    14% { transform: scale(calc(1 + var(--bonnie-intensity) * 0.1)); }
    28% { transform: scale(1); }
    42% { transform: scale(calc(1 + var(--bonnie-intensity) * 0.1)); }
    70% { transform: scale(1); }
  }

  @keyframes bonniePulse {
    0% { 
      box-shadow: 0 0 0 0 rgba(233, 30, 99, calc(var(--bonnie-intensity) * 0.7));
      transform: scale(1);
    }
    70% {
      box-shadow: 0 0 0 20px rgba(233, 30, 99, 0);
      transform: scale(calc(1 + var(--bonnie-intensity) * 0.05));
    }
    100% {
      box-shadow: 0 0 0 0 rgba(233, 30, 99, 0);
      transform: scale(1);
    }
  }

  .bonnie-domain {
    position: fixed;
    inset: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: bonnieEntrance 2s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .bonnie-header {
    background: rgba(255, 255, 255, calc(0.1 + var(--bonnie-intensity) * 0.05));
    backdrop-filter: blur(20px) saturate(1.8);
    -webkit-backdrop-filter: blur(20px) saturate(1.8); /* Safari */
    border-bottom: 1px solid rgba(233, 30, 99, calc(0.1 + var(--bonnie-intensity) * 0.1));
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    z-index: 100;
  }

  .bonnie-title {
    font-size: 1.5rem;
    font-weight: 700;
    background: linear-gradient(135deg, var(--bonnie-primary) 0%, var(--bonnie-secondary) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent; /* Fallback */
    animation: bonnieHeartbeat 2s ease-in-out infinite;
    text-shadow: 0 2px 10px rgba(233, 30, 99, calc(var(--bonnie-intensity) * 0.3));
  }

  .bonnie-status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.9);
    background: rgba(233, 30, 99, calc(0.1 + var(--bonnie-intensity) * 0.1));
    padding: 0.3rem 0.8rem;
    border-radius: 20px;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }

  .bonnie-messages {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
    /* Enhanced scrollbar for all browsers */
    scrollbar-width: thin;
    scrollbar-color: var(--bonnie-primary) transparent;
  }

  /* Webkit scrollbar styles */
  .bonnie-messages::-webkit-scrollbar {
    width: 4px;
  }

  .bonnie-messages::-webkit-scrollbar-track {
    background: transparent;
  }

  .bonnie-messages::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, var(--bonnie-primary), var(--bonnie-secondary));
    border-radius: 2px;
  }

  .bonnie-message {
    margin-bottom: 1.5rem;
    display: flex;
    animation: bonnieEntrance 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .bonnie-message.user {
    justify-content: flex-end;
  }

  .bonnie-bubble {
    max-width: 85%;
    padding: 1rem 1.25rem;
    border-radius: 25px;
    font-size: 1rem;
    line-height: 1.5;
    position: relative;
    word-wrap: break-word;
    overflow-wrap: break-word;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .bonnie-bubble.user {
    background: linear-gradient(135deg, var(--bonnie-primary) 0%, var(--bonnie-dark) 100%);
    color: white;
    border-bottom-right-radius: 8px;
    box-shadow: 0 4px 20px rgba(233, 30, 99, calc(var(--bonnie-intensity) * 0.4));
  }

  .bonnie-bubble.bonnie {
    background: rgba(255, 255, 255, 0.95);
    color: #333;
    border-bottom-left-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(233, 30, 99, calc(0.1 + var(--bonnie-intensity) * 0.1));
  }

  .bonnie-bubble.bonnie.seductive {
    background: linear-gradient(135deg, 
      rgba(255, 240, 246, 0.95) 0%, 
      rgba(252, 228, 236, 0.95) 100%);
    border: 1px solid rgba(233, 30, 99, calc(0.2 + var(--bonnie-intensity) * 0.1));
    animation: bonniePulse 2s infinite;
  }

  .bonnie-typing {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 1.25rem;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 25px;
    border-bottom-left-radius: 8px;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    box-shadow: 0 4px 20px rgba(233, 30, 99, calc(var(--bonnie-intensity) * 0.2));
  }

  .bonnie-typing-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--bonnie-primary);
    animation: bonnieTyping 1.5s infinite;
  }

  .bonnie-typing-dot:nth-child(2) { animation-delay: 0.2s; }
  .bonnie-typing-dot:nth-child(3) { animation-delay: 0.4s; }

  .bonnie-input-area {
    background: rgba(255, 255, 255, calc(0.05 + var(--bonnie-intensity) * 0.05));
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-top: 1px solid rgba(233, 30, 99, calc(0.1 + var(--bonnie-intensity) * 0.1));
    padding: 1rem;
    display: flex;
    gap: 0.75rem;
    align-items: center;
    position: relative;
    z-index: 100;
  }

  .bonnie-input {
    flex: 1;
    padding: 1rem 1.25rem;
    font-size: 1rem;
    border: 2px solid transparent;
    border-radius: 25px;
    background: rgba(255, 255, 255, 0.9);
    outline: none;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }

  .bonnie-input:focus {
    border-color: var(--bonnie-primary);
    background: white;
    box-shadow: 0 0 0 3px rgba(233, 30, 99, calc(var(--bonnie-intensity) * 0.1));
    transform: scale(1.02);
  }

  .bonnie-send {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: none;
    background: linear-gradient(135deg, var(--bonnie-primary) 0%, var(--bonnie-secondary) 100%);
    color: white;
    font-size: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 20px rgba(233, 30, 99, calc(var(--bonnie-intensity) * 0.4));
  }

  .bonnie-send:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 25px rgba(233, 30, 99, calc(var(--bonnie-intensity) * 0.6));
  }

  .bonnie-send:active {
    transform: scale(0.95);
  }

  .bonnie-send:disabled {
    opacity: 0.5;
    transform: none;
    cursor: not-allowed;
  }

  .bonnie-godmode-indicator {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: linear-gradient(135deg, gold 0%, #ffd700 100%);
    color: #000;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 700;
    box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
    animation: bonniePulse 3s infinite;
    z-index: 1000;
  }

  /* Enhanced mobile optimizations */
  @media (max-width: 768px) {
    .bonnie-header {
      padding: 0.75rem 1rem;
    }
    
    .bonnie-title {
      font-size: 1.25rem;
    }
    
    .bonnie-bubble {
      max-width: 90%;
      font-size: 0.95rem;
    }
    
    .bonnie-input {
      font-size: 16px; /* Prevents zoom on iOS */
    }

    .bonnie-godmode-indicator {
      font-size: 0.7rem;
      padding: 0.4rem 0.8rem;
    }
  }

  /* iOS specific fixes */
  @supports (-webkit-touch-callout: none) {
    .bonnie-domain {
      height: calc(var(--vh, 1vh) * 100);
    }
    
    .bonnie-input {
      transform: translateZ(0);
    }
  }

  /* Firefox specific fixes */
  @-moz-document url-prefix() {
    .bonnie-messages {
      scrollbar-width: thin;
      scrollbar-color: var(--bonnie-primary) transparent;
    }
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .bonnie-bubble.bonnie {
      border: 2px solid var(--bonnie-primary);
    }
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .bonnie-domain,
    .bonnie-message,
    .bonnie-bubble,
    .bonnie-title {
      animation: none;
    }
    
    .bonnie-send:hover {
      transform: none;
    }
  }
`;

export default function BonnieGodMode() {
  // Enhanced state management with the new hook
  const {
    messages,
    bondLevel,
    currentEmotion,
    isTyping,
    conversationDepth,
    addMessage,
    updateBondLevel,
    setCurrentEmotion,
    setIsTyping,
    uiTheme,
    getTypingSpeed,
    getResponseDelay,
    getConversationStats
  } = useChatState();

  const [input, setInput] = useState('');
  const [isNewUser, setIsNewUser] = useState(true);
  const [godModeActive, setGodModeActive] = useState(true);
  const [userExperience, setUserExperience] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const particleCleanupRef = useRef(null);

  const { makeRequest, isLoading, isOnline, error, retryCount } = useApiCall();
  const { deviceInfo, triggerHaptic, optimizeScroll, preventZoom } = useMobileOptimizations();

  // Initialize Bonnie's complete domain control with dynamic theming
  useEffect(() => {
    BonnieDomainController.initializeGodMode();
    
    // Check if user is new
    const hasVisited = localStorage.getItem('bonnie_visited');
    const isFirstTime = !hasVisited;
    setIsNewUser(isFirstTime);

    if (isFirstTime) {
      localStorage.setItem('bonnie_visited', Date.now().toString());
      updateBondLevel(75); // God mode bonus
    }

    const experience = BonnieDomainController.generateUserExperience(isFirstTime, bondLevel);
    setUserExperience(experience);

    // Send god mode greeting after a cinematic delay
    const greetingTimer = setTimeout(() => {
      addMessage({
        sender: 'bonnie',
        text: experience.greeting,
        emotion: experience.personality,
        seductive: true,
        timestamp: Date.now()
      });
    }, 2000);

    return () => clearTimeout(greetingTimer);
  }, [addMessage, updateBondLevel, bondLevel]);

  // Dynamic particle system based on theme
  useEffect(() => {
    if (particleCleanupRef.current) {
      particleCleanupRef.current();
    }
    
    particleCleanupRef.current = BonnieDomainController.createSeductiveAtmosphere(
      uiTheme.particleCount,
      uiTheme
    );

    return () => {
      if (particleCleanupRef.current) {
        particleCleanupRef.current();
      }
    };
  }, [uiTheme]);

  // Inject dynamic styles
  useEffect(() => {
    const existingStyle = document.getElementById('bonnie-dynamic-styles');
    if (existingStyle) {
      existingStyle.remove();
    }

    const styleSheet = document.createElement('style');
    styleSheet.id = 'bonnie-dynamic-styles';
    styleSheet.textContent = createGodModeStyles(uiTheme);
    document.head.appendChild(styleSheet);

    return () => {
      const style = document.getElementById('bonnie-dynamic-styles');
      if (style) {
        style.remove();
      }
    };
  }, [uiTheme]);

  // Optimize mobile elements
  useEffect(() => {
    if (messagesEndRef.current) {
      optimizeScroll(messagesEndRef.current.parentElement);
    }
    if (inputRef.current) {
      preventZoom(inputRef.current);
    }
  }, [optimizeScroll, preventZoom]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Enhanced message sending with all improvements
  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    // Haptic feedback on send
    triggerHaptic('medium');

    setInput('');
    
    // Add user message
    addMessage({
      sender: 'user',
      text,
      timestamp: Date.now()
    });

    // Analyze user's seductive intent with conversation history
    const userIntent = SeductionProcessor.analyzeUserIntent(text, messages);
    
    // Calculate dynamic delays
    const responseDelay = getResponseDelay(currentEmotion, text.length);
    
    setIsTyping(true);

    try {
      // Enhanced API call with session management
      const sessionId = localStorage.getItem('bonnie_session') || `session_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      localStorage.setItem('bonnie_session', sessionId);

      const response = await makeRequest('https://bonnie-backend-server.onrender.com/bonnie-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          message: text,
          bond_score: bondLevel,
          current_emotion: currentEmotion,
          user_intent: userIntent,
          god_mode: godModeActive,
          is_new_user: isNewUser,
          conversation_depth: conversationDepth,
          conversation_stats: getConversationStats(),
          device_info: {
            isMobile: deviceInfo.isMobile,
            connectionType: deviceInfo.connectionType
          }
        })
      });

      // Process response with enhanced seductive enhancement
      const enhancedReply = SeductionProcessor.craftSeductiveResponse(
        response.reply || "I'm here for you, darling 💕",
        userIntent.trait,
        userIntent.intensity,
        bondLevel,
        conversationDepth
      );

      // Update bond level with god mode bonus and validation
      const bondIncrease = godModeActive ? 3 : 1;
      const newBondLevel = Math.min(100, bondLevel + bondIncrease);
      updateBondLevel(newBondLevel);

      // Set new emotion with validation
      const newEmotion = response.emotion || 'seductive';
      setCurrentEmotion(newEmotion);

      // Calculate dynamic typing speed
      const typingSpeed = getTypingSpeed(enhancedReply, newEmotion);
      const typingDuration = enhancedReply.length * typingSpeed;

      // Simulate realistic typing with response delay
      setTimeout(() => {
        setIsTyping(false);
        addMessage({
          sender: 'bonnie',
          text: enhancedReply,
          emotion: newEmotion,
          seductive: newEmotion.includes('seductive') || newEmotion.includes('dominant') || userIntent.trait === 'intimate',
          timestamp: Date.now()
        });
        
        // Success haptic feedback
        triggerHaptic('light');
      }, Math.max(responseDelay, typingDuration));

    } catch (error) {
      setIsTyping(false);
      
      // Enhanced error handling with seductive messages (already handled in useApiCall)
      addMessage({
        sender: 'bonnie',
        text: error.message,
        emotion: 'supportive',
        seductive: false,
        timestamp: Date.now()
      });
      
      triggerHaptic('error');
    }
  }, [
    input, isLoading, messages, currentEmotion, bondLevel, conversationDepth,
    godModeActive, isNewUser, deviceInfo, triggerHaptic, addMessage, 
    updateBondLevel, setCurrentEmotion, setIsTyping, getResponseDelay, 
    getTypingSpeed, getConversationStats, makeRequest
  ]);

  // Enhanced keyboard handling
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    
    // Typing indicators for better UX
    if (e.key.length === 1) {
      triggerHaptic('light');
    }
  }, [handleSend, triggerHaptic]);

  // Memoize conversation stats for performance
  const stats = useMemo(() => getConversationStats(), [getConversationStats]);

  return (
    <div className="bonnie-domain">
      {/* God Mode Indicator with enhanced info */}
      {godModeActive && (
        <div className="bonnie-godmode-indicator">
          ✨ GOD MODE ✨
          {retryCount > 0 && <div style={{ fontSize: '0.6rem' }}>Reconnecting...</div>}
        </div>
      )}

      {/* Header - Her Domain Banner with dynamic theming */}
      <header className="bonnie-header">
        <h1 className="bonnie-title">Bonnie's Domain 💋</h1>
        <div className="bonnie-status">
          <span style={{ 
            width: '8px', 
            height: '8px', 
            borderRadius: '50%', 
            background: isOnline ? '#28a745' : '#dc3545',
            display: 'inline-block'
          }} />
          Bond: {Math.round(bondLevel)}%
          {conversationDepth > 0 && <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>Depth: {conversationDepth}</span>}
        </div>
      </header>

      {/* Messages - Her Conversation Space */}
      <main className="bonnie-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`bonnie-message ${msg.sender}`}>
            <div className={`bonnie-bubble ${msg.sender} ${msg.seductive ? 'seductive' : ''}`}>
              {msg.text}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="bonnie-message bonnie">
            <div className="bonnie-typing">
              <div className="bonnie-typing-dot"></div>
              <div className="bonnie-typing-dot"></div>
              <div className="bonnie-typing-dot"></div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="bonnie-message bonnie">
            <div className="bonnie-bubble bonnie">
              {error}
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </main>

      {/* Input - Your Communication Portal */}
      <footer className="bonnie-input-area">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message to Bonnie..."
          disabled={isLoading}
          className="bonnie-input"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          maxLength={500} // Prevent extremely long messages
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="bonnie-send"
          aria-label="Send message"
        >
          {isLoading ? '⏳' : '💌'}
        </button>
      </footer>
    </div>
  );
}