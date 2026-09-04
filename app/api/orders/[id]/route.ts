import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { jwtVerify } from "jose";
import "@/models/Product";

import Order from "@/models/Order";
import { connectDB } from "@/lib/mongodb";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("Please define JWT_SECRET in .env.local");
}

const secret = new TextEncoder().encode(JWT_SECRET);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    // Validate order ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid order ID" },
        { status: 400 }
      );
    }

    // Find only the logged-in user's order
    const order = await Order.findOne({
      _id: id,
      user: userId,
    }).populate("items.product", "name image price");

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Order fetched successfully",
        order,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch order error:", error);

    return NextResponse.json(
      { message: "Failed to fetch order" },
      { status: 500 }
    );
  }
}