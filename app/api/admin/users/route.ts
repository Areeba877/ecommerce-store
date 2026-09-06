import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getAdminUser } from "@/lib/adminAuth";
import User from "@/models/User";

export async function GET(request: Request) {
  try {
    const admin = await getAdminUser();

    if (!admin) {
      return NextResponse.json(
        { message: "Unauthorized. Admin access required." },
        { status: 403 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim() || "";

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const users = await User.find(query)
      .select("_id name email role isVerified createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error("Admin users error:", error);

    return NextResponse.json(
      { message: "Failed to load users." },
      { status: 500 }
    );
  }
}