importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyCb8yPwd3fmaE10PZToyoGggU_x85Mysn4",
  authDomain: "shopcart-36a36.firebaseapp.com",
  projectId: "shopcart-36a36",
  storageBucket: "shopcart-36a36.firebasestorage.app",
  messagingSenderId: "78520504935",
  appId: "1:78520504935:web:8ef256a58056584ef3bac2",
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