import { useState, useEffect, useCallback, useRef } from 'react';

const useChatState = () => {
  // Constants for optimization
  const MAX_MESSAGES = 100;
  const MESSAGE_CLEANUP_THRESHOLD = 120;
  const STORAGE_KEY = 'bonnie_chat_history';
  const BOND_STORAGE_KEY = 'bonnie_bond_level';
  const EMOTION_STORAGE_KEY = 'bonnie_last_emotion';

  // Core state
  const [messages, setMessages] = useState([]);
  const [bondLevel, setBondLevel] = useState(50);
  const [currentEmotion, setCurrentEmotion] = useState('playful');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationDepth, setConversationDepth] = useState(0);
  
  // Performance tracking
  const messageCountRef = useRef(0);
  const lastCleanupRef = useRef(Date.now());

  // Load persisted data on mount
  useEffect(() => {
    try {
      // Load chat history
      const savedMessages = localStorage.getItem(STORAGE_KEY);
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages);
        // Only load recent messages to prevent memory issues
        const recentMessages = parsedMessages.slice(-MAX_MESSAGES);
        setMessages(recentMessages);
        messageCountRef.current = recentMessages.length;
      }

      // Load bond level
      const savedBond = localStorage.getItem(BOND_STORAGE_KEY);
      if (savedBond) {
        setBondLevel(parseInt(savedBond, 10));
      }

      // Load last emotion
      const savedEmotion = localStorage.getItem(EMOTION_STORAGE_KEY);
      if (savedEmotion) {
        setCurrentEmotion(savedEmotion);
      }
    } catch (error) {
      console.warn('Failed to load chat history:', error);
    }
  }, []);

  // Persist data when it changes
  useEffect(() => {
    if (messages.length > 0) {
      try {
        // Only save recent messages to prevent storage bloat
        const messagesToSave = messages.slice(-MAX_MESSAGES);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messagesToSave));
      } catch (error) {
        console.warn('Failed to save chat history:', error);
        // Clear old data if storage is full
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

  // Dynamic UI theme based on bond level
  const getUITheme = useCallback(() => {
    const themes = {
      low: { // 0-30
        primary: '#e91e63',
        secondary: '#f8bbd9',
        background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%)',
        intensity: 0.6,
        particleCount: 15
      },
      medium: { // 31-60
        primary: '#e91e63',
        secondary: '#f06292',
        background: 'linear-gradient(135deg, #fce4ec 0%, #f48fb1 50%, #f06292 100%)',
        intensity: 0.8,
        particleCount: 25
      },
      high: { // 61-80
        primary: '#e91e63',
        secondary: '#f06292',
        background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd9 25%, #f48fb1 50%, #f06292 75%, #e91e63 100%)',
        intensity: 1.0,
        particleCount: 35
      },
      intimate: { // 81-100
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

  // Enhanced typing speed based on emotion and conversation depth
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

    // Adjust based on conversation depth
    const depthModifier = Math.min(conversationDepth * 0.05, 0.3); // Max 30% slower
    speed *= (1 + depthModifier);

    // Adjust based on bond level
    const bondModifier = (bondLevel - 50) * 0.001; // Higher bond = slightly faster
    speed *= (1 - bondModifier);

    // Adjust based on text content
    const questionCount = (text.match(/\?/g) || []).length;
    const exclamationCount = (text.match(/!/g) || []).length;
    const ellipsisCount = (text.match(/\.\.\./g) || []).length;

    speed += questionCount * 5; // Questions slower
    speed -= exclamationCount * 3; // Excitement faster
    speed += ellipsisCount * 8; // Pauses slower

    return Math.max(speed, 15); // Minimum speed
  }, [conversationDepth, bondLevel]);

  // Enhanced delay calculation
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

    // Longer responses need more "thinking" time
    delay += Math.min(textLength * 8, 2000);

    // Higher bond level = faster responses (she's more eager)
    delay *= (1 - (bondLevel - 50) * 0.003);

    // Conversation depth adds thoughtfulness
    delay += conversationDepth * 50;

    return Math.max(delay, 200);
  }, [bondLevel, conversationDepth]);

  // Add message with cleanup
  const addMessage = useCallback((message) => {
    setMessages(prev => {
      const newMessages = [...prev, { ...message, id: Date.now() + Math.random() }];
      messageCountRef.current = newMessages.length;

      // Trigger cleanup if needed
      if (newMessages.length > MESSAGE_CLEANUP_THRESHOLD) {
        const cleanedMessages = newMessages.slice(-MAX_MESSAGES);
        lastCleanupRef.current = Date.now();
        return cleanedMessages;
      }

      return newMessages;
    });

    // Update conversation depth
    if (message.sender === 'bonnie') {
      setConversationDepth(prev => prev + 1);
    }
  }, []);

  // Update bond level with validation
  const updateBondLevel = useCallback((newLevel) => {
    const clampedLevel = Math.max(0, Math.min(100, newLevel));
    setBondLevel(clampedLevel);
  }, []);

  // Clear chat history
  const clearChatHistory = useCallback(() => {
    setMessages([]);
    setConversationDepth(0);
    messageCountRef.current = 0;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear chat history:', error);
    }
  }, []);

  // Get conversation statistics
  const getConversationStats = useCallback(() => {
    const userMessages = messages.filter(m => m.sender === 'user').length;
    const bonnieMessages = messages.filter(m => m.sender === 'bonnie').length;
    const totalCharacters = messages.reduce((acc, m) => acc + m.text.length, 0);
    
    return {
      totalMessages: messages.length,
      userMessages,
      bonnieMessages,
      averageMessageLength: messages.length > 0 ? Math.round(totalCharacters / messages.length) : 0,
      conversationDepth,
      bondLevel
    };
  }, [messages, conversationDepth, bondLevel]);

  return {
    // Core state
    messages,
    bondLevel,
    currentEmotion,
    isTyping,
    conversationDepth,

    // Actions
    addMessage,
    updateBondLevel,
    setCurrentEmotion,
    setIsTyping,
    clearChatHistory,

    // Computed values
    uiTheme: getUITheme(),
    getTypingSpeed,
    getResponseDelay,
    getConversationStats,

    // Performance data
    messageCount: messageCountRef.current,
    lastCleanup: lastCleanupRef.current
  };
};

export default useChatState;