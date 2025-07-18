import { useState, useEffect, useCallback, useRef } from 'react';

export const useMobileOptimizations = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isIOS: false,
    isAndroid: false,
    isStandalone: false,
    screenHeight: window.innerHeight,
    screenWidth: window.innerWidth,
    orientation: 'portrait',
    connectionType: 'unknown'
  });

  const [performanceMetrics, setPerformanceMetrics] = useState({
    fps: 60,
    memoryUsage: 0,
    loadTime: 0
  });

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  // Device detection and info gathering
  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isAndroid = /Android/.test(userAgent);
    const isMobile = isIOS || isAndroid || window.innerWidth <= 768;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

    // Get connection info if available
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const connectionType = connection ? connection.effectiveType : 'unknown';

    setDeviceInfo({
      isMobile,
      isIOS,
      isAndroid,
      isStandalone,
      screenHeight: window.innerHeight,
      screenWidth: window.innerWidth,
      orientation: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape',
      connectionType
    });

    // iOS Safari viewport fix
    if (isIOS) {
      const setVH = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      };
      setVH();
      window.addEventListener('resize', setVH);
      window.addEventListener('orientationchange', setVH);
      
      return () => {
        window.removeEventListener('resize', setVH);
        window.removeEventListener('orientationchange', setVH);
      };
    }
  }, []);

  // Performance monitoring
  useEffect(() => {
    const measureFPS = () => {
      frameCountRef.current++;
      const now = performance.now();
      
      if (now >= lastTimeRef.current + 1000) {
        const fps = Math.round((frameCountRef.current * 1000) / (now - lastTimeRef.current));
        setPerformanceMetrics(prev => ({ ...prev, fps }));
        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }
      
      requestAnimationFrame(measureFPS);
    };

    const animationId = requestAnimationFrame(measureFPS);
    
    // Memory usage monitoring
    if (performance.memory) {
      const memoryUsage = Math.round(performance.memory.usedJSHeapSize / 1048576); // MB
      setPerformanceMetrics(prev => ({ ...prev, memoryUsage }));
    }

    return () => cancelAnimationFrame(animationId);
  }, []);

  // Haptic feedback for mobile
  const triggerHaptic = useCallback((type = 'light') => {
    if (deviceInfo.isMobile && navigator.vibrate) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30],
        success: [10, 50, 10],
        error: [50, 50, 50]
      };
      navigator.vibrate(patterns[type] || patterns.light);
    }
  }, [deviceInfo.isMobile]);

  // Optimize scroll performance
  const optimizeScroll = useCallback((element) => {
    if (!element || !deviceInfo.isMobile) return;

    element.style.webkitOverflowScrolling = 'touch';
    element.style.overscrollBehavior = 'contain';
    
    // Prevent bounce on iOS
    if (deviceInfo.isIOS) {
      element.style.webkitOverflowScrolling = 'touch';
    }
  }, [deviceInfo]);

  // Touch gesture optimization
  const optimizeTouch = useCallback((element) => {
    if (!element || !deviceInfo.isMobile) return;

    element.style.touchAction = 'manipulation';
    element.style.webkitTapHighlightColor = 'transparent';
    element.style.webkitTouchCallout = 'none';
    element.style.webkitUserSelect = 'none';
  }, [deviceInfo]);

  // Prevent zoom on input focus (iOS Safari)
  const preventZoom = useCallback((inputElement) => {
    if (!inputElement || !deviceInfo.isIOS) return;

    const handleFocus = () => {
      if (inputElement.style.fontSize !== '16px') {
        inputElement.style.fontSize = '16px';
      }
    };

    inputElement.addEventListener('focus', handleFocus);
    return () => inputElement.removeEventListener('focus', handleFocus);
  }, [deviceInfo.isIOS]);

  return {
    deviceInfo,
    performanceMetrics,
    triggerHaptic,
    optimizeScroll,
    optimizeTouch,
    preventZoom
  };
};

export default useMobileOptimizations;