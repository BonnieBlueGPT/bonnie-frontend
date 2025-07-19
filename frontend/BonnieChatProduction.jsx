// 🚀 BONNIE AI CHAT COMPONENT - PRODUCTION v24.0
// WebSocket Real-time | JWT Auth | Advanced Features | Ultra-responsive

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

const BonnieChatProduction = () => {
  // ═══════════════════════════════════════════════════════════════════
  // 🎯 STATE MANAGEMENT - Enhanced with WebSocket support
  // ═══════════════════════════════════════════════════════════════════
  
  // Core chat state
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  
  // Authentication state
  const [user, setUser] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // UI state
  const [showEmotions, setShowEmotions] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState('neutral');
  const [bondScore, setBondScore] = useState(1.0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);
  const [connectionQuality, setConnectionQuality] = useState('good');
  
  // Advanced features
  const [notifications, setNotifications] = useState([]);
  const [conversationInsights, setConversationInsights] = useState({});
  const [responseTime, setResponseTime] = useState(0);
  
  // Refs
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const pingIntervalRef = useRef(null);
  const lastMessageTimeRef = useRef(Date.now());
  
  // ═══════════════════════════════════════════════════════════════════
  // 🔌 WEBSOCKET CONNECTION - Production-grade with reconnection
  // ═══════════════════════════════════════════════════════════════════
  
  const initializeSocket = useCallback(() => {
    const serverUrl = process.env.NODE_ENV === 'production' 
      ? 'https://your-app.onrender.com'
      : 'http://localhost:3001';
    
    socketRef.current = io(serverUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      timeout: 20000,
      forceNew: true
    });
    
    const socket = socketRef.current;
    
    // Connection events
    socket.on('connect', () => {
      console.log('🔌 Connected to Bonnie AI server');
      setIsConnected(true);
      setConnectionQuality('good');
      setError(null);
      
      // Authenticate immediately
      authenticateSocket();
      
      // Start ping monitoring
      startPingMonitoring();
    });
    
    socket.on('disconnect', (reason) => {
      console.log('❌ Disconnected from server:', reason);
      setIsConnected(false);
      setConnectionQuality('poor');
      setError('Connection lost. Reconnecting...');
    });
    
    socket.on('connect_error', (error) => {
      console.error('🚫 Connection error:', error);
      setConnectionQuality('poor');
      setError('Unable to connect to Bonnie AI. Please check your internet connection.');
    });
    
    socket.on('reconnect', (attemptNumber) => {
      console.log(`🔄 Reconnected after ${attemptNumber} attempts`);
      setConnectionQuality('good');
      setError(null);
      authenticateSocket();
    });
    
    socket.on('reconnect_failed', () => {
      setError('Failed to reconnect. Please refresh the page.');
      setConnectionQuality('offline');
    });
    
    // Authentication events
    socket.on('authenticated', (data) => {
      console.log('✅ Authenticated successfully');
      setIsAuthenticated(true);
      setUser(data.user);
      setBondScore(data.user.bondScore || 1.0);
      
      if (!isInitialized) {
        requestInitialGreeting();
        setIsInitialized(true);
      }
    });
    
    socket.on('auth_error', (data) => {
      console.error('🚫 Authentication failed:', data.message);
      setError('Authentication failed. Please refresh the page.');
      setIsAuthenticated(false);
    });
    
    // Chat events
    socket.on('bonnie_typing', (data) => {
      setIsTyping(data.typing);
    });
    
    socket.on('bonnie_response', (data) => {
      const responseTime = Date.now() - lastMessageTimeRef.current;
      setResponseTime(responseTime);
      
      addMessage({
        text: data.message,
        sender: 'bonnie',
        timestamp: new Date(),
        emotion: data.meta?.emotion || 'neutral',
        bondScore: data.meta?.bondScore || bondScore,
        processingTime: data.meta?.processingTime || 0
      });
      
      // Update UI state
      setCurrentEmotion(data.meta?.emotion || 'neutral');
      setBondScore(data.meta?.bondScore || bondScore);
      setIsTyping(false);
      setIsBusy(false);
      
      // Update insights
      if (data.meta) {
        updateConversationInsights(data.meta);
      }
    });
    
    // Error handling
    socket.on('error', (data) => {
      console.error('❌ Socket error:', data);
      setError(data.message || 'An unexpected error occurred');
      setIsBusy(false);
      setIsTyping(false);
    });
    
    socket.on('rate_limit_exceeded', (data) => {
      setError(`Too many messages! Please wait ${data.retryAfter} seconds.`);
      setIsBusy(false);
    });
    
    return socket;
  }, [isInitialized, bondScore]);
  
  // Authentication with socket
  const authenticateSocket = useCallback(() => {
    if (!socketRef.current) return;
    
    const authData = {
      token: token,
      sessionId: sessionId || generateSessionId()
    };
    
    console.log('🔐 Authenticating with server...');
    socketRef.current.emit('authenticate', authData);
  }, [token, sessionId]);
  
  // Generate session ID
  const generateSessionId = () => {
    const sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    setSessionId(sessionId);
    localStorage.setItem('bonnie_session_id', sessionId);
    return sessionId;
  };
  
  // Ping monitoring for connection quality
  const startPingMonitoring = () => {
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
    }
    
    pingIntervalRef.current = setInterval(() => {
      const start = Date.now();
      
      if (socketRef.current?.connected) {
        socketRef.current.emit('ping', start);
        
        socketRef.current.once('pong', (startTime) => {
          const latency = Date.now() - startTime;
          
          if (latency < 100) {
            setConnectionQuality('excellent');
          } else if (latency < 300) {
            setConnectionQuality('good');
          } else if (latency < 1000) {
            setConnectionQuality('fair');
          } else {
            setConnectionQuality('poor');
          }
        });
      }
    }, 10000); // Every 10 seconds
  };
  
  // ═══════════════════════════════════════════════════════════════════
  // 💬 MESSAGE HANDLING - Enhanced with real-time features
  // ═══════════════════════════════════════════════════════════════════
  
  const addMessage = useCallback((message) => {
    setMessages(prev => [...prev, {
      id: Date.now() + Math.random(),
      ...message
    }]);
    
    // Auto-scroll to bottom
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);
  
  const sendMessage = useCallback(async () => {
    const messageText = input.trim();
    if (!messageText || isBusy || !isAuthenticated || !socketRef.current?.connected) {
      return;
    }
    
    // Add user message immediately
    addMessage({
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    });
    
    // Clear input and set busy state
    setInput('');
    setIsBusy(true);
    setError(null);
    lastMessageTimeRef.current = Date.now();
    
    // Send via WebSocket
    socketRef.current.emit('chat_message', {
      message: messageText,
      timestamp: new Date().toISOString()
    });
    
  }, [input, isBusy, isAuthenticated, addMessage]);
  
  const requestInitialGreeting = useCallback(() => {
    if (!socketRef.current?.connected || !isAuthenticated) return;
    
    console.log('👋 Requesting initial greeting...');
    socketRef.current.emit('request_greeting');
  }, [isAuthenticated]);
  
  // ═══════════════════════════════════════════════════════════════════
  // 🎯 UTILITY FUNCTIONS
  // ═══════════════════════════════════════════════════════════════════
  
  const updateConversationInsights = (meta) => {
    setConversationInsights(prev => ({
      ...prev,
      totalMessages: (prev.totalMessages || 0) + 1,
      avgResponseTime: ((prev.avgResponseTime || 0) + (meta.processingTime || 0)) / 2,
      emotionDistribution: {
        ...prev.emotionDistribution,
        [meta.emotion]: (prev.emotionDistribution?.[meta.emotion] || 0) + 1
      }
    }));
  };
  
  const getEmotionColor = (emotion) => {
    const colors = {
      flirty: '#ff6b9d',
      excited: '#ffd93d',
      playful: '#6bcf7f',
      supportive: '#4dabf7',
      intimate: '#9775fa',
      sad: '#74c0fc',
      neutral: '#868e96'
    };
    return colors[emotion] || colors.neutral;
  };
  
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  const addNotification = (message, type = 'info') => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: Date.now()
    };
    
    setNotifications(prev => [...prev, notification]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };
  
  // ═══════════════════════════════════════════════════════════════════
  // 🎮 EVENT HANDLERS
  // ═══════════════════════════════════════════════════════════════════
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  const handleInputChange = (e) => {
    setInput(e.target.value);
    
    // Clear any existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Show typing indicator to Bonnie (optional feature)
    typingTimeoutRef.current = setTimeout(() => {
      // Could emit typing stopped event
    }, 1000);
  };
  
  const retryConnection = () => {
    setError(null);
    socketRef.current?.disconnect();
    setTimeout(() => {
      initializeSocket();
    }, 1000);
  };
  
  // ═══════════════════════════════════════════════════════════════════
  // 🎭 LIFECYCLE EFFECTS
  // ═══════════════════════════════════════════════════════════════════
  
  // Initialize component
  useEffect(() => {
    console.log('🚀 Initializing Bonnie AI Chat Production v24.0');
    
    // Load saved session
    const savedSessionId = localStorage.getItem('bonnie_session_id');
    const savedToken = localStorage.getItem('bonnie_auth_token');
    
    if (savedSessionId) {
      setSessionId(savedSessionId);
    }
    
    if (savedToken) {
      setToken(savedToken);
    }
    
    // Initialize socket connection
    initializeSocket();
    
    // Cleanup function
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [initializeSocket]);
  
  // Focus input when ready
  useEffect(() => {
    if (isAuthenticated && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAuthenticated]);
  
  // ═══════════════════════════════════════════════════════════════════
  // 🎨 RENDER COMPONENT
  // ═══════════════════════════════════════════════════════════════════
  
  return (
    <div className="bonnie-chat-container">
      {/* Status Bar */}
      <div className="status-bar">
        <div className="connection-status">
          <div className={`status-indicator ${connectionQuality}`}>
            <div className={`dot ${isConnected ? 'connected' : 'disconnected'}`}></div>
            <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
          
          {responseTime > 0 && (
            <div className="response-time">
              Response: {responseTime}ms
            </div>
          )}
        </div>
        
        <div className="user-info">
          {user && (
            <>
              <div className="bond-score">
                💕 Bond: {bondScore.toFixed(1)}/10
              </div>
              <div className="user-tier">
                {user.tier === 'premium' ? '⭐ Premium' : 
                 user.tier === 'vip' ? '👑 VIP' : '🆓 Free'}
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="notifications">
          {notifications.map(notification => (
            <div key={notification.id} className={`notification ${notification.type}`}>
              {notification.message}
            </div>
          ))}
        </div>
      )}
      
      {/* Error Display */}
      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={retryConnection} className="retry-btn">
            Retry Connection
          </button>
        </div>
      )}
      
      {/* Chat Header */}
      <div className="chat-header">
        <div className="bonnie-avatar">
          <div className="avatar-image" style={{ 
            borderColor: getEmotionColor(currentEmotion) 
          }}>
            💕
          </div>
          <div className="emotion-indicator">
            <span style={{ color: getEmotionColor(currentEmotion) }}>
              {currentEmotion}
            </span>
          </div>
        </div>
        
        <div className="header-info">
          <h2>Bonnie AI</h2>
          <p>Your AI girlfriend • Always here for you</p>
          
          {showEmotions && (
            <div className="emotion-details">
              Current mood: <strong>{currentEmotion}</strong>
              {conversationInsights.totalMessages && (
                <span> • {conversationInsights.totalMessages} messages</span>
              )}
            </div>
          )}
        </div>
        
        <div className="header-controls">
          <button 
            onClick={() => setShowEmotions(!showEmotions)}
            className="toggle-emotions"
            title="Toggle emotion details"
          >
            🎭
          </button>
        </div>
      </div>
      
      {/* Messages Container */}
      <div className="messages-container">
        {!isAuthenticated && (
          <div className="loading-message">
            <div className="loading-spinner"></div>
            <p>Connecting to Bonnie AI...</p>
          </div>
        )}
        
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`message ${message.sender} ${message.emotion || ''}`}
          >
            <div className="message-content">
              <p>{message.text}</p>
              <div className="message-meta">
                <span className="timestamp">
                  {formatTimestamp(message.timestamp)}
                </span>
                {message.emotion && message.sender === 'bonnie' && (
                  <span 
                    className="emotion-tag"
                    style={{ color: getEmotionColor(message.emotion) }}
                  >
                    {message.emotion}
                  </span>
                )}
                {message.processingTime && (
                  <span className="processing-time">
                    {message.processingTime}ms
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="message bonnie typing">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <p>Bonnie is typing...</p>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Area */}
      <div className="input-container">
        <div className="input-wrapper">
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={
              !isAuthenticated ? "Connecting..." :
              isBusy ? "Processing..." :
              "Type your message to Bonnie..."
            }
            disabled={!isAuthenticated || isBusy}
            rows="1"
            className="message-input"
          />
          
          <button 
            onClick={sendMessage}
            disabled={!input.trim() || !isAuthenticated || isBusy}
            className="send-button"
          >
            {isBusy ? (
              <div className="button-spinner"></div>
            ) : (
              <span>💌</span>
            )}
          </button>
        </div>
        
        <div className="input-footer">
          <div className="character-count">
            {input.length}/500
          </div>
          
          <div className="quick-actions">
            <button 
              onClick={() => setInput("How are you feeling today?")}
              disabled={isBusy}
              className="quick-action"
            >
              💭 Feelings
            </button>
            <button 
              onClick={() => setInput("Tell me something sweet 💕")}
              disabled={isBusy}
              className="quick-action"
            >
              💕 Sweet
            </button>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="chat-footer">
        <div className="footer-info">
          <span>🚀 Bonnie AI v24.0 • Real-time WebSocket Connection</span>
          {conversationInsights.avgResponseTime && (
            <span>Avg Response: {Math.round(conversationInsights.avgResponseTime)}ms</span>
          )}
        </div>
      </div>
      
      {/* Styles */}
      <style jsx>{`
        .bonnie-chat-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          max-width: 800px;
          margin: 0 auto;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #333;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .status-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 16px;
          background: rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          font-size: 12px;
          color: white;
        }
        
        .connection-status {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .status-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
        
        .dot.connected {
          background: #51cf66;
        }
        
        .dot.disconnected {
          background: #ff6b6b;
        }
        
        .notifications {
          position: fixed;
          top: 60px;
          right: 20px;
          z-index: 1000;
        }
        
        .notification {
          background: white;
          border-radius: 8px;
          padding: 12px 16px;
          margin-bottom: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          border-left: 4px solid #4dabf7;
          animation: slideIn 0.3s ease-out;
        }
        
        .error-banner {
          background: #ff6b6b;
          color: white;
          padding: 12px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .retry-btn {
          background: white;
          color: #ff6b6b;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }
        
        .chat-header {
          display: flex;
          align-items: center;
          padding: 16px 20px;
          background: white;
          border-bottom: 1px solid #e9ecef;
        }
        
        .bonnie-avatar {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-right: 16px;
        }
        
        .avatar-image {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          border: 3px solid;
          transition: border-color 0.3s ease;
        }
        
        .emotion-indicator {
          font-size: 10px;
          margin-top: 4px;
          font-weight: 600;
          text-transform: capitalize;
        }
        
        .header-info h2 {
          margin: 0 0 4px 0;
          font-size: 20px;
          color: #333;
        }
        
        .header-info p {
          margin: 0;
          color: #666;
          font-size: 14px;
        }
        
        .header-controls {
          margin-left: auto;
        }
        
        .toggle-emotions {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: background-color 0.2s;
        }
        
        .toggle-emotions:hover {
          background: #f8f9fa;
        }
        
        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          background: rgba(255, 255, 255, 0.95);
        }
        
        .loading-message {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 200px;
          color: #666;
        }
        
        .loading-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #e9ecef;
          border-top: 3px solid #4dabf7;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }
        
        .message {
          margin-bottom: 16px;
          display: flex;
          animation: fadeIn 0.3s ease-out;
        }
        
        .message.user {
          justify-content: flex-end;
        }
        
        .message.user .message-content {
          background: linear-gradient(135deg, #4dabf7 0%, #339af0 100%);
          color: white;
          border-radius: 18px 18px 4px 18px;
        }
        
        .message.bonnie .message-content {
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 18px 18px 18px 4px;
          color: #333;
        }
        
        .message-content {
          max-width: 80%;
          padding: 12px 16px;
          position: relative;
        }
        
        .message-content p {
          margin: 0;
          line-height: 1.4;
        }
        
        .message-meta {
          display: flex;
          gap: 8px;
          margin-top: 6px;
          font-size: 10px;
          opacity: 0.7;
        }
        
        .emotion-tag {
          font-weight: 600;
          text-transform: capitalize;
        }
        
        .typing-indicator {
          display: flex;
          gap: 3px;
          margin-bottom: 8px;
        }
        
        .typing-indicator span {
          width: 6px;
          height: 6px;
          background: #4dabf7;
          border-radius: 50%;
          animation: typing 1.4s ease-in-out infinite both;
        }
        
        .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
        .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
        
        .input-container {
          background: white;
          border-top: 1px solid #e9ecef;
          padding: 16px 20px;
        }
        
        .input-wrapper {
          display: flex;
          gap: 12px;
          align-items: flex-end;
        }
        
        .message-input {
          flex: 1;
          border: 1px solid #ced4da;
          border-radius: 20px;
          padding: 12px 16px;
          font-size: 14px;
          resize: none;
          outline: none;
          max-height: 100px;
          transition: border-color 0.2s;
        }
        
        .message-input:focus {
          border-color: #4dabf7;
        }
        
        .send-button {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: none;
          background: linear-gradient(135deg, #4dabf7 0%, #339af0 100%);
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s;
        }
        
        .send-button:hover:not(:disabled) {
          transform: scale(1.05);
        }
        
        .send-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .button-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        .input-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 8px;
          font-size: 12px;
          color: #666;
        }
        
        .quick-actions {
          display: flex;
          gap: 8px;
        }
        
        .quick-action {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 12px;
          padding: 4px 8px;
          font-size: 11px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .quick-action:hover:not(:disabled) {
          background: #e9ecef;
        }
        
        .chat-footer {
          padding: 8px 20px;
          background: rgba(0, 0, 0, 0.05);
          text-align: center;
          font-size: 11px;
          color: #666;
        }
        
        .footer-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes typing {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
          .bonnie-chat-container {
            height: 100vh;
          }
          
          .status-bar {
            padding: 8px 12px;
          }
          
          .chat-header {
            padding: 12px 16px;
          }
          
          .messages-container {
            padding: 16px 12px;
          }
          
          .input-container {
            padding: 12px 16px;
          }
          
          .message-content {
            max-width: 90%;
          }
          
          .quick-actions {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default BonnieChatProduction;