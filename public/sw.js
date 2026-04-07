const CACHE_NAME = 'sumu-v1.0.0'
const STATIC_CACHE = 'sumu-static-v1'

// Assets to pre-cache on install
const PRE_CACHE = [
  '/',
  '/mobile',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
]

// ── Install: pre-cache static assets ─────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(PRE_CACHE).catch(() => {
        // Non-fatal: some assets may not be available during install
      })
    }).then(() => self.skipWaiting())
  )
})

// ── Activate: clean old caches ────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME && k !== STATIC_CACHE)
            .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  )
})

// ── Fetch: network-first with cache fallback ──────────────────────────
self.addEventListener('fetch', (event) => {
  // Skip non-GET and chrome-extension requests
  if (event.request.method !== 'GET') return
  if (event.request.url.startsWith('chrome-extension')) return
  if (event.request.url.includes('fonts.googleapis.com')) return

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses
        if (response && response.status === 200 && response.type !== 'opaque') {
          const clone = response.clone()
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone))
        }
        return response
      })
      .catch(() => {
        // Network failed → serve from cache
        return caches.match(event.request).then(cached => {
          if (cached) return cached
          // Fallback for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('/').then(r => r || new Response(
              '<html><body style="background:#0F2A47;color:#C8A951;font-family:Arial;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;text-align:center"><div><div style="font-size:3rem">🏆</div><h1>SUMU</h1><p style="opacity:.6">أنت غير متصل بالإنترنت<br>You are offline</p></div></body></html>',
              { headers: { 'Content-Type': 'text/html' } }
            ))
          }
          return new Response('', { status: 503 })
        })
      })
  )
})

// ── Background sync & push (future ready) ────────────────────────────
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting()
})
