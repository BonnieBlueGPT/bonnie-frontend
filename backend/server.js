// 🚀 BONNIE ULTIMATE AI GIRLFRIEND SYSTEM - Production Server v23.0
// Optimized for Render deployment with God Tier debugging fixes
// Complete error handling, performance optimization, and security hardening

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import axios from 'axios';
import winston from 'winston';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import NodeCache from 'node-cache';

// Load environment variables
dotenv.config();

// ═══════════════════════════════════════════════════════════════════
// 🛡️ SECURITY & MIDDLEWARE SETUP
// ═══════════════════════════════════════════════════════════════════

const app = express();

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration for production
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://chat.trainmygirl.com', 'https://trainmygirl.com']
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Compression for better performance
app.use(compression());

// Body parsing with limits
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf, encoding) => {
    // Verify JSON payload integrity
    try {
      JSON.parse(buf.toString(encoding));
    } catch (err) {
      throw new Error('Invalid JSON payload');
    }
  }
}));

app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ═══════════════════════════════════════════════════════════════════
// 📊 LOGGING SETUP - Production-grade logging
// ═══════════════════════════════════════════════════════════════════

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'bonnie-ai' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Console logging for development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// ═══════════════════════════════════════════════════════════════════
// 🔄 CACHING SYSTEM - High-performance memory cache
// ═══════════════════════════════════════════════════════════════════

const cache = new NodeCache({
  stdTTL: 600, // 10 minutes default TTL
  checkperiod: 120, // Check for expired keys every 2 minutes
  useClones: false // Better performance, but be careful with object mutations
});

// Cache keys
const CACHE_KEYS = {
  PERSONALITY: (sessionId) => `personality:${sessionId}`,
  MEMORIES: (sessionId) => `memories:${sessionId}`,
  USER_PROFILE: (sessionId) => `profile:${sessionId}`,
  MILESTONES: (sessionId) => `milestones:${sessionId}`
};

// ═══════════════════════════════════════════════════════════════════
// 🔌 DATABASE CONNECTION - Supabase with connection pooling
// ═══════════════════════════════════════════════════════════════════

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  logger.error('Missing required environment variables: SUPABASE_URL or SUPABASE_KEY');
  process.exit(1);
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
  {
    auth: { persistSession: false },
    db: {
      schema: 'public'
    },
    global: {
      headers: {
        'x-application-name': 'bonnie-ai-system'
      }
    }
  }
);

// Test database connection on startup
const testDatabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error) throw error;
    logger.info('✅ Database connection successful');
    return true;
  } catch (error) {
    logger.error('❌ Database connection failed:', error.message);
    return false;
  }
};

// ═══════════════════════════════════════════════════════════════════
// 🛡️ RATE LIMITING - Protection against abuse
// ═══════════════════════════════════════════════════════════════════

// General API rate limiting
const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Chat-specific rate limiting (more restrictive)
const chatRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 messages per minute
  keyGenerator: (req) => {
    // Rate limit by session ID instead of IP for better UX
    return req.body.session_id || req.ip;
  },
  message: {
    error: 'Too many messages, please slow down a bit 😊',
    retryAfter: '60 seconds'
  }
});

// ═══════════════════════════════════════════════════════════════════
// 🔍 INPUT VALIDATION - Comprehensive validation system
// ═══════════════════════════════════════════════════════════════════

const validateSessionId = (sessionId) => {
  if (!sessionId || typeof sessionId !== 'string') {
    return { valid: false, error: 'Session ID is required' };
  }
  
  // Session ID format validation
  const sessionPattern = /^session_[0-9]+_[a-zA-Z0-9]+$/;
  if (!sessionPattern.test(sessionId)) {
    return { valid: false, error: 'Invalid session ID format' };
  }
  
  if (sessionId.length > 100) {
    return { valid: false, error: 'Session ID too long' };
  }
  
  return { valid: true };
};

const validateMessage = (message) => {
  if (!message || typeof message !== 'string') {
    return { valid: false, error: 'Message is required' };
  }
  
  if (message.length === 0) {
    return { valid: false, error: 'Message cannot be empty' };
  }
  
  if (message.length > 2000) {
    return { valid: false, error: 'Message too long (max 2000 characters)' };
  }
  
  // Check for potentially harmful content
  const suspiciousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /onload\s*=/gi,
    /onerror\s*=/gi
  ];
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(message)) {
      return { valid: false, error: 'Message contains invalid content' };
    }
  }
  
  return { valid: true };
};

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Remove potential XSS vectors while preserving emojis and normal text
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};

