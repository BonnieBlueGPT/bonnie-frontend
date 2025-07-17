import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Build configuration
  build: {
    // Output directory for production build
    outDir: 'dist',
    
    // Disable sourcemaps for production build
    sourcemap: false,
    
    // Minify using Terser for smaller files
    minify: 'terser',
    
    // Optimize dependencies and output chunks
    rollupOptions: {
      output: {
        // Manual chunking for vendor libraries like React
        manualChunks: {
          vendor: ['react', 'react-dom']
        }
      }
    }
  },

  // Development server settings
  server: {
    port: 3000,         // Set port to 3000 for local dev server
    host: true,         // Enable hosting for local dev server
    open: true          // Automatically open the app in the browser on start
  },

  // Preview settings for production
  preview: {
    port: 3000,         // Set preview port to 3000
    host: true          // Allow external access to the preview server
  },

  // Optimize dependencies (useful for faster builds)
  optimizeDeps: {
    include: ['react', 'react-dom'],
  }
});
