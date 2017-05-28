/*VERSION 0.1 */
const CACHE_NAME = 'SW-DEMO'

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache)=>{
                return cache.addAll([
                    'index.html',
                    'main.css',
                    'main.js'
                ]);
            })
    );
});

//Only cached during install
/*
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response)=>{
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});
*/

//Cache new resource as well

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response)=>{
                if (response) {
                    return response;
                }

                return fetch(event.request.clone())
                    .then((response)=>{
                        let responseCopy = response.clone();
                        caches.open(CACHE_NAME)
                            .then((cache)=>{
                                return cache.put(event.request, responseCopy);
                            })
                        return response;
                    });
            })
    );
});

