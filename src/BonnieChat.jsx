import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import useApiCall from './useApiCall';

// Enhanced Constants with Emotional Intelligence
const CONSTANTS = {
  API_ENDPOINTS: {
    CHAT: 'https://bonnie-backend-server.onrender.com/bonnie-chat',
    ENTRY: 'https://bonnie-backend-server.onrender.com/bonnie-entry'
  },
  TYPING_SPEEDS: { slow: 120, normal: 64, fast: 35 },
  IDLE_TIMEOUT: 30000,
  MAX_MESSAGES: 100,
  COLORS: {
    primary: '#e91e63',
    primaryLight: '#f8bbd9',
    secondary: '#ff6ec7',
    gradient: 'linear-gradient(135deg, #e91e63 0%, #ff6ec7 100%)',
    online: '#28a745',
    offline: '#aaa',
    background: '#fff0f6',
    surface: '#ffffff',
    border: '#ffe6f0',
    text: '#2d2d2d',
    textLight: '#666',
    shadow: 'rgba(233, 30, 99, 0.15)'
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

// Seductive CSS-in-JS Styles
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100vw',
    background: `linear-gradient(135deg, #fff0f6 0%, #fce4ec 50%, #fff0f6 100%)`,
    fontFamily: `'Segoe UI', sans-serif`,
    overflow: 'hidden',
    position: 'relative'
  },
  
  header: {
    background: CONSTANTS.COLORS.gradient,
    padding: '1rem',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    boxShadow: `0 4px 20px ${CONSTANTS.COLORS.shadow}`,
    position: 'relative',
    zIndex: 10,
    borderBottom: '2px solid #d81b60'
  },
  
  profileImage: {
    width: 'clamp(48px, 12vw, 56px)',
    height: 'clamp(48px, 12vw, 56px)',
    borderRadius: '50%',
    marginRight: '0.75rem',
    border: '2px solid white',
    flexShrink: 0
  },
  
  profileInfo: {
    flex: 1,
    minWidth: 0
  },
  
  profileName: {
    fontSize: 'clamp(1.1rem, 4vw, 1.25rem)',
    fontWeight: '600',
    margin: 0,
    textShadow: '0 2px 4px rgba(0,0,0,0.2)'
  },
  
  profileTagline: {
    fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
    margin: '0.25rem 0',
    opacity: 0.9
  },
  
  profileLink: {
    fontSize: 'clamp(0.7rem, 2.5vw, 0.75rem)',
    color: '#fff0f6',
    textDecoration: 'none',
    opacity: 0.8,
    transition: 'opacity 0.3s ease'
  },
  
  statusIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    fontWeight: '500',
    fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
    flexShrink: 0
  },
  
  chatContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    position: 'relative'
  },
  
  messagesArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    scrollBehavior: 'smooth',
    WebkitOverflowScrolling: 'touch'
  },
  
  message: {
    maxWidth: '85%',
    padding: '0.75rem 1rem',
    borderRadius: '1.5rem',
    position: 'relative',
    wordBreak: 'break-word',
    animation: 'slideIn 0.3s ease-out',
    fontSize: 'clamp(0.9rem, 3.5vw, 1rem)',
    lineHeight: '1.4'
  },
  
  userMessage: {
    alignSelf: 'flex-end',
    background: CONSTANTS.COLORS.gradient,
    color: 'white',
    borderBottomRightRadius: '0.5rem',
    boxShadow: `0 2px 8px ${CONSTANTS.COLORS.shadow}`,
    marginLeft: 'auto'
  },
  
  bonnieMessage: {
    alignSelf: 'flex-start',
    background: CONSTANTS.COLORS.surface,
    color: CONSTANTS.COLORS.text,
    borderBottomLeftRadius: '0.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    border: `1px solid ${CONSTANTS.COLORS.border}`
  },
  
  typingIndicator: {
    display: 'flex',
    alignItems: 'center',
    alignSelf: 'flex-start',
    background: CONSTANTS.COLORS.surface,
    padding: '0.75rem 1rem',
    borderRadius: '1.5rem',
    borderBottomLeftRadius: '0.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    border: `1px solid ${CONSTANTS.COLORS.border}`,
    animation: 'slideIn 0.3s ease-out',
    gap: '0.5rem'
  },
  
  typingDots: {
    display: 'flex',
    gap: '0.25rem',
    alignItems: 'center'
  },
  
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: CONSTANTS.COLORS.primary,
    animation: 'bounce 1.4s infinite'
  },
  
  inputContainer: {
    padding: '1rem',
    background: CONSTANTS.COLORS.surface,
    borderTop: `1px solid ${CONSTANTS.COLORS.border}`,
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
    boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
  },
  
  input: {
    flex: 1,
    padding: '0.75rem 1rem',
    border: `2px solid ${CONSTANTS.COLORS.border}`,
    borderRadius: '1.5rem',
    fontSize: 'clamp(1rem, 4vw, 1.1rem)',
    outline: 'none',
    transition: 'all 0.3s ease',
    background: 'white',
    color: CONSTANTS.COLORS.text
  },
  
  sendButton: {
    background: CONSTANTS.COLORS.gradient,
    border: 'none',
    borderRadius: '50%',
    width: '48px',
    height: '48px',
    color: 'white',
    fontSize: '1.2rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: `0 2px 8px ${CONSTANTS.COLORS.shadow}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};

// Add more logic to `BonnieChat.jsx` as needed...

export default function BonnieChat() {
  // Component logic remains unchanged...
}
