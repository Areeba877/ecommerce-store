import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { createNotification } from "@/lib/notifications";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("Please define JWT_SECRET in .env.local");
}

const secret = new TextEncoder().encode(JWT_SECRET);

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 }
      );
    }

    // Verify JWT
    const { payload } = await jwtVerify(token, secret);

    if (!payload.userId || payload.role !== "admin") {
      return NextResponse.json(
        { message: "Admin access required." },
        { status: 403 }
      );
    }

    // Read request body
    const body = await request.json();

    const title =
      typeof body.title === "string"
        ? body.title.trim()
        : "";

    const message =
      typeof body.message === "string"
        ? body.message.trim()
        : "";

    const link =
      typeof body.link === "string"
        ? body.link.trim()
        : "";

    // Validation
    if (!title || !message) {
      return NextResponse.json(
        {
          message: "Title and message are required.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    // Get all users
    const users = await User.find({
      role: "user",
    }).select("_id");

    if (users.length === 0) {
      return NextResponse.json(
        {
          message: "No users found.",
        },
        { status: 404 }
      );
    }

    let successCount = 0;
    let failureCount = 0;

    // Send promotion to every user
    for (const user of users) {
      try {
        await createNotification({
          recipient: user._id.toString(),
          recipientRole: "user",
          title,
          message,
          type: "promotion",
          link: link || "/",
        });

        successCount++;
      } catch (error) {
        failureCount++;

        console.error(
          `Promotion notification failed for user ${user._id}:`,
          error
        );
      }
    }

    return NextResponse.json(
      {
        message: "Promotional notification sent successfully.",
        totalUsers: users.length,
        successCount,
        failureCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Promotional notification error:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to send promotional notification.",
      },
      { status: 500 }
    );
  }
}