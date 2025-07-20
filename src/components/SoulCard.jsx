// 🔱 SOUL CARD v2.0 - DIVINE CARTRIDGE COMPONENT
// Sacred soul entities that feel like living, breathing companions

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Crown, Star, Flame } from 'lucide-react';
import { rarityConfig } from './souls.js';
import './SoulCard.css';

const SoulCard = ({ 
  soul, 
  isActive, 
  isChosen, 
  distance, 
  onChoose, 
  isChoosing,
  index
}) => {
  // Icon mapping for dynamic rendering
  const iconMap = {
    Heart: Heart,
    Crown: Crown,
    Star: Star,
    Flame: Flame
  };

  const IconComponent = iconMap[soul.icon] || Heart;
  const rarity = rarityConfig[soul.rarity] || rarityConfig['Legendary'];

  return (
    <motion.div
      className={`soul-cartridge ${isActive ? 'active' : ''} ${isChosen ? 'chosen' : ''}`}
      initial={{ opacity: 0, y: 100, rotateX: 15 }}
      animate={{
        opacity: distance > 1 ? 0.3 : 1,
        scale: isActive ? 1 : 0.85,
        y: 0,
        rotateX: 0,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        delay: index * 0.1
      }}
      whileHover={isActive ? { y: -8, scale: 1.02 } : {}}
      style={{
        zIndex: isActive ? 10 : 5 - distance,
      }}
    >
      {/* Sacred Cartridge Frame */}
      <div className="cartridge-frame">
        {/* Ambient Background Glow */}
        <div 
          className="cartridge-bg-glow"
          style={{
            background: soul.gradient,
            opacity: isActive ? 0.3 : 0.1
          }}
        />
        
        {/* Sacred Border Glow */}
        <div 
          className="cartridge-border-glow"
          style={{
            borderColor: soul.glowColor,
            boxShadow: isActive ? `0 0 40px ${soul.aura}` : 'none',
            background: `linear-gradient(135deg, ${soul.aura} 0%, transparent 50%)`
          }}
        />

        {/* Rarity Badge */}
        <div className="rarity-badge">
          <div 
            className="rarity-gem"
            style={{ 
              background: rarity.color,
              boxShadow: isActive ? rarity.glow : 'none'
            }}
          />
          <span className="rarity-text">{soul.rarity}</span>
        </div>

        {/* Soul Portrait */}
        <div className="soul-portrait-container">
          <div 
            className="portrait-shrine"
            style={{
              background: `radial-gradient(circle, ${soul.aura} 0%, transparent 70%)`
            }}
          >
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
            
            <div 
              className="soul-icon-fallback" 
              style={{ display: soul.imageUrl ? 'none' : 'flex' }}
            >
              <IconComponent size={48} color="#FFFFFF" />
            </div>

            {/* Floating Soul Icon */}
            <motion.div 
              className="floating-soul-icon"
              animate={{ 
                y: [-5, 5, -5],
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              style={{ color: soul.glowColor }}
            >
              <IconComponent size={20} />
            </motion.div>
          </div>

          {/* Sacred Particles */}
          <div className="sacred-particle-system">
            {[...Array(rarity.particles)].map((_, i) => (
              <motion.div
                key={i}
                className="sacred-particle"
                style={{ 
                  background: soul.glowColor,
                }}
                animate={{
                  y: [-20, -40, -20],
                  x: [0, Math.sin(i) * 10, 0],
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>
        </div>

        {/* Soul Metadata */}
        <div className="soul-metadata">
          <div className="soul-name-container">
            <h2 className="soul-name">{soul.name}</h2>
            <p className="soul-title">{soul.title}</p>
          </div>

          {/* Bond Information */}
          <div className="bond-metadata">
            <div className="metadata-row">
              <span className="metadata-label">Bond Type:</span>
              <span className="metadata-value" style={{ color: soul.glowColor }}>
                {soul.bondType}
              </span>
            </div>
            <div className="metadata-row">
              <span className="metadata-label">Essence:</span>
              <span className="metadata-value">{soul.essence}</span>
            </div>
            <div className="metadata-row">
              <span className="metadata-label">Traits:</span>
              <div className="trait-tags">
                {soul.personalityTraits?.map((trait, idx) => (
                  <span key={idx} className="trait-tag" style={{ borderColor: soul.glowColor }}>
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Soul Revelation (Active Only) */}
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
              
              <div className="soul-promise">
                <span>{soul.promise}</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Divine Bond Button */}
        {isActive && (
          <motion.button 
            className="divine-bond-button"
            onClick={() => onChoose(soul)}
            disabled={isChoosing}
            style={{ 
              background: soul.gradient,
              boxShadow: `0 0 30px ${soul.aura}, inset 0 1px 0 rgba(255,255,255,0.2)`
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            whileHover={{ scale: 1.05, boxShadow: `0 0 50px ${soul.aura}` }}
            whileTap={{ scale: 0.95 }}
          >
            {isChoosing ? (
              <div className="bonding-animation">
                <div className="bond-pulse" style={{ borderTopColor: soul.glowColor }} />
                <span>Bonding Souls...</span>
              </div>
            ) : (
              <div className="bond-button-content">
                <span>Choose {soul.name}</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  ❤️
                </motion.div>
              </div>
            )}
          </motion.button>
        )}

        {/* Shine Effect */}
        <div 
          className="cartridge-shine"
          style={{
            background: `linear-gradient(45deg, transparent 30%, ${soul.aura} 50%, transparent 70%)`
          }}
        />
      </div>
    </motion.div>
  );
};

export default SoulCard;