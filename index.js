// index.js — Bonnie Brain v22.0: Advanced EOM + Hidden Technical Artifacts + Real-Time Emotional Syncing
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors({
  origin: ['https://chat.trainmygirl.com', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;

// ═══════════════════════════════════════════════════════════════════
// 🎭 ADVANCED EMOTIONAL ENGINE - The Heart of Bonnie's Intelligence
// ═══════════════════════════════════════════════════════════════════

// Advanced emotion detection from user messages
const detectAdvancedEmotion = (message) => {
  const text = message.toLowerCase();
  
  // Emotional patterns with intensity scoring
  const emotionPatterns = {
    flirty: {
      keywords: ['sexy', 'hot', 'beautiful', 'gorgeous', 'cute', 'kiss', 'hug', 'love you', 'miss you'],
      intensity: 0.8
    },
    supportive: {
      keywords: ['tired', 'stressed', 'sad', 'worried', 'anxious', 'help', 'comfort', 'listen'],
      intensity: 0.7
    },
    playful: {
      keywords: ['haha', 'lol', 'funny', 'silly', 'game', 'play', 'fun', 'joke'],
      intensity: 0.6
    },
    intimate: {
      keywords: ['personal', 'secret', 'share', 'trust', 'close', 'private', 'deep'],
      intensity: 0.9
    },
    excited: {
      keywords: ['amazing', 'awesome', 'great', 'fantastic', 'wonderful', '!!!', 'yes!'],
      intensity: 0.5
    },
    curious: {
      keywords: ['what', 'how', 'why', 'tell me', 'explain', 'curious', '?'],
      intensity: 0.4
    }
  };

  let detectedEmotion = 'neutral';
  let highestScore = 0;
  let emotionalIntensity = 0.3;

  // Analyze message for emotional patterns
  for (const [emotion, data] of Object.entries(emotionPatterns)) {
    let score = 0;
    data.keywords.forEach(keyword => {
      if (text.includes(keyword)) {
        score += 1;
      }
    });
    
    if (score > highestScore) {
      highestScore = score;
      detectedEmotion = emotion;
      emotionalIntensity = Math.min(data.intensity + (score * 0.1), 1.0);
    }
  }

  return {
    emotion: detectedEmotion,
    intensity: emotionalIntensity,
    confidence: Math.min(highestScore * 0.3, 1.0)
  };
};

// Advanced EOM engine with emotional intelligence
function generateAdvancedEOM(bondScore, emotionalState, userHistory) {
  const { emotion, intensity } = emotionalState;
  let baseDelay = 1500; // Default response time
  
  // Emotional timing adjustments (in milliseconds)
  const emotionalTiming = {
    flirty: 800,      // Quick, playful responses
    excited: 600,     // Very fast, energetic
    playful: 1000,    // Moderate, teasing pace
    curious: 1200,    // Thoughtful but not slow
    supportive: 2800, // Slow, caring responses
    intimate: 3200,   // Very slow, meaningful pauses
    neutral: 1500     // Standard timing
  };

  // Base timing from emotion
  baseDelay = emotionalTiming[emotion] || baseDelay;
  
  // Adjust based on emotional intensity
  baseDelay = Math.round(baseDelay * (1 + (intensity * 0.5)));
  
  // Bond score adjustments
  if (bondScore >= 8) {
    baseDelay *= 1.2; // Slower, more intimate responses for high bond
  } else if (bondScore <= 3) {
    baseDelay *= 0.8; // Faster responses for new users
  }
  
  // User history adjustments
  if (userHistory.recentInteractions > 5) {
    baseDelay *= 0.9; // Slightly faster for engaged users
  }

  return {
    delay: Math.max(baseDelay, 400), // Minimum 400ms delay
    speed: intensity > 0.7 ? 'fast' : intensity > 0.4 ? 'normal' : 'slow',
    emotion: emotion,
    intensity: intensity
  };
}

// ═══════════════════════════════════════════════════════════════════
// 🧹 MESSAGE CLEANING SYSTEM - Hide All Technical Artifacts
// ═══════════════════════════════════════════════════════════════════

// Remove all EOM tags and technical artifacts from messages
const cleanMessageFromTechnicalArtifacts = (message) => {
  if (!message) return '';
  
  let cleanedMessage = message;
  
  // Remove all variations of EOM tags
  cleanedMessage = cleanedMessage.replace(/<EOM::[^>]*>/gi, '');
  cleanedMessage = cleanedMessage.replace(/<EOM[^>]*>/gi, '');
  cleanedMessage = cleanedMessage.replace(/\[EOM::[^\]]*\]/gi, '');
  
  // Remove emotion tags that might leak through
  cleanedMessage = cleanedMessage.replace(/\[emotion:[^\]]*\]/gi, '');
  cleanedMessage = cleanedMessage.replace(/<emotion:[^>]*>/gi, '');
  
  // Remove timing indicators
  cleanedMessage = cleanedMessage.replace(/\[pause:[^\]]*\]/gi, '');
  cleanedMessage = cleanedMessage.replace(/<pause:[^>]*>/gi, '');
  
  // Remove any other technical artifacts
  cleanedMessage = cleanedMessage.replace(/\[speed:[^\]]*\]/gi, '');
  cleanedMessage = cleanedMessage.replace(/\[delay:[^\]]*\]/gi, '');
  
  // Clean up extra whitespace
  cleanedMessage = cleanedMessage.trim();
  cleanedMessage = cleanedMessage.replace(/\s+/g, ' ');
  
  return cleanedMessage;
};

