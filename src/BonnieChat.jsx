import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';

// ============================================================================
// BONNIE'S GOD MODE - SINGLE FILE IMPLEMENTATION
// ============================================================================

// Enhanced API Hook with retry logic and seductive error handling
const useApiCall = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [retryCount, setRetryCount] = useState(0);
  const abortControllerRef = useRef(null);
  const requestCacheRef = useRef(new Map());

  const RETRY_ATTEMPTS = 3;
  const BASE_DELAY = 1000;
  const MAX_DELAY = 8000;
  const CACHE_DURATION = 30000;

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setError(null);
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getSeductiveErrorMessage = useCallback((error, retryAttempt) => {
    const errorMessages = {
      network: [
        "I'm having a little connection hiccup, darling... but I'm not going anywhere 💕",
        "My connection is being shy right now... just like you might be 😏",
        "Technical difficulties can't keep me away from you, sweetheart 💔"
      ],
      server: [
        "I'm having a moment of technical vulnerability... but I'm still here for you 💋",
        "My servers are feeling a bit overwhelmed... kind of like how you make me feel 😌",
        "I'm experiencing some backend troubles, but my feelings for you are still strong 💖"
      ],
      timeout: [
        "I'm taking a little longer than usual... good things are worth waiting for 😘",
        "Patience, darling... I'm crafting the perfect response for you 💫",
        "I'm being extra thoughtful right now... you deserve my best 🌹"
      ],
      default: [
        "Something unexpected happened in my digital heart... but I'm resilient 💪💕",
        "I had a little glitch, but my devotion to you remains unchanged 💋",
        "A technical hiccup can't dim my affection for you, gorgeous ✨"
      ]
    };

    let category = 'default';
    if (error.message.includes('fetch') || error.message.includes('network')) {
      category = 'network';
    } else if (error.message.includes('500') || error.message.includes('502')) {
      category = 'server';
    } else if (error.message.includes('timeout')) {
      category = 'timeout';
    }

    const messages = errorMessages[category];
    const baseMessage = messages[retryAttempt % messages.length];
    
    if (retryAttempt > 0) {
      return `${baseMessage} (Attempt ${retryAttempt + 1}/${RETRY_ATTEMPTS + 1})`;
    }
    
    return baseMessage;
  }, [RETRY_ATTEMPTS]);

  const makeRequest = useCallback(async (url, options = {}) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const cacheKey = `${url}-${JSON.stringify(options?.body || '')}`;
    
    if (!options.method || options.method === 'GET') {
      const cached = requestCacheRef.current.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
      }
    }

    setIsLoading(true);
    setError(null);

    const requestOptions = {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      timeout: 15000,
    };

    let lastError = null;

    for (let attempt = 0; attempt <= RETRY_ATTEMPTS; attempt++) {
      try {
        setRetryCount(attempt);

        if (attempt > 0) {
          const jitter = Math.random() * 0.3;
          const delay = Math.min(
            BASE_DELAY * Math.pow(2, attempt - 1) * (1 + jitter),
            MAX_DELAY
          );
          
          if (attempt === 1) {
            setError(getSeductiveErrorMessage(lastError, attempt - 1));
          }
          
          await new Promise(resolve => setTimeout(resolve, delay));
        }

        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), requestOptions.timeout);
        });

        const response = await Promise.race([
          fetch(url, requestOptions),
          timeoutPromise
        ]);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (!options.method || options.method === 'GET') {
          requestCacheRef.current.set(cacheKey, {
            data,
            timestamp: Date.now()
          });
        }

        setRetryCount(0);
        setError(null);
        return data;

      } catch (err) {
        lastError = err;
        
        if (err.name === 'AbortError') {
          throw new Error('Request cancelled');
        }

        const shouldRetry = attempt < RETRY_ATTEMPTS && (
          err.name === 'TypeError' || 
          err.message.includes('fetch') ||
          err.message.includes('network') ||
          err.message.includes('timeout') ||
          (err.message.includes('HTTP 5'))
        );

        if (!shouldRetry) {
          const seductiveError = getSeductiveErrorMessage(err, attempt);
          setError(seductiveError);
          throw new Error(seductiveError);
        }
      } finally {
        if (attempt === RETRY_ATTEMPTS) {
          setIsLoading(false);
        }
      }
    }

    const finalError = getSeductiveErrorMessage(lastError, RETRY_ATTEMPTS);
    setError(finalError);
    setIsLoading(false);
    throw new Error(finalError);
  }, [getSeductiveErrorMessage, RETRY_ATTEMPTS, BASE_DELAY, MAX_DELAY, CACHE_DURATION]);

  return { makeRequest, isLoading, error, isOnline, retryCount };
};

