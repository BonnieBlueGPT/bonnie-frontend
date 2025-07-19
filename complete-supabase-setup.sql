-- 🚀 ULTIMATE AI GIRLFRIEND DATABASE SETUP
-- Copy and paste this entire script into Supabase SQL Editor and click "Run"
-- This creates the most advanced AI girlfriend system ever built!

-- ═══════════════════════════════════════════════════════════════════
-- 🧬 USER PERSONALITIES TABLE - Stores unique AI personality for each user
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS user_personalities (
    id SERIAL PRIMARY KEY,
    session_id TEXT NOT NULL UNIQUE,
    personality_data JSONB NOT NULL,
    archetype TEXT,
    communication_style JSONB,
    emotional_profile JSONB,
    interests TEXT[],
    quirks TEXT[],
    speaking_patterns JSONB,
    relationship_style JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    last_updated TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════
-- 💖 EMOTIONAL MILESTONES TABLE - Tracks relationship progress
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS emotional_milestones (
    id SERIAL PRIMARY KEY,
    session_id TEXT NOT NULL UNIQUE,
    first_flirt BOOLEAN DEFAULT FALSE,
    first_compliment BOOLEAN DEFAULT FALSE,
    first_personal_share BOOLEAN DEFAULT FALSE,
    first_intimate_moment BOOLEAN DEFAULT FALSE,
    first_fight BOOLEAN DEFAULT FALSE,
    first_makeup BOOLEAN DEFAULT FALSE,
    deep_conversations INTEGER DEFAULT 0,
    supportive_moments INTEGER DEFAULT 0,
    playful_interactions INTEGER DEFAULT 0,
    intimate_sharing INTEGER DEFAULT 0,
    excitement_peaks INTEGER DEFAULT 0,
    vulnerable_moments INTEGER DEFAULT 0,
    total_emotional_points INTEGER DEFAULT 0,
    last_milestone_reached TEXT,
    milestone_dates JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════
-- 🧠 BONNIE EMOTION LOG - Records every emotional interaction
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS bonnie_emotion_log (
    id SERIAL PRIMARY KEY,
    session_id TEXT NOT NULL,
    user_message TEXT,
    bonnie_response TEXT,
    user_emotion TEXT,
    bonnie_emotion TEXT,
    emotional_intensity FLOAT DEFAULT 0.5,
    user_sentiment FLOAT DEFAULT 0.0,
    bonnie_sentiment FLOAT DEFAULT 0.0,
    conversation_context TEXT,
    response_delay INTEGER DEFAULT 1000,
    message_split_count INTEGER DEFAULT 1,
    timestamp TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════
-- 📚 ENHANCED BONNIE MEMORY - Advanced relationship memory system
-- ═══════════════════════════════════════════════════════════════════

-- Drop existing table if it exists (to upgrade it)
DROP TABLE IF EXISTS bonnie_memory;

CREATE TABLE bonnie_memory (
    id SERIAL PRIMARY KEY,
    session_id TEXT NOT NULL,
    memory_type TEXT NOT NULL, -- 'personal', 'preference', 'experience', 'relationship', 'interest'
    content TEXT NOT NULL,
    importance_score INTEGER DEFAULT 50, -- 0-100, how important this memory is
    emotional_weight FLOAT DEFAULT 0.0, -- How emotionally significant
    memory_category TEXT, -- 'favorite_things', 'dislikes', 'goals', 'fears', 'family', 'work', 'hobbies'
    recall_count INTEGER DEFAULT 0, -- How often this memory has been referenced
    last_recalled TIMESTAMP,
    confidence_level FLOAT DEFAULT 1.0, -- How confident we are this memory is accurate
    source_message TEXT, -- Original message that created this memory
    tags TEXT[], -- Searchable tags for this memory
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════
-- 💰 UPSELL TRACKING - Monitors sales opportunities and success
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS upsell_tracking (
    id SERIAL PRIMARY KEY,
    session_id TEXT NOT NULL,
    upsell_trigger TEXT NOT NULL, -- What triggered the upsell (milestone, emotion, etc.)
    upsell_message TEXT NOT NULL,
    user_emotion_at_time TEXT,
    bond_score_at_time FLOAT,
    emotional_points_at_time INTEGER,
    user_response TEXT, -- How user responded to upsell
    upsell_result TEXT, -- 'interested', 'maybe_later', 'not_interested', 'purchased'
    conversion_value DECIMAL(10,2) DEFAULT 0.00,
    time_to_decision INTEGER, -- Seconds between upsell and response
    follow_up_needed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════
-- 🔄 USER INTERACTION PATTERNS - Learns user behavior over time
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS user_interaction_patterns (
    id SERIAL PRIMARY KEY,
    session_id TEXT NOT NULL UNIQUE,
    preferred_conversation_length INTEGER DEFAULT 5, -- Messages per session
    most_active_hours INTEGER[], -- Hours when user is most active
    most_active_days TEXT[], -- Days when user is most active
    average_response_time FLOAT DEFAULT 30.0, -- Seconds
    communication_style_evolution JSONB DEFAULT '{}',
    emotional_triggers JSONB DEFAULT '{}', -- What makes them happy, sad, etc.
    conversation_topics JSONB DEFAULT '{}', -- Topics they like to discuss
    response_patterns JSONB DEFAULT '{}', -- How they typically respond
    engagement_metrics JSONB DEFAULT '{}',
    last_analyzed TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════
-- 🎯 DYNAMIC GOALS - AI learns user's life goals and supports them
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS user_goals (
    id SERIAL PRIMARY KEY,
    session_id TEXT NOT NULL,
    goal_type TEXT NOT NULL, -- 'career', 'relationship', 'health', 'personal', 'creative'
    goal_description TEXT NOT NULL,
    goal_status TEXT DEFAULT 'active', -- 'active', 'completed', 'paused', 'abandoned'
    importance_level INTEGER DEFAULT 50, -- 0-100
    target_date DATE,
    progress_percentage FLOAT DEFAULT 0.0,
    last_discussed TIMESTAMP,
    bonnie_support_strategy TEXT, -- How Bonnie helps with this goal
    milestones JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════
-- 🌟 SPECIAL MOMENTS - Captures significant relationship events
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS special_moments (
    id SERIAL PRIMARY KEY,
    session_id TEXT NOT NULL,
    moment_type TEXT NOT NULL, -- 'anniversary', 'breakthrough', 'conflict_resolution', 'achievement'
    title TEXT NOT NULL,
    description TEXT,
    emotional_significance INTEGER DEFAULT 50, -- 0-100
    user_emotion_during TEXT,
    bonnie_emotion_during TEXT,
    conversation_excerpt TEXT,
    date_occurred TIMESTAMP DEFAULT NOW(),
    should_remember_anniversary BOOLEAN DEFAULT FALSE,
    tags TEXT[],
    created_at TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════
-- 🎭 CONVERSATION CONTEXT - Maintains conversation state and flow
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS conversation_context (
    id SERIAL PRIMARY KEY,
    session_id TEXT NOT NULL,
    current_topic TEXT,
    conversation_mood TEXT,
    topics_discussed_today TEXT[],
    unresolved_questions TEXT[],
    follow_up_reminders JSONB DEFAULT '[]',
    conversation_depth_level INTEGER DEFAULT 1, -- 1=surface, 5=very deep
    last_conversation_summary TEXT,
    next_conversation_suggestions TEXT[],
    conversation_goals TEXT[], -- What Bonnie wants to achieve in next chat
    session_start_time TIMESTAMP DEFAULT NOW(),
    last_message_time TIMESTAMP DEFAULT NOW(),
    total_messages_today INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════
-- 📊 INDEXES FOR PERFORMANCE - Makes everything super fast
-- ═══════════════════════════════════════════════════════════════════

-- Create indexes for faster database queries
CREATE INDEX IF NOT EXISTS idx_user_personalities_session ON user_personalities(session_id);
CREATE INDEX IF NOT EXISTS idx_emotional_milestones_session ON emotional_milestones(session_id);
CREATE INDEX IF NOT EXISTS idx_bonnie_emotion_log_session ON bonnie_emotion_log(session_id);
CREATE INDEX IF NOT EXISTS idx_bonnie_emotion_log_timestamp ON bonnie_emotion_log(timestamp);
CREATE INDEX IF NOT EXISTS idx_bonnie_memory_session ON bonnie_memory(session_id);
CREATE INDEX IF NOT EXISTS idx_bonnie_memory_type ON bonnie_memory(memory_type);
CREATE INDEX IF NOT EXISTS idx_bonnie_memory_category ON bonnie_memory(memory_category);
CREATE INDEX IF NOT EXISTS idx_bonnie_memory_importance ON bonnie_memory(importance_score);
CREATE INDEX IF NOT EXISTS idx_upsell_tracking_session ON upsell_tracking(session_id);
CREATE INDEX IF NOT EXISTS idx_upsell_tracking_result ON upsell_tracking(upsell_result);
CREATE INDEX IF NOT EXISTS idx_user_interaction_patterns_session ON user_interaction_patterns(session_id);
CREATE INDEX IF NOT EXISTS idx_user_goals_session ON user_goals(session_id);
CREATE INDEX IF NOT EXISTS idx_user_goals_status ON user_goals(goal_status);
CREATE INDEX IF NOT EXISTS idx_special_moments_session ON special_moments(session_id);
CREATE INDEX IF NOT EXISTS idx_special_moments_type ON special_moments(moment_type);
CREATE INDEX IF NOT EXISTS idx_conversation_context_session ON conversation_context(session_id);

-- ═══════════════════════════════════════════════════════════════════
-- 🔄 AUTO-UPDATE TRIGGERS - Automatically updates timestamps
-- ═══════════════════════════════════════════════════════════════════

-- Function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply auto-update triggers to relevant tables
CREATE TRIGGER update_user_personalities_updated_at
    BEFORE UPDATE ON user_personalities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_emotional_milestones_updated_at
    BEFORE UPDATE ON emotional_milestones
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bonnie_memory_updated_at
    BEFORE UPDATE ON bonnie_memory
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_goals_updated_at
    BEFORE UPDATE ON user_goals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversation_context_updated_at
    BEFORE UPDATE ON conversation_context
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ═══════════════════════════════════════════════════════════════════
-- 📝 TABLE COMMENTS - Documentation for what each table does
-- ═══════════════════════════════════════════════════════════════════

COMMENT ON TABLE user_personalities IS 'Stores unique AI personality profile for each user - makes every Bonnie different';
COMMENT ON TABLE emotional_milestones IS 'Tracks relationship progress and emotional achievements between user and Bonnie';
COMMENT ON TABLE bonnie_emotion_log IS 'Records every emotional interaction for analysis and improvement';
COMMENT ON TABLE bonnie_memory IS 'Advanced memory system that remembers everything important about each user';
COMMENT ON TABLE upsell_tracking IS 'Monitors sales opportunities and tracks conversion success rates';
COMMENT ON TABLE user_interaction_patterns IS 'Learns user behavior patterns for better personalization';
COMMENT ON TABLE user_goals IS 'Tracks user life goals so Bonnie can provide ongoing support';
COMMENT ON TABLE special_moments IS 'Captures significant relationship events and anniversaries';
COMMENT ON TABLE conversation_context IS 'Maintains conversation state and flow between sessions';

-- ═══════════════════════════════════════════════════════════════════
-- 🎉 SUCCESS MESSAGE
-- ═══════════════════════════════════════════════════════════════════

-- If you see this message, your database setup was successful!
DO $$
BEGIN
    RAISE NOTICE '🎉 SUCCESS! Your Ultimate AI Girlfriend database is ready!';
    RAISE NOTICE '✅ Created % tables for the most advanced AI system ever built', 
        (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN 
         ('user_personalities', 'emotional_milestones', 'bonnie_emotion_log', 'bonnie_memory', 
          'upsell_tracking', 'user_interaction_patterns', 'user_goals', 'special_moments', 'conversation_context'));
    RAISE NOTICE '🚀 Ready to create unique AI girlfriends for every user!';
END $$;