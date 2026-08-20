import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json(
      {
        message: "Account created successfully!",
        user: { id: "123", name: body.name, email: body.email, isVerified: true },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 400 });
  }
}