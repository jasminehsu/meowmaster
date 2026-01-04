// --- Service Worker ---
// 這份檔案讓網頁即使在離線時也能運作，是 PWA 的必備元件。

const CACHE_NAME = 'meow-moment-v1';
const urlsToCache = [
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap',
  './icons/gentle.svg',
  './icons/focus.svg',
  './icons/brave.svg',
  './icons/sleep.svg',
  './icons/wise.svg'
];

// 1. 安裝事件 (Install): 快取必要的檔案
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('已開啟快取 (Cache Opened)');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. 請求攔截 (Fetch): 優先使用快取內容，沒網也能開
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果快取中有，就直接回傳快取
        if (response) {
          return response;
        }
        // 否則才去網路下載
        return fetch(event.request);
      })
  );
});

// 3. 啟用事件 (Activate): 清理舊的快取
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});