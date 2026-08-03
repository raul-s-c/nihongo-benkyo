const CACHE_NAME = "nihongo-benkyo-v17";
const APP_FILES = ["./", "index.html", "styles.css", "cloud-config.js", "content.js", "app.js", "manifest.webmanifest", "assets/app-icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_FILES))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request, { cache: "no-store" })
      .then((response) => {
        if (response.ok && new URL(event.request.url).origin === self.location.origin) {
          const cachedResponse = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cachedResponse));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