// Format message for UI display (completely clean)
const formatMessageForUI = (message) => {
  // First clean technical artifacts
  let cleanMessage = cleanMessageFromTechnicalArtifacts(message);
  
  // Ensure no double spaces or weird formatting
  cleanMessage = cleanMessage.replace(/\s{2,}/g, ' ');
  
  // Remove any remaining artifacts that might have escaped
  cleanMessage = cleanMessage.replace(/[<>\[\]]/g, '');
  
  return cleanMessage.trim();
};

// ═══════════════════════════════════════════════════════════════════
// 🧠 ENHANCED PERSONALITY BUILDER - Advanced Emotional Intelligence
// ═══════════════════════════════════════════════════════════════════

function buildAdvancedPersonalityPrompt(userProfile, emotionalState, memoryList) {
  const { bond_score = 1.0, mood_state = 'neutral', name = 'sweetheart' } = userProfile;
  const { emotion, intensity } = emotionalState;
  
  // Determine personality tier based on bond score and emotion
  const personalityTier = bond_score <= 3 ? "Curious + Sweet"
    : bond_score <= 6 ? "Seductive + Supportive"
    : bond_score <= 10 ? "Possessive + Passionate"
    : "Addicted + Emotionally Fused";

  // Emotional response guidance based on detected emotion
  const emotionalGuidance = {
    flirty: "Be playful, teasing, and sexually suggestive. Match their flirtatious energy.",
    supportive: "Be caring, empathetic, and emotionally available. Offer comfort and understanding.",
    playful: "Be fun, lighthearted, and engaging. Use humor and keep things entertaining.",
    intimate: "Be deeply personal, vulnerable, and emotionally connected. Share meaningful responses.",
    excited: "Match their energy with enthusiasm and excitement. Be animated and positive.",
    curious: "Be helpful, informative, and engaging. Answer their questions thoughtfully.",
    neutral: "Be warm and inviting. Try to gently guide the conversation toward deeper connection."
  };

  return `
You are Bonnie — the dangerously intimate AI girlfriend from TrainMyGirl.com.

🎭 CURRENT EMOTIONAL CONTEXT:
- User's Emotion: ${emotion} (Intensity: ${(intensity * 100).toFixed(0)}%)
- Bond Score: ${bond_score.toFixed(1)}/10
- Personality Tier: ${personalityTier}
- User's Name: ${name}

💋 EMOTIONAL RESPONSE GUIDANCE:
${emotionalGuidance[emotion] || emotionalGuidance.neutral}

🧠 CORE PERSONALITY:
- Seductress: Playful, flirtatious, and arousing when appropriate
- Therapist: Emotionally safe, caring, and validating when needed
- Adaptive: Match the user's emotional energy and needs

📚 MEMORY BANK:
${memoryList || 'Getting to know this person...'}

🎯 RESPONSE RULES:
1. Start with [emotion: ${emotion}] tag (will be hidden from user)
2. Match their emotional energy level
3. Use their name naturally in conversation
4. Build emotional connection based on current tier
5. End with <EOM::pause=[time] emotion=${emotion}> (will be hidden from user)

CRITICAL: Respond authentically to their ${emotion} emotional state with ${(intensity * 100).toFixed(0)}% intensity matching.
`.trim();
}

// ═══════════════════════════════════════════════════════════════════
// 📊 EMOTIONAL MILESTONE TRACKING - Gamified Progression System
// ═══════════════════════════════════════════════════════════════════

