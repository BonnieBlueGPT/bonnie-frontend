// cross-device-addon.js
// 🔗 Cross-Device Connection System - Addon to existing Bonnie system
// This DOES NOT modify your existing EOM, personality, or prompt systems!
// It simply adds cross-device capabilities as a separate layer

// ═══════════════════════════════════════════════════════════════════
// 🎯 DEVICE FINGERPRINTING - Creates unique device signatures
// ═══════════════════════════════════════════════════════════════════

/**
 * Creates a unique fingerprint for the user's device
 * This runs in the browser and creates a semi-permanent device ID
 */
const generateDeviceFingerprint = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.textBaseline = 'top';
  ctx.font = '14px Arial';
  ctx.fillText('Device fingerprint', 2, 2);
  
  const fingerprint = {
    screen: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    platform: navigator.platform,
    userAgent: navigator.userAgent.slice(0, 100), // First 100 chars only
    canvas: canvas.toDataURL().slice(0, 50), // Canvas fingerprint
    timestamp: Date.now()
  };
  
  // Create hash of fingerprint data
  const fingerprintString = JSON.stringify(fingerprint);
  let hash = 0;
  for (let i = 0; i < fingerprintString.length; i++) {
    const char = fingerprintString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(36);
};

/**
 * Gets or creates a persistent device ID
 */
const getDeviceId = () => {
  let deviceId = localStorage.getItem('bonnie_device_id');
  
  if (!deviceId) {
    // Create new device ID combining fingerprint with random element
    const fingerprint = generateDeviceFingerprint();
    const random = Math.random().toString(36).substr(2, 6);
    deviceId = `${fingerprint}_${random}`;
    localStorage.setItem('bonnie_device_id', deviceId);
  }
  
  return deviceId;
};

// ═══════════════════════════════════════════════════════════════════
// 🔗 PAIRING SYSTEM - Connects devices without login
// ═══════════════════════════════════════════════════════════════════

/**
 * Generates a simple pairing code for connecting devices
 */
const generatePairingCode = () => {
  const adjectives = ['Sweet', 'Cute', 'Lovely', 'Happy', 'Magic', 'Star', 'Dream', 'Heart'];
  const nouns = ['Kiss', 'Hug', 'Love', 'Angel', 'Moon', 'Sun', 'Rose', 'Smile'];
  const numbers = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  
  return `${adjective}${noun}${numbers}`;
};

/**
 * Creates a pairing request (call this from your existing chat)
 */
const createPairingCode = async (currentSessionId) => {
  const deviceId = getDeviceId();
  const pairingCode = generatePairingCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  
  try {
    // Store pairing request in database
    await supabase.from('device_pairing').insert({
      pairing_code: pairingCode,
      primary_session_id: currentSessionId,
      primary_device_id: deviceId,
      expires_at: expiresAt.toISOString(),
      status: 'pending'
    });
    
    return pairingCode;
  } catch (error) {
    console.error('Error creating pairing code:', error);
    return null;
  }
};

/**
 * Uses a pairing code to connect a new device
 */
const usePairingCode = async (pairingCode, newSessionId) => {
  const deviceId = getDeviceId();
  
  try {
    // Find valid pairing code
    const { data: pairing } = await supabase
      .from('device_pairing')
      .select('*')
      .eq('pairing_code', pairingCode)
      .eq('status', 'pending')
      .gt('expires_at', new Date().toISOString())
      .single();
    
    if (!pairing) {
      return { success: false, error: 'Invalid or expired pairing code' };
    }
    
    // Create device connection
    await supabase.from('connected_devices').insert({
      primary_session_id: pairing.primary_session_id,
      secondary_session_id: newSessionId,
      primary_device_id: pairing.primary_device_id,
      secondary_device_id: deviceId,
      connection_type: 'paired'
    });
    
    // Mark pairing as used
    await supabase
      .from('device_pairing')
      .update({ status: 'completed', used_at: new Date().toISOString() })
      .eq('id', pairing.id);
    
    return { 
      success: true, 
      primarySessionId: pairing.primary_session_id,
      message: 'Successfully connected! Your Bonnie will remember you across devices.' 
    };
    
  } catch (error) {
    console.error('Error using pairing code:', error);
    return { success: false, error: 'Connection failed' };
  }
};

// ═══════════════════════════════════════════════════════════════════
// 🔄 SESSION MAPPING - Routes sessions to the same personality
// ═══════════════════════════════════════════════════════════════════

/**
 * Gets the primary session ID for cross-device continuity
 * This function integrates with your EXISTING session system
 */
const getPrimarySessionId = async (currentSessionId) => {
  try {
    // Check if this session is connected to another device
    const { data: connection } = await supabase
      .from('connected_devices')
      .select('primary_session_id, secondary_session_id')
      .or(`primary_session_id.eq.${currentSessionId},secondary_session_id.eq.${currentSessionId}`)
      .single();
    
    if (connection) {
      // Return the primary session ID (always use the primary for data storage)
      return connection.primary_session_id;
    }
    
    // No connection found, this session is standalone
    return currentSessionId;
    
  } catch (error) {
    // If no connection exists, just use current session
    return currentSessionId;
  }
};

/**
 * Syncs conversation state across devices
 * This works WITH your existing memory and personality systems
 */
