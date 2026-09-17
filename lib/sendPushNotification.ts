import { getFirebaseAdminMessaging } from "@/lib/firebase-admin";

type SendPushNotificationInput = {
  tokens: string[];
  title: string;
  body: string;
  link?: string;
};

export async function sendPushNotification({
  tokens,
  title,
  body,
  link,
}: SendPushNotificationInput) {
  if (!tokens.length) {
    return {
      successCount: 0,
      failureCount: 0,
    };
  }

  const messaging = getFirebaseAdminMessaging();

  const response =
    await messaging.sendEachForMulticast({
      tokens,
      notification: {
        title,
        body,
      },
      data: {
        link: link || "",
      },
      webpush: {
        fcmOptions: {
          link: link || "/",
        },
      },
    });

  return {
    successCount: response.successCount,
    failureCount: response.failureCount,
  };
}