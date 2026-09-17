importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  authDomain: "shopcart-36a36.firebaseapp.com",
  projectId: "shopcart-36a36",
  storageBucket: "shopcart-36a36.firebasestorage.app",
  messagingSenderId: "78520504935",
  appId: "YOUR_APP_ID",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle =
    payload.notification?.title || "ShopCart";

  const notificationOptions = {
    body:
      payload.notification?.body ||
      "You have a new notification.",
    icon: "/icon.png",
  };

  self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});