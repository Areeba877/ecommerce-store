import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { jwtVerify } from "jose";

import Order from "@/models/Order";
import Product from "@/models/Product";
import Cart from "@/models/Cart";
import { connectDB } from "@/lib/mongodb";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("Please define JWT_SECRET in .env.local");
}

const secret = new TextEncoder().encode(JWT_SECRET);

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get JWT from cookie
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    // Verify JWT
    let payload;

    try {
      const verified = await jwtVerify(token, secret);
      payload = verified.payload;
    } catch {
      return NextResponse.json(
        { message: "Invalid or expired authentication token" },
        { status: 401 }
      );
    }

    const userId = payload.userId;

    if (
      typeof userId !== "string" ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return NextResponse.json(
        { message: "Invalid user information" },
        { status: 401 }
      );
    }

    // Get only this user's orders
    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("items.product", "name image price");

    return NextResponse.json(
      {
        message: "Orders fetched successfully",
        orders,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch orders error:", error);

    return NextResponse.json(
      { message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Get JWT from cookie
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    // Verify JWT
    let payload;

    try {
      const verified = await jwtVerify(token, secret);
      payload = verified.payload;
    } catch {
      return NextResponse.json(
        { message: "Invalid or expired authentication token" },
        { status: 401 }
      );
    }

    const userId = payload.userId;

    if (
      typeof userId !== "string" ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return NextResponse.json(
        { message: "Invalid user information" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      customerName,
      customerEmail,
      phone,
      shippingAddress,
      paymentMethod,
    } = body;

    // Validate required fields
    if (
      !customerName ||
      !customerEmail ||
      !phone ||
      !shippingAddress?.address ||
      !shippingAddress?.city ||
      !shippingAddress?.postalCode ||
      !shippingAddress?.country ||
      !paymentMethod
    ) {
      return NextResponse.json(
        { message: "All required order fields must be provided" },
        { status: 400 }
      );
    }

    if (!["cod", "card"].includes(paymentMethod)) {
      return NextResponse.json(
        { message: "Invalid payment method" },
        { status: 400 }
      );
    }

    // Find user's cart
    const cart = await Cart.findOne({ user: userId });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { message: "Cart is empty" },
        { status: 400 }
      );
    }

    const orderItems = [];
    let subtotal = 0;

    // Get current product information from database
    for (const cartItem of cart.items) {
      const product = await Product.findById(cartItem.product);

      if (!product) {
        return NextResponse.json(
          {
            message: `Product not found: ${cartItem.product}`,
          },
          { status: 404 }
        );
      }

      const itemTotal = product.price * cartItem.quantity;

      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: cartItem.quantity,
      });
    }

    const shipping = 0;
    const total = subtotal + shipping;

    // Create order
    const order = await Order.create({
      user: userId,
      customerName,
      customerEmail,
      phone,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      subtotal,
      shipping,
      total,
      status: "pending",
    });

    // Empty cart after successful order
    await Cart.findOneAndUpdate(
      { user: userId },
      { $set: { items: [] } }
    );

    return NextResponse.json(
      {
        message: "Order created successfully",
        order,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create order error:", error);

    return NextResponse.json(
      { message: "Failed to create order" },
      { status: 500 }
    );
  }
}