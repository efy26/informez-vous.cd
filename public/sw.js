const CACHE = "informez-v1";

const urls = [
    "/",
    "/css/global.css",
    "/js/global.js",
    "/assets/logo-192.png",
    "/assets/logo-512.png"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE).then(cache => cache.addAll(urls))
    );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});