"use client";

import { useEffect } from "react";
import {
  getToken,
  onMessage,
} from "firebase/messaging";
import { getFirebaseMessaging } from "@/lib/firebase";

export default function FCMNotifications() {
  useEffect(() => {
    const setupFCM = async () => {
      try {
        if (!("Notification" in window)) {
          return;
        }

        const permission = await Notification.requestPermission();

        if (permission !== "granted") {
          console.log("Notification permission not granted.");
          return;
        }

        const messaging = await getFirebaseMessaging();

        if (!messaging) {
          console.log("Firebase Messaging is not supported.");
          return;
        }

        const registration =
          await navigator.serviceWorker.register(
            "/firebase-messaging-sw.js"
          );

        const vapidKey =
          process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

        if (!vapidKey) {
          console.error("Firebase VAPID key is missing.");
          return;
        }

        const fcmToken = await getToken(messaging, {
          vapidKey,
          serviceWorkerRegistration: registration,
        });

        onMessage(messaging, (payload) => {
  const title =
    payload.notification?.title || "ShopCart";

  const body =
    payload.notification?.body ||
    "You have a new notification.";

  if (Notification.permission === "granted") {
    new Notification(title, {
      body,
      icon: "/icon.png",
    });
  }
});

        if (!fcmToken) {
          console.log("FCM token was not generated.");
          return;
        }

        const response = await fetch(
          "/api/notifications/fcm-token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fcmToken,
            }),
          }
        );

        const responseText = await response.text();

        let data: {
          message?: string;
          error?: string;
        } = {};

        if (responseText) {
          try {
            data = JSON.parse(responseText);
          } catch {
            console.error(
              "FCM token API returned invalid response:",
              responseText
            );
          }
        }

        if (!response.ok) {
  console.log("========== FCM TOKEN ERROR ==========");
  console.log("Status:", response.status);
  console.log("Status Text:", response.statusText);
  console.log("Raw Response:", responseText);
  console.log("Parsed Data:", JSON.stringify(data));
  console.log("====================================");
  return;
}

        console.log("FCM token saved successfully.");
      } catch (error) {
        console.error("FCM setup error:", error);
      }
    };

    setupFCM();
  }, []);

  return null;
}