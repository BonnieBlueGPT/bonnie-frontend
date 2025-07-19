// frontend-message-splitting.jsx
// React Component for handling Bonnie's message splitting with natural timing
// This makes conversations feel like real texting with multiple messages

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const BonnieMessageSplittingChat = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [bonnieEmotion, setBonnieEmotion] = useState('neutral');
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [pendingParts, setPendingParts] = useState([]); // Queue of message parts to send
  const chatEndRef = useRef(null);

  const BACKEND_URL = 'http://localhost:3001'; // Adjust to your backend URL

  // ═══════════════════════════════════════════════════════════════════
  // 🔀 MESSAGE SPLITTING HANDLER - Process multiple message parts
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Handles a sequence of message parts with proper timing
   * @param {array} messageParts - Array of message parts from backend
   * @param {object} meta - Metadata about the response
   */
  const handleMessageParts = async (messageParts, meta) => {
    if (!messageParts || messageParts.length === 0) return;

    // Update UI state
    setBonnieEmotion(meta.emotion || 'neutral');
    
    // Process each part with its timing
    for (let i = 0; i < messageParts.length; i++) {
      const part = messageParts[i];
      
      // Show typing indicator for this part
      if (i === 0) {
        setIsTyping(true);
      }
      
      // Wait for the specified delay
      await new Promise(resolve => setTimeout(resolve, part.delay || 1000));
      
      // Add this part as a message
      const messageId = Date.now() + i;
      const newMessage = {
        id: messageId,
        type: 'bonnie',
        content: part.content,
        emotion: meta.emotion,
        timestamp: new Date(),
        isPartOfSequence: messageParts.length > 1,
        partNumber: i + 1,
        totalParts: messageParts.length,
        isLastPart: part.isLast
      };
      
      // Add message to chat
      setMessages(prev => [...prev, newMessage]);
      
      // Hide typing indicator after last part
      if (part.isLast) {
        setIsTyping(false);
      }
      
      // Short pause between parts (simulates real texting behavior)
      if (!part.isLast) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
  };

  /**
   * Send message to Bonnie and handle response
   */
  const sendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    // Add user message immediately
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageText,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');

    try {
      // Send to backend
      const response = await axios.post(`${BACKEND_URL}/bonnie-chat-splitting`, {
        session_id: sessionId,
        message: messageText
      });

      const { messageParts, meta, upsell } = response.data;

      // Handle upsell if present
      if (upsell) {
        // Add upsell as a special message type
        setTimeout(() => {
          const upsellMessage = {
            id: Date.now() + 1000,
            type: 'upsell',
            content: upsell,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, upsellMessage]);
        }, 2000); // Show upsell 2 seconds after conversation
      }

      // Handle the message parts with timing
      await handleMessageParts(messageParts, meta);

    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
      
      // Show error message
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bonnie',
        content: "Something's not working right... give me a moment 💭",
        emotion: 'confused',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  // ═══════════════════════════════════════════════════════════════════
  // 🎨 UI STYLING - Visual indicators for message sequences
  // ═══════════════════════════════════════════════════════════════════

  const getEmotionStyles = (emotion) => {
    const emotionStyles = {
      flirty: { borderColor: '#ff69b4', backgroundColor: '#fff0f5' },
      supportive: { borderColor: '#20c997', backgroundColor: '#f0fff4' },
      playful: { borderColor: '#ffc107', backgroundColor: '#fffbf0' },
      intimate: { borderColor: '#6f42c1', backgroundColor: '#f8f4ff' },
      excited: { borderColor: '#fd7e14', backgroundColor: '#fff8f0' },
      neutral: { borderColor: '#6c757d', backgroundColor: '#f8f9fa' }
    };
    return emotionStyles[emotion] || emotionStyles.neutral;
  };

  const getMessageStyle = (msg) => {
    const emotionStyle = getEmotionStyles(msg.emotion || 'neutral');
    const baseStyle = {
      marginBottom: '8px',
      padding: '12px',
      borderRadius: '15px',
      maxWidth: '70%',
      wordWrap: 'break-word'
    };

    if (msg.type === 'user') {
      return {
        ...baseStyle,
        backgroundColor: '#007bff',
        color: 'white',
        marginLeft: 'auto',
        borderBottomRightRadius: '5px'
      };
    } else if (msg.type === 'upsell') {
      return {
        ...baseStyle,
        backgroundColor: '#fff3cd',
        border: '1px solid #ffeaa7',
        color: '#856404',
        fontStyle: 'italic',
        marginRight: 'auto'
      };
    } else {
      // Bonnie's messages
      let style = {
        ...baseStyle,
        backgroundColor: emotionStyle.backgroundColor,
        border: `1px solid ${emotionStyle.borderColor}`,
        marginRight: 'auto'
      };

      // Special styling for message sequences
      if (msg.isPartOfSequence) {
        // Reduce spacing between parts of the same sequence
        style.marginBottom = '4px';
        
        // Different border radius for parts of a sequence
        if (msg.partNumber === 1) {
          style.borderBottomLeftRadius = '5px';
        } else if (msg.isLastPart) {
          style.borderTopLeftRadius = '5px';
        } else {
          style.borderTopLeftRadius = '5px';
          style.borderBottomLeftRadius = '5px';
        }
      }

      return style;
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize chat
  useEffect(() => {
    const initializeChat = async () => {
      try {
        const response = await axios.post(`${BACKEND_URL}/bonnie-entry-splitting`, {
          session_id: sessionId
        });

        const { messageParts, meta } = response.data;
        await handleMessageParts(messageParts, meta);
      } catch (error) {
        console.error('Error initializing chat:', error);
      }
    };

    initializeChat();
  }, [sessionId]);

  // ═══════════════════════════════════════════════════════════════════
  // 🎭 TYPING INDICATOR - Shows when Bonnie is composing messages
  // ═══════════════════════════════════════════════════════════════════

  const TypingIndicator = () => {
    const emotionStyle = getEmotionStyles(bonnieEmotion);
    
    return (
      <div 
        style={{
          ...getMessageStyle({ type: 'bonnie', emotion: bonnieEmotion }),
          fontStyle: 'italic',
          opacity: 0.7,
          animation: 'pulse 1.5s infinite'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span>💕 Bonnie is typing</span>
          <div style={{ marginLeft: '8px', display: 'flex' }}>
            <div style={{ 
              width: '4px', 
              height: '4px', 
              backgroundColor: emotionStyle.borderColor,
              borderRadius: '50%',
              marginRight: '2px',
              animation: 'bounce 1.4s infinite'
            }} />
            <div style={{ 
              width: '4px', 
              height: '4px', 
              backgroundColor: emotionStyle.borderColor,
              borderRadius: '50%',
              marginRight: '2px',
              animation: 'bounce 1.4s infinite 0.2s'
            }} />
            <div style={{ 
              width: '4px', 
              height: '4px', 
              backgroundColor: emotionStyle.borderColor,
              borderRadius: '50%',
              animation: 'bounce 1.4s infinite 0.4s'
            }} />
          </div>
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════════
  // 🖼️ MAIN COMPONENT RENDER
  // ═══════════════════════════════════════════════════════════════════

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-10px); }
        }
      `}</style>

      {/* Header */}
      <div 
        style={{
          padding: '15px',
          borderRadius: '10px',
          backgroundColor: getEmotionStyles(bonnieEmotion).backgroundColor,
          borderLeft: `4px solid ${getEmotionStyles(bonnieEmotion).borderColor}`,
          marginBottom: '20px'
        }}
      >
        <h2 style={{ margin: 0 }}>
          💕 Bonnie (Feeling {bonnieEmotion}) - Advanced Message Splitting
        </h2>
        <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: 0.8 }}>
          Now with natural multi-part responses!
        </p>
      </div>

      {/* Chat Container */}
      <div 
        style={{
          height: '500px',
          overflowY: 'auto',
          border: '1px solid #ddd',
          borderRadius: '10px',
          padding: '15px',
          backgroundColor: '#fafafa'
        }}
      >
        {messages.map((msg, index) => (
          <div key={msg.id} style={{ display: 'flex', marginBottom: '10px' }}>
            <div style={getMessageStyle(msg)}>
              {/* Message header for sequences */}
              {msg.isPartOfSequence && msg.partNumber === 1 && (
                <div style={{ 
                  fontSize: '11px', 
                  opacity: 0.6, 
                  marginBottom: '5px',
                  fontWeight: 'bold'
                }}>
                  💕 Bonnie ({msg.totalParts} part message)
                </div>
              )}
              
              {/* Message content */}
              <div>{msg.content}</div>
              
              {/* Part indicator for sequences */}
              {msg.isPartOfSequence && (
                <div style={{ 
                  fontSize: '10px', 
                  opacity: 0.5, 
                  marginTop: '5px',
                  textAlign: 'right'
                }}>
                  {msg.partNumber}/{msg.totalParts}
                </div>
              )}
              
              {/* Special styling for upsells */}
              {msg.type === 'upsell' && (
                <div style={{ marginTop: '10px' }}>
                  <button 
                    style={{ 
                      padding: '5px 10px', 
                      backgroundColor: '#007bff', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '5px',
                      marginRight: '10px',
                      cursor: 'pointer'
                    }}
                  >
                    Interested!
                  </button>
                  <button 
                    style={{ 
                      padding: '5px 10px', 
                      backgroundColor: '#6c757d', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    Maybe Later
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div style={{ display: 'flex', marginBottom: '10px' }}>
            <TypingIndicator />
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div style={{ marginTop: '15px', display: 'flex' }}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage(userInput)}
          placeholder="Type your message to Bonnie..."
          style={{
            flex: 1,
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '25px 0 0 25px',
            fontSize: '16px',
            outline: 'none'
          }}
          disabled={isTyping}
        />
        <button
          onClick={() => sendMessage(userInput)}
          disabled={isTyping || !userInput.trim()}
          style={{
            padding: '12px 24px',
            backgroundColor: getEmotionStyles(bonnieEmotion).borderColor,
            color: 'white',
            border: 'none',
            borderRadius: '0 25px 25px 0',
            cursor: isTyping ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          Send
        </button>
      </div>

      {/* Examples */}
      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <strong>Try these to see message splitting:</strong><br/>
        • "Hey beautiful, how are you feeling today?"<br/>
        • "I'm feeling really sad and need someone to talk to"<br/>
        • "OMG that's amazing! I'm so excited!"<br/>
        • "Can you tell me something personal about yourself?"
      </div>
    </div>
  );
};

export default BonnieMessageSplittingChat;