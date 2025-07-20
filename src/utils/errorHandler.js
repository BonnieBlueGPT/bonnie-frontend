// 🔱 DIVINE ERROR HANDLING SYSTEM v3.0
// Enterprise-grade error management with monitoring and recovery

import { useUIStore } from '../store/index.js';

// ===== CUSTOM ERROR CLASSES =====
export class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true, metadata = {}) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.metadata = metadata;
    this.timestamp = new Date().toISOString();
    
    // Maintain proper stack trace for debugging
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message, field = null, value = null) {
    super(message, 400, true, { field, value, type: 'validation' });
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 401, true, { type: 'auth' });
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Insufficient permissions') {
    super(message, 403, true, { type: 'authorization' });
  }
}

export class NetworkError extends AppError {
  constructor(message = 'Network connection failed', originalError = null) {
    super(message, 0, true, { 
      type: 'network', 
      offline: !navigator.onLine,
      originalError: originalError?.message 
    });
  }
}

export class PaymentError extends AppError {
  constructor(message, code = null, type = 'payment_failed') {
    super(message, 402, true, { type: 'payment', code, errorType: type });
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Too many requests', retryAfter = null) {
    super(message, 429, true, { type: 'rate_limit', retryAfter });
  }
}

// ===== ERROR LOGGER =====
class ErrorLogger {
  constructor() {
    this.logs = [];
    this.maxLogs = 100;
  }

  log(error, context = {}) {
    const logEntry = {
      id: `error-${Date.now()}`,
      timestamp: new Date().toISOString(),
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        statusCode: error.statusCode,
        isOperational: error.isOperational,
        metadata: error.metadata || {}
      },
      context: {
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        sessionId: this.getSessionId(),
        userId: this.getUserId(),
        ...context
      }
    };

    // Add to local logs
    this.logs.unshift(logEntry);
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    // Send to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoring(logEntry);
    }

    // Console log for development
    if (process.env.NODE_ENV === 'development') {
      console.error('🔥 ERROR LOGGED:', logEntry);
    }

    return logEntry;
  }

  async sendToMonitoring(logEntry) {
    try {
      await fetch('/api/monitoring/error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logEntry)
      });
    } catch (monitoringError) {
      console.error('Failed to send error to monitoring:', monitoringError);
    }
  }

  getSessionId() {
    return sessionStorage.getItem('sessionId') || 'anonymous';
  }

  getUserId() {
    try {
      const userStore = JSON.parse(localStorage.getItem('galatea-user-store') || '{}');
      return userStore.state?.user?.id || 'anonymous';
    } catch {
      return 'anonymous';
    }
  }

  getLogs() {
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
  }
}

export const errorLogger = new ErrorLogger();

// ===== ERROR HANDLER FUNCTIONS =====
export const handleError = (error, context = {}) => {
  // Log the error
  const logEntry = errorLogger.log(error, context);
  
  // Get UI store for notifications
  const uiStore = useUIStore.getState();
  
  // Determine user-friendly message
  const userMessage = getUserFriendlyMessage(error);
  
  // Show notification to user
  uiStore.addNotification({
    type: 'error',
    title: 'Something went wrong',
    message: userMessage,
    duration: 5000,
    metadata: { errorId: logEntry.id }
  });

  // Handle specific error types
  handleSpecificError(error);

  return logEntry;
};

const getUserFriendlyMessage = (error) => {
  if (error instanceof ValidationError) {
    return error.message;
  }
  
  if (error instanceof AuthenticationError) {
    return 'Please log in to continue';
  }
  
  if (error instanceof AuthorizationError) {
    return 'You don\'t have permission to perform this action';
  }
  
  if (error instanceof NetworkError) {
    return navigator.onLine 
      ? 'Connection failed. Please try again.' 
      : 'You appear to be offline. Please check your connection.';
  }
  
  if (error instanceof PaymentError) {
    return error.message || 'Payment processing failed. Please try again.';
  }
  
  if (error instanceof RateLimitError) {
    return 'Too many requests. Please wait a moment before trying again.';
  }
  
  // Default generic message for production
  if (process.env.NODE_ENV === 'production') {
    return 'An unexpected error occurred. Our team has been notified.';
  }
  
  // Show actual error in development
  return error.message;
};