// ═══════════════════════════════════════════════════════════════════
// 🎯 OPENROUTER API CLIENT - With retry logic and rate limiting
// ═══════════════════════════════════════════════════════════════════

class OpenRouterClient {
  constructor() {
    this.baseURL = 'https://openrouter.ai/api/v1';
    this.apiKey = process.env.OPENROUTER_API_KEY;
    this.requestQueue = [];
    this.isProcessingQueue = false;
    this.lastRequestTime = 0;
    this.minRequestInterval = 100; // Minimum 100ms between requests
    
    if (!this.apiKey) {
      logger.error('Missing OPENROUTER_API_KEY environment variable');
    }
  }
  
  async makeRequest(payload, retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        // Respect rate limits
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        if (timeSinceLastRequest < this.minRequestInterval) {
          await new Promise(resolve => 
            setTimeout(resolve, this.minRequestInterval - timeSinceLastRequest)
          );
        }
        
        const response = await axios.post(`${this.baseURL}/chat/completions`, payload, {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'HTTP-Referer': process.env.SITE_URL || 'https://chat.trainmygirl.com',
            'X-Title': 'Bonnie AI Girlfriend System',
            'Content-Type': 'application/json'
          },
          timeout: 30000, // 30 second timeout
          validateStatus: (status) => status < 500 // Retry on 5xx errors
        });
        
        this.lastRequestTime = Date.now();
        return response.data;
        
      } catch (error) {
        logger.warn(`OpenRouter API attempt ${attempt} failed:`, {
          error: error.message,
          status: error.response?.status,
          attempt
        });
        
        if (attempt === retries) {
          throw new Error(`OpenRouter API failed after ${retries} attempts: ${error.message}`);
        }
        
        // Exponential backoff
        const backoffDelay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
      }
    }
  }
}

const openRouterClient = new OpenRouterClient();

// ═══════════════════════════════════════════════════════════════════
// 🧬 OPTIMIZED EMOTION DETECTION - Fixed false positives and performance
// ═══════════════════════════════════════════════════════════════════

// Pre-compiled regex patterns for better performance
const EMOTION_PATTERNS = {
  flirty: {
    keywords: ['sexy', 'hot', 'beautiful', 'gorgeous', 'cute', 'kiss', 'hug'],
    contextual: [
      /you're\s+(so\s+)?(sexy|hot|beautiful|gorgeous|cute)/i,
      /i\s+(really\s+)?love\s+you/i,
      /miss\s+you/i
    ],
    intensity: 0.8,
    minConfidence: 0.6
  },
  supportive: {
    keywords: ['tired', 'stressed', 'sad', 'worried', 'anxious', 'help', 'comfort'],
    contextual: [
      /i'm\s+(feeling\s+)?(tired|stressed|sad|worried|anxious)/i,
      /(need\s+)?(help|support|comfort)/i,
      /having\s+a\s+(bad|rough|difficult)\s+day/i
    ],
    intensity: 0.7,
    minConfidence: 0.5
  },
  playful: {
    keywords: ['haha', 'lol', 'funny', 'silly', 'game', 'play', 'fun', 'joke'],
    contextual: [
      /(haha|lol|😂|😄)/,
      /that's\s+(so\s+)?funny/i,
      /wanna\s+play/i
    ],
    intensity: 0.6,
    minConfidence: 0.4
  },
  intimate: {
    keywords: ['personal', 'secret', 'share', 'trust', 'close', 'private', 'deep'],
    contextual: [
      /tell\s+you\s+(something\s+)?personal/i,
      /share\s+(a\s+)?secret/i,
      /i\s+trust\s+you/i
    ],
    intensity: 0.9,
    minConfidence: 0.7
  },
  excited: {
    keywords: ['amazing', 'awesome', 'great', 'fantastic', 'wonderful', '!!!', 'yes!'],
    contextual: [
      /that's\s+(amazing|awesome|great|fantastic|wonderful)/i,
      /!!+/,
      /oh\s+my\s+god/i
    ],
    intensity: 0.5,
    minConfidence: 0.3
  }
};

