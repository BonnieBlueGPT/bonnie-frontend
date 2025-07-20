// 🔱 DIVINE STRIPE SERVICE v3.0
// Revenue extraction engine with seduction-driven checkout flows

import { loadStripe, Stripe } from '@stripe/stripe-js';
import { PRICING_TIERS } from '@/config/monetization';

// ===== INTERFACES =====
interface UpsellPaymentData {
  type: 'voice' | 'memory' | 'photo' | 'nickname';
  soulName: string;
  context: string;
  userId?: string;
  messageId?: string;
}

interface SubscriptionPaymentData {
  planId: 'premium' | 'divine' | 'transcendent';
  userId: string;
  isAnnual?: boolean;
}

interface PaymentResult {
  success: boolean;
  sessionId?: string;
  error?: string;
  paymentIntentId?: string;
}

interface PurchaseMetadata {
  type: 'upsell' | 'subscription';
  productType?: string;
  soulName?: string;
  userId?: string;
  tier?: string;
}

// ===== STRIPE CONFIGURATION =====
const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_...';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Upsell pricing configuration
const UPSELL_PRICES = {
  voice: 299,    // $2.99 in cents
  memory: 399,   // $3.99 in cents
  photo: 499,    // $4.99 in cents
  nickname: 199  // $1.99 in cents
} as const;

// ===== STRIPE SERVICE CLASS =====
class StripeService {
  private stripe: Stripe | null = null;
  private initialized = false;

