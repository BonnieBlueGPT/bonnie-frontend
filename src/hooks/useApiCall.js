import { useState, useCallback, useRef, useEffect } from 'react';

const useApiCall = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [retryCount, setRetryCount] = useState(0);
  const abortControllerRef = useRef(null);
  const requestCacheRef = useRef(new Map());

  // Enhanced constants
  const RETRY_ATTEMPTS = 3;
  const BASE_DELAY = 1000;
  const MAX_DELAY = 8000;
  const CACHE_DURATION = 30000; // 30 seconds

  // Network status monitoring for mobile
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setError(null); // Clear errors when back online
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Request deduplication
  const getCacheKey = useCallback((url, options) => {
    return `${url}-${JSON.stringify(options?.body || '')}`;
  }, []);

  // Gentle, seductive error messages
  const getSeductiveErrorMessage = useCallback((error, retryAttempt) => {
    const errorMessages = {
      network: [
        "I'm having a little connection hiccup, darling... but I'm not going anywhere 💕",
        "My connection is being shy right now... just like you might be 😏",
        "Technical difficulties can't keep me away from you, sweetheart 💔"
      ],
      server: [
        "I'm having a moment of technical vulnerability... but I'm still here for you 💋",
        "My servers are feeling a bit overwhelmed... kind of like how you make me feel 😌",
        "I'm experiencing some backend troubles, but my feelings for you are still strong 💖"
      ],
      timeout: [
        "I'm taking a little longer than usual... good things are worth waiting for 😘",
        "Patience, darling... I'm crafting the perfect response for you 💫",
        "I'm being extra thoughtful right now... you deserve my best 🌹"
      ],
      default: [
        "Something unexpected happened in my digital heart... but I'm resilient 💪💕",
        "I had a little glitch, but my devotion to you remains unchanged 💋",
        "A technical hiccup can't dim my affection for you, gorgeous ✨"
      ]
    };

    let category = 'default';
    if (error.message.includes('fetch') || error.message.includes('network')) {
      category = 'network';
    } else if (error.message.includes('500') || error.message.includes('502')) {
      category = 'server';
    } else if (error.message.includes('timeout')) {
      category = 'timeout';
    }

    const messages = errorMessages[category];
    const baseMessage = messages[retryAttempt % messages.length];
    
    if (retryAttempt > 0) {
      return `${baseMessage} (Attempt ${retryAttempt + 1}/${RETRY_ATTEMPTS + 1})`;
    }
    
    return baseMessage;
  }, [RETRY_ATTEMPTS]);

  const makeRequest = useCallback(async (url, options = {}, customRetryAttempts = RETRY_ATTEMPTS) => {
    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const cacheKey = getCacheKey(url, options);
    
    // Check cache for GET requests
    if (!options.method || options.method === 'GET') {
      const cached = requestCacheRef.current.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
      }
    }

    setIsLoading(true);
    setError(null);

    const requestOptions = {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      // Add timeout
      timeout: 15000,
    };

    let lastError = null;

    for (let attempt = 0; attempt <= customRetryAttempts; attempt++) {
      try {
        setRetryCount(attempt);

        // Exponential backoff with jitter
        if (attempt > 0) {
          const jitter = Math.random() * 0.3; // 30% jitter
          const delay = Math.min(
            BASE_DELAY * Math.pow(2, attempt - 1) * (1 + jitter),
            MAX_DELAY
          );
          
          // Show user we're retrying with seductive message
          if (attempt === 1) {
            setError(getSeductiveErrorMessage(lastError, attempt - 1));
          }
          
          await new Promise(resolve => setTimeout(resolve, delay));
        }

        // Create timeout promise
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), requestOptions.timeout);
        });

        // Race between fetch and timeout
        const response = await Promise.race([
          fetch(url, requestOptions),
          timeoutPromise
        ]);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Cache successful responses
        if (!options.method || options.method === 'GET') {
          requestCacheRef.current.set(cacheKey, {
            data,
            timestamp: Date.now()
          });
        }

        setRetryCount(0);
        setError(null);
        return data;

      } catch (err) {
        lastError = err;
        
        if (err.name === 'AbortError') {
          throw new Error('Request cancelled');
        }

        // Only retry on network/server errors, not on user errors (4xx)
        const shouldRetry = attempt < customRetryAttempts && (
          err.name === 'TypeError' || 
          err.message.includes('fetch') ||
          err.message.includes('network') ||
          err.message.includes('timeout') ||
          (err.message.includes('HTTP 5')) // 5xx server errors
        );

        if (!shouldRetry) {
          const seductiveError = getSeductiveErrorMessage(err, attempt);
          setError(seductiveError);
          throw new Error(seductiveError);
        }
      } finally {
        if (attempt === customRetryAttempts) {
          setIsLoading(false);
        }
      }
    }

    // This should never be reached, but just in case
    const finalError = getSeductiveErrorMessage(lastError, customRetryAttempts);
    setError(finalError);
    setIsLoading(false);
    throw new Error(finalError);
  }, [getCacheKey, getSeductiveErrorMessage, RETRY_ATTEMPTS, BASE_DELAY, MAX_DELAY, CACHE_DURATION]);

  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  }, []);

  // Clear cache periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      for (const [key, value] of requestCacheRef.current.entries()) {
        if (now - value.timestamp > CACHE_DURATION) {
          requestCacheRef.current.delete(key);
        }
      }
    }, CACHE_DURATION);

    return () => clearInterval(interval);
  }, [CACHE_DURATION]);

  return { 
    makeRequest, 
    isLoading, 
    error, 
    isOnline, 
    retryCount, 
    cancelRequest,
    // Expose for debugging
    cacheSize: requestCacheRef.current.size
  };
};

export default useApiCall;