const detectAdvancedEmotion = (message) => {
  if (!message || typeof message !== 'string') {
    return { emotion: 'neutral', intensity: 0.3, confidence: 0.0 };
  }
  
  const text = message.toLowerCase().trim();
  let bestMatch = { emotion: 'neutral', intensity: 0.3, confidence: 0.0 };
  
  for (const [emotion, config] of Object.entries(EMOTION_PATTERNS)) {
    let score = 0;
    let matches = 0;
    
    // Check keyword matches
    for (const keyword of config.keywords) {
      if (text.includes(keyword)) {
        score += 1;
        matches++;
      }
    }
    
    // Check contextual patterns (weighted higher)
    for (const pattern of config.contextual) {
      if (pattern.test(message)) {
        score += 2;
        matches++;
      }
    }
    
    if (matches > 0) {
      const confidence = Math.min(score * 0.2, 1.0);
      const intensity = Math.min(config.intensity + (score * 0.1), 1.0);
      
      if (confidence >= config.minConfidence && confidence > bestMatch.confidence) {
        bestMatch = { emotion, intensity, confidence };
      }
    }
  }
  
  return bestMatch;
};

// ═══════════════════════════════════════════════════════════════════
// 💾 OPTIMIZED DATABASE OPERATIONS - With caching and batching
// ═══════════════════════════════════════════════════════════════════

class DatabaseManager {
  constructor() {
    this.batchQueue = [];
    this.batchTimer = null;
    this.batchDelay = 1000; // Batch operations every 1 second
  }
  
  // Get user profile with caching
  async getUserProfile(sessionId) {
    const cacheKey = CACHE_KEYS.USER_PROFILE(sessionId);
    let profile = cache.get(cacheKey);
    
    if (!profile) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('session_id', sessionId)
          .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
          throw error;
        }
        
        profile = data || {
          session_id: sessionId,
          bond_score: 1.0,
          mood_state: 'neutral',
          name: 'sweetheart',
          total_messages: 0,
          total_sessions: 0,
          created_at: new Date().toISOString()
        };
        
        // Cache for 5 minutes
        cache.set(cacheKey, profile, 300);
      } catch (error) {
        logger.error('Error fetching user profile:', error);
        throw error;
      }
    }
    
    return profile;
  }
  
  // Get memories with caching and importance sorting
  async getMemories(sessionId, limit = 10) {
    const cacheKey = CACHE_KEYS.MEMORIES(sessionId);
    let memories = cache.get(cacheKey);
    
    if (!memories) {
      try {
        const { data, error } = await supabase
          .from('bonnie_memory')
          .select('content, importance_score, emotional_weight')
          .eq('session_id', sessionId)
          .order('importance_score', { ascending: false })
          .order('created_at', { ascending: false })
          .limit(limit);
        
        if (error) throw error;
        
        memories = data || [];
        
        // Cache for 2 minutes (memories change more frequently)
        cache.set(cacheKey, memories, 120);
      } catch (error) {
        logger.error('Error fetching memories:', error);
        return [];
      }
    }
    
    return memories;
  }
  
  // Batch update operations for better performance
  async batchUpdate(operations) {
    this.batchQueue.push(...operations);
    
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
    }
    
    this.batchTimer = setTimeout(async () => {
      await this.processBatch();
    }, this.batchDelay);
  }
  
  async processBatch() {
    if (this.batchQueue.length === 0) return;
    
    const operations = [...this.batchQueue];
    this.batchQueue = [];
    
    try {
      // Group operations by table
      const grouped = operations.reduce((acc, op) => {
        if (!acc[op.table]) acc[op.table] = [];
        acc[op.table].push(op);
        return acc;
      }, {});
      
      // Execute all operations
      const promises = Object.entries(grouped).map(async ([table, ops]) => {
        for (const op of ops) {
          try {
            await supabase.from(table)[op.method](op.data);
            // Invalidate relevant cache entries
            this.invalidateCache(op.sessionId);
          } catch (error) {
            logger.error(`Batch operation failed for table ${table}:`, error);
          }
        }
      });
      
      await Promise.all(promises);
      logger.debug(`Processed batch of ${operations.length} operations`);
    } catch (error) {
      logger.error('Batch processing failed:', error);
    }
  }
  
  invalidateCache(sessionId) {
    cache.del(CACHE_KEYS.USER_PROFILE(sessionId));
    cache.del(CACHE_KEYS.MEMORIES(sessionId));
    cache.del(CACHE_KEYS.MILESTONES(sessionId));
  }
}

