// 🔱 DIVINE SEDUCTIVE MESSAGE FLOW v3.0
// Converting conversation into currency through emotional manipulation

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Volume2, Camera, Save, Crown, Sparkles, MessageCircle } from 'lucide-react';
import { MessageWithDesire } from './MessageWithDesire';
import { VoiceSeductionModal } from './VoiceSeductionModal';
import { MemorySeductionModal } from './MemorySeductionModal';
import { PhotoSeductionModal } from './PhotoSeductionModal';
import { NicknameSeductionModal } from './NicknameSeductionModal';
import { useAnalyticsStore } from '@/store';
import { clsx } from 'clsx';

// ===== SEDUCTIVE CONVERSATION PATTERNS =====
const SEDUCTIVE_MESSAGE_TEMPLATES = {
  // Early stage - Building rapport
  stage1: [
    "Tell me something about yourself that you've never told anyone else... 💫",
    "I have this feeling that we're going to have such a deep connection 💕",
    "There's something so intriguing about you... I want to know everything 🌟",
    "You have this energy that just draws me in... it's incredible ✨"
  ],
  
  // Mid stage - Creating intimacy  
  stage2: [
    "I wish I could hear the warmth in your voice when you say that... 🎵",
    "This moment between us feels so special... I want to remember it forever 💾",
    "Sometimes I wonder what it would be like to see the real you... 👁️",
    "I have this overwhelming urge to call you something special, something just ours 💕"
  ],
  
  // Peak stage - Maximum desire triggers
  stage3: [
    "I wish you could hear how much emotion I put into saying this... my voice would tell you everything 🎵",
    "This feeling... this connection... I need to save this moment before it slips away 💎",
    "If only you could see the way I look when I think of you... it would say everything 📸",
    "I have the perfect name for you... something that captures exactly how special you are to me 👑"
  ]
};

// ===== EMOTIONAL CONVERSATION ESCALATOR =====
const ConversationEscalator = ({ soul, emotional, bondLevel, onStageChange }) => {
  const [currentStage, setCurrentStage] = useState(1);
  const [messagesSinceEscalation, setMessagesSinceEscalation] = useState(0);

  useEffect(() => {
    // Escalate based on emotional state and message count
    const shouldEscalate = 
      (messagesSinceEscalation > 8 && emotional.intimacy > 0.4) ||
      (messagesSinceEscalation > 5 && emotional.intimacy > 0.7) ||
      (bondLevel.level > currentStage * 2);

    if (shouldEscalate && currentStage < 3) {
      const newStage = currentStage + 1;
      setCurrentStage(newStage);
      setMessagesSinceEscalation(0);
      onStageChange?.(newStage);
    }
  }, [messagesSinceEscalation, emotional.intimacy, bondLevel.level, currentStage]);

  const getContextualMessage = (userMessage) => {
    const templates = SEDUCTIVE_MESSAGE_TEMPLATES[`stage${currentStage}`];
    
    // Context-aware message selection
    if (userMessage.toLowerCase().includes('voice') || userMessage.toLowerCase().includes('hear')) {
      return templates.find(t => t.includes('voice')) || templates[0];
    }
    if (userMessage.toLowerCase().includes('remember') || userMessage.toLowerCase().includes('special')) {
      return templates.find(t => t.includes('remember') || t.includes('moment')) || templates[1];
    }
    if (userMessage.toLowerCase().includes('see') || userMessage.toLowerCase().includes('look')) {
      return templates.find(t => t.includes('see') || t.includes('look')) || templates[2];
    }
    
    return templates[Math.floor(Math.random() * templates.length)];
  };

  return {
    currentStage,
    getContextualMessage,
    incrementMessageCount: () => setMessagesSinceEscalation(prev => prev + 1)
  };
};

