// Service worker CRM LQ: halaman tetap bisa dibuka saat sinyal lemah (memakai salinan terakhir).
// Data (Firebase, n8n) tidak disimpan di sini; selalu diambil langsung dari internet.
const CACHE = 'crm-lq-v1';
const SHELL = ['/admin/crm-rekrutmen.html', '/admin/crm-icon-192.png', '/admin/crm-manifest.webmanifest'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin || !u.pathname.startsWith('/admin/crm')) return;
  // Utamakan versi terbaru dari internet; kalau gagal, pakai salinan tersimpan.
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; })
    .catch(() => caches.match(e.request, { ignoreSearch: true })));
});
