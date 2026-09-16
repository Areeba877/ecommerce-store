import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

import { connectDB } from "@/lib/mongodb";
import Notification from "@/models/Notification";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("Please define JWT_SECRET in .env.local");
}

const secret = new TextEncoder().encode(JWT_SECRET);

type RouteContext = {
  params: Promise<{ id: string }>;
};

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

// PATCH /api/notifications/:id
export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    const authUser = await getAuthUser();

    if (!authUser) {
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const body = await request.json();

    if (typeof body.isRead !== "boolean") {
      return NextResponse.json(
        { message: "isRead must be a boolean." },
        { status: 400 }
      );
    }

    await connectDB();

    let notification;

    if (authUser.role === "admin") {
      notification = await Notification.findOneAndUpdate(
        {
          _id: id,
          recipientRole: "admin",
        },
        {
          isRead: body.isRead,
        },
        {
          new: true,
        }
      );
    } else {
      notification = await Notification.findOneAndUpdate(
        {
          _id: id,
          recipient: authUser.userId,
          recipientRole: "user",
        },
        {
          isRead: body.isRead,
        },
        {
          new: true,
        }
      );
    }

    if (!notification) {
      return NextResponse.json(
        { message: "Notification not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: body.isRead
          ? "Notification marked as read."
          : "Notification marked as unread.",
        notification,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH notification error:", error);

    return NextResponse.json(
      { message: "Failed to update notification." },
      { status: 500 }
    );
  }
}