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

// Install event
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        }).catch((error) => {
            console.error('Failed to cache resources during install:', error);
        })
    );
});

// Fetch event
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).catch((error) => {
                console.error('Fetch failed:', error);
            });
        })
    );
});

// Activate event
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName).catch((error) => {
                            console.error('Failed to delete cache:', error);
                        });
                    }
                })
            );
        }).catch((error) => {
            console.error('Failed to activate service worker:', error);
        })
    );
});
