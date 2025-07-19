-- 🚀 BONNIE AI PRODUCTION DATABASE SCHEMA v24.0
-- Ultra-optimized with materialized views, denormalization, and advanced indexing
-- Execute this in your Supabase SQL editor

-- ═══════════════════════════════════════════════════════════════════
-- 🗄️ CORE TABLES - Enhanced with optimizations
-- ═══════════════════════════════════════════════════════════════════

-- Users table with enhanced fields
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE,
    password_hash TEXT,
    name TEXT DEFAULT 'sweetheart',
    bond_score NUMERIC(3,2) DEFAULT 1.0 CHECK (bond_score >= 0 AND bond_score <= 10),
    mood_state TEXT DEFAULT 'neutral',
    total_messages INTEGER DEFAULT 0,
    total_sessions INTEGER DEFAULT 0,
    subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium', 'vip')),
    age INTEGER CHECK (age >= 13 AND age <= 120),
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    timezone TEXT DEFAULT 'UTC',
    language TEXT DEFAULT 'en',
    
    -- Denormalized fields for faster queries
    last_emotion TEXT DEFAULT 'neutral',
    last_message_at TIMESTAMP WITH TIME ZONE,
    total_time_spent INTEGER DEFAULT 0, -- in seconds
    favorite_topics TEXT[] DEFAULT '{}',
    
    -- Indexing hints
    CONSTRAINT users_session_id_check CHECK (length(session_id) >= 10)
);

-- Conversation logs with enhanced emotional tracking
CREATE TABLE IF NOT EXISTS conversation_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES users(session_id) ON DELETE CASCADE,
    user_message TEXT,
    bonnie_response TEXT NOT NULL,
    emotion_detected TEXT DEFAULT 'neutral',
    emotion_confidence NUMERIC(3,2) DEFAULT 0.5,
    emotion_triggers TEXT[] DEFAULT '{}',
    mood_shift BOOLEAN DEFAULT false,
    bond_score NUMERIC(3,2),
    response_time INTEGER, -- in milliseconds
    ai_model TEXT DEFAULT 'gpt-4o-mini',
    processing_time INTEGER, -- in milliseconds
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Additional metadata
    message_length INTEGER,
    response_length INTEGER,
    contains_upsell BOOLEAN DEFAULT false,
    user_satisfaction INTEGER CHECK (user_satisfaction >= 1 AND user_satisfaction <= 5),
    
    -- Partition hint for large datasets
    created_date DATE DEFAULT CURRENT_DATE
);

-- Enhanced emotional milestones
CREATE TABLE IF NOT EXISTS emotional_milestones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES users(session_id) ON DELETE CASCADE,
    milestone_type TEXT NOT NULL,
    milestone_name TEXT NOT NULL,
    bond_score_achieved NUMERIC(3,2),
    unlock_message TEXT,
    achieved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_upsell_trigger BOOLEAN DEFAULT false,
    user_reaction TEXT, -- positive, neutral, negative
    
    CONSTRAINT unique_milestone_per_user UNIQUE (session_id, milestone_type, milestone_name)
);

-- Memory system with enhanced categorization
CREATE TABLE IF NOT EXISTS memories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES users(session_id) ON DELETE CASCADE,
    memory_type TEXT NOT NULL CHECK (memory_type IN ('fact', 'preference', 'experience', 'goal', 'emotion')),
    content TEXT NOT NULL,
    importance_score NUMERIC(3,2) DEFAULT 0.5 CHECK (importance_score >= 0 AND importance_score <= 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_referenced TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reference_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    
    -- Enhanced fields
    tags TEXT[] DEFAULT '{}',
    related_emotions TEXT[] DEFAULT '{}',
    context JSONB DEFAULT '{}',
    expires_at TIMESTAMP WITH TIME ZONE -- for temporary memories
);

-- ═══════════════════════════════════════════════════════════════════
-- 🚀 DENORMALIZED TABLES - For ultra-fast queries
-- ═══════════════════════════════════════════════════════════════════