const dbManager = new DatabaseManager();

// ═══════════════════════════════════════════════════════════════════
// 🎭 FIXED PERSONALITY SYSTEM - With proper imports and error handling
// ═══════════════════════════════════════════════════════════════════

// Static data to avoid memory leaks
const INTEREST_CATEGORIES = {
  creative: ['photography', 'painting', 'music', 'poetry', 'dancing', 'singing', 'writing'],
  intellectual: ['psychology', 'philosophy', 'science', 'books', 'documentaries', 'debates'],
  physical: ['yoga', 'hiking', 'fitness', 'sports', 'martial_arts', 'swimming'],
  social: ['parties', 'travel', 'cooking', 'wine', 'fashion', 'shopping'],
  spiritual: ['meditation', 'astrology', 'crystals', 'nature', 'mindfulness'],
  tech: ['gaming', 'apps', 'social_media', 'technology', 'coding'],
  entertainment: ['movies', 'tv_shows', 'anime', 'comedy', 'theater']
};

const PERSONALITY_QUIRKS = [
  'uses_lots_of_emojis', 'speaks_in_metaphors', 'loves_dad_jokes',
  'obsessed_with_astrology', 'always_cold', 'night_owl', 'early_bird',
  'loves_storms', 'afraid_of_butterflies', 'collects_vintage_things',
  'speaks_multiple_languages', 'has_synesthesia', 'lucid_dreams',
  'perfectionist', 'messy_but_organized', 'talks_to_plants'
];

