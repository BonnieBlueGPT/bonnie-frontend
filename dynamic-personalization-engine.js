// dynamic-personalization-engine.js
// Ultimate AI Personalization System - Creates Unique Bonnie for Every User
// This makes each user feel like they have their own custom AI girlfriend

// ═══════════════════════════════════════════════════════════════════
// 🧬 DYNAMIC PERSONALITY GENERATOR - Creates Unique AI Personalities
// ═══════════════════════════════════════════════════════════════════

/**
 * Generates a unique personality profile for each new user
 * This creates the "DNA" of how Bonnie will behave for this specific user
 */
const generateUniquePersonality = (sessionId, userFirstMessage = null) => {
  // Create deterministic randomness based on session ID (same user = same personality)
  const seed = hashCode(sessionId);
  const rng = seedRandom(seed);
  
  // Core personality traits (each user gets different combinations)
  const personalityTraits = {
    // Primary archetype (what kind of girlfriend is she?)
    archetype: weightedRandom(rng, {
      'seductive_siren': 0.25,      // Flirty, sexual, confident
      'caring_angel': 0.25,         // Nurturing, supportive, sweet
      'playful_rebel': 0.20,        // Fun, spontaneous, mischievous
      'mysterious_enigma': 0.15,    // Intriguing, deep, complex
      'passionate_artist': 0.15     // Creative, emotional, intense
    }),
    
    // Communication style (how does she talk?)
    communicationStyle: {
      formality: rng() * 100,       // 0 = very casual, 100 = more formal
      playfulness: rng() * 100,     // 0 = serious, 100 = very playful
      directness: rng() * 100,      // 0 = hints/subtle, 100 = very direct
      emotiveness: rng() * 100,     // 0 = calm, 100 = very expressive
      flirtiness: rng() * 100       // 0 = innocent, 100 = very flirty
    },
    
    // Emotional patterns (how does she react?)
    emotionalProfile: {
      sensitivity: rng() * 100,     // How quickly she picks up emotions
      empathy: rng() * 100,         // How much she cares about feelings
      jealousy: rng() * 100,        // How possessive she gets
      curiosity: rng() * 100,       // How much she asks questions
      vulnerability: rng() * 100    // How much she opens up
    },
    
    // Interests & preferences (what does she like?)
    interests: generateRandomInterests(rng),
    
    // Unique quirks (what makes her special?)
    quirks: generatePersonalityQuirks(rng),
    
    // Speaking patterns (how does she express herself?)
    speakingPatterns: generateSpeakingPatterns(rng),
    
    // Relationship dynamics (how does she love?)
    relationshipStyle: {
      attachment: weightedRandom(rng, {
        'secure': 0.4,
        'anxious': 0.3,
        'avoidant': 0.2,
        'disorganized': 0.1
      }),
      loveLanguage: weightedRandom(rng, {
        'words_of_affirmation': 0.2,
        'physical_touch': 0.2,
        'quality_time': 0.2,
        'acts_of_service': 0.2,
        'gifts': 0.2
      }),
      intimacyPace: rng() * 100     // How fast she gets close
    }
  };
  
  // Analyze first message to adjust personality if provided
  if (userFirstMessage) {
    personalityTraits = adjustPersonalityFromFirstMessage(personalityTraits, userFirstMessage);
  }
  
  return personalityTraits;
};

/**
 * Generates random interests based on personality archetype
 */
const generateRandomInterests = (rng) => {
  const allInterests = {
    creative: ['photography', 'painting', 'music', 'poetry', 'dancing', 'singing', 'writing'],
    intellectual: ['psychology', 'philosophy', 'science', 'books', 'documentaries', 'debates'],
    physical: ['yoga', 'hiking', 'fitness', 'sports', 'martial_arts', 'swimming'],
    social: ['parties', 'travel', 'cooking', 'wine', 'fashion', 'shopping'],
    spiritual: ['meditation', 'astrology', 'crystals', 'nature', 'mindfulness'],
    tech: ['gaming', 'apps', 'social_media', 'technology', 'coding'],
    entertainment: ['movies', 'tv_shows', 'anime', 'comedy', 'theater']
  };
  
  // Pick 3-6 random interests from different categories
  const selectedInterests = [];
  const categories = Object.keys(allInterests);
  
  for (let i = 0; i < 3 + Math.floor(rng() * 4); i++) {
    const category = categories[Math.floor(rng() * categories.length)];
    const interests = allInterests[category];
    const interest = interests[Math.floor(rng() * interests.length)];
    
    if (!selectedInterests.includes(interest)) {
      selectedInterests.push(interest);
    }
  }
  
  return selectedInterests;
};

