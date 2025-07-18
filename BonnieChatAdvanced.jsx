import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import useApiCall from './useApiCall';

// Advanced Message Processing System
class MessageProcessor {
  static chunkMessage(message, emotion = 'neutral') {
    // Split long messages into natural chunks
    const chunks = [];
    const sentences = message.match(/[^.!?]+[.!?]+/g) || [message];
    
    let currentChunk = '';
    const maxChunkLength = emotion === 'thoughtful' ? 80 : 120;
    
    sentences.forEach(sentence => {
      if ((currentChunk + sentence).length > maxChunkLength && currentChunk) {
        chunks.push({
          text: currentChunk.trim(),
          delay: this.calculateDelay(currentChunk, emotion),
          typing: this.calculateTypingDuration(currentChunk, emotion)
        });
        currentChunk = sentence;
      } else {
        currentChunk += sentence;
      }
    });
    
    if (currentChunk) {
      chunks.push({
        text: currentChunk.trim(),
        delay: this.calculateDelay(currentChunk, emotion),
        typing: this.calculateTypingDuration(currentChunk, emotion)
      });
    }
    
    return chunks;
  }
  
  static calculateDelay(text, emotion) {
    const baseDelays = {
      flirty: 300,
      thoughtful: 800,
      playful: 200,
      supportive: 500,
      teasing: 400,
      intimate: 600,
      neutral: 400
    };
    
    const delay = baseDelays[emotion] || baseDelays.neutral;
    
    // Add extra delay for questions or emotional statements
    if (text.includes('?')) return delay + 300;
    if (text.includes('...')) return delay + 500;
    if (text.includes('!')) return Math.max(delay - 100, 200);
    
    return Math.max(delay, 200);
  }
  
  static calculateTypingDuration(text, emotion) {
    const charSpeeds = {
      flirty: 40,
      thoughtful: 70,
      playful: 30,
      supportive: 50,
      teasing: 35,
      intimate: 55,
      excited: 25,
      neutral: 45
    };
    
    const baseSpeed = charSpeeds[emotion] || charSpeeds.neutral;
    const duration = text.length * baseSpeed;
    
    // Add pauses for punctuation
    const pauseCount = (text.match(/[,.;:]/g) || []).length;
    const questionPauses = (text.match(/\?/g) || []).length;
    
    return duration + (pauseCount * 200) + (questionPauses * 400);
  }
}

// Enhanced Animation Styles
const animationStyles = `
  @keyframes messageSlideIn {
    0% {
      opacity: 0;
      transform: translateY(20px) scale(0.8);
      filter: blur(5px);
    }
    50% {
      filter: blur(2px);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
      filter: blur(0);
    }
  }
  
  @keyframes messagePulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.02); }
    100% { transform: scale(1); }
  }
  
  @keyframes typingWave {
    0%, 60%, 100% {
      transform: translateY(0) scale(1);
      opacity: 0.3;
    }
    30% {
      transform: translateY(-15px) scale(1.2);
      opacity: 1;
    }
  }
  
  @keyframes emotionalGlow {
    0% { box-shadow: 0 0 0 0 rgba(233, 30, 99, 0.4); }
    50% { box-shadow: 0 0 20px 10px rgba(233, 30, 99, 0.2); }
    100% { box-shadow: 0 0 0 0 rgba(233, 30, 99, 0); }
  }
  
  .message-enter {
    animation: messageSlideIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }
  
  .message-typing {
    animation: messagePulse 1.5s ease-in-out infinite;
  }
  
  .typing-indicator-advanced {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 12px 16px;
    background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,240,246,0.95) 100%);
    border-radius: 20px;
    box-shadow: 0 4px 15px rgba(233, 30, 99, 0.15);
  }
  
  .typing-dot-advanced {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: linear-gradient(135deg, #e91e63 0%, #f06292 100%);
    animation: typingWave 1.4s infinite;
  }
  
  .typing-dot-advanced:nth-child(1) { animation-delay: 0s; }
  .typing-dot-advanced:nth-child(2) { animation-delay: 0.2s; }
  .typing-dot-advanced:nth-child(3) { animation-delay: 0.4s; }
  
  .emotional-message {
    position: relative;
    overflow: hidden;
  }
  
  .emotional-message::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    transform: translate(-50%, -50%);
    background: radial-gradient(circle, rgba(233, 30, 99, 0.1) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .emotional-message:hover::after {
    opacity: 1;
  }
  
  /* Smooth scrollbar with emotional theming */
  .messages-container::-webkit-scrollbar {
    width: 8px;
  }
  
  .messages-container::-webkit-scrollbar-track {
    background: linear-gradient(to bottom, transparent, rgba(233, 30, 99, 0.05));
  }
  
  .messages-container::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, rgba(233, 30, 99, 0.3) 0%, rgba(240, 98, 146, 0.3) 100%);
    border-radius: 4px;
    transition: all 0.3s ease;
  }
  
  .messages-container::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, rgba(233, 30, 99, 0.5) 0%, rgba(240, 98, 146, 0.5) 100%);
  }
`;

