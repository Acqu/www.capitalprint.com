const CACHE_NAME = 'israeledwards-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/MainLayout.css',
    '/home.css',
    '/allproducts.css',
    '/app.css',
    '/design.css',
    '/solution.css',
    '/bootstrap.css',
    '/bootstrap-grid.css',
    '/bootstrap-reboot.css',
    '/bootstrap-utilities.css',
    '/serviceworker.js',
    '/images/icon-192.png'
];

// Install event: Cache resources and force the new worker to take over.
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting())
            .catch((error) => {
                console.error('Failed to cache resources during install:', error);
            })
    );
});

// Fetch event: Respond with cached response or fetch from network.
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached response if available; otherwise, do a network fetch.
                return response || fetch(event.request)
                    .then((networkResponse) => {
                        // Optionally: You could update the cache here if needed.
                        return networkResponse;
                    })
                    .catch((error) => {
                        console.error('Fetch failed:', error);
                        // Optionally, return a fallback response.
                    });
            })
    );
});

// Activate event: Clean up old caches and claim clients.
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (!cacheWhitelist.includes(cacheName)) {
                            return caches.delete(cacheName).catch((error) => {
                                console.error('Failed to delete cache:', error);
                            });
                        }
                    })
                );
            })
            .then(() => self.clients.claim())
            .catch((error) => {
                console.error('Failed to activate service worker:', error);
            })
    );
});
