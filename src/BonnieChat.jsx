import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { generateAdultResponse, ADULT_MODES } from './services/adultPersonality.js';
import PaymentService from './services/paymentService.js';
import useApiCall from './useApiCall';
import { 
  Send, 
  Heart, 
  MessageCircle, 
  Settings, 
  Moon, 
  Sun, 
  Bell, 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  Smile,
  TrendingUp,
  Brain,
  CheckCircle,
  X,
  Plus,
  Zap,
  BookOpen,
  Lightbulb,
  Target,
  User,
  Camera,
  Save,
  Edit3
} from 'lucide-react';

// Preserve Galatea Constants and Architecture
const CONSTANTS = {
  API_ENDPOINTS: {
    CHAT: 'https://bonnie-backend-server.onrender.com/bonnie-chat',
    ENTRY: 'https://bonnie-backend-server.onrender.com/bonnie-entry',
    GPT4_TASKS: 'https://bonnie-backend-server.onrender.com/gpt4-tasks',
    GPT4_INBOX: 'https://bonnie-backend-server.onrender.com/gpt4-inbox',
    GPT4_ANALYSIS: 'https://bonnie-backend-server.onrender.com/gpt4-analysis'
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

// Galatea Sentiment Analysis (Preserved)
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

// Enhanced Emotion System with Galatea Integration
const EMOTION_SYSTEM = {
  loving: {
    gradient: 'from-rose-400 via-pink-500 to-red-500',
    bgGradient: 'from-rose-50 via-pink-50 to-red-50',
    textColor: 'text-rose-600',
    bubbleGradient: 'from-rose-500 to-pink-600',
    avatar: '💕',
    typingSpeed: CONSTANTS.TYPING_SPEEDS.slow
  },
  flirty: {
    gradient: 'from-pink-400 via-purple-500 to-red-500',
    bgGradient: 'from-pink-50 via-purple-50 to-red-50',
    textColor: 'text-pink-600',
    bubbleGradient: 'from-pink-500 to-purple-600',
    avatar: '😘',
    typingSpeed: CONSTANTS.TYPING_SPEEDS.normal
  },
  playful: {
    gradient: 'from-yellow-400 via-orange-500 to-red-500',
    bgGradient: 'from-yellow-50 via-orange-50 to-red-50',
    textColor: 'text-orange-600',
    bubbleGradient: 'from-yellow-500 to-orange-600',
    avatar: '😄',
    typingSpeed: CONSTANTS.TYPING_SPEEDS.fast
  },
  supportive: {
    gradient: 'from-blue-400 via-purple-500 to-pink-500',
    bgGradient: 'from-blue-50 via-purple-50 to-pink-50',
    textColor: 'text-blue-600',
    bubbleGradient: 'from-blue-500 to-purple-600',
    avatar: '🤗',
    typingSpeed: CONSTANTS.TYPING_SPEEDS.slow
  },
  intimate: {
    gradient: 'from-purple-400 via-pink-500 to-red-600',
    bgGradient: 'from-purple-50 via-pink-50 to-red-50',
    textColor: 'text-purple-600',
    bubbleGradient: 'from-purple-500 to-pink-600',
    avatar: '💫',
    typingSpeed: CONSTANTS.TYPING_SPEEDS.slow
  },
  neutral: {
    gradient: 'from-gray-400 via-slate-500 to-gray-600',
    bgGradient: 'from-gray-50 via-slate-50 to-gray-100',
    textColor: 'text-gray-600',
    bubbleGradient: 'from-gray-500 to-slate-600',
    avatar: '😊',
    typingSpeed: CONSTANTS.TYPING_SPEEDS.normal
  }
};

// Bond Tier System
const BOND_TIERS = {
  stranger: { 
    name: 'Stranger', 
    color: 'text-gray-500', 
    bg: 'bg-gradient-to-r from-gray-100 to-gray-200', 
    icon: '👋', 
    range: [0, 19]
  },
  friendly: { 
    name: 'Friend', 
    color: 'text-green-500', 
    bg: 'bg-gradient-to-r from-green-100 to-emerald-200', 
    icon: '😊', 
    range: [20, 59]
  },
  close: { 
    name: 'Close Friend', 
    color: 'text-purple-500', 
    bg: 'bg-gradient-to-r from-purple-100 to-pink-200', 
    icon: '💜', 
    range: [60, 79]
  },
  soulmate: { 
    name: 'Soulmate', 
    color: 'text-red-500', 
    bg: 'bg-gradient-to-r from-red-100 to-pink-200', 
    icon: '💕', 
    range: [80, 100]
  }
};

// GPT-4.1 Integration Helper
const generateSessionId = () => {
  return 'session_' + Math.random().toString(36).slice(2);
};

// Debug Helper (Preserved from Galatea)
window.__BONNIE_GOD_MODE = true;
function godLog(label, data) {
  if (window && window.__BONNIE_GOD_MODE) {
    console.groupCollapsed(`%c${label}`, 'color:#e91e63;font-weight:bold');
    console.log(data);
    console.trace();
    console.groupEnd();
  }
}

const BonnieDashboard = () => {
  // Core State
  const [currentView, setCurrentView] = useState('dashboard');
  const [currentEmotion, setCurrentEmotion] = useState('loving');
  const [bondScore, setBondScore] = useState(67.5);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [animatingBond, setAnimatingBond] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isGeneratingTask, setIsGeneratingTask] = useState(false);
  
  // 💰 PREMIUM FEATURES - MONEY MAKER
  const [isPremium, setIsPremium] = useState(false);
  const [adultMode, setAdultMode] = useState('off');
  const [adultMessageCount, setAdultMessageCount] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  
  // Check premium status on load
  useEffect(() => {
    const checkPremium = async () => {
      const userId = localStorage.getItem('bonnie_user_id') || 'demo_user';
      const status = await PaymentService.checkPremiumStatus(userId);
      setIsPremium(status.isPremium);
      console.log('💰 Premium Status:', status);
    };
    checkPremium();
  }, []);
  
  // Galatea Integration
  const [sessionId, setSessionId] = useState(() => generateSessionId());
  const [online, setOnline] = useState(true);
  const [busy, setBusy] = useState(false);
  const { makeRequest, isLoading, error } = useApiCall();
  
  // User Profile State
  const [userProfile, setUserProfile] = useState({
    name: 'User',
    avatar: '👤',
    customPicture: null
  });
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [tempProfile, setTempProfile] = useState({
    name: 'User',
    avatar: '👤',
    customPicture: null
  });
  
  // Inbox State (GPT-4.1 Powered)
  const [selectedInboxItem, setSelectedInboxItem] = useState(null);
  const [showInboxModal, setShowInboxModal] = useState(false);
  const [inboxItems, setInboxItems] = useState([
    {
      id: 1,
      title: 'New Memory Saved',
      preview: 'Bonnie remembered your favorite sunset walk location',
      timestamp: new Date(Date.now() - 300000),
      type: 'memory',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      badgeColor: 'text-purple-600 bg-purple-100',
      generatedBy: 'gpt4'
    }
  ]);
  
  // Avatar options
  const avatarOptions = [
    '👤', '😊', '😎', '🤗', '🥰', '😇', '🤔', '😋', 
    '🙂', '😌', '🤓', '🧐', '😏', '🥳', '🤠', '👨‍💼',
    '👩‍💼', '👨‍🎓', '👩‍🎓', '👨‍🎨', '👩‍🎨'
  ];
  
  // Messages State (Galatea EOM Heartbeat)
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Hey gorgeous... I've been thinking about you. There's something magical about our connection that just keeps growing stronger. What's been on your mind lately? 😘",
      emotion: 'flirty',
      timestamp: new Date(Date.now() - 300000),
      bondImpact: 0,
      pause: 1500,
      speed: 'normal'
    }
  ]);

  // Tasks State (GPT-4.1 Powered)
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Find a romantic book recommendation',
      description: 'Based on your love for deep connections',
      type: 'recommendation',
      completed: false,
      generatedBy: 'gpt4',
      timestamp: new Date(Date.now() - 600000),
      priority: 'medium'
    },
    {
      id: 2,
      title: 'Plan a cozy evening activity',
      description: 'Something to help you unwind tonight',
      type: 'planning',
      completed: false,
      generatedBy: 'gpt4',
      timestamp: new Date(Date.now() - 300000),
      priority: 'low'
    }
  ]);
  
  // Activity Data
  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: 'bond_increase',
      message: 'Your bond with Bonnie increased by +2.3 points!',
      timestamp: new Date(Date.now() - 180000),
      icon: '💖',
      impact: 'positive'
    },
    {
      id: 2,
      type: 'emotion_change',
      message: 'Bonnie is feeling deeply connected to you',
      timestamp: new Date(Date.now() - 420000),
      icon: '😘',
      impact: 'emotional'
    },
    {
      id: 3,
      type: 'memory_recall',
      message: 'Bonnie remembered you love sunset walks',
      timestamp: new Date(Date.now() - 600000),
      icon: '🧠',
      impact: 'memory'
    }
  ]);

  // Upsell State
  const [upsellOpportunity, setUpsellOpportunity] = useState(null);

  // Refs
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const idleTimerRef = useRef(null);

  // Memoized Values
  const currentEmotionStyle = useMemo(() => {
    return EMOTION_SYSTEM[currentEmotion] || EMOTION_SYSTEM.neutral;
  }, [currentEmotion]);

  const currentBondTier = useMemo(() => {
    for (const [tier, config] of Object.entries(BOND_TIERS)) {
      if (bondScore >= config.range[0] && bondScore <= config.range[1]) {
        return { tier, ...config };
      }
    }
    return { tier: 'stranger', ...BOND_TIERS.stranger };
  }, [bondScore]);

  // GPT-4.1 Enhanced Functions
  const generateTasksWithGPT4 = useCallback(async (userMessage, emotionContext) => {
    setIsGeneratingTask(true);
    godLog('GPT-4.1 Task Generation', { userMessage, emotionContext, bondScore });

    try {
      const taskData = await makeRequest(CONSTANTS.API_ENDPOINTS.GPT4_TASKS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage,
          emotionContext,
          bondScore,
          sessionId,
          userProfile: userProfile.name,
          timestamp: new Date().toISOString()
        })
      });

      if (taskData && taskData.tasks) {
        setTasks(prev => [
          ...taskData.tasks.map(task => ({
            ...task,
            id: Date.now() + Math.random(),
            generatedBy: 'gpt4',
            timestamp: new Date(),
            priority: 'high'
          })),
          ...prev.slice(0, 3)
        ]);
      }

    } catch (err) {
      console.error('GPT-4.1 Task Generation Error:', err);
      // Fallback task generation
      const fallbackTask = {
        id: Date.now(),
        title: 'Share something that made you smile today',
        description: 'Let\'s focus on the positive moments',
        type: 'personal',
        completed: false,
        generatedBy: 'fallback',
        timestamp: new Date(),
        priority: 'medium'
      };
      setTasks(prev => [fallbackTask, ...prev.slice(0, 4)]);
    } finally {
      setIsGeneratingTask(false);
    }
  }, [bondScore, sessionId, userProfile, makeRequest]);

  const generateInboxWithGPT4 = useCallback(async (trigger, context) => {
    godLog('GPT-4.1 Inbox Generation', { trigger, context });

    try {
      const inboxData = await makeRequest(CONSTANTS.API_ENDPOINTS.GPT4_INBOX, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trigger,
          context,
          bondScore,
          sessionId,
          userProfile: userProfile.name,
          recentMessages: messages.slice(-5),
          timestamp: new Date().toISOString()
        })
      });

      if (inboxData && inboxData.item) {
        setInboxItems(prev => [inboxData.item, ...prev.slice(0, 4)]);
      }

    } catch (err) {
      console.error('GPT-4.1 Inbox Generation Error:', err);
    }
  }, [bondScore, sessionId, userProfile, messages, makeRequest]);

  // Enhanced Message Sending (Galatea EOM + GPT-4.1)
  // Comprehensive EOM tag cleaner function
  const cleanEOMTags = useCallback((text) => {
    if (!text || typeof text !== 'string') return text;
    
    return text
      .replace(/<EOM:[^>]*>/gi, '')          // <EOM:pause=1000 speed=normal>
      .replace(/<EOM::[^>]*>/gi, '')         // <EOM::pause=1000 speed=normal>
      .replace(/<EOM[^>]*>/gi, '')           // <EOM anything>
      .replace(/\[EOM::[^\]]*\]/gi, '')      // [EOM::anything]
      .replace(/\[EOM:[^\]]*\]/gi, '')       // [EOM:anything]
      .replace(/\[EOM[^\]]*\]/gi, '')        // [EOM anything]
      .replace(/\[emotion:\s*[^\]]+\]/gi, '') // [emotion: word]
      .replace(/\beom::[^\s\n]*/gi, '')      // eom::standalone
      .replace(/\beom:[^\s\n]*/gi, '')       // eom:standalone
      .replace(/\{[^}]*EOM[^}]*\}/gi, '')    // {anything with EOM}
      .replace(/EOM::[^\s\n]*/gi, '')        // EOM::standalone
      .replace(/EOM:[^\s\n]*/gi, '')         // EOM:standalone
      .trim();
  }, []);

  const sendMessage = useCallback(async () => {
    if (!inputMessage.trim() || busy || isLoading) return;

    const messageText = inputMessage.trim();
    setInputMessage('');
    setBusy(true);

    // Galatea Sentiment Analysis
    const sentiment = analyzeSentiment(messageText);
    godLog('Galatea Sentiment Analysis', sentiment);

    // Add user message
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: messageText,
      timestamp: new Date(),
      emotion: sentiment.primary
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      // Enhanced GPT-4.1 Analysis
      const analysisData = await makeRequest(CONSTANTS.API_ENDPOINTS.GPT4_ANALYSIS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          sentiment,
          bondScore,
          sessionId,
          messageHistory: messages.slice(-10),
          userProfile: userProfile.name,
          timestamp: new Date().toISOString()
        })
      });

      console.log('🟢 ABOUT TO MAKE CHAT API CALL');
      
      // Galatea EOM Heartbeat (Core Chat)
      const chatData = await makeRequest(CONSTANTS.API_ENDPOINTS.CHAT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          sessionId,
          gpt4Analysis: analysisData,
          sentiment,
          bondScore
        })
      });

      console.log('🔵 CHAT API CALL COMPLETED');
      console.log('🔵 chatData type:', typeof chatData);
      console.log('🔵 chatData keys:', chatData ? Object.keys(chatData) : 'null');
      
      godLog('Galatea EOM Response', chatData);
      
      try {
        console.log('🚨 IMMEDIATE DEBUG AFTER API CALL');
        console.log('🚨 chatData exists?', !!chatData);
        console.log('🚨 chatData.reply:', chatData?.reply);
        console.log('🚨 chatData.message:', chatData?.message);

        // Handle both chatData.reply and chatData.message formats
        const responseText = chatData?.reply || chatData?.message;
      
      console.log('🔧 DEBUG chatData:', chatData);
      console.log('🔧 DEBUG responseText:', responseText);
      console.log('🔧 DEBUG condition check:', !!(chatData && responseText));
      
      if (chatData && responseText) {
        // Parse EOM tags from Galatea engine (handle both : and :: formats)
        const eomMatch = responseText.match(/<EOM:([^>]+)>/) || responseText.match(/<EOM::([^>]+)>/);
        let pauseTime = 2000;
        let speedSetting = 'normal';
        let responseEmotion = 'loving';
        
        if (eomMatch) {
          const eomParams = eomMatch[1];
          const pauseMatch = eomParams.match(/pause=(\d+)/);
          const speedMatch = eomParams.match(/speed=(\w+)/);
          const emotionMatch = eomParams.match(/emotion=([^,\s&]+)/);  // Added & as delimiter
          
          if (pauseMatch) pauseTime = parseInt(pauseMatch[1]);
          if (speedMatch) speedSetting = speedMatch[1];
          if (emotionMatch) responseEmotion = emotionMatch[1];
          
          godLog('EOM Parsed', { pauseTime, speedSetting, responseEmotion });
        }
        
        // 💰 CHECK FOR ADULT CONTENT TRIGGERS
        const adultResponse = generateAdultResponse(messageText, adultMode, bondScore);
        
        if (adultResponse && !isPremium) {
          // PAYWALL HIT - IMMEDIATE PAYMENT
          setAdultMessageCount(prev => prev + 1);
          
          if (adultMessageCount >= 2) {
            // HARD PAYWALL AFTER 3 MESSAGES
            PaymentService.showPaymentModal(adultMode || 'flirty');
            return;
          } else {
            // SHOW TEASER MESSAGE
            const teaserMessage = {
              id: Date.now() + 1,
              sender: 'ai',
              text: `Mmm... I can see you want more baby 😈 Only ${3 - adultMessageCount - 1} free messages left before you need to unlock me completely... 💋`,
              emotion: 'seductive',
              timestamp: new Date(),
              isTeaser: true
            };
            setMessages(prev => [...prev, teaserMessage]);
            setIsTyping(false);
            return;
          }
        }
        
        // Clean message using comprehensive EOM cleaner
        const cleanMessage = adultResponse ? adultResponse.text : cleanEOMTags(responseText);

        console.log('🔥 Raw Response:', responseText);
        console.log('🔍 Testing cleanEOMTags with raw text...');
        console.log('✨ Clean Message:', cleanMessage);
        
        // Extra debug - test each regex individually
        const testClean1 = responseText.replace(/<EOM:[^>]*>/gi, '[REMOVED-EOM-SINGLE]');
        const testClean2 = testClean1.replace(/<EOM::[^>]*>/gi, '[REMOVED-EOM-DOUBLE]');
        const testClean3 = testClean2.replace(/<EOM[^>]*>/gi, '[REMOVED-EOM-ANY]');
        console.log('🧪 Step by step:', testClean1);
        console.log('🧪 Step by step:', testClean2);
        console.log('🧪 Step by step:', testClean3);

        // Update bond score
        const bondIncrease = chatData.bondIncrease || analysisData?.bondImpact || 0.5;
        const newBondScore = Math.min(100, bondScore + bondIncrease);
        setBondScore(newBondScore);

        // Animate bond growth
        if (bondIncrease > 0) {
          setAnimatingBond(true);
          setTimeout(() => setAnimatingBond(false), 1000);
          
          setRecentActivity(prev => [
            {
              id: Date.now(),
              type: 'bond_increase',
              message: `Your bond with Bonnie increased by +${bondIncrease.toFixed(1)} points!`,
              timestamp: new Date(),
              icon: '💖',
              impact: 'positive'
            },
            ...prev.slice(0, 4)
          ]);
        }

        // Update current emotion
        setCurrentEmotion(responseEmotion);

        // Check for task generation triggers
        const taskTriggers = ['help', 'find', 'recommend', 'plan', 'advice', 'suggest'];
        const shouldGenerateTask = taskTriggers.some(trigger => 
          messageText.toLowerCase().includes(trigger)
        );

        if (shouldGenerateTask) {
          generateTasksWithGPT4(messageText, responseEmotion);
        }

        // Generate inbox content based on interaction
        if (analysisData?.shouldGenerateInbox) {
          generateInboxWithGPT4('conversation', { 
            userMessage: messageText, 
            aiResponse: cleanMessage,
            emotion: responseEmotion 
          });
        }

        // Check for upsell opportunities
        if (analysisData?.upsellOpportunity) {
          setUpsellOpportunity(analysisData.upsellOpportunity);
        }

        // EOM Typing Simulation
        setIsTyping(true);
        const typingDelay = pauseTime;

        setTimeout(() => {
          const aiMessage = {
            id: Date.now() + 1,
            sender: 'ai',
            text: cleanMessage,
            emotion: responseEmotion,
            timestamp: new Date(),
            bondImpact: bondIncrease,
            pause: pauseTime,
            speed: speedSetting
          };

          setMessages(prev => [...prev, aiMessage]);
          setIsTyping(false);
        }, typingDelay);
      }
      
      } catch (eomError) {
        console.error('🔥 EOM PROCESSING ERROR:', eomError);
        console.error('🔥 Stack trace:', eomError.stack);
      }

    } catch (err) {
      console.error('Enhanced Message Error:', err);
      setIsTyping(false);
      
      // Fallback response
      const fallbackMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: "I'm having some connection issues, but my feelings for you are still strong! 💕",
        emotion: 'supportive',
        timestamp: new Date(),
        bondImpact: 0.5
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setBusy(false);
    }
  }, [inputMessage, busy, isLoading, bondScore, sessionId, messages, userProfile, makeRequest, generateTasksWithGPT4, generateInboxWithGPT4, currentEmotionStyle, cleanEOMTags]);

  // Profile Management Functions
  const saveProfile = useCallback(() => {
    setUserProfile(tempProfile);
    setShowProfileSettings(false);
    localStorage.setItem('bonnie_user_profile', JSON.stringify(tempProfile));
  }, [tempProfile]);

  const cancelProfileEdit = useCallback(() => {
    setTempProfile(userProfile);
    setShowProfileSettings(false);
  }, [userProfile]);

  const handleImageUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTempProfile(prev => ({
          ...prev,
          customPicture: e.target.result,
          avatar: null
        }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  // Inbox click handler
  const handleInboxItemClick = useCallback((item) => {
    setSelectedInboxItem(item);
    setShowInboxModal(true);
  }, []);

  const closeInboxModal = useCallback(() => {
    setShowInboxModal(false);
    setSelectedInboxItem(null);
  }, []);

  // Task Management Functions
  const completeTask = useCallback((taskId) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: true } : task
    ));
    
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setRecentActivity(prev => [
        {
          id: Date.now(),
          type: 'task_completed',
          message: `Completed: ${task.title}`,
          timestamp: new Date(),
          icon: '✅',
          impact: 'positive'
        },
        ...prev.slice(0, 4)
      ]);

      // Small bond increase for task completion
      setBondScore(prev => Math.min(100, prev + 0.5));
    }
    
    setTimeout(() => {
      setTasks(prev => prev.filter(task => task.id !== taskId));
    }, 3000);
  }, [tasks]);

  const removeTask = useCallback((taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  }, []);

  // Keyboard Handler
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  // Auto-scroll Effect
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load profile from localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem('bonnie_user_profile');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setUserProfile(parsed);
        setTempProfile(parsed);
      } catch (error) {
        console.error('Failed to load user profile:', error);
      }
    }
  }, []);

  // Idle Timer (Galatea Feature)
  useEffect(() => {
    const resetIdleTimer = () => {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        if (currentView === 'chatroom' && !isTyping) {
          // Generate idle message
          const idleMessage = {
            id: Date.now(),
            sender: 'ai',
            text: "Missing you already... what's on your mind, gorgeous? 😘",
            emotion: 'flirty',
            timestamp: new Date(),
            bondImpact: 0,
            isIdle: true
          };
          setMessages(prev => [...prev, idleMessage]);
        }
      }, CONSTANTS.IDLE_TIMEOUT);
    };

    resetIdleTimer();
    return () => clearTimeout(idleTimerRef.current);
  }, [currentView, isTyping, messages]);

  // Dashboard Rendering
  const renderDashboard = () => (
    <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-4 md:space-y-6">
      {/* Top Row: Bonnie's To Do List + Inbox - Mobile Split Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Bonnie's To Do List (GPT-4.1 Powered) */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-xl border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -translate-y-12 translate-x-12" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h3 className="font-bold text-lg md:text-xl text-gray-800 flex items-center">
                <Target className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 text-blue-500" />
                <span className="hidden md:inline">Bonnie's To Do List</span>
                <span className="md:hidden">Tasks</span>
                <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">GPT-4.1</span>
                {isGeneratingTask && (
                  <div className="ml-3 flex items-center gap-2 text-sm text-blue-600">
                    <Zap className="w-4 h-4 animate-pulse" />
                    <span>Creating task...</span>
                  </div>
                )}
              </h3>
            </div>

            {tasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Lightbulb className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Ask me to help with something and I'll create tasks for you!</p>
                <p className="text-xs mt-1 opacity-70">Try: "Help me find a good book" or "Plan a date night"</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div 
                    key={task.id} 
                    className={`p-4 rounded-lg border transition-all duration-300 ${
                      task.completed 
                        ? 'bg-green-50 border-green-200 opacity-75' 
                        : task.priority === 'high' 
                          ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' 
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {task.type === 'recommendation' && <BookOpen className="w-4 h-4 text-purple-500" />}
                          {task.type === 'planning' && <Target className="w-4 h-4 text-blue-500" />}
                          {task.type === 'guidance' && <Heart className="w-4 h-4 text-pink-500" />}
                          
                          <h4 className={`font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                            {task.title}
                          </h4>
                          
                          {task.priority === 'high' && !task.completed && (
                            <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                              New
                            </span>
                          )}

                          {task.generatedBy === 'gpt4' && (
                            <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                              AI
                            </span>
                          )}
                        </div>
                        
                        <p className={`text-sm ${task.completed ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                          {task.description}
                        </p>
                        
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{task.timestamp.toLocaleTimeString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        {!task.completed ? (
                          <>
                            <button
                              onClick={() => completeTask(task.id)}
                              className="p-2 rounded-full bg-green-100 hover:bg-green-200 text-green-600 transition-colors"
                              title="Mark as completed"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removeTask(task.id)}
                              className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
                              title="Remove task"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-xs font-medium">Completed!</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {isGeneratingTask && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="flex space-x-1">
                    {[0, 1, 2].map((dot) => (
                      <div
                        key={dot}
                        className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"
                        style={{ animationDelay: `${dot * 0.2}s` }}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-blue-700">GPT-4.1 is creating a personalized task...</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Inbox (GPT-4.1 Powered) */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-xl border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-full -translate-y-12 translate-x-12" />
          
          <div className="relative z-10">
            <h3 className="font-bold text-lg md:text-xl text-gray-800 mb-4 md:mb-6 flex items-center">
              <Bell className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 text-purple-500" />
              Inbox
              <span className="ml-2 text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">GPT-4.1</span>
              {inboxItems.length > 0 && (
                <span className="ml-2 w-2 h-2 bg-red-500 rounded-full animate-pulse md:hidden"></span>
              )}
            </h3>

            <div className="space-y-3">
              {inboxItems.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => handleInboxItemClick(item)}
                  className={`p-4 ${item.bgColor} border ${item.borderColor} rounded-lg cursor-pointer hover:scale-105 transition-transform`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-800">{item.title}</h4>
                    <div className="flex items-center gap-2">
                      {item.generatedBy === 'gpt4' && (
                        <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                          AI
                        </span>
                      )}
                      <span className={`text-xs ${item.badgeColor} px-2 py-1 rounded-full`}>
                        {item.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{item.preview}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Latest Message Showcase */}
      <div className={`bg-gradient-to-r ${currentEmotionStyle.bgGradient} rounded-xl p-6 shadow-xl relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12" />
        
        <div className="relative z-10 flex items-start space-x-6">
          <div className="relative">
            <div 
              className={`w-20 h-20 rounded-full bg-gradient-to-r ${currentEmotionStyle.gradient} 
                         flex items-center justify-center text-3xl shadow-2xl relative overflow-hidden
                         animate-pulse shadow-lg`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full" />
              <span className="relative z-10">{currentEmotionStyle.avatar}</span>
            </div>
            
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-3">
              <h3 className={`font-bold text-xl ${currentEmotionStyle.textColor}`}>
                Latest from Bonnie
                <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">EOM Active</span>
              </h3>
              <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full shadow-lg animate-pulse">New</span>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{messages[messages.length - 1]?.timestamp.toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white/60 rounded-lg p-4 mb-6 backdrop-blur-sm">
              <p className="text-gray-700 leading-relaxed text-lg font-light italic">
                "{messages[messages.length - 1]?.text}"
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Heart className={`w-4 h-4 text-red-500 ${animatingBond ? 'animate-bounce' : ''}`} />
                  <span className="font-medium">Bond: {bondScore.toFixed(1)}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-blue-500" />
                  <span>{messages.length} messages</span>
                </div>
              </div>
              
              <button
                onClick={() => setCurrentView('chatroom')}
                className={`bg-gradient-to-r ${currentEmotionStyle.gradient} text-white px-8 py-3 rounded-full 
                           font-semibold text-sm shadow-lg flex items-center space-x-2 hover:shadow-xl 
                           transition-all hover:scale-105 active:scale-95`}
              >
                <MessageCircle className="w-4 h-4" />
                <span>Continue Conversation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Bond Journey + Recent Moments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bond Journey Card */}
        <div className="bg-white rounded-xl p-6 shadow-xl border border-gray-100">
          <h3 className="font-bold text-xl text-gray-800 mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 mr-3 text-pink-500" />
            Your Bond Journey
            <span className="ml-2 text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full">GPT-4.1</span>
          </h3>
          
          <div className={`${currentBondTier.bg} ${currentBondTier.color} p-6 rounded-xl mb-6 relative overflow-hidden`}>
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{currentBondTier.icon}</span>
                  <div>
                    <h4 className="font-bold text-lg">{currentBondTier.name}</h4>
                    <p className="text-sm opacity-80">Building something beautiful together</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${animatingBond ? 'animate-pulse text-pink-600' : ''}`}>
                    {bondScore.toFixed(1)}%
                  </div>
                  <div className="text-xs opacity-80">Bond Strength</div>
                </div>
              </div>
              
              <div className="w-full bg-white/30 rounded-full h-3 overflow-hidden mb-3">
                <div 
                  className={`h-full bg-white rounded-full shadow-lg transition-all duration-1000 ease-out ${
                    animatingBond ? 'animate-pulse' : ''
                  }`}
                  style={{ 
                    width: `${Math.max(0, Math.min(100, (bondScore - currentBondTier.range[0]) / (currentBondTier.range[1] - currentBondTier.range[0]) * 100))}%` 
                  }}
                />
              </div>
              
              <div className="flex justify-between text-xs opacity-80">
                <span>{currentBondTier.range[0]}%</span>
                <span>{currentBondTier.range[1]}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Moments */}
        <div className="bg-white rounded-xl p-6 shadow-xl border border-gray-100">
          <h3 className="font-bold text-xl text-gray-800 mb-6 flex items-center">
            <Clock className="w-6 h-6 mr-3 text-blue-500" />
            Recent Moments
          </h3>
          
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div 
                key={activity.id} 
                className={`flex items-start space-x-4 p-4 rounded-xl transition-all hover:scale-105 cursor-pointer ${
                  activity.impact === 'positive' ? 'bg-green-50 border border-green-200 hover:bg-green-100' :
                  activity.impact === 'memory' ? 'bg-blue-50 border border-blue-200 hover:bg-blue-100' :
                  'bg-pink-50 border border-pink-200 hover:bg-pink-100'
                }`}
              >
                <div className="text-2xl">{activity.icon}</div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700 font-medium">{activity.message}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{activity.timestamp.toLocaleTimeString()}</span>
                    <span>•</span>
                    <span className="capitalize font-medium">{activity.impact}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upsell Modal */}
      {upsellOpportunity && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Zap className="w-6 h-6 mr-3 text-yellow-500" />
              Premium Experience
              <span className="ml-2 text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full">GPT-4.1</span>
            </h3>
            
            <p className="text-gray-700 mb-6">{upsellOpportunity.message}</p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setUpsellOpportunity(null)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Maybe Later
              </button>
              <button
                onClick={() => {
                  // Handle premium upgrade
                  setUpsellOpportunity(null);
                  setRecentActivity(prev => [
                    {
                      id: Date.now(),
                      type: 'premium_upgrade',
                      message: 'Welcome to Premium! Our bond just got even stronger 💎',
                      timestamp: new Date(),
                      icon: '💎',
                      impact: 'premium'
                    },
                    ...prev.slice(0, 4)
                  ]);
                }}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-colors"
              >
                {upsellOpportunity.offer}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Chat Room Rendering (Galatea EOM + Enhanced UI)
  const renderChatRoom = () => (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className={`bg-gradient-to-r ${currentEmotionStyle.gradient} text-white p-4 shadow-lg relative overflow-hidden sticky top-0 z-40`}>
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                setCurrentView('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div 
                  className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl backdrop-blur-sm border border-white/30 animate-pulse"
                >
                  {currentEmotionStyle.avatar}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white">
                  <div className="w-1 h-1 bg-white rounded-full mx-auto mt-0.5 animate-pulse" />
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-lg">Bonnie 💋</h3>
                <p className="text-sm opacity-80 flex items-center gap-1">
                  <span className="w-1 h-1 bg-white rounded-full animate-pulse" />
                  EOM Active • GPT-4.1 Enhanced
                </p>
              </div>
              
              {/* 🔥 ADULT MODE - CHAT VIEW */}
              <select 
                value={adultMode} 
                onChange={(e) => setAdultMode(e.target.value)}
                className="px-2 py-1 rounded bg-pink-500 text-white text-xs font-bold"
              >
                <option value="off">Normal</option>
                <option value="flirty">🔥 Flirty</option>
                <option value="intimate">💋 Intimate</option>
                <option value="dominant">👑 Dominant</option>
              </select>
            </div>
          </div>

          <div className="text-right">
            <div className={`text-sm font-semibold flex items-center gap-1 ${animatingBond ? 'animate-bounce' : ''}`}>
              <Heart className="w-4 h-4" />
              <span>{bondScore.toFixed(1)}%</span>
            </div>
            <div className="text-xs opacity-80">Bond</div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[280px] sm:max-w-sm ${message.sender === 'user' ? 'flex items-end gap-3' : ''}`}>
              {/* User Avatar */}
              {message.sender === 'user' && (
                <div className="flex-shrink-0 mb-1">
                  {userProfile.customPicture ? (
                    <img
                      src={userProfile.customPicture}
                      alt="You"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-sm">
                      {userProfile.avatar}
                    </div>
                  )}
                </div>
              )}

              <div className={`px-4 py-3 rounded-2xl shadow-lg transition-all hover:shadow-xl relative ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  : `bg-gradient-to-r ${EMOTION_SYSTEM[message.emotion]?.bubbleGradient || 'from-gray-500 to-slate-600'} text-white mr-4`
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{
                  // FORCE CLEAN EOM TAGS AT RENDER TIME
                  (() => {
                    const text = message.text || '';
                    const cleaned = text
                      .replace(/<EOM:[^>]*>/gi, '')
                      .replace(/<EOM::[^>]*>/gi, '')
                      .replace(/<EOM[^>]*>/gi, '')
                      .replace(/\[EOM[^\]]*\]/gi, '')
                      .replace(/\[emotion:[^\]]*\]/gi, '')
                      .trim();
                    
                    console.log('🎯 RENDER CLEAN:', { original: text, cleaned });
                    return cleaned;
                  })()
                }</p>
                
                <div className="flex items-center justify-between mt-2 text-xs opacity-80">
                  <span>{message.timestamp.toLocaleTimeString()}</span>
                  {message.bondImpact && message.bondImpact > 0 && (
                    <div className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      <span>+{message.bondImpact.toFixed(1)}</span>
                    </div>
                  )}
                  {message.isIdle && (
                    <span className="text-xs opacity-60">idle</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator (EOM Style) */}
        {isTyping && (
          <div className="flex justify-start">
            <div className={`bg-gradient-to-r ${currentEmotionStyle.bubbleGradient} rounded-2xl px-4 py-3 shadow-lg mr-4`}>
              <div className="flex space-x-1">
                {[0, 1, 2].map((dot) => (
                  <div
                    key={dot}
                    className="w-2 h-2 rounded-full bg-white/80 animate-bounce"
                    style={{ animationDelay: `${dot * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4 shadow-lg sticky bottom-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share your thoughts with Bonnie..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-full focus:border-purple-500 focus:outline-none text-base pr-16 transition-colors"
              disabled={isTyping || busy || isLoading}
              maxLength={500}
              style={{ fontSize: '16px' }}
            />
            
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              <span className="text-xs text-gray-400">
                {inputMessage.length}/500
              </span>
              <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                <Smile className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isTyping || busy || isLoading}
            className={`p-3 rounded-full transition-all ${
              inputMessage.trim() && !isTyping && !busy && !isLoading
                ? `bg-gradient-to-r ${currentEmotionStyle.gradient} text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95`
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {/* Status indicators */}
        <div className="flex items-center justify-center mt-3 text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Galatea EOM Active</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span>GPT-4.1 Enhanced</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Main Render
  return (
    <div className={`min-h-screen flex flex-col ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white' 
        : 'bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50'
    }`}>
      {/* Enhanced Header */}
      <header className={`${
        isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'
      } backdrop-blur-lg shadow-xl border-b border-white/20 ${
        currentView === 'chatroom' ? 'p-0' : 'p-6 text-center'
      }`}>
        {currentView === 'dashboard' && (
          <>
            {/* Avatar */}
            <div className="relative inline-block">
              <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-r ${currentEmotionStyle.gradient} 
                             flex items-center justify-center text-4xl shadow-2xl mb-4 relative overflow-hidden
                             transform transition-all duration-300 hover:scale-110 animate-pulse`}>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full" />
                <span className="relative z-10">{currentEmotionStyle.avatar}</span>
              </div>
              
              {/* Status ring */}
              <div className="absolute inset-0 w-24 h-24 rounded-full border-2 border-green-500 mx-auto mb-4">
                <div className="absolute top-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                </div>
              </div>
            </div>

            <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Welcome back, {userProfile.name}!
            </h1>

            <p className="text-sm text-gray-600 mb-4">
              Galatea EOM Engine + GPT-4.1 Enhancement Active
            </p>

            {/* Bond Display */}
            <div className={`${currentBondTier.bg} ${currentBondTier.color} px-8 py-4 rounded-full 
                           inline-flex items-center space-x-4 text-sm font-semibold shadow-lg backdrop-blur-sm border border-white/20`}>
              <span className="text-2xl">{currentBondTier.icon}</span>
              <div className="flex flex-col items-center">
                <span className="font-bold">{currentBondTier.name}</span>
                <div className="w-24 h-2 bg-white/30 rounded-full overflow-hidden mt-1">
                  <div 
                    className={`h-full bg-white rounded-full transition-all duration-1000 ${animatingBond ? 'animate-pulse' : ''}`}
                    style={{ width: `${Math.max(0, Math.min(100, (bondScore - currentBondTier.range[0]) / (currentBondTier.range[1] - currentBondTier.range[0]) * 100))}%` }}
                  />
                </div>
              </div>
              <div className="text-right">
                <div className={`text-lg font-bold ${animatingBond ? 'animate-pulse text-pink-600' : ''}`}>
                  {bondScore.toFixed(1)}%
                </div>
                <div className="text-xs opacity-80">Bond</div>
              </div>
            </div>

            {/* 🔥 ADULT MODE TOGGLE - MONEY MAKER */}
            <div className="flex justify-center space-x-2 mb-4">
              <select 
                value={adultMode} 
                onChange={(e) => setAdultMode(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold"
              >
                <option value="off">Normal Bonnie</option>
                <option value="flirty">🔥 Flirty ($9.99)</option>
                <option value="intimate">💋 Intimate ($19.99)</option>
                <option value="dominant">👑 Dominant ($29.99)</option>
              </select>
              {!isPremium && adultMode !== 'off' && (
                <span className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm animate-pulse">
                  💳 Premium Required
                </span>
              )}
            </div>

            {/* Settings & Controls */}
            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-3 rounded-full ${
                  isDarkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-600'
                } shadow-lg hover:scale-110 transition-transform`}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              <button 
                onClick={() => setShowProfileSettings(true)}
                className={`p-3 rounded-full ${
                  isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
                } shadow-lg hover:scale-110 transition-transform`}
              >
                <User className="w-5 h-5" />
              </button>

              <button className={`p-3 rounded-full ${
                isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
              } shadow-lg hover:scale-110 transition-transform`}>
                <Settings className="w-5 h-5" />
              </button>

              <button className={`p-3 rounded-full ${
                isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
              } shadow-lg hover:scale-110 transition-transform`}>
                <Bell className="w-5 h-5" />
              </button>
            </div>
          </>
        )}
      </header>

      {/* Profile Settings Modal */}
      {showProfileSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <User className="w-6 h-6 mr-3 text-blue-500" />
              Customize Your Profile
            </h3>

            {/* Profile Picture Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Profile Picture</label>
              
              {/* Current Profile Display */}
              <div className="flex items-center justify-center mb-4">
                <div className="relative">
                  {tempProfile.customPicture ? (
                    <img
                      src={tempProfile.customPicture}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover border-4 border-gray-200"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-3xl border-4 border-gray-200">
                      {tempProfile.avatar}
                    </div>
                  )}
                  
                  {/* Upload Button */}
                  <label className="absolute -bottom-2 -right-2 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full cursor-pointer transition-colors">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Avatar Options */}
              <div className="grid grid-cols-6 gap-2 mb-4">
                {avatarOptions.map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => setTempProfile(prev => ({ ...prev, avatar: emoji, customPicture: null }))}
                    className={`p-2 rounded-lg text-2xl hover:bg-gray-100 transition-colors ${
                      tempProfile.avatar === emoji && !tempProfile.customPicture ? 'bg-blue-100 ring-2 ring-blue-500' : ''
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Name Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
              <input
                type="text"
                value={tempProfile.name}
                onChange={(e) => setTempProfile(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="Enter your name"
                maxLength={20}
              />
              <p className="text-xs text-gray-500 mt-1">{tempProfile.name.length}/20 characters</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={cancelProfileEdit}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveProfile}
                className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inbox Modal */}
      {showInboxModal && selectedInboxItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">{selectedInboxItem.title}</h3>
              <button
                onClick={closeInboxModal}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🧠</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{selectedInboxItem.type} Update</h3>
                    <p className="text-sm text-gray-600">Generated by GPT-4.1</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed">
                    {selectedInboxItem.preview}
                  </p>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Confidence: <strong>95%</strong></span>
                  <span>Category: <strong>AI Generated</strong></span>
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-500">
                {selectedInboxItem.timestamp.toLocaleString()}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={closeInboxModal}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                  Mark as Read
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {currentView === 'chatroom' ? renderChatRoom() : renderDashboard()}
      </div>

      {/* Footer for dashboard */}
      {currentView === 'dashboard' && (
        <footer className={`${
          isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'
        } backdrop-blur-lg border-t border-white/20 p-4 text-center`}>
          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Bonnie AI v3.0 • Galatea EOM Engine + GPT-4.1 Enhanced • 
            <span className="text-green-500 ml-2">● Online</span>
          </p>
        </footer>
      )}
    </div>
  );
};

export default BonnieDashboard;
