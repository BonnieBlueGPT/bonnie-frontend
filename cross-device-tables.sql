-- 🔗 CROSS-DEVICE ADDON TABLES
-- Add these tables to your existing Supabase database
-- These ONLY add cross-device functionality without changing anything else!

-- ═══════════════════════════════════════════════════════════════════
-- 📱 DEVICE PAIRING TABLE - Temporary codes for connecting devices
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS device_pairing (
    id SERIAL PRIMARY KEY,
    pairing_code TEXT NOT NULL UNIQUE,
    primary_session_id TEXT NOT NULL,
    primary_device_id TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'expired'
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════
-- 🔗 CONNECTED DEVICES TABLE - Links devices together
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS connected_devices (
    id SERIAL PRIMARY KEY,
    primary_session_id TEXT NOT NULL,
    secondary_session_id TEXT NOT NULL,
    primary_device_id TEXT NOT NULL,
    secondary_device_id TEXT NOT NULL,
    connection_type TEXT DEFAULT 'paired', -- 'paired', 'auto_detected'
    last_sync TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════
-- 🔄 DEVICE SYNC LOG - Tracks synchronization between devices
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS device_sync_log (
    id SERIAL PRIMARY KEY,
    primary_session_id TEXT NOT NULL,
    secondary_session_id TEXT NOT NULL,
    sync_type TEXT NOT NULL, -- 'conversation_context', 'memory', 'personality'
    sync_data JSONB,
    sync_direction TEXT DEFAULT 'primary_to_secondary', -- 'primary_to_secondary', 'secondary_to_primary'
    sync_status TEXT DEFAULT 'success', -- 'success', 'failed', 'partial'
    created_at TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════════
-- 📊 INDEXES FOR PERFORMANCE
-- ═══════════════════════════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_device_pairing_code ON device_pairing(pairing_code);
CREATE INDEX IF NOT EXISTS idx_device_pairing_expires ON device_pairing(expires_at);
CREATE INDEX IF NOT EXISTS idx_device_pairing_status ON device_pairing(status);

CREATE INDEX IF NOT EXISTS idx_connected_devices_primary ON connected_devices(primary_session_id);
CREATE INDEX IF NOT EXISTS idx_connected_devices_secondary ON connected_devices(secondary_session_id);
CREATE INDEX IF NOT EXISTS idx_connected_devices_active ON connected_devices(is_active);

CREATE INDEX IF NOT EXISTS idx_device_sync_log_primary ON device_sync_log(primary_session_id);
CREATE INDEX IF NOT EXISTS idx_device_sync_log_secondary ON device_sync_log(secondary_session_id);
CREATE INDEX IF NOT EXISTS idx_device_sync_log_type ON device_sync_log(sync_type);

-- ═══════════════════════════════════════════════════════════════════
-- 🧹 CLEANUP FUNCTION - Removes expired pairing codes automatically
-- ═══════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION cleanup_expired_pairing_codes()
RETURNS void AS $$
BEGIN
    -- Mark expired codes as expired
    UPDATE device_pairing 
    SET status = 'expired' 
    WHERE expires_at < NOW() AND status = 'pending';
    
    -- Delete old expired codes (older than 24 hours)
    DELETE FROM device_pairing 
    WHERE status = 'expired' AND created_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

-- ═══════════════════════════════════════════════════════════════════
-- 📝 TABLE COMMENTS
-- ═══════════════════════════════════════════════════════════════════

COMMENT ON TABLE device_pairing IS 'Temporary pairing codes for connecting devices without login';
COMMENT ON TABLE connected_devices IS 'Links user sessions across multiple devices';
COMMENT ON TABLE device_sync_log IS 'Tracks data synchronization between connected devices';

-- ═══════════════════════════════════════════════════════════════════
-- 🎉 SUCCESS MESSAGE
-- ═══════════════════════════════════════════════════════════════════

DO $$
BEGIN
    RAISE NOTICE '🔗 Cross-device tables created successfully!';
    RAISE NOTICE '✅ Users can now connect devices with simple pairing codes';
    RAISE NOTICE '📱 No login required - just easy device pairing!';
END $$;