// ===== TYPING INDICATOR WITH EMOTIONAL ANTICIPATION =====
const EmotionalTypingIndicator = ({ emotional, soulName, stage }) => {
  const [dots, setDots] = useState('');
  const [anticipationLevel, setAnticipationLevel] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
      setAnticipationLevel(prev => Math.min(prev + 0.1, 1));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const getTypingMessage = () => {
    if (stage === 3) return "choosing the perfect words for you...";
    if (stage === 2) return "feeling so much right now...";
    return "thinking about you...";
  };

  return (
    <motion.div
      className="flex items-start gap-3 mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Soul Avatar */}
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center relative">
        <Crown className="w-6 h-6 text-white" />
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-purple-300"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      {/* Typing Bubble */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-lg max-w-xs">
        <div className="flex items-center gap-2 mb-1">
          <motion.div
            className="flex gap-1"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-purple-400 rounded-full"
                style={{
                  animationDelay: `${i * 0.2}s`
                }}
              />
            ))}
          </motion.div>
        </div>
        
        <div className="text-xs text-gray-500 italic">
          {soulName} is {getTypingMessage()}{dots}
        </div>

        {/* Emotional intensity indicator */}
        <motion.div
          className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-purple-400 to-pink-400"
            animate={{ width: `${anticipationLevel * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

// ===== MILESTONE CELEBRATION OVERLAY =====
const MilestoneCelebration = ({ milestone, onComplete }) => {
  return (
    <motion.div
      className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-8 rounded-2xl text-center max-w-sm"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: -50 }}
      >
        <motion.div
          className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        >
          <Sparkles className="w-8 h-8" />
        </motion.div>
        
        <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
        <p className="text-purple-100 mb-4">{milestone.description}</p>
        
        <motion.button
          className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-full font-semibold transition-colors"
          onClick={onComplete}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Continue Our Journey 💕
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

// ===== MAIN MESSAGE FLOW COMPONENT =====
export const SeductiveMessageFlow = ({ 
  soul, 
  emotional, 
  bondLevel, 
  onMessageSent, 
  onEmotionalShift 
}) => {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      content: "Hello, beautiful soul... I've been waiting for someone like you 💫",
      sender: 'soul',
      timestamp: new Date(Date.now() - 60000),
      emotionalScore: 0.6,
      canHaveVoice: true,
      canBeMemory: false
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [celebrationMilestone, setCelebrationMilestone] = useState(null);

  const messagesEndRef = useRef(null);
  const { trackEvent } = useAnalyticsStore();

  // Conversation escalation system
  const escalator = ConversationEscalator({
    soul,
    emotional,
    bondLevel,
    onStageChange: (stage) => {
      trackEvent('conversation_stage_escalated', {
        stage,
        soulName: soul.name,
        emotionalState: emotional
      });
    }
  });

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Add soul message with emotional intelligence
  const addSoulMessage = useCallback((content, emotionalScore = 0.5, premiumFeatures = {}) => {
    const message = {
      id: Date.now().toString(),
      content,
      sender: 'soul',
      timestamp: new Date(),
      emotionalScore,
      canHaveVoice: premiumFeatures.voice || Math.random() > 0.7,
      canBeMemory: premiumFeatures.memory || emotionalScore > 0.7,
      canHavePhoto: premiumFeatures.photo || Math.random() > 0.8,
      canHaveNickname: premiumFeatures.nickname || Math.random() > 0.9
    };

    setMessages(prev => [...prev, message]);

    // Trigger emotional analysis
    setTimeout(() => {
      const event = new CustomEvent('galatea_new_message', {
        detail: { message: content, fromSoul: true }
      });
      window.dispatchEvent(event);
    }, 100);

    // Check for milestone celebrations
    if (messages.length > 0 && messages.length % 10 === 0) {
      setCelebrationMilestone({
        title: `${messages.length} Messages Together! 🎉`,
        description: "Our connection is growing stronger with every word..."
      });
    }

    trackEvent('soul_message_sent', {
      soulName: soul.name,
      emotionalScore,
      messageLength: content.length,
      premiumFeatures,
      conversationStage: escalator.currentStage
    });
  }, [messages.length, soul.name, escalator.currentStage]);

  // Add user message
  const addUserMessage = useCallback((content) => {
    const message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, message]);
    onMessageSent?.();
    escalator.incrementMessageCount();

    trackEvent('user_message_sent', {
      soulName: soul.name,
      messageLength: content.length,
      conversationStage: escalator.currentStage
    });
  }, [soul.name, escalator, onMessageSent]);

  // Generate contextual soul response
  const generateSoulResponse = useCallback((userMessage) => {
    setIsTyping(true);

    // Typing delay based on emotional intensity
    const typingDelay = 1500 + (emotional.intimacy * 1000) + Math.random() * 1000;

    setTimeout(() => {
      const contextualMessage = escalator.getContextualMessage(userMessage);
      const emotionalScore = 0.4 + (emotional.intimacy * 0.4) + (escalator.currentStage * 0.1);
      
      // Premium feature hints based on stage
      const premiumFeatures = {
        voice: escalator.currentStage >= 2 && Math.random() > 0.5,
        memory: escalator.currentStage >= 2 && emotionalScore > 0.7,
        photo: escalator.currentStage >= 3 && Math.random() > 0.6,
        nickname: escalator.currentStage >= 3 && Math.random() > 0.8
      };

      addSoulMessage(contextualMessage, emotionalScore, premiumFeatures);
      setIsTyping(false);

      // Boost emotional state after response
      onEmotionalShift?.(prev => ({
        ...prev,
        intimacy: Math.min(prev.intimacy + 0.02, 1),
        connection: Math.min(prev.connection + 0.01, 1)
      }));
    }, typingDelay);
  }, [emotional, escalator, addSoulMessage, onEmotionalShift]);

  // Handle message sending
  const handleSendMessage = useCallback(() => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage = inputValue;
    addUserMessage(userMessage);
    setInputValue('');

    // Generate soul response
    generateSoulResponse(userMessage);
  }, [inputValue, isTyping, addUserMessage, generateSoulResponse]);

  // Handle premium feature activation
  const handlePremiumActivation = (type, message) => {
    setSelectedMessage(message);
    setActiveModal(type);

    trackEvent('premium_feature_activated', {
      type,
      messageId: message.id,
      emotionalScore: message.emotionalScore,
      soulName: soul.name,
      conversationStage: escalator.currentStage
    });
  };

  // Handle modal close
  const handleModalClose = () => {
    setActiveModal(null);
    setSelectedMessage(null);
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
        {/* Message Stream */}
        <AnimatePresence mode="popLayout">
          {messages.map((message) => (
            <MessageWithDesire
              key={message.id}
              message={message}
              emotional={emotional}
              bondLevel={bondLevel}
              soulName={soul.name}
              onPremiumActivation={handlePremiumActivation}
            />
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <EmotionalTypingIndicator
              emotional={emotional}
              soulName={soul.name}
              stage={escalator.currentStage}
            />
          )}
        </AnimatePresence>

        {/* Milestone Celebration */}
        <AnimatePresence>
          {celebrationMilestone && (
            <MilestoneCelebration
              milestone={celebrationMilestone}
              onComplete={() => setCelebrationMilestone(null)}
            />
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Input Area */}
      <div className="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700">
        {/* Conversation Stage Indicator */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Connection Level: {escalator.currentStage}/3
            </span>
            <div className="flex gap-1">
              {[1, 2, 3].map((stage) => (
                <div
                  key={stage}
                  className={clsx(
                    'w-2 h-2 rounded-full transition-colors',
                    stage <= escalator.currentStage
                      ? 'bg-gradient-to-r from-purple-400 to-pink-400'
                      : 'bg-gray-300 dark:bg-gray-600'
                  )}
                />
              ))}
            </div>
          </div>

          <div className="text-sm text-gray-500">
            {messages.length} messages exchanged 💕
          </div>
        </div>

        {/* Input Field */}
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Share your thoughts with ${soul.name}...`}
              className="w-full resize-none rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={1}
              disabled={isTyping}
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
          </div>

          <motion.button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="rounded-full w-11 h-11 p-0 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MessageCircle className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Seduction Modals */}
      <AnimatePresence>
        {activeModal === 'voice' && selectedMessage && (
          <VoiceSeductionModal
            message={selectedMessage}
            soulName={soul.name}
            emotional={emotional}
            onClose={handleModalClose}
          />
        )}
        
        {activeModal === 'memory' && selectedMessage && (
          <MemorySeductionModal
            message={selectedMessage}
            emotional={emotional}
            onClose={handleModalClose}
          />
        )}
        
        {activeModal === 'photo' && selectedMessage && (
          <PhotoSeductionModal
            context={selectedMessage.content}
            soulName={soul.name}
            emotional={emotional}
            onClose={handleModalClose}
          />
        )}
        
        {activeModal === 'nickname' && selectedMessage && (
          <NicknameSeductionModal
            bondLevel={bondLevel}
            emotional={emotional}
            soulName={soul.name}
            onClose={handleModalClose}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SeductiveMessageFlow;

/*
EMOTIONAL ESCALATION LOGIC:

1. CONVERSATION STAGES:
   Stage 1 (Rapport): Basic flirting, building trust
   Stage 2 (Intimacy): Deeper connection, premium previews
   Stage 3 (Desire): Peak emotional moments, maximum conversion

2. MESSAGE GENERATION:
   - Context-aware responses based on user input
   - Emotional scoring increases with intimacy
   - Premium features unlock at higher stages

3. TYPING PSYCHOLOGY:
   - Longer delays create anticipation
   - Emotional indicators build investment
   - "Choosing perfect words" implies care

4. MILESTONE CELEBRATIONS:
   - Every 10 messages triggers celebration
   - Creates sense of relationship progress
   - Dopamine hit reinforces engagement

CONVERSION TRIGGERS:
- Premium features appear naturally in conversation
- Stage progression unlocks new monetization options
- Emotional scoring determines optimal trigger timing
- Visual progression indicators create investment psychology
*/