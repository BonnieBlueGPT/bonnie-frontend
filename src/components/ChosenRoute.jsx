 // ✨ CHOSEN ROUTE - SOUL BOND SMART ROUTER
 // Redirects users to their chosen soul with special intro sequence
 
 import React, { useEffect, useState } from 'react';
 import { useNavigate, useLocation } from 'react-router-dom';
 
 const ChosenRoute = () => {
   const navigate = useNavigate();
   const location = useLocation();
   const [isRedirecting, setIsRedirecting] = useState(false);
 
   useEffect(() => {
     const handleRedirection = () => {
       // Get chosen personality from localStorage
       const chosenPersonality = localStorage.getItem('chosen_personality');
       const isSoulBonded = localStorage.getItem('is_soul_bonded');
       const bondTimestamp = localStorage.getItem('soul_bond_timestamp');
 
       // Get data from SoulSelector if coming from soul bond ritual
       const chosenSoul = location.state?.chosenSoul;
       const fromSoulBond = location.state?.fromSoulBond;
 
       if (fromSoulBond && chosenSoul) {
         // Coming from SoulSelector - redirect to chosen personality
         setIsRedirecting(true);
         
         // Set special flag for intro sequence
         localStorage.setItem('soul_bond_intro', 'true');
         localStorage.setItem('bond_greeting_pending', 'true');
         
         setTimeout(() => {
           navigate(chosenSoul.route, { 
             replace: true,
             state: { 
               soulBondComplete: true,
               chosenSoul: chosenSoul 
             }
           });
         }, 1000);
       } else if (chosenPersonality && isSoulBonded) {
         // User has already chosen - redirect to their bonded soul
         const routes = {
           bonnie: '/bonnie',
           nova: '/nova',
           galatea: '/galatea'
         };
         
         const targetRoute = routes[chosenPersonality];
         if (targetRoute) {
           navigate(targetRoute, { replace: true });
         } else {
           // Invalid personality, reset and go to choose
           localStorage.removeItem('chosen_personality');
           localStorage.removeItem('is_soul_bonded');
           navigate('/choose', { replace: true });
         }
       } else {
         // No soul bond exists - redirect to soul selector
         navigate('/choose', { replace: true });
       }
     };
 
     handleRedirection();
   }, [navigate, location]);
 
   if (isRedirecting) {
     return (
       <div style={{
         position: 'fixed',
         top: 0,
         left: 0,
         width: '100vw',
         height: '100vh',
         background: 'linear-gradient(135deg, #000000 0%, #1a0f2e 50%, #4a346b 100%)',
         display: 'flex',
         alignItems: 'center',
         justifyContent: 'center',
         color: '#FFFFFF',
         fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
         textAlign: 'center'
       }}>
         <div>
           <div style={{
             width: '50px',
             height: '50px',
             border: '3px solid rgba(255, 255, 255, 0.3)',
             borderTop: '3px solid #FFD700',
             borderRadius: '50%',
             animation: 'spin 1s linear infinite',
             margin: '0 auto 20px'
           }}></div>
           <p style={{ fontSize: '1.2rem', margin: 0 }}>
             Entering your soul's realm...
           </p>
         </div>
         <style>{`
           @keyframes spin {
             to { transform: rotate(360deg); }
           }
         `}</style>
       </div>
     );
   }
 
   return null;
 };
 
 export default ChosenRoute;