var cacheName = 'v2';



// Install Service Worker
self.addEventListener('install', (e) => {
    console.log('[Service Worker] Install');
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
        fetch(e.request)
            .then(res => {
                const resClone = res.clone();
                caches.open(cacheName)
                    .then(cache => {
                        cache.put(e.request, resClone);
                    });
                return res;
            }).catch(err => caches.match(e.request).then(res => res))
    )
})