-- Conversation context denormalized for instant access
CREATE TABLE IF NOT EXISTS conversation_context_denormalized (
    session_id TEXT PRIMARY KEY REFERENCES users(session_id) ON DELETE CASCADE,
    recent_messages JSONB DEFAULT '[]', -- Last 10 messages
    emotional_flow JSONB DEFAULT '[]', -- Last 10 emotions
    topics TEXT[] DEFAULT '{}', -- Current conversation topics
    memory_highlights JSONB DEFAULT '{}', -- Key memories for quick access
    relationship_stage TEXT DEFAULT 'getting_to_know',
    conversation_patterns JSONB DEFAULT '{}', -- User's communication patterns
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User analytics denormalized
CREATE TABLE IF NOT EXISTS user_analytics_denormalized (
    session_id TEXT PRIMARY KEY REFERENCES users(session_id) ON DELETE CASCADE,
    daily_message_count INTEGER DEFAULT 0,
    weekly_message_count INTEGER DEFAULT 0,
    monthly_message_count INTEGER DEFAULT 0,
    avg_response_time NUMERIC(8,2), -- in milliseconds
    most_common_emotions TEXT[] DEFAULT '{}',
    peak_activity_hours INTEGER[] DEFAULT '{}', -- 0-23
    conversation_streak INTEGER DEFAULT 0,
    last_activity_date DATE DEFAULT CURRENT_DATE,
    engagement_score NUMERIC(3,2) DEFAULT 0.5,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════
-- 📊 MATERIALIZED VIEWS - Pre-computed for performance
-- ═══════════════════════════════════════════════════════════════════

-- User profiles materialized view
CREATE MATERIALIZED VIEW IF NOT EXISTS user_profiles_materialized AS
SELECT 
    u.id,
    u.session_id,
    u.email,
    u.name,
    u.bond_score,
    u.mood_state,
    u.total_messages,
    u.total_sessions,
    u.subscription_tier,
    u.age,
    u.created_at,
    u.last_seen,
    u.preferences,
    u.last_emotion,
    u.last_message_at,
    u.total_time_spent,
    u.favorite_topics,
    
    -- Computed fields
    CASE 
        WHEN u.bond_score <= 3 THEN 'Sweet & Curious'
        WHEN u.bond_score <= 6 THEN 'Flirty & Supportive'  
        WHEN u.bond_score <= 10 THEN 'Intimate & Passionate'
        ELSE 'Deeply Connected'
    END as relationship_tier,
    
    -- Recent activity
    ua.engagement_score,
    ua.conversation_streak,
    ua.avg_response_time
    
FROM users u
LEFT JOIN user_analytics_denormalized ua ON u.session_id = ua.session_id
WHERE u.is_active = true;

-- Create unique index for materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_profiles_mat_session_id 
ON user_profiles_materialized (session_id);

-- Conversation insights materialized view
CREATE MATERIALIZED VIEW IF NOT EXISTS conversation_insights_materialized AS
SELECT 
    cl.session_id,
    COUNT(*) as total_conversations,
    AVG(cl.bond_score) as avg_bond_score,
    AVG(cl.emotion_confidence) as avg_emotion_confidence,
    AVG(cl.response_time) as avg_response_time,
    MODE() WITHIN GROUP (ORDER BY cl.emotion_detected) as most_common_emotion,
    
    -- Time-based insights
    COUNT(CASE WHEN cl.timestamp >= NOW() - INTERVAL '24 hours' THEN 1 END) as conversations_last_24h,
    COUNT(CASE WHEN cl.timestamp >= NOW() - INTERVAL '7 days' THEN 1 END) as conversations_last_week,
    COUNT(CASE WHEN cl.timestamp >= NOW() - INTERVAL '30 days' THEN 1 END) as conversations_last_month,
    
    -- Engagement metrics
    AVG(cl.message_length) as avg_user_message_length,
    AVG(cl.response_length) as avg_bonnie_response_length,
    COUNT(CASE WHEN cl.contains_upsell = true THEN 1 END) as upsell_opportunities,
    AVG(cl.user_satisfaction) as avg_satisfaction
    
FROM conversation_logs cl
GROUP BY cl.session_id;

-- ═══════════════════════════════════════════════════════════════════
-- 🔍 ADVANCED INDEXING - Performance optimization
-- ═══════════════════════════════════════════════════════════════════

-- Primary performance indexes
CREATE INDEX IF NOT EXISTS idx_users_session_id_active ON users (session_id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_users_email_active ON users (email) WHERE email IS NOT NULL AND is_active = true;
CREATE INDEX IF NOT EXISTS idx_users_bond_score ON users (bond_score DESC);
CREATE INDEX IF NOT EXISTS idx_users_last_seen ON users (last_seen DESC);
CREATE INDEX IF NOT EXISTS idx_users_subscription_tier ON users (subscription_tier);

-- Conversation logs indexes
CREATE INDEX IF NOT EXISTS idx_conversation_logs_session_id_timestamp 
ON conversation_logs (session_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_conversation_logs_emotion_detected 
ON conversation_logs (emotion_detected);
CREATE INDEX IF NOT EXISTS idx_conversation_logs_bond_score 
ON conversation_logs (bond_score DESC);
CREATE INDEX IF NOT EXISTS idx_conversation_logs_created_date 
ON conversation_logs (created_date);
CREATE INDEX IF NOT EXISTS idx_conversation_logs_ai_model 
ON conversation_logs (ai_model);

-- Partial indexes for common queries
CREATE INDEX IF NOT EXISTS idx_conversation_logs_recent 
ON conversation_logs (session_id, timestamp DESC) 
WHERE timestamp >= NOW() - INTERVAL '30 days';

CREATE INDEX IF NOT EXISTS idx_conversation_logs_high_confidence 
ON conversation_logs (session_id, emotion_detected) 
WHERE emotion_confidence >= 0.7;

-- Memory system indexes
CREATE INDEX IF NOT EXISTS idx_memories_session_importance 
ON memories (session_id, importance_score DESC) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_memories_type_active 
ON memories (memory_type, last_referenced DESC) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_memories_tags_gin ON memories USING GIN (tags);

-- Milestone indexes
CREATE INDEX IF NOT EXISTS idx_milestones_session_achieved 
ON emotional_milestones (session_id, achieved_at DESC);
CREATE INDEX IF NOT EXISTS idx_milestones_upsell 
ON emotional_milestones (session_id) WHERE is_upsell_trigger = true;

-- JSONB indexes for fast JSON queries
CREATE INDEX IF NOT EXISTS idx_users_preferences_gin ON users USING GIN (preferences);
CREATE INDEX IF NOT EXISTS idx_context_messages_gin 
ON conversation_context_denormalized USING GIN (recent_messages);
CREATE INDEX IF NOT EXISTS idx_context_emotional_flow_gin 
ON conversation_context_denormalized USING GIN (emotional_flow);

-- ═══════════════════════════════════════════════════════════════════
-- 🔄 TRIGGERS & FUNCTIONS - Automated maintenance
-- ═══════════════════════════════════════════════════════════════════

-- Function to update user statistics
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update total messages and last activity
    UPDATE users 
    SET 
        total_messages = total_messages + 1,
        last_message_at = NEW.timestamp,
        last_emotion = NEW.emotion_detected,
        last_seen = NEW.timestamp,
        updated_at = NOW()
    WHERE session_id = NEW.session_id;
    
    -- Update conversation context
    INSERT INTO conversation_context_denormalized (session_id, recent_messages, emotional_flow, updated_at)
    VALUES (
        NEW.session_id,
        jsonb_build_array(jsonb_build_object(
            'user_message', NEW.user_message,
            'bonnie_response', NEW.bonnie_response,
            'timestamp', NEW.timestamp
        )),
        jsonb_build_array(jsonb_build_object(
            'emotion', NEW.emotion_detected,
            'confidence', NEW.emotion_confidence,
            'timestamp', NEW.timestamp
        )),
        NOW()
    )
    ON CONFLICT (session_id) DO UPDATE SET
        recent_messages = (
            SELECT jsonb_agg(msg ORDER BY (msg->>'timestamp')::timestamp DESC)
            FROM (
                SELECT jsonb_array_elements(
                    conversation_context_denormalized.recent_messages || 
                    jsonb_build_array(jsonb_build_object(
                        'user_message', NEW.user_message,
                        'bonnie_response', NEW.bonnie_response,
                        'timestamp', NEW.timestamp
                    ))
                ) as msg
                LIMIT 10
            ) AS recent
        ),
        emotional_flow = (
            SELECT jsonb_agg(emotion ORDER BY (emotion->>'timestamp')::timestamp DESC)
            FROM (
                SELECT jsonb_array_elements(
                    conversation_context_denormalized.emotional_flow || 
                    jsonb_build_array(jsonb_build_object(
                        'emotion', NEW.emotion_detected,
                        'confidence', NEW.emotion_confidence,
                        'timestamp', NEW.timestamp
                    ))
                ) as emotion
                LIMIT 10
            ) AS recent_emotions
        ),
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for conversation logs
DROP TRIGGER IF EXISTS trigger_update_user_stats ON conversation_logs;
CREATE TRIGGER trigger_update_user_stats
    AFTER INSERT ON conversation_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_user_stats();

-- Function to refresh materialized views
CREATE OR REPLACE FUNCTION refresh_materialized_views()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY user_profiles_materialized;
    REFRESH MATERIALIZED VIEW CONCURRENTLY conversation_insights_materialized;
END;
$$ LANGUAGE plpgsql;

-- ═══════════════════════════════════════════════════════════════════
-- 📈 ANALYTICS TABLES - Performance tracking
-- ═══════════════════════════════════════════════════════════════════

-- System performance metrics
CREATE TABLE IF NOT EXISTS system_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    metric_name TEXT NOT NULL,
    metric_value NUMERIC,
    metric_unit TEXT,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_system_metrics_name_time 
ON system_metrics (metric_name, recorded_at DESC);

-- API usage tracking
CREATE TABLE IF NOT EXISTS api_usage_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT,
    endpoint TEXT NOT NULL,
    method TEXT NOT NULL,
    status_code INTEGER,
    response_time INTEGER, -- milliseconds
    request_size INTEGER, -- bytes
    response_size INTEGER, -- bytes
    user_agent TEXT,
    ip_address INET,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Rate limiting info
    rate_limit_hit BOOLEAN DEFAULT false,
    rate_limit_remaining INTEGER
);

CREATE INDEX IF NOT EXISTS idx_api_usage_endpoint_time 
ON api_usage_logs (endpoint, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_api_usage_session_time 
ON api_usage_logs (session_id, timestamp DESC);

-- ═══════════════════════════════════════════════════════════════════
-- 🎯 SAMPLE DATA - For testing and development
-- ═══════════════════════════════════════════════════════════════════

-- Insert sample user (only if not exists)
INSERT INTO users (session_id, name, bond_score, mood_state, subscription_tier, age)
VALUES ('sample_session_123', 'Alex', 3.5, 'excited', 'premium', 25)
ON CONFLICT (session_id) DO NOTHING;

-- Insert sample conversation
INSERT INTO conversation_logs (session_id, user_message, bonnie_response, emotion_detected, emotion_confidence, bond_score)
VALUES (
    'sample_session_123',
    'Hey Bonnie, how are you doing today?',
    'Hey there! I''m doing wonderful, especially now that you''re here! 😊 How has your day been treating you?',
    'friendly',
    0.8,
    3.5
) ON CONFLICT DO NOTHING;

-- Insert sample memory
INSERT INTO memories (session_id, memory_type, content, importance_score, tags)
VALUES (
    'sample_session_123',
    'preference',
    'Likes to chat in the evening after work',
    0.7,
    ARRAY['timing', 'work', 'routine']
) ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════
-- 🔧 MAINTENANCE PROCEDURES - Automated cleanup
-- ═══════════════════════════════════════════════════════════════════

-- Function to clean old data
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS void AS $$
BEGIN
    -- Remove old conversation logs (older than 1 year)
    DELETE FROM conversation_logs 
    WHERE timestamp < NOW() - INTERVAL '1 year';
    
    -- Remove expired memories
    DELETE FROM memories 
    WHERE expires_at IS NOT NULL AND expires_at < NOW();
    
    -- Remove inactive users (no activity for 6 months)
    UPDATE users 
    SET is_active = false 
    WHERE last_seen < NOW() - INTERVAL '6 months' AND is_active = true;
    
    -- Clean old API logs (older than 3 months)
    DELETE FROM api_usage_logs 
    WHERE timestamp < NOW() - INTERVAL '3 months';
    
    -- Clean old system metrics (older than 6 months)
    DELETE FROM system_metrics 
    WHERE recorded_at < NOW() - INTERVAL '6 months';
    
    -- Refresh materialized views
    PERFORM refresh_materialized_views();
    
    -- Update table statistics
    ANALYZE;
END;
$$ LANGUAGE plpgsql;

-- ═══════════════════════════════════════════════════════════════════
-- 🚀 FINAL SETUP - Grants and completion
-- ═══════════════════════════════════════════════════════════════════

-- Grant necessary permissions (adjust based on your setup)
-- GRANT ALL ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO your_app_user;

-- Initial materialized view refresh
SELECT refresh_materialized_views();

-- Success message
DO $$
BEGIN
    RAISE NOTICE '🚀 Bonnie AI Production Database Schema v24.0 installed successfully!';
    RAISE NOTICE '✅ Tables created: users, conversation_logs, memories, emotional_milestones';
    RAISE NOTICE '✅ Denormalized tables: conversation_context_denormalized, user_analytics_denormalized';
    RAISE NOTICE '✅ Materialized views: user_profiles_materialized, conversation_insights_materialized';
    RAISE NOTICE '✅ Indexes optimized for performance';
    RAISE NOTICE '✅ Triggers and functions configured';
    RAISE NOTICE '📊 Schema ready for production deployment!';
END
$$;