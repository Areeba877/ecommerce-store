import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/adminAuth";

export async function GET() {
  const admin = await getAdminUser();

  if (!admin) {
    return NextResponse.json(
      {
        message: "Unauthorized. Admin access required.",
      },
      { status: 403 }
    );
  }

  return NextResponse.json(
    {
      message: "Admin authorization successful.",
      admin,
    },
    { status: 200 }
  );
}