import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required." },
        { status: 400 }
      );
    }

    await connectDB();

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return NextResponse.json(
        {
          message:
            "If an account exists with this email, a password reset link has been created.",
        },
        { status: 200 }
      );
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpires = new Date(
      Date.now() + 60 * 60 * 1000
    );

    await user.save();

    const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;

    console.log("PASSWORD RESET URL:", resetUrl);

   return NextResponse.json(
  {
    message: "Reset link created.",
    resetUrl: resetUrl,
  },
  { status: 200 }
);

  } catch (error) {
    console.error("Forgot password error:", error);

    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}