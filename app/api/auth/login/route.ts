import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
      );
    }

    const response = NextResponse.json(
      { message: "Logged in successfully!", user: { email } },
      { status: 200 }
    );

    response.cookies.set("token", "user_logged_in_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, 
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: "Server error during login." },
      { status: 500 }
    );
  }
}