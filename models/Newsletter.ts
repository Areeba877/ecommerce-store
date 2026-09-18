import mongoose, { Model, Schema } from "mongoose";

export type NewsletterDocument = {
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
};

const NewsletterSchema = new Schema<NewsletterDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Newsletter: Model<NewsletterDocument> =
  mongoose.models.Newsletter ||
  mongoose.model<NewsletterDocument>(
    "Newsletter",
    NewsletterSchema
  );

export default Newsletter;