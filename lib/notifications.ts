import mongoose from "mongoose";
import pusher from "@/lib/pusher";
import Notification from "@/models/Notification";

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
  // User notification ke liye valid recipient required hai
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

  // MongoDB mein notification create karo
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

  // Admin ya specific user ka Pusher channel
  const channelName =
    recipientRole === "admin"
      ? "private-admin-notifications"
      : `private-user-${recipient}`;

  // Realtime notification send karo
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

        createdAt:
          notification.createdAt,
      },
    }
  );

  return notification;
}