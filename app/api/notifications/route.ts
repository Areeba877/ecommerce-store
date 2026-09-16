import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

import { connectDB } from "@/lib/mongodb";
import { createNotification } from "@/lib/notifications";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("Please define JWT_SECRET in .env.local");
}

const secret = new TextEncoder().encode(JWT_SECRET);

async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, secret);

    if (!payload.userId || !payload.role) {
      return null;
    }

    return {
      userId: payload.userId as string,
      role: payload.role as "user" | "admin",
    };
  } catch {
    return null;
  }
}

// GET /api/notifications
export async function GET() {
  try {
    const authUser = await getAuthUser();

    if (!authUser) {
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 }
      );
    }

    await connectDB();

    const Notification = (
      await import("@/models/Notification")
    ).default;

    let notifications;

    if (authUser.role === "admin") {
      notifications = await Notification.find({
        recipientRole: "admin",
      })
        .sort({ createdAt: -1 })
        .limit(50);
    } else {
      notifications = await Notification.find({
        recipient: authUser.userId,
        recipientRole: "user",
      })
        .sort({ createdAt: -1 })
        .limit(50);
    }

    return NextResponse.json(
      {
        notifications,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET notifications error:", error);

    return NextResponse.json(
      { message: "Failed to fetch notifications." },
      { status: 500 }
    );
  }
}

// POST /api/notifications
// Admin only
export async function POST(request: Request) {
  try {
    const authUser = await getAuthUser();

    if (!authUser) {
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 }
      );
    }

    if (authUser.role !== "admin") {
      return NextResponse.json(
        { message: "Admin access required." },
        { status: 403 }
      );
    }

    const body = await request.json();

    const {
      recipient,
      recipientRole,
      title,
      message,
      type,
      link,
    } = body;

    if (!title || !message || !type) {
      return NextResponse.json(
        {
          message: "Title, message and type are required.",
        },
        { status: 400 }
      );
    }

    if (
      ![
        "order",
        "order_status",
        "promotion",
        "system",
      ].includes(type)
    ) {
      return NextResponse.json(
        {
          message: "Invalid notification type.",
        },
        { status: 400 }
      );
    }

    if (!["user", "admin"].includes(recipientRole)) {
      return NextResponse.json(
        {
          message: "Invalid recipient role.",
        },
        { status: 400 }
      );
    }

    if (recipientRole === "user" && !recipient) {
      return NextResponse.json(
        {
          message:
            "Recipient is required for user notifications.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    // Create notification in MongoDB
    // and send realtime notification through Pusher
    const notification = await createNotification({
      recipient:
        recipientRole === "user"
          ? recipient
          : undefined,
      recipientRole,
      title,
      message,
      type,
      link,
    });

    return NextResponse.json(
      {
        message:
          "Notification created and sent successfully.",
        notification,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "POST notifications error:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to create notification.",
      },
      { status: 500 }
    );
  }
}