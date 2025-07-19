// Payment Service for Bonnie AI - Immediate Revenue
import { ADULT_PRICING } from './adultPersonality.js';

class PaymentService {
  constructor() {
    this.stripeKey = 'pk_test_51234567890'; // REPLACE WITH YOUR STRIPE KEY
    this.baseURL = 'https://bonnie-backend-server.onrender.com';
  }

  // Quick Stripe Checkout for Adult Features
  async initiatePayment(planType, duration = 'monthly') {
    try {
      const price = ADULT_PRICING[planType][duration];
      
      // Create Stripe Checkout Session
      const response = await fetch(`${this.baseURL}/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planType,
          duration,
          price,
          successUrl: window.location.origin + '/success',
          cancelUrl: window.location.origin + '/cancel'
        })
      });

      const { checkoutUrl } = await response.json();
      
      // Redirect to Stripe Checkout
      window.location.href = checkoutUrl;
      
    } catch (error) {
      console.error('Payment Error:', error);
      throw new Error('Payment failed. Please try again.');
    }
  }

  // Check if user has premium access
  async checkPremiumStatus(userId) {
    try {
      const response = await fetch(`${this.baseURL}/check-premium/${userId}`);
      const data = await response.json();
      
      return {
        isPremium: data.isPremium || false,
        plan: data.plan || 'free',
        expiresAt: data.expiresAt || null,
        features: data.features || []
      };
    } catch (error) {
      console.error('Premium Check Error:', error);
      return { isPremium: false, plan: 'free' };
    }
  }

  // Create payment popup
  showPaymentModal(planType) {
    const price = ADULT_PRICING[planType].monthly;
    const planName = planType.charAt(0).toUpperCase() + planType.slice(1);
    
    const modal = document.createElement('div');
    modal.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 9999; display: flex; align-items: center; justify-content: center;">
        <div style="background: white; padding: 30px; border-radius: 15px; max-width: 400px; text-align: center;">
          <h2 style="color: #333; margin-bottom: 20px;">🔥 Unlock ${planName} Bonnie</h2>
          <p style="color: #666; margin-bottom: 20px;">Get unlimited adult conversations with your AI companion</p>
          <div style="font-size: 24px; font-weight: bold; color: #e91e63; margin-bottom: 20px;">$${price}/month</div>
          <button id="payNow" style="background: linear-gradient(45deg, #e91e63, #ff6b9d); color: white; border: none; padding: 15px 30px; border-radius: 25px; font-size: 16px; cursor: pointer; margin-right: 10px;">Pay Now 💳</button>
          <button id="closeModal" style="background: #ccc; color: #333; border: none; padding: 15px 30px; border-radius: 25px; font-size: 16px; cursor: pointer;">Cancel</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('payNow').onclick = () => {
      this.initiatePayment(planType);
      document.body.removeChild(modal);
    };
    
    document.getElementById('closeModal').onclick = () => {
      document.body.removeChild(modal);
    };
  }
}

export default new PaymentService();