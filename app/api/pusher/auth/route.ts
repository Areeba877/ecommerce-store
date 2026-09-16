import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import mongoose from "mongoose";

import pusher from "@/lib/pusher";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("Please define JWT_SECRET in .env.local");
}

const secret = new TextEncoder().encode(JWT_SECRET);

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 }
      );
    }

    const { payload } = await jwtVerify(token, secret);

    const userId = payload.userId as string;
    const role = payload.role as string;

    const formData = await request.formData();

    const socketId = formData.get("socket_id")?.toString();
    const channelName = formData.get("channel_name")?.toString();

    if (!socketId || !channelName) {
      return NextResponse.json(
        { message: "Missing socket_id or channel_name." },
        { status: 400 }
      );
    }

    // Admin notification channel
    if (channelName === "private-admin-notifications") {
      if (role !== "admin") {
        return NextResponse.json(
          { message: "Forbidden." },
          { status: 403 }
        );
      }

      const authResponse = pusher.authorizeChannel(
        socketId,
        channelName
      );

      return NextResponse.json(authResponse);
    }

    // User notification channel
    if (channelName.startsWith("private-user-")) {
      const notificationUserId = channelName.replace(
        "private-user-",
        ""
      );

      if (!mongoose.Types.ObjectId.isValid(notificationUserId)) {
        return NextResponse.json(
          { message: "Invalid user ID." },
          { status: 400 }
        );
      }

      if (notificationUserId !== userId) {
        return NextResponse.json(
          { message: "Forbidden." },
          { status: 403 }
        );
      }

      const authResponse = pusher.authorizeChannel(
        socketId,
        channelName
      );

      return NextResponse.json(authResponse);
    }

    // Existing order notification channel
    if (channelName.startsWith("private-order-")) {
      const orderId = channelName.replace("private-order-", "");

      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return NextResponse.json(
          { message: "Invalid order ID." },
          { status: 400 }
        );
      }

      await connectDB();

      const order = await Order.findById(orderId).select("user");

      if (!order) {
        return NextResponse.json(
          { message: "Order not found." },
          { status: 404 }
        );
      }

      const isOwner = order.user.toString() === userId;
      const isAdmin = role === "admin";

      if (!isOwner && !isAdmin) {
        return NextResponse.json(
          { message: "Forbidden." },
          { status: 403 }
        );
      }

      const authResponse = pusher.authorizeChannel(
        socketId,
        channelName
      );

      return NextResponse.json(authResponse);
    }

    return NextResponse.json(
      { message: "Invalid channel." },
      { status: 403 }
    );
  } catch (error) {
    console.error("Pusher auth error:", error);

    return NextResponse.json(
      { message: "Pusher authentication failed." },
      { status: 500 }
    );
  }
}