import { NextResponse } from "next/server";
import crypto from "crypto";
import { Resend } from "resend";
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

    // Security ke liye same response denge agar email registered nahi hai
    if (!user) {
      return NextResponse.json(
        {
          message:
            "If an account exists with this email, a password reset link has been sent.",
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

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;

    const resetUrl =
      `${baseUrl}/reset-password?token=${resetToken}`;

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { error: emailError } = await resend.emails.send({
      from: "Ecommerce Store <onboarding@resend.dev>",
      to: [normalizedEmail],
      subject: "Reset your password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h2>Reset your password</h2>

          <p>Hello ${user.name},</p>

          <p>
            We received a request to reset your password.
          </p>

          <p>
            Click the button below to create a new password:
          </p>

          <a
            href="${resetUrl}"
            style="
              display: inline-block;
              padding: 12px 24px;
              background-color: #155e4a;
              color: white;
              text-decoration: none;
              border-radius: 999px;
              font-weight: bold;
            "
          >
            Reset Password
          </a>

          <p style="margin-top: 20px;">
            This reset link will expire in 1 hour.
          </p>

          <p>
            If you did not request a password reset, you can ignore this email.
          </p>
        </div>
      `,
    });

    if (emailError) {
      console.error("Resend reset email error:", emailError);

      user.resetPasswordToken = undefined;
      user.resetPasswordTokenExpires = undefined;

      await user.save();

      return NextResponse.json(
        {
          message:
            "Password reset email could not be sent. Please try again.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message:
          "Password reset link has been sent to your email.",
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