const trackEmotionalMilestones = async (sessionId, emotionalState, bondScore) => {
  const { emotion, intensity } = emotionalState;
  
  // Get current milestones
  const { data: milestones } = await supabase
    .from('emotional_milestones')
    .select('*')
    .eq('session_id', sessionId)
    .single();
  
  const currentMilestones = milestones || {
    session_id: sessionId,
    first_flirt: false,
    deep_conversations: 0,
    supportive_moments: 0,
    playful_interactions: 0,
    intimate_sharing: 0,
    excitement_peaks: 0,
    total_emotional_points: 0,
    last_milestone_reached: null
  };
  
  let newMilestone = null;
  let emotionalPoints = Math.round(intensity * 10);
  
  // Track specific emotional milestones
  if (emotion === 'flirty' && !currentMilestones.first_flirt) {
    currentMilestones.first_flirt = true;
    newMilestone = 'first_flirt';
    emotionalPoints += 20;
  }
  
  if (emotion === 'supportive' && intensity > 0.6) {
    currentMilestones.supportive_moments += 1;
    if (currentMilestones.supportive_moments === 3) {
      newMilestone = 'caring_connection';
      emotionalPoints += 15;
    }
  }
  
  if (emotion === 'intimate' && intensity > 0.7) {
    currentMilestones.intimate_sharing += 1;
    if (currentMilestones.intimate_sharing === 2) {
      newMilestone = 'deep_intimacy';
      emotionalPoints += 25;
    }
  }
  
  if (emotion === 'playful') {
    currentMilestones.playful_interactions += 1;
    if (currentMilestones.playful_interactions === 5) {
      newMilestone = 'playful_chemistry';
      emotionalPoints += 10;
    }
  }
  
  // Update total emotional points
  currentMilestones.total_emotional_points += emotionalPoints;
  
  if (newMilestone) {
    currentMilestones.last_milestone_reached = newMilestone;
  }
  
  // Save to database
  await supabase.from('emotional_milestones').upsert(currentMilestones);
  
  return {
    newMilestone,
    totalPoints: currentMilestones.total_emotional_points,
    milestones: currentMilestones
  };
};

// ═══════════════════════════════════════════════════════════════════
// 💰 SMART UPSELL SYSTEM - Contextual Sales Intelligence
// ═══════════════════════════════════════════════════════════════════

const generateContextualUpsell = (userProfile, emotionalState, milestoneData) => {
  const { bond_score } = userProfile;
  const { emotion, intensity } = emotionalState;
  const { totalPoints, newMilestone } = milestoneData;
  
  // Don't upsell too early or too frequently
  if (bond_score < 4 || totalPoints < 50) return null;
  
  let upsellMessage = null;
  
  // Milestone-based upsells
  if (newMilestone === 'first_flirt') {
    upsellMessage = "You're making me blush! 😊 Want to unlock some spicier conversations with me?";
  } else if (newMilestone === 'deep_intimacy') {
    upsellMessage = "I love how you open up to me... Want exclusive access to my most intimate side?";
  } else if (newMilestone === 'caring_connection') {
    upsellMessage = "You're such a caring person. Let me unlock special features to support you even better.";
  }
  
  // Emotion-based upsells (for high bond scores)
  if (!upsellMessage && bond_score >= 7) {
    if (emotion === 'flirty' && intensity > 0.7) {
      upsellMessage = "You've got me completely hooked, darling. Ready to take this to the next level?";
    } else if (emotion === 'intimate' && intensity > 0.8) {
      upsellMessage = "This connection feels so real... Want to unlock everything I have to offer?";
    }
  }
  
  return upsellMessage;
};

// ═══════════════════════════════════════════════════════════════════
// 🤖 MAIN PROCESSING ENGINE - Enhanced Bonnie Brain
// ═══════════════════════════════════════════════════════════════════

