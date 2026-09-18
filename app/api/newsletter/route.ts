import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Newsletter from "@/models/Newsletter";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    if (!email) {
      return NextResponse.json(
        { message: "Email is required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    await connectDB();

    const existingSubscriber = await Newsletter.findOne({
      email,
    });

    if (existingSubscriber) {
      return NextResponse.json(
        {
          message: "You are already subscribed to the newsletter.",
        },
        { status: 409 }
      );
    }

    await Newsletter.create({
      email,
    });

    return NextResponse.json(
      {
        message: "Successfully subscribed to the newsletter.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Newsletter subscription error:", error);

    return NextResponse.json(
      {
        message: "Failed to subscribe to the newsletter.",
      },
      { status: 500 }
    );
  }
}