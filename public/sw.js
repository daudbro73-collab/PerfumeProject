const CACHE_NAME = "elixir-parfum-v3";
const STATIC_ASSETS = ["/manifest.json"];

function shouldNeverCache(url) {
  const path = new URL(url).pathname;
  return (
    path.startsWith("/_next/") ||
    path.startsWith("/api/") ||
    path.includes("hot-update")
  );
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = event.request.url;
  if (shouldNeverCache(url)) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (
          response.ok &&
          url.startsWith(self.location.origin) &&
          !shouldNeverCache(url)
        ) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
