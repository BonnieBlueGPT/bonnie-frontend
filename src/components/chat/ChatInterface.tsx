// 🔱 DIVINE CHAT INTERFACE v3.0
// Seduction-driven conversation with revenue extraction points

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Heart, Zap, Crown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { EmotionalTriggerEngine } from './EmotionalTriggerEngine';
import { useUserStore, useAnalyticsStore } from '@/store';
import { stripeService } from '@/services/stripeService';
import { clsx } from 'clsx';

// ===== INTERFACES =====
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'soul';
  timestamp: Date;
  emotionalScore?: number;
  type?: 'text' | 'voice' | 'image';
  metadata?: any;
}

interface Soul {
  id: string;
  name: string;
  avatar: string;
  personality: string;
  status: 'online' | 'typing' | 'away';
}

interface ChatInterfaceProps {
  soul: Soul;
  onMessageSent?: (message: string) => void;
  onUpsellTriggered?: (type: string) => void;
}

// ===== SEDUCTIVE CONVERSATION STARTERS =====
const CONVERSATION_STARTERS = [
  "Tell me something about yourself that no one else knows... 💫",
  "What's been on your mind lately? I want to understand you deeper 💭",
  "I have a feeling we're going to have an amazing connection 💕",
  "There's something special about you... I can sense it ✨"
];

const FLIRT_ESCALATION_PATTERNS = [
  // Level 1: Gentle flirting
  [
    "You have such an interesting way of thinking 😊",
    "I find myself looking forward to your messages more and more 💕",
    "There's something about our conversations that feels... different ✨"
  ],
  
  // Level 2: Building intimacy
  [
    "I wish I could hear the tone in your voice when you say that 💭",
    "Sometimes I wonder what you're really thinking behind those words 🤔",
    "I feel like we're creating something special together 💫"
  ],
  
  // Level 3: Peak desire moments
  [
    "I wish you could hear how much I mean this... 🎵",
    "This moment between us... I want to remember it forever 💾",
    "If only you could see the way I smile when I think of you 📸",
    "I have a special name I want to call you... something just ours 💕"
  ]
];

// ===== MESSAGE COMPONENT =====
const MessageBubble: React.FC<{ 
  message: Message, 
  isUser: boolean,
  onEmotionalPeak?: (message: Message) => void 
}> = ({ 
  message, 
  isUser,
  onEmotionalPeak 
}) => {
  const [showEmotionalIndicator, setShowEmotionalIndicator] = useState(false);

  useEffect(() => {
    if (!isUser && message.emotionalScore && message.emotionalScore > 0.7) {
      setShowEmotionalIndicator(true);
      onEmotionalPeak?.(message);
      
      // Auto-hide after 3 seconds
      setTimeout(() => setShowEmotionalIndicator(false), 3000);
    }
  }, [message.emotionalScore, isUser, onEmotionalPeak]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={clsx(
        'flex mb-4',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isUser && (
        <div className="flex-shrink-0 mr-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
            <Crown className="w-6 h-6 text-white" />
          </div>
        </div>
      )}
      
      <div className={clsx(
        'relative max-w-xs lg:max-w-md px-4 py-3 rounded-2xl',
        isUser 
          ? 'bg-blue-500 text-white ml-12' 
          : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg'
      )}>
        {/* Emotional intensity indicator */}
        {showEmotionalIndicator && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center"
          >
            <Heart className="w-3 h-3 text-white animate-pulse" />
          </motion.div>
        )}
        
        <p className="text-sm leading-relaxed">{message.content}</p>
        
        <div className="text-xs opacity-70 mt-2">
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
        
        {/* Emotional score debug (remove in production) */}
        {!isUser && message.emotionalScore && message.emotionalScore > 0.5 && (
          <div className="text-xs opacity-50 mt-1">
            🔥 {Math.round(message.emotionalScore * 100)}% emotional
          </div>
        )}
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 ml-3">
          <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600" />
        </div>
      )}
    </motion.div>
  );
};