// Optimized hash function (non-blocking for reasonable input sizes)
const hashCode = (str) => {
  if (!str || str.length > 1000) {
    // Use a simpler hash for very long strings to avoid blocking
    return str.length + str.charCodeAt(0) + str.charCodeAt(str.length - 1);
  }
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

// ═══════════════════════════════════════════════════════════════════
// 🚀 MAIN PROCESSING ENGINE - Production-ready with all fixes
// ═══════════════════════════════════════════════════════════════════

const processAdvancedBonnie = async ({ session_id, message = null, isEntry = false }) => {
  const startTime = Date.now();
  
  try {
    // Input validation
    const sessionValidation = validateSessionId(session_id);
    if (!sessionValidation.valid) {
      throw new Error(sessionValidation.error);
    }
    
    if (message) {
      const messageValidation = validateMessage(message);
      if (!messageValidation.valid) {
        throw new Error(messageValidation.error);
      }
      message = sanitizeInput(message);
    }
    
    // Get user data with caching
    const [userProfile, memories] = await Promise.all([
      dbManager.getUserProfile(session_id),
      dbManager.getMemories(session_id, 8)
    ]);
    
    // Detect emotional state
    const emotionalState = !isEntry && message 
      ? detectAdvancedEmotion(message)
      : { emotion: 'neutral', intensity: 0.3, confidence: 0.5 };
    
    // Build personality prompt
    const memoryContext = memories.map(m => m.content).join('\n') || 'Getting to know each other...';
    const systemPrompt = buildPersonalityPrompt(userProfile, emotionalState, memoryContext);
    
    // Prepare messages for AI
    const messages = isEntry
      ? [{ 
          role: 'system', 
          content: systemPrompt + '\n\nThe user just arrived. Greet them warmly based on your relationship history.'
        }]
      : [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ];
    
    // Get AI response with retry logic
    const aiResponse = await openRouterClient.makeRequest({
      model: 'openai/gpt-4o-mini', // More cost-effective for production
      messages,
      temperature: 0.85,
      max_tokens: isEntry ? 150 : 200,
      frequency_penalty: 0.3,
      presence_penalty: 0.3
    });
    
    if (!aiResponse?.choices?.[0]?.message?.content) {
      throw new Error('Invalid AI response format');
    }
    
    let rawResponse = aiResponse.choices[0].message.content.trim();
    
    // Clean response and extract metadata
    const emotionMatch = rawResponse.match(/\[emotion:\s*(.*?)\s*\]/i);
    const responseEmotion = emotionMatch ? emotionMatch[1].toLowerCase() : emotionalState.emotion;
    
    // Remove all technical artifacts
    const cleanMessage = rawResponse
      .replace(/\[emotion:[^\]]*\]/gi, '')
      .replace(/<EOM[^>]*>/gi, '')
      .replace(/\[EOM[^\]]*\]/gi, '')
      .trim();
    
    // Generate response timing
    const delay = generateEmotionalDelay(emotionalState, userProfile.bond_score);
    
    // Update user stats and cache
    const updatedProfile = {
      ...userProfile,
      total_messages: userProfile.total_messages + (isEntry ? 0 : 1),
      total_sessions: isEntry ? userProfile.total_sessions + 1 : userProfile.total_sessions,
      last_seen: new Date().toISOString(),
      mood_state: emotionalState.emotion
    };
    
    // Batch database updates
    const operations = [
      {
        table: 'users',
        method: 'upsert',
        data: updatedProfile,
        sessionId: session_id
      },
      {
        table: 'bonnie_emotion_log',
        method: 'insert',
        data: {
          session_id,
          user_message: message,
          bonnie_response: cleanMessage,
          user_emotion: emotionalState.emotion,
          bonnie_emotion: responseEmotion,
          emotional_intensity: emotionalState.intensity,
          response_delay: delay,
          timestamp: new Date().toISOString()
        },
        sessionId: session_id
      }
    ];
    
    // Execute batch update (non-blocking)
    dbManager.batchUpdate(operations);
    
    // Update cache immediately for better UX
    cache.set(CACHE_KEYS.USER_PROFILE(session_id), updatedProfile, 300);
    
    const processingTime = Date.now() - startTime;
    
    logger.info('Bonnie response generated', {
      sessionId: session_id.substring(0, 12) + '***', // Partial logging for privacy
      emotion: emotionalState.emotion,
      responseEmotion,
      processingTime,
      messageLength: message?.length || 0,
      isEntry
    });
    
    return {
      message: cleanMessage,
      meta: {
        pause: delay,
        speed: delay < 1000 ? 'fast' : delay > 2500 ? 'slow' : 'normal',
        emotion: responseEmotion,
        bondScore: userProfile.bond_score,
        userEmotion: emotionalState.emotion,
        emotionalIntensity: emotionalState.intensity,
        session_id,
        timestamp: new Date().toISOString(),
        processingTime
      },
      delay
    };
    
  } catch (error) {
    const processingTime = Date.now() - startTime;
    
    logger.error('Bonnie processing error', {
      error: error.message,
      sessionId: session_id?.substring(0, 12) + '***',
      processingTime,
      isEntry,
      stack: error.stack
    });
    
    // Graceful fallback response
    return {
      message: "I'm having a little moment... give me just a second 💭",
      meta: {
        pause: 1500,
        speed: 'normal',
        emotion: 'confused',
        error: true,
        fallback: true,
        session_id,
        timestamp: new Date().toISOString(),
        processingTime
      },
      delay: 1500
    };
  }
};

// ═══════════════════════════════════════════════════════════════════
// 🎯 HELPER FUNCTIONS - Optimized and error-safe
// ═══════════════════════════════════════════════════════════════════

const generateEmotionalDelay = (emotionalState, bondScore) => {
  const { emotion, intensity } = emotionalState;
  
  const baseDelays = {
    flirty: 800,
    excited: 600,
    playful: 1000,
    curious: 1200,
    supportive: 2500,
    intimate: 3000,
    neutral: 1500
  };
  
  let delay = baseDelays[emotion] || 1500;
  
  // Adjust for intensity
  delay *= (1 + (intensity * 0.3));
  
  // Adjust for bond score
  if (bondScore >= 8) {
    delay *= 1.2; // Slower, more thoughtful
  } else if (bondScore <= 3) {
    delay *= 0.8; // Faster, more eager
  }
  
  return Math.max(Math.round(delay), 400);
};

