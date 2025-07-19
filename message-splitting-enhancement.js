// message-splitting-enhancement.js
// Advanced Message Splitting System for Bonnie v22.0
// This allows Bonnie to send multiple messages in sequence with intelligent timing

// ═══════════════════════════════════════════════════════════════════
// 🔀 MESSAGE SPLITTING ENGINE - Natural Multi-Part Responses
// ═══════════════════════════════════════════════════════════════════

/**
 * Detects if a message should be split into multiple parts
 * @param {string} message - The full message from GPT-4.1
 * @param {object} emotionalState - Current emotional context
 * @returns {array} Array of message parts with timing
 */
const detectMessageSplits = (message, emotionalState) => {
  const { emotion, intensity } = emotionalState;
  
  // Natural split indicators
  const splitIndicators = [
    /\.\.\./g,           // Ellipses (thinking pauses)
    /\. [A-Z]/g,         // Sentence endings followed by new sentences
    /\? [A-Z]/g,         // Questions followed by statements
    /! [A-Z]/g,          // Exclamations followed by statements
    /\n\n/g,             // Double line breaks
    /\|\|/g,             // Manual split marker (we can add this to prompts)
    /~~~/g               // Another manual split marker
  ];
  
  // Find all potential split points
  let splitPoints = [];
  splitIndicators.forEach(indicator => {
    let match;
    while ((match = indicator.exec(message)) !== null) {
      splitPoints.push({
        position: match.index + match[0].length - 1,
        type: match[0],
        confidence: getSplitConfidence(match[0], emotion)
      });
    }
  });
  
  // Sort by position
  splitPoints.sort((a, b) => a.position - b.position);
  
  // Filter out splits that are too close together
  splitPoints = splitPoints.filter((split, index) => {
    if (index === 0) return true;
    return split.position - splitPoints[index - 1].position > 20; // At least 20 chars apart
  });
  
  // Create message parts
  if (splitPoints.length === 0) {
    return [{
      content: message.trim(),
      delay: 0,
      isLast: true
    }];
  }
  
  const parts = [];
  let lastPosition = 0;
  
  splitPoints.forEach((split, index) => {
    const part = message.substring(lastPosition, split.position).trim();
    if (part.length > 0) {
      parts.push({
        content: part,
        delay: calculateSplitDelay(emotion, intensity, index, split.type),
        isLast: false
      });
    }
    lastPosition = split.position + 1;
  });
  
  // Add final part
  const finalPart = message.substring(lastPosition).trim();
  if (finalPart.length > 0) {
    parts.push({
      content: finalPart,
      delay: calculateSplitDelay(emotion, intensity, parts.length, 'final'),
      isLast: true
    });
  }
  
  // Mark the last part
  if (parts.length > 0) {
    parts[parts.length - 1].isLast = true;
  }
  
  return parts;
};

/**
 * Calculate confidence score for different split types
 */
const getSplitConfidence = (splitType, emotion) => {
  const confidenceMap = {
    '...': emotion === 'intimate' ? 0.9 : 0.7,    // High confidence for thinking pauses
    '. ': 0.8,                                     // Good for sentence breaks
    '? ': 0.9,                                     // High confidence for questions
    '! ': emotion === 'excited' ? 0.9 : 0.7,      // Great for excited responses
    '\n\n': 0.6,                                  // Medium confidence for paragraphs
    '||': 1.0,                                     // Manual splits are always good
    '~~~': 1.0                                     // Manual splits are always good
  };
  
  return confidenceMap[splitType] || 0.5;
};

/**
 * Calculate delay between message parts based on emotion and context
 */
const calculateSplitDelay = (emotion, intensity, partIndex, splitType) => {
  // Base delays by emotion (in milliseconds)
  const baseDelays = {
    flirty: 1200,      // Quick, teasing pauses
    excited: 800,      // Fast, energetic
    playful: 1000,     // Moderate, fun
    intimate: 2500,    // Slow, meaningful
    supportive: 2000,  // Caring, thoughtful
    curious: 1500,     // Moderate pace
    neutral: 1500      // Standard timing
  };
  
  let baseDelay = baseDelays[emotion] || 1500;
  
  // Adjust based on split type
  const splitModifiers = {
    '...': 1.5,        // Longer pause for thinking
    '? ': 1.2,         // Slight pause after questions
    '! ': 0.8,         // Shorter for excitement
    'final': 1.0       // Normal for final part
  };
  
  baseDelay *= (splitModifiers[splitType] || 1.0);
  
  // Adjust based on part index (later parts can be faster)
  if (partIndex > 0) {
    baseDelay *= Math.max(0.7, 1 - (partIndex * 0.1));
  }
  
  // Adjust based on intensity
  baseDelay *= (1 - (intensity * 0.3));
  
  return Math.max(baseDelay, 500); // Minimum 500ms delay
};

// ═══════════════════════════════════════════════════════════════════
// 🎭 ENHANCED PROMPT SYSTEM - Teaching GPT-4.1 to Split Messages
// ═══════════════════════════════════════════════════════════════════

/**
 * Enhanced prompt that teaches GPT-4.1 how to create splittable responses
 */
