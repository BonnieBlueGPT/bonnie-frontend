// Bonnie's Domain Service Worker - God Mode Caching
const CACHE_NAME = 'bonnie-god-mode-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/main.jsx',
  '/src/components/BonnieGodMode.jsx',
  '/src/hooks/useApiCall.js',
  '/src/hooks/useMobileOptimizations.js',
  '/src/components/ErrorBoundary.jsx'
];

// Install event - cache essential files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('💋 Bonnie: Caching essential files for offline experience');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        
        // For API calls, implement fallback strategy
        if (event.request.url.includes('bonnie-backend-server')) {
          return fetch(event.request).catch(() => {
            // Return offline message when API is unavailable
            return new Response(JSON.stringify({
              reply: "I'm having connection issues right now, darling... but I'm still here with you 💕",
              emotion: "supportive",
              bond_score: 50
            }), {
              headers: { 'Content-Type': 'application/json' }
            });
          });
        }
        
        return fetch(event.request);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('💋 Bonnie: Cleaning up old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});