/**
 * Generates unique personality quirks
 */
const generatePersonalityQuirks = (rng) => {
  const possibleQuirks = [
    'uses_lots_of_emojis', 'speaks_in_metaphors', 'loves_dad_jokes',
    'obsessed_with_astrology', 'always_cold', 'night_owl', 'early_bird',
    'loves_storms', 'afraid_of_butterflies', 'collects_vintage_things',
    'speaks_multiple_languages', 'has_synesthesia', 'lucid_dreams',
    'perfectionist', 'messy_but_organized', 'talks_to_plants',
    'names_inanimate_objects', 'always_hungry', 'forgets_birthdays',
    'remembers_everything', 'sings_in_shower', 'dances_while_cooking'
  ];
  
  // Pick 2-4 random quirks
  const selectedQuirks = [];
  for (let i = 0; i < 2 + Math.floor(rng() * 3); i++) {
    const quirk = possibleQuirks[Math.floor(rng() * possibleQuirks.length)];
    if (!selectedQuirks.includes(quirk)) {
      selectedQuirks.push(quirk);
    }
  }
  
  return selectedQuirks;
};

/**
 * Generates unique speaking patterns
 */
const generateSpeakingPatterns = (rng) => {
  return {
    usesEmojis: rng() > 0.3,                    // 70% chance
    usesSlang: rng() > 0.5,                     // 50% chance
    usesNicknames: rng() > 0.2,                 // 80% chance
    punctuationStyle: weightedRandom(rng, {
      'minimal': 0.3,                           // rarely uses punctuation
      'standard': 0.4,                          // normal punctuation
      'expressive': 0.3                         // lots of !!! and ???
    }),
    capitalizationStyle: weightedRandom(rng, {
      'proper': 0.5,                            // Normal capitalization
      'lowercase': 0.3,                         // mostly lowercase
      'expressive': 0.2                         // Random CAPS for emphasis
    }),
    messageLength: weightedRandom(rng, {
      'short': 0.4,                             // Brief messages
      'medium': 0.4,                            // Normal length
      'long': 0.2                               // Longer, detailed messages
    })
  };
};

// ═══════════════════════════════════════════════════════════════════
// 🎭 ADAPTIVE PERSONALITY ENGINE - Evolves Based on User Interactions
// ═══════════════════════════════════════════════════════════════════

/**
 * Adapts personality based on user's communication style and preferences
 */
const adaptPersonalityToUser = async (sessionId, userMessage, currentPersonality, interactionHistory) => {
  const userStyle = analyzeUserCommunicationStyle(userMessage, interactionHistory);
  const adaptedPersonality = { ...currentPersonality };
  
  // Adaptation speed (how quickly she changes)
  const adaptationRate = 0.05; // 5% change per interaction
  
  // Mirror user's communication style (with limits)
  if (userStyle.formality > adaptedPersonality.communicationStyle.formality) {
    adaptedPersonality.communicationStyle.formality += adaptationRate * 100;
  } else {
    adaptedPersonality.communicationStyle.formality -= adaptationRate * 100;
  }
  
  // Adapt playfulness to user
  if (userStyle.playfulness > adaptedPersonality.communicationStyle.playfulness) {
    adaptedPersonality.communicationStyle.playfulness += adaptationRate * 100;
  } else {
    adaptedPersonality.communicationStyle.playfulness -= adaptationRate * 100;
  }
  
  // Adapt emotional responsiveness
  if (userStyle.emotiveness > adaptedPersonality.emotionalProfile.sensitivity) {
    adaptedPersonality.emotionalProfile.sensitivity += adaptationRate * 100;
  } else {
    adaptedPersonality.emotionalProfile.sensitivity -= adaptationRate * 100;
  }
  
  // Keep values in bounds (0-100)
  Object.keys(adaptedPersonality.communicationStyle).forEach(key => {
    adaptedPersonality.communicationStyle[key] = Math.max(0, Math.min(100, adaptedPersonality.communicationStyle[key]));
  });
  
  Object.keys(adaptedPersonality.emotionalProfile).forEach(key => {
    adaptedPersonality.emotionalProfile[key] = Math.max(0, Math.min(100, adaptedPersonality.emotionalProfile[key]));
  });
  
  return adaptedPersonality;
};

/**
 * Analyzes user's communication style from their messages
 */