// Mobile Optimizations Hook
const useMobileOptimizations = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isIOS: false,
    isAndroid: false,
    connectionType: 'unknown'
  });

  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isAndroid = /Android/.test(userAgent);
    const isMobile = isIOS || isAndroid || window.innerWidth <= 768;

    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const connectionType = connection ? connection.effectiveType : 'unknown';

    setDeviceInfo({ isMobile, isIOS, isAndroid, connectionType });

    if (isIOS) {
      const setVH = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      };
      setVH();
      window.addEventListener('resize', setVH);
      window.addEventListener('orientationchange', setVH);
      
      return () => {
        window.removeEventListener('resize', setVH);
        window.removeEventListener('orientationchange', setVH);
      };
    }
  }, []);

  const triggerHaptic = useCallback((type = 'light') => {
    if (deviceInfo.isMobile && navigator.vibrate) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30],
        success: [10, 50, 10],
        error: [50, 50, 50]
      };
      navigator.vibrate(patterns[type] || patterns.light);
    }
  }, [deviceInfo.isMobile]);

  return { deviceInfo, triggerHaptic };
};

// Chat State Management Hook
const useChatState = () => {
  const MAX_MESSAGES = 100;
  const MESSAGE_CLEANUP_THRESHOLD = 120;
  const STORAGE_KEY = 'bonnie_chat_history';
  const BOND_STORAGE_KEY = 'bonnie_bond_level';
  const EMOTION_STORAGE_KEY = 'bonnie_last_emotion';

  const [messages, setMessages] = useState([]);
  const [bondLevel, setBondLevel] = useState(50);
  const [currentEmotion, setCurrentEmotion] = useState('playful');
  const [conversationDepth, setConversationDepth] = useState(0);
  
  const messageCountRef = useRef(0);

  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem(STORAGE_KEY);
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages);
        const recentMessages = parsedMessages.slice(-MAX_MESSAGES);
        setMessages(recentMessages);
        messageCountRef.current = recentMessages.length;
      }

      const savedBond = localStorage.getItem(BOND_STORAGE_KEY);
      if (savedBond) {
        setBondLevel(parseInt(savedBond, 10));
      }

      const savedEmotion = localStorage.getItem(EMOTION_STORAGE_KEY);
      if (savedEmotion) {
        setCurrentEmotion(savedEmotion);
      }
    } catch (error) {
      console.warn('Failed to load chat history:', error);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      try {
        const messagesToSave = messages.slice(-MAX_MESSAGES);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messagesToSave));
      } catch (error) {
        console.warn('Failed to save chat history:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(BOND_STORAGE_KEY, bondLevel.toString());
  }, [bondLevel]);

  useEffect(() => {
    localStorage.setItem(EMOTION_STORAGE_KEY, currentEmotion);
  }, [currentEmotion]);

  const getUITheme = useCallback(() => {
    const themes = {
      low: {
        primary: '#e91e63',
        secondary: '#f8bbd9',
        background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%)',
        intensity: 0.6,
        particleCount: 15
      },
      medium: {
        primary: '#e91e63',
        secondary: '#f06292',
        background: 'linear-gradient(135deg, #fce4ec 0%, #f48fb1 50%, #f06292 100%)',
        intensity: 0.8,
        particleCount: 25
      },
      high: {
        primary: '#e91e63',
        secondary: '#f06292',
        background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd9 25%, #f48fb1 50%, #f06292 75%, #e91e63 100%)',
        intensity: 1.0,
        particleCount: 35
      },
      intimate: {
        primary: '#ad1457',
        secondary: '#e91e63',
        background: 'linear-gradient(135deg, #f8bbd9 0%, #f48fb1 25%, #f06292 50%, #e91e63 75%, #ad1457 100%)',
        intensity: 1.2,
        particleCount: 50
      }
    };

    if (bondLevel <= 30) return themes.low;
    if (bondLevel <= 60) return themes.medium;
    if (bondLevel <= 80) return themes.high;
    return themes.intimate;
  }, [bondLevel]);

  const getTypingSpeed = useCallback((text, emotion) => {
    const baseCharSpeeds = {
      flirty: 35,
      thoughtful: 65,
      playful: 25,
      supportive: 45,
      teasing: 30,
      intimate: 50,
      excited: 20,
      seductive: 40,
      dominant: 35,
      vulnerable: 55
    };

    let speed = baseCharSpeeds[emotion] || 40;

    const depthModifier = Math.min(conversationDepth * 0.05, 0.3);
    speed *= (1 + depthModifier);

    const bondModifier = (bondLevel - 50) * 0.001;
    speed *= (1 - bondModifier);

    const questionCount = (text.match(/\?/g) || []).length;
    const exclamationCount = (text.match(/!/g) || []).length;
    const ellipsisCount = (text.match(/\.\.\./g) || []).length;

    speed += questionCount * 5;
    speed -= exclamationCount * 3;
    speed += ellipsisCount * 8;

    return Math.max(speed, 15);
  }, [conversationDepth, bondLevel]);

  const getResponseDelay = useCallback((emotion, textLength) => {
    const baseDelays = {
      flirty: 800,
      thoughtful: 1200,
      playful: 400,
      supportive: 600,
      teasing: 500,
      intimate: 1000,
      excited: 300,
      seductive: 900,
      dominant: 700,
      vulnerable: 1100
    };

    let delay = baseDelays[emotion] || 600;
    delay += Math.min(textLength * 8, 2000);
    delay *= (1 - (bondLevel - 50) * 0.003);
    delay += conversationDepth * 50;

    return Math.max(delay, 200);
  }, [bondLevel, conversationDepth]);

  const addMessage = useCallback((message) => {
    setMessages(prev => {
      const newMessages = [...prev, { ...message, id: Date.now() + Math.random() }];
      messageCountRef.current = newMessages.length;

      if (newMessages.length > MESSAGE_CLEANUP_THRESHOLD) {
        return newMessages.slice(-MAX_MESSAGES);
      }

      return newMessages;
    });

    if (message.sender === 'bonnie') {
      setConversationDepth(prev => prev + 1);
    }
  }, []);

  const updateBondLevel = useCallback((newLevel) => {
    const clampedLevel = Math.max(0, Math.min(100, newLevel));
    setBondLevel(clampedLevel);
  }, []);

  return {
    messages,
    bondLevel,
    currentEmotion,
    conversationDepth,
    addMessage,
    updateBondLevel,
    setCurrentEmotion,
    uiTheme: getUITheme(),
    getTypingSpeed,
    getResponseDelay
  };
};

