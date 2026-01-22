const CACHE_NAME = 'v1_schapps';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/offline.html' // Halaman fallback jika tidak ada koneksi
];

// 1. Install Service Worker dan Simpan Asset ke Cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching assets...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. Strategi Fetch: Ambil dari Cache jika Offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Jika file ada di cache, kirim file tersebut. Jika tidak, ambil dari network.
      return response || fetch(event.request).catch(() => {
        // Jika network gagal dan file tidak ada di cache (misal navigasi halaman baru)
        return caches.match('/offline.html');
      });
    })
  );
});