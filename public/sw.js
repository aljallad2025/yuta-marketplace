self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', e => e.waitUntil(self.clients.matchAll().then(() => self.clients.claim())))
self.addEventListener('fetch', () => {})
