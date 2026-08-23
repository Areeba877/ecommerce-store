import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

// GET all products
export async function GET() {
  try {
    await connectDB();

    const products = await Product.find().sort({ createdAt: -1 });

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("GET products error:", error);

    return NextResponse.json(
      { message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST create product
export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

    const product = await Product.create({
      name: body.name,
      category: body.category,
      price: body.price,
      oldPrice: body.oldPrice,
      image: body.image,
      badge: body.badge,
      brand: body.brand,
      collection: body.collection,
      type: body.type,
      stock: body.stock,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("POST product error:", error);

    return NextResponse.json(
      { message: "Failed to create product" },
      { status: 500 }
    );
  }
}