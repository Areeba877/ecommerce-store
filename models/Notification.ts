import mongoose, { Model, Schema } from "mongoose";

export type NotificationDocument = {
  recipient?: mongoose.Types.ObjectId;
  recipientRole: "user" | "admin";
  title: string;
  message: string;
  type:
    | "order"
    | "order_status"
    | "promotion"
    | "system";
  link?: string;
  isRead: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

const NotificationSchema = new Schema<NotificationDocument>(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    recipientRole: {
      type: String,
      enum: ["user", "admin"],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "order",
        "order_status",
        "promotion",
        "system",
      ],
      required: true,
    },

    link: {
      type: String,
      trim: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Notification: Model<NotificationDocument> =
  mongoose.models.Notification ||
  mongoose.model<NotificationDocument>(
    "Notification",
    NotificationSchema
  );

export default Notification;