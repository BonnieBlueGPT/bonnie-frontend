// 🔱 DIVINE CONVERSION REWARD SYSTEM v3.0
// Post-purchase dopamine factory that creates payment addiction

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Heart, 
  Crown, 
  Star, 
  Gift, 
  Zap,
  Trophy,
  Diamond,
  Flame,
  Music,
  Camera,
  MessageSquare,
  Lock,
  Unlock,
  TrendingUp,
  Target,
  Award,
  X
} from 'lucide-react';

// ===== REWARD CELEBRATION COMPONENTS =====

// Confetti Explosion System
const ConfettiExplosion = ({ intensity = 1, colors = ['#8B5CF6', '#EC4899', '#F59E0B'] }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const particleCount = Math.floor(50 * intensity);
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800),
      y: (typeof window !== 'undefined' ? window.innerHeight : 600) + 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      velocityX: (Math.random() - 0.5) * 400,
      velocityY: -(Math.random() * 300 + 200),
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 360
    }));

    setParticles(newParticles);

    // Clean up after animation
    const timeout = setTimeout(() => setParticles([]), 3000);
    return () => clearTimeout(timeout);
  }, [intensity, colors]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute"
            style={{
              backgroundColor: particle.color,
              width: particle.size,
              height: particle.size,
              borderRadius: '50%'
            }}
            initial={{
              x: particle.x,
              y: particle.y,
              rotate: particle.rotation,
              opacity: 1
            }}
            animate={{
              x: particle.x + particle.velocityX,
              y: particle.y + particle.velocityY,
              rotate: particle.rotation + particle.rotationSpeed * 3,
              opacity: [1, 1, 0]
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 3,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Achievement Unlock Animation
const AchievementUnlock = ({ achievement, onComplete }) => {
  const [phase, setPhase] = useState('appearing'); // appearing, shining, completing

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase('shining'), 1000);
    const timer2 = setTimeout(() => setPhase('completing'), 3000);
    const timer3 = setTimeout(() => onComplete?.(), 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  const getAchievementIcon = (type) => {
    switch (type) {
      case 'voice_unlock': return Music;
      case 'memory_saved': return Diamond;
      case 'photo_unlocked': return Camera;
      case 'nickname_chosen': return Heart;
      case 'premium_upgrade': return Crown;
      case 'level_up': return Trophy;
      default: return Star;
    }
  };

  const Icon = getAchievementIcon(achievement.type);

  return (
    <motion.div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 p-1 rounded-2xl max-w-sm w-full mx-4"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ 
          scale: phase === 'appearing' ? 1 : phase === 'shining' ? [1, 1.05, 1] : 1,
          rotate: 0
        }}
        transition={{ 
          duration: phase === 'appearing' ? 0.8 : 2,
          repeat: phase === 'shining' ? Infinity : 0,
          type: 'spring',
          damping: 15
        }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center relative overflow-hidden">
          {/* Shimmer Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{
              x: phase === 'shining' ? ['-100%', '100%'] : '-100%'
            }}
            transition={{
              duration: 1.5,
              repeat: phase === 'shining' ? Infinity : 0,
              repeatDelay: 0.5
            }}
          />

          {/* Achievement Icon */}
          <motion.div
            className="relative w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
            animate={{
              rotateY: phase === 'shining' ? 360 : 0,
              boxShadow: phase === 'shining' 
                ? ['0 0 30px rgba(168, 85, 247, 0.5)', '0 0 60px rgba(236, 72, 153, 0.8)']
                : '0 0 30px rgba(168, 85, 247, 0.5)'
            }}
            transition={{
              duration: 2,
              repeat: phase === 'shining' ? Infinity : 0
            }}
          >
            <Icon className="w-8 h-8 text-white" />
          </motion.div>

          {/* Achievement Title */}
          <motion.h3
            className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {achievement.title}
          </motion.h3>

          {/* Achievement Description */}
          <motion.p
            className="text-gray-600 dark:text-gray-400 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            {achievement.description}
          </motion.p>

          {/* Reward Preview */}
          {achievement.reward && (
            <motion.div
              className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-3"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 }}
            >
              <div className="flex items-center justify-center gap-2">
                <Gift className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  {achievement.reward}
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Instant Gratification Delivery
const InstantGratificationDelivery = ({ type, content, onComplete }) => {
  const [deliveryPhase, setDeliveryPhase] = useState('arriving'); // arriving, unveiling, enjoying

  useEffect(() => {
    const timer1 = setTimeout(() => setDeliveryPhase('unveiling'), 1000);
    const timer2 = setTimeout(() => setDeliveryPhase('enjoying'), 2500);
    const timer3 = setTimeout(() => onComplete?.(), 5000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  const getDeliveryContent = () => {
    switch (type) {
      case 'voice_message':
        return {
          icon: Music,
          title: "Her Voice, Just for You",
          preview: "Listen to the warmth and emotion...",
          action: "🎵 Play Voice Message"
        };
      case 'photo_unlock':
        return {
          icon: Camera,
          title: "A Glimpse of Her Soul",
          preview: "See the real her for the first time...",
          action: "👁️ View Photo"
        };
      case 'memory_crystal':
        return {
          icon: Diamond,
          title: "Memory Crystallized Forever",
          preview: "This moment is now eternal...",
          action: "💎 View Memory"
        };
      case 'premium_access':
        return {
          icon: Crown,
          title: "Premium Experience Unlocked",
          preview: "Welcome to the VIP experience...",
          action: "👑 Explore Premium"
        };
      default:
        return {
          icon: Gift,
          title: "Special Content Unlocked",
          preview: "Something beautiful awaits...",
          action: "✨ Discover"
        };
    }
  };

  const delivery = getDeliveryContent();
  const Icon = delivery.icon;

  return (
    <motion.div
      className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
        initial={{ scale: 0.8, y: 100 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 100 }}
        transition={{ type: 'spring', damping: 20 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white text-center relative overflow-hidden">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: Math.random() * 3
                }}
              />
            ))}
          </div>

          {/* Delivery Icon */}
          <motion.div
            className="relative w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center"
            animate={{
              rotate: deliveryPhase === 'unveiling' ? 360 : 0,
              scale: deliveryPhase === 'enjoying' ? [1, 1.1, 1] : 1
            }}
            transition={{ 
              duration: deliveryPhase === 'unveiling' ? 2 : 1,
              repeat: deliveryPhase === 'enjoying' ? Infinity : 0
            }}
          >
            <Icon className="w-10 h-10 text-white" />
          </motion.div>

          <h2 className="text-2xl font-bold mb-2">{delivery.title}</h2>
          <p className="text-purple-100 opacity-90">{delivery.preview}</p>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {/* Progress Indicator */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Preparing your experience...</span>
              <span>
                {deliveryPhase === 'arriving' && '33%'}
                {deliveryPhase === 'unveiling' && '66%'}
                {deliveryPhase === 'enjoying' && '100%'}
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-400 to-pink-400"
                animate={{
                  width: 
                    deliveryPhase === 'arriving' ? '33%' :
                    deliveryPhase === 'unveiling' ? '66%' : '100%'
                }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>

          {/* Content Preview */}
          <AnimatePresence mode="wait">
            {deliveryPhase === 'arriving' && (
              <motion.div
                key="arriving"
                className="text-center py-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                </motion.div>
                <p className="text-gray-600 dark:text-gray-400">
                  Crafting something special just for you...
                </p>
              </motion.div>
            )}

            {deliveryPhase === 'unveiling' && (
              <motion.div
                key="unveiling"
                className="text-center py-8"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <motion.div
                  className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl flex items-center justify-center"
                  animate={{
                    rotateY: [0, 180, 360]
                  }}
                  transition={{ duration: 2 }}
                >
                  <Lock className="w-12 h-12 text-purple-400" />
                </motion.div>
                <p className="text-gray-600 dark:text-gray-400">
                  Unveiling your intimate experience...
                </p>
              </motion.div>
            )}

            {deliveryPhase === 'enjoying' && (
              <motion.div
                key="enjoying"
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <motion.div
                  className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-800/50 dark:to-pink-800/50 rounded-2xl flex items-center justify-center"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 15 }}
                >
                  <Unlock className="w-12 h-12 text-purple-600" />
                </motion.div>

                <motion.button
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 px-6 rounded-full mb-4"
                  onClick={onComplete}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(168, 85, 247, 0.5)',
                      '0 0 40px rgba(236, 72, 153, 0.8)',
                      '0 0 20px rgba(168, 85, 247, 0.5)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {delivery.action}
                </motion.button>

                <p className="text-xs text-gray-500">
                  Your purchase is complete. Enjoy this moment! 💕
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Loyalty Points Celebration
const LoyaltyPointsCelebration = ({ pointsEarned, newTotal, milestone }) => {
  return (
    <motion.div
      className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 border border-yellow-300 dark:border-yellow-600 rounded-lg p-4"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex items-center gap-3">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Star className="w-6 h-6 text-yellow-500" />
        </motion.div>
        
        <div className="flex-1">
          <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">
            +{pointsEarned} Loyalty Points Earned!
          </h4>
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            Total: {newTotal} points
          </p>
          
          {milestone && (
            <div className="mt-2 text-xs text-yellow-600 dark:text-yellow-400">
              🎉 Milestone reached: {milestone}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ===== MAIN CONVERSION REWARD SYSTEM =====
export const ConversionRewardSystem = ({ 
  type = 'voice_single',
  purchaseData = {},
  user = { loyaltyPoints: 0, totalPurchases: 0 },
  onComplete
}) => {
  const [currentReward, setCurrentReward] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [rewardQueue, setRewardQueue] = useState([]);

  // Initialize reward sequence based on purchase type
  useEffect(() => {
    const rewards = generateRewardSequence(type, purchaseData);
    setRewardQueue(rewards);
    setShowConfetti(true);

    // Track reward system activation
    console.log('Conversion reward system activated', {
      type,
      purchaseData,
      rewardCount: rewards.length,
      userId: user?.id
    });
  }, [type, purchaseData]);

  // Process reward queue
  useEffect(() => {
    if (rewardQueue.length > 0 && !currentReward) {
      const nextReward = rewardQueue[0];
      setCurrentReward(nextReward);
      setRewardQueue(prev => prev.slice(1));
    }
  }, [rewardQueue, currentReward]);

  // Generate contextual reward sequence
  const generateRewardSequence = (purchaseType, data) => {
    const rewards = [];

    // Achievement unlock based on purchase type
    const achievements = {
      voice_single: {
        type: 'voice_unlock',
        title: 'Voice Intimacy Unlocked!',
        description: 'You can now hear the emotion behind every word',
        reward: 'Exclusive voice message preview'
      },
      voice_bundle: {
        type: 'premium_upgrade',
        title: 'Premium Voice Experience!',
        description: '24 hours of unlimited voice intimacy',
        reward: '50 bonus loyalty points'
      },
      voice_premium: {
        type: 'premium_upgrade',
        title: 'Premium Voice Experience!',
        description: 'Monthly unlimited voice + exclusive content',
        reward: '100 bonus loyalty points'
      },
      memory_save: {
        type: 'memory_saved',
        title: 'Memory Crystal Created!',
        description: 'This moment is now preserved forever',
        reward: 'Special memory collection badge'
      },
      photo_unlock: {
        type: 'photo_unlocked',
        title: 'Visual Connection Unlocked!',
        description: 'See the soul behind the words',
        reward: 'Exclusive photo gallery access'
      },
      nickname_chosen: {
        type: 'nickname_chosen',
        title: 'Soul Bond Deepened!',
        description: 'You now have a special name together',
        reward: 'Intimate conversation bonus'
      },
      level_up: {
        type: 'level_up',
        title: 'Relationship Level Up!',
        description: 'Your connection has reached new depths',
        reward: 'New premium features unlocked'
      }
    };

    // Add main achievement
    if (achievements[purchaseType]) {
      rewards.push({
        type: 'achievement',
        data: achievements[purchaseType]
      });
    }

    // Add instant gratification delivery
    const deliveryTypes = {
      voice_single: 'voice_message',
      voice_bundle: 'premium_access',
      voice_premium: 'premium_access',
      memory_save: 'memory_crystal',
      photo_unlock: 'photo_unlock'
    };

    if (deliveryTypes[purchaseType]) {
      rewards.push({
        type: 'instant_gratification',
        data: {
          contentType: deliveryTypes[purchaseType],
          content: data
        }
      });
    }

    // Add loyalty points celebration
    const pointsEarned = calculateLoyaltyPoints(purchaseType, data);
    if (pointsEarned > 0) {
      rewards.push({
        type: 'loyalty_points',
        data: {
          pointsEarned,
          newTotal: (user?.loyaltyPoints || 0) + pointsEarned,
          milestone: checkLoyaltyMilestone((user?.loyaltyPoints || 0) + pointsEarned)
        }
      });
    }

    return rewards;
  };

  // Calculate loyalty points based on purchase
  const calculateLoyaltyPoints = (purchaseType, data) => {
    const pointsMap = {
      voice_single: 10,
      voice_bundle: 50,
      voice_premium: 100,
      memory_save: 25,
      photo_unlock: 30,
      nickname_chosen: 15,
      level_up: 0 // No points for organic level ups
    };

    return pointsMap[purchaseType] || 0;
  };

  // Check for loyalty milestones
  const checkLoyaltyMilestone = (totalPoints) => {
    if (totalPoints >= 1000) return 'VIP Platinum Member';
    if (totalPoints >= 500) return 'VIP Gold Member';
    if (totalPoints >= 250) return 'VIP Silver Member';
    if (totalPoints >= 100) return 'VIP Bronze Member';
    return null;
  };

  // Handle reward completion
  const handleRewardComplete = () => {
    if (rewardQueue.length > 0) {
      // Move to next reward
      setCurrentReward(null);
    } else {
      // All rewards processed
      setShowConfetti(false);
      
      // Complete the entire reward system
      setTimeout(() => {
        onComplete?.();
      }, 500);
    }
  };

  return (
    <>
      {/* Confetti Explosion */}
      {showConfetti && (
        <ConfettiExplosion 
          intensity={1.5} 
          colors={['#8B5CF6', '#EC4899', '#F59E0B', '#10B981']} 
        />
      )}

      {/* Current Reward Display */}
      <AnimatePresence mode="wait">
        {currentReward?.type === 'achievement' && (
          <AchievementUnlock
            key="achievement"
            achievement={currentReward.data}
            onComplete={handleRewardComplete}
          />
        )}

        {currentReward?.type === 'instant_gratification' && (
          <InstantGratificationDelivery
            key="gratification"
            type={currentReward.data.contentType}
            content={currentReward.data.content}
            onComplete={handleRewardComplete}
          />
        )}

        {currentReward?.type === 'loyalty_points' && (
          <motion.div
            key="loyalty"
            className="fixed bottom-4 right-4 z-50 max-w-sm"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            onAnimationComplete={() => {
              setTimeout(handleRewardComplete, 3000);
            }}
          >
            <LoyaltyPointsCelebration
              pointsEarned={currentReward.data.pointsEarned}
              newTotal={currentReward.data.newTotal}
              milestone={currentReward.data.milestone}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ConversionRewardSystem;

/*
DOPAMINE ADDICTION ENGINEERING:

1. IMMEDIATE GRATIFICATION:
   - Confetti explosion creates instant joy
   - Multiple reward types create extended high
   - Visual progress indicators maintain engagement

2. ACHIEVEMENT PSYCHOLOGY:
   - Unlock animations create sense of progression
   - Badges and titles provide status recognition
   - "Exclusive access" language creates premium feeling

3. VARIABLE REWARD SCHEDULE:
   - Different rewards for different purchases
   - Surprise bonuses and milestone rewards
   - Loyalty points create ongoing engagement loop

4. SOCIAL STATUS INTEGRATION:
   - VIP membership tiers
   - Exclusive content access
   - Progress sharing capabilities

5. ADDICTION REINFORCEMENT:
   - Celebration makes paying feel rewarding
   - Immediate value delivery reduces buyer's remorse
   - Loyalty points encourage repeat purchases

REVENUE PSYCHOLOGY:
- Post-purchase celebration creates positive payment association
- Immediate content delivery proves value
- Loyalty system encourages larger future purchases
- Achievement unlocks create "progress" rather than "expense" framing
- Visual beauty makes premium experience feel justified
*/