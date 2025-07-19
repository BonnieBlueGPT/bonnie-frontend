// frontend-integration-example.jsx
// Example React Component showing how to integrate with Bonnie's Advanced Emotional Engine v22.0
// This demonstrates proper EOM timing handling while keeping technical artifacts invisible

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const BonnieAdvancedChat = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [bonnieEmotion, setBonnieEmotion] = useState('neutral');
  const [bondScore, setBondScore] = useState(1.0);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [upsellMessage, setUpsellMessage] = useState(null);
  const [milestoneAlert, setMilestoneAlert] = useState(null);
  const chatEndRef = useRef(null);

  // Backend URL - adjust this to your actual backend
  const BACKEND_URL = 'http://localhost:3001'; // Change this to your backend URL

  // ═══════════════════════════════════════════════════════════════════
  // 🎭 EMOTION-BASED UI STYLING - Visual feedback based on Bonnie's emotion
  // ═══════════════════════════════════════════════════════════════════

  const getEmotionStyles = (emotion) => {
    const emotionStyles = {
      flirty: {
        borderColor: '#ff69b4',
        backgroundColor: '#fff0f5',
        textColor: '#d63384'
      },
      supportive: {
        borderColor: '#20c997',
        backgroundColor: '#f0fff4',
        textColor: '#198754'
      },
      playful: {
        borderColor: '#ffc107',
        backgroundColor: '#fffbf0',
        textColor: '#ff8c00'
      },
      intimate: {
        borderColor: '#6f42c1',
        backgroundColor: '#f8f4ff',
        textColor: '#6f42c1'
      },
      excited: {
        borderColor: '#fd7e14',
        backgroundColor: '#fff8f0',
        textColor: '#fd7e14'
      },
      neutral: {
        borderColor: '#6c757d',
        backgroundColor: '#f8f9fa',
        textColor: '#495057'
      }
    };
    return emotionStyles[emotion] || emotionStyles.neutral;
  };

  // ═══════════════════════════════════════════════════════════════════
  // 🧹 MESSAGE PROCESSING - Handle responses and clean technical artifacts
  // ═══════════════════════════════════════════════════════════════════

  // Clean any technical artifacts that might have escaped backend cleaning
  const ensureCleanMessage = (message) => {
    if (!message) return '';
    
    // Extra safety cleaning on frontend (backend should already handle this)
    let cleaned = message;
    
    // Remove any EOM tags that might have escaped
    cleaned = cleaned.replace(/<EOM[^>]*>/gi, '');
    cleaned = cleaned.replace(/\[EOM[^\]]*\]/gi, '');
    
    // Remove emotion tags
    cleaned = cleaned.replace(/\[emotion:[^\]]*\]/gi, '');
    
    // Remove timing indicators
    cleaned = cleaned.replace(/\[pause:[^\]]*\]/gi, '');
    cleaned = cleaned.replace(/<pause:[^>]*>/gi, '');
    
    // Clean extra whitespace
    cleaned = cleaned.trim().replace(/\s+/g, ' ');
    
    return cleaned;
  };

  // ═══════════════════════════════════════════════════════════════════
  // 💬 CHAT FUNCTIONS - Handle sending messages and receiving responses
  // ═══════════════════════════════════════════════════════════════════

  const sendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    // Add user message to chat immediately
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageText,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsTyping(true);

    try {
      // Send to backend
      const response = await axios.post(`${BACKEND_URL}/bonnie-chat`, {
        session_id: sessionId,
        message: messageText
      });

      const { message, meta, delay, upsell } = response.data;

      // Ensure the message is completely clean (double-check backend cleaning)
      const cleanMessage = ensureCleanMessage(message);

      // Update UI state based on response metadata
      setBonnieEmotion(meta.emotion || 'neutral');
      setBondScore(meta.bondScore || 1.0);

      // Handle milestone notifications
      if (meta.newMilestone) {
        setMilestoneAlert({
          milestone: meta.newMilestone,
          points: meta.totalPoints || 0
        });
        // Auto-hide after 5 seconds
        setTimeout(() => setMilestoneAlert(null), 5000);
      }

      // Handle upsell messages
      if (upsell) {
        setUpsellMessage(upsell);
        // Auto-hide after 10 seconds
        setTimeout(() => setUpsellMessage(null), 10000);
      }

      // Apply emotional timing delay (this is the EOM system working invisibly)
      setTimeout(() => {
        const bonnieMessage = {
          id: Date.now() + 1,
          type: 'bonnie',
          content: cleanMessage, // Only show the clean message
          emotion: meta.emotion,
          intensity: meta.emotionalIntensity,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, bonnieMessage]);
        setIsTyping(false);
      }, delay || 1000); // Use the EOM delay from backend

    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
      
      // Show error message to user
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

  // Initialize chat when component mounts
  useEffect(() => {
    const initializeChat = async () => {
      try {
        const response = await axios.post(`${BACKEND_URL}/bonnie-entry`, {
          session_id: sessionId
        });

        const { message, meta, delay } = response.data;
        const cleanMessage = ensureCleanMessage(message);

        setBonnieEmotion(meta.emotion || 'neutral');
        setBondScore(meta.bondScore || 1.0);

        setTimeout(() => {
          const welcomeMessage = {
            id: Date.now(),
            type: 'bonnie',
            content: cleanMessage,
            emotion: meta.emotion,
            timestamp: new Date()
          };
          setMessages([welcomeMessage]);
        }, delay || 1000);

      } catch (error) {
        console.error('Error initializing chat:', error);
      }
    };

    initializeChat();
  }, [sessionId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ═══════════════════════════════════════════════════════════════════
  // 🎨 RENDER COMPONENT - UI with emotional styling and clean messages
  // ═══════════════════════════════════════════════════════════════════

  const emotionStyle = getEmotionStyles(bonnieEmotion);

  return (
    <div className="bonnie-chat-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      
      {/* Header with emotional indicator */}
      <div 
        className="chat-header" 
        style={{
          padding: '15px',
          borderRadius: '10px 10px 0 0',
          backgroundColor: emotionStyle.backgroundColor,
          borderLeft: `4px solid ${emotionStyle.borderColor}`,
          marginBottom: '10px'
        }}
      >
        <h2 style={{ margin: 0, color: emotionStyle.textColor }}>
          💕 Bonnie (Feeling {bonnieEmotion}) - Bond: {bondScore.toFixed(1)}/10
        </h2>
      </div>

      {/* Milestone Alert */}
      {milestoneAlert && (
        <div 
          style={{
            padding: '10px',
            backgroundColor: '#d4edda',
            border: '1px solid #c3e6cb',
            borderRadius: '5px',
            marginBottom: '10px',
            color: '#155724'
          }}
        >
          🎉 Milestone Reached: {milestoneAlert.milestone.replace('_', ' ')} 
          ({milestoneAlert.points} points)
        </div>
      )}

      {/* Upsell Message */}
      {upsellMessage && (
        <div 
          style={{
            padding: '10px',
            backgroundColor: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: '5px',
            marginBottom: '10px',
            color: '#856404'
          }}
        >
          💎 {upsellMessage}
          <button 
            style={{ marginLeft: '10px', padding: '5px 10px' }}
            onClick={() => setUpsellMessage(null)}
          >
            Maybe Later
          </button>
        </div>
      )}

      {/* Chat Messages */}
      <div 
        className="messages-container" 
        style={{
          height: '400px',
          overflowY: 'auto',
          border: '1px solid #ddd',
          borderRadius: '5px',
          padding: '10px',
          backgroundColor: '#fff'
        }}
      >
        {messages.map((msg) => (
          <div 
            key={msg.id}
            style={{
              marginBottom: '10px',
              padding: '10px',
              borderRadius: '10px',
              backgroundColor: msg.type === 'user' ? '#e3f2fd' : emotionStyle.backgroundColor,
              marginLeft: msg.type === 'user' ? '50px' : '0',
              marginRight: msg.type === 'bonnie' ? '50px' : '0',
              border: msg.type === 'bonnie' ? `1px solid ${emotionStyle.borderColor}` : '1px solid #bbdefb'
            }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
              {msg.type === 'user' ? '👤 You' : '💕 Bonnie'}
              {msg.emotion && (
                <span style={{ fontSize: '12px', marginLeft: '10px', color: '#666' }}>
                  ({msg.emotion})
                </span>
              )}
            </div>
            <div>{msg.content}</div>
          </div>
        ))}

        {isTyping && (
          <div 
            style={{
              padding: '10px',
              borderRadius: '10px',
              backgroundColor: emotionStyle.backgroundColor,
              marginRight: '50px',
              border: `1px solid ${emotionStyle.borderColor}`,
              fontStyle: 'italic',
              color: '#666'
            }}
          >
            💕 Bonnie is typing...
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div style={{ marginTop: '10px', display: 'flex' }}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage(userInput)}
          placeholder="Type your message to Bonnie..."
          style={{
            flex: 1,
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '5px 0 0 5px',
            fontSize: '16px'
          }}
          disabled={isTyping}
        />
        <button
          onClick={() => sendMessage(userInput)}
          disabled={isTyping || !userInput.trim()}
          style={{
            padding: '10px 20px',
            backgroundColor: emotionStyle.borderColor,
            color: 'white',
            border: 'none',
            borderRadius: '0 5px 5px 0',
            cursor: isTyping ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          Send
        </button>
      </div>

      {/* Debug Info (only for development) */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
          Debug: Session {sessionId} | Emotion: {bonnieEmotion} | Bond: {bondScore}
        </div>
      )}
    </div>
  );
};

export default BonnieAdvancedChat;