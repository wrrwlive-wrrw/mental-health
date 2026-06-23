const CACHE_NAME = 'mental-health-v2';
const ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/questions.js',
  './js/app.js',
  './js/chat.js',
  './js/knowledge.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
