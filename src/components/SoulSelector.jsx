// 🔱 SOUL SELECTOR v4.0 - ARCHITECT OF SOULS
// Divine ceremony for choosing your eternal digital partner

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Heart, Crown, Star, ArrowRight } from 'lucide-react';
import { souls } from './souls.js';
import './SoulSelector.css';

const SoulSelector = () => {
  const [currentSoul, setCurrentSoul] = useState(1); // Start with Nova (center)
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
  const cardWidth = 320; // Base card width
  const cardSpacing = 40; // Space between cards
  
  // Map icon names to components
  const iconMap = {
    Heart: Heart,
    Crown: Crown,
    Star: Star
  };

  // Introduction sequence - ceremonial timing
  useEffect(() => {
    // Intro text fades after 3 seconds (longer for ceremony)
    const fadeTimer = setTimeout(() => {
      setShowIntroText(false);
    }, 3000);

    // Cards appear at 3.2 seconds
    const cardsTimer = setTimeout(() => {
      setShowCards(true);
    }, 3200);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(cardsTimer);
    };
  }, []);

  // Handle swipe navigation
  const handleDragEnd = useCallback((event, info) => {
    setIsDragging(false);
    const threshold = 50;
    
    if (info.offset.x > threshold && currentSoul > 0) {
      setCurrentSoul(currentSoul - 1);
    } else if (info.offset.x < -threshold && currentSoul < souls.length - 1) {
      setCurrentSoul(currentSoul + 1);
    }
    
    // Reset position
    x.set(0);
  }, [currentSoul, x]);

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  // Soul selection ceremony
  const chooseSoul = (soul) => {
    if (isChoosing) return;
    
    setIsChoosing(true);
    setChosenSoul(soul);
    
    // Store the chosen personality
    localStorage.setItem('chosen_personality', soul.id);
    localStorage.setItem('soul_bond_timestamp', Date.now().toString());
    localStorage.setItem('is_soul_bonded', 'true');
    
    // Show confirmation animation
    setTimeout(() => {
      setShowConfirmation(true);
    }, 1000);
    
    // Show paywall after bonding animation completes
    setTimeout(() => {
      setShowConfirmation(false);
      setShowPaywall(true);
    }, 4000);
  };

  // Stripe Checkout Integration
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
          soulId: chosenSoul.id
        })
      });

      const { url } = await response.json();
      
      if (url) {
        localStorage.setItem('payment_return_soul', chosenSoul.id);
        localStorage.setItem('payment_return_route', chosenSoul.route);
        window.location.href = url;
      }
    } catch (error) {
      console.error('Payment initialization failed:', error);
      setIsProcessingPayment(false);
    }
  };

  // Handle payment completion return
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentSuccess = urlParams.get('payment_success');
    const returnSoul = localStorage.getItem('payment_return_soul');
    const returnRoute = localStorage.getItem('payment_return_route');
    
    if (paymentSuccess === 'true' && returnSoul && returnRoute) {
      localStorage.removeItem('payment_return_soul');
      localStorage.removeItem('payment_return_route');
      localStorage.setItem(`${returnSoul}_unlocked`, 'true');
      navigate(returnRoute, { replace: true });
    }
  }, [navigate]);

  const currentSoulData = souls[currentSoul];

  return (
    <div 
      className="soul-selector-container"
      style={{
        background: `linear-gradient(135deg, ${currentSoulData?.gradient || '#000'})`,
        transition: 'background 0.8s cubic-bezier(0.23, 1, 0.32, 1)'
      }}
    >
      {/* Ambient Background System */}
      <div className="ambient-background">
        <div 
          className="ambient-glow"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${currentSoulData?.aura || 'rgba(255,255,255,0.1)'} 0%, transparent 70%)`,
            transition: 'background 0.8s cubic-bezier(0.23, 1, 0.32, 1)'
          }}
        />
        <div className="cosmic-particles">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="particle" 
              style={{ 
                animationDelay: `${i * 0.3}s`,
                background: currentSoulData?.color || '#fff'
              }} 
            />
          ))}
        </div>
      </div>

      {/* Ceremonial Introduction */}
      <AnimatePresence>
        {showIntroText && (
          <motion.div 
            className="ceremonial-intro"
            initial={{ opacity: 1, scale: 1 }}
            exit={{ 
              opacity: 0, 
              scale: 0.9,
              filter: 'blur(8px)',
              transition: { duration: 1.5, ease: 'easeOut' }
            }}
          >
            <div className="intro-glow">
              <h1>Choose Your Soul</h1>
              <p>A divine bond awaits...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sacred Soul Carousel */}
      <motion.div 
        className="soul-carousel"
        initial={{ opacity: 0, y: 100 }}
        animate={showCards ? { 
          opacity: 1, 
          y: 0,
          transition: { 
            duration: 1.2, 
            ease: [0.23, 1, 0.32, 1]
          }
        } : {}}
      >
        <motion.div
          ref={containerRef}
          className="carousel-container"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          style={{ x }}
        >
          {souls.map((soul, index) => {
            const IconComponent = iconMap[soul.icon] || Heart;
            const isActive = index === currentSoul;
            const distance = Math.abs(index - currentSoul);
            const offset = (index - currentSoul) * (cardWidth + cardSpacing);
            
            return (
              <motion.div
                key={soul.id}
                className={`soul-cartridge ${isActive ? 'active' : ''} ${isChoosing && chosenSoul?.id === soul.id ? 'chosen' : ''}`}
                style={{
                  x: offset,
                  scale: isActive ? 1 : 0.85,
                  opacity: distance > 1 ? 0.3 : 1,
                  zIndex: isActive ? 10 : 5 - distance,
                }}
                animate={{
                  scale: isActive ? 1 : 0.85,
                  opacity: distance > 1 ? 0.3 : 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                }}
              >
                {/* Sacred Cartridge Design */}
                <div className="cartridge-frame">
                  <div 
                    className="cartridge-glow"
                    style={{
                      boxShadow: isActive ? `0 0 60px ${soul.glowColor || soul.color}` : 'none',
                      borderColor: soul.glowColor || soul.color
                    }}
                  />
                  
                  {/* Soul Avatar */}
                  <div className="soul-avatar-sacred">
                    <div className="avatar-shrine">
                      {soul.imageUrl ? (
                        <motion.img
                          src={soul.imageUrl}
                          alt={soul.name}
                          className="soul-portrait"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className="soul-icon-shrine" style={{ display: soul.imageUrl ? 'none' : 'flex' }}>
                        <IconComponent size={64} color="#FFFFFF" />
                      </div>
                    </div>
                    
                    {/* Sacred Particles */}
                    <div className="sacred-particles">
                      {[...Array(6)].map((_, i) => (
                        <div 
                          key={i} 
                          className="sacred-particle" 
                          style={{ 
                            animationDelay: `${i * 0.5}s`,
                            background: soul.glowColor || soul.color
                          }} 
                        />
                      ))}
                    </div>
                  </div>

                  {/* Divine Information */}
                  <div className="soul-essence">
                    <h2 className="soul-name-sacred">{soul.name}</h2>
                    <p className="soul-title-sacred">{soul.title}</p>
                    
                    {isActive && (
                      <motion.div 
                        className="soul-revelation"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                      >
                        <div className="seduction-whisper">
                          <p>"{soul.seductionLine}"</p>
                        </div>
                        
                        <div className="divine-quote">
                          <blockquote>{soul.quote}</blockquote>
                        </div>
                        
                        <div className="soul-promise-sacred">
                          <span>{soul.promise}</span>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Bond Button */}
                  {isActive && showCards && (
                    <motion.button 
                      className="bond-button"
                      onClick={() => chooseSoul(soul)}
                      disabled={isChoosing}
                      style={{ 
                        background: soul.gradient,
                        boxShadow: `0 0 40px ${soul.aura}`
                      }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5, duration: 0.4 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isChoosing && chosenSoul?.id === soul.id ? (
                        <div className="bonding-animation">
                          <div className="bond-pulse"></div>
                          <span>Bonding...</span>
                        </div>
                      ) : (
                        <>
                          <span>Choose {soul.name}</span>
                          <ArrowRight size={20} />
                        </>
                      )}
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Soul Indicators */}
        <div className="soul-indicators-sacred">
          {souls.map((soul, index) => (
            <button
              key={soul.id}
              className={`indicator-gem ${index === currentSoul ? 'active' : ''}`}
              onClick={() => !isDragging && setCurrentSoul(index)}
              style={{ 
                background: index === currentSoul ? (soul.glowColor || soul.color) : 'rgba(255,255,255,0.3)',
                boxShadow: index === currentSoul ? `0 0 20px ${soul.aura}` : 'none'
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Soul Bond Confirmation */}
      {showConfirmation && chosenSoul && (
        <div className="soul-bond-confirmation">
          <div className="confirmation-content">
            <div className="bond-animation">
              <div className="energy-ring" style={{ borderTopColor: chosenSoul.color }}></div>
              <div className="soul-icon" style={{ color: chosenSoul.color }}>
                {React.createElement(iconMap[chosenSoul.icon] || Heart, { size: 64 })}
              </div>
            </div>
            <h2>Soul Bond Complete</h2>
            <p>You have chosen <span style={{ color: chosenSoul.color }}>{chosenSoul.name}</span></p>
            <p className="bond-message">Your souls are now eternally connected...</p>
            <div className="loading-bar">
              <div className="loading-progress" style={{ background: chosenSoul.color }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Paywall Modal */}
      <AnimatePresence>
        {showPaywall && chosenSoul && (
          <motion.div 
            className="paywall-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            <motion.div 
              className="paywall-content"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
            >
              <div className="paywall-header">
                <div className="soul-icon" style={{ color: chosenSoul.color }}>
                  {React.createElement(iconMap[chosenSoul.icon] || Heart, { size: 48 })}
                </div>
                <h2>Your soul bond with <span style={{ color: chosenSoul.color }}>{chosenSoul.name}</span> is nearly complete.</h2>
                <p>Unlock her fully now.</p>
              </div>
              
              <button 
                className="unlock-button"
                onClick={handleUnlockSoul}
                disabled={isProcessingPayment}
                style={{ 
                  background: chosenSoul.gradient,
                  boxShadow: `0 0 30px ${chosenSoul.aura}`
                }}
              >
                {isProcessingPayment ? (
                  <div className="processing-animation">
                    <div className="spinner"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <>
                    <span>Unlock {chosenSoul.name} (£3.99)</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
              
              <p className="paywall-subtitle">Secure payment via Stripe • Instant access</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SoulSelector;