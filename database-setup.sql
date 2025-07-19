-- Database Setup for Bonnie Advanced Emotional Engine v22.0
-- This script creates the necessary tables for the enhanced emotional intelligence system

-- Create emotional_milestones table for tracking user emotional progress
CREATE TABLE IF NOT EXISTS emotional_milestones (
    id SERIAL PRIMARY KEY,
    session_id TEXT NOT NULL UNIQUE,
    first_flirt BOOLEAN DEFAULT FALSE,
    deep_conversations INTEGER DEFAULT 0,
    supportive_moments INTEGER DEFAULT 0,
    playful_interactions INTEGER DEFAULT 0,
    intimate_sharing INTEGER DEFAULT 0,
    excitement_peaks INTEGER DEFAULT 0,
    total_emotional_points INTEGER DEFAULT 0,
    last_milestone_reached TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Update existing bonnie_emotion_log table to include new fields (if it exists)
-- If the table doesn't exist, create it with the new structure
DO $$
BEGIN
    -- Check if table exists, if not create it
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'bonnie_emotion_log') THEN
        CREATE TABLE bonnie_emotion_log (
            id SERIAL PRIMARY KEY,
            session_id TEXT NOT NULL,
            message TEXT,
            emotion TEXT,
            intensity FLOAT DEFAULT 0.5,
            user_emotion TEXT,
            timestamp TIMESTAMP DEFAULT NOW()
        );
    ELSE
        -- Add new columns if they don't exist
        BEGIN
            ALTER TABLE bonnie_emotion_log ADD COLUMN intensity FLOAT DEFAULT 0.5;
        EXCEPTION
            WHEN duplicate_column THEN NULL;
        END;
        
        BEGIN
            ALTER TABLE bonnie_emotion_log ADD COLUMN user_emotion TEXT;
        EXCEPTION
            WHEN duplicate_column THEN NULL;
        END;
    END IF;
END
$$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_emotional_milestones_session ON emotional_milestones(session_id);
CREATE INDEX IF NOT EXISTS idx_emotion_log_session ON bonnie_emotion_log(session_id);
CREATE INDEX IF NOT EXISTS idx_emotion_log_timestamp ON bonnie_emotion_log(timestamp);

-- Create trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_emotional_milestones_updated_at
    BEFORE UPDATE ON emotional_milestones
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comment the tables for documentation
COMMENT ON TABLE emotional_milestones IS 'Tracks emotional milestones and progress for each user session in Bonnie chat';
COMMENT ON TABLE bonnie_emotion_log IS 'Logs all emotional interactions between users and Bonnie for analysis and improvement';

-- Sample queries for testing (commented out)
-- SELECT * FROM emotional_milestones WHERE session_id = 'test_session';
-- SELECT * FROM bonnie_emotion_log WHERE session_id = 'test_session' ORDER BY timestamp DESC LIMIT 10;