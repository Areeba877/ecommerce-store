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

    const role =
      payload.role === "admin" ? "admin" : "user";

    return {
      userId: payload.userId as string,
      role,
    };
  } catch {
    return null;
  }
}

// PATCH /api/notifications/read-all
export async function PATCH() {
  try {
    const authUser = await getAuthUser();

    if (!authUser) {
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 }
      );
    }

    await connectDB();

    if (authUser.role === "admin") {
      const result = await Notification.updateMany(
        {
          recipientRole: "admin",
          isRead: false,
        },
        {
          $set: { isRead: true },
        }
      );

      return NextResponse.json(
        {
          message: "All notifications marked as read.",
          updatedCount: result.modifiedCount,
        },
        { status: 200 }
      );
    }

    const result = await Notification.updateMany(
      {
        recipient: authUser.userId,
        recipientRole: "user",
        isRead: false,
      },
      {
        $set: { isRead: true },
      }
    );

    return NextResponse.json(
      {
        message: "All notifications marked as read.",
        updatedCount: result.modifiedCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH read-all notifications error:", error);

    return NextResponse.json(
      { message: "Failed to mark notifications as read." },
      { status: 500 }
    );
  }
}