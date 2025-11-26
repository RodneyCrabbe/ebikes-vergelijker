const CACHE_NAME = 'ebike-platform-v1'
const STATIC_CACHE = 'ebike-platform-static-v1'
const DYNAMIC_CACHE = 'ebike-platform-dynamic-v1'

// Static assets to cache
const STATIC_ASSETS = [
  '/',
  '/ebikes',
  '/reviews',
  '/community',
  '/css/critical.css',
  '/js/critical.js',
  '/images/logo.svg',
  '/images/hero-bg.webp',
  '/fonts/inter-var.woff2'
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log('Static assets cached successfully')
        return self.skipWaiting()
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('Service worker activated')
        return self.clients.claim()
      })
  )
})

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip external requests
  if (url.origin !== location.origin) {
    return
  }

  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        // Return cached version if available
        if (cachedResponse) {
          return cachedResponse
        }

        // Otherwise fetch from network
        return fetch(request)
          .then(response => {
            // Don't cache if not a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response
            }

            // Clone the response
            const responseToCache = response.clone()

            // Cache dynamic content
            caches.open(DYNAMIC_CACHE)
              .then(cache => {
                cache.put(request, responseToCache)
              })

            return response
          })
          .catch(error => {
            console.error('Fetch failed:', error)
            
            // Return offline page for navigation requests
            if (request.destination === 'document') {
              return caches.match('/offline.html')
            }
            
            throw error
          })
      })
  )
})

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle offline actions like form submissions
      handleBackgroundSync()
    )
  }
})

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nieuwe update beschikbaar!',
    icon: '/images/icon-192x192.png',
    badge: '/images/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Bekijk details',
        icon: '/images/checkmark.png'
      },
      {
        action: 'close',
        title: 'Sluiten',
        icon: '/images/xmark.png'
      }
    ]
  }

  event.waitUntil(
    self.registration.showNotification('E-Bike Platform', options)
  )
})

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})

// Helper function for background sync
async function handleBackgroundSync() {
  try {
    // Get offline actions from IndexedDB
    const offlineActions = await getOfflineActions()
    
    for (const action of offlineActions) {
      try {
        await syncAction(action)
        await removeOfflineAction(action.id)
      } catch (error) {
        console.error('Failed to sync action:', error)
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error)
  }
}

// Get offline actions from IndexedDB
async function getOfflineActions() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('OfflineActions', 1)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const db = request.result
      const transaction = db.transaction(['actions'], 'readonly')
      const store = transaction.objectStore('actions')
      const getAllRequest = store.getAll()
      
      getAllRequest.onsuccess = () => resolve(getAllRequest.result)
      getAllRequest.onerror = () => reject(getAllRequest.error)
    }
  })
}

// Sync individual action
async function syncAction(action) {
  const response = await fetch(action.url, {
    method: action.method,
    headers: action.headers,
    body: action.body
  })
  
  if (!response.ok) {
    throw new Error(`Sync failed: ${response.status}`)
  }
  
  return response
}

// Remove synced action from IndexedDB
async function removeOfflineAction(actionId) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('OfflineActions', 1)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const db = request.result
      const transaction = db.transaction(['actions'], 'readwrite')
      const store = transaction.objectStore('actions')
      const deleteRequest = store.delete(actionId)
      
      deleteRequest.onsuccess = () => resolve()
      deleteRequest.onerror = () => reject(deleteRequest.error)
    }
  })
}

// Cache strategies for different types of content
const cacheStrategies = {
  // Cache first for static assets
  cacheFirst: async (request) => {
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    const networkResponse = await fetch(request)
    const cache = await caches.open(STATIC_CACHE)
    cache.put(request, networkResponse.clone())
    return networkResponse
  },

  // Network first for dynamic content
  networkFirst: async (request) => {
    try {
      const networkResponse = await fetch(request)
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
      return networkResponse
    } catch (error) {
      const cachedResponse = await caches.match(request)
      if (cachedResponse) {
        return cachedResponse
      }
      throw error
    }
  },

  // Stale while revalidate for frequently updated content
  staleWhileRevalidate: async (request) => {
    const cachedResponse = await caches.match(request)
    
    const fetchPromise = fetch(request).then(response => {
      const cache = caches.open(DYNAMIC_CACHE)
      cache.then(c => c.put(request, response.clone()))
      return response
    })
    
    return cachedResponse || fetchPromise
  }
}
