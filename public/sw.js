const CACHE = "informez-v1";

const urls = [
    "/",
    "/manifest.json",
    "/css/global.css",
    "/js/global.js",
    "/assets/logo-192.jpeg",
    "/assets/logo-512.jpeg"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE).then(cache => cache.addAll(urls))
    );

    self.skipWaiting();
});

self.addEventListener("activate", event => {
    event.waitUntil(clients.claim());
});

self.addEventListener("fetch", event => {
    if (event.request.method !== "GET") return;

    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});