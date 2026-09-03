import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { jwtVerify } from "jose";
import Stripe from "stripe";

import { connectDB } from "@/lib/mongodb";
import Cart from "@/models/Cart";
import Product from "@/models/Product";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("Please define JWT_SECRET in .env.local");
}

const secret = new TextEncoder().encode(JWT_SECRET);

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

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
    } = body;

    if (
      !customerName ||
      !customerEmail ||
      !phone ||
      !shippingAddress?.address ||
      !shippingAddress?.city ||
      !shippingAddress?.postalCode ||
      !shippingAddress?.country
    ) {
      return NextResponse.json(
        { message: "All customer and shipping fields are required" },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { message: "Cart is empty" },
        { status: 400 }
      );
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const cartItem of cart.items) {
      const product = await Product.findById(cartItem.product);

      if (!product) {
        return NextResponse.json(
          { message: `Product not found: ${cartItem.product}` },
          { status: 404 }
        );
      }

      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: product.image.startsWith("http")
              ? [product.image]
              : undefined,
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: cartItem.quantity,
      });
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,

      customer_email: customerEmail,

      phone_number_collection: {
        enabled: true,
      },

      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${baseUrl}/checkout?payment=cancelled`,

      metadata: {
        userId,
        customerName,
        customerEmail,
        phone,
        address: shippingAddress.address,
        city: shippingAddress.city,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country,
      },

      billing_address_collection: "auto",
    });

    return NextResponse.json(
      {
        message: "Stripe Checkout session created",
        url: session.url,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Stripe Checkout error:", error);

    return NextResponse.json(
      { message: "Failed to create Stripe Checkout session" },
      { status: 500 }
    );
  }
}