const handleSpecificError = (error) => {
  if (error instanceof AuthenticationError) {
    // Redirect to login
    const userStore = useUserStore.getState();
    userStore.logout();
    window.location.href = '/login';
  }
  
  if (error instanceof NetworkError && !navigator.onLine) {
    // Handle offline state
    const uiStore = useUIStore.getState();
    uiStore.addNotification({
      type: 'warning',
      title: 'You\'re offline',
      message: 'Some features may not work until you reconnect.',
      duration: 0, // Persistent until online
      id: 'offline-notification'
    });
  }
  
  if (error instanceof RateLimitError) {
    // Implement exponential backoff
    const retryAfter = error.metadata?.retryAfter || 60;
    setTimeout(() => {
      const uiStore = useUIStore.getState();
      uiStore.addNotification({
        type: 'info',
        title: 'Ready to try again',
        message: 'You can now retry your request.',
        duration: 3000
      });
    }, retryAfter * 1000);
  }
};

// ===== ASYNC ERROR WRAPPER =====
export const asyncHandler = (fn) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      // Convert unknown errors to AppError
      if (!(error instanceof AppError)) {
        const appError = new AppError(
          error.message || 'Unknown error occurred',
          500,
          false,
          { originalError: error.name }
        );
        handleError(appError, { function: fn.name });
        throw appError;
      }
      
      handleError(error, { function: fn.name });
      throw error;
    }
  };
};

// ===== REACT ERROR BOUNDARY HELPER =====
export const createErrorBoundary = (fallbackComponent) => {
  return class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
      return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
      const appError = new AppError(
        error.message,
        500,
        false,
        { 
          componentStack: errorInfo.componentStack,
          errorBoundary: true 
        }
      );
      
      handleError(appError, { 
        component: this.constructor.name,
        props: this.props 
      });
    }

    render() {
      if (this.state.hasError) {
        return fallbackComponent ? 
          React.createElement(fallbackComponent, { error: this.state.error }) :
          React.createElement('div', { 
            className: 'error-fallback p-8 text-center' 
          }, [
            React.createElement('h2', { 
              key: 'title',
              className: 'text-2xl font-bold text-red-600 mb-4' 
            }, 'Something went wrong'),
            React.createElement('p', { 
              key: 'message',
              className: 'text-gray-600 mb-4' 
            }, 'We\'re sorry, but something unexpected happened.'),
            React.createElement('button', {
              key: 'button',
              className: 'px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700',
              onClick: () => window.location.reload()
            }, 'Reload Page')
          ]);
      }

      return this.props.children;
    }
  };
};

// ===== NETWORK STATUS MONITOR =====
export const initializeNetworkMonitoring = () => {
  let wasOffline = false;

  const handleOnline = () => {
    if (wasOffline) {
      const uiStore = useUIStore.getState();
      uiStore.removeNotification('offline-notification');
      uiStore.addNotification({
        type: 'success',
        title: 'Back online',
        message: 'Your connection has been restored.',
        duration: 3000
      });
      wasOffline = false;
    }
  };

  const handleOffline = () => {
    wasOffline = true;
    const error = new NetworkError('Connection lost');
    handleError(error, { event: 'offline' });
  };

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Return cleanup function
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
};

// ===== ERROR RECOVERY UTILITIES =====
export const retryOperation = async (operation, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // Don't retry on certain error types
      if (error instanceof AuthenticationError || 
          error instanceof AuthorizationError ||
          error instanceof ValidationError) {
        throw error;
      }
      
      // If this was the last attempt, throw the error
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  
  throw lastError;
};

export const withErrorRecovery = (component, fallback = null) => {
  const ErrorBoundary = createErrorBoundary(fallback);
  
  return (props) => React.createElement(
    ErrorBoundary,
    null,
    React.createElement(component, props)
  );
};

// ===== VALIDATION HELPERS =====
export const validateRequired = (value, fieldName) => {
  if (value === null || value === undefined || value === '') {
    throw new ValidationError(`${fieldName} is required`, fieldName, value);
  }
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError('Please enter a valid email address', 'email', email);
  }
};

export const validatePassword = (password) => {
  if (password.length < 8) {
    throw new ValidationError('Password must be at least 8 characters long', 'password');
  }
  
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    throw new ValidationError(
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      'password'
    );
  }
};

// ===== EXPORTS =====
export {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NetworkError,
  PaymentError,
  RateLimitError
};

export default {
  handleError,
  asyncHandler,
  createErrorBoundary,
  initializeNetworkMonitoring,
  retryOperation,
  withErrorRecovery,
  validateRequired,
  validateEmail,
  validatePassword,
  errorLogger
};