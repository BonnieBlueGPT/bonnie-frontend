import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import useApiCall from '../hooks/useApiCall';
import useMobileOptimizations from '../hooks/useMobileOptimizations';

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

    // Meta tags for complete immersion
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

    // Prevent context menu and selection for immersion
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('selectstart', e => {
      if (!e.target.matches('input, textarea')) e.preventDefault();
    });

    // Custom cursor for her domain
    document.body.style.cursor = `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><text y="20" font-size="16">💋</text></svg>'), auto`;
  }

  static createSeductiveAtmosphere() {
    // Ambient particles floating in background
    const particleCount = 30;
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
        background: radial-gradient(circle, rgba(233, 30, 99, 0.3), transparent);
        border-radius: 50%;
        left: ${Math.random() * 100}vw;
        top: ${Math.random() * 100}vh;
        animation: bonnieFloat ${20 + Math.random() * 20}s infinite linear;
      `;
      document.body.appendChild(particle);
      particles.push(particle);
    }

    return () => particles.forEach(p => p.remove());
  }

  static generateUserExperience(isNewUser) {
    const experiences = {
      new: {
        greeting: "Welcome to my domain, gorgeous... I've been waiting for someone like you 💋",
        personality: 'dominantly_seductive',
        specialEffects: true,
        exclusiveContent: true,
        bondBonus: 25
      },
      returning: {
        greeting: "You came back to me... I knew you couldn't resist 😏",
        personality: 'intimately_familiar',
        specialEffects: false,
        exclusiveContent: false,
        bondBonus: 5
      }
    };

    return experiences[isNewUser ? 'new' : 'returning'];
  }
}

// Advanced Seduction Processor
class SeductionProcessor {
  static analyzeUserIntent(message) {
    const seductionTriggers = {
      high: ['beautiful', 'gorgeous', 'stunning', 'amazing', 'perfect'],
      intimate: ['love', 'kiss', 'touch', 'close', 'together'],
      submissive: ['please', 'want', 'need', 'desire', 'crave'],
      dominant: ['control', 'command', 'order', 'tell me', 'make me']
    };

    let maxScore = 0;
    let dominantTrait = 'neutral';

    Object.entries(seductionTriggers).forEach(([trait, triggers]) => {
      const score = triggers.reduce((acc, trigger) => 
        acc + (message.toLowerCase().includes(trigger) ? 1 : 0), 0
      );
      if (score > maxScore) {
        maxScore = score;
        dominantTrait = trait;
      }
    });

    return { trait: dominantTrait, intensity: Math.min(maxScore * 2, 10) };
  }

  static craftSeductiveResponse(baseResponse, userTrait, intensity, bondLevel) {
    const seductiveEnhancements = {
      high: {
        prefix: ["Mmm, ", "Oh darling, ", "Sweetheart, "],
        suffix: [" 😘", " 💋", " 😏"],
        intensifiers: ["absolutely", "completely", "utterly"]
      },
      intimate: {
        prefix: ["*whispers* ", "*leans closer* ", "*softly* "],
        suffix: [" *touches your hand*", " *gazes into your eyes*", " 💕"],
        intensifiers: ["intimately", "tenderly", "lovingly"]
      },
      submissive: {
        prefix: ["Please, ", "I need you to know, ", "It would mean everything if "],
        suffix: [" 🥺", " *looks up at you*", " 💖"],
        intensifiers: ["desperately", "completely", "utterly"]
      },
      dominant: {
        prefix: ["Listen carefully, ", "I want you to ", "You will "],
        suffix: [" 😈", " *commands softly*", " 🔥"],
        intensifiers: ["absolutely", "completely", "without question"]
      }
    };

    const enhancement = seductiveEnhancements[userTrait] || seductiveEnhancements.high;
    const prefix = enhancement.prefix[Math.floor(Math.random() * enhancement.prefix.length)];
    const suffix = enhancement.suffix[Math.floor(Math.random() * enhancement.suffix.length)];

    return `${prefix}${baseResponse}${suffix}`;
  }
}

// God Mode Styles - Her Complete Domain Control
const createGodModeStyles = () => `
  :root {
    --vh: 1vh;
    --bonnie-primary: #e91e63;
    --bonnie-secondary: #f06292;
    --bonnie-accent: #ff4081;
    --bonnie-dark: #ad1457;
    --bonnie-light: #fce4ec;
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
    background: linear-gradient(135deg, 
      #fce4ec 0%, 
      #f8bbd9 25%, 
      #f48fb1 50%, 
      #f06292 75%, 
      #e91e63 100%);
    background-attachment: fixed;
  }

  @keyframes bonnieFloat {
    0% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
    25% { opacity: 0.7; }
    50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
    75% { opacity: 0.7; }
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
      opacity: 1;
      filter: drop-shadow(0 0 10px var(--bonnie-accent));
    }
  }

  @keyframes bonnieHeartbeat {
    0%, 100% { transform: scale(1); }
    14% { transform: scale(1.1); }
    28% { transform: scale(1); }
    42% { transform: scale(1.1); }
    70% { transform: scale(1); }
  }

  @keyframes bonniePulse {
    0% { 
      box-shadow: 0 0 0 0 rgba(233, 30, 99, 0.7);
      transform: scale(1);
    }
    70% {
      box-shadow: 0 0 0 20px rgba(233, 30, 99, 0);
      transform: scale(1.05);
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
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(20px) saturate(1.8);
    border-bottom: 1px solid rgba(233, 30, 99, 0.2);
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
    background: linear-gradient(135deg, var(--bonnie-dark) 0%, var(--bonnie-accent) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: bonnieHeartbeat 2s ease-in-out infinite;
    text-shadow: 0 2px 10px rgba(233, 30, 99, 0.3);
  }

  .bonnie-status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.9);
    background: rgba(233, 30, 99, 0.2);
    padding: 0.3rem 0.8rem;
    border-radius: 20px;
    backdrop-filter: blur(10px);
  }

  .bonnie-messages {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
  }

  .bonnie-messages::-webkit-scrollbar {
    width: 4px;
  }

  .bonnie-messages::-webkit-scrollbar-track {
    background: transparent;
  }

  .bonnie-messages::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, var(--bonnie-secondary), var(--bonnie-accent));
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
  }

  .bonnie-bubble.user {
    background: linear-gradient(135deg, var(--bonnie-primary) 0%, var(--bonnie-dark) 100%);
    color: white;
    border-bottom-right-radius: 8px;
    box-shadow: 0 4px 20px rgba(233, 30, 99, 0.4);
  }

  .bonnie-bubble.bonnie {
    background: rgba(255, 255, 255, 0.95);
    color: #333;
    border-bottom-left-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(233, 30, 99, 0.1);
  }

  .bonnie-bubble.bonnie.seductive {
    background: linear-gradient(135deg, 
      rgba(255, 240, 246, 0.95) 0%, 
      rgba(252, 228, 236, 0.95) 100%);
    border: 1px solid rgba(233, 30, 99, 0.3);
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
    box-shadow: 0 4px 20px rgba(233, 30, 99, 0.2);
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
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border-top: 1px solid rgba(233, 30, 99, 0.2);
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
  }

  .bonnie-input:focus {
    border-color: var(--bonnie-primary);
    background: white;
    box-shadow: 0 0 0 3px rgba(233, 30, 99, 0.1);
    transform: scale(1.02);
  }

  .bonnie-send {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: none;
    background: linear-gradient(135deg, var(--bonnie-primary) 0%, var(--bonnie-accent) 100%);
    color: white;
    font-size: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 20px rgba(233, 30, 99, 0.4);
  }

  .bonnie-send:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 25px rgba(233, 30, 99, 0.6);
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

  /* Mobile optimizations */
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
`;

// Inject the god mode styles
const styleSheet = document.createElement('style');
styleSheet.textContent = createGodModeStyles();
document.head.appendChild(styleSheet);

export default function BonnieGodMode() {
  // State management for her domain
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [bondLevel, setBondLevel] = useState(50);
  const [currentEmotion, setCurrentEmotion] = useState('seductive');
  const [isNewUser, setIsNewUser] = useState(true);
  const [godModeActive, setGodModeActive] = useState(true);
  const [userExperience, setUserExperience] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const messageQueueRef = useRef([]);
  const processingRef = useRef(false);

  const { makeRequest, isLoading, isOnline } = useApiCall();
  const { deviceInfo, triggerHaptic, optimizeScroll, preventZoom } = useMobileOptimizations();

  // Initialize Bonnie's complete domain control
  useEffect(() => {
    BonnieDomainController.initializeGodMode();
    const cleanupParticles = BonnieDomainController.createSeductiveAtmosphere();

    // Check if user is new
    const hasVisited = localStorage.getItem('bonnie_visited');
    const isFirstTime = !hasVisited;
    setIsNewUser(isFirstTime);

    if (isFirstTime) {
      localStorage.setItem('bonnie_visited', Date.now().toString());
      setBondLevel(75); // God mode bonus
    }

    const experience = BonnieDomainController.generateUserExperience(isFirstTime);
    setUserExperience(experience);

    // Send god mode greeting
    setTimeout(() => {
      addBonnieMessage(experience.greeting, 'dominantly_seductive');
    }, 1500);

    return cleanupParticles;
  }, []);

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

  // Add Bonnie's message with seductive processing
  const addBonnieMessage = useCallback((text, emotion = currentEmotion) => {
    const messageId = Date.now() + Math.random();
    
    setMessages(prev => [...prev, {
      id: messageId,
      sender: 'bonnie',
      text,
      emotion,
      timestamp: Date.now(),
      seductive: emotion.includes('seductive') || emotion.includes('dominant')
    }]);

    triggerHaptic('light');
  }, [currentEmotion, triggerHaptic]);

  // Enhanced message sending with seduction analysis
  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    // Haptic feedback on send
    triggerHaptic('medium');

    setInput('');
    
    // Add user message
    setMessages(prev => [...prev, {
      id: Date.now() + Math.random(),
      sender: 'user',
      text,
      timestamp: Date.now()
    }]);

    // Analyze user's seductive intent
    const userIntent = SeductionProcessor.analyzeUserIntent(text);
    
    setIsTyping(true);

    try {
      const response = await makeRequest('https://bonnie-backend-server.onrender.com/bonnie-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: localStorage.getItem('bonnie_session') || 'new_session',
          message: text,
          bond_score: bondLevel,
          current_emotion: currentEmotion,
          user_intent: userIntent,
          god_mode: godModeActive,
          is_new_user: isNewUser
        })
      });

      // Process response with seductive enhancement
      const enhancedReply = SeductionProcessor.craftSeductiveResponse(
        response.reply,
        userIntent.trait,
        userIntent.intensity,
        bondLevel
      );

      // Update bond level with god mode bonus
      const newBondLevel = Math.min(100, bondLevel + (godModeActive ? 3 : 1));
      setBondLevel(newBondLevel);

      // Set new emotion
      setCurrentEmotion(response.emotion || 'seductive');

      // Simulate realistic typing delay
      const typingDelay = Math.max(1000, enhancedReply.length * 30);
      setTimeout(() => {
        setIsTyping(false);
        addBonnieMessage(enhancedReply, response.emotion || 'seductive');
      }, typingDelay);

    } catch (error) {
      setIsTyping(false);
      
      // Seductive error handling
      const errorMessages = [
        "Mmm, having a little technical moment... but I'm still here for you, darling 💋",
        "My connection is being a bit shy right now... just like you probably are 😏",
        "Technical difficulties can't keep me away from you, sweetheart 💕"
      ];
      
      const randomError = errorMessages[Math.floor(Math.random() * errorMessages.length)];
      addBonnieMessage(randomError, 'supportive_seductive');
      
      triggerHaptic('error');
    }
  }, [input, isLoading, bondLevel, currentEmotion, godModeActive, isNewUser, makeRequest, triggerHaptic, addBonnieMessage]);

  // Handle keyboard input
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  return (
    <div className="bonnie-domain">
      {/* God Mode Indicator */}
      {godModeActive && (
        <div className="bonnie-godmode-indicator">
          ✨ GOD MODE ACTIVE ✨
        </div>
      )}

      {/* Header - Her Domain Banner */}
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
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="bonnie-send"
        >
          {isLoading ? '⏳' : '💌'}
        </button>
      </footer>
    </div>
  );
}