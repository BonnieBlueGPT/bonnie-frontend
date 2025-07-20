-- 🔱 DIVINE DATABASE SCHEMA FOR BONNIE TELEGRAM BOT
-- Run this in your Supabase SQL editor

-- Chat logs table for storing all interactions
CREATE TABLE IF NOT EXISTS chat_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    username VARCHAR(255),
    user_message TEXT NOT NULL,
    bot_response TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    bot_name VARCHAR(50) DEFAULT 'bonnie',
    session_id UUID DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User profiles for storing user context and preferences
CREATE TABLE IF NOT EXISTS user_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL,
    username VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    preferred_name VARCHAR(255),
    interests TEXT[],
    gaming_preferences JSONB,
    personality_notes TEXT,
    subscription_tier VARCHAR(50) DEFAULT 'free',
    message_count INTEGER DEFAULT 0,
    last_active TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscription tracking
CREATE TABLE IF NOT EXISTS subscriptions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES user_profiles(user_id),
    tier VARCHAR(50) NOT NULL,
    start_date TIMESTAMPTZ DEFAULT NOW(),
    end_date TIMESTAMPTZ,
    status VARCHAR(20) DEFAULT 'active',
    payment_id VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Message usage tracking for freemium model
CREATE TABLE IF NOT EXISTS message_usage (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    message_count INTEGER DEFAULT 0,
    tier VARCHAR(50) DEFAULT 'free',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Analytics and metrics
CREATE TABLE IF NOT EXISTS bot_analytics (
    id BIGSERIAL PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    user_id BIGINT,
    metadata JSONB,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_chat_logs_user_id ON chat_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_logs_timestamp ON chat_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_message_usage_user_date ON message_usage(user_id, date);

-- RLS (Row Level Security) policies
ALTER TABLE chat_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_usage ENABLE ROW LEVEL SECURITY;

-- Policies (adjust based on your auth setup)
CREATE POLICY "Allow service role access" ON chat_logs FOR ALL USING (true);
CREATE POLICY "Allow service role access" ON user_profiles FOR ALL USING (true);
CREATE POLICY "Allow service role access" ON subscriptions FOR ALL USING (true);
CREATE POLICY "Allow service role access" ON message_usage FOR ALL USING (true);

-- Functions for automated updates
CREATE OR REPLACE FUNCTION update_user_profile_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_user_profile_timestamp();

-- Function to increment message count
CREATE OR REPLACE FUNCTION increment_message_count(p_user_id BIGINT)
RETURNS VOID AS $$
BEGIN
    INSERT INTO message_usage (user_id, message_count)
    VALUES (p_user_id, 1)
    ON CONFLICT (user_id, date)
    DO UPDATE SET message_count = message_usage.message_count + 1;
    
    UPDATE user_profiles 
    SET message_count = message_count + 1,
        last_active = NOW()
    WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;