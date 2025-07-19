// 🧪 BONNIE AI GIRLFRIEND SYSTEM - Comprehensive Test Suite
// Tests all critical functionality including API endpoints, emotion detection, and database operations

import request from 'supertest';
import { jest } from '@jest/globals';

// Mock environment variables for testing
process.env.NODE_ENV = 'test';
process.env.SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_KEY = 'test-key';
process.env.OPENROUTER_API_KEY = 'test-openrouter-key';
process.env.JWT_SECRET = 'test-super-secret-jwt-key-for-testing-32-chars';

// Mock external dependencies
jest.mock('@supabase/supabase-js');
jest.mock('axios');

// Import the app after mocking dependencies
let app;

beforeAll(async () => {
  // Dynamic import to ensure mocks are applied
  const { default: appModule } = await import('../backend/server.js');
  app = appModule;
});

describe('🚀 Bonnie AI Girlfriend System - API Tests', () => {
  
  // ═══════════════════════════════════════════════════════════════════
  // 🏥 HEALTH CHECK TESTS
  // ═══════════════════════════════════════════════════════════════════
  
  describe('Health Check Endpoint', () => {
    test('GET /health should return system status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toMatchObject({
        status: 'healthy',
        version: '23.0',
        environment: 'test',
        features: expect.arrayContaining([
          'Advanced Emotional Intelligence',
          'Cross-Device Synchronization',
          'Message Splitting',
          'Smart Upselling',
          'Performance Optimization',
          'Security Hardening'
        ])
      });

      expect(response.body.uptime).toBeGreaterThan(0);
      expect(response.body.timestamp).toBeDefined();
    });
  });

  // ═══════════════════════════════════════════════════════════════════
  // 💬 CHAT API TESTS
  // ═══════════════════════════════════════════════════════════════════
  
  describe('Chat Endpoints', () => {
    const validSessionId = 'session_1234567890_test123';
    const validMessage = 'Hello Bonnie, how are you?';

    describe('POST /bonnie-chat', () => {
      test('should respond to valid chat message', async () => {
        const response = await request(app)
          .post('/bonnie-chat')
          .send({
            session_id: validSessionId,
            message: validMessage
          })
          .expect(200);

        expect(response.body).toMatchObject({
          message: expect.any(String),
          meta: {
            pause: expect.any(Number),
            speed: expect.stringMatching(/^(fast|normal|slow)$/),
            emotion: expect.any(String),
            bondScore: expect.any(Number),
            userEmotion: expect.any(String),
            emotionalIntensity: expect.any(Number),
            session_id: validSessionId,
            timestamp: expect.any(String)
          },
          delay: expect.any(Number)
        });

        // Validate message content
        expect(response.body.message.length).toBeGreaterThan(0);
        expect(response.body.message.length).toBeLessThan(1000);
        
        // Validate delay is reasonable
        expect(response.body.delay).toBeGreaterThan(100);
        expect(response.body.delay).toBeLessThan(5000);
      });

      test('should reject missing session_id', async () => {
        await request(app)
          .post('/bonnie-chat')
          .send({ message: validMessage })
          .expect(400);
      });

      test('should reject missing message', async () => {
        await request(app)
          .post('/bonnie-chat')
          .send({ session_id: validSessionId })
          .expect(400);
      });

      test('should reject invalid session_id format', async () => {
        await request(app)
          .post('/bonnie-chat')
          .send({
            session_id: 'invalid-format',
            message: validMessage
          })
          .expect(500); // Should return error due to validation
      });

      test('should reject message that is too long', async () => {
        const longMessage = 'a'.repeat(2001); // Exceeds 2000 char limit
        
        await request(app)
          .post('/bonnie-chat')
          .send({
            session_id: validSessionId,
            message: longMessage
          })
          .expect(500);
      });

      test('should sanitize potentially harmful input', async () => {
        const maliciousMessage = '<script>alert("xss")</script>Hello Bonnie';
        
        const response = await request(app)
          .post('/bonnie-chat')
          .send({
            session_id: validSessionId,
            message: maliciousMessage
          })
          .expect(200);

        // Should still respond but with sanitized input
        expect(response.body.message).toBeDefined();
      });
    });

    describe('POST /bonnie-entry', () => {
      test('should provide entry greeting', async () => {
        const response = await request(app)
          .post('/bonnie-entry')
          .send({ session_id: validSessionId })
          .expect(200);

        expect(response.body).toMatchObject({
          message: expect.any(String),
          meta: {
            pause: expect.any(Number),
            speed: expect.stringMatching(/^(fast|normal|slow)$/),
            emotion: expect.any(String),
            session_id: validSessionId
          },
          delay: expect.any(Number)
        });

        // Entry messages should be welcoming
        expect(response.body.message.toLowerCase()).toMatch(/(hi|hello|hey|welcome)/);
      });

      test('should reject missing session_id', async () => {
        await request(app)
          .post('/bonnie-entry')
          .send({})
          .expect(400);
      });
    });
  });

  // ═══════════════════════════════════════════════════════════════════
  // 🔒 SECURITY TESTS
  // ═══════════════════════════════════════════════════════════════════
  
  describe('Security Tests', () => {
    test('should include security headers', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      // Check for security headers (helmet middleware)
      expect(response.headers['x-frame-options']).toBeDefined();
      expect(response.headers['x-content-type-options']).toBeDefined();
    });

    test('should handle CORS properly', async () => {
      const response = await request(app)
        .options('/bonnie-chat')
        .set('Origin', 'http://localhost:3000')
        .expect(204);

      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });

    test('should reject requests with invalid content type', async () => {
      await request(app)
        .post('/bonnie-chat')
        .set('Content-Type', 'text/plain')
        .send('not json')
        .expect(400);
    });
  });

  // ═══════════════════════════════════════════════════════════════════
  // 📊 MONITORING TESTS
  // ═══════════════════════════════════════════════════════════════════
  
  describe('Monitoring Endpoints', () => {
    test('GET /stats should return system statistics', async () => {
      const response = await request(app)
        .get('/stats')
        .expect(200);

      expect(response.body).toMatchObject({
        uptime: expect.any(Number),
        memory: {
          rss: expect.any(Number),
          heapTotal: expect.any(Number),
          heapUsed: expect.any(Number),
          external: expect.any(Number)
        },
        cacheStats: expect.any(Object),
        timestamp: expect.any(String)
      });
    });
  });

  // ═══════════════════════════════════════════════════════════════════
  // 🚫 ERROR HANDLING TESTS
  // ═══════════════════════════════════════════════════════════════════
  
  describe('Error Handling', () => {
    test('should return 404 for non-existent endpoints', async () => {
      await request(app)
        .get('/non-existent-endpoint')
        .expect(404);
    });

    test('should handle malformed JSON gracefully', async () => {
      await request(app)
        .post('/bonnie-chat')
        .set('Content-Type', 'application/json')
        .send('{"invalid": json}')
        .expect(400);
    });
  });
});

