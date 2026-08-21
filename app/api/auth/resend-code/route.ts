import { NextResponse } from "next/server";
import { Resend } from "resend";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

const resend = new Resend(process.env.RESEND_API_KEY);

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
        { message: "Account not found." },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        { message: "Email is already verified." },
        { status: 400 }
      );
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const verificationCodeExpires = new Date(
      Date.now() + 60 * 1000
    );

    user.verificationCode = verificationCode;
    user.verificationCodeExpires = verificationCodeExpires;

    await user.save();

    const { error: emailError } = await resend.emails.send({
      from: "Ecommerce Store <onboarding@resend.dev>",
      to: [normalizedEmail],
      subject: "Your new verification code",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Verify your email</h2>

          <p>Your new 6-digit verification code is:</p>

          <div style="
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            margin: 24px 0;
          ">
            ${verificationCode}
          </div>

          <p>This code will expire in 1 minute.</p>
        </div>
      `,
    });

    if (emailError) {
      console.error("Resend code email error:", emailError);

      return NextResponse.json(
        { message: "Failed to send verification code." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "A new verification code has been sent." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Resend code error:", error);

    return NextResponse.json(
      { message: "Something went wrong." },
      { status: 500 }
    );
  }
}