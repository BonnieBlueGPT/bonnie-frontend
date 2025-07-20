// 🔱 DIVINE VITE CONFIGURATION v3.0
// Enterprise-grade build configuration with optimization and monitoring

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ command, mode }) => {
  const isDev = mode === 'development'
  const isProd = mode === 'production'

  return {
    plugins: [
      react({
        babel: {
          plugins: [
            isDev && 'react-refresh/babel'
          ].filter(Boolean)
        }
      })
    ],

    // Path Resolution
    root: path.resolve(__dirname),
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
        '@/styles': path.resolve(__dirname, 'src/styles')
      }
    },

    // Development Server
    server: {
      port: 3000,
      host: true,
      open: true,
      cors: true,
      hmr: {
        overlay: true
      },
      proxy: {
        '/api': {
          target: 'http://localhost:8000',
          changeOrigin: true,
          secure: false
        }
      }
    },

    // Preview Server
    preview: {
      port: 4173,
      host: true,
      cors: true
    },

    // Build Configuration
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: isProd ? false : 'inline',
      minify: isProd ? 'terser' : false,
      target: 'esnext',
      cssCodeSplit: true,
      assetsInlineLimit: 4096,
      
      // Terser Options for Production
      terserOptions: isProd ? {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log']
        },
        mangle: {
          safari10: true
        },
        output: {
          safari10: true
        }
      } : {},

      // Rollup Options
      rollupOptions: {
        output: {
          // Code Splitting Strategy
          manualChunks: {
            // React Core
            'react-vendor': ['react', 'react-dom'],
            
            // Routing
            'router-vendor': ['react-router-dom'],
            
            // State Management
            'state-vendor': ['zustand'],
            
            // Animation
            'animation-vendor': ['framer-motion'],
            
            // Icons
            'icon-vendor': ['lucide-react'],
            
            // Payment
            'payment-vendor': ['stripe'],
            
            // Utils
            'util-vendor': ['axios']
          },
          
          // Asset Naming
          chunkFileNames: isProd ? 'assets/js/[name].[hash].js' : 'assets/js/[name].js',
          entryFileNames: isProd ? 'assets/js/[name].[hash].js' : 'assets/js/[name].js',
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.')
            const ext = info[info.length - 1]
            if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
              return `assets/images/[name]${isProd ? '.[hash]' : ''}.[ext]`
            }
            if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
              return `assets/fonts/[name]${isProd ? '.[hash]' : ''}.[ext]`
            }
            return `assets/${ext}/[name]${isProd ? '.[hash]' : ''}.[ext]`
          }
        }
      },

      // Bundle Analysis
      reportCompressedSize: isProd,
      chunkSizeWarningLimit: 1000
    },

    // CSS Configuration
    css: {
      devSourcemap: isDev,
      postcss: {
        plugins: [
          require('tailwindcss'),
          require('autoprefixer')
        ]
      }
    },

    // Dependencies Optimization
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'zustand',
        'framer-motion',
        'lucide-react'
      ],
      exclude: ['@vite/client', '@vite/env']
    },

    // Environment Variables
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '2.0.0'),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString())
    },

    // Esbuild Configuration
    esbuild: {
      target: 'esnext',
      drop: isProd ? ['console', 'debugger'] : []
    }
  }
});
