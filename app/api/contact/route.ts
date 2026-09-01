import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ContactMessage from "@/models/ContactMessage";

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

    const {
      fullName,
      email,
      orderNumber,
      subject,
      message,
    } = body;

    if (!fullName || !email || !subject || !message) {
      return NextResponse.json(
        {
          success: false,
          message: "Please fill in all required fields.",
        },
        { status: 400 }
      );
    }

    if (message.trim().length < 10) {
      return NextResponse.json(
        {
          success: false,
          message: "Message must be at least 10 characters long.",
        },
        { status: 400 }
      );
    }

    const newMessage = await ContactMessage.create({
      fullName,
      email,
      orderNumber: orderNumber || "",
      subject,
      message,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Your message has been sent successfully!",
        data: {
          id: newMessage._id,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact form error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}