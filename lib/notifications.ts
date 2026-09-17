import mongoose from "mongoose";

import pusher from "@/lib/pusher";
import Notification from "@/models/Notification";
import User from "@/models/User";
import { sendPushNotification } from "@/lib/sendPushNotification";

type CreateNotificationInput = {
  recipient?: string;
  recipientRole: "user" | "admin";
  title: string;
  message: string;
  type:
    | "order"
    | "order_status"
    | "promotion"
    | "system";
  link?: string;
};

export async function createNotification({
  recipient,
  recipientRole,
  title,
  message,
  type,
  link,
}: CreateNotificationInput) {
  if (recipientRole === "user") {
    if (
      !recipient ||
      !mongoose.Types.ObjectId.isValid(recipient)
    ) {
      throw new Error(
        "Valid recipient is required for user notification."
      );
    }
  }

  const notification = await Notification.create({
    recipient:
      recipientRole === "user"
        ? new mongoose.Types.ObjectId(recipient)
        : undefined,
    recipientRole,
    title,
    message,
    type,
    link,
    isRead: false,
  });

  const channelName =
    recipientRole === "admin"
      ? "private-admin-notifications"
      : `private-user-${recipient}`;

  await pusher.trigger(
    channelName,
    "notification",
    {
      notification: {
        _id: notification._id.toString(),
        recipient:
          notification.recipient?.toString(),
        recipientRole:
          notification.recipientRole,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        link: notification.link,
        isRead: notification.isRead,
        createdAt: notification.createdAt,
      },
    }
  );

  try {
    let users;

    if (recipientRole === "admin") {
      users = await User.find({
        role: "admin",
        fcmTokens: { $exists: true, $ne: [] },
      }).select("fcmTokens");
    } else {
      users = await User.find({
        _id: recipient,
        fcmTokens: { $exists: true, $ne: [] },
      }).select("fcmTokens");
    }

    const tokens = users.flatMap(
      (user) => user.fcmTokens || []
    );

    if (tokens.length > 0) {
      await sendPushNotification({
        tokens,
        title,
        body: message,
        link,
      });
    }
  } catch (pushError) {
    console.error(
      "Firebase push notification error:",
      pushError
    );
  }

  return notification;
}