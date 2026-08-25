import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

import mongoose from "mongoose";
import Product from "@/models/Product";
import { products } from "@/components/products";

async function seedProducts() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not loaded");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    const formattedProducts = products.map((product) => ({
      name: product.name,
      category: product.category,
      price: Number(product.price.replace(/[$,]/g, "")),
      oldPrice: product.oldPrice
        ? Number(product.oldPrice.replace(/[$,]/g, ""))
        : undefined,
      image: product.image,
      badge: product.badge,
      brand: product.brand,
      collection: product.collection,
      type: product.type,
      stock: product.stock,
    }));

    await Product.deleteMany({});
    await Product.insertMany(formattedProducts);

    console.log(`✅ ${formattedProducts.length} products seeded successfully`);

    await mongoose.disconnect();
  } catch (error) {
    console.error("❌ Product seeding failed:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seedProducts();