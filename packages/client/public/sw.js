const CACHE_NAME = 'game-cache-v1'

self.addEventListener('install', event => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME)

      const initialUrls = ['/', '/vite.svg']

      let manifestUrls = []
      let images = []
      try {
        const [manifestRes, imagesRes] = await Promise.all([
          fetch('/manifest.json'),
          fetch('/images.json'),
        ])

        const manifest = await manifestRes.json()
        images = await imagesRes.json()

        manifestUrls = Object.values(manifest).flatMap(entry => {
          const assets = [entry.file]
          if (entry.css) assets.push(...entry.css)
          if (entry.assets) assets.push(...entry.assets)
          return assets.map(p => '/' + p)
        })
      } catch (e) {
        console.warn('Manifest not loaded:', e)
      }

      const allUrls = [...initialUrls, ...manifestUrls, ...images]
      const uniqueUrls = new Set(allUrls)
      await cache.addAll([...uniqueUrls])
    })()
  )
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key)
          }
        })
      )
      await self.clients.claim()
    })()
  )
})

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response
      }

      const fetchRequest = event.request.clone()

      return fetch(fetchRequest)
        .then(response => {
          if (!response || response.status !== 200) {
            return response
          }

          const responseToCache = response.clone()

          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache)
          })
          return response
        })
        .catch(() => caches.match('/index.html'))
    })
  )
})
