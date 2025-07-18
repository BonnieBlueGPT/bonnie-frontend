import { useState, useCallback, useRef, useEffect } from 'react';

const useApiCall = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [retryCount, setRetryCount] = useState(0);
  const abortControllerRef = useRef(null);

  // Network status monitoring for mobile
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const makeRequest = useCallback(async (url, options = {}, retryAttempts = 3) => {
    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);

    const requestOptions = {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    for (let attempt = 0; attempt <= retryAttempts; attempt++) {
      try {
        setRetryCount(attempt);

        // Add exponential backoff for mobile networks
        if (attempt > 0) {
          const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
          await new Promise(resolve => setTimeout(resolve, delay));
        }

        const response = await fetch(url, requestOptions);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setRetryCount(0);
        return data;

      } catch (err) {
        if (err.name === 'AbortError') {
          throw new Error('Request cancelled');
        }

        // Network errors on mobile - retry with exponential backoff
        if (attempt < retryAttempts && (
          err.name === 'TypeError' || 
          err.message.includes('fetch') ||
          err.message.includes('network')
        )) {
          continue;
        }

        setError(err.message);
        throw err;
      } finally {
        if (attempt === retryAttempts) {
          setIsLoading(false);
        }
      }
    }
  }, []);

  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  }, []);

  return { 
    makeRequest, 
    isLoading, 
    error, 
    isOnline, 
    retryCount, 
    cancelRequest 
  };
};

export default useApiCall;