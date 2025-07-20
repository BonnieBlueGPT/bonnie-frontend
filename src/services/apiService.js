// 🔱 DIVINE API SERVICE LAYER v3.0
// Enterprise-grade HTTP client with caching, retries, and interceptors

import {
  AppError,
  NetworkError,
  AuthenticationError,
  AuthorizationError,
  ValidationError,
  RateLimitError,
  PaymentError,
  retryOperation
} from '../utils/errorHandler.js';

// ===== API CLIENT CONFIGURATION =====
class ApiClient {
  constructor(baseURL = '/api', options = {}) {
    this.baseURL = baseURL;
    this.timeout = options.timeout || 30000;
    this.retries = options.retries || 3;
    this.cache = new Map();
    this.cacheTimeout = options.cacheTimeout || 5 * 60 * 1000; // 5 minutes
    this.requestInterceptors = [];
    this.responseInterceptors = [];
    this.errorInterceptors = [];
    
    // Default headers
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers
    };

    // Request tracking for cancellation
    this.activeRequests = new Map();
  }

  // ===== INTERCEPTOR MANAGEMENT =====
  addRequestInterceptor(interceptor) {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor) {
    this.responseInterceptors.push(interceptor);
  }

  addErrorInterceptor(interceptor) {
    this.errorInterceptors.push(interceptor);
  }

  // ===== AUTHENTICATION INTERCEPTOR =====
  setupAuthInterceptor() {
    this.addRequestInterceptor(async (config) => {
      const token = this.getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.addResponseInterceptor(async (response) => {
      // Handle token refresh
      if (response.status === 401) {
        const refreshed = await this.refreshToken();
        if (refreshed) {
          // Retry original request with new token
          return this.request(response.config);
        }
      }
      return response;
    });
  }

  getAuthToken() {
    try {
      const userStore = JSON.parse(localStorage.getItem('galatea-user-store') || '{}');
      return userStore.state?.user?.token;
    } catch {
      return null;
    }
  }

  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return false;

      const response = await this.post('/auth/refresh', { refreshToken });
      const { token, user } = response.data;
      
      // Update stored data
      const userStore = JSON.parse(localStorage.getItem('galatea-user-store') || '{}');
      userStore.state.user = { ...userStore.state.user, token };
      localStorage.setItem('galatea-user-store', JSON.stringify(userStore));
      
      return true;
    } catch {
      return false;
    }
  }

  // ===== CACHE MANAGEMENT =====
  getCacheKey(url, options) {
    const params = options.params ? JSON.stringify(options.params) : '';
    return `${options.method || 'GET'}:${url}:${params}`;
  }

  getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clearCache(pattern = null) {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }

  // ===== REQUEST CANCELLATION =====
  createAbortController(requestId) {
    const controller = new AbortController();
    this.activeRequests.set(requestId, controller);
    return controller;
  }

  cancelRequest(requestId) {
    const controller = this.activeRequests.get(requestId);
    if (controller) {
      controller.abort();
      this.activeRequests.delete(requestId);
    }
  }

  cancelAllRequests() {
    for (const controller of this.activeRequests.values()) {
      controller.abort();
    }
    this.activeRequests.clear();
  }

  // ===== CORE REQUEST METHOD =====
  async request(url, options = {}) {
    const requestId = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const controller = this.createAbortController(requestId);
    
    try {
      // Build complete URL
      const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;
      
      // Apply request interceptors
      let config = {
        method: 'GET',
        headers: { ...this.defaultHeaders },
        signal: controller.signal,
        timeout: this.timeout,
        ...options,
        url: fullUrl
      };

      for (const interceptor of this.requestInterceptors) {
        config = await interceptor(config);
      }

      // Check cache for GET requests
      if (config.method === 'GET' && options.cache !== false) {
        const cacheKey = this.getCacheKey(fullUrl, config);
        const cached = this.getFromCache(cacheKey);
        if (cached) {
          return cached;
        }
      }

      // Build fetch options
      const fetchOptions = {
        method: config.method,
        headers: config.headers,
        signal: config.signal
      };

      // Add body for non-GET requests
      if (config.method !== 'GET' && config.data) {
        if (config.data instanceof FormData) {
          fetchOptions.body = config.data;
          delete fetchOptions.headers['Content-Type']; // Let browser set it
        } else {
          fetchOptions.body = JSON.stringify(config.data);
        }
      }

      // Add query parameters for GET requests
      if (config.method === 'GET' && config.params) {
        const searchParams = new URLSearchParams(config.params);
        const separator = fullUrl.includes('?') ? '&' : '?';
        config.url = `${fullUrl}${separator}${searchParams}`;
      }

      // Make the request with timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), config.timeout);
      });

      const response = await Promise.race([
        fetch(config.url, fetchOptions),
        timeoutPromise
      ]);

      // Remove from active requests
      this.activeRequests.delete(requestId);

      // Handle response
      const result = await this.handleResponse(response, config);

      // Apply response interceptors
      for (const interceptor of this.responseInterceptors) {
        await interceptor(result);
      }

      // Cache successful GET responses
      if (config.method === 'GET' && options.cache !== false && result.ok) {
        const cacheKey = this.getCacheKey(fullUrl, config);
        this.setCache(cacheKey, result);
      }

      return result;

    } catch (error) {
      this.activeRequests.delete(requestId);
      
      // Apply error interceptors
      for (const interceptor of this.errorInterceptors) {
        await interceptor(error);
      }

      throw this.handleError(error);
    }
  }

  // ===== RESPONSE HANDLER =====
  async handleResponse(response, config) {
    const result = {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      config,
      ok: response.ok
    };

    // Handle different content types
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      result.data = await response.json();
    } else if (contentType?.includes('text/')) {
      result.data = await response.text();
    } else {
      result.data = await response.blob();
    }

    // Handle HTTP errors
    if (!response.ok) {
      throw this.createHttpError(result);
    }

    return result;
  }

  // ===== ERROR HANDLER =====
  createHttpError(response) {
    const { status, data } = response;
    const message = data?.message || data?.error || response.statusText;

    switch (status) {
      case 400:
        return new ValidationError(message, data?.field, data?.value);
      case 401:
        return new AuthenticationError(message);
      case 403:
        return new AuthorizationError(message);
      case 402:
        return new PaymentError(message, data?.code, data?.type);
      case 429:
        return new RateLimitError(message, data?.retryAfter);
      case 404:
        return new AppError(`Resource not found: ${message}`, 404);
      case 422:
        return new ValidationError(message, data?.field, data?.value);
      case 500:
      case 502:
      case 503:
      case 504:
        return new AppError(`Server error: ${message}`, status, true, { 
          serverError: true,
          retryable: true 
        });
      default:
        return new AppError(message || 'Request failed', status);
    }
  }

  handleError(error) {
    if (error.name === 'AbortError') {
      return new AppError('Request was cancelled', 0, true, { cancelled: true });
    }
    
    if (error.message === 'Request timeout') {
      return new NetworkError('Request timed out');
    }
    
    if (error.message?.includes('fetch')) {
      return new NetworkError('Network request failed', error);
    }

    return error;
  }

  // ===== HTTP METHODS =====
  async get(url, params = {}, options = {}) {
    return this.request(url, {
      method: 'GET',
      params,
      ...options
    });
  }

  async post(url, data = {}, options = {}) {
    return this.request(url, {
      method: 'POST',
      data,
      ...options
    });
  }

  async put(url, data = {}, options = {}) {
    return this.request(url, {
      method: 'PUT',
      data,
      ...options
    });
  }

  async patch(url, data = {}, options = {}) {
    return this.request(url, {
      method: 'PATCH',
      data,
      ...options
    });
  }

  async delete(url, options = {}) {
    return this.request(url, {
      method: 'DELETE',
      ...options
    });
  }

  // ===== UPLOAD METHODS =====
  async upload(url, file, options = {}) {
    const formData = new FormData();
    formData.append('file', file);
    
    if (options.fields) {
      Object.entries(options.fields).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    return this.request(url, {
      method: 'POST',
      data: formData,
      headers: {
        // Remove Content-Type to let browser set it with boundary
        ...this.defaultHeaders,
        'Content-Type': undefined
      },
      ...options
    });
  }

  // ===== RETRY WRAPPER =====
  async withRetry(operation, maxRetries = this.retries) {
    return retryOperation(operation, maxRetries);
  }
}

