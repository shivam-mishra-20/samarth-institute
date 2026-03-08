/* eslint-disable no-undef */
// Firebase Messaging Service Worker
// Handles background push notifications via FCM

importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js"
);

// Firebase project config - must be hardcoded here (service worker cannot access env variables)
firebase.initializeApp({
  apiKey: "AIzaSyDE-Li_oWe6PcKLQlCC1EzBD1kybv68D7Q",
  authDomain: "samarth-project-fec8a.firebaseapp.com",
  projectId: "samarth-project-fec8a",
  storageBucket: "samarth-project-fec8a.firebasestorage.app",
  messagingSenderId: "522814374986",
  appId: "1:522814374986:web:140254523e78cb0e3cd2b3",
});

const messaging = firebase.messaging();

// Handle background messages (app is not in focus)
messaging.onBackgroundMessage((payload) => {
  console.log("[SW] Background FCM message received:", payload);

  const notificationTitle =
    payload.notification?.title || "Samarth LMS – New Announcement";
  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: payload.notification?.icon || "/favicon.ico",
    badge: "/favicon.ico",
    tag: payload.data?.announcementId || "samarth-lms-notification",
    requireInteraction: payload.data?.priority === "high",
    data: {
      url: payload.data?.url || "/announcements",
      announcementId: payload.data?.announcementId,
      type: payload.data?.type,
    },
    actions: [{ action: "view", title: "View Announcement" }],
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click — navigate to /announcements
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/announcements";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        for (const client of windowClients) {
          if (
            client.url.includes(self.location.origin) &&
            "focus" in client
          ) {
            client.focus();
            client.navigate(targetUrl);
            return;
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
  );
});
