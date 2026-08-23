import mongoose, { Schema, Model } from "mongoose";

export type ProductDocument = {
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  badge?: string;
  brand?: string;
  collection?: string;
  type?: string;
  stock?: string;
};

const ProductSchema = new Schema<ProductDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
    },

    oldPrice: {
      type: Number,
    },

    image: {
      type: String,
      required: true,
    },

    badge: {
      type: String,
    },

    brand: {
      type: String,
    },

    collection: {
      type: String,
    },

    type: {
      type: String,
    },

    stock: {
      type: String,
      default: "Available",
    },
  },
  {
    timestamps: true,
  }
);

const Product: Model<ProductDocument> =
  mongoose.models.Product ||
  mongoose.model<ProductDocument>("Product", ProductSchema);

export default Product;