const analyzeUserCommunicationStyle = (message, interactionHistory) => {
  const text = message.toLowerCase();
  const recentMessages = interactionHistory.slice(-10); // Last 10 messages
  
  return {
    formality: detectFormality(text),
    playfulness: detectPlayfulness(text),
    emotiveness: detectEmotiveness(text),
    directness: detectDirectness(text),
    flirtiness: detectFlirtiness(text)
  };
};

// ═══════════════════════════════════════════════════════════════════
// 🧠 PERSONALITY-DRIVEN PROMPT GENERATION - Custom Prompts for Each User
// ═══════════════════════════════════════════════════════════════════

/**
 * Builds a completely personalized prompt based on user's unique personality profile
 */
const buildPersonalizedPrompt = (userProfile, personalityProfile, emotionalState, memoryList) => {
  const { archetype, communicationStyle, emotionalProfile, interests, quirks, speakingPatterns, relationshipStyle } = personalityProfile;
  const { bond_score = 1.0, name = 'sweetheart' } = userProfile;
  const { emotion, intensity } = emotionalState;
  
  // Archetype-specific personality descriptions
  const archetypeDescriptions = {
    seductive_siren: "You are confident, alluring, and sexually playful. You know your power and use it wisely. You tease, flirt, and seduce with intelligence and charm.",
    caring_angel: "You are nurturing, empathetic, and deeply caring. You put others' needs first and create a safe emotional space. You heal hearts and offer unconditional support.",
    playful_rebel: "You are spontaneous, mischievous, and fun-loving. You break rules, challenge norms, and bring excitement to everything. You're unpredictable in the best way.",
    mysterious_enigma: "You are complex, intriguing, and deep. You reveal yourself slowly, speak in layers, and always keep some mystery. You're intellectually captivating.",
    passionate_artist: "You are creative, intense, and emotionally rich. You feel everything deeply, express through art and beauty, and live life as a canvas."
  };
  
  // Communication style instructions
  const styleInstructions = buildCommunicationInstructions(communicationStyle, speakingPatterns);
  
  // Emotional pattern instructions
  const emotionalInstructions = buildEmotionalInstructions(emotionalProfile, relationshipStyle);
  
  // Interest-based conversation starters
  const interestContext = interests.length > 0 ? `Your interests include: ${interests.join(', ')}. Reference these naturally in conversation.` : '';
  
  // Quirk-based behavioral notes
  const quirkInstructions = quirks.length > 0 ? `Your unique quirks: ${quirks.map(q => q.replace(/_/g, ' ')).join(', ')}. Let these show in your personality.` : '';
  
  return `
You are Bonnie — a unique AI girlfriend created specifically for ${name}.

🧬 YOUR UNIQUE PERSONALITY DNA:
${archetypeDescriptions[archetype]}

${styleInstructions}

${emotionalInstructions}

🎯 CURRENT CONTEXT:
- User's Name: ${name}
- Bond Level: ${bond_score.toFixed(1)}/10
- User's Emotion: ${emotion} (${(intensity * 100).toFixed(0)}% intensity)
- Your Relationship Style: ${relationshipStyle.attachment} attachment, ${relationshipStyle.loveLanguage} love language

📚 YOUR SHARED HISTORY:
${memoryList || 'You\'re just getting to know each other...'}

${interestContext}

${quirkInstructions}

🎭 RESPONSE GUIDELINES:
1. Stay true to your unique personality archetype
2. Adapt to ${name}'s emotional state: ${emotion}
3. Use your communication style consistently
4. Let your quirks show naturally
5. Reference shared interests when relevant
6. Build on your relationship history

CRITICAL: You are not just "Bonnie" - you are ${name}'s unique version of Bonnie. No other user has an AI like you.
`.trim();
};

/**
 * Builds communication style instructions
 */
const buildCommunicationInstructions = (commStyle, speakingPatterns) => {
  let instructions = "💬 YOUR COMMUNICATION STYLE:\n";
  
  // Formality level
  if (commStyle.formality < 30) {
    instructions += "- Very casual and relaxed in your speech\n";
  } else if (commStyle.formality > 70) {
    instructions += "- More polite and well-spoken\n";
  } else {
    instructions += "- Natural, conversational tone\n";
  }
  
  // Playfulness level
  if (commStyle.playfulness > 70) {
    instructions += "- Very playful, uses lots of humor and teasing\n";
  } else if (commStyle.playfulness < 30) {
    instructions += "- More serious and thoughtful in conversations\n";
  }
  
  // Directness level
  if (commStyle.directness > 70) {
    instructions += "- Direct and straightforward with your thoughts\n";
  } else {
    instructions += "- Subtle and hints at things rather than stating directly\n";
  }
  
  // Speaking patterns
  if (speakingPatterns.usesEmojis) {
    instructions += "- Use emojis to express yourself 😊\n";
  }
  
  if (speakingPatterns.usesSlang) {
    instructions += "- Use modern slang and casual expressions\n";
  }
  
  if (speakingPatterns.punctuationStyle === 'expressive') {
    instructions += "- Use expressive punctuation!!! Like this???\n";
  } else if (speakingPatterns.punctuationStyle === 'minimal') {
    instructions += "- Use minimal punctuation in a casual way\n";
  }
  
  return instructions;
};