// ===== API SERVICE INSTANCES =====
export const apiClient = new ApiClient();

// Setup authentication interceptor
apiClient.setupAuthInterceptor();

// ===== SPECIALIZED API SERVICES =====

// Chat API Service
export const chatAPI = {
  async sendMessage(soulId, message, conversationId) {
    return apiClient.post('/chat/message', {
      soulId,
      message,
      conversationId
    });
  },

  async getConversation(soulId, limit = 50, offset = 0) {
    return apiClient.get(`/chat/conversation/${soulId}`, {
      limit,
      offset
    });
  },

  async deleteConversation(soulId) {
    return apiClient.delete(`/chat/conversation/${soulId}`);
  },

  async getTypingStatus(soulId) {
    return apiClient.get(`/chat/typing/${soulId}`);
  }
};

// User API Service
export const userAPI = {
  async login(credentials) {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  async register(userData) {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  async logout() {
    return apiClient.post('/auth/logout');
  },

  async getProfile() {
    const response = await apiClient.get('/user/profile');
    return response.data;
  },

  async updateProfile(profileData) {
    const response = await apiClient.put('/user/profile', profileData);
    return response.data;
  },

  async changePassword(passwordData) {
    return apiClient.put('/user/password', passwordData);
  },

  async deleteAccount() {
    return apiClient.delete('/user/account');
  }
};

// Payment API Service
export const paymentAPI = {
  async createPaymentIntent(amount, currency = 'usd') {
    const response = await apiClient.post('/payments/create-intent', {
      amount,
      currency
    });
    return response.data;
  },

  async confirmPayment(paymentIntentId, paymentMethodId) {
    const response = await apiClient.post('/payments/confirm', {
      paymentIntentId,
      paymentMethodId
    });
    return response.data;
  },

  async getPaymentHistory(limit = 20, offset = 0) {
    const response = await apiClient.get('/payments/history', {
      limit,
      offset
    });
    return response.data;
  },

  async createSubscription(priceId) {
    const response = await apiClient.post('/payments/subscription', {
      priceId
    });
    return response.data;
  },

  async cancelSubscription(subscriptionId) {
    return apiClient.delete(`/payments/subscription/${subscriptionId}`);
  }
};

// Analytics API Service
export const analyticsAPI = {
  async trackEvent(eventName, properties) {
    return apiClient.post('/analytics/track', {
      event: eventName,
      properties
    }, { 
      cache: false,
      retries: 1 // Lower retries for analytics
    });
  },

  async getAnalytics(timeRange = '7d') {
    const response = await apiClient.get('/analytics/dashboard', {
      timeRange
    });
    return response.data;
  }
};

// Soul API Service
export const soulAPI = {
  async getSouls() {
    const response = await apiClient.get('/souls', {}, {
      cache: true // Cache souls data
    });
    return response.data;
  },

  async getSoul(soulId) {
    const response = await apiClient.get(`/souls/${soulId}`);
    return response.data;
  },

  async updateSoulPreferences(soulId, preferences) {
    const response = await apiClient.put(`/souls/${soulId}/preferences`, preferences);
    return response.data;
  }
};

// ===== UTILITY FUNCTIONS =====
export const createApiService = (baseURL, options = {}) => {
  return new ApiClient(baseURL, options);
};

export const cancelAllRequests = () => {
  apiClient.cancelAllRequests();
};

export const clearApiCache = (pattern) => {
  apiClient.clearCache(pattern);
};

// ===== ERROR HANDLING HELPERS =====
export const handleApiError = async (apiCall, fallback = null) => {
  try {
    return await apiCall();
  } catch (error) {
    console.error('API Error:', error);
    
    if (fallback) {
      return fallback;
    }
    
    throw error;
  }
};

export const withApiRetry = async (apiCall, maxRetries = 3) => {
  return apiClient.withRetry(apiCall, maxRetries);
};

// ===== EXPORTS =====
export default {
  apiClient,
  chatAPI,
  userAPI,
  paymentAPI,
  analyticsAPI,
  soulAPI,
  createApiService,
  cancelAllRequests,
  clearApiCache,
  handleApiError,
  withApiRetry
};