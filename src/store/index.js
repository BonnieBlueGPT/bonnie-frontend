// 🔱 DIVINE STATE MANAGEMENT - ZUSTAND STORE v3.0
// Enterprise-grade state management with type safety and persistence

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { subscribeWithSelector } from 'zustand/middleware';

// ===== USER STORE =====
export const useUserStore = create()(
  devtools(
    persist(
      subscribeWithSelector((set, get) => ({
        // User State
        user: null,
        isAuthenticated: false,
        subscription: null,
        isLoading: false,
        error: null,

        // Authentication Actions
        login: async (credentials) => {
          set({ isLoading: true, error: null });
          try {
            const response = await fetch('/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(credentials)
            });
            
            if (!response.ok) throw new Error('Login failed');
            
            const user = await response.json();
            set({ 
              user: user.data, 
              isAuthenticated: true, 
              isLoading: false 
            });
            
            return user.data;
          } catch (error) {
            set({ 
              error: error.message, 
              isLoading: false,
              isAuthenticated: false 
            });
            throw error;
          }
        },

        logout: () => {
          set({ 
            user: null, 
            isAuthenticated: false, 
            subscription: null,
            error: null 
          });
        },

        updateProfile: async (profileData) => {
          set({ isLoading: true, error: null });
          try {
            const response = await fetch('/api/user/profile', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(profileData)
            });
            
            if (!response.ok) throw new Error('Profile update failed');
            
            const updatedUser = await response.json();
            set({ 
              user: updatedUser.data, 
              isLoading: false 
            });
            
            return updatedUser.data;
          } catch (error) {
            set({ error: error.message, isLoading: false });
            throw error;
          }
        }
      })),
      {
        name: 'galatea-user-store',
        partialize: (state) => ({ 
          user: state.user, 
          isAuthenticated: state.isAuthenticated,
          subscription: state.subscription
        })
      }
    ),
    { name: 'UserStore' }
  )
);

// ===== CHAT STORE =====
export const useChatStore = create()(
  devtools(
    persist(
      subscribeWithSelector((set, get) => ({
        // Chat State
        activeSoul: null,
        conversations: {},
        isTyping: false,
        error: null,
        connectionStatus: 'disconnected',

        // Chat Actions
        setActiveSoul: (soul) => set({ activeSoul: soul }),

        sendMessage: async (soulId, message) => {
          const conversations = get().conversations;
          const conversationId = `${soulId}-${Date.now()}`;
          
          // Add user message immediately
          const userMessage = {
            id: `msg-${Date.now()}`,
            content: message,
            sender: 'user',
            timestamp: new Date().toISOString(),
            type: 'text'
          };

          set({
            conversations: {
              ...conversations,
              [soulId]: [
                ...(conversations[soulId] || []),
                userMessage
              ]
            },
            isTyping: true,
            error: null
          });

          try {
            const response = await fetch('/api/chat/message', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                soulId,
                message,
                conversationId
              })
            });

            if (!response.ok) throw new Error('Failed to send message');

            const aiResponse = await response.json();
            const aiMessage = {
              id: `msg-${Date.now()}-ai`,
              content: aiResponse.message,
              sender: 'ai',
              timestamp: new Date().toISOString(),
              type: 'text',
              metadata: aiResponse.metadata
            };

            set({
              conversations: {
                ...get().conversations,
                [soulId]: [
                  ...get().conversations[soulId],
                  aiMessage
                ]
              },
              isTyping: false
            });

            return aiMessage;
          } catch (error) {
            set({ 
              error: error.message, 
              isTyping: false 
            });
            throw error;
          }
        },

        clearConversation: (soulId) => {
          const conversations = get().conversations;
          delete conversations[soulId];
          set({ conversations: { ...conversations } });
        },

        setConnectionStatus: (status) => set({ connectionStatus: status })
      })),
      {
        name: 'galatea-chat-store',
        partialize: (state) => ({ 
          conversations: state.conversations,
          activeSoul: state.activeSoul
        })
      }
    ),
    { name: 'ChatStore' }
  )
);