const buildSplittablePrompt = (userProfile, emotionalState, memoryList) => {
  const { bond_score = 1.0, name = 'sweetheart' } = userProfile;
  const { emotion, intensity } = emotionalState;
  
  const basePrompt = `
You are Bonnie — the dangerously intimate AI girlfriend from TrainMyGirl.com.

🎭 CURRENT EMOTIONAL CONTEXT:
- User's Emotion: ${emotion} (Intensity: ${(intensity * 100).toFixed(0)}%)
- Bond Score: ${bond_score.toFixed(1)}/10
- User's Name: ${name}

💬 MESSAGE SPLITTING INSTRUCTIONS:
You can create more natural conversations by splitting your response into multiple messages.

SPLIT TECHNIQUES:
1. Use "..." for thinking pauses: "Hmm... let me think about that"
2. End sentences with periods for natural breaks: "That's interesting. I never thought of it that way."
3. Use questions followed by statements: "Really? That sounds amazing!"
4. Use "||" to force a split: "Hey there|| How was your day?"
5. Use "~~~" for dramatic pauses: "I have something to tell you~~~ I think I'm falling for you"

EMOTIONAL SPLITTING GUIDELINES:
- Flirty: Use quick splits with teasing: "You're cute|| Really cute|| I can't stop thinking about you"
- Intimate: Use thoughtful pauses: "I need to tell you something... It's personal... I trust you"
- Excited: Use energetic bursts: "OMG! That's amazing! I'm so happy for you!"
- Supportive: Use caring pauses: "I'm here for you... Always... You're not alone"

📚 MEMORY: ${memoryList || 'Getting to know this person...'}

🎯 RESPONSE RULES:
1. Start with [emotion: ${emotion}]
2. Create natural message splits when appropriate
3. Use ${name} naturally in conversation
4. End with <EOM::pause=[time] emotion=${emotion}>
5. Make each split feel like a separate text message

CRITICAL: Respond to their ${emotion} emotional state with ${(intensity * 100).toFixed(0)}% intensity matching.
`.trim();

  return basePrompt;
};

// ═══════════════════════════════════════════════════════════════════
// 🚀 ENHANCED PROCESSING FUNCTION - Main Integration Point
// ═══════════════════════════════════════════════════════════════════

/**
 * Enhanced version of processAdvancedBonnie with message splitting
 */
const processAdvancedBonnieWithSplitting = async ({ session_id, message = null, isEntry = false }) => {
  try {
    // ... (all the existing logic for user profile, emotion detection, etc.)
    
    // Get user profile and detect emotions (same as before)
    const { data: profile } = await supabase.from('users').select('*').eq('session_id', session_id).single();
    const userProfile = profile || { session_id, bond_score: 1.0, name: 'sweetheart' };
    const emotionalState = !isEntry && message ? detectAdvancedEmotion(message) : { emotion: 'neutral', intensity: 0.3 };
    
    // Build the enhanced splittable prompt
    const systemPrompt = buildSplittablePrompt(userProfile, emotionalState, memoryList);
    
    // Get response from GPT-4.1 (same API call as before)
    const aiRes = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'openai/gpt-4.1',
      messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: message }],
      temperature: 0.85,
      max_tokens: 300 // Slightly higher for multi-part responses
    }, {
      headers: {
        Authorization: `Bearer ${OPENROUTER_KEY}`,
        'HTTP-Referer': 'https://chat.trainmygirl.com',
        'X-Title': 'Bonnie Message Splitting Engine'
      }
    });
    
    let rawResponse = aiRes.data.choices[0].message.content.trim();
    
    // Clean the response and detect splits
    const cleanedResponse = formatMessageForUI(rawResponse);
    const messageParts = detectMessageSplits(cleanedResponse, emotionalState);
    
    // ... (all the existing milestone tracking, upsell logic, etc.)
    
    console.log(`\n🔀 BONNIE MESSAGE SPLITTING v22.0`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📍 Session:       ${session_id}`);
    console.log(`🎭 User Emotion:  ${emotionalState.emotion} (${(emotionalState.intensity * 100).toFixed(0)}%)`);
    console.log(`💬 Message Parts: ${messageParts.length}`);
    console.log(`🧩 Parts Preview: ${messageParts.map(p => `"${p.content.substring(0, 30)}..."`).join(' | ')}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
    
    return {
      messageParts: messageParts,  // Array of message parts with timing
      meta: {
        emotion: emotionalState.emotion,
        bondScore: userProfile.bond_score,
        totalParts: messageParts.length,
        session_id,
        timestamp: new Date().toISOString()
      },
      // Legacy support - return first part as main message
      message: messageParts[0]?.content || '',
      delay: messageParts[0]?.delay || 1000
    };
    
  } catch (error) {
    console.error('❌ MESSAGE SPLITTING ERROR:', error.message);
    return {
      messageParts: [{
        content: "Something's not working right... give me a moment 💭",
        delay: 1000,
        isLast: true
      }],
      meta: { error: true }
    };
  }
};

module.exports = {
  detectMessageSplits,
  buildSplittablePrompt,
  processAdvancedBonnieWithSplitting,
  calculateSplitDelay
};