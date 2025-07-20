// 🔱 DIVINE VITEST CONFIGURATION v3.0
// Enterprise-grade testing setup with comprehensive coverage and mocking

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  
  test: {
    // Test Environment
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globalSetup: ['./src/test/globalSetup.ts'],
    
    // Test Files
    include: [
      'src/**/*.{test,spec}.{ts,tsx}',
      'src/**/__tests__/**/*.{ts,tsx}'
    ],
    exclude: [
      'node_modules',
      'dist',
      'build',
      'coverage',
      '**/*.e2e.{test,spec}.{ts,tsx}'
    ],
    
    // Globals
    globals: true,
    
    // Coverage Configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: 'coverage',
      include: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
        '!src/**/*.stories.{ts,tsx}',
        '!src/**/*.test.{ts,tsx}',
        '!src/**/*.spec.{ts,tsx}',
        '!src/**/__tests__/**',
        '!src/test/**',
        '!src/main.tsx',
        '!src/vite-env.d.ts'
      ],
      exclude: [
        'node_modules',
        'dist',
        'build',
        'coverage'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        },
        'src/components/**': {
          branches: 85,
          functions: 85,
          lines: 85,
          statements: 85
        },
        'src/utils/**': {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90
        }
      }
    },
    
    // Test Timeout
    testTimeout: 10000,
    hookTimeout: 10000,
    
    // Watch Mode
    watch: false,
    
    // Reporters
    reporter: ['verbose', 'json'],
    outputFile: {
      json: './coverage/test-results.json'
    },
    
    // Mock Configuration
    clearMocks: true,
    restoreMocks: true,
    
    // Retry Failed Tests
    retry: 2,
    
    // Pool Configuration
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: false
      }
    }
  },
  
  // Path Resolution (same as main Vite config)
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@/components': path.resolve(__dirname, 'src/components'),
      '@/hooks': path.resolve(__dirname, 'src/hooks'),
      '@/utils': path.resolve(__dirname, 'src/utils'),
      '@/services': path.resolve(__dirname, 'src/services'),
      '@/store': path.resolve(__dirname, 'src/store'),
      '@/types': path.resolve(__dirname, 'src/types'),
      '@/assets': path.resolve(__dirname, 'src/assets'),
      '@/styles': path.resolve(__dirname, 'src/styles'),
      '@/test': path.resolve(__dirname, 'src/test')
    }
  },
  
  // Define Global Variables
  define: {
    __APP_VERSION__: JSON.stringify('2.0.0'),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString())
  }
});