// ===== PAYMENT STORE =====
export const usePaymentStore = create()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // Payment State
      isProcessing: false,
      paymentIntent: null,
      subscription: null,
      error: null,

      // Payment Actions
      createPaymentIntent: async (amount, currency = 'usd') => {
        set({ isProcessing: true, error: null });
        try {
          const response = await fetch('/api/payments/create-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount, currency })
          });

          if (!response.ok) throw new Error('Failed to create payment intent');

          const paymentIntent = await response.json();
          set({ 
            paymentIntent: paymentIntent.data, 
            isProcessing: false 
          });

          return paymentIntent.data;
        } catch (error) {
          set({ error: error.message, isProcessing: false });
          throw error;
        }
      },

      confirmPayment: async (paymentMethodId) => {
        set({ isProcessing: true, error: null });
        try {
          const response = await fetch('/api/payments/confirm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              paymentIntentId: get().paymentIntent.id,
              paymentMethodId 
            })
          });

          if (!response.ok) throw new Error('Payment confirmation failed');

          const result = await response.json();
          set({ isProcessing: false });

          return result.data;
        } catch (error) {
          set({ error: error.message, isProcessing: false });
          throw error;
        }
      },

      clearPaymentState: () => set({ 
        paymentIntent: null, 
        error: null, 
        isProcessing: false 
      })
    })),
    { name: 'PaymentStore' }
  )
);

// ===== UI STORE =====
export const useUIStore = create()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // UI State
      theme: 'dark',
      isMobile: false,
      sidebarOpen: false,
      modalStack: [],
      notifications: [],
      isLoading: false,

      // UI Actions
      setTheme: (theme) => set({ theme }),
      setIsMobile: (isMobile) => set({ isMobile }),
      toggleSidebar: () => set({ sidebarOpen: !get().sidebarOpen }),
      
      showModal: (modalId, props = {}) => {
        const modalStack = get().modalStack;
        set({ 
          modalStack: [...modalStack, { id: modalId, props }] 
        });
      },
      
      hideModal: (modalId) => {
        const modalStack = get().modalStack.filter(modal => modal.id !== modalId);
        set({ modalStack });
      },
      
      addNotification: (notification) => {
        const id = `notification-${Date.now()}`;
        const notifications = get().notifications;
        set({ 
          notifications: [...notifications, { ...notification, id }] 
        });
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
          get().removeNotification(id);
        }, 5000);
        
        return id;
      },
      
      removeNotification: (id) => {
        const notifications = get().notifications.filter(n => n.id !== id);
        set({ notifications });
      },

      setLoading: (isLoading) => set({ isLoading })
    })),
    { name: 'UIStore' }
  )
);

// ===== ANALYTICS STORE =====
export const useAnalyticsStore = create()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // Analytics State
      events: [],
      sessionId: null,
      userId: null,

      // Analytics Actions
      initializeSession: () => {
        const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        set({ sessionId });
        
        get().trackEvent('session_start', {
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight
          }
        });
      },

      trackEvent: (eventName, properties = {}) => {
        const event = {
          id: `event-${Date.now()}`,
          name: eventName,
          properties: {
            ...properties,
            sessionId: get().sessionId,
            userId: get().userId,
            timestamp: new Date().toISOString(),
            url: window.location.href
          }
        };

        set({ 
          events: [...get().events, event] 
        });

        // Send to analytics service
        fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(event)
        }).catch(console.error);
      },

      setUserId: (userId) => set({ userId })
    })),
    { name: 'AnalyticsStore' }
  )
);

// ===== STORE HELPERS =====
export const useStores = () => ({
  user: useUserStore(),
  chat: useChatStore(),
  payment: usePaymentStore(),
  ui: useUIStore(),
  analytics: useAnalyticsStore()
});

// Selectors for performance optimization
export const selectUser = (state) => state.user;
export const selectIsAuthenticated = (state) => state.isAuthenticated;
export const selectConversations = (state) => state.conversations;
export const selectActiveSoul = (state) => state.activeSoul;
export const selectTheme = (state) => state.theme;
export const selectNotifications = (state) => state.notifications;