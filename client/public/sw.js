/* eslint-disable no-restricted-globals */
const CACHE_NAME = 'medidosecare-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'MediDoseCare Reminder';
  const options = {
    body: data.body || 'It is time for your medicine.',
    icon: '/logo192.png',
    badge: '/logo192.png',
    vibrate: [200, 100, 200, 100, 200, 100, 400],
    data: {
      url: data.url || '/home'
    }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(event.notification.data.url);
    })
  );
});
