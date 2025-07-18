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
          galatea: ['./src/BonnieChat.jsx']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'https://galatea-brain.trainmygirl.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: true,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('Galatea proxy error:', err);
            if (!res.headersSent) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ 
                error: 'Galatea connection failed',
                message: 'Brain engine temporarily unavailable',
                fallback: true
              }));
            }
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Proxying to Galatea:', proxyReq.getHeader('host') + proxyReq.path);
            proxyReq.setHeader('X-Galatea-API-Key', process.env.VITE_GALATEA_API_KEY || 'bonnie-dev-key');
            proxyReq.setHeader('X-Galatea-Version', '2.0');
            proxyReq.setHeader('X-Bonnie-Client', 'web-dev');
            proxyReq.setHeader('Access-Control-Allow-Origin', '*');
            proxyReq.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            proxyReq.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Galatea-API-Key');
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            proxyRes.headers['Access-Control-Allow-Origin'] = '*';
            proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
            proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Galatea-API-Key';
          });
        }
      }
    }
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
  },
  define: {
    __GALATEA_VERSION__: JSON.stringify('2.0'),
    __BONNIE_BUILD_TIME__: JSON.stringify(new Date().toISOString())
  }
});
