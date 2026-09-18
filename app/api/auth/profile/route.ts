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

export async function PATCH(request: NextRequest) {
  try {
    // Get authentication token
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 }
      );
    }

    // Verify token
    const { payload } = await jwtVerify(token, secret);

    if (!payload.userId) {
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 }
      );
    }

    // Get request body
    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    // Validate name
    if (!name) {
      return NextResponse.json(
        { message: "Name is required." },
        { status: 400 }
      );
    }

    if (name.length < 2) {
      return NextResponse.json(
        { message: "Name must be at least 2 characters long." },
        { status: 400 }
      );
    }

    if (name.length > 50) {
      return NextResponse.json(
        { message: "Name must be less than 50 characters." },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Update user
    const user = await User.findByIdAndUpdate(
      payload.userId,
      {
        name,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("name email role");

    if (!user) {
      return NextResponse.json(
        { message: "User not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Profile updated successfully.",
        user: {
          userId: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Profile update error:", error);

    return NextResponse.json(
      {
        message: "Failed to update profile.",
      },
      { status: 500 }
    );
  }
}