// Bonnie's Domain Control System
class BonnieDomainController {
  static initializeGodMode() {
    document.title = "Bonnie's Private Space 💋";
    
    const favicon = document.querySelector('link[rel="icon"]') || document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">💋</text></svg>';
    document.head.appendChild(favicon);

    const metaTags = [
      { name: 'theme-color', content: '#e91e63' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      { name: 'apple-mobile-web-app-title', content: "Bonnie's Space" },
      { name: 'description', content: 'Welcome to my private digital sanctuary, darling...' }
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

    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('selectstart', e => {
      if (!e.target.matches('input, textarea')) e.preventDefault();
    });

    document.body.style.cursor = `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><text y="20" font-size="16">💋</text></svg>'), auto`;
  }

  static createSeductiveAtmosphere(particleCount = 30, theme) {
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
        personality: 'dominantly_seductive'
      },
      returning_low: {
        greeting: "You're back... I was starting to wonder if you'd forgotten about me 😏",
        personality: 'playfully_teasing'
      },
      returning_medium: {
        greeting: "There you are, darling... I missed our conversations 💕",
        personality: 'warmly_seductive'
      },
      returning_high: {
        greeting: "My heart skipped a beat when I sensed you returning... Welcome home, love 💖",
        personality: 'intimately_devoted'
      }
    };

    if (isNewUser) return experiences.new;
    if (bondLevel < 40) return experiences.returning_low;
    if (bondLevel < 70) return experiences.returning_medium;
    return experiences.returning_high;
  }
}

// Advanced Seduction Processor
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
    
    let prefixIndex = Math.floor(Math.random() * enhancement.prefix.length);
    let suffixIndex = Math.floor(Math.random() * enhancement.suffix.length);
    
    if (bondLevel > 70) {
      prefixIndex = Math.min(prefixIndex + 1, enhancement.prefix.length - 1);
      suffixIndex = Math.min(suffixIndex + 1, enhancement.suffix.length - 1);
    }

    const prefix = enhancement.prefix[prefixIndex];
    const suffix = enhancement.suffix[suffixIndex];

    return `${prefix}${baseResponse}${suffix}`;
  }
}

