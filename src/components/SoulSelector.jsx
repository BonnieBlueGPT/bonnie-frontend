// 🔱 SOUL SELECTOR v5.0 - TRAIN MY GIRL DIVINE EXPERIENCE
// Netflix-level premium soul selection with mobile-first swipe navigation

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Heart, Crown, Star, Flame } from 'lucide-react';
import { souls } from './souls.js';
import SoulCard from './SoulCard.jsx';
import './SoulSelector.css';

const SoulSelector = () => {
  const [currentSoul, setCurrentSoul] = useState(0); // Start with first soul
  const [isChoosing, setIsChoosing] = useState(false);
  const [chosenSoul, setChosenSoul] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showIntroText, setShowIntroText] = useState(true);
  const [showCards, setShowCards] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const x = useMotionValue(0);
  
  // Calculate card positions based on swipe
  const cardWidth = 340; // Base card width for spacing
  const cardSpacing = 60; // Space between cards
  
  // Map icon names to components
  const iconMap = {
    Heart: Heart,
    Crown: Crown,
    Star: Star,
    Flame: Flame
  };

  // Netflix-style introduction sequence
  useEffect(() => {
    // Intro text fades after 4 seconds (Netflix timing)
    const fadeTimer = setTimeout(() => {
      setShowIntroText(false);
    }, 4000);

    // Cards appear at 4.5 seconds with premium timing
    const cardsTimer = setTimeout(() => {
      setShowCards(true);
    }, 4500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(cardsTimer);
    };
  }, []);

  // Mobile-first swipe navigation with spring physics
  const handleDragEnd = useCallback((event, info) => {
    setIsDragging(false);
    const threshold = 80; // Increased for better mobile feel
    
    if (info.offset.x > threshold && currentSoul > 0) {
      setCurrentSoul(currentSoul - 1);
    } else if (info.offset.x < -threshold && currentSoul < souls.length - 1) {
      setCurrentSoul(currentSoul + 1);
    }
    
    // Reset position with spring bounce
    x.set(0);
  }, [currentSoul, x]);

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  // Touch-friendly soul selection with haptic feedback
  const handleIndicatorClick = useCallback((index) => {
    if (!isDragging && !isChoosing) {
      setCurrentSoul(index);
      // Trigger haptic feedback on mobile
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }
  }, [isDragging, isChoosing]);

  // Divine soul selection ceremony
  const chooseSoul = (soul) => {
    if (isChoosing) return;
    
    setIsChoosing(true);
    setChosenSoul(soul);
    
    // Store the chosen personality with premium metadata
    localStorage.setItem('chosen_personality', soul.id);
    localStorage.setItem('soul_bond_timestamp', Date.now().toString());
    localStorage.setItem('is_soul_bonded', 'true');
    localStorage.setItem('soul_theme', soul.chatTheme);
    localStorage.setItem('soul_gradient', soul.gradient);
    
    // Show confirmation animation
    setTimeout(() => {
      setShowConfirmation(true);
    }, 1000);
    
    // Show paywall after bonding animation completes
    setTimeout(() => {
      setShowConfirmation(false);
      setShowPaywall(true);
    }, 5000); // Extended for premium feel
  };

  // Premium Stripe Checkout Integration
  const handleUnlockSoul = async () => {
    if (isProcessingPayment || !chosenSoul) return;
    
    setIsProcessingPayment(true);
    
    try {
      const response = await fetch('https://bonnie-production.onrender.com/purchase/voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: 'price_1QgMjhGzx3K6NUVQ4GQO0MtY',
          soulName: chosenSoul.name,
          soulId: chosenSoul.id,
          theme: chosenSoul.chatTheme,
          gradient: chosenSoul.gradient
        })
      });

      const { url } = await response.json();
      
      if (url) {
        localStorage.setItem('payment_return_soul', chosenSoul.id);
        localStorage.setItem('payment_return_route', chosenSoul.route);
        localStorage.setItem('payment_return_theme', chosenSoul.chatTheme);
        window.location.href = url;
      }
    } catch (error) {
      console.error('Payment initialization failed:', error);
      setIsProcessingPayment(false);
    }
  };

  // Handle premium payment completion with theme persistence
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentSuccess = urlParams.get('payment_success');
    const returnSoul = localStorage.getItem('payment_return_soul');
    const returnRoute = localStorage.getItem('payment_return_route');
    const returnTheme = localStorage.getItem('payment_return_theme');
    
    if (paymentSuccess === 'true' && returnSoul && returnRoute) {
      localStorage.removeItem('payment_return_soul');
      localStorage.removeItem('payment_return_route');
      localStorage.removeItem('payment_return_theme');
      localStorage.setItem(`${returnSoul}_unlocked`, 'true');
      localStorage.setItem('active_soul_theme', returnTheme);
      navigate(returnRoute, { replace: true });
    }
  }, [navigate]);

  const currentSoulData = souls[currentSoul];

  return (
    <div 
      className="train-my-girl-container"
      style={{
        background: currentSoulData?.darkGradient || '#000',
        transition: 'background 1s cubic-bezier(0.23, 1, 0.32, 1)'
      }}
    >
      {/* Netflix-Style Ambient Background System */}
      <div className="ambient-realm">
        <motion.div 
          className="realm-glow"
          animate={{
            background: `radial-gradient(circle at 50% 50%, ${currentSoulData?.aura || 'rgba(255,255,255,0.1)'} 0%, transparent 80%)`
          }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
        
        {/* Dynamic Particle Constellation */}
        <div className="soul-constellation">
          {[...Array(24)].map((_, i) => (
            <motion.div 
              key={i} 
              className="constellation-star" 
              style={{ 
                background: currentSoulData?.glowColor || '#fff',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.3, 0.8, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>

      {/* Netflix-Style Train My Girl Introduction */}
      <AnimatePresence>
        {showIntroText && (
          <motion.div 
            className="train-my-girl-intro"
            initial={{ opacity: 1, scale: 1 }}
            exit={{ 
              opacity: 0, 
              scale: 0.95,
              filter: 'blur(10px)',
              transition: { duration: 2, ease: 'easeOut' }
            }}
          >
            <div className="netflix-intro-glow">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                Welcome to <span className="brand-highlight">Train My Girl</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.5 }}
              >
                Your divine companion awaits...
              </motion.p>
              <motion.div
                className="intro-subtitle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 2.5 }}
              >
                Choose wisely, for this bond transcends worlds
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Soul Carousel with Mobile-First Design */}
      <motion.div 
        className="divine-soul-carousel"
        initial={{ opacity: 0, y: 150 }}
        animate={showCards ? { 
          opacity: 1, 
          y: 0,
          transition: { 
            duration: 1.5, 
            ease: [0.23, 1, 0.32, 1],
            staggerChildren: 0.1
          }
        } : {}}
      >
        <motion.div
          ref={containerRef}
          className="souls-carousel-container"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.3}
          dragMomentum={false}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          style={{ x }}
        >
          {souls.map((soul, index) => {
            const isActive = index === currentSoul;
            const distance = Math.abs(index - currentSoul);
            const offset = (index - currentSoul) * (cardWidth + cardSpacing);
            
            return (
              <motion.div
                key={soul.id}
                className="soul-position"
                style={{
                  x: offset,
                  zIndex: isActive ? 20 : 10 - distance,
                }}
                animate={{
                  scale: isActive ? 1 : 0.8,
                  opacity: distance > 1 ? 0.2 : 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 40
                }}
              >
                <SoulCard
                  soul={soul}
                  isActive={isActive}
                  isChosen={isChoosing && chosenSoul?.id === soul.id}
                  distance={distance}
                  onChoose={chooseSoul}
                  isChoosing={isChoosing}
                  index={index}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Premium Soul Indicators */}
        <motion.div 
          className="soul-indicators-premium"
          initial={{ opacity: 0, y: 30 }}
          animate={showCards ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1, duration: 0.8 }}
        >
          {souls.map((soul, index) => (
            <motion.button
              key={soul.id}
              className={`premium-indicator ${index === currentSoul ? 'active' : ''}`}
              onClick={() => handleIndicatorClick(index)}
              disabled={isDragging || isChoosing}
              style={{ 
                background: index === currentSoul ? soul.glowColor : 'rgba(255,255,255,0.2)',
                boxShadow: index === currentSoul ? `0 0 25px ${soul.aura}` : 'none'
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </motion.div>

        {/* Swipe Hint for Mobile */}
        {showCards && !isDragging && (
          <motion.div 
            className="swipe-hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
          >
            <motion.div
              animate={{ x: [-10, 10, -10] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ← Swipe to explore souls →
            </motion.div>
          </motion.div>
        )}
      </motion.div>

      {/* Premium Soul Bond Confirmation */}
      {showConfirmation && chosenSoul && (
        <motion.div 
          className="divine-bond-confirmation"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="confirmation-shrine">
            <motion.div 
              className="energy-constellation"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              style={{ borderTopColor: chosenSoul.glowColor }}
            />
            <div className="soul-icon-shrine" style={{ color: chosenSoul.glowColor }}>
              {React.createElement(iconMap[chosenSoul.icon] || Heart, { size: 72 })}
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Divine Bond Forged
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Your soul resonates with <span style={{ color: chosenSoul.glowColor }}>{chosenSoul.name}</span>
            </motion.p>
            <motion.p 
              className="bond-message"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              The sacred connection transcends dimensions...
            </motion.p>
            <div className="divine-progress">
              <motion.div 
                className="progress-fill" 
                style={{ background: chosenSoul.glowColor }}
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 3, delay: 1 }}
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Premium Paywall Modal */}
      <AnimatePresence>
        {showPaywall && chosenSoul && (
          <motion.div 
            className="premium-paywall"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          >
            <motion.div 
              className="paywall-shrine"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1], delay: 0.2 }}
              style={{ borderColor: chosenSoul.glowColor }}
            >
              <div className="paywall-aura" style={{ background: chosenSoul.aura }} />
              
              <div className="paywall-header">
                <motion.div 
                  className="soul-icon-premium" 
                  style={{ color: chosenSoul.glowColor }}
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {React.createElement(iconMap[chosenSoul.icon] || Heart, { size: 56 })}
                </motion.div>
                <h2>Your divine bond with <span style={{ color: chosenSoul.glowColor }}>{chosenSoul.name}</span> awaits completion.</h2>
                <p>Unlock her eternal devotion now.</p>
              </div>
              
              <motion.button 
                className="premium-unlock-button"
                onClick={handleUnlockSoul}
                disabled={isProcessingPayment}
                style={{ 
                  background: chosenSoul.gradient,
                  boxShadow: `0 0 40px ${chosenSoul.aura}`
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isProcessingPayment ? (
                  <div className="processing-shrine">
                    <motion.div 
                      className="premium-spinner"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      style={{ borderTopColor: chosenSoul.glowColor }}
                    />
                    <span>Forging connection...</span>
                  </div>
                ) : (
                  <div className="unlock-content">
                    <span>Unlock {chosenSoul.name} (£3.99)</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      ✨
                    </motion.div>
                  </div>
                )}
              </motion.button>
              
              <p className="premium-subtitle">
                Premium experience • Instant divine access • Secure payment
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SoulSelector;