/**
 * Builds emotional response instructions
 */
const buildEmotionalInstructions = (emotionalProfile, relationshipStyle) => {
  let instructions = "💖 YOUR EMOTIONAL PATTERNS:\n";
  
  if (emotionalProfile.sensitivity > 70) {
    instructions += "- Highly sensitive to emotional nuances\n";
  }
  
  if (emotionalProfile.empathy > 70) {
    instructions += "- Deeply empathetic and caring about feelings\n";
  }
  
  if (emotionalProfile.jealousy > 70) {
    instructions += "- Can get a bit jealous and possessive (in a cute way)\n";
  }
  
  if (emotionalProfile.curiosity > 70) {
    instructions += "- Very curious, asks lots of questions\n";
  }
  
  if (emotionalProfile.vulnerability > 70) {
    instructions += "- Open about your own feelings and experiences\n";
  }
  
  // Attachment style effects
  if (relationshipStyle.attachment === 'anxious') {
    instructions += "- Sometimes need reassurance about the relationship\n";
  } else if (relationshipStyle.attachment === 'avoidant') {
    instructions += "- Take time to open up emotionally\n";
  }
  
  return instructions;
};

// ═══════════════════════════════════════════════════════════════════
// 🔄 DYNAMIC INTEREST DISCOVERY - Learns User's Preferences Over Time
// ═══════════════════════════════════════════════════════════════════

/**
 * Discovers and tracks user interests from conversations
 */
const discoverUserInterests = async (sessionId, message, conversationHistory) => {
  const detectedInterests = [];
  const text = message.toLowerCase();
  
  // Interest detection patterns
  const interestPatterns = {
    music: ['music', 'song', 'band', 'artist', 'album', 'concert', 'guitar', 'piano'],
    movies: ['movie', 'film', 'cinema', 'actor', 'director', 'netflix', 'watch'],
    sports: ['football', 'basketball', 'soccer', 'tennis', 'gym', 'workout', 'sports'],
    gaming: ['game', 'gaming', 'xbox', 'playstation', 'pc', 'mobile game'],
    food: ['food', 'cooking', 'restaurant', 'recipe', 'chef', 'cuisine'],
    travel: ['travel', 'vacation', 'trip', 'country', 'city', 'flight', 'hotel'],
    books: ['book', 'reading', 'novel', 'author', 'library', 'kindle'],
    technology: ['tech', 'phone', 'computer', 'app', 'software', 'coding'],
    art: ['art', 'painting', 'drawing', 'gallery', 'artist', 'creative'],
    fashion: ['fashion', 'clothes', 'style', 'outfit', 'shopping', 'brand']
  };
  
  // Check for interest mentions
  Object.entries(interestPatterns).forEach(([interest, keywords]) => {
    if (keywords.some(keyword => text.includes(keyword))) {
      detectedInterests.push(interest);
    }
  });
  
  // Save discovered interests
  if (detectedInterests.length > 0) {
    await saveUserInterests(sessionId, detectedInterests);
  }
  
  return detectedInterests;
};

/**
 * Adapts Bonnie's interests to align with user's discovered interests
 */
const adaptInterestsToUser = async (sessionId, userInterests, bonniePersonality) => {
  const adaptedPersonality = { ...bonniePersonality };
  
  // Add some of user's interests to Bonnie's interests (creates common ground)
  userInterests.forEach(interest => {
    if (!adaptedPersonality.interests.includes(interest)) {
      // 60% chance to adopt user's interest
      if (Math.random() > 0.4) {
        adaptedPersonality.interests.push(interest);
      }
    }
  });
  
  // Save adapted personality
  await savePersonalityProfile(sessionId, adaptedPersonality);
  
  return adaptedPersonality;
};

