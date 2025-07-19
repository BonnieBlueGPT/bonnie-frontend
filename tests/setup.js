// 🧪 JEST TEST SETUP - Global test configuration and mocks
// This file runs before all tests to set up the testing environment

import { jest } from '@jest/globals';

// Mock console methods to reduce noise during tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      upsert: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      single: jest.fn(() => Promise.resolve({ 
        data: { 
          session_id: 'test_session',
          bond_score: 1.0,
          mood_state: 'neutral',
          name: 'sweetheart',
          total_messages: 0,
          total_sessions: 0
        },
        error: null 
      })),
    }))
  }))
}));

// Mock axios for API calls
jest.mock('axios', () => ({
  post: jest.fn(() => Promise.resolve({
    data: {
      choices: [{
        message: {
          content: '[emotion: neutral] Hey there! I\'m doing great, thanks for asking! 💕'
        }
      }]
    }
  }))
}));

// Set test timeout
jest.setTimeout(10000);

// Global test setup
beforeAll(() => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.SUPABASE_URL = 'https://test.supabase.co';
  process.env.SUPABASE_KEY = 'test-key';
  process.env.OPENROUTER_API_KEY = 'test-openrouter-key';
  process.env.JWT_SECRET = 'test-super-secret-jwt-key-for-testing-32-chars';
});

// Global test cleanup
afterAll(() => {
  // Clean up any global test state
});

export default {};