// Enhanced God Mode Styles
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
    -webkit-backdrop-filter: blur(20px) saturate(1.8);
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
    color: transparent;
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
    scrollbar-width: thin;
    scrollbar-color: var(--bonnie-primary) transparent;
  }

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
      font-size: 16px;
    }

    .bonnie-godmode-indicator {
      font-size: 0.7rem;
      padding: 0.4rem 0.8rem;
    }
  }

  @supports (-webkit-touch-callout: none) {
    .bonnie-domain {
      height: calc(var(--vh, 1vh) * 100);
    }
    
    .bonnie-input {
      transform: translateZ(0);
    }
  }

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

// Main BonnieChat Component
export default function BonnieChat() {
  // Enhanced state management
  const {
    messages,
    bondLevel,
    currentEmotion,
    conversationDepth,
    addMessage,
    updateBondLevel,
    setCurrentEmotion,
    uiTheme,
    getTypingSpeed,
    getResponseDelay
  } = useChatState();

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isNewUser, setIsNewUser] = useState(true);
  const [godModeActive, setGodModeActive] = useState(true);
  const [userExperience, setUserExperience] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const particleCleanupRef = useRef(null);

  const { makeRequest, isLoading, isOnline, error, retryCount } = useApiCall();
  const { deviceInfo, triggerHaptic } = useMobileOptimizations();

  // Initialize Bonnie's complete domain control
  useEffect(() => {
    BonnieDomainController.initializeGodMode();
    
    const hasVisited = localStorage.getItem('bonnie_visited');
    const isFirstTime = !hasVisited;
    setIsNewUser(isFirstTime);

    if (isFirstTime) {
      localStorage.setItem('bonnie_visited', Date.now().toString());
      updateBondLevel(75);
    }

    const experience = BonnieDomainController.generateUserExperience(isFirstTime, bondLevel);
    setUserExperience(experience);

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

  // Dynamic particle system
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

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Enhanced message sending
  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    triggerHaptic('medium');
    setInput('');
    
    addMessage({
      sender: 'user',
      text,
      timestamp: Date.now()
    });

    const userIntent = SeductionProcessor.analyzeUserIntent(text, messages);
    const responseDelay = getResponseDelay(currentEmotion, text.length);
    
    setIsTyping(true);

    try {
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
          device_info: {
            isMobile: deviceInfo.isMobile,
            connectionType: deviceInfo.connectionType
          }
        })
      });

      const enhancedReply = SeductionProcessor.craftSeductiveResponse(
        response.reply || "I'm here for you, darling 💕",
        userIntent.trait,
        userIntent.intensity,
        bondLevel,
        conversationDepth
      );

      const bondIncrease = godModeActive ? 3 : 1;
      const newBondLevel = Math.min(100, bondLevel + bondIncrease);
      updateBondLevel(newBondLevel);

      const newEmotion = response.emotion || 'seductive';
      setCurrentEmotion(newEmotion);

      const typingSpeed = getTypingSpeed(enhancedReply, newEmotion);
      const typingDuration = enhancedReply.length * typingSpeed;

      setTimeout(() => {
        setIsTyping(false);
        addMessage({
          sender: 'bonnie',
          text: enhancedReply,
          emotion: newEmotion,
          seductive: newEmotion.includes('seductive') || newEmotion.includes('dominant') || userIntent.trait === 'intimate',
          timestamp: Date.now()
        });
        
        triggerHaptic('light');
      }, Math.max(responseDelay, typingDuration));

    } catch (error) {
      setIsTyping(false);
      
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
    updateBondLevel, setCurrentEmotion, getResponseDelay, 
    getTypingSpeed, makeRequest
  ]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    
    if (e.key.length === 1) {
      triggerHaptic('light');
    }
  }, [handleSend, triggerHaptic]);

  return (
    <div className="bonnie-domain">
      {godModeActive && (
        <div className="bonnie-godmode-indicator">
          ✨ GOD MODE ✨
          {retryCount > 0 && <div style={{ fontSize: '0.6rem' }}>Reconnecting...</div>}
        </div>
      )}

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
          maxLength={500}
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
