// 🔱 DIVINE PRICING PAGE v3.0
// High-converting pricing with psychological optimization

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Star, Crown, Zap, Users, Lock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useUserStore, useAnalyticsStore, useUIStore } from '@/store';
import { PRICING_TIERS, PRICING_PSYCHOLOGY } from '@/config/monetization';
import { paymentAPI } from '@/services/apiService';
import { clsx } from 'clsx';

// ===== INTERFACES =====
interface PricingCardProps {
  tier: typeof PRICING_TIERS[keyof typeof PRICING_TIERS];
  isAnnual: boolean;
  onSelect: (tierId: string) => void;
  isPopular?: boolean;
  isLoading: boolean;
}

interface SocialProofData {
  userCount: number;
  avgRating: number;
  testimonials: Array<{
    name: string;
    message: string;
    tier: string;
    avatar: string;
  }>;
}

// ===== PRICING CARD COMPONENT =====
const PricingCard: React.FC<PricingCardProps> = ({
  tier,
  isAnnual,
  onSelect,
  isPopular = false,
  isLoading
}) => {
  const displayPrice = isAnnual && tier.discount ? 
    tier.discount.priceAnnual : 
    tier.price;
  
  const savings = isAnnual && tier.discount ? 
    Math.round(((tier.price * 12) - tier.discount.priceAnnual) / (tier.price * 12) * 100) : 
    0;

  const cardVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: isPopular ? 1.05 : 1,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    hover: { 
      y: -8, 
      scale: isPopular ? 1.08 : 1.03,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      className={clsx(
        'relative p-8 rounded-2xl border-2 bg-gradient-to-br shadow-xl',
        {
          'border-purple-500 from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20': isPopular,
          'border-gray-200 from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 dark:border-gray-700': !isPopular
        }
      )}
    >
      {/* Popular Badge */}
      {isPopular && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute -top-4 left-1/2 transform -translate-x-1/2"
        >
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
            <Star className="w-4 h-4" />
            MOST POPULAR
          </div>
        </motion.div>
      )}

      {/* Whale Badge */}
      {tier.badge && (
        <motion.div
          initial={{ opacity: 0, rotate: -10 }}
          animate={{ opacity: 1, rotate: 0 }}
          className="absolute -top-2 -right-2"
        >
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-lg text-xs font-bold">
            🐋 {tier.badge}
          </div>
        </motion.div>
      )}

      {/* Tier Name & Description */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {tier.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {tier.description}
        </p>
      </div>

      {/* Pricing */}
      <div className="text-center mb-8">
        {tier.price === 0 ? (
          <div className="text-4xl font-bold text-gray-900 dark:text-white">
            Free
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">
                ${displayPrice}
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                /{isAnnual ? 'year' : 'month'}
              </span>
            </div>
            
            {isAnnual && savings > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                <Sparkles className="w-4 h-4" />
                Save {savings}%
              </motion.div>
            )}
            
            {!isAnnual && tier.discount && (
              <div className="text-sm text-gray-500">
                ${tier.discount.priceAnnual}/year (save {tier.discount.annual}%)
              </div>
            )}
          </div>
        )}
      </div>

      {/* Features */}
      <div className="space-y-4 mb-8">
        {tier.features.map((feature, index) => (
          <motion.div
            key={feature}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            className="flex items-start gap-3"
          >
            <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700 dark:text-gray-300">{feature}</span>
          </motion.div>
        ))}
      </div>

      {/* CTA Button */}
      <Button
        variant={isPopular ? 'primary' : 'outline'}
        size="lg"
        className="w-full"
        loading={isLoading}
        onClick={() => onSelect(tier.id)}
      >
        {tier.cta}
      </Button>

      {/* Additional Info */}
      {tier.price > 0 && (
        <div className="text-center mt-4 text-sm text-gray-500">
          7-day free trial • Cancel anytime
        </div>
      )}
    </motion.div>
  );
};

// ===== SOCIAL PROOF COMPONENT =====
const SocialProof: React.FC<{ data: SocialProofData }> = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="text-center py-16 bg-gray-50 dark:bg-gray-900/50"
    >
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12">
          Trusted by Divine Souls Worldwide
        </h2>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">
              {data.userCount.toLocaleString()}+
            </div>
            <div className="text-gray-600 dark:text-gray-400">Active Users</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-2">
              <div className="text-4xl font-bold text-purple-600">{data.avgRating}</div>
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={clsx("w-6 h-6", {
                    "text-yellow-400 fill-current": i < Math.floor(data.avgRating),
                    "text-gray-300": i >= Math.floor(data.avgRating)
                  })}
                />
              ))}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Average Rating</div>
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">99.9%</div>
            <div className="text-gray-600 dark:text-gray-400">Uptime</div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + index * 0.1 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
            >
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-purple-600">
                    {testimonial.tier} User
                  </div>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 italic">
                "{testimonial.message}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// ===== MAIN PRICING PAGE =====
