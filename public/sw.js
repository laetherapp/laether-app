const CACHE = 'aether-v3';
const STATIC = ['/fr', '/en', '/manifest.json', '/fond.png', '/offline.html'];

// ── Messages de notification ──────────────────────────────
const NOTIFS_FR = [
  { title: 'L. Aether', body: 'Tu peux poser ce que tu as porté aujourd'hui.' },
  { title: 'L. Aether', body: 'La journée touche à sa fin.\nQuelque chose de doux t\'attend ici.' },
  { title: 'L. Aether', body: 'Avant de fermer les yeux ce soir,\nun instant rien qu\'à toi.' },
  { title: 'L. Aether', body: 'Ce soir, laisse le silence\nprendre sa place.' },
  { title: 'L. Aether', body: 'Tu as traversé cette journée.\nC\'est déjà quelque chose.' },
  { title: 'L. Aether', body: 'L\'espace est là.\nCalme. Sans attente.' },
  { title: 'L. Aether', body: 'Reviens à toi,\ndoucement.' },
];

const NOTIFS_EN = [
  { title: 'L. Aether', body: 'You can set down what today asked of you.\nThe space is here.' },
  { title: 'L. Aether', body: 'The day is drawing to a close.\nSomething quiet is waiting for you.' },
  { title: 'L. Aether', body: 'Before you close your eyes tonight,\na moment just for you.' },
  { title: 'L. Aether', body: 'This evening, let the silence\nsettle in.' },
  { title: 'L. Aether', body: 'You moved through this day.\nThat is already something.' },
  { title: 'L. Aether', body: 'The space is here.\nCalm. Without expectation.' },
  { title: 'L. Aether', body: 'Come back to yourself,\ngently.' },
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC).catch(() => {})));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (e.request.url.includes('supabase.co') || e.request.url.includes('stripe.com')) return;
  e.respondWith(
    fetch(e.request).then(res => {
      if (res.ok) { const c = res.clone(); caches.open(CACHE).then(cache => cache.put(e.request, c)); }
      return res;
    }).catch(() => caches.match(e.request).then(cached => cached ?? (e.request.mode === 'navigate' ? caches.match('/offline.html') : undefined)))
  );
});

// ── Notification push ──────────────────────────────────────
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  e.waitUntil(
    self.registration.showNotification(data.title || 'L. Aether', {
      body: data.body,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      vibrate: [200, 100, 200],
      data: { url: data.url || '/fr' },
      requireInteraction: false,
      silent: false,
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = e.notification.data?.url || '/fr';
  e.waitUntil(clients.openWindow(url));
});

// ── Notification locale quotidienne à 20h30 ───────────────
// Planification côté client via periodicsync ou setTimeout
self.addEventListener('periodicsync', e => {
  if (e.tag === 'daily-notif') {
    e.waitUntil(sendDailyNotif());
  }
});

async function sendDailyNotif() {
  const lang = (await self.clients.matchAll()).length > 0 ? 'fr' : 'fr';
  const notifs = lang === 'fr' ? NOTIFS_FR : NOTIFS_EN;
  const day = new Date().getDay();
  const notif = notifs[day % notifs.length];
  await self.registration.showNotification(notif.title, {
    body: notif.body,
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    requireInteraction: false,
  });
}
