const CACHE = "leandrosof-v2";
const ASSETS = [
  "/",
  "/ferramentas",
  "/site.webmanifest",
  "/favicon-32x32.png",
  "/favicon-16x16.png",
  "/android-chrome-192x192.png",
  "/android-chrome-512x512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((cached) => cached || fetch(event.request)),
  );
});