  // Initialize Stripe
  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      this.stripe = await loadStripe(STRIPE_PUBLIC_KEY);
      if (!this.stripe) {
        throw new Error('Failed to initialize Stripe');
      }
      this.initialized = true;
    } catch (error) {
      console.error('Stripe initialization failed:', error);
      throw error;
    }
  }

  // Get Stripe instance
  async getStripe(): Promise<Stripe> {
    if (!this.initialized) {
      await this.initialize();
    }
    
    if (!this.stripe) {
      throw new Error('Stripe not initialized');
    }
    
    return this.stripe;
  }

  // Create upsell payment session
  async createUpsellPayment(data: UpsellPaymentData): Promise<PaymentResult> {
    try {
      const amount = UPSELL_PRICES[data.type];
      
      const response = await fetch(`${API_BASE_URL}/api/payments/create-upsell-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          type: data.type,
          soulName: data.soulName,
          context: data.context,
          userId: data.userId,
          messageId: data.messageId,
          successUrl: `${window.location.origin}/chat?payment_success=true&type=${data.type}`,
          cancelUrl: `${window.location.origin}/chat?payment_cancelled=true`
        })
      });

      const session = await response.json();
      
      if (!response.ok) {
        throw new Error(session.error || 'Failed to create payment session');
      }

      // Redirect to Stripe checkout
      const stripe = await this.getStripe();
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id
      });

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        sessionId: session.id
      };

    } catch (error) {
      console.error('Upsell payment failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Create subscription payment session
  async createSubscriptionPayment(data: SubscriptionPaymentData): Promise<PaymentResult> {
    try {
      const tier = PRICING_TIERS[data.planId.toUpperCase() as keyof typeof PRICING_TIERS];
      if (!tier) {
        throw new Error('Invalid subscription tier');
      }

      const amount = data.isAnnual && tier.discount 
        ? tier.discount.priceAnnual * 100 
        : tier.price * 100;

      const response = await fetch(`${API_BASE_URL}/api/payments/create-subscription-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: data.planId,
          amount,
          isAnnual: data.isAnnual,
          userId: data.userId,
          successUrl: `${window.location.origin}/dashboard?payment_success=true&plan=${data.planId}`,
          cancelUrl: `${window.location.origin}/pricing?payment_cancelled=true`
        })
      });

      const session = await response.json();
      
      if (!response.ok) {
        throw new Error(session.error || 'Failed to create subscription session');
      }

      // Redirect to Stripe checkout
      const stripe = await this.getStripe();
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id
      });

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        sessionId: session.id
      };

    } catch (error) {
      console.error('Subscription payment failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Handle payment success
  async handlePaymentSuccess(sessionId: string): Promise<PurchaseMetadata | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/payments/session/${sessionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const sessionData = await response.json();
      
      if (!response.ok) {
        throw new Error('Failed to retrieve payment session');
      }

      return sessionData.metadata as PurchaseMetadata;

    } catch (error) {
      console.error('Failed to handle payment success:', error);
      return null;
    }
  }

  // Track conversion analytics
  async trackConversion(data: {
    type: 'upsell' | 'subscription';
    amount: number;
    productType?: string;
    userId?: string;
    sessionId: string;
  }): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/api/analytics/conversion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          timestamp: new Date().toISOString(),
          source: 'stripe_checkout'
        })
      });
    } catch (error) {
      console.error('Failed to track conversion:', error);
    }
  }

  // Get purchase history
  async getPurchaseHistory(userId: string): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/payments/history/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const history = await response.json();
      
      if (!response.ok) {
        throw new Error('Failed to retrieve purchase history');
      }

      return history;

    } catch (error) {
      console.error('Failed to get purchase history:', error);
      return [];
    }
  }

  // Check if user has purchased specific upsell
  async hasPurchased(userId: string, type: string, soulName?: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/payments/check-purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          type,
          soulName
        })
      });

      const result = await response.json();
      return result.purchased || false;

    } catch (error) {
      console.error('Failed to check purchase status:', error);
      return false;
    }
  }

  // Trigger seductive upsell flow
  async triggerSeductiveUpsell(data: {
    type: 'voice' | 'memory' | 'photo' | 'nickname';
    soulName: string;
    emotionalContext: string;
    urgency: 'low' | 'medium' | 'high';
    userId?: string;
  }): Promise<PaymentResult> {
    
    // Track upsell trigger
    await this.trackConversion({
      type: 'upsell',
      amount: UPSELL_PRICES[data.type],
      productType: data.type,
      userId: data.userId,
      sessionId: 'trigger_' + Date.now()
    });

    // Create seductive payment flow
    return this.createUpsellPayment({
      type: data.type,
      soulName: data.soulName,
      context: data.emotionalContext,
      userId: data.userId
    });
  }

  // A/B test different pricing strategies
  async createTestPricingSession(data: {
    type: 'voice' | 'memory' | 'photo' | 'nickname';
    variant: 'control' | 'discount' | 'bundle' | 'urgency';
    soulName: string;
    userId?: string;
  }): Promise<PaymentResult> {
    
    let amount = UPSELL_PRICES[data.type];
    let additionalData: any = {};

    // Apply variant pricing
    switch (data.variant) {
      case 'discount':
        amount = Math.round(amount * 0.8); // 20% off
        additionalData.discount = '20% off';
        break;
      case 'bundle':
        amount = Math.round(amount * 1.5); // Bundle with additional content
        additionalData.bundle = 'includes_bonus_content';
        break;
      case 'urgency':
        additionalData.urgency = 'limited_time_24h';
        break;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/payments/create-test-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          type: data.type,
          variant: data.variant,
          soulName: data.soulName,
          userId: data.userId,
          additionalData,
          successUrl: `${window.location.origin}/chat?payment_success=true&type=${data.type}&variant=${data.variant}`,
          cancelUrl: `${window.location.origin}/chat?payment_cancelled=true&variant=${data.variant}`
        })
      });

      const session = await response.json();
      
      if (!response.ok) {
        throw new Error(session.error || 'Failed to create test session');
      }

      const stripe = await this.getStripe();
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id
      });

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        sessionId: session.id
      };

    } catch (error) {
      console.error('Test pricing session failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// ===== SINGLETON INSTANCE =====
export const stripeService = new StripeService();

// ===== CONVENIENCE FUNCTIONS =====

// Quick upsell payment
export const createUpsellPayment = (data: UpsellPaymentData) => 
  stripeService.createUpsellPayment(data);

// Quick subscription payment  
export const createSubscriptionPayment = (data: SubscriptionPaymentData) =>
  stripeService.createSubscriptionPayment(data);

// Handle successful payment
export const handlePaymentSuccess = (sessionId: string) =>
  stripeService.handlePaymentSuccess(sessionId);

// Check purchase status
export const hasPurchased = (userId: string, type: string, soulName?: string) =>
  stripeService.hasPurchased(userId, type, soulName);

// Seductive upsell trigger
export const triggerSeductiveUpsell = (data: Parameters<typeof stripeService.triggerSeductiveUpsell>[0]) =>
  stripeService.triggerSeductiveUpsell(data);

export default stripeService;