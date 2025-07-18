import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          bonnie: ['./src/components/BonnieGodMode.jsx']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    open: true
  },
  preview: {
    host: '0.0.0.0',
    port: 4173
  },
  esbuild: {
    target: 'es2015'
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
});