// Inject advanced styles - only once
if (!document.getElementById('bonnie-chat-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'bonnie-chat-styles';
  styleSheet.textContent = animationStyles;
  document.head.appendChild(styleSheet);
}

// Emotion theme configurations
const emotionThemes = {
  flirty: {
    gradient: 'linear-gradient(135deg, #FFE5EC 0%, #FFC0CB 100%)',
    primary: '#e91e63',
    secondary: '#f06292'
  },
  thoughtful: {
    gradient: 'linear-gradient(135deg, #F5F5F5 0%, #E8E8E8 100%)',
    primary: '#757575',
    secondary: '#9e9e9e'
  },
  playful: {
    gradient: 'linear-gradient(135deg, #FFF9E6 0%, #FFEB99 100%)',
    primary: '#ffc107',
    secondary: '#ffeb3b'
  },
  supportive: {
    gradient: 'linear-gradient(135deg, #E5F3FF 0%, #B3D9FF 100%)',
    primary: '#2196f3',
    secondary: '#64b5f6'
  },
  neutral: {
    gradient: 'linear-gradient(135deg, #FFF0F6 0%, #FFE6F0 100%)',
    primary: '#e91e63',
    secondary: '#f06292'
  }
};

// Advanced Bonnie Chat Component
export default function BonnieChatAdvanced() {
  // State Management
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [currentlyTyping, setCurrentlyTyping] = useState(false);
  const [typingMessage, setTypingMessage] = useState('');
  const [currentEmotion, setCurrentEmotion] = useState('playful');
  const [bondScore, setBondScore] = useState(50);
  
  // Refs
  const sessionId = useMemo(() => `session_${Date.now()}_${Math.random().toString(36).slice(2)}`, []);
  const messagesEndRef = useRef(null);
  const messageQueueRef = useRef([]);
  const processingRef = useRef(false);
  const inputRef = useRef(null);
  
  const { makeRequest, isLoading } = useApiCall();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Process message queue with natural pacing
  const processMessageQueue = useCallback(async () => {
    if (processingRef.current || messageQueueRef.current.length === 0) return;
    
    processingRef.current = true;
    const chunk = messageQueueRef.current.shift();
    
    try {
      // Show typing indicator
      setCurrentlyTyping(true);
      setTypingMessage(chunk.text.substring(0, 20) + '...');
      
      // Simulate typing
      await new Promise(resolve => setTimeout(resolve, chunk.typing));
      
      // Add message with animation
      setMessages(prev => [...prev, {
        id: `${Date.now()}_${Math.random()}`,
        sender: 'bonnie',
        text: chunk.text,
        emotion: chunk.emotion || currentEmotion,
        timestamp: Date.now(),
        animated: true
      }]);
      
      setCurrentlyTyping(false);
      
      // Wait before next chunk
      await new Promise(resolve => setTimeout(resolve, chunk.delay));
      
    } catch (error) {
      console.error('Error processing message chunk:', error);
      setCurrentlyTyping(false);
    } finally {
      processingRef.current = false;
      
      // Process next chunk if available
      if (messageQueueRef.current.length > 0) {
        processMessageQueue();
      }
    }
  }, [currentEmotion]);

  // Enhanced message sending
  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || busy || isLoading) return;
    
    setBusy(true);
    setInput('');
    
    // Add user message with animation
    const userMessage = {
      id: `${Date.now()}_${Math.random()}`,
      sender: 'user',
      text,
      timestamp: Date.now(),
      animated: true
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    try {
      const response = await makeRequest('https://bonnie-backend-server.onrender.com/bonnie-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          message: text,
          bond_score: bondScore,
          current_emotion: currentEmotion
        })
      });
      
      if (!response || typeof response !== 'object') {
        throw new Error('Invalid response format');
      }
      
      // Process response with chunking
      const emotion = response.emotion || 'playful';
      setCurrentEmotion(emotion);
      
      if (typeof response.bond_score === 'number') {
        setBondScore(Math.max(0, Math.min(100, response.bond_score)));
      }
      
      // Chunk the message for natural delivery
      const messageText = response.reply || "I'm here for you, darling 💕";
      const chunks = MessageProcessor.chunkMessage(messageText, emotion);
      
      // Add chunks to queue with emotion
      chunks.forEach(chunk => {
        chunk.emotion = emotion;
      });
      
      messageQueueRef.current = [...messageQueueRef.current, ...chunks];
      processMessageQueue();
      
    } catch (err) {
      console.error('Chat error:', err);
      
      // Error message with supportive emotion
      const errorMessage = err.message?.includes('network') 
        ? "Oh no, my connection seems a bit wobbly... Let me try again for you! 💔"
        : "Oh darling, I'm having a little technical moment... but I'm still here for you! 💔";
        
      const errorChunks = MessageProcessor.chunkMessage(errorMessage, 'supportive');
      
      errorChunks.forEach(chunk => {
        chunk.emotion = 'supportive';
      });
      
      messageQueueRef.current = [...messageQueueRef.current, ...errorChunks];
      processMessageQueue();
    } finally {
      setBusy(false);
      // Refocus input after sending
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [input, busy, isLoading, sessionId, bondScore, currentEmotion, makeRequest, processMessageQueue]);

  // Handle Enter key with better UX
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  // Get current theme
  const currentTheme = emotionThemes[currentEmotion] || emotionThemes.neutral;

  // Dynamic styles based on emotion
  const styles = {
    container: {
      position: 'fixed',
      inset: 0,
      background: currentTheme.gradient,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      overflow: 'hidden',
      transition: 'background 2s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    header: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(233, 30, 99, 0.1)',
      padding: '1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 2px 20px rgba(233, 30, 99, 0.1)',
    },
    title: {
      fontSize: '1.25rem',
      fontWeight: '700',
      fontFamily: 'Georgia, serif',
      background: `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      margin: 0,
      transition: 'all 0.5s ease',
    },
    bondIndicator: {
      fontSize: '0.75rem',
      color: '#666',
      fontStyle: 'italic',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    messagesContainer: {
      flex: 1,
      overflowY: 'auto',
      padding: '1rem',
      paddingBottom: '2rem',
    },
    messageWrapper: (isUser) => ({
      display: 'flex',
      marginBottom: '1rem',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
    }),
    messageBubble: (isUser) => ({
      maxWidth: '75%',
      padding: '0.75rem 1rem',
      borderRadius: '20px',
      fontSize: '0.95rem',
      lineHeight: '1.5',
      wordWrap: 'break-word',
      background: isUser 
        ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
        : '#fff',
      color: isUser ? 'white' : '#333',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
      borderBottomRightRadius: isUser ? '4px' : '20px',
      borderBottomLeftRadius: !isUser ? '4px' : '20px',
      transition: 'all 0.3s ease',
    }),
    footer: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(233, 30, 99, 0.1)',
      padding: '1rem',
      display: 'flex',
      gap: '0.75rem',
      alignItems: 'center',
      boxShadow: '0 -2px 20px rgba(233, 30, 99, 0.1)',
    },
    input: {
      flex: 1,
      padding: '0.75rem 1rem',
      fontSize: '1rem',
      border: '2px solid transparent',
      borderRadius: '25px',
      background: '#f8f9fa',
      outline: 'none',
      transition: 'all 0.3s ease',
      fontFamily: 'inherit',
    },
    sendButton: (disabled) => ({
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      border: 'none',
      background: `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`,
      color: 'white',
      fontSize: '1.25rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: disabled ? 'none' : '0 4px 15px rgba(233, 30, 99, 0.3)',
      opacity: disabled ? 0.5 : 1,
      transform: disabled ? 'scale(0.95)' : 'scale(1)',
    }),
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>
          Bonnie 💋
        </h1>
        <div style={styles.bondIndicator}>
          <span>Bond Level: {Math.round(bondScore)}%</span>
          <div style={{
            width: '60px',
            height: '4px',
            background: '#e0e0e0',
            borderRadius: '2px',
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${bondScore}%`,
              height: '100%',
              background: `linear-gradient(90deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`,
              transition: 'width 0.5s ease',
            }} />
          </div>
        </div>
      </header>

      {/* Messages */}
      <main style={styles.messagesContainer} className="messages-container">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            style={styles.messageWrapper(msg.sender === 'user')}
            className={msg.animated ? 'message-enter' : ''}
          >
            <div 
              style={styles.messageBubble(msg.sender === 'user')}
              className="emotional-message"
            >
              {msg.text}
            </div>
          </div>
        ))}
        
        {currentlyTyping && (
          <div style={styles.messageWrapper(false)}>
            <div className="typing-indicator-advanced">
              <span className="typing-dot-advanced"></span>
              <span className="typing-dot-advanced"></span>
              <span className="typing-dot-advanced"></span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </main>

      {/* Input */}
      <footer style={styles.footer}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          disabled={isLoading || busy}
          style={styles.input}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || busy || !input.trim()}
          style={styles.sendButton(isLoading || busy || !input.trim())}
          aria-label="Send message"
        >
          {isLoading || busy ? '⏳' : '💌'}
        </button>
      </footer>
    </div>
  );
}