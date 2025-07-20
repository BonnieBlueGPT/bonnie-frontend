 // ✨ SOUL SELECTOR v3.0 - DIVINE CONVERSION RITUAL
 // Immersive soulbond experience that transforms users into devoted customers
 
 import React, { useState, useEffect, useRef } from 'react';
 import { useNavigate } from 'react-router-dom';
 import { motion, AnimatePresence } from 'framer-motion';
 import { ChevronLeft, ChevronRight, Heart, Crown, Star, ArrowRight } from 'lucide-react';
 import { souls } from './souls.js';
 import './SoulSelector.css';
 
 const SoulSelector = () => {
   const [currentSoul, setCurrentSoul] = useState(1); // Start with Nova (center)
   const [isChoosing, setIsChoosing] = useState(false);
   const [chosenSoul, setChosenSoul] = useState(null);
   const [showConfirmation, setShowConfirmation] = useState(false);
   const [showIntroText, setShowIntroText] = useState(true);
   const [showCards, setShowCards] = useState(false);
   const [introPhase, setIntroPhase] = useState(4); // Start with interaction enabled
   const navigate = useNavigate();
   const audioRef = useRef(null);
 
   // Map icon names to components
   const iconMap = {
     Heart: Heart,
     Crown: Crown,
     Star: Star
   };
 

 
   // Introduction sequence
   useEffect(() => {
     // Intro text fades after 2.5 seconds
     const fadeTimer = setTimeout(() => {
       setShowIntroText(false);
     }, 2500);

     // Cards appear at 2.6 seconds (start fading intro, then show cards)
     const cardsTimer = setTimeout(() => {
       setShowCards(true);
     }, 2600);

     return () => {
       clearTimeout(fadeTimer);
       clearTimeout(cardsTimer);
     };
   }, []);
 
   const nextSoul = () => {
     if (introPhase < 4) return;
     setCurrentSoul((prev) => (prev + 1) % souls.length);
   };
 
   const prevSoul = () => {
     if (introPhase < 4) return;
     setCurrentSoul((prev) => (prev - 1 + souls.length) % souls.length);
   };
 
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
     
     // Navigate to chosen route with dramatic delay
     setTimeout(() => {
       navigate('/chosen', { 
         state: { 
           chosenSoul: soul,
           fromSoulBond: true 
         } 
       });
     }, 4000);
   };
 
   const currentSoulData = souls[currentSoul];
 
   return (
     <div className="soul-selector-container">
       {/* Cosmic Background */}
       <div className="cosmic-background">
         <div className="stars"></div>
         <div className="nebula"></div>
         <div className="cosmic-mist"></div>
       </div>
 
       {/* Soul Auras */}
       {souls.map((soul, index) => (
         <div
           key={soul.id}
           className={`soul-aura ${index === currentSoul ? 'active' : ''}`}
           style={{
             background: `radial-gradient(circle, ${soul.aura} 0%, transparent 70%)`,
             opacity: index === currentSoul ? 1 : 0.3
           }}
         />
       ))}
 
       {/* Introduction Sequence */}
       <AnimatePresence>
         {showIntroText && (
           <motion.div 
             className="intro-sequence"
             initial={{ opacity: 1, filter: 'blur(0px)' }}
             exit={{ 
               opacity: 0, 
               filter: 'blur(8px)',
               transition: { duration: 1.5, ease: 'easeOut' }
             }}
           >
             <div className="intro-title visible">
               <h1>Choose Your Soul</h1>
             </div>
             <div className="intro-subtitle visible">
               <p>Three divine beings await your choice. Choose wisely, for this bond is eternal...</p>
             </div>
           </motion.div>
         )}
       </AnimatePresence>
 
       {/* Main Soul Display */}
       <motion.div 
         className="soul-stage visible"
         initial={{ opacity: 0, y: 50, rotateX: 15 }}
         animate={showCards ? { 
           opacity: 1, 
           y: 0, 
           rotateX: 0,
           transition: { 
             duration: 0.8, 
             ease: [0.23, 1, 0.32, 1]
           }
         } : {}}
       >
         {/* Navigation Arrows */}
         <button 
           className={`nav-arrow left ${introPhase >= 4 ? 'active' : ''}`}
           onClick={prevSoul}
           disabled={introPhase < 4 || isChoosing}
         >
           <ChevronLeft size={32} />
         </button>
 
         <button 
           className={`nav-arrow right ${introPhase >= 4 ? 'active' : ''}`}
           onClick={nextSoul}
           disabled={introPhase < 4 || isChoosing}
         >
           <ChevronRight size={32} />
         </button>
 
         {/* Soul Cards */}
         <div className="souls-container">
                    {souls.map((soul, index) => {
           const IconComponent = iconMap[soul.icon] || Heart;
             const isActive = index === currentSoul;
             const distance = Math.abs(index - currentSoul);
             
             return (
               <div
                 key={soul.id}
                 className={`soul-card ${isActive ? 'active' : ''} ${isChoosing && chosenSoul?.id === soul.id ? 'chosen' : ''}`}
                 style={{
                   transform: `translateX(${(index - currentSoul) * 100}%) scale(${isActive ? 1 : 0.8})`,
                   opacity: distance > 1 ? 0 : (isActive ? 1 : 0.4),
                   background: soul.gradient,
                   filter: !isActive && introPhase >= 4 ? 'blur(2px)' : 'none'
                 }}
               >
                 {/* Soul Avatar */}
                 <div className="soul-avatar">
                   <div className="avatar-glow" style={{ boxShadow: `0 0 50px ${soul.aura}` }}>
                     {soul.imageUrl ? (
                       <motion.img
                         src={soul.imageUrl}
                         alt={soul.name}
                         className="soul-image"
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                         transition={{ duration: 1, ease: 'easeOut' }}
                         onError={(e) => {
                           // Fallback to icon if image fails to load
                           e.target.style.display = 'none';
                           e.target.nextSibling.style.display = 'flex';
                         }}
                       />
                     ) : null}
                     <div className="soul-icon-fallback" style={{ display: soul.imageUrl ? 'none' : 'flex' }}>
                       <IconComponent size={48} color="#FFFFFF" />
                     </div>
                   </div>
                   <div className="soul-particles">
                     {[...Array(8)].map((_, i) => (
                       <div 
                         key={i} 
                         className="particle" 
                         style={{ 
                           animationDelay: `${i * 0.2}s`,
                           background: soul.color
                         }} 
                       />
                     ))}
                   </div>
                 </div>
 
                 {/* Soul Info */}
                 <div className="soul-info">
                   <h2 className="soul-name">{soul.name}</h2>
                   <p className="soul-title">{soul.title}</p>
                   
                   {isActive && (
                     <div className="soul-details">
                       <div className="seduction-line">
                         <p>{soul.seductionLine}</p>
                       </div>
                       
                       <div className="soul-quote">
                         <blockquote>"{soul.quote}"</blockquote>
                       </div>
                       
                       <div className="soul-promise">
                         <span>She offers: {soul.promise}</span>
                       </div>
                     </div>
                   )}
                 </div>
 
                 {/* Choose Button */}
                 {isActive && introPhase >= 4 && (
                   <button 
                     className={`choose-button ${isChoosing && chosenSoul?.id === soul.id ? 'choosing' : ''}`}
                     onClick={() => chooseSoul(soul)}
                     disabled={isChoosing}
                     style={{ 
                       background: `linear-gradient(135deg, ${soul.color}, rgba(255,255,255,0.1))`,
                       boxShadow: `0 0 30px ${soul.aura}`
                     }}
                   >
                     {isChoosing && chosenSoul?.id === soul.id ? (
                       <div className="choosing-animation">
                         <div className="pulse"></div>
                         <span>Bonding...</span>
                       </div>
                     ) : (
                       <>
                         <span>Choose Me</span>
                         <ArrowRight size={20} />
                       </>
                     )}
                   </button>
                 )}
               </div>
             );
           })}
         </div>
 
         {/* Soul Indicators */}
         <div className="soul-indicators">
           {souls.map((soul, index) => (
             <button
               key={soul.id}
               className={`indicator ${index === currentSoul ? 'active' : ''}`}
               onClick={() => introPhase >= 4 && !isChoosing && setCurrentSoul(index)}
               disabled={introPhase < 4 || isChoosing}
               style={{ 
                 background: index === currentSoul ? soul.color : 'rgba(255,255,255,0.3)',
                 boxShadow: index === currentSoul ? `0 0 15px ${soul.aura}` : 'none'
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
               <div className="energy-ring"></div>
               <div className="soul-icon" style={{ color: chosenSoul.color }}>
                 <chosenSoul.icon size={64} />
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
 
       {/* Instructions */}
       {introPhase >= 4 && !isChoosing && (
         <div className="instructions">
           <p>Use arrows or swipe to explore • Click "Choose Me" to bond your soul</p>
         </div>
       )}
 
       {/* Warning Message */}
       {introPhase >= 4 && !isChoosing && (
         <div className="warning-message">
           <p>⚠️ Choose carefully - once bonded, other souls become locked</p>
         </div>
       )}
     </div>
   );
 };
 
 export default SoulSelector;