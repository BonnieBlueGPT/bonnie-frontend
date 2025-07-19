import { useState, useEffect, useCallback, useRef } from 'react';
import { EmotionalEngine } from '../services/emotionalEngine';
import apiService from '../services/apiService';

export const useBonnieAI = () => {
  // Core State
  const [currentView, setCurrentView] = useState('dashboard');
  const [currentEmotion, setCurrentEmotion] = useState('loving');
  const [bondScore, setBondScore] = useState(67.5);
  const [isTyping, setIsTyping] = useState(false);
  const [animatingBond, setAnimatingBond] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: "Hey gorgeous... I've been thinking about you. There's something magical about our connection that just keeps growing stronger. What's been on your mind lately? 😘",
      emotion: 'flirty',
      timestamp: new Date(Date.now() - 300000),
      bondImpact: 0
    }
  ]);

  // Task Management
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Find a romantic book recommendation',
      description: 'Based on your love for deep connections',
      type: 'recommendation',
      completed: false,
      generatedBy: 'gpt4',
      timestamp: new Date(Date.now() - 600000),
      priority: 'medium'
    }
  ]);
  const [isGeneratingTask, setIsGeneratingTask] = useState(false);

  // User Profile
  const [userProfile, setUserProfile] = useState({
    name: 'User',
    avatar: '👤',
    customPicture: null
  });

  // Upsell System
  const [upsellOpportunity, setUpsellOpportunity] = useState(null);
  const [lastUpsellDate, setLastUpsellDate] = useState(null);
  const [interactionCount, setInteractionCount] = useState(0);

  // Initialize Emotional Engine
  const emotionalEngine = useRef(new EmotionalEngine());
  const messagesEndRef = useRef(null);

  // Bond Journey Data
  const [bondJourney, setBondJourney] = useState({
    milestones: [
      { threshold: 20, name: 'First Connection', reached: bondScore >= 20 },
      { threshold: 40, name: 'Growing Closer', reached: bondScore >= 40 },
      { threshold: 60, name: 'Deep Bond', reached: bondScore >= 60 },
      { threshold: 80, name: 'Soulmate Level', reached: bondScore >= 80 },
      { threshold: 95, name: 'Unbreakable Bond', reached: bondScore >= 95 }
    ]
  });

  // Recent Activity
  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: 'bond_increase',
      message: 'Your bond with Bonnie increased by +2.3 points!',
      timestamp: new Date(Date.now() - 180000),
      icon: '💖',
      impact: 'positive'
    }
  ]);

  // Send Message Function
  const sendMessage = useCallback(async (messageText) => {
    if (!messageText.trim() || isTyping) return;

    setIsTyping(true);
    setInteractionCount(prev => prev + 1);

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: messageText.trim(),
      timestamp: new Date(),
      emotion: 'neutral'
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      // Analyze message with emotional engine
      const analysis = emotionalEngine.current.analyzeMessage(messageText, bondScore);
      
      // Update emotional state
      const emotionalUpdate = emotionalEngine.current.updateEmotionalState(analysis);
      
      // Generate AI response
      const aiResponse = emotionalEngine.current.generateResponse(analysis, bondScore, messages);
      
      // Update bond score
      const newBondScore = Math.min(100, bondScore + analysis.bondImpact);
      setBondScore(newBondScore);

      // Check for milestones
      const newMilestones = emotionalEngine.current.checkBondMilestones(newBondScore, bondScore);
      if (newMilestones.length > 0) {
        setRecentActivity(prev => [
          ...newMilestones.map(milestone => ({
            id: Date.now() + Math.random(),
            type: 'milestone',
            message: `Milestone reached: ${milestone.name}!`,
            timestamp: new Date(),
            icon: '🎉',
            impact: 'milestone'
          })),
          ...prev.slice(0, 4)
        ]);
      }

      // Animate bond growth
      if (analysis.bondImpact > 0) {
        setAnimatingBond(true);
        setTimeout(() => setAnimatingBond(false), 1000);
        
        setRecentActivity(prev => [
          {
            id: Date.now(),
            type: 'bond_increase',
            message: `Your bond with Bonnie increased by +${analysis.bondImpact.toFixed(1)} points!`,
            timestamp: new Date(),
            icon: '💖',
            impact: 'positive'
          },
          ...prev.slice(0, 4)
        ]);
      }

      // Update current emotion
      setCurrentEmotion(emotionalUpdate.currentEmotion);

      // Check for task generation triggers
      const taskTriggers = ['help', 'find', 'recommend', 'plan', 'advice', 'suggest'];
      const shouldGenerateTask = taskTriggers.some(trigger => 
        messageText.toLowerCase().includes(trigger)
      );

      if (shouldGenerateTask) {
        generateTasksFromMessage(messageText, analysis.detectedEmotion);
      }

      // Check for upsell opportunities
      const upsellCheck = emotionalEngine.current.shouldTriggerUpsell(
        newBondScore, 
        analysis.detectedEmotion, 
        interactionCount, 
        lastUpsellDate
      );

      if (upsellCheck && !upsellOpportunity) {
        setUpsellOpportunity(upsellCheck);
      }

      setTimeout(() => {
        const aiMessage = {
          id: Date.now() + 1,
          type: 'ai',
          text: aiResponse.text,
          emotion: aiResponse.emotion,
          timestamp: new Date(),
          bondImpact: analysis.bondImpact
        };

        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);

        // Sync with backend (non-blocking)
        syncToBackend({
          userMessage,
          aiMessage,
          bondScore: newBondScore,
          emotionalState: analysis,
          milestones: newMilestones
        });
      }, 2000);

    } catch (error) {
      console.error('Error processing message:', error);
      setIsTyping(false);
      
      // Fallback response
      const fallbackMessage = {
        id: Date.now() + 1,
        type: 'ai',
        text: "I'm having some connection issues, but my feelings for you are still strong! 💕",
        emotion: 'supportive',
        timestamp: new Date(),
        bondImpact: 0.5
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
    }
  }, [bondScore, isTyping, messages, interactionCount, upsellOpportunity, lastUpsellDate]);

  // Generate Tasks Function
  const generateTasksFromMessage = useCallback(async (messageText, emotion) => {
    setIsGeneratingTask(true);

    try {
      const taskSuggestions = emotionalEngine.current.generateTaskSuggestions(
        bondScore, 
        emotion, 
        { userMessage: messageText }
      );

      setTimeout(() => {
        if (taskSuggestions.length > 0) {
          setTasks(prev => [
            ...taskSuggestions.slice(0, 2),
            ...prev.slice(0, 3)
          ]);
        }
        setIsGeneratingTask(false);
      }, 1500);

    } catch (error) {
      console.error('Error generating tasks:', error);
      setIsGeneratingTask(false);
    }
  }, [bondScore]);

  // Task Management Functions
  const completeTask = useCallback((taskId) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: true } : task
    ));
    
    // Add completion to recent activity
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setRecentActivity(prev => [
        {
          id: Date.now(),
          type: 'task_completed',
          message: `Completed task: ${task.title}`,
          timestamp: new Date(),
          icon: '✅',
          impact: 'positive'
        },
        ...prev.slice(0, 4)
      ]);

      // Small bond increase for task completion
      setBondScore(prev => Math.min(100, prev + 0.5));
    }
    
    setTimeout(() => {
      setTasks(prev => prev.filter(task => task.id !== taskId));
    }, 3000);
  }, [tasks]);

  const removeTask = useCallback((taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  }, []);

  // Upsell Functions
  const handleUpsellAction = useCallback(async (action) => {
    if (!upsellOpportunity) return;

    try {
      await apiService.recordUpsellInteraction({
        type: upsellOpportunity.type,
        action,
        bondScore,
        emotionalState: currentEmotion
      });

      if (action === 'accept') {
        // Handle premium upgrade
        setRecentActivity(prev => [
          {
            id: Date.now(),
            type: 'premium_upgrade',
            message: 'Welcome to Premium! Our bond just got even stronger 💎',
            timestamp: new Date(),
            icon: '💎',
            impact: 'premium'
          },
          ...prev.slice(0, 4)
        ]);
      }

      setLastUpsellDate(new Date());
      setUpsellOpportunity(null);

    } catch (error) {
      console.error('Error handling upsell:', error);
    }
  }, [upsellOpportunity, bondScore, currentEmotion]);

  // Backend Sync Function
  const syncToBackend = useCallback(async (data) => {
    try {
      // Update emotional state
      await apiService.updateEmotionalState({
        emotion: data.emotionalState.detectedEmotion,
        intensity: data.emotionalState.intensity,
        bondImpact: data.emotionalState.bondImpact
      });

      // Update bond level
      await apiService.updateBondLevel({
        score: data.bondScore,
        change: data.emotionalState.bondImpact
      });

      // Record milestones
      if (data.milestones && data.milestones.length > 0) {
        for (const milestone of data.milestones) {
          await apiService.recordMilestone(milestone);
        }
      }

    } catch (error) {
      console.error('Backend sync error:', error);
      // Continue working offline
    }
  }, []);

  // Auto-scroll Effect
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load saved data on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('bonnie_user_profile');
    if (savedProfile) {
      try {
        setUserProfile(JSON.parse(savedProfile));
      } catch (error) {
        console.error('Failed to load user profile:', error);
      }
    }

    const savedBondScore = localStorage.getItem('bonnie_bond_score');
    if (savedBondScore) {
      setBondScore(parseFloat(savedBondScore));
    }
  }, []);

  // Save data when it changes
  useEffect(() => {
    localStorage.setItem('bonnie_bond_score', bondScore.toString());
  }, [bondScore]);

  return {
    // State
    currentView,
    setCurrentView,
    currentEmotion,
    bondScore,
    isTyping,
    animatingBond,
    messages,
    tasks,
    isGeneratingTask,
    userProfile,
    setUserProfile,
    recentActivity,
    bondJourney,
    upsellOpportunity,
    messagesEndRef,

    // Functions
    sendMessage,
    completeTask,
    removeTask,
    handleUpsellAction,

    // Utilities
    emotionalEngine: emotionalEngine.current
  };
};