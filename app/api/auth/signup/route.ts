import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import transporter from "@/lib/nodemailer";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

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
    const trimmedName = name.trim();

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

    const verificationCode = crypto
      .randomInt(100000, 1000000)
      .toString();

    const verificationCodeExpires = new Date(
      Date.now() + 10 * 60 * 1000
    );

    const user = await User.create({
      name: trimmedName,
      email: normalizedEmail,
      password: hashedPassword,
      isVerified: false,
      verificationCode,
      verificationCodeExpires,
    });

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: normalizedEmail,
        subject: "Your verification code",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
            <h2>Verify your email</h2>

            <p>Hello ${trimmedName},</p>

            <p>Your 6-digit verification code is:</p>

            <div style="
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 8px;
              margin: 24px 0;
            ">
              ${verificationCode}
            </div>

            <p>This code will expire in 10 minutes.</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Nodemailer email error:", emailError);

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
          "Account created successfully. Please check your email for the verification code.",
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