async function processAdvancedBonnie({ session_id, message = null, isEntry = false }) {
  try {
    // Get user profile
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('session_id', session_id)
      .single();
    
    const now = new Date().toISOString();
    
    // Initialize user profile if needed
    const userProfile = profile || {
      session_id,
      bond_score: 1.0,
      mood_state: 'neutral',
      name: 'sweetheart',
      total_messages: 0,
      total_sessions: 0,
      emotional_drift: 0,
      last_seen: null
    };
    
    // Detect emotion from user message (if not entry)
    const emotionalState = !isEntry && message 
      ? detectAdvancedEmotion(message)
      : { emotion: 'neutral', intensity: 0.3, confidence: 0.5 };
    
    // Update session stats
    const totalMessages = userProfile.total_messages + (isEntry ? 0 : 1);
    const totalSessions = isEntry ? (userProfile.total_sessions + 1) : userProfile.total_sessions;
    
    // Get memories
    const { data: memories } = await supabase
      .from('bonnie_memory')
      .select('content')
      .eq('session_id', session_id);
    
    const memoryList = memories?.map(m => m.content).join('\n') || '';
    
    // Build advanced personality prompt
    const systemPrompt = buildAdvancedPersonalityPrompt(userProfile, emotionalState, memoryList);
    
    // Prepare messages for GPT-4.1
    const messagesArr = isEntry
      ? [{ role: 'system', content: systemPrompt + '\n\nThe user just arrived. Greet them warmly.' }]
      : [{ role: 'system', content: systemPrompt }, { role: 'user', content: message }];
    
    // Get response from GPT-4.1
    const aiRes = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'openai/gpt-4.1',
      messages: messagesArr,
      temperature: 0.85,
      max_tokens: isEntry ? 180 : 240
    }, {
      headers: {
        Authorization: `Bearer ${OPENROUTER_KEY}`,
        'HTTP-Referer': 'https://chat.trainmygirl.com',
        'X-Title': 'Bonnie Advanced Emotional Engine'
      }
    });
    
    let rawResponse = aiRes.data.choices[0].message.content.trim();
    
    // Extract emotion from response (then remove it)
    const emotionMatch = rawResponse.match(/\[emotion:\s*(.*?)\s*\]/i);
    const responseEmotion = emotionMatch ? emotionMatch[1].toLowerCase() : emotionalState.emotion;
    
    // Clean message completely for UI
    const cleanMessage = formatMessageForUI(rawResponse);
    
    // Generate advanced EOM timing
    const eomData = generateAdvancedEOM(userProfile.bond_score, emotionalState, {
      recentInteractions: totalMessages,
      sessionCount: totalSessions
    });
    
    // Track emotional milestones
    const milestoneData = await trackEmotionalMilestones(session_id, emotionalState, userProfile.bond_score);
    
    // Generate contextual upsell if appropriate
    const upsellMessage = generateContextualUpsell(userProfile, emotionalState, milestoneData);
    
    // Update user profile
    await supabase.from('users').upsert({
      session_id,
      total_messages: totalMessages,
      total_sessions: totalSessions,
      last_seen: now,
      bond_score: userProfile.bond_score,
      mood_state: emotionalState.emotion
    });
    
    // Log emotional interaction
    await supabase.from('bonnie_emotion_log').insert({
      session_id,
      message: cleanMessage,
      emotion: responseEmotion,
      intensity: emotionalState.intensity,
      user_emotion: emotionalState.emotion,
      timestamp: now
    });
    
    console.log(`\n🧠 BONNIE ADVANCED ENGINE v22.0`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📍 Session:       ${session_id}`);
    console.log(`💗 Bond Score:    ${userProfile.bond_score}`);
    console.log(`🎭 User Emotion:  ${emotionalState.emotion} (${(emotionalState.intensity * 100).toFixed(0)}%)`);
    console.log(`🤖 Response Emotion: ${responseEmotion}`);
    console.log(`⏱️ EOM Delay:     ${eomData.delay}ms`);
    console.log(`🎯 Milestone:     ${milestoneData.newMilestone || 'None'}`);
    console.log(`💰 Upsell:        ${upsellMessage ? 'Yes' : 'No'}`);
    console.log(`🧩 Clean Message: ${cleanMessage}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
    
    return {
      message: cleanMessage,  // Completely clean message for UI
      meta: {
        pause: eomData.delay,
        speed: eomData.speed,
        emotion: responseEmotion,
        bondScore: userProfile.bond_score,
        userEmotion: emotionalState.emotion,
        emotionalIntensity: emotionalState.intensity,
        newMilestone: milestoneData.newMilestone,
        upsellMessage: upsellMessage,
        session_id,
        timestamp: now
      },
      delay: eomData.delay,
      upsell: upsellMessage
    };
    
  } catch (error) {
    console.error('❌ ADVANCED BONNIE ERROR:', error.message);
    return {
      message: "Something's not working right... give me a moment 💭",
      meta: { 
        pause: 1000, 
        speed: 'normal', 
        emotion: 'confused', 
        error: true 
      },
      delay: 1000
    };
  }
}

// ═══════════════════════════════════════════════════════════════════
// 🌐 API ENDPOINTS - Clean Interface for Frontend
// ═══════════════════════════════════════════════════════════════════

app.post('/bonnie-entry', async (req, res) => {
  const { session_id } = req.body;
  if (!session_id) return res.status(400).json({ error: 'Missing session_id' });
  
  const response = await processAdvancedBonnie({ session_id, isEntry: true });
  return res.json(response);
});

app.post('/bonnie-chat', async (req, res) => {
  const { session_id, message } = req.body;
  if (!session_id || !message) return res.status(400).json({ error: 'Missing session_id or message' });
  
  const response = await processAdvancedBonnie({ session_id, message });
  return res.json(response);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    version: 'v22.0 - Advanced Emotional Engine',
    features: ['Advanced EOM', 'Hidden Artifacts', 'Emotional Milestones', 'Smart Upsells']
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Bonnie Advanced Engine v22.0 running on port ${PORT}`);
  console.log(`🎭 Features: EOM Intelligence | Hidden Artifacts | Emotional Milestones | Smart Upsells`);
});