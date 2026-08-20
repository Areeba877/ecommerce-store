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

    // Generate 6-digit verification code
    const verificationCode = crypto
      .randomInt(100000, 1000000)
      .toString();

    // Code valid for 10 minutes
    const verificationCodeExpires = new Date(
      Date.now() + 10 * 60 * 1000
    );

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      isVerified: false,
      verificationCode,
      verificationCodeExpires,
    });

    // Send 6-digit code through Resend
    const { error: emailError } = await resend.emails.send({
      from: "Ecommerce Store <onboarding@resend.dev>",
      to: [normalizedEmail],
      subject: "Your email verification code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px;">
          <h2 style="color: #123b2a;">
            Verify your email
          </h2>

          <p>
            Hello ${name.trim()},
          </p>

          <p>
            Your 6-digit verification code is:
          </p>

          <div
            style="
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 8px;
              color: #155e4a;
              margin: 25px 0;
            "
          >
            ${verificationCode}
          </div>

          <p>
            Enter this code on the verification page to activate your account.
          </p>

          <p style="color: #777;">
            This code will expire in 10 minutes.
          </p>
        </div>
      `,
    });

    if (emailError) {
      console.error("Resend email error:", emailError);

      await User.findByIdAndDelete(user._id);

      return NextResponse.json(
        {
          message:
            "Account could not be created because verification email failed.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message:
          "Your account has been created. Please check your email for the 6-digit verification code.",
        email: normalizedEmail,
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