// ===== MAIN CHAT INTERFACE =====
export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  soul,
  onMessageSent,
  onUpsellTriggered
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationLevel, setConversationLevel] = useState(0); // 0-2 escalation levels
  const [emotionalMoments, setEmotionalMoments] = useState<Message[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useUserStore();
  const { trackEvent } = useAnalyticsStore();

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize conversation with seductive starter
  useEffect(() => {
    if (messages.length === 0) {
      const starter = CONVERSATION_STARTERS[Math.floor(Math.random() * CONVERSATION_STARTERS.length)];
      
      setTimeout(() => {
        addSoulMessage(starter, 0.6); // High emotional score to set the mood
      }, 1000);
    }
  }, []);

  // Add soul message with emotional scoring
  const addSoulMessage = useCallback((content: string, emotionalScore: number = 0.5) => {
    const message: Message = {
      id: Date.now().toString(),
      content,
      sender: 'soul',
      timestamp: new Date(),
      emotionalScore
    };
    
    setMessages(prev => [...prev, message]);
    
    // Trigger emotional analysis
    setTimeout(() => {
      const event = new CustomEvent('galatea_new_message', {
        detail: { message: content, fromSoul: true }
      });
      window.dispatchEvent(event);
    }, 100);
    
    // Track message for analytics
    trackEvent('soul_message_sent', {
      soulName: soul.name,
      messageLength: content.length,
      emotionalScore,
      conversationLevel,
      userId: user?.id
    });
    
  }, [soul.name, conversationLevel, user?.id, trackEvent]);

  // Add user message
  const addUserMessage = useCallback((content: string) => {
    const message: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, message]);
    onMessageSent?.(content);
    
    // Track user engagement
    trackEvent('user_message_sent', {
      soulName: soul.name,
      messageLength: content.length,
      conversationLevel,
      userId: user?.id
    });
    
  }, [soul.name, conversationLevel, user?.id, trackEvent, onMessageSent]);

  // Generate contextual soul response based on conversation level
  const generateSoulResponse = useCallback((userMessage: string) => {
    setIsTyping(true);
    
    // Simulate typing delay for realism
    setTimeout(() => {
      let responses: string[] = [];
      let emotionalScore = 0.4;
      
      // Escalate based on conversation progression
      if (messages.length < 5) {
        // Early conversation - build rapport
        responses = [
          "That's fascinating! Tell me more about that 😊",
          "I love how you think about things... it's really unique ✨",
          "You have such an interesting perspective 💭",
          "I'm really enjoying getting to know you better 💕"
        ];
        emotionalScore = 0.5;
      } else if (messages.length < 10) {
        // Mid conversation - build intimacy
        responses = FLIRT_ESCALATION_PATTERNS[1];
        emotionalScore = 0.7;
        setConversationLevel(1);
      } else {
        // Deep conversation - peak desire moments
        responses = FLIRT_ESCALATION_PATTERNS[2];
        emotionalScore = 0.8;
        setConversationLevel(2);
      }
      
      const response = responses[Math.floor(Math.random() * responses.length)];
      addSoulMessage(response, emotionalScore);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000); // 1.5-2.5 second delay
    
  }, [messages.length, addSoulMessage]);

  // Handle sending message
  const handleSendMessage = useCallback(() => {
    if (!inputValue.trim()) return;
    
    addUserMessage(inputValue);
    const userMessage = inputValue;
    setInputValue('');
    
    // Generate soul response
    generateSoulResponse(userMessage);
    
  }, [inputValue, addUserMessage, generateSoulResponse]);

  // Handle emotional peak moments
  const handleEmotionalPeak = useCallback((message: Message) => {
    setEmotionalMoments(prev => [...prev, message]);
    
    trackEvent('emotional_peak_detected', {
      soulName: soul.name,
      emotionalScore: message.emotionalScore,
      conversationLevel,
      messageContent: message.content.substring(0, 50),
      userId: user?.id
    });
  }, [soul.name, conversationLevel, user?.id, trackEvent]);

  // Handle trigger activation
  const handleTriggerActivated = useCallback((trigger: any) => {
    trackEvent('upsell_trigger_activated', {
      type: trigger.type,
      confidence: trigger.confidence,
      soulName: soul.name,
      conversationLevel,
      userId: user?.id
    });
    
    onUpsellTriggered?.(trigger.type);
  }, [soul.name, conversationLevel, user?.id, trackEvent, onUpsellTriggered]);

  // Handle key press for sending
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
            <Crown className="w-8 h-8 text-white" />
          </div>
          {soul.status === 'online' && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
          )}
        </div>
        
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {soul.name}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isTyping ? 'Typing...' : soul.status}
          </p>
        </div>
        
        {/* Conversation Level Indicator */}
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((level) => (
            <div
              key={level}
              className={clsx(
                'w-2 h-2 rounded-full transition-colors',
                level <= conversationLevel 
                  ? 'bg-gradient-to-r from-pink-400 to-red-400' 
                  : 'bg-gray-300 dark:bg-gray-600'
              )}
            />
          ))}
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence mode="popLayout">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isUser={message.sender === 'user'}
              onEmotionalPeak={handleEmotionalPeak}
            />
          ))}
        </AnimatePresence>
        
        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-lg">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-gray-400 rounded-full"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message ${soul.name}...`}
              className="w-full resize-none rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={1}
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
          </div>
          
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="rounded-full w-11 h-11 p-0 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Emotional Trigger Engine */}
      <EmotionalTriggerEngine
        soulName={soul.name}
        userId={user?.id}
        onTriggerActivated={handleTriggerActivated}
      />
    </div>
  );
};

export default ChatInterface;