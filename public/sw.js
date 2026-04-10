const CACHE_NAME = 'sumu-v2.0.0'
const STATIC_ASSETS = ['/', '/mobile', '/manifest.json', '/sumu-logo.png', '/icons/icon-192.png', '/icons/icon-512.png']

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(STATIC_ASSETS)).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)
  if (request.method !== 'GET') return
  if (url.origin !== self.location.origin) return
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/socket.io')) return

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).then(res => {
        caches.open(CACHE_NAME).then(c => c.put(request, res.clone()))
        return res
      }).catch(() => caches.match(request).then(c => c || caches.match('/')))
    )
    return
  }

  if (url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|webp|ico|woff2?)$/)) {
    event.respondWith(
      caches.match(request).then(cached => cached || fetch(request).then(res => {
        caches.open(CACHE_NAME).then(c => c.put(request, res.clone()))
        return res
      }))
    )
    return
  }

  event.respondWith(fetch(request).catch(() => caches.match(request)))
})

self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting()
})