export const PricingPage: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [socialProofData, setSocialProofData] = useState<SocialProofData>({
    userCount: 47832,
    avgRating: 4.9,
    testimonials: [
      {
        name: "Sarah Chen",
        message: "The Divine tier transformed my daily conversations. The personality depth is incredible!",
        tier: "Divine Oracle",
        avatar: "/avatars/sarah.jpg"
      },
      {
        name: "Marcus Rodriguez",
        message: "Best investment I've made. The custom souls feature is mind-blowing.",
        tier: "Divine Architect", 
        avatar: "/avatars/marcus.jpg"
      },
      {
        name: "Emily Watson",
        message: "Started with free, now I can't imagine life without Premium. Amazing value!",
        tier: "Soul Guardian",
        avatar: "/avatars/emily.jpg"
      }
    ]
  });

  const { user } = useUserStore();
  const { trackEvent } = useAnalyticsStore();
  const { addNotification } = useUIStore();

  // Track pricing page view
  useEffect(() => {
    trackEvent('pricing_page_viewed', {
      userId: user?.id,
      currentTier: user?.subscription?.plan?.id || 'free'
    });
  }, []);

  // Handle tier selection
  const handleTierSelect = async (tierId: string) => {
    if (tierId === 'free') {
      // Redirect to registration
      window.location.href = '/register';
      return;
    }

    setLoadingTier(tierId);
    
    try {
      trackEvent('pricing_tier_selected', {
        tierId,
        isAnnual,
        userId: user?.id
      });

      // Create payment intent
      const tier = Object.values(PRICING_TIERS).find(t => t.id === tierId);
      if (!tier) throw new Error('Invalid tier');

      const amount = isAnnual && tier.discount ? 
        tier.discount.priceAnnual * 100 : 
        tier.price * 100;

      const paymentIntent = await paymentAPI.createPaymentIntent(amount);
      
      // Redirect to checkout
      window.location.href = `/checkout?tier=${tierId}&annual=${isAnnual}&intent=${paymentIntent.id}`;
      
    } catch (error) {
      console.error('Payment initiation failed:', error);
      addNotification({
        type: 'error',
        title: 'Payment Error',
        message: 'Failed to start payment process. Please try again.'
      });
    } finally {
      setLoadingTier(null);
    }
  };

  // Get pricing tiers in display order
  const tiersInOrder = PRICING_PSYCHOLOGY.ANCHORING.displayOrder.map(key => 
    PRICING_TIERS[key as keyof typeof PRICING_TIERS]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Header */}
      <div className="pt-20 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto px-4"
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Choose Your Divine Path
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Unlock the full potential of AI companionship with our carefully crafted tiers
          </p>

          {/* Annual/Monthly Toggle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center bg-white dark:bg-gray-800 p-1 rounded-xl shadow-lg"
          >
            <button
              onClick={() => setIsAnnual(false)}
              className={clsx(
                'px-6 py-3 rounded-lg font-medium transition-all',
                !isAnnual 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={clsx(
                'px-6 py-3 rounded-lg font-medium transition-all relative',
                isAnnual 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              )}
            >
              Annual
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Save 25%
              </span>
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tiersInOrder.map((tier, index) => (
            <PricingCard
              key={tier.id}
              tier={tier}
              isAnnual={isAnnual}
              onSelect={handleTierSelect}
              isPopular={tier.popular}
              isLoading={loadingTier === tier.id}
            />
          ))}
        </div>

        {/* Feature Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-20 bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Compare All Features
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              See exactly what's included in each tier
            </p>
          </div>
          
          {/* Feature comparison table would go here */}
          <div className="p-8 bg-gray-50 dark:bg-gray-900/50 text-center">
            <Button variant="outline" size="lg">
              View Full Feature Comparison
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Social Proof */}
      <SocialProof data={socialProofData} />

      {/* FAQ Section */}
      <div className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Can I change my plan anytime?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Yes! Upgrade or downgrade your plan at any time. Changes take effect immediately.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Is there a free trial?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  All paid plans come with a 7-day free trial. No credit card required to start.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  What payment methods do you accept?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We accept all major credit cards, PayPal, and bank transfers via Stripe.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Is my data secure?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Absolutely. We use enterprise-grade encryption and never share your personal conversations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;