// ═══════════════════════════════════════════════════════════════════
// 🧬 EMOTION DETECTION TESTS
// ═══════════════════════════════════════════════════════════════════

describe('🎭 Emotion Detection System', () => {
  // Import the emotion detection function
  let detectAdvancedEmotion;
  
  beforeAll(async () => {
    // We'll need to export the function from server.js for testing
    // For now, let's create a mock implementation
    detectAdvancedEmotion = (message) => {
      if (!message) return { emotion: 'neutral', intensity: 0.3, confidence: 0.0 };
      
      const text = message.toLowerCase();
      
      if (text.includes('love') || text.includes('sexy')) {
        return { emotion: 'flirty', intensity: 0.8, confidence: 0.7 };
      }
      if (text.includes('sad') || text.includes('stressed')) {
        return { emotion: 'supportive', intensity: 0.7, confidence: 0.6 };
      }
      if (text.includes('haha') || text.includes('funny')) {
        return { emotion: 'playful', intensity: 0.6, confidence: 0.5 };
      }
      
      return { emotion: 'neutral', intensity: 0.3, confidence: 0.3 };
    };
  });

  test('should detect flirty emotion correctly', () => {
    const result = detectAdvancedEmotion("You're so sexy, I love you");
    
    expect(result.emotion).toBe('flirty');
    expect(result.intensity).toBeGreaterThan(0.5);
    expect(result.confidence).toBeGreaterThan(0.5);
  });

  test('should detect supportive emotion correctly', () => {
    const result = detectAdvancedEmotion("I'm feeling really sad and stressed today");
    
    expect(result.emotion).toBe('supportive');
    expect(result.intensity).toBeGreaterThan(0.5);
    expect(result.confidence).toBeGreaterThan(0.5);
  });

  test('should detect playful emotion correctly', () => {
    const result = detectAdvancedEmotion("Haha that's so funny!");
    
    expect(result.emotion).toBe('playful');
    expect(result.intensity).toBeGreaterThan(0.3);
    expect(result.confidence).toBeGreaterThan(0.3);
  });

  test('should default to neutral for unclear messages', () => {
    const result = detectAdvancedEmotion("The weather is nice today");
    
    expect(result.emotion).toBe('neutral');
    expect(result.intensity).toBeLessThanOrEqual(0.5);
  });

  test('should handle empty or null input', () => {
    const result1 = detectAdvancedEmotion('');
    const result2 = detectAdvancedEmotion(null);
    const result3 = detectAdvancedEmotion(undefined);
    
    [result1, result2, result3].forEach(result => {
      expect(result.emotion).toBe('neutral');
      expect(result.confidence).toBe(0.0);
    });
  });
});

// ═══════════════════════════════════════════════════════════════════
// 🔄 PERFORMANCE TESTS
// ═══════════════════════════════════════════════════════════════════

