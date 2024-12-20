var cacheName = 'v1';

var cacheAssets = [
    '/css/style.css',
    '/js/script.js',
];

// Install Service Worker
self.addEventListener('install', (e) => {
    console.log('[Service Worker] Install');
    e.waitUntil(
        caches.open(cacheName).then((cache) => {
            console.log('[Service Worker] Caching all: app shell and content');
            return cache.addAll(cacheAssets).catch(err => {
                console.error('Failed to cache assets:', err);
            });
        })
        .then(() => { self.skipWaiting(); })
    );
});


// Activate Service Worker
self.addEventListener('activate', (e) => {
    console.log('[Service Worker] Activate');
    // remove old and unwanted caches
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if(cache !== cacheName) {
                        console.log('Service worker: clearing old cache');
                        return caches.delete(cache);
                    }
                })
            )
        })
    )
});


// Fetch Service Worker
self.addEventListener('fetch', e => {
    console.log('[Service Worker] Fetching');
    e.respondWith(
        fetch(e.request).catch(() => caches.match(e.request))
    )
})