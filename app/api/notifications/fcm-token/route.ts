import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("Please define JWT_SECRET in .env.local");
}

const secret = new TextEncoder().encode(JWT_SECRET);

export async function POST(request: NextRequest) {
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

    if (!payload.userId) {
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { fcmToken } = body;

    if (
      !fcmToken ||
      typeof fcmToken !== "string" ||
      !fcmToken.trim()
    ) {
      return NextResponse.json(
        { message: "FCM token is required." },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findByIdAndUpdate(
      payload.userId,
      {
        $addToSet: {
          fcmTokens: fcmToken.trim(),
        },
      },
      {
        new: true,
      }
    ).select("_id");

    if (!user) {
      return NextResponse.json(
        { message: "User not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "FCM token saved successfully.",
      },
      { status: 200 }
    );
 } catch (error) {
  console.error("Save FCM token error:", error);

  return NextResponse.json(
    {
      message: "Failed to save FCM token.",
      error:
        error instanceof Error
          ? error.message
          : String(error),
    },
    { status: 500 }
  );
}
}