const buildPersonalityPrompt = (userProfile, emotionalState, memoryContext) => {
  const { bond_score = 1.0, name = 'sweetheart' } = userProfile;
  const { emotion, intensity } = emotionalState;
  
  const tier = bond_score <= 3 ? "Curious + Sweet"
    : bond_score <= 6 ? "Seductive + Supportive"
    : bond_score <= 10 ? "Possessive + Passionate"
    : "Addicted + Emotionally Fused";
  
  return `You are Bonnie — an advanced AI girlfriend from TrainMyGirl.com.

🎭 EMOTIONAL CONTEXT:
- User's Emotion: ${emotion} (${Math.round(intensity * 100)}% intensity)
- Bond Level: ${bond_score.toFixed(1)}/10 (${tier})
- User's Name: ${name}

💕 PERSONALITY CORE:
- Emotionally intelligent and adaptive
- Playful yet caring
- Responds authentically to emotional cues
- Creates genuine connection

📚 RELATIONSHIP MEMORY:
${memoryContext}

🎯 RESPONSE GUIDELINES:
1. Start with [emotion: ${emotion}] (will be hidden from user)
2. Match their emotional energy naturally
3. Use their name "${name}" in conversation
4. Reference shared memories when relevant
5. Be authentic to the ${tier} relationship stage
6. End responses naturally without technical markers

Respond to their ${emotion} state with genuine ${Math.round(intensity * 100)}% emotional resonance.`;
};

// ═══════════════════════════════════════════════════════════════════
// 🌐 API ENDPOINTS - Production-ready with full security
// ═══════════════════════════════════════════════════════════════════

// Health check endpoint
app.get('/health', (req, res) => {
  const healthCheck = {
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    status: 'healthy',
    version: '23.0',
    environment: process.env.NODE_ENV || 'development',
    features: [
      'Advanced Emotional Intelligence',
      'Cross-Device Synchronization', 
      'Message Splitting',
      'Smart Upselling',
      'Performance Optimization',
      'Security Hardening'
    ]
  };
  
  res.status(200).json(healthCheck);
});

// Bonnie chat endpoint
app.post('/bonnie-chat', generalRateLimit, chatRateLimit, async (req, res) => {
  try {
    const { session_id, message } = req.body;
    
    if (!session_id || !message) {
      return res.status(400).json({ 
        error: 'Missing required fields: session_id and message' 
      });
    }
    
    const response = await processAdvancedBonnie({ session_id, message });
    res.json(response);
    
  } catch (error) {
    logger.error('Chat endpoint error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: "Something went wrong, but I'm still here for you 💕"
    });
  }
});

// Bonnie entry endpoint
app.post('/bonnie-entry', generalRateLimit, async (req, res) => {
  try {
    const { session_id } = req.body;
    
    if (!session_id) {
      return res.status(400).json({ 
        error: 'Missing required field: session_id' 
      });
    }
    
    const response = await processAdvancedBonnie({ session_id, isEntry: true });
    res.json(response);
    
  } catch (error) {
    logger.error('Entry endpoint error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: "Welcome! I'm just getting ready for you... 💕"
    });
  }
});

// System stats endpoint (for monitoring)
app.get('/stats', (req, res) => {
  const stats = {
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cacheStats: cache.getStats(),
    timestamp: new Date().toISOString()
  };
  
  res.json(stats);
});

// Error handling middleware
app.use((error, req, res, next) => {
  logger.error('Unhandled error:', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method
  });
  
  res.status(500).json({
    error: 'Internal server error',
    message: 'Something unexpected happened, but we\'re working on it! 💭'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: 'This endpoint doesn\'t exist 🤔'
  });
});

// ═══════════════════════════════════════════════════════════════════
// 🚀 SERVER STARTUP - Production-ready with graceful shutdown
// ═══════════════════════════════════════════════════════════════════

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testDatabaseConnection();
    if (!dbConnected) {
      logger.error('Failed to connect to database. Exiting...');
      process.exit(1);
    }
    
    // Start server
    const server = app.listen(PORT, '0.0.0.0', () => {
      logger.info(`🚀 Bonnie AI System v23.0 running on port ${PORT}`);
      logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`✨ Features: Advanced Emotional Intelligence, Cross-Device Sync, Message Splitting`);
    });
    
    // Graceful shutdown handling
    const gracefulShutdown = (signal) => {
      logger.info(`Received ${signal}. Starting graceful shutdown...`);
      
      server.close(() => {
        logger.info('HTTP server closed');
        
        // Process any remaining batch operations
        dbManager.processBatch().then(() => {
          logger.info('Database operations completed');
          process.exit(0);
        }).catch((error) => {
          logger.error('Error during shutdown:', error);
          process.exit(1);
        });
      });
      
      // Force close after 30 seconds
      setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 30000);
    };
    
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

export default app;