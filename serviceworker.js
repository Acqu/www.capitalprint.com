const CACHE_NAME = 'israeledwards-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/MainLayout.css',
    '/home.css',
    '/allproducts.css',
    '/app.css',
    '/bootstrap.css',
    '/bootstrap.grid.css',
    '/bootstrap.reboot.css',
    '/bootstrap.utilities.css',
    '/design.css',
    '/solution.css',
    '/serviceworker.js',
    '/images/icon-192.png'
];

// Install event: Cache resources and force new worker activation
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return Promise.all(urlsToCache.map(url =>
                fetch(url).then(response => {
                    if (!response.ok) throw new Error(`Failed to fetch ${url}`);
                    return cache.put(url, response);
                }).catch(error => console.warn(`Skipping ${url}:`, error))
            ));
        }).then(() => self.skipWaiting()) // Immediately take control
    );
});

// Fetch event: Serve cached responses & update cache dynamically
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            return cachedResponse || fetch(event.request).then(networkResponse => {
                return caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, networkResponse.clone()); // Update cache dynamically
                    return networkResponse;
                });
            });
        }).catch(error => console.error('Fetch failed:', error))
    );
});

// Activate event: Remove old caches & claim clients
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames =>
            Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName).catch(error =>
                            console.error('Failed to delete cache:', error)
                        );
                    }
                })
            )
        ).then(() => self.clients.claim()) // Take control of open pages
    );
});