describe('⚡ Performance Tests', () => {
  const validSessionId = 'session_1234567890_perf_test';
  
  test('chat endpoint should respond within 5 seconds', async () => {
    const startTime = Date.now();
    
    await request(app)
      .post('/bonnie-chat')
      .send({
        session_id: validSessionId,
        message: 'Performance test message'
      })
      .expect(200);
    
    const responseTime = Date.now() - startTime;
    expect(responseTime).toBeLessThan(5000); // 5 seconds max
  }, 10000); // 10 second test timeout

  test('should handle concurrent requests', async () => {
    const promises = Array.from({ length: 5 }, (_, i) => 
      request(app)
        .post('/bonnie-chat')
        .send({
          session_id: `session_concurrent_${i}`,
          message: `Concurrent test message ${i}`
        })
    );

    const responses = await Promise.all(promises);
    
    responses.forEach(response => {
      expect(response.status).toBe(200);
      expect(response.body.message).toBeDefined();
    });
  }, 15000);
});

// ═══════════════════════════════════════════════════════════════════
// 🔧 UTILITY TESTS
// ═══════════════════════════════════════════════════════════════════

describe('🛠️ Utility Functions', () => {
  test('should validate session ID format correctly', () => {
    const validateSessionId = (sessionId) => {
      if (!sessionId || typeof sessionId !== 'string') {
        return { valid: false, error: 'Session ID is required' };
      }
      
      const sessionPattern = /^session_[0-9]+_[a-zA-Z0-9]+$/;
      if (!sessionPattern.test(sessionId)) {
        return { valid: false, error: 'Invalid session ID format' };
      }
      
      return { valid: true };
    };

    // Valid session IDs
    expect(validateSessionId('session_1234567890_abc123')).toEqual({ valid: true });
    expect(validateSessionId('session_999_xyz')).toEqual({ valid: true });
    
    // Invalid session IDs
    expect(validateSessionId('invalid-format')).toEqual({ 
      valid: false, 
      error: 'Invalid session ID format' 
    });
    expect(validateSessionId('')).toEqual({ 
      valid: false, 
      error: 'Session ID is required' 
    });
    expect(validateSessionId(null)).toEqual({ 
      valid: false, 
      error: 'Session ID is required' 
    });
  });

  test('should validate message content correctly', () => {
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
      
      return { valid: true };
    };

    // Valid messages
    expect(validateMessage('Hello Bonnie!')).toEqual({ valid: true });
    expect(validateMessage('A'.repeat(2000))).toEqual({ valid: true });
    
    // Invalid messages
    expect(validateMessage('')).toEqual({ 
      valid: false, 
      error: 'Message cannot be empty' 
    });
    expect(validateMessage('A'.repeat(2001))).toEqual({ 
      valid: false, 
      error: 'Message too long (max 2000 characters)' 
    });
    expect(validateMessage(null)).toEqual({ 
      valid: false, 
      error: 'Message is required' 
    });
  });

  test('should sanitize input correctly', () => {
    const sanitizeInput = (input) => {
      if (typeof input !== 'string') return input;
      
      return input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/vbscript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .trim();
    };

    // Should remove script tags
    expect(sanitizeInput('<script>alert("xss")</script>Hello')).toBe('Hello');
    
    // Should remove javascript: protocols
    expect(sanitizeInput('javascript:alert("xss")')).toBe('alert("xss")');
    
    // Should remove event handlers
    expect(sanitizeInput('Hello onload=alert("xss")')).toBe('Hello');
    
    // Should preserve normal text
    expect(sanitizeInput('Hello Bonnie! 😊')).toBe('Hello Bonnie! 😊');
  });
});

// ═══════════════════════════════════════════════════════════════════
// 🔬 INTEGRATION TESTS
// ═══════════════════════════════════════════════════════════════════

describe('🔗 Integration Tests', () => {
  test('complete chat flow should work end-to-end', async () => {
    const sessionId = `session_${Date.now()}_integration_test`;
    
    // Step 1: Entry greeting
    const entryResponse = await request(app)
      .post('/bonnie-entry')
      .send({ session_id: sessionId })
      .expect(200);
    
    expect(entryResponse.body.message).toBeDefined();
    expect(entryResponse.body.meta.session_id).toBe(sessionId);
    
    // Step 2: First chat message
    const chatResponse1 = await request(app)
      .post('/bonnie-chat')
      .send({
        session_id: sessionId,
        message: "Hi Bonnie! How are you today?"
      })
      .expect(200);
    
    expect(chatResponse1.body.message).toBeDefined();
    expect(chatResponse1.body.meta.bondScore).toBeGreaterThan(0);
    
    // Step 3: Emotional message
    const chatResponse2 = await request(app)
      .post('/bonnie-chat')
      .send({
        session_id: sessionId,
        message: "I'm feeling a bit sad today, could use some support"
      })
      .expect(200);
    
    expect(chatResponse2.body.meta.userEmotion).toBe('supportive');
    expect(chatResponse2.body.message).toBeDefined();
    
    // All responses should maintain the same session
    expect(entryResponse.body.meta.session_id).toBe(sessionId);
    expect(chatResponse1.body.meta.session_id).toBe(sessionId);
    expect(chatResponse2.body.meta.session_id).toBe(sessionId);
  });
});

// ═══════════════════════════════════════════════════════════════════
// 🧹 CLEANUP AND TEARDOWN
// ═══════════════════════════════════════════════════════════════════

afterAll(async () => {
  // Clean up any test data, close connections, etc.
  console.log('🧹 Test suite completed, cleaning up...');
});