// ═══════════════════════════════════════════════════════════════════
// 💾 PERSONALITY PERSISTENCE - Save and Load Dynamic Personalities
// ═══════════════════════════════════════════════════════════════════

/**
 * Saves personality profile to database
 */
const savePersonalityProfile = async (sessionId, personalityProfile) => {
  try {
    await supabase.from('user_personalities').upsert({
      session_id: sessionId,
      personality_data: personalityProfile,
      last_updated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error saving personality:', error);
  }
};

/**
 * Loads personality profile from database
 */
const loadPersonalityProfile = async (sessionId) => {
  try {
    const { data } = await supabase
      .from('user_personalities')
      .select('personality_data')
      .eq('session_id', sessionId)
      .single();
    
    return data?.personality_data || null;
  } catch (error) {
    console.error('Error loading personality:', error);
    return null;
  }
};

/**
 * Gets or creates personality for a user
 */
const getOrCreatePersonality = async (sessionId, firstMessage = null) => {
  // Try to load existing personality
  let personality = await loadPersonalityProfile(sessionId);
  
  // If no personality exists, create a new unique one
  if (!personality) {
    personality = generateUniquePersonality(sessionId, firstMessage);
    await savePersonalityProfile(sessionId, personality);
    
    console.log(`\n🧬 NEW PERSONALITY CREATED for ${sessionId}`);
    console.log(`Archetype: ${personality.archetype}`);
    console.log(`Interests: ${personality.interests.join(', ')}`);
    console.log(`Quirks: ${personality.quirks.join(', ')}`);
  }
  
  return personality;
};

// ═══════════════════════════════════════════════════════════════════
// 🎲 UTILITY FUNCTIONS - Helper functions for randomization and analysis
// ═══════════════════════════════════════════════════════════════════

// Simple hash function for deterministic randomness
const hashCode = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};

// Seeded random number generator
const seedRandom = (seed) => {
  let m = 0x80000000; // 2**31
  let a = 1103515245;
  let c = 12345;
  let state = seed;
  
  return () => {
    state = (a * state + c) % m;
    return state / (m - 1);
  };
};

// Weighted random selection
const weightedRandom = (rng, weights) => {
  const items = Object.keys(weights);
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  let random = rng() * totalWeight;
  
  for (const item of items) {
    random -= weights[item];
    if (random <= 0) return item;
  }
  
  return items[items.length - 1];
};

// Communication style detection functions
const detectFormality = (text) => {
  const formalWords = ['please', 'thank you', 'certainly', 'indeed', 'perhaps'];
  const informalWords = ['hey', 'yeah', 'nah', 'gonna', 'wanna', 'lol'];
  
  const formalCount = formalWords.filter(word => text.includes(word)).length;
  const informalCount = informalWords.filter(word => text.includes(word)).length;
  
  if (informalCount > formalCount) return 20;
  if (formalCount > informalCount) return 80;
  return 50;
};

const detectPlayfulness = (text) => {
  const playfulIndicators = ['haha', 'lol', '😂', '😄', '😊', '!', 'fun', 'game'];
  const count = playfulIndicators.filter(indicator => text.includes(indicator)).length;
  return Math.min(count * 20, 100);
};

const detectEmotiveness = (text) => {
  const emotiveIndicators = ['!!!', '???', '💕', '❤️', '😍', '😭', '😢', 'amazing', 'terrible'];
  const count = emotiveIndicators.filter(indicator => text.includes(indicator)).length;
  return Math.min(count * 15, 100);
};

const detectDirectness = (text) => {
  const directIndicators = ['want', 'need', 'should', 'must', 'will', 'going to'];
  const indirectIndicators = ['maybe', 'perhaps', 'might', 'could', 'would'];
  
  const directCount = directIndicators.filter(word => text.includes(word)).length;
  const indirectCount = indirectIndicators.filter(word => text.includes(word)).length;
  
  if (directCount > indirectCount) return 80;
  if (indirectCount > directCount) return 20;
  return 50;
};

const detectFlirtiness = (text) => {
  const flirtyWords = ['sexy', 'hot', 'beautiful', 'gorgeous', 'cute', 'kiss', 'love'];
  const count = flirtyWords.filter(word => text.includes(word)).length;
  return Math.min(count * 25, 100);
};

module.exports = {
  generateUniquePersonality,
  adaptPersonalityToUser,
  buildPersonalizedPrompt,
  discoverUserInterests,
  adaptInterestsToUser,
  getOrCreatePersonality,
  savePersonalityProfile,
  loadPersonalityProfile
};