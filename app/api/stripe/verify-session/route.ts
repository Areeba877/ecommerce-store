import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { jwtVerify } from "jose";
import Stripe from "stripe";

import { connectDB } from "@/lib/mongodb";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import Order from "@/models/Order";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("Please define JWT_SECRET in .env.local");
}

const secret = new TextEncoder().encode(JWT_SECRET);

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Get logged-in user's token
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

    // Get Stripe session ID
    const body = await request.json();
    const sessionId = body.sessionId;

    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json(
        { message: "Stripe session ID is required" },
        { status: 400 }
      );
    }

    // Retrieve session directly from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);


    // Make sure this payment belongs to this user
    if (session.metadata?.userId !== userId) {
      return NextResponse.json(
        { message: "Unauthorized payment session" },
        { status: 403 }
      );
    }

    // Confirm payment
    if (session.payment_status !== "paid") {
      return NextResponse.json(
        {
          message: "Payment has not been completed",
          paymentStatus: session.payment_status,
        },
        { status: 400 }
      );
    }

    // Prevent duplicate order
    const existingOrder = await Order.findOne({
      stripeSessionId: session.id,
    });

    if (existingOrder) {
      return NextResponse.json(
        {
          message: "Payment already verified",
          order: existingOrder,
        },
        { status: 200 }
      );
    }

    // Get user's cart
    const cart = await Cart.findOne({ user: userId });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { message: "Cart is empty" },
        { status: 400 }
      );
    }

    // Build order items from database
    const orderItems = [];

    let subtotal = 0;

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

    // Make sure Stripe amount matches database cart total
    if (session.amount_total !== Math.round(total * 100)) {
      return NextResponse.json(
        {
          message: "Payment amount does not match the current cart total",
        },
        { status: 400 }
      );
    }

    // Get customer information from Stripe metadata
    const metadata = session.metadata;

    if (
      !metadata?.customerName ||
      !metadata?.customerEmail ||
      !metadata?.phone ||
      !metadata?.address ||
      !metadata?.city ||
      !metadata?.postalCode ||
      !metadata?.country
    ) {
      return NextResponse.json(
        { message: "Customer information is missing" },
        { status: 400 }
      );
    }

    // Create order
    const order = await Order.create({
      user: userId,

      customerName: metadata.customerName,
      customerEmail: metadata.customerEmail,
      phone: metadata.phone,

      stripeSessionId: session.id,

      paymentIntentId:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : undefined,

      items: orderItems,

      shippingAddress: {
        address: metadata.address,
        city: metadata.city,
        postalCode: metadata.postalCode,
        country: metadata.country,
      },

      paymentMethod: "card",

      subtotal,
      shipping,
      total,

      status: "processing",
    });

    // Clear cart only after payment is verified
    cart.items = [];
    await cart.save();

    return NextResponse.json(
      {
        message: "Payment verified and order created successfully",
        order,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Stripe payment verification error:", error);

    return NextResponse.json(
      {
        message: "Failed to verify Stripe payment",
      },
      { status: 500 }
    );
  }
}