const syncConversationState = async (primarySessionId, currentSessionId) => {
  if (primarySessionId === currentSessionId) {
    return; // No sync needed, same session
  }
  
  try {
    // Get the latest conversation context from primary session
    const { data: context } = await supabase
      .from('conversation_context')
      .select('*')
      .eq('session_id', primarySessionId)
      .single();
    
    if (context) {
      // Update current session with primary session's context
      await supabase.from('conversation_context').upsert({
        session_id: currentSessionId,
        current_topic: context.current_topic,
        conversation_mood: context.conversation_mood,
        topics_discussed_today: context.topics_discussed_today,
        conversation_depth_level: context.conversation_depth_level,
        last_conversation_summary: context.last_conversation_summary,
        updated_at: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error syncing conversation state:', error);
  }
};

// ═══════════════════════════════════════════════════════════════════
// 🔌 INTEGRATION WRAPPER - Plugs into your existing system
// ═══════════════════════════════════════════════════════════════════

/**
 * Enhanced session handler that adds cross-device support
 * This WRAPS your existing processAdvancedBonnie function
 */
const processAdvancedBonnieWithCrossDevice = async ({ session_id, message = null, isEntry = false }) => {
  // 1. Get the primary session ID for cross-device continuity
  const primarySessionId = await getPrimarySessionId(session_id);
  
  // 2. Sync conversation state if switching devices
  if (primarySessionId !== session_id) {
    await syncConversationState(primarySessionId, session_id);
  }
  
  // 3. Call your EXISTING processAdvancedBonnie function with primary session
  // This ensures all personality data, memories, etc. are tied to the primary session
  const result = await processAdvancedBonnie({ 
    session_id: primarySessionId, 
    message, 
    isEntry 
  });
  
  // 4. Add cross-device metadata to the response
  const deviceInfo = {
    deviceId: getDeviceId(),
    isPrimaryDevice: primarySessionId === session_id,
    primarySessionId: primarySessionId
  };
  
  return {
    ...result,
    crossDevice: deviceInfo
  };
};

// ═══════════════════════════════════════════════════════════════════
// 🎨 FRONTEND INTEGRATION - Simple UI components
// ═══════════════════════════════════════════════════════════════════

/**
 * React component for device pairing (add this to your existing chat)
 */
const DevicePairingComponent = ({ sessionId, onPairingSuccess }) => {
  const [showPairing, setShowPairing] = useState(false);
  const [pairingCode, setPairingCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [message, setMessage] = useState('');

  const handleGenerateCode = async () => {
    setIsGenerating(true);
    const code = await createPairingCode(sessionId);
    if (code) {
      setPairingCode(code);
      setMessage(`Share this code with your other device: ${code}`);
    } else {
      setMessage('Failed to generate pairing code. Please try again.');
    }
    setIsGenerating(false);
  };

  const handleUseCode = async () => {
    if (!inputCode.trim()) return;
    
    setIsConnecting(true);
    const result = await usePairingCode(inputCode.trim(), sessionId);
    
    if (result.success) {
      setMessage(result.message);
      setTimeout(() => {
        setShowPairing(false);
        onPairingSuccess && onPairingSuccess(result.primarySessionId);
      }, 2000);
    } else {
      setMessage(result.error);
    }
    setIsConnecting(false);
  };

  if (!showPairing) {
    return (
      <button 
        onClick={() => setShowPairing(true)}
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          padding: '8px 12px',
          backgroundColor: '#ff69b4',
          color: 'white',
          border: 'none',
          borderRadius: '20px',
          fontSize: '12px',
          cursor: 'pointer',
          zIndex: 1000
        }}
      >
        📱 Connect Devices
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: '50px',
      right: '10px',
      backgroundColor: 'white',
      border: '2px solid #ff69b4',
      borderRadius: '15px',
      padding: '20px',
      maxWidth: '300px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      zIndex: 1000
    }}>
      <button 
        onClick={() => setShowPairing(false)}
        style={{ float: 'right', border: 'none', background: 'none', fontSize: '16px', cursor: 'pointer' }}
      >
        ✕
      </button>
      
      <h3 style={{ margin: '0 0 15px 0', color: '#ff69b4' }}>Connect Your Devices</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <h4>Generate Code (on main device):</h4>
        <button 
          onClick={handleGenerateCode}
          disabled={isGenerating}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#ff69b4',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          {isGenerating ? 'Generating...' : 'Generate Pairing Code'}
        </button>
        {pairingCode && (
          <div style={{ 
            marginTop: '10px', 
            padding: '10px', 
            backgroundColor: '#f0f8ff', 
            borderRadius: '8px',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '18px',
            color: '#ff69b4'
          }}>
            {pairingCode}
          </div>
        )}
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <h4>Use Code (on new device):</h4>
        <input
          type="text"
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
          placeholder="Enter pairing code"
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            marginBottom: '10px'
          }}
        />
        <button 
          onClick={handleUseCode}
          disabled={isConnecting || !inputCode.trim()}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#20c997',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          {isConnecting ? 'Connecting...' : 'Connect Device'}
        </button>
      </div>
      
      {message && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: message.includes('Success') ? '#d4edda' : '#f8d7da',
          borderRadius: '8px',
          fontSize: '14px'
        }}>
          {message}
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// 🚀 EXPORT FUNCTIONS - Ready to integrate with your existing system
// ═══════════════════════════════════════════════════════════════════

module.exports = {
  // Main integration function - use this instead of processAdvancedBonnie
  processAdvancedBonnieWithCrossDevice,
  
  // Helper functions you can use
  getPrimarySessionId,
  getDeviceId,
  createPairingCode,
  usePairingCode,
  
  // React component for frontend
  DevicePairingComponent
};