import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { Resend } from "resend";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email and password are required." },
        { status: 400 }
      );
    }

    await connectDB();

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const verificationTokenExpires = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    );

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      isVerified: false,
      verificationToken,
      verificationTokenExpires,
    });

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;

    const verificationUrl =
      `${baseUrl}/api/auth/verify-email?token=${verificationToken}`;

    const { error: emailError } = await resend.emails.send({
      from: "Ecommerce Store <onboarding@resend.dev>",
      to: [normalizedEmail],
      subject: "Verify your email",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h2>Your account has been created!</h2>

          <p>Hello ${name.trim()},</p>

          <p>
            Please verify your email address to activate your account.
          </p>

          <a
            href="${verificationUrl}"
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
            Verify Email
          </a>

          <p style="margin-top: 20px;">
            This verification link will expire in 24 hours.
          </p>
        </div>
      `,
    });

    if (emailError) {
      console.error("Resend email error:", emailError);

      await User.findByIdAndDelete(user._id);

      return NextResponse.json(
        { message: "Account could not be created because verification email failed." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message:
          "Your account has been created. Please verify your email.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);

    return NextResponse.json(
      { message: "Something went wrong during signup." },
      { status: 500 }
    );
  }
}