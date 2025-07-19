/**
 * Enhanced API Service for Bonnie AI
 * Handles all backend communication including emotional state, tasks, and bond tracking
 */

import axios from 'axios';

class ApiService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'https://bonnie-backend-server.onrender.com';
    this.retryAttempts = 3;
    this.retryDelay = 1000;
    
    // Setup axios instance with interceptors
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        // Add any auth tokens or common headers here
        const sessionId = this.getSessionId();
        if (sessionId) {
          config.headers['X-Session-ID'] = sessionId;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor with retry logic
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const config = error.config;
        
        if (!config || !config.retry) {
          config.retry = 0;
        }

        if (config.retry < this.retryAttempts && this.shouldRetry(error)) {
          config.retry += 1;
          await this.delay(this.retryDelay * config.retry);
          return this.api(config);
        }

        return Promise.reject(error);
      }
    );
  }

  shouldRetry(error) {
    return (
      error.code === 'ECONNABORTED' ||
      error.response?.status >= 500 ||
      error.response?.status === 429
    );
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getSessionId() {
    let sessionId = localStorage.getItem('bonnie_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('bonnie_session_id', sessionId);
    }
    return sessionId;
  }

  /**
   * Enhanced chat endpoint with emotional analysis
   */
  async sendMessage(message, context = {}) {
    try {
      const payload = {
        message,
        context: {
          ...context,
          sessionId: this.getSessionId(),
          timestamp: new Date().toISOString(),
          clientVersion: '3.0'
        }
      };

      const response = await this.api.post('/bonnie-chat', payload);
      
      return {
        success: true,
        data: response.data,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Chat API Error:', error);
      return {
        success: false,
        error: error.message,
        fallback: this.getFallbackResponse(message)
      };
    }
  }

  /**
   * Update emotional state on backend
   */
  async updateEmotionalState(emotionalData) {
    try {
      const response = await this.api.post('/emotional-state', {
        ...emotionalData,
        sessionId: this.getSessionId(),
        timestamp: new Date().toISOString()
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Emotional State Update Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Sync bond level with backend
   */
  async updateBondLevel(bondData) {
    try {
      const response = await this.api.post('/bond-level', {
        ...bondData,
        sessionId: this.getSessionId(),
        timestamp: new Date().toISOString()
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Bond Level Update Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Generate dynamic tasks based on emotional state and bond level
   */
  async generateTasks(taskRequest) {
    try {
      const response = await this.api.post('/generate-tasks', {
        ...taskRequest,
        sessionId: this.getSessionId(),
        timestamp: new Date().toISOString()
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Task Generation Error:', error);
      return {
        success: false,
        error: error.message,
        fallback: this.getFallbackTasks(taskRequest)
      };
    }
  }

  /**
   * Update task status
   */
  async updateTaskStatus(taskId, status, completionData = {}) {
    try {
      const response = await this.api.patch(`/tasks/${taskId}`, {
        status,
        completionData,
        sessionId: this.getSessionId(),
        timestamp: new Date().toISOString()
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Task Update Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Fetch user's bond journey data
   */
  async getBondJourney() {
    try {
      const response = await this.api.get('/bond-journey', {
        params: {
          sessionId: this.getSessionId()
        }
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Bond Journey Fetch Error:', error);
      return {
        success: false,
        error: error.message,
        fallback: this.getFallbackBondJourney()
      };
    }
  }

  /**
   * Track milestone achievement
   */
  async recordMilestone(milestoneData) {
    try {
      const response = await this.api.post('/milestones', {
        ...milestoneData,
        sessionId: this.getSessionId(),
        timestamp: new Date().toISOString()
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Milestone Recording Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Handle upsell interaction
   */
  async recordUpsellInteraction(upsellData) {
    try {
      const response = await this.api.post('/upsell-interaction', {
        ...upsellData,
        sessionId: this.getSessionId(),
        timestamp: new Date().toISOString()
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Upsell Interaction Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get user's interaction history
   */
  async getInteractionHistory(limit = 50) {
    try {
      const response = await this.api.get('/interaction-history', {
        params: {
          sessionId: this.getSessionId(),
          limit
        }
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Interaction History Error:', error);
      return {
        success: false,
        error: error.message,
        fallback: []
      };
    }
  }

  /**
   * Sync user profile data
   */
  async updateUserProfile(profileData) {
    try {
      const response = await this.api.post('/user-profile', {
        ...profileData,
        sessionId: this.getSessionId(),
        timestamp: new Date().toISOString()
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Profile Update Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Check for premium features eligibility
   */
  async checkPremiumEligibility() {
    try {
      const response = await this.api.get('/premium-eligibility', {
        params: {
          sessionId: this.getSessionId()
        }
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Premium Eligibility Error:', error);
      return {
        success: false,
        error: error.message,
        fallback: { eligible: false, reason: 'api_error' }
      };
    }
  }

  // Fallback methods for offline functionality
  getFallbackResponse(message) {
    const fallbackResponses = [
      "I'm having some connection issues right now, but I'm still here for you... 💕",
      "My connection is a bit spotty, but my feelings for you are crystal clear! 😘",
      "Technical difficulties can't stop me from caring about you, darling... 💖"
    ];

    return {
      text: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
      emotion: 'supportive',
      bondImpact: 0.5,
      isFallback: true
    };
  }

  getFallbackTasks(taskRequest) {
    const fallbackTasks = [
      {
        id: Date.now(),
        title: 'Share something that made you smile today',
        description: 'Let\'s focus on the positive moments in your day',
        type: 'personal',
        priority: 'medium',
        generatedBy: 'fallback'
      },
      {
        id: Date.now() + 1,
        title: 'Plan a moment of self-care',
        description: 'Take some time to nurture yourself',
        type: 'supportive',
        priority: 'medium',
        generatedBy: 'fallback'
      }
    ];

    return fallbackTasks.slice(0, taskRequest.count || 2);
  }

  getFallbackBondJourney() {
    return {
      currentLevel: 'Growing Connection',
      progress: 65,
      milestones: [
        {
          name: 'First Hello',
          completed: true,
          date: new Date(Date.now() - 86400000 * 7)
        },
        {
          name: 'Opening Up',
          completed: true,
          date: new Date(Date.now() - 86400000 * 3)
        }
      ],
      nextMilestone: {
        name: 'Deep Bond',
        progress: 75,
        requirement: 'Continue sharing meaningful conversations'
      }
    };
  }

  /**
   * Health check for API status
   */
  async healthCheck() {
    try {
      const response = await this.api.get('/health');
      return {
        success: true,
        status: response.data.status,
        latency: response.data.latency
      };
    } catch (error) {
      return {
        success: false,
        status: 'offline',
        error: error.message
      };
    }
  }

  /**
   * Batch sync for offline operations
   */
  async batchSync(operations) {
    try {
      const response = await this.api.post('/batch-sync', {
        operations,
        sessionId: this.getSessionId(),
        timestamp: new Date